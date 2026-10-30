#!/usr/bin/env python3
"""ucler Türkçe okunabilirlik ve zorluk sırası denetimi.

Kullanım:  npm run okunabilirlik             (ya da: python3 tools/okunabilirlik.py)
           python3 tools/okunabilirlik.py --rapor denetim/baska-ad.md
Çıktı: ekranda kısa özet, denetim/OKUNABILIRLIK.md içinde ayrıntılı rapor.
Gerekenler: yalnızca python3. İçeriği değiştirmez, yalnızca okur.

Ne ölçer?
1. Anlaşılırlık. Her kartın ve adımlı ders adımının metnine iki Türkçe formül uygulanır:
   - Ateşman (1997): 198,825 − 40,175 × (hece/kelime) − 2,610 × (kelime/cümle). Yüksek puan = kolay metin.
     90+ çok kolay, 70-89 kolay, 50-69 orta, 30-49 zor, 30 altı çok zor.
   - Bezirci-Yılmaz (2010): √(cümle başına kelime × (H3·0,84 + H4·1,5 + H5·3,5 + H6·26,25)),
     H3..H6 = cümle başına 3, 4, 5, 6+ heceli kelime sayısı. Sonuç yaklaşık sınıf düzeyidir (9-12 lise).
   Ayrıca uzun cümleler ve çok heceli kelime yığılan cümleler işaretlenir.
2. Zorluk sırası. Her karta 0-100 arası bir zorluk puanı verilir (metin ağırlığı + yeni terim + formül/sayı yükü).
   - Konu içi: kartlar kolaydan zora mı gidiyor? İlk kart konunun en zorlarından biri mi?
   - Dersler arası: bir konu, ön koşulu olan konudan belirgin biçimde kolay mı?
   - Terim sırası: bir terim (<b>kalın</b> yazılarak tanıtılan) tanıtıldığı yerden önce kullanılıyor mu?
Puanlar yol göstericidir, kesin hüküm değildir: fen metninde bazı uzun terimler zorunludur.
"""
import sys, os, re, json, math, statistics

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT = os.path.join(ROOT, "content")
RAPOR = os.path.join(ROOT, "denetim", "OKUNABILIRLIK.md")
if "--rapor" in sys.argv: RAPOR = os.path.abspath(sys.argv[sys.argv.index("--rapor") + 1])

# Eşikler (gerekirse buradan ayarla)
UZUN_CUMLE = 20          # kelime: bunu aşan cümle "bir göz at"
COK_UZUN_CUMLE = 28      # kelime: bunu aşan cümle "kesin bölünmeli"
AGIR_KELIME = 5          # hece: bu kadar ve üstü heceli kelime "ağır" sayılır
AGIR_YIGIN = 3           # bir cümlede bu kadar ağır kelime varsa uyarı
ATESMAN_ZOR = 40         # kartın Ateşman puanı bunun altındaysa "zor metin"
ILK_KART_FARK = 15       # ilk kart, konu ortancasından bu kadar zorsa uyarı
ONKOSUL_FARK = 12        # konu, ön koşulundan bu kadar kolaysa uyarı
EGIM_TERS = -0.35        # konu içi eğilim (Spearman) bunun altındaysa "zordan kolaya"

UNLU = set("aeıioöuüâîûAEIİOÖUÜÂÎÛ")
HARF = "A-Za-zÇĞİÖŞÜçğıöşüâîûÂÎÛ"

def tr_lower(s): return s.replace("I", "ı").replace("İ", "i").lower()

def duz(html):
    """HTML ve SVG'yi at, alt/üst simgeleri sil (H<sub>2</sub>O -> H2O)."""
    s = re.sub(r"<svg.*?</svg>", " ", html or "", flags=re.S)
    s = re.sub(r"<br\s*/?>", ". ", s)
    s = re.sub(r"<[^>]+>", "", s)
    s = s.replace("&nbsp;", " ").replace("•", ". ")
    return re.sub(r"\s+", " ", s).strip()

