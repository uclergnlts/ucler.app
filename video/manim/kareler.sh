#!/usr/bin/env bash
# Manim sahnesini saydam PNG karelerine çevirir; sahne.html bu kareleri <img> ile gösterir.
# Kullanım: bash video/manim/kareler.sh <dosya.py> <SahneAdi> <hedef-klasör>
# Örnek:    bash video/manim/kareler.sh ornek_hiz_zaman.py HizZaman ../kaynak/FIZ-12/manim
set -euo pipefail
cd "$(dirname "$0")"
DOSYA=$1; SAHNE=$2; HEDEF=$3
TMP=$(mktemp -d)
manim render --format png -t -r 1080,1080 --fps 30 --media_dir "$TMP" "$DOSYA" "$SAHNE" >/dev/null 2>&1
mkdir -p "$HEDEF"; rm -f "$HEDEF"/*.png
i=0; for f in $(ls "$TMP"/images/*/"$SAHNE"*.png | sort -V); do cp "$f" "$HEDEF/$(printf 'm%04d.png' $i)"; i=$((i+1)); done
rm -rf "$TMP"
echo "$i kare -> $HEDEF (30 fps, $(python3 -c "print(round($i/30,2))") sn)"
