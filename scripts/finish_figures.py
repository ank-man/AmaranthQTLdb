#!/usr/bin/env python3
"""Flatten transparent PNG figures onto white and crop the empty page margin RIdeogram leaves.
Usage: python3 scripts/finish_figures.py"""
import glob
import os
from PIL import Image, ImageChops

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
for f in glob.glob(os.path.join(ROOT, "figures", "*.png")):
    im = Image.open(f)
    if im.mode in ("RGBA", "LA", "P"):
        im = im.convert("RGBA")
        bg = Image.new("RGBA", im.size, "white")
        im = Image.alpha_composite(bg, im).convert("RGB")
    else:
        im = im.convert("RGB")
    diff = ImageChops.difference(im, Image.new("RGB", im.size, "white"))
    box = diff.getbbox()
    if box:
        pad = int(0.02 * max(im.size))
        box = (max(0, box[0] - pad), max(0, box[1] - pad), min(im.width, box[2] + pad), min(im.height, box[3] + pad))
        im = im.crop(box)
    im.save(f, dpi=(600, 600))
    print(os.path.basename(f), im.size)
