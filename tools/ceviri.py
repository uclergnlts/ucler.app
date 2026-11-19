#!/usr/bin/env python3
"""Ders içeriğinin İngilizcesi (docs/CEVIRI.md).

Türkçe içerik tek kaynaktır (content/<ders>.json, content/adimli/<konu>.json). İngilizce çeviriler konu başına
content/en/kaynak/<ders>/<konu>.json dosyasında "yol -> İngilizce metin" olarak durur. Yol, metnin Türkçe dosyadaki
yeridir: "cards.0.p", "quiz.2.o.1", SVG içindeki n. yazı için "cards.3.svg#n", adımlı ders için "A:adimlar.0.metin".

  python3 tools/ceviri.py cikar <ders> <konu>     çevrilecek metinleri yoluyla listeler (yalnız eksik ve değişenler: --eksik)
  python3 tools/ceviri.py al <ders> <konu> <dosya>  "yol<TAB>İngilizce" satırlarını konunun çeviri dosyasına ekler
  python3 tools/ceviri.py birlestir               content/en/<ders>.json ve content/en/adimli.json dosyalarını üretir
  python3 tools/ceviri.py denetle                 eksik, bayat (Türkçesi değişmiş) ve biçimi bozuk çevirileri yazar

Her çevirinin yanında Türkçe kaynağın kısa özeti (<konu>.ozet.json) tutulur; Türkçe metin değişirse çeviri "bayat"
sayılır ve denetim hata verir. birlestir özeti yalnızca --damgala ile günceller.
"""
import hashlib, json, os, re, sys

KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EN = os.path.join(KOK, "content", "en")
# Hiç çevrilmeyen anahtarlar (tür adları, değişken adları, formüller, sahne ayarları).
ATLA = {"tur", "ifade", "id", "ders", "konu"}
# Çevirisi isteğe bağlı: yazılmazsa Türkçesi kalır (birimler, semboller).
SERBEST = {"birim", "onek"}
HARF = re.compile(r"[A-Za-zÇĞİÖŞÜçğıöşü]{2,}")
SVG_YAZI = re.compile(r">([^<>]*[^\s<>][^<>]*)<")


def oku(yol):
    with open(yol, encoding="utf-8") as f:
        return json.load(f)


def yaz(yol, veri):
    os.makedirs(os.path.dirname(yol), exist_ok=True)
    with open(yol, "w", encoding="utf-8") as f:
        json.dump(veri, f, ensure_ascii=False, indent=1)
        f.write("\n")


def ozet(s):
    return hashlib.sha1(s.encode("utf-8")).hexdigest()[:8]


def metinler(o, yol="", ust=None, out=None):
    """(yol, metin, zorunlu) üçlüleri. SVG dizgileri yazı yazı ayrılır."""
    if out is None:
        out = []
    if isinstance(o, str):
        anahtar = yol.rsplit(".", 1)[-1] if not yol.rsplit(".", 1)[-1].isdigit() else (ust or "")
        if anahtar in ATLA or ".sahne." in "." + yol + "." or (anahtar == "ad" and re.search(r"(kontroller|girdiler)\.\d+\.ad$", yol)):
            return out
        if o.lstrip().startswith("<svg"):
            for i, m in enumerate(SVG_YAZI.finditer(o)):
                if HARF.search(m.group(1)) or re.search(r"\d,\d", m.group(1)):
                    out.append((f"{yol}#{i}", m.group(1), True))
        elif HARF.search(re.sub(r"<[^>]+>", "", o)) or re.search(r"\d,\d", o):
            out.append((yol, o, anahtar not in SERBEST))
    elif isinstance(o, list):
        for i, x in enumerate(o):
            metinler(x, f"{yol}.{i}" if yol else str(i), ust, out)
    elif isinstance(o, dict):
        for k, v in o.items():
            metinler(v, f"{yol}.{k}" if yol else k, k, out)
    return out


def uygula(o, cev, yol="", ust=None):
    if isinstance(o, str):
        if o.lstrip().startswith("<svg"):
            say = [-1]

            def degis(m):
                say[0] += 1
                y = cev.get(f"{yol}#{say[0]}")
                return m.group(0) if y is None else ">" + y + "<"
            return SVG_YAZI.sub(degis, o)
        return cev.get(yol, o)
    if isinstance(o, list):
        return [uygula(x, cev, f"{yol}.{i}" if yol else str(i), ust) for i, x in enumerate(o)]
    if isinstance(o, dict):
        return {k: uygula(v, cev, f"{yol}.{k}" if yol else k, k) for k, v in o.items()}
    return o


