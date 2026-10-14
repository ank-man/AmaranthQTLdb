#!/usr/bin/env python3
"""Physical meta-QTL and multi-trait clusters for Amaranthus.

No published meta-QTL analysis exists for any Amaranthus species (searched Europe PMC, Crossref
and the web, October 2026), so this builds one from the curated loci.

Scope: loci placed on the A. hypochondriacus v2.x reference. Positions published on v2.2 are first
converted to v2.0/v2.1 (PGA2) through scripts/liftover.py (data/curated/coordinates_lifted.csv), so
every study is on one axis; if the conversion is not available the v2.2 position is used as is.
Loci on other species' assemblies cannot be put on this axis and are left out.

Method (the meta-analysis model of Goffinet & Gerber 2000, as implemented in BioMercator,
applied to physical positions):
  1. Harmonise traits into trait groups (TRAIT_GROUP).
  2. Per study x trait group x chromosome, merge the study's loci lying within MERGE_BP into one
     observation, so each study contributes one independent observation per locus (repeated
     trials and models of the same study are not independent evidence).
     Position = precision-weighted mean; SD from the reported interval (interval / 3.92 for a
     support interval) or, for a single SNP, LD_SD; never below SD_FLOOR.
  3. Fit Gaussian mixtures with k = 1..n components in which each observation keeps its own
     variance, by EM; choose k by BIC.
  4. Keep components supported by >= MIN_STUDIES independent studies as meta-QTL.
     Consensus position = precision-weighted mean; 95% CI = +-1.96 * sqrt(1 / sum(1/sd^2)).

Multi-trait clusters: windows where loci of >= 2 different trait groups overlap (a single SNP
counts as +-CLUSTER_BP/2). Only significant loci are used (the 0.001 < P <= 0.01 suggestive MTAs
are left out), and a cluster is kept when it is supported by >= 2 studies or contains a QTL from a
mapping population. They are candidate pleiotropic / linked regions, listed separately from
meta-QTL because they are not replicated loci of one trait.

Writes data/curated/meta_qtl.csv, meta_qtl_members.csv, meta_qtl_trait_coverage.csv, qtl_clusters.csv.
Usage: python3 scripts/meta_qtl.py
"""
import csv
import math
import os
from collections import defaultdict

import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CUR = os.path.join(ROOT, "data", "curated")
MERGE_BP = 2_000_000
LD_SD = 1_000_000      # positional SD assumed for a single associated SNP
SD_FLOOR = 250_000
MIN_STUDIES = 2
CLUSTER_BP = 1_000_000

TRAIT_GROUP = {
    "Heading date": "Flowering time", "Anthesis date": "Flowering time", "Days to flowering": "Flowering time",
    "Hypocotyl color": "Betalain pigmentation", "Inflorescence color": "Betalain pigmentation",
    "Stem pigmentation": "Betalain pigmentation", "Leaf pigmentation": "Betalain pigmentation",
    "Petiole pigmentation": "Betalain pigmentation", "Stem color (betalain)": "Betalain pigmentation",
    "Seed coat color": "Seed coat color",
    "Plant height": "Plant height", "Stem diameter": "Stem diameter", "Number of nodes": "Number of nodes",
    "Branching index": "Branching", "Leaf shape": "Leaf shape",
    "Seed albumin": "Seed protein", "Seed globulin": "Seed protein", "Seed glutelin": "Seed protein",
    "Seed total protein": "Seed protein",
    "Grain calcium": "Grain calcium", "Grain iron": "Grain iron", "Grain magnesium": "Grain magnesium",
    "Grain zinc": "Grain zinc", "Seed dormancy": "Seed dormancy",
}
ABBR = {"Flowering time": "FT", "Betalain pigmentation": "BET", "Seed coat color": "SCC", "Plant height": "PH",
        "Stem diameter": "SD", "Number of nodes": "NN", "Branching": "BI", "Leaf shape": "LS", "Seed protein": "PRO",
        "Seed dormancy": "DOR", "Grain calcium": "CA", "Grain iron": "FE", "Grain magnesium": "MG", "Grain zinc": "ZN"}


