#!/usr/bin/env python3
"""Fetch openly served Springer electronic supplementary material (ESM) for index papers
that are not in PMC. Springer ESM file names follow
{journal}_{year}_{article}_MOESM{n}_ESM.{ext}; candidates are probed with HEAD requests.

Usage: springer_esm.py LITERATURE_DIR
"""
import csv
import os
import re
import sys
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor

UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/126.0 Safari/537.36")
EXTS = ["docx", "xlsx", "xls", "doc", "pdf", "csv", "txt", "zip", "pptx"]
SKIP_SAVE = {"pptx"}


def http(url, method="GET"):
    try:
        req = urllib.request.Request(url, headers={"User-Agent": UA}, method=method)
        with urllib.request.urlopen(req, timeout=120) as r:
            return r.read() if method == "GET" else b"ok"
    except Exception:  # noqa: BLE001
        return None


def one(args):
    out, doi = args
    m = re.match(r"10\.1007/s(\d{5})-(\d{3})-(\d{1,5})-", doi)
    if not m:
        return doi, []
    journal, yy, art = int(m.group(1)), int(m.group(2)), int(m.group(3))
    year = 2000 + yy if yy < 90 else 1000 + yy
    base = ("https://static-content.springer.com/esm/art%3A" + urllib.parse.quote(doi, safe="")
            + f"/MediaObjects/{journal}_{year}_{art}_MOESM")
    got = []
    for n in range(1, 25):
        hit = False
        for ext in EXTS:
            url = f"{base}{n}_ESM.{ext}"
            if http(url, "HEAD"):
                hit = True
                if ext in SKIP_SAVE:
                    break
                data = http(url)
                if data:
                    d = f"{out}/springer_esm/{doi.replace('/', '_')}"
                    os.makedirs(d, exist_ok=True)
                    name = url.rsplit("/", 1)[1]
                    with open(f"{d}/{name}", "wb") as fh:
                        fh.write(data)
                    got.append(name)
                break
        if not hit:
            break
    return doi, got


def main(out):
    with open(f"{out}/literature_index.tsv") as fh:
        dois = [r["doi"].lower() for r in csv.DictReader(fh, delimiter="\t")
                if not r["pmcid"] and r["doi"].lower().startswith("10.1007/s")]
    print(len(dois), "Springer papers outside PMC", flush=True)
    with open(f"{out}/springer_esm_status.tsv", "w", newline="") as fh, ThreadPoolExecutor(4) as ex:
        w = csv.writer(fh, delimiter="\t")
        w.writerow(["doi", "n_files", "files"])
        for i, (doi, got) in enumerate(ex.map(one, [(out, d) for d in dois])):
            w.writerow([doi, len(got), "; ".join(got)])
            fh.flush()
            if i % 25 == 0:
                print(i, doi, len(got), flush=True)
    print("done", flush=True)


if __name__ == "__main__":
    main(sys.argv[1])
