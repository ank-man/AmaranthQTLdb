#!/usr/bin/env python3
"""Harvest the Amaranthus QTL / GWAS / meta-QTL / epistasis literature from Europe PMC.

Step 1 (index): search, save raw records, write literature_index.tsv with study-type flags.
Step 2 (fulltext): for open-access PMC papers, save JATS XML, extract every table to TSV,
                   and download + unpack the supplementary-file bundle.

Usage: literature_harvest.py OUT_DIR index|fulltext|all
"""
import csv
import html
import io
import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
import zipfile

API = "https://www.ebi.ac.uk/europepmc/webservices/rest"
S3 = "https://pmc-oa-opendata.s3.amazonaws.com"
SUPP_EXT = r"\.(xlsx?|xlsm|csv|tsv|txt|docx?|rtf|pdf|zip|gz|rar|7z|ods|odt)$"
UA = "AmaranthQTLdb-harvester/1.0 (academic data collection)"
KW = ('(QTL OR QTLs OR "quantitative trait locus" OR "quantitative trait loci" OR GWAS OR '
      '"genome-wide association" OR "genome wide association" OR "association mapping" OR '
      '"meta-QTL" OR MQTL OR "epistatic QTL" OR "marker-trait association" OR "linkage map" OR '
      '"fine mapping" OR "bulked segregant" OR "BSA-seq" OR "QTL-seq")')
SP = ('(Amaranthus OR amaranth OR amaranths OR "grain amaranth" OR waterhemp OR "Palmer amaranth" OR '
      'pigweed OR "A. tuberculatus" OR "A. palmeri" OR "A. hypochondriacus" OR "A. cruentus" OR '
      '"A. caudatus" OR "A. tricolor" OR "A. hybridus" OR "A. retroflexus" OR "A. spinosus")')
QUERIES = [
    f"TITLE_ABS:{SP} AND TITLE_ABS:{KW}",
    f"TITLE:{SP} AND {KW}",
    f'TITLE_ABS:{SP} AND TITLE_ABS:("genetic map" OR "genetic mapping" OR "sex determin" OR "sex-linked" OR "resistance locus" OR "genome assembly" OR "chromosome-level")',
]
FLAGS = {
    "is_qtl_linkage": r"\bQTLs?\b|quantitative trait loc|linkage map|interval mapping",
    "is_gwas": r"\bGWAS\b|genome[- ]wide association|association mapping|marker[- ]trait association|association analysis",
    "is_meta_qtl": r"meta[- ]?QTL|\bMQTLs?\b|meta[- ]analysis|QTL cluster|QTL hotspot|consensus QTL",
    "is_epistasis": r"epista|digenic|QTL\s?[x×]\s?QTL|interaction QTL",
    "is_multi_trait": r"multi[- ]?trait|pleiotrop|multiple traits|multivariate|joint analysis|multi[- ]locus",
    "is_qtl_x_env": r"QTL\s?[x×]\s?environment|QEI|multi[- ]environment|environment interaction",
    "is_fine_mapping": r"fine[- ]mapp|map[- ]based cloning|positional cloning|candidate gene",
    "is_bsa": r"bulked segregant|BSA[- ]seq|QTL[- ]seq|MutMap",
    "is_eqtl_omics": r"\beQTL|expression QTL|\bTWAS\b|\bmQTL\b|metabolite QTL|transcriptome-wide",
    "is_review": r"\breview\b",
}


def get(url, tries=4, binary=True):
    for k in range(tries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=180) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            if e.code in (404, 400):
                return None
            if e.code == 500 and k >= 1:  # Europe PMC answers 500 for non-OA full text
                return None
            time.sleep(2 * (k + 1))
        except Exception:  # noqa: BLE001
            time.sleep(4 * (k + 1))
    return None