def f(x):
    try:
        return float(x)
    except (TypeError, ValueError):
        return None


def observation(r):
    s, e, p = f(r["start_bp"]), f(r["end_bp"]), f(r["peak_bp"])
    if s is not None and e is not None:
        pos = p if p is not None else (s + e) / 2
        sd = max((e - s) / 3.92, SD_FLOOR)
    elif p is not None:
        pos, sd = p, LD_SD
    else:
        return None
    return pos, sd


def merge(obs):
    """obs: list of (pos, sd, rec) for one study x group x chromosome -> merged observations."""
    obs = sorted(obs, key=lambda o: o[0])
    groups, cur = [], [obs[0]]
    for o in obs[1:]:
        if o[0] - cur[-1][0] <= MERGE_BP:
            cur.append(o)
        else:
            groups.append(cur)
            cur = [o]
    groups.append(cur)
    out = []
    for g in groups:
        w = np.array([1 / o[1] ** 2 for o in g])
        pos = float(np.sum(w * np.array([o[0] for o in g])) / w.sum())
        sd = max(math.sqrt(1 / w.sum()), SD_FLOOR)
        out.append((pos, sd, [o[2] for o in g]))
    return out


def fit(x, s, k, iters=500):
    """EM for a mixture whose observation variances are known: x_i ~ N(mu_j, s_i^2)."""
    n = len(x)
    order = np.argsort(x)
    mu = np.array([x[order[int((j + 0.5) * n / k)]] for j in range(k)], dtype=float)
    pi = np.full(k, 1 / k)
    ll_old = -np.inf
    for _ in range(iters):
        dens = np.array([[pi[j] * math.exp(-0.5 * ((x[i] - mu[j]) / s[i]) ** 2) / (s[i] * math.sqrt(2 * math.pi))
                          for j in range(k)] for i in range(n)]) + 1e-300
        ll = float(np.sum(np.log(dens.sum(1))))
        g = dens / dens.sum(1, keepdims=True)
        w = g / (s[:, None] ** 2)
        mu = (w * x[:, None]).sum(0) / np.maximum(w.sum(0), 1e-300)
        pi = np.maximum(g.mean(0), 1e-12)
        if abs(ll - ll_old) < 1e-8:
            break
        ll_old = ll
    bic = -2 * ll + (2 * k - 1) * math.log(n)
    return mu, g, bic


