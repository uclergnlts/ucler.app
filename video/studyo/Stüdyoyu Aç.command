#!/bin/zsh
# Çift tıkla: stüdyoyu başlatır ve tarayıcıda açar. Kapatmak için bu Terminal penceresini kapat.
cd "$(dirname "$0")"
[ -d node_modules ] || npm install
(sleep 2; open http://localhost:4100) &
node server.mjs
