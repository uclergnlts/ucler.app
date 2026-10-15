#!/usr/bin/env python3
"""ucler içerik doğrulayıcı.

Kullanım:  python3 tools/check.py            (site/ altındaki tüm ders dosyaları)
           python3 tools/check.py site/kimya.js
Çıktı "TAMAM" ise içerik docs/ICERIK-SPEC.md kurallarına uyuyor demektir.
Gerekenler: python3, node.
"""
import sys, json, subprocess, re, os, xml.etree.ElementTree as ET

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = os.path.join(ROOT, "site")
files = [os.path.abspath(f) for f in sys.argv[1:]] or [
    os.path.join(SITE, f) for f in ("fizik.js", "kimya.js", "biyoloji.js")]

js = "global.window={};%s;process.stdout.write(JSON.stringify(window.DERS))" % ";".join(
    "require(%s)" % json.dumps(f) for f in files)
d = json.loads(subprocess.check_output(["node", "-e", js]))

bad = 0
def err(*a):
    global bad
    bad += 1
    print("HATA:", *a)

for ders, topics in d.items():
    for tid, t in topics.items():
        for k in ("title", "summary", "cards", "quiz"):
            if k not in t: err(ders, tid, "eksik alan", k)
        cards = t.get("cards", [])
        if not 6 <= len(cards) <= 11: err(ders, tid, "kart sayısı", len(cards), "(6-11 olmalı)")
        if cards and cards[-1].get("h") != "Özet": err(ders, tid, "son kart 'Özet' değil")
        if len(t.get("quiz", [])) != 4: err(ders, tid, "test soru sayısı", len(t.get("quiz", [])), "(4 olmalı)")
        ids = []
        for i, c in enumerate(cards):
            if len(c.get("h", "")) > 40: err(ders, tid, i, "başlık 40 karakteri aşıyor")
            w = len(re.sub("<[^>]+>", " ", c.get("p", "")).split())
            if w > 55: err(ders, tid, i, "uzun metin", w, "kelime")
            s = c.get("svg", "")
            if not s: err(ders, tid, i, "svg yok"); continue
            try: ET.fromstring(s)
            except Exception as e: err(ders, tid, i, "svg XML hatası", e)
            if re.search(r"#[0-9a-fA-F]{3,6}\b|rgb\(|(fill|stroke)='(white|black|red|blue|green|yellow|gray|grey)'", s):
                err(ders, tid, i, "yasak renk (yalnız var(--...) kullanılır)")
            if re.search(r"<svg[^>]*\s(width|height)=", s): err(ders, tid, i, "svg width/height özniteliği")
            if re.search(r"<(script|style|foreignObject|image)\b", s): err(ders, tid, i, "svg içinde yasak etiket")
            ids += re.findall(r"\sid='([^']+)'", s)
        dup = {x for x in ids if ids.count(x) > 1}
        if dup: err(ders, tid, "tekrar eden svg id", sorted(dup))
        for j, q in enumerate(t.get("quiz", [])):
            if len(q.get("o", [])) != 4 or not 0 <= q.get("a", -1) <= 3 or not q.get("e"):
                err(ders, tid, "test", j, "biçim hatası")

# index.html'deki konu listeleri (SUBJ) ile veri dosyaları uyumlu mu?
html = open(os.path.join(SITE, "index.html"), encoding="utf-8").read()
listed = set(re.findall(r'\["([a-z0-9-]+)","', html))
for ders, topics in d.items():
    for tid in topics:
        if tid not in listed: err(ders, tid, "veri dosyasında var ama index.html konu listesinde yok")
all_ids = {tid for topics in d.values() for tid in topics}
if len(files) == 3:
    for tid in listed - all_ids:
        err(tid, "index.html listesinde var ama veri dosyalarında yok")

print("TAMAM" if not bad else f"{bad} sorun")
for ders, topics in d.items():
    print(f"  {ders}: {len(topics)} konu hazır -> {', '.join(topics)}")
sys.exit(1 if bad else 0)
