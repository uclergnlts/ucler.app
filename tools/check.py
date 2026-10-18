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

import math
FN = {"sqrt": math.sqrt, "abs": abs, "ln": math.log, "log": math.log10, "exp": math.exp,
      "sin": lambda x: math.sin(math.radians(x)), "cos": lambda x: math.cos(math.radians(x)), "tan": lambda x: math.tan(math.radians(x))}

def ifade_hesapla(ifade, v):
    """lib/ifade.ts ile aynı kurallar: yalnız sayılar, girdi adları, + - * / ^ ( ), pi, e ve FN içindeki işlevler."""
    toks = re.findall(r"\d+(?:\.\d+)?(?:e[+-]?\d+)?|[A-Za-z_][A-Za-z_0-9]*|[-+*/^()]|\S", ifade)
    out = []
    for t in toks:
        if re.fullmatch(r"[A-Za-z_]\w*", t):
            if t in v: out.append(f"V[{t!r}]")
            elif t in FN: out.append(f"FN[{t!r}]")
            elif t in ("pi", "e"): out.append(f"math.{t}")
            else: raise ValueError(f"bilinmeyen ad: {t}")
        elif t == "^": out.append("**")
        elif re.fullmatch(r"[\d.e+-]+|[-+*/()]", t): out.append(t)
        else: raise ValueError(f"yasak karakter: {t}")
    return eval(" ".join(out), {"__builtins__": {}, "math": math, "FN": FN, "V": v})

def etk_denetle(ders, tid, i, e):
    yer = (ders, tid, i, "etk:")
    tur = e.get("tur")
    SAYI = {"atom": {"p": (1, 20), "n": (0, 24), "e": (0, 20)}, "vektor": {"v": (1, 10), "aci": (0, 180)}, "osmoz": {"c": (0, 2)}}
    if tur in SAYI:
        for k, (lo, hi) in SAYI[tur].items():
            if not isinstance(e.get(k), (int, float)) or not lo <= e[k] <= hi: err(*yer, k, "eksik ya da aralık dışı")
        return
    if tur not in ("sirala", "eslestir", "ayir", "isaretle", "formul"): return err(*yer, "bilinmeyen tür", tur)
    if tur != "formul" and not e.get("soru"): err(*yer, "soru yok")
    if tur == "sirala":
        o = e.get("ogeler", [])
        if not 3 <= len(o) <= 7 or len(set(o)) != len(o): err(*yer, "sirala: 3-7 farklı öğe olmalı")
    elif tur == "eslestir":
        c = e.get("ciftler", [])
        if not 3 <= len(c) <= 6 or any(len(x) != 2 for x in c): err(*yer, "eslestir: 3-6 çift olmalı")
        elif len({x[0] for x in c}) != len(c) or len({x[1] for x in c}) != len(c): err(*yer, "eslestir: tekrar eden öğe")
    elif tur == "ayir":
        g, o = e.get("gruplar", []), e.get("ogeler", [])
        if not 2 <= len(g) <= 3: err(*yer, "ayir: 2-3 grup olmalı")
        if not 4 <= len(o) <= 10: err(*yer, "ayir: 4-10 öğe olmalı")
        for x in o:
            if not (2 <= len(x) <= 3 and isinstance(x[1], int) and 0 <= x[1] < len(g)): err(*yer, "ayir: öğe biçimi", x)
        if len({x[1] for x in o if len(x) > 1}) < len(g): err(*yer, "ayir: boş grup var")
    elif tur == "isaretle":
        n = e.get("noktalar", [])
        if not 3 <= len(n) <= 7: err(*yer, "isaretle: 3-7 nokta olmalı")
        for p in n:
            if not (0 <= p.get("x", -1) <= 320 and 0 <= p.get("y", -1) <= 200 and p.get("ad") and p.get("acik")): err(*yer, "isaretle: nokta biçimi", p)
        for a in range(len(n)):
            for b in range(a + 1, len(n)):
                if math.hypot(n[a]["x"] - n[b]["x"], n[a]["y"] - n[b]["y"]) < 22: err(*yer, "isaretle: noktalar çok yakın", n[a]["ad"], n[b]["ad"])
    elif tur == "formul":
        G, C = e.get("girdiler", []), e.get("ciktilar", [])
        if not 1 <= len(G) <= 3 or not 1 <= len(C) <= 3: err(*yer, "formul: 1-3 girdi, 1-3 çıktı")
        for g in G:
            if not all(k in g for k in ("ad", "etiket", "min", "max", "adim", "deger")) or not g["min"] <= g["deger"] <= g["max"] or g["adim"] <= 0:
                err(*yer, "formul: girdi biçimi", g.get("ad"))
        for c in C:
            for uc in ("min", "deger", "max"):
                v = {g["ad"]: g[uc] for g in G if uc in g}
                try:
                    x = ifade_hesapla(c.get("ifade", ""), v)
                    if not math.isfinite(x): raise ValueError("sonsuz")
                except Exception as ex:
                    if uc == "deger" or not isinstance(ex, (ZeroDivisionError, ValueError, OverflowError)): err(*yer, "formul:", c.get("ad"), uc, "değerinde hesaplanamıyor", ex)
                    else: warn.append(f"{ders} {tid} {i}: formül {c.get('ad')} {uc} ucunda tanımsız ({ex})")
        y = e.get("yorum")
        if y is not None and (not y or y[-1][0] is not None): err(*yer, "formul: yorumun son satırı [null, metin] olmalı")