def build_index(out):
    recs = {}
    for q in QUERIES:
        cursor = "*"
        while True:
            url = (f"{API}/search?query={urllib.parse.quote(q)}&format=json&resultType=core"
                   f"&pageSize=1000&cursorMark={urllib.parse.quote(cursor)}")
            d = json.loads(get(url))
            for r in d["resultList"]["result"]:
                recs.setdefault(r["source"] + ":" + r["id"], r)
            nxt = d.get("nextCursorMark")
            if not nxt or nxt == cursor or not d["resultList"]["result"]:
                break
            cursor = nxt
            time.sleep(0.3)
        print("query done, cumulative records:", len(recs), flush=True)
    with open(f"{out}/europepmc_records.json", "w") as fh:
        json.dump(list(recs.values()), fh)
    cols = ["epmc_id", "source", "pmid", "pmcid", "doi", "year", "journal", "title", "authors",
            "pub_types", "is_open_access", "in_pmc", "has_suppl", "cited_by"] + list(FLAGS) + ["abstract"]
    rows = []
    for key, r in recs.items():
        text = (r.get("title", "") or "") + " " + (r.get("abstractText", "") or "")
        row = {
            "epmc_id": key, "source": r.get("source"), "pmid": r.get("pmid", ""),
            "pmcid": r.get("pmcid", ""), "doi": r.get("doi", ""), "year": r.get("pubYear", ""),
            "journal": (r.get("journalInfo", {}).get("journal", {}) or {}).get("title", "")
            or (r.get("bookOrReportDetails", {}) or {}).get("publisher", ""),
            "title": re.sub(r"\s+", " ", r.get("title", "") or ""),
            "authors": r.get("authorString", ""),
            "pub_types": "; ".join((r.get("pubTypeList", {}) or {}).get("pubType", []) or []),
            "is_open_access": r.get("isOpenAccess", ""), "in_pmc": r.get("inPMC", ""),
            "has_suppl": r.get("hasSuppl", ""), "cited_by": r.get("citedByCount", ""),
            "abstract": re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", r.get("abstractText", "") or "")),
        }
        for f, pat in FLAGS.items():
            row[f] = int(bool(re.search(pat, text, re.I)))
        if "review" in row["pub_types"].lower():
            row["is_review"] = 1
        rows.append(row)
    rows.sort(key=lambda x: (str(x["year"]), x["title"]))
    with open(f"{out}/literature_index.tsv", "w", newline="") as fh:
        w = csv.DictWriter(fh, cols, delimiter="\t")
        w.writeheader()
        w.writerows(rows)
    print("index rows:", len(rows), flush=True)


def cell_text(el):
    return re.sub(r"\s+", " ", "".join(el.itertext())).strip()


def table_rows(tbl):
    """Expand a JATS/HTML <table> into a rectangular grid, honouring rowspan/colspan."""
    grid, carry = [], {}
    for tr in tbl.iter("tr"):
        row, c = [], 0
        cells = [x for x in tr if x.tag in ("td", "th")]
        ci = 0
        while ci < len(cells) or c in carry:
            if c in carry:
                txt, left = carry[c]
                row.append(txt)
                if left <= 1:
                    del carry[c]
                else:
                    carry[c] = (txt, left - 1)
                c += 1
                continue
            cell = cells[ci]
            ci += 1
            txt = cell_text(cell)
            try:
                cs = int(cell.get("colspan", 1) or 1)
                rs = int(cell.get("rowspan", 1) or 1)
            except ValueError:
                cs, rs = 1, 1
            for _ in range(cs):
                row.append(txt)
                if rs > 1:
                    carry[c] = (txt, rs - 1)
                c += 1
        grid.append(row)
    return grid


def extract_tables(xml_bytes, tdir):
    # Europe PMC JATS often uses xlink:/mml: prefixes without declaring them; neutralise prefixes.
    xml = re.sub(rb'\sxmlns(:\w+)?="[^"]*"', b"", xml_bytes)
    xml = re.sub(rb"<(/?)(\w+):(\w)", rb"<\1\2_\3", xml)
    xml = re.sub(rb'(\s)(\w+):([\w-]+=")', rb"\1\2_\3", xml)
    try:
        root = ET.fromstring(xml)
    except ET.ParseError:
        return []
    meta = []
    for n, tw in enumerate(root.iter("table-wrap"), 1):
        label = cell_text(tw.find("label")) if tw.find("label") is not None else ""
        cap = cell_text(tw.find("caption")) if tw.find("caption") is not None else ""
        foot = " ".join(cell_text(x) for x in tw.iter("table-wrap-foot"))
        grids = [table_rows(t) for t in tw.iter("table")]
        rows = [r for g in grids for r in g]
        if not rows:
            continue
        os.makedirs(tdir, exist_ok=True)
        fn = f"table_{n:02d}.tsv"
        with open(f"{tdir}/{fn}", "w", newline="") as fh:
            csv.writer(fh, delimiter="\t").writerows(rows)
        meta.append({"file": fn, "label": label, "caption": cap, "footnote": foot,
                     "n_rows": len(rows), "header": rows[0][:40]})
    if meta:
        with open(f"{tdir}/tables.json", "w") as fh:
            json.dump(meta, fh, indent=1)
    return meta


