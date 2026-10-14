#!/usr/bin/env python3
"""
Draw the numbered arrows on the guide screenshots.

For every callout recorded by capture.cjs: a red outline around the element, a
numbered badge beside it, and an arrow from the badge to the element. Badges
are nudged apart when two would overlap. Writes the annotated images to
public/images/guide/ and the section list (without pixel positions) to
src/lib/guide.json.

Usage: python3 scripts/guide/annotate.py <raw dir>
"""
import json
import math
import os
import sys

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
RAW = sys.argv[1]
OUT = os.path.join(ROOT, "public", "images", "guide")
os.makedirs(OUT, exist_ok=True)

RED = (217, 45, 32)
WHITE = (255, 255, 255)
R = 30            # badge radius, px at 2x
GAP = 62          # badge centre to element edge
FONT = None
for f in ("/System/Library/Fonts/Supplemental/Arial Bold.ttf",
          "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"):
    if os.path.exists(f):
        FONT = ImageFont.truetype(f, 34)
        break


def arrow(d, a, b, width=6, head=22):
    d.line([a, b], fill=RED, width=width)
    ang = math.atan2(b[1] - a[1], b[0] - a[0])
    for da in (2.6, -2.6):
        d.line([b, (b[0] + head * math.cos(ang + da), b[1] + head * math.sin(ang + da))], fill=RED, width=width)


def place(box, side, W, H, taken):
    x0, y0, x1, y1 = box
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    options = {"left": (x0 - GAP, cy), "right": (x1 + GAP, cy), "top": (cx, y0 - GAP), "bottom": (cx, y1 + GAP)}
    order = [side] + [s for s in ("left", "top", "right", "bottom") if s != side]
    for s in order:
        bx, by = options[s]
        # wide elements: put top/bottom badges near the left end rather than the middle
        if s in ("top", "bottom") and x1 - x0 > 500:
            bx = x0 + 70
        if s in ("left", "right") and y1 - y0 > 500:
            by = y0 + 70
        if not (R + 6 <= bx <= W - R - 6 and R + 6 <= by <= H - R - 6):
            continue
        for _ in range(8):
            if all(math.hypot(bx - tx, by - ty) > 2 * R + 10 for tx, ty in taken):
                return s, (bx, by)
            if s in ("top", "bottom"):
                bx += 2 * R + 14
            else:
                by += 2 * R + 14
    return side, options[side]


def main():
    sections = json.load(open(os.path.join(RAW, "sections.json"), encoding="utf-8"))
    guide = []
    for s in sections:
        im = Image.open(os.path.join(RAW, s["image"])).convert("RGB")
        W, H = im.size
        d = ImageDraw.Draw(im)
        k = s["scale"]
        taken = []
        for c in s["callouts"]:
            b = c["box"]
            x0, y0 = max(4, b["x"] * k - 8), max(4, b["y"] * k - 8)
            x1, y1 = min(W - 4, (b["x"] + b["width"]) * k + 8), min(H - 4, (b["y"] + b["height"]) * k + 8)
            if x1 - x0 < 12 or y1 - y0 < 12:      # scrolled out of the frame
                continue
            d.rounded_rectangle([x0, y0, x1, y1], radius=14, outline=RED, width=5)
            side, (bx, by) = place((x0, y0, x1, y1), c["side"], W, H, taken)
            taken.append((bx, by))
            # arrow ends on the nearest point of the outline
            tx = min(max(bx, x0), x1)
            ty = min(max(by, y0), y1)
            ang = math.atan2(ty - by, tx - bx)
            start = (bx + R * math.cos(ang), by + R * math.sin(ang))
            if math.hypot(tx - bx, ty - by) > R + 12:
                arrow(d, start, (tx, ty))
            d.ellipse([bx - R, by - R, bx + R, by + R], fill=RED, outline=WHITE, width=4)
            label = str(c["n"])
            tw = d.textlength(label, font=FONT)
            d.text((bx - tw / 2, by - 21), label, fill=WHITE, font=FONT)
        # a thin frame so a white page does not bleed into the document
        d.rectangle([0, 0, W - 1, H - 1], outline=(209, 209, 214), width=2)
        im.save(os.path.join(OUT, s["image"]), optimize=True)
        guide.append({
            "id": s["id"], "title": s["title"], "intro": s["intro"], "image": s["image"],
            "width": W, "height": H,
            "callouts": [{"n": c["n"], "label": c["label"], "text": c["text"]} for c in s["callouts"]],
        })
        print(f"{s['image']}  {len(s['callouts'])} arrows")
    with open(os.path.join(ROOT, "src", "lib", "guide.json"), "w", encoding="utf-8") as f:
        json.dump(guide, f, indent=2, ensure_ascii=False)
        f.write("\n")


if __name__ == "__main__":
    main()
