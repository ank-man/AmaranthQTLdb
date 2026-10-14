#!/usr/bin/env python3
"""Coordinate conversion between Amaranthus genome assembly versions.

Every curated position (loci.csv start/end/peak, meta-QTL, linkage-map markers, PCR-marker hits) was
published on whatever assembly the authors used. This lifts them onto one current, public,
chromosome-level reference per species:

  A. hypochondriacus : v2.0/v2.1 (Lightfoot et al. 2017 PGA2; v2.1 = annotation on the v2.0 sequence)
                       and v2.2 (polished, CoGe 66602)      -> v3 (GCA_977020195.1, same accession PI 558499)
                       and v2.2 -> v2.0 (to put every grain-amaranth study on one axis for meta-analysis)
  A. tuberculatus    : Kreiner et al. 2019 female reference (CoGe 54057), Atub_193 Walpole hap2
                       (GCA_060155655.1)                    -> Raiyemo et al. 2025 hap1 (GCA_054443085.1)
                       (Werle et al. 2025 and Raiyemo et al. 2025 positions are already on hap1)
  A. palmeri         : BASF male draft scaffolds (Montgomery et al. 2020; CoGe 55760)
                                                            -> IWGC hap1 (GCA_051800445.1)

Method: the chromosome-scale sequences (>= 1 Mb) of source and target are aligned with minimap2
(-x asm5 within an accession, with base-level alignment; asm20 between individuals, chaining only,
one source chromosome at a time), keeping primary alignments with MAPQ >= 5 and length >= 10 kb.
Within an accession a position is converted by walking the CIGAR of the alignment block that
contains it; between individuals it is interpolated linearly inside the block (error well under
1 kb on blocks >= 10 kb, negligible for Mb-scale QTL intervals); a position in an alignment gap is moved to the nearest aligned base and flagged. An
interval is converted end by end and accepted when both ends land on the same target chromosome.

Writes data/curated/assemblies.csv, data/curated/coordinates_lifted.csv and data/liftover/*.paf.
Usage: python3 scripts/liftover.py   (needs minimap2 and samtools; genomes in data/genomes/)
"""
import bisect
import csv
import gzip
import os
import re
import shutil
import subprocess
import zipfile
from collections import defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GEN = os.path.join(ROOT, "data", "genomes")
LO = os.path.join(ROOT, "data", "liftover")
CUR = os.path.join(ROOT, "data", "curated")
THREADS = "8"

ASSEMBLIES = {
    # key: (species, label, file, how to name a chromosome number in this assembly, accession/source)
    "Ahyp_v2.0": ("Amaranthus hypochondriacus", "v2.0 sequence / v2.1 annotation (PGA2, Lightfoot et al. 2017)",
                  "coge_34733.fa", "Scaffold_{}", "CoGe gid 34733 (= Phytozome Ahypochondriacus_459 v2.0)"),
    "Ahyp_v2.2": ("Amaranthus hypochondriacus", "v2.2 (polished PGA2)", "coge_66602.fa", "Scaffold_{}", "CoGe gid 66602"),
    "Ahyp_v3": ("Amaranthus hypochondriacus", "v3 (Ahypochondriacus_v3)", "GCA_977020195.1.zip", None, "NCBI GCA_977020195.1"),
    "Atub_Kreiner2019": ("Amaranthus tuberculatus", "female reference (Kreiner et al. 2019)", "coge_54057.fa", "Scaffold_{}", "CoGe gid 54057"),
    "Atub_hap1": ("Amaranthus tuberculatus", "hap1 v01 (Raiyemo et al. 2025)", "GCA_054443085.1.zip", None, "NCBI GCA_054443085.1"),
    "Atub_Walpole_hap2": ("Amaranthus tuberculatus", "Walpole hap2 / Atub_193 (Kreiner et al. 2025)", "GCA_060155655.1.zip", None, "NCBI GCA_060155655.1"),
    "Apal_BASF": ("Amaranthus palmeri", "BASF male draft scaffolds (Montgomery et al. 2020)", "coge_55760.fa", "{}", "CoGe gid 55760"),
    "Apal_hap1": ("Amaranthus palmeri", "IWGC hap1 v01", "GCA_051800445.1.zip", None, "NCBI GCA_051800445.1"),
}
PAIRS = [("Ahyp_v2.0", "Ahyp_v3", "asm5"), ("Ahyp_v2.2", "Ahyp_v3", "asm5"), ("Ahyp_v2.2", "Ahyp_v2.0", "asm5"), ("Ahyp_v3", "Ahyp_v2.0", "asm5"),
         ("Atub_Kreiner2019", "Atub_hap1", "asm20"), ("Atub_Walpole_hap2", "Atub_hap1", "asm20"),
         ("Apal_BASF", "Apal_hap1", "asm20")]

