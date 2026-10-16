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
warn = []
def err(*a):
    global bad
    bad += 1
    print("HATA:", *a)

for ders, topics in d.items():
    for tid, t in topics.items():
        for k in ("title", "summary", "cards", "quiz"):
            if k not in t: err(ders, tid, "eksik alan", k)
        cards = t.get("cards", [])
        if not 6 <= len(cards) <= 14: err(ders, tid, "kart sayısı", len(cards), "(6-14 olmalı)")
        if cards and cards[-1].get("h") != "Özet": err(ders, tid, "son kart 'Özet' değil")
        if len(t.get("quiz", [])) != 4: err(ders, tid, "test soru sayısı", len(t.get("quiz", [])), "(4 olmalı)")
        ids = []
        for i, c in enumerate(cards):
            if len(c.get("h", "")) > 40: err(ders, tid, i, "başlık 40 karakteri aşıyor")
            w = len(re.sub("<[^>]+>", " ", c.get("p", "")).split())
            if w > 55: err(ders, tid, i, "uzun metin", w, "kelime")
            elif w > 45: warn.append(f"{ders} {tid} {i}: {w} kelime (hedef 45)")
            s = c.get("svg", "")
            if not s: err(ders, tid, i, "svg yok"); continue
            try: ET.fromstring(s)
            except Exception as e: err(ders, tid, i, "svg XML hatası", e)
            if re.search(r"#[0-9a-fA-F]{3,6}\b|rgb\(|(fill|stroke)='(white|black|red|blue|green|yellow|gray|grey)'", s):
                err(ders, tid, i, "yasak renk (yalnız var(--...) kullanılır)")
            if re.search(r"<svg[^>]*\s(width|height)=", s): err(ders, tid, i, "svg width/height özniteliği")
            if re.search(r"<(script|style|foreignObject|image)\b", s): err(ders, tid, i, "svg içinde yasak etiket")
            ids += re.findall(r"\sid='([^']+)'", s)
            if "etk" in c:  # etkileşimli görsel; svg yine zorunlu (yedek görsel)
                e = c["etk"]
                ALAN = {"atom": {"p": (1, 20), "n": (0, 24), "e": (0, 20)}, "vektor": {"v": (1, 10), "aci": (0, 180)}, "osmoz": {"c": (0, 2)}}
                if e.get("tur") not in ALAN: err(ders, tid, i, "etk: bilinmeyen tür", e.get("tur"))
                else:
                    for k, (lo, hi) in ALAN[e["tur"]].items():
                        if not isinstance(e.get(k), (int, float)) or not lo <= e[k] <= hi: err(ders, tid, i, "etk:", k, "eksik ya da aralık dışı")
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

# content/videolar.json (docs/VIDEOLAR.md): her video gerçek bir konuya ve karta bağlı mı?
VIDEO_JSON = os.path.join(CONTENT, "videolar.json")
if os.path.exists(VIDEO_JSON) and not sys.argv[1:]:
    vids = json.load(open(VIDEO_JSON, encoding="utf-8"))
    if not isinstance(vids, list): err("videolar.json bir liste olmalı"); vids = []
    seen = set()
    for v in vids:
        vid = v.get("id", "?")
        if not re.fullmatch(r"(KIM|FIZ|BIY)-\d{2}", vid): err("video", vid, "id KIM-nn / FIZ-nn / BIY-nn biçiminde olmalı")
        if vid in seen: err("video", vid, "tekrar eden id")
        seen.add(vid)
        if not v.get("baslik") or len(v["baslik"]) > 60: err("video", vid, "başlık yok ya da 60 karakteri aşıyor")
        sure = v.get("sure")
        if not isinstance(sure, (int, float)) or sure <= 0: err("video", vid, "süre (saniye) yok")
        elif not 45 <= sure <= 60: warn.append(f"video {vid}: {sure} sn (karar 45-60 sn)")
        for k in ("src", "poster"):
            u = v.get(k)
            if u is None and k == "poster": continue
            if not isinstance(u, str) or not (u.startswith("https://") or u.startswith("/videolar/")):
                err("video", vid, k, "https:// adresi ya da /videolar/ yolu olmalı")
        if bool(v.get("soru")) != bool(v.get("cevap")): err("video", vid, "soru ve cevap birlikte yazılmalı")
        elif not v.get("cevap"): warn.append(f"video {vid}: kapanış sorusunun cevabı yok")
        elif len(v["cevap"].split()) > 60: warn.append(f"video {vid}: cevap {len(v['cevap'].split())} kelime (en çok 60)")
        if not v.get("yerler"): err("video", vid, "en az bir yer (ders, konu, kart) gerekli")
        for y in v.get("yerler", []):
            t = d.get(y.get("ders"), {}).get(y.get("konu"))
            if t is None: err("video", vid, "böyle bir hazır konu yok:", y.get("ders"), y.get("konu")); continue
            kart = y.get("kart", 1)
            if not isinstance(kart, int) or not 1 <= kart <= len(t["cards"]):
                err("video", vid, y["konu"], "kart numarası", kart, f"(1-{len(t['cards'])} olmalı)")

# senaryolar: başlıktaki "· N kelime" etiketi konuşma metniyle tutmalı
import glob, re
for f in sorted(glob.glob(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "video", "senaryolar", "*.md"))):
    s = open(f, encoding="utf-8").read()
    m = re.search(r"· (\d+) kelime", s)
    if not m or "## Konuşma metni" not in s: continue
    n = len(s.split("## Konuşma metni")[1].split("\n", 1)[1].split("## Kapanış")[0].split())
    if n != int(m.group(1)): err("senaryo", os.path.basename(f), f"etiket {m.group(1)} kelime, metin {n} kelime")
    elif not 100 <= n <= 115: warn.append(f"senaryo {os.path.basename(f)}: {n} kelime (hedef 100-115)")

for w in warn: print("UYARI:", w)
print("TAMAM" if not bad else f"{bad} sorun")
for ders, topics in d.items():
    print(f"  {ders}: {len(topics)} konu hazır -> {', '.join(topics)}")
if os.path.exists(VIDEO_JSON) and not sys.argv[1:]: print(f"  videolar: {len(vids)} video")
sys.exit(1 if bad else 0)
