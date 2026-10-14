#!/usr/bin/env python3
"""Normalise supplementary files to plain files that can be curated:
Word tables -> TSV (merged cells filled in), spreadsheet sheets -> TSV, PDF -> text.
Writes into papers/<id>/supp_tables/. Run with the project venv (needs openpyxl, pypdf).
Usage: extract_supplements.py LITERATURE_DIR"""
import csv, glob, os, re, sys, zipfile
import xml.etree.ElementTree as ET

W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"


def docx_tables(path):
    with zipfile.ZipFile(path) as z:
        root = ET.fromstring(z.read("word/document.xml"))
    out = []
    for tbl in root.iter(W + "tbl"):
        grid, above = [], {}
        for tr in tbl.iter(W + "tr"):
            row, col = [], 0
            for tc in tr.findall(W + "tc"):
                pr = tc.find(W + "tcPr")
                span, vm = 1, None
                if pr is not None:
                    gs = pr.find(W + "gridSpan")
                    span = int(gs.get(W + "val", 1)) if gs is not None else 1
                    v = pr.find(W + "vMerge")
                    vm = (v.get(W + "val") or "continue") if v is not None else None
                text = " ".join("".join(t.text or "" for t in p.iter(W + "t")) for p in tc.iter(W + "p")).strip()
                text = re.sub(r"\s+", " ", text)
                if vm == "continue":
                    text = above.get(col, "")
                for k in range(span):
                    row.append(text)
                    above[col + k] = text
                col += span
            grid.append(row)
        out.append(grid)
    return out


def main(lit):
    for f in sorted(glob.glob(f"{lit}/papers/*/supplementary/**/*", recursive=True)):
        if os.path.isdir(f):
            continue
        d = os.path.join(f.split("/supplementary/")[0], "supp_tables")
        os.makedirs(d, exist_ok=True)
        base = re.sub(r"[^\w.-]+", "_", os.path.basename(f))
        low = f.lower()
        try:
            if low.endswith(".docx"):
                for i, g in enumerate(docx_tables(f), 1):
                    with open(f"{d}/{base}.t{i:02d}.tsv", "w", newline="") as fh:
                        csv.writer(fh, delimiter="\t").writerows(g)
            elif low.endswith((".xlsx", ".xlsm")):
                import openpyxl
                wb = openpyxl.load_workbook(f, read_only=True, data_only=True)
                for ws in wb.worksheets:
                    with open(f"{d}/{base}.{re.sub(r'[^\w-]+', '_', ws.title)}.tsv", "w", newline="") as fh:
                        w = csv.writer(fh, delimiter="\t")
                        for r in ws.iter_rows(values_only=True):
                            w.writerow(["" if c is None else c for c in r])
            elif low.endswith(".pdf"):
                from pypdf import PdfReader
                txt = "\n\f".join((p.extract_text() or "") for p in PdfReader(f).pages)
                open(f"{d}/{base}.txt", "w").write(txt)
        except Exception as e:  # noqa: BLE001
            print("  failed", f, e)
    print("done")


if __name__ == "__main__":
    main(sys.argv[1])