def main():
    R = list(csv.DictReader(open(os.path.join(CUR, "loci.csv"))))
    lifted = os.path.join(CUR, "coordinates_lifted.csv")
    if os.path.exists(lifted):
        conv = {x["locus_id"]: x for x in csv.DictReader(open(lifted))
                if x.get("source_assembly", "").startswith("Ahyp") and x.get("source_assembly") != "Ahyp_v2.0"
                and x.get("target_assembly") == "Ahyp_v2.0"
                and x["status"].startswith("ok")}
        n = 0
        for r in R:
            c = conv.get(r["locus_id"])
            if c and c["target_chromosome"].replace("Scaffold_", "").isdigit():
                r["chromosome"] = c["target_chromosome"].replace("Scaffold_", "")
                for a, b in (("start_bp", "target_start"), ("end_bp", "target_end"), ("peak_bp", "target_peak")):
                    if r[a]:
                        r[a] = c[b]
                r["reference_genome"] = f"A. hypochondriacus v2.1 (lifted from {c['source_assembly'].split('_')[1]})"
                n += 1
        print(f"{n} v2.2 / v3 loci placed on v2.0/v2.1 by liftover")
    ah = [r for r in R if r["reference_genome"].startswith("A. hypochondriacus") and r["chromosome"].isdigit()]
    cells = defaultdict(list)
    for r in ah:
        grp = TRAIT_GROUP.get(r["trait"])
        o = observation(r)
        if grp and o:
            cells[(grp, r["chromosome"], r["study_id"])].append((o[0], o[1], r))

    by_gc = defaultdict(list)          # (group, chr) -> merged observations
    for (grp, ch, sid), obs in cells.items():
        for pos, sd, recs in merge(obs):
            by_gc[(grp, ch)].append((pos, sd, sid, recs))

    mqtl, members = [], []
    for (grp, ch), obs in sorted(by_gc.items(), key=lambda kv: (kv[0][0], int(kv[0][1]))):
        if len({o[2] for o in obs}) < MIN_STUDIES:
            continue
        x = np.array([o[0] for o in obs])
        s = np.array([o[1] for o in obs])
        best = min((fit(x, s, k) for k in range(1, len(obs) + 1)), key=lambda t: t[2])
        mu, g, _ = best
        assign = g.argmax(1)
        for j in range(len(mu)):
            idx = [i for i in range(len(obs)) if assign[i] == j and abs(x[i] - mu[j]) <= 3 * s[i]]
            studies = sorted({obs[i][2] for i in idx})
            if len(studies) < MIN_STUDIES:
                continue
            w = 1 / s[idx] ** 2
            pos = float(np.sum(w * x[idx]) / w.sum())
            half = 1.96 * math.sqrt(1 / w.sum())
            mid = f"MQTL-{ABBR[grp]}-{ch}.{len([m for m in mqtl if m['trait_group'] == grp and m['chromosome'] == ch]) + 1}"
            recs = [rec for i in idx for rec in obs[i][3]]
            mqtl.append({
                "meta_qtl": mid, "trait_group": grp, "chromosome": ch,
                "position_bp": int(round(pos)), "ci_start_bp": int(max(0, pos - half)), "ci_end_bp": int(pos + half),
                "studies": len(studies), "study_ids": "; ".join(studies), "observations": len(idx),
                "loci": len(recs), "traits": "; ".join(sorted({r["trait"] for r in recs})),
                "record_types": "; ".join(sorted({r["record_type"] for r in recs})),
                "candidate_genes": "; ".join(sorted({c.strip() for r in recs for c in r["candidate_gene"].split(";") if c.strip()}))[:400],
                "reference_genome": "A. hypochondriacus v2.x",
            })
            for rec in recs:
                members.append({"meta_qtl": mid, "locus_id": rec["locus_id"], "study_id": rec["study_id"],
                                "trait": rec["trait"], "locus_name": rec["locus_name"], "chromosome": rec["chromosome"],
                                "start_bp": rec["start_bp"], "end_bp": rec["end_bp"], "peak_bp": rec["peak_bp"]})

    # trait-group coverage: why a group has or has no meta-QTL
    cov = []
    for grp in sorted(set(TRAIT_GROUP.values())):
        recs = [r for r in ah if TRAIT_GROUP.get(r["trait"]) == grp]
        st = sorted({r["study_id"] for r in recs})
        n = sum(1 for m in mqtl if m["trait_group"] == grp)
        why = "" if n else ("only one study" if len(st) < 2 else "loci of different studies do not coincide")
        cov.append({"trait_group": grp, "loci": len(recs), "studies": len(st), "study_ids": "; ".join(st),
                    "meta_qtl": n, "reason_if_none": why})

    # multi-trait clusters
    pts = []
    for r in ah:
        grp = TRAIT_GROUP.get(r["trait"])
        o = observation(r)
        if not (grp and o) or "0.001 < P" in r["method"]:
            continue
        s, e = f(r["start_bp"]), f(r["end_bp"])
        lo, hi = (s, e) if s is not None else (o[0] - CLUSTER_BP / 2, o[0] + CLUSTER_BP / 2)
        pts.append((r["chromosome"], lo, hi, grp, r))
    clusters = []
    for ch in sorted({p[0] for p in pts}, key=int):
        iv = sorted([p for p in pts if p[0] == ch], key=lambda p: p[1])
        cur = [iv[0]]
        end = iv[0][2]
        for p in iv[1:] + [None]:
            if p is not None and p[1] <= end:
                cur.append(p)
                end = max(end, p[2])
                continue
            groups = sorted({q[3] for q in cur})
            # a cluster needs >= 2 trait groups; an over-long merged span is not informative
            studies = {q[4]["study_id"] for q in cur}
            has_qtl = any(q[4]["record_type"] == "QTL" for q in cur)
            if len(groups) >= 2 and (len(studies) >= 2 or has_qtl) and end - min(q[1] for q in cur) <= 15_000_000:
                clusters.append({
                    "cluster": f"CL-{ch}.{sum(1 for c in clusters if c['chromosome'] == ch) + 1}", "chromosome": ch,
                    "start_bp": max(0, int(min(q[1] for q in cur))), "end_bp": int(end), "trait_groups": "; ".join(groups),
                    "n_trait_groups": len(groups), "loci": len(cur),
                    "studies": "; ".join(sorted({q[4]["study_id"] for q in cur})),
                    "locus_ids": "; ".join(q[4]["locus_id"] for q in cur)})
            if p is not None:
                cur, end = [p], p[2]

    def write(name, rows_, cols):
        with open(os.path.join(CUR, name), "w", newline="") as fh:
            w = csv.DictWriter(fh, cols)
            w.writeheader()
            w.writerows(rows_)

    # the same meta-QTL on the current assembly (v3), through the v2.0 -> v3 alignment of liftover.py
    paf = os.path.join(ROOT, "data", "liftover", "Ahyp_v2.0__Ahyp_v3.paf")
    if os.path.exists(paf) and mqtl:
        import sys
        sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
        from liftover import Lift, chrom_fasta
        L, lab = Lift(paf), chrom_fasta("Ahyp_v3")[1]
        for m in mqtl:
            got = [L.point(f"Scaffold_{m['chromosome']}", int(m[k]) - 1) for k in ("position_bp", "ci_start_bp", "ci_end_bp")]
            ok = all(got) and len({g[0] for g in got}) == 1
            m["v3_chromosome"] = lab.get(got[0][0], got[0][0]) if ok else ""
            m["v3_position_bp"], m["v3_ci_start_bp"], m["v3_ci_end_bp"] = (
                (got[0][1] + 1, min(got[1][1], got[2][1]) + 1, max(got[1][1], got[2][1]) + 1) if ok else ("", "", ""))
    write("meta_qtl.csv", mqtl, list(mqtl[0]) if mqtl else ["meta_qtl"])
    write("meta_qtl_members.csv", members, list(members[0]) if members else ["meta_qtl"])
    write("meta_qtl_trait_coverage.csv", cov, list(cov[0]))
    write("qtl_clusters.csv", clusters, list(clusters[0]) if clusters else ["cluster"])
    for m in mqtl:
        print(f"{m['meta_qtl']:16s} chr{m['chromosome']:>2} {m['position_bp'] / 1e6:7.2f} Mb "
              f"[{m['ci_start_bp'] / 1e6:.2f}-{m['ci_end_bp'] / 1e6:.2f}]  {m['studies']} studies  {m['traits']}")
    print("coverage:")
    for c in cov:
        print(f"  {c['trait_group']:22s} loci={c['loci']:3d} studies={c['studies']} mqtl={c['meta_qtl']} {c['reason_if_none']}")
    print(f"multi-trait clusters: {len(clusters)}")
    for c in clusters:
        print(f"  {c['cluster']:8s} {c['start_bp'] / 1e6:6.2f}-{c['end_bp'] / 1e6:6.2f} Mb  {c['trait_groups']}  ({c['studies']})")


if __name__ == "__main__":
    main()