# reference_genome text in loci.csv -> assembly key
SOURCE_OF = [
    (r"^A\. hypochondriacus v3", "Ahyp_v3"),
    (r"^A\. hypochondriacus v2\.2", "Ahyp_v2.2"),
    (r"^A\. hypochondriacus (v2\.1|v2 |v2$|PGA2)", "Ahyp_v2.0"),
    (r"Kreiner et al\. 2019", "Atub_Kreiner2019"),
    (r"Atub_193", "Atub_Walpole_hap2"),
    (r"AmaTu_Ref|tuberculatus Hap1", "Atub_hap1"),
    (r"A\. palmeri draft", "Apal_BASF"),
    (r"A\. palmeri Hap1", "Apal_hap1"),
]
TARGET_OF = {"Amaranthus hypochondriacus": "Ahyp_v3", "Amaranthus tuberculatus": "Atub_hap1", "Amaranthus palmeri": "Apal_hap1"}


def sh(cmd):
    subprocess.run(cmd, shell=True, check=True)


def chrom_fasta(key):
    """Chromosome-scale sequences (>= 1 Mb) of an assembly as plain FASTA with clean names; returns path
    and {clean name: chromosome label} (the label is the chromosome number where the assembly gives one)."""
    out = os.path.join(LO, f"{key}.chrom.fa")
    names = os.path.join(LO, f"{key}.names.tsv")
    if os.path.exists(out) and os.path.exists(names):
        return out, dict(r for r in csv.reader(open(names), delimiter="\t"))
    src = os.path.join(GEN, ASSEMBLIES[key][2])
    if src.endswith(".zip"):
        with zipfile.ZipFile(src) as z:
            fn = [n for n in z.namelist() if re.search(r"\.(fna|fa|fasta)$", n)][0]
            fh = (l.decode() for l in z.open(fn))
            seqs = read_fasta(fh)
    else:
        op = gzip.open if src.endswith(".gz") else open
        with op(src, "rt") as fh:
            seqs = read_fasta(fh)
    label = {}
    with open(out, "w") as fh:
        for h, s in seqs:
            if len(s) < 1_000_000:
                continue
            name = h.split()[0].replace("lcl|", "")
            m = re.search(r"chromosome[ :]+(\w+)", h, re.I)
            label[name] = m.group(1) if m else name
            fh.write(f">{name}\n")
            for i in range(0, len(s), 100):
                fh.write(s[i:i + 100] + "\n")
    with open(names, "w") as fh:
        csv.writer(fh, delimiter="\t").writerows(label.items())
    return out, label


def read_fasta(lines):
    seqs, h, buf = [], None, []
    for l in lines:
        l = l.rstrip("\n")
        if l.startswith(">"):
            if h is not None:
                seqs.append((h, "".join(buf)))
            h, buf = l[1:], []
        else:
            buf.append(l)
    if h is not None:
        seqs.append((h, "".join(buf)))
    return seqs


def seqname(src, r):
    """Name of the record's chromosome / scaffold in the source assembly."""
    if src == "Apal_BASF":
        m = re.search(r"(Scaffold_\d+)", r["note"])
        return m.group(1) if m else None
    if not r["chromosome"]:
        return None
    fmt = ASSEMBLIES[src][3]
    if fmt:
        return fmt.format(r["chromosome"])
    rev = {v: k for k, v in chrom_fasta(src)[1].items()}       # NCBI: chromosome number -> accession
    return rev.get(r["chromosome"])