def cumleler(metin):
    # 3.5 gibi ondalıkları bölme; noktadan sonra büyük harf, rakam ya da tırnak gelince böl.
    parcalar = re.split(r"(?<=[.!?…])\s+(?=[\"“'(A-ZÇĞİÖŞÜ0-9])", metin)
    return [p.strip() for p in parcalar if re.search(f"[{HARF}]", p)]

def kelimeler(cumle):
    return re.findall(rf"[{HARF}0-9][{HARF}0-9'’\-·/]*", cumle)

def sembol_mu(k):
    """Formül, birim ya da kısaltma: hece sayısına katılmaz (NaCl, pH, ATP, m/s, F=ma...)."""
    if re.search(r"\d", k) or "/" in k or "·" in k: return True
    govde = re.split(r"['’]", k)[0]
    if len(govde) <= 1: return True
    if not any(h in UNLU for h in govde): return True
    if govde.isupper() and len(govde) <= 5: return True              # ATP, DNA, TYT
    if re.search(r"[a-zçğıöşü][A-ZÇĞİÖŞÜ]", govde): return True      # NaCl, CaCO
    return False

def hece(k): return max(1, sum(1 for h in k if h in UNLU))

def olc(metin):
    """Metnin istatistikleri. Sembol kelimeler cümle uzunluğuna sayılır, heceye sayılmaz."""
    cs = cumleler(metin)
    kel = 0; hec = 0; say = 0; H = [0, 0, 0, 0]; uzun = []; yigin = []
    for c in cs:
        ks = kelimeler(c)
        kel += len(ks)
        agir = []
        for k in ks:
            if sembol_mu(k): continue
            n = hece(k); say += 1; hec += n
            if n >= 3: H[min(n, 6) - 3] += 1
            if n >= AGIR_KELIME: agir.append(k)
        if len(ks) > UZUN_CUMLE: uzun.append((len(ks), c))
        if len(agir) >= AGIR_YIGIN: yigin.append((agir, c))
    nc = max(1, len(cs))
    oks = kel / nc
    hk = hec / say if say else 0
    atesman = 198.825 - 40.175 * hk - 2.610 * oks if say else None
    yod = math.sqrt(oks * (H[0] / nc * 0.84 + H[1] / nc * 1.5 + H[2] / nc * 3.5 + H[3] / nc * 26.25))
    return {"cumle": len(cs), "kelime": kel, "hk": hk, "oks": oks, "atesman": atesman, "yod": yod,
            "uzun": uzun, "yigin": yigin, "_hece": hec, "_say": say, "_H": H}

def birlesik(olcumler):
    """Birden çok metnin toplam Ateşman ve Bezirci-Yılmaz puanı."""
    nc = sum(o["cumle"] for o in olcumler) or 1
    kel = sum(o["kelime"] for o in olcumler); hec = sum(o["_hece"] for o in olcumler); say = sum(o["_say"] for o in olcumler) or 1
    H = [sum(o["_H"][i] for o in olcumler) for i in range(4)]
    oks = kel / nc
    return (198.825 - 40.175 * hec / say - 2.610 * oks,
            math.sqrt(oks * (H[0] / nc * 0.84 + H[1] / nc * 1.5 + H[2] / nc * 3.5 + H[3] / nc * 26.25)))

def seviye(a):
    if a is None: return "-"
    a = round(a)
    return "çok kolay" if a >= 90 else "kolay" if a >= 70 else "orta" if a >= 50 else "zor" if a >= 30 else "çok zor"

def spearman(xs):
    """Sıra ile değerler arasındaki Spearman eğilimi: +1 düzenli zorlaşma, −1 düzenli kolaylaşma."""
    n = len(xs)
    if n < 3: return 0.0
    sira = sorted(range(n), key=lambda i: xs[i]); r = [0] * n
    for s, i in enumerate(sira): r[i] = s
    d2 = sum((i - r[i]) ** 2 for i in range(n))
    return 1 - 6 * d2 / (n * (n * n - 1))