def kaynak(ders, konu):
    """Konunun Türkçe metinleri: kartlar + (varsa) adımlı ders, adımlı yollar 'A:' ile başlar."""
    t = oku(os.path.join(KOK, "content", f"{ders}.json"))[konu]
    out = metinler(t)
    a_yol = os.path.join(KOK, "content", "adimli", f"{konu}.json")
    a = oku(a_yol) if os.path.exists(a_yol) else None
    if a is not None and a.get("ders") == ders:
        out += [("A:" + y, m, z) for y, m, z in metinler(a)]
    else:
        a = None
    return t, a, out


def iz(s):
    """Biçim izi: etiketler ve sayılar çeviride korunmalı."""
    return sorted(re.findall(r"</?(?:b|em|sub|sup|br|i)\b", s))


def konular():
    d = oku(os.path.join(KOK, "content", "dersler.json"))
    return [(ders, k["id"]) for ders in d for k in d[ders]["konular"] if k.get("id")]


def cevrilenler():
    out = []
    for ders, konu in konular():
        if os.path.exists(os.path.join(EN, "kaynak", ders, f"{konu}.json")):
            out.append((ders, konu))
    return out


def durum(ders, konu):
    """(çeviri sözlüğü, eksik yollar, bayat yollar, biçim sorunları, fazla yollar)"""
    _, _, src = kaynak(ders, konu)
    cev = oku(os.path.join(EN, "kaynak", ders, f"{konu}.json"))
    oz_yol = os.path.join(EN, "kaynak", ders, f"{konu}.ozet.json")
    oz = oku(oz_yol) if os.path.exists(oz_yol) else {}
    eksik = [y for y, m, z in src if z and y not in cev]
    bayat = [y for y, m, z in src if y in cev and y in oz and oz[y] != ozet(m)]
    bicim = [y for y, m, z in src if y in cev and iz(m) != iz(cev[y])]
    # SVG içindeki tek harfli simge (ör. "v" altındaki "a" indisi) listede çıkmaz ama elle çevrilebilir: fazla sayılmaz.
    fazla = [y for y in cev if y not in {s[0] for s in src} and not re.search(r"svg#\d+$", y)]
    return cev, eksik, bayat, bicim, fazla


def main():
    a = sys.argv[1:]
    if not a:
        print(__doc__)
        return 1
    if a[0] == "cikar":
        ders, konu = a[1], a[2]
        _, _, src = kaynak(ders, konu)
        if "--eksik" in a:
            cev, eksik, bayat, _, _ = durum(ders, konu)
            src = [s for s in src if s[0] in set(eksik) | set(bayat)]
        for y, m, z in src:
            print(f"{y}\t{m}" + ("" if z else "\t(isteğe bağlı)"))
        return 0
    if a[0] == "al":
        ders, konu = a[1], a[2]
        yol = os.path.join(EN, "kaynak", ders, f"{konu}.json")
        cev = oku(yol) if os.path.exists(yol) else {}
        n = 0
        for satir in open(a[3], encoding="utf-8").read().split("\n"):
            if not satir.strip():
                continue
            if "\t" not in satir:
                print("okunamadı:", satir[:80])
                continue
            y, m = satir.split("\t", 1)
            cev[y] = m
            n += 1
        yaz(yol, cev)
        print(f"{n} satır alındı")
        return 0
    if a[0] in ("birlestir", "denetle"):
        hata = 0
        dersler, adimli = {}, {}
        for ders, konu in cevrilenler():
            t, ad, src = kaynak(ders, konu)
            cev, eksik, bayat, bicim, fazla = durum(ders, konu)
            for ad_, liste in (("EKSİK", eksik), ("BAYAT", bayat), ("BİÇİM", bicim), ("FAZLA", fazla)):
                for y in liste:
                    print(f"{ad_} {ders}/{konu} {y}")
                    hata += 1
            if a[0] == "birlestir":
                dersler.setdefault(ders, {})[konu] = uygula(t, {y: m for y, m in cev.items() if not y.startswith("A:")})
                if ad is not None:
                    adimli[konu] = uygula(ad, {y[2:]: m for y, m in cev.items() if y.startswith("A:")})
                if "--damgala" in a:
                    yaz(os.path.join(EN, "kaynak", ders, f"{konu}.ozet.json"), {y: ozet(m) for y, m, z in src if y in cev})
        if a[0] == "birlestir":
            tum = oku(os.path.join(KOK, "content", "dersler.json"))
            for ders in tum:
                yaz(os.path.join(EN, f"{ders}.json"), dersler.get(ders, {}))
            yaz(os.path.join(EN, "adimli.json"), adimli)
            # Üretilen dosyalar güncel mi denetimi için: denetle aynı içeriği yeniden kurup karşılaştırmaz, check.py birlestir'i koşar.
        print(f"{len(cevrilenler())} konu çevrili" + (f", {hata} sorun" if hata else ", TAMAM"))
        return 1 if hata else 0
    print(__doc__)
    return 1


if __name__ == "__main__":
    sys.exit(main())
