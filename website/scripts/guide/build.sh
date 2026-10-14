#!/bin/sh
# Rebuild the user guide: screenshots -> numbered arrows -> Word document.
#
# The Tutorial page (src/pages/Tutorial.tsx) and the Word guide
# (public/CottonQTLome_User_Guide.docx) are both generated from the same list of
# sections in scripts/guide/capture.cjs, so they always say the same thing.
#
# Needs: the site built (npm run build), playwright-core with a Chromium build,
# Pillow (set PYTHON to an interpreter that has it), and the `docx` npm package. Set CHROME to the browser binary and
# NODE_PATH to where playwright-core and docx are installed.
# Rebuild the site afterwards so the Tutorial page picks up the new guide.json.
set -e
cd "$(dirname "$0")/../.."
RAW="${GUIDE_RAW:-$(mktemp -d)}"
npx vite preview --port 4874 --strictPort >/dev/null 2>&1 &
SERVER=$!
trap 'kill $SERVER 2>/dev/null' EXIT
sleep 3
GUIDE_RAW="$RAW" node scripts/guide/capture.cjs
"${PYTHON:-python3}" scripts/guide/annotate.py "$RAW"
node scripts/guide/make_docx.cjs