class Lift:
    def __init__(self, paf):
        self.blocks = defaultdict(list)          # qname -> sorted [(qs, qe, tname, ts, te, strand, cigar)]
        for l in open(paf):
            f = l.rstrip("\n").split("\t")
            tags = dict(t.split(":", 2)[0::2] for t in f[12:])
            if tags.get("tp") != "P" or int(f[11]) < 5 or int(f[10]) < 10_000:
                continue
            self.blocks[f[0]].append((int(f[2]), int(f[3]), f[5], int(f[7]), int(f[8]), f[4], tags.get("cg", "")))
        for q in self.blocks:
            self.blocks[q].sort()
        self.starts = {q: [b[0] for b in v] for q, v in self.blocks.items()}

    def point(self, q, x):
        """Lift 0-based position x on query sequence q. Returns (target, pos, flag) or None."""
        bl = self.blocks.get(q)
        if not bl:
            return None
        i = bisect.bisect_right(self.starts[q], x) - 1
        cand = [b for b in bl[max(0, i - 3): i + 4] if b[0] <= x < b[1]]
        if not cand:
            # nearest block within 50 kb
            near = min(bl, key=lambda b: min(abs(x - b[0]), abs(x - b[1])))
            d = min(abs(x - near[0]), abs(x - near[1]))
            if d > 50_000:
                return None
            x = near[0] if x < near[0] else near[1] - 1
            res = self._walk(near, x)
            return (res[0], res[1], f"outside alignment ({d} bp to nearest block)")
        b = max(cand, key=lambda b: b[1] - b[0])
        return self._walk(b, x)

    @staticmethod
    def _walk(b, x):
        qs, qe, t, ts, te, strand, cg = b
        if not cg:
            # chaining-only alignment (between individuals): interpolate linearly inside the block
            frac = (x - qs) / max(1, qe - qs)
            off = int(round(frac * (te - ts)))
            return (t, ts + off if strand == "+" else te - 1 - off, "interpolated within block")
        qpos, tpos, flag = qs, 0, "exact"
        for n, op in re.findall(r"(\d+)([MIDNX=])", cg):
            n = int(n)
            if op in "M=X":
                if qpos + n > x:
                    tpos += x - qpos
                    qpos = x
                    break
                qpos += n
                tpos += n
            elif op == "I":                  # insertion in query
                if qpos + n > x:
                    flag = "in insertion; nearest base"
                    break
                qpos += n
            elif op in "DN":
                tpos += n
        tp = ts + tpos if strand == "+" else te - 1 - tpos
        return (t, tp, flag)