# --- Terimler: <b>kalın</b> yazılan, en az 3 heceli, tek ya da iki kelimelik ifadeler ---
EK = re.compile(r"(dır|dir|dur|dür|tır|tir|tur|tür|lar|ler|ları|leri|dan|den|tan|ten|da|de|ta|te|ın|in|un|ün|nın|nin|nun|nün|ı|i|u|ü|a|e|ya|ye|yı|yi|yu|yü)$")
def kok(ifade):
    s = tr_lower(duz(ifade)).strip(" .,:;()")
    if not re.fullmatch(rf"[{HARF}]+( [{HARF}]+)?", s): return None
    if sembol_mu(s.split()[-1]) or sum(hece(k) for k in s.split()) < 3: return None
    son = s.split()[-1]
    for _ in range(2):
        yeni = EK.sub("", son)
        if len(yeni) >= 5: son = yeni
    k = " ".join(s.split()[:-1] + [son])
    return k if len(k.replace(" ", "")) >= 5 else None

def gecis_ara(kok_, metin_kucuk):
    return re.search(rf"(?<![{HARF}]){re.escape(kok_)}", metin_kucuk) is not None

def main():
    dersler = json.load(open(os.path.join(CONTENT, "dersler.json"), encoding="utf-8"))
    kartlar = []      # her kart: ders, konu, sira, baslik, metin, olcum, zorluk...
    konular = {}      # (ders, id) -> bilgiler
    adimlar = []
    for ders, dbilgi in dersler.items():
        icerik = json.load(open(os.path.join(CONTENT, ders + ".json"), encoding="utf-8"))
        for ks, kb in enumerate(k for k in dbilgi["konular"] if k.get("id") in icerik):
            t = icerik[kb["id"]]
            konular[(ders, kb["id"])] = {"ders": ders, "id": kb["id"], "ad": t["title"], "sira": ks, "on": kb.get("on", []), "kartlar": []}
            for i, c in enumerate(t["cards"]):
                ozet = i == len(t["cards"]) - 1 and tr_lower(c["h"]).startswith("özet")
                metin = duz(c["p"])
                k = {"ders": ders, "konu": kb["id"], "konu_ad": t["title"], "i": i, "h": c["h"], "html": c["p"],
                     "metin": metin, "ozet": ozet, "o": olc(metin)}
                kartlar.append(k); konular[(ders, kb["id"])]["kartlar"].append(k)
    for f in sorted(os.listdir(os.path.join(CONTENT, "adimli"))):
        a = json.load(open(os.path.join(CONTENT, "adimli", f), encoding="utf-8"))
        for i, s in enumerate(a.get("adimlar", [])):
            metin = duz(s.get("metin", ""))
            if metin: adimlar.append({"ders": a.get("ders"), "konu": a.get("konu"), "i": i, "h": s.get("baslik", ""), "metin": metin, "o": olc(metin)})

    # Terimlerin ilk tanıtıldığı yer (ders sırasıyla) ve tanıtılmadan önce kullanıldığı yerler.
    # Kalın yazı vurgu için de kullanıldığından yalnızca tanım izi taşıyanlar terim sayılır:
    # kart başlığında geçiyor, ya da cümlede "denir / adı verilir / demektir / ... nedir" var,
    # ya da kalın ifadenin hemen ardından ":" veya "(" geliyor, ya da cümle kalın ifadeyle başlıyor.
    TANIM = re.compile(r"denir|adı verilir|demektir|adlandırılır|diye adlandır|denen|dediğimiz|deriz|nedir")
    terim_ilk = {}
    for k in kartlar:
        k["yeni_terim"] = []
        h_k = tr_lower(k["h"])
        for c in re.split(r"(?<=[.!?])\s+", k["html"]):
            for m in re.finditer(r"<b>(.*?)</b>", c):
                r = kok(m.group(1))
                if not r or (k["ders"], r) in terim_ilk: continue
                sonra = c[m.end():m.end() + 2]
                if (r in h_k or TANIM.search(tr_lower(c)) or sonra[:1] in ":(" or sonra[:2] == " (" or c.lstrip().startswith(m.group(0))):
                    terim_ilk[(k["ders"], r)] = k; k["yeni_terim"].append(duz(m.group(1)))
    kullanim = {}
    for k in kartlar:
        kucuk = tr_lower(duz(re.sub(r"<b>.*?</b>", " ", k["html"])))
        for (ders, r), tanim in terim_ilk.items():
            if ders != k["ders"] or tanim is k: continue
            tk, kk = konular[(ders, tanim["konu"])], konular[(ders, k["konu"])]
            if (kk["sira"], k["i"]) < (tk["sira"], tanim["i"]) and gecis_ara(r, kucuk):
                kullanim.setdefault((ders, r), []).append(k)
    # Tanımından önce 3+ farklı konuda geçen kelime gündelik kelimedir (ağırlık, sıcaklık): sayılmaz.
    erken = []
    for (ders, r), ks in kullanim.items():
        if len({k["konu"] for k in ks}) <= 2:
            erken.append((ks[0], r, terim_ilk[(ders, r)], len(ks)))

    # Zorluk puanı (0-100): metin ağırlığı %45, yeni terim %25, formül/sayı yükü %15, uzunluk %15
    for k in kartlar:
        a = k["o"]["atesman"] if k["o"]["atesman"] is not None else 50
        metin_p = min(100, max(0, 100 - a))
        terim_p = min(100, len(k["yeni_terim"]) * 25)
        formul = len(re.findall(r"=|<sub>|<sup>|[×·÷√∝Δ]|\d", k["html"]))
        formul_p = min(100, formul * 6)
        uzun_p = min(100, max(0, (k["o"]["kelime"] - 15) * 2.5))
        k["zor"] = round(0.45 * metin_p + 0.25 * terim_p + 0.15 * formul_p + 0.15 * uzun_p, 1)

    for kb in konular.values():
        ks = [k for k in kb["kartlar"] if not k["ozet"]]
        kb["zor"] = round(statistics.mean(k["zor"] for k in ks), 1) if ks else 0
        kb["egim"] = round(spearman([k["zor"] for k in ks]), 2)
        kb["atesman"], kb["yod"] = birlesik([k["o"] for k in kb["kartlar"]])
        kb["ilk_fark"] = round(ks[0]["zor"] - statistics.median(k["zor"] for k in ks), 1) if len(ks) >= 3 else 0

    # --- Bulgular ---
    kesin, bak = [], []   # (yer, açıklama)
    def yer(k): return f"{k['ders']}/{k['konu']} kart {k['i'] + 1} \"{k['h']}\""
    for k in kartlar + [dict(x, adim=True) for x in adimlar]:
        y = (f"{k['ders']}/{k['konu']} adım {k['i'] + 1} \"{k['h']}\"" if k.get("adim") else yer(k))
        for n, c in k["o"]["uzun"]:
            (kesin if n > COK_UZUN_CUMLE else bak).append((y, f"{n} kelimelik cümle: “{c}”"))
        for agir, c in k["o"]["yigin"]:
            bak.append((y, f"tek cümlede {len(agir)} ağır kelime ({', '.join(agir)}): “{c}”"))
    zor_metin = sorted([k for k in kartlar if k["o"]["atesman"] is not None and k["o"]["atesman"] < ATESMAN_ZOR and not k["ozet"]],
                       key=lambda k: k["o"]["atesman"])

    ters_konu = [kb for kb in konular.values() if kb["egim"] <= EGIM_TERS]
    zor_ilk = [kb for kb in konular.values() if kb["ilk_fark"] >= ILK_KART_FARK]
    onkosul = []
    for kb in konular.values():
        for on in kb["on"]:
            o = konular.get((kb["ders"], on))
            if o and o["zor"] - kb["zor"] >= ONKOSUL_FARK: onkosul.append((kb, o))

    # --- Rapor ---
    L = []
    w = L.append
    tum_a, tum_y = birlesik([k["o"] for k in kartlar])
    w("# Türkçe anlaşılırlık ve zorluk sırası raporu\n")
    w("Bu dosya `npm run okunabilirlik` komutuyla üretilir; elle düzenleme, yeniden çalıştırınca silinir.")
    w("Puanlar yol göstericidir. Fen metinlerinde bazı uzun terimler zorunlu olduğundan puan doğal olarak düşer.\n")
    w("## Kısa özet\n")
    w(f"- {len(konular)} konu, {len(kartlar)} kart, {len(adimlar)} adımlı ders adımı tarandı.")
    w(f"- Tüm kartların Ateşman puanı **{tum_a:.0f}** ({seviye(tum_a)}), Bezirci-Yılmaz sınıf düzeyi **{tum_y:.1f}**.")
    w(f"- Kesin düzeltilmesi önerilen: **{len(kesin)}** ({COK_UZUN_CUMLE} kelimeyi aşan cümle).")
    w(f"- Bir göz atılması önerilen: **{len(bak)}** uzun ya da ağır kelimeli cümle, **{len(zor_metin)}** zor metinli kart.")
    w(f"- Sıra: **{len(ters_konu)}** konu zordan kolaya gidiyor, **{len(zor_ilk)}** konunun ilk kartı fazla zor, "
      f"**{len(onkosul)}** konu ön koşulundan belirgin kolay, **{len(erken)}** terim tanıtılmadan önce kullanılıyor.\n")
    w("Puanların anlamı: Ateşman 90+ çok kolay, 70-89 kolay, 50-69 orta, 30-49 zor. Bezirci-Yılmaz yaklaşık sınıf düzeyidir (9-12 lise, 13-16 üniversite). "
      "Zorluk 0-100 arasıdır: metin ağırlığı, karttaki yeni terim sayısı, formül/sayı yükü ve uzunluktan hesaplanır.\n")

    w("## 1. Kesin düzeltilmesi önerilenler\n")
    w(f"{COK_UZUN_CUMLE} kelimeyi aşan cümleler. İkiye bölmek genellikle yeter.\n")
    for y, a in kesin: w(f"- **{y}**: {a}")
    if not kesin: w("Yok.")
    w("")

    w("## 2. Terim tanıtılmadan önce kullanılıyor\n")
    w("Bir terim **kalın** yazılarak tanıtıldığı karttan önce düz metinde geçiyor. Ya tanımı öne al, ya da ilk geçtiği yerde kısaca açıkla. "
      "Kelime gündelik anlamıyla geçiyorsa (ör. “hareket”) yok sayılabilir.\n")
    for k, r, t, n in erken:
        ayni = "aynı konuda" if k["konu"] == t["konu"] else "başka konuda"
        w(f"- “{r}…”: ilk geçtiği yer **{yer(k)}**, tanımı ({ayni}) **{yer(t)}**" + (f" ({n} yerde önce geçiyor)" if n > 1 else ""))
    if not erken: w("Yok.")
    w("")

    w("## 3. Konu sırası\n")
    w("### Zordan kolaya giden konular\n")
    w("Kartların zorluğu konu ilerledikçe azalıyor (eğilim −1'e yakınsa belirgin). Zor kartları sona almak ya da ilk kartları sadeleştirmek düşünülebilir.\n")
    for kb in sorted(ters_konu, key=lambda x: x["egim"]):
        w(f"- **{kb['ders']}/{kb['id']}** “{kb['ad']}”: eğilim {kb['egim']}, kart zorlukları {[k['zor'] for k in kb['kartlar'] if not k['ozet']]}")
    if not ters_konu: w("Yok.")
    w("\n### İlk kartı fazla zor olan konular\n")
    w("Konuya girişte öğrenci en kolay yerden başlamalı. İlk kart, konunun ortanca zorluğundan belirgin zor.\n")
    for kb in sorted(zor_ilk, key=lambda x: -x["ilk_fark"]):
        ilk = kb["kartlar"][0]
        w(f"- **{kb['ders']}/{kb['id']}** ilk kart “{ilk['h']}” zorluk {ilk['zor']} (ortancadan +{kb['ilk_fark']})")
    if not zor_ilk: w("Yok.")
    w("\n### Ön koşulundan kolay görünen konular\n")
    w("Bir konu, üzerine kurulduğu konudan belirgin kolaysa sıra ters olabilir ya da ön koşul konusu gereğinden ağır yazılmış olabilir.\n")
    for kb, o in onkosul:
        w(f"- **{kb['ders']}/{kb['id']}** (zorluk {kb['zor']}) ← ön koşul **{o['id']}** (zorluk {o['zor']})")
    if not onkosul: w("Yok.")
    w("")

    w("## 4. En zor metinli kartlar\n")
    w(f"Ateşman puanı {ATESMAN_ZOR}'ın altında olan kartlar, en zordan başlayarak (ilk 30).\n")
    w("| Kart | Ateşman | Cümle başına kelime |\n|---|---|---|")
    for k in zor_metin[:30]:
        w(f"| {yer(k)} | {k['o']['atesman']:.0f} | {k['o']['oks']:.1f} |")
    w("")

    w("## 5. Bir göz atılması önerilenler\n")
    w(f"{UZUN_CUMLE}-{COK_UZUN_CUMLE} kelimelik cümleler ve tek cümlede {AGIR_YIGIN}+ tane {AGIR_KELIME}+ heceli kelime.\n")
    for y, a in bak: w(f"- {y}: {a}")
    if not bak: w("Yok.")
    w("")

    w("## 6. Ders ve konu tablosu\n")
    for ders in dersler:
        ks = [kb for kb in konular.values() if kb["ders"] == ders]
        if not ks: continue
        da, dy = birlesik([k["o"] for kb in ks for k in kb["kartlar"]])
        w(f"### {dersler[ders].get('ad', ders)}: Ateşman {da:.0f} ({seviye(da)}), sınıf düzeyi {dy:.1f}, konu zorluk eğilimi {spearman([kb['zor'] for kb in ks]):.2f}\n")
        w("| # | Konu | Ateşman | Sınıf düzeyi | Zorluk | Kart içi eğilim |\n|---|---|---|---|---|---|")
        for kb in sorted(ks, key=lambda x: x["sira"]):
            w(f"| {kb['sira'] + 1} | {kb['ad']} | {kb['atesman']:.0f} | {kb['yod']:.1f} | {kb['zor']} | {kb['egim']:+.2f} |")
        w("")

    os.makedirs(os.path.dirname(RAPOR), exist_ok=True)
    open(RAPOR, "w", encoding="utf-8").write("\n".join(L) + "\n")

    print(f"Okunabilirlik: Ateşman {tum_a:.0f} ({seviye(tum_a)}), Bezirci-Yılmaz {tum_y:.1f}")
    print(f"Kesin: {len(kesin)} çok uzun cümle | Göz at: {len(bak)} cümle, {len(zor_metin)} zor kart")
    print(f"Sıra: {len(ters_konu)} ters konu, {len(zor_ilk)} zor ilk kart, {len(onkosul)} ön koşul uyarısı, {len(erken)} erken terim")
    print(f"Rapor: {os.path.relpath(RAPOR, ROOT)}")

if __name__ == "__main__":
    main()