def process_paper(out, r):
    pmc = r["pmcid"]
    pdir = f"{out}/papers/{pmc}"
    os.makedirs(pdir, exist_ok=True)
    xml = None
    if os.path.exists(f"{pdir}/fulltext.xml"):
        with open(f"{pdir}/fulltext.xml", "rb") as fh:
            xml = fh.read()
    elif r["is_open_access"] == "Y":
        xml = get(f"{API}/{pmc}/fullTextXML")
        if xml:
            with open(f"{pdir}/fulltext.xml", "wb") as fh:
                fh.write(xml)
    ntab = len(extract_tables(xml, f"{pdir}/tables")) if xml else ""
    names, size = [], 0
    marker = f"{pdir}/.supp_done"
    if os.path.exists(marker):
        with open(marker) as fh:
            size, names = json.load(fh)
    else:
        # Supplementary files come from the PMC Open Access bucket (keys: PMCID.version/file).
        keys, token, ok = [], None, True
        while True:
            url = f"{S3}/?list-type=2&prefix={pmc}.&max-keys=1000"
            if token:
                url += "&continuation-token=" + urllib.parse.quote(token, safe="")
            listing = get(url)
            if listing is None:
                ok = False
                break
            text = listing.decode("utf8", "ignore")
            keys += [(html.unescape(k), int(sz)) for k, sz in
                     re.findall(r"<Key>([^<]+)</Key>.*?<Size>(\d+)</Size>", text, re.S)]
            m = re.search(r"<NextContinuationToken>([^<]+)<", text)
            if not m:
                break
            token = m.group(1)
        if keys:
            latest = max(int(k.split("/")[0].split(".")[1]) for k, _ in keys)
            sdir = os.path.realpath(f"{pdir}/supplementary")
            for key, sz in keys:
                ver, _, fname = key.partition("/")
                if int(ver.split(".")[1]) != latest or not fname or fname.endswith("/"):
                    continue
                if not re.search(SUPP_EXT, fname, re.I) or sz > 60_000_000:
                    continue
                if re.fullmatch(rf"{pmc}\.\d+\.(xml|txt|json|pdf)", fname):
                    continue  # the article itself, not a supplement
                target = os.path.realpath(os.path.join(sdir, fname))
                if not target.startswith(sdir + os.sep):
                    continue
                data = get(f"{S3}/{urllib.parse.quote(key)}")
                if data is None:
                    ok = False
                    continue
                os.makedirs(os.path.dirname(target), exist_ok=True)
                with open(target, "wb") as fh:
                    fh.write(data)
                names.append(fname)
                size += len(data)
        if ok:
            with open(marker, "w") as fh:
                json.dump([size, names], fh)
    return [pmc, r["pmid"], int(bool(xml)), ntab, size, "; ".join(names)]


def fulltext(out, workers=8):
    from concurrent.futures import ThreadPoolExecutor
    with open(f"{out}/literature_index.tsv") as fh:
        idx = [r for r in csv.DictReader(fh, delimiter="\t") if r["pmcid"]]
    print("papers with PMCID:", len(idx), flush=True)
    with open(f"{out}/fulltext_status.tsv", "w", newline="") as lf, ThreadPoolExecutor(workers) as ex:
        w = csv.writer(lf, delimiter="\t")
        w.writerow(["pmcid", "pmid", "xml", "n_tables", "supp_bytes", "supp_files"])
        for i, row in enumerate(ex.map(lambda r: process_paper(out, r), idx)):
            w.writerow(row)
            lf.flush()
            if i % 25 == 0:
                print(i, row[:5], flush=True)
    print("fulltext done", flush=True)


if __name__ == "__main__":
    out, mode = sys.argv[1], sys.argv[2]
    if mode in ("index", "all"):
        build_index(out)
    if mode in ("fulltext", "all"):
        fulltext(out)