class FlankLift:
    """Lift positions between individuals by aligning a FLANK-bp window of source sequence centred on
    each position to the target (minimap2 -x asm10, base-level), then reading the position off the CIGAR."""
    FLANK = 20_000

    def __init__(self, sfa, tfa, positions, tag):
        self.hits = {}
        qfa = os.path.join(LO, f"{tag}.flanks.fa")
        paf = os.path.join(LO, f"{tag}.flanks.paf")
        sh(f"samtools faidx {sfa}")
        lens = {l.split()[0]: int(l.split()[1]) for l in open(sfa + ".fai")}
        with open(qfa, "w") as fh:
            for ch, pos in sorted(positions):
                if ch not in lens:
                    continue
                ws = max(0, pos - self.FLANK // 2)
                we = min(lens[ch], pos + self.FLANK // 2)
                seq = subprocess.run(f"samtools faidx {sfa} {ch}:{ws + 1}-{we}", shell=True, capture_output=True,
                                     text=True).stdout.split("\n", 1)[1].replace("\n", "")
                fh.write(f">{ch}|{pos}|{ws}\n{seq}\n")
        sh(f"minimap2 -t {THREADS} -c -x asm10 --secondary=no {tfa} {qfa} > {paf} 2> {paf}.log")
        best = {}
        for l in open(paf):
            f = l.rstrip("\n").split("\t")
            tags = dict(t.split(":", 2)[0::2] for t in f[12:])
            if tags.get("tp") != "P" or int(f[11]) < 5:
                continue
            ch, pos, ws = f[0].split("|")
            pos, ws = int(pos), int(ws)
            x = pos - ws                                  # offset of the position inside the window
            if not (int(f[2]) <= x < int(f[3])):
                continue
            blk = (int(f[2]), int(f[3]), f[5], int(f[7]), int(f[8]), f[4], tags.get("cg", ""))
            alen = int(f[10])
            if (ch, pos) not in best or alen > best[(ch, pos)][0]:
                best[(ch, pos)] = (alen, Lift._walk(blk, x))
        self.hits = {k: v[1] for k, v in best.items()}

    def point(self, q, x):
        r = self.hits.get((q, x))
        return (r[0], r[1], "flank alignment" if r[2] == "exact" else r[2]) if r else None


def main():
    os.makedirs(LO, exist_ok=True)
    have = {k for k, v in ASSEMBLIES.items() if os.path.exists(os.path.join(GEN, v[2]))}
    lifts = {}
    loci = list(csv.DictReader(open(os.path.join(CUR, "loci.csv"))))
    for src, tgt, preset in PAIRS:
        if src not in have or tgt not in have:
            print(f"skip {src} -> {tgt}: genome missing")
            continue
        sfa, _ = chrom_fasta(src)
        tfa, _ = chrom_fasta(tgt)
        if preset != "asm5":
            # positions on src that need converting (0-based), with the sequence name used in src
            need = set()
            for r in loci:
                if next((k for pat, k in SOURCE_OF if re.search(pat, r["reference_genome"])), None) != src:
                    continue
                cname = seqname(src, r)
                for k in ("start_bp", "end_bp", "peak_bp"):
                    if r[k].strip() and cname:
                        need.add((cname, int(float(r[k])) - 1))
            print(f"flank-aligning {len(need)} positions {src} -> {tgt} ...", flush=True)
            try:
                lifts[(src, tgt)] = FlankLift(sfa, tfa, need, f"{src}__{tgt}")
                print(f"  {src} -> {tgt}: {len(lifts[(src, tgt)].hits)}/{len(need)} positions aligned", flush=True)
            except subprocess.CalledProcessError as e:
                print(f"  {src} -> {tgt} failed ({e.returncode})", flush=True)
            continue
        paf = os.path.join(LO, f"{src}__{tgt}.paf")
        if not os.path.exists(paf):
            print(f"aligning {src} -> {tgt} ({preset}) ...", flush=True)
            sh(f"minimap2 -t {THREADS} -c -x {preset} --secondary=no {tfa} {sfa} > {paf}.tmp 2> {paf}.log && mv {paf}.tmp {paf}")
        lifts[(src, tgt)] = Lift(paf)
        print(f"  {src} -> {tgt}: {sum(len(v) for v in lifts[(src, tgt)].blocks.values())} alignment blocks")
    labels = {k: chrom_fasta(k)[1] for k in have}

    def to_label(key, name):
        return labels.get(key, {}).get(name, name)

    def lift_pos(src, tgt, chrom_name, pos):
        if src == tgt:
            return (chrom_name, pos, "same assembly")
        L = lifts.get((src, tgt))
        if L is None or pos is None:
            return None
        r = L.point(chrom_name, int(pos) - 1)
        return (r[0], r[1] + 1, r[2]) if r else None

    rows = []
    for r in loci:
        src = next((k for pat, k in SOURCE_OF if re.search(pat, r["reference_genome"])), None)
        sp = next((s for s in TARGET_OF if s in r["species"] or (s == "Amaranthus hypochondriacus" and src and src.startswith("Ahyp"))), None)
        out = {"locus_id": r["locus_id"], "study_id": r["study_id"], "source_assembly": src or "",
               "source_chromosome": r["chromosome"], "source_start": r["start_bp"], "source_end": r["end_bp"],
               "source_peak": r["peak_bp"]}
        targets = [TARGET_OF.get(sp)] if sp else []
        if src and src.startswith("Ahyp") and src != "Ahyp_v2.0":
            targets.append("Ahyp_v2.0")
        if not src or not r["chromosome"] and "Scaffold" not in r["note"]:
            out.update(status="not converted: no source assembly / position")
            rows.append(out)
            continue
        cname = seqname(src, r)
        for tgt in [t for t in targets if t]:
            res = {}
            for k in ("start_bp", "end_bp", "peak_bp"):
                v = r[k].strip()
                res[k] = lift_pos(src, tgt, cname, int(float(v))) if v else None
            got = [v for v in res.values() if v]
            if not got:
                status = "not converted: position not in an alignment block" if (src, tgt) in lifts or src == tgt else "not converted: genome not available"
                rows.append({**out, "target_assembly": tgt, "status": status})
                continue
            chroms = {v[0] for v in got}
            s, e, p = (res[k] for k in ("start_bp", "end_bp", "peak_bp"))
            status = "ok"
            if len(chroms) > 1:
                status = "interval ends on different target chromosomes"
            elif r["start_bp"].strip() and r["end_bp"].strip() and not (s and e):
                status = "partial: only one interval end converted"
            flags = sorted({v[2] for v in got if v[2] not in ("exact", "same assembly")})
            if flags:
                status += "; " + "; ".join(flags)
            ts, tend = (min(s[1], e[1]), max(s[1], e[1])) if s and e and s[0] == e[0] else ((s or ("", ""))[1], (e or ("", ""))[1])
            tname = (p or s or e)[0]
            rows.append({**out, "target_assembly": tgt, "target_chromosome": to_label(tgt, tname), "target_sequence": tname,
                         "target_start": ts, "target_end": tend, "target_peak": p[1] if p else "", "status": status})
    cols = ["locus_id", "study_id", "source_assembly", "source_chromosome", "source_start", "source_end", "source_peak",
            "target_assembly", "target_chromosome", "target_sequence", "target_start", "target_end", "target_peak", "status"]
    with open(os.path.join(CUR, "coordinates_lifted.csv"), "w", newline="") as fh:
        w = csv.DictWriter(fh, cols)
        w.writeheader()
        w.writerows(rows)
    with open(os.path.join(CUR, "assemblies.csv"), "w", newline="") as fh:
        w = csv.writer(fh)
        w.writerow(["assembly_key", "species", "assembly", "source", "downloaded", "used_as_target_for"])
        for k, (sp, lab, f, _, acc) in ASSEMBLIES.items():
            w.writerow([k, sp, lab, acc, "yes" if k in have else "no", "; ".join(s for s, t, _ in PAIRS if t == k)])
    from collections import Counter
    print(Counter((r.get("target_assembly", ""), r["status"].split(";")[0]) for r in rows))


if __name__ == "__main__":
    main()
