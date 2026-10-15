#!/usr/bin/env python3
"""ucler içerik doğrulayıcı.

Kullanım:  python3 tools/check.py                  (content/ altındaki tüm ders dosyaları)
           python3 tools/check.py content/kimya.json
Çıktı "TAMAM" ise içerik docs/ICERIK-SPEC.md kurallarına uyuyor demektir.
Gerekenler: yalnızca python3.
"""
import sys, json, re, os, xml.etree.ElementTree as ET

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT = os.path.join(ROOT, "content")
DERSLER_JSON = os.path.join(CONTENT, "dersler.json")
dersler = json.load(open(DERSLER_JSON, encoding="utf-8"))
files = [os.path.abspath(f) for f in sys.argv[1:]] or [
    os.path.join(CONTENT, ders + ".json") for ders in dersler]
d = {os.path.splitext(os.path.basename(f))[0]: json.load(open(f, encoding="utf-8")) for f in files}

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

# content/dersler.json'daki konu listeleri ile veri dosyaları uyumlu mu?
for ders, topics in d.items():
    if ders not in dersler: err(ders, "dersler.json içinde böyle bir ders yok"); continue
    listed = [k.get("id") for k in dersler[ders]["konular"] if k.get("id")]
    dup = {x for x in listed if listed.count(x) > 1}
    if dup: err(ders, "dersler.json içinde tekrar eden konu id", sorted(dup))
    for k in dersler[ders]["konular"]:
        if not k.get("ad"): err(ders, "dersler.json içinde adı olmayan konu", k)
    for tid in topics:
        if tid not in listed: err(ders, tid, "veri dosyasında var ama dersler.json listesinde yok")
    for tid in set(listed) - set(topics):
        err(ders, tid, "dersler.json listesinde var ama veri dosyasında yok")

print("TAMAM" if not bad else f"{bad} sorun")
for ders, topics in d.items():
    print(f"  {ders}: {len(topics)} konu hazır -> {', '.join(topics)}")
sys.exit(1 if bad else 0)