# Video süresi (Üçler, 2026-10-16 17:31): KIM-01..KIM-10 45-60 sn kalır; sonraki bütün videolar 1-3 dk.
# Damla sesi saniyede ~1,95 kelime okur: 60 sn ≈ 120 kelime, 180 sn ≈ 345 kelime.
ILK_DALGA = {f"KIM-{i:02d}" for i in range(1, 11)}
def sure_siniri(vid): return (45, 60) if vid in ILK_DALGA else (60, 180)
def kelime_siniri(vid): return (100, 115) if vid in ILK_DALGA else (120, 340)

for ders, topics in d.items():
    for tid, t in topics.items():
        for k in ("title", "summary", "cards", "quiz"):
            if k not in t: err(ders, tid, "eksik alan", k)
        cards = t.get("cards", [])
        if not 6 <= len(cards) <= 16: err(ders, tid, "kart sayısı", len(cards), "(6-16 olmalı)")
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
            if "etk" in c: etk_denetle(ders, tid, i, c["etk"])
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
        else:
            lo, hi = sure_siniri(vid)
            if not lo <= sure <= hi: warn.append(f"video {vid}: {sure} sn (karar {lo}-{hi} sn)")
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
    else:
        lo, hi = kelime_siniri(os.path.basename(f)[:-3])
        if not lo <= n <= hi: warn.append(f"senaryo {os.path.basename(f)}: {n} kelime (hedef {lo}-{hi})")

# adımlı dersler (content/adimli/*.json): sahne adı, tek doğru şık, ulaşılabilir hedef, kontrol sınırları
SAHNE_DIR = os.path.join(ROOT, "components", "sahne")
sahneler = set()
for f in glob.glob(os.path.join(SAHNE_DIR, "*.tsx")):
    m = re.search(r"export const \w+: Record<string, SahneKaydi> = \{(.*?)\n\};", open(f, encoding="utf-8").read(), re.S)
    if m: sahneler |= set(re.findall(r'^\s{2}"?([a-z][a-z0-9-]*)"?:\s*\{', m.group(1), re.M))
