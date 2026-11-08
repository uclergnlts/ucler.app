#!/usr/bin/env bash
# Sahneyi HyperFrames ile doğrudan MP4'e çevirir (kare klasörü ve ayrı ffmpeg adımı gerekmez).
# Kullanım (video/ klasöründen):  bash sablon/hf-render.sh kaynak/KIM-12 [cikti.mp4]
# Gerekenler: Node 22+, ffmpeg, bir kez `npm install` (video/ klasöründe).
# HyperFrames sayfayı proje kökünden sunar. Bu yüzden geçici bir proje kurulur:
# scene.html -> index.html, sahne klasörünün dosyaları yanında, sablon/ ve node_modules/ bağlantı olarak.
set -euo pipefail
cd "$(dirname "$0")/.."
KLASOR=${1%/}; CIKTI=${2:-$KLASOR/cikti.mp4}
[ -f "$KLASOR/scene.html" ] || { echo "$KLASOR/scene.html yok"; exit 1; }
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
cp -r "$KLASOR"/. "$TMP"/
rm -rf "$TMP/frames" "$TMP"/still_*.png
ln -s "$PWD/sablon" "$TMP/sablon"; ln -s "$PWD/node_modules" "$TMP/node_modules"
sed 's#\.\./\.\./#./#g' "$KLASOR/scene.html" > "$TMP/index.html"
CIKTI_ABS=$(cd "$(dirname "$CIKTI")" && pwd)/$(basename "$CIKTI")
(cd "$TMP" && npx --prefix "$OLDPWD" hyperframes render -o "$CIKTI_ABS" --quiet)
echo "-> $CIKTI"