adimli_idler = set()
for f in sorted(glob.glob(os.path.join(CONTENT, "adimli", "*.json"))):
    a = json.load(open(f, encoding="utf-8")); ad = os.path.basename(f)
    if a.get("id") in adimli_idler: err("adımlı", ad, "id tekrar ediyor:", a.get("id"))
    adimli_idler.add(a.get("id"))
    if a.get("ders") not in dersler: err("adımlı", ad, "bilinmeyen ders:", a.get("ders"))
    elif not sys.argv[1:] and a.get("konu") not in d.get(a["ders"], {}): err("adımlı", ad, "böyle bir hazır konu yok:", a.get("konu"))
    for k in ("baslik", "ozet", "adimlar", "kapanis"):
        if not a.get(k): err("adımlı", ad, "eksik alan:", k)
    for n, s in enumerate(a.get("adimlar", []), 1):
        yer = f"{ad} adım {n}"
        tur = s.get("sahne", {}).get("tur")
        if tur not in sahneler: err("adımlı", yer, "bilinmeyen sahne:", tur)
        if not s.get("metin"): err("adımlı", yer, "metin boş")
        deger, kont = s.get("deger", {}), {k["ad"]: k for k in s.get("kontroller", [])}
        for k in kont.values():
            if k.get("tur", "surgu") not in ("surgu", "sayac", "anahtar"): err("adımlı", yer, "bilinmeyen kontrol türü:", k.get("tur"))
            if k["ad"] not in deger: err("adımlı", yer, "kontrolün başlangıç değeri yok:", k["ad"])
            elif not k["min"] <= deger[k["ad"]] <= k["max"]: err("adımlı", yer, k["ad"], "başlangıç değeri sınırların dışında")
        g = s.get("gorev", {}); gt = g.get("tur")
        if gt not in ("devam", "oynat", "secim", "tahmin", "ayarla"): err("adımlı", yer, "bilinmeyen görev:", gt); continue
        if gt in ("oynat", "tahmin") and not s["sahne"].get("sure"): err("adımlı", yer, gt, "görevi için sahnede sure gerekli")
        if gt in ("secim", "tahmin"):
            sec = g.get("secenekler", [])
            if not g.get("soru"): err("adımlı", yer, "soru boş")
            if len(sec) < 2: err("adımlı", yer, "en az iki şık gerekli")
            if sum(1 for x in sec if x.get("dogru")) != 1: err("adımlı", yer, "tam bir doğru şık olmalı")
            for x in sec:
                if not x.get("neden"): err("adımlı", yer, "şıkta neden boş:", x.get("yazi", "")[:30])
                if not re.sub(r"<svg.*?</svg>", "", x.get("yazi", ""), flags=re.S).strip() and not x.get("etiket"): err("adımlı", yer, "yalnızca görsel olan şıkta etiket yok")
            if g.get("kosu") and not (s["sahne"].get("sure") and kont): err("adımlı", yer, "kosu için oynatılabilir sahne ve kontrol gerekli")
        if gt == "ayarla":
            if not g.get("tamam"): err("adımlı", yer, "tamam metni boş")
            hedef = g.get("hedef", {})
            if not hedef: err("adımlı", yer, "hedef boş")
            for k, h in hedef.items():
                if k not in kont: err("adımlı", yer, "hedefteki değerin kontrolü yok:", k); continue
                lo, hi = (h if isinstance(h, list) else (h, h))
                c = kont[k]; adim = c.get("adim", 1)
                adimlar = [c["min"] + i * adim for i in range(int(round((c["max"] - c["min"]) / adim)) + 1)]  # adım kesirli olabilir (0,5)
                ulasir = [x for x in adimlar if lo - 1e-9 <= x <= hi + 1e-9]
                if not ulasir: err("adımlı", yer, k, "hedefi kontrolle ulaşılamaz:", h)
            if hedef and all(k in deger and (deger[k] == h if not isinstance(h, list) else h[0] <= deger[k] <= h[1]) for k, h in hedef.items()):
                warn.append(f"adımlı {yer}: hedef başlangıçta zaten sağlanıyor")

for w in warn: print("UYARI:", w)
print("TAMAM" if not bad else f"{bad} sorun")
for ders, topics in d.items():
    print(f"  {ders}: {len(topics)} konu hazır -> {', '.join(topics)}")
if os.path.exists(VIDEO_JSON) and not sys.argv[1:]: print(f"  videolar: {len(vids)} video")
if adimli_idler: print(f"  adımlı dersler: {len(adimli_idler)} ders")
sys.exit(1 if bad else 0)
