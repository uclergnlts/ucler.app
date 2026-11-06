#!/usr/bin/env python3
"""ucler doğal Türkçe denetimi: "yapay zekâ Türkçesi" ve TDK yüzey hatası taraması.

Kullanım:  npm run dogal-turkce               (ya da: python3 tools/dogal-turkce.py)
           python3 tools/dogal-turkce.py --rapor denetim/baska-ad.md
           python3 tools/dogal-turkce.py --dosya metin.txt   (tek bir metni tara, örn. Instagram açıklaması)
Çıktı: ekranda kısa özet, denetim/DOGAL-TURKCE.md içinde ayrıntılı rapor.
Gerekenler: yalnızca python3. Hiçbir dosyayı değiştirmez, yalnızca okur.

Kurallar docs/DOGAL-TURKCE.md belgesindedir. Kaynak: yucezerey/turkish-anti-ai-skill (MIT),
ucler'in ders anlatımı üslubuna göre seçilip uyarlandı. Örneğin "-dır" ile biten tanım
cümleleri bizde doğaldır ("Buna denatürasyon denir."), bu yüzden "-DIr" eki sayılmaz;
yalnızca "-mAktAdIr" yığılması ve art arda aynı ekle biten cümle zinciri işaretlenir.

Taranan metinler:
  content/{fizik,kimya,biyoloji}.json   kart, test, özet ve geri bildirim metinleri
  content/adimli/*.json                  adımlı ders metinleri
  content/videolar.json, yenilikler     video başlıkları, yenilik notları
  video/senaryolar/*.md                  yalnızca "Konuşma metni" bölümü (seslendirme)
  app/, components/, lib/                arayüz yazıları (JSX metni ve Türkçe dizgeler)
  supabase/functions/                    e-posta metinleri

İki düzey vardır:
  KESİN   neredeyse her zaman düzeltilmeli (klişe, uzun çizgi, TDK yazım hatası...)
  GÖZ AT  bağlama bakılmalı; fen metninde doğru olabilir ("sonuç olarak" bir hesabın sonucuysa)
"""
import sys, os, re, json, glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAPOR = os.path.join(ROOT, "denetim", "DOGAL-TURKCE.md")
if "--rapor" in sys.argv: RAPOR = os.path.abspath(sys.argv[sys.argv.index("--rapor") + 1])

I = re.IGNORECASE
# (desen, kural adı, öneri, düzey, bayrak)
KURALLAR = [
    # 1. Kalıp ve klişe (yapay zekâ ifşası)
    (r"\byadsınamaz|\binkar\s+edilemez|\binkâr\s+edilemez", "Klişe: yadsınamaz", "Olguyu doğrudan yaz.", "KESİN", I),
    (r"\badeta\b", "Klişe: adeta", "Sil ya da 'gibi' kullan.", "KESİN", I),
    (r"\bderinlemesine\b|\bmercek\s+altına", "Klişe: derinlemesine / mercek altına", "'ayrıntısına bakalım', 'yakından inceleyelim'.", "KESİN", I),
    (r"\b(?:kritik|kilit|hayati|önemli|büyük|merkezi)\s+(?:bir\s+)?rol\s+(?:oyna|üstlen)\w*", "Klişe: ... rol oynar", "Fiili kendisi söylesin: 'X'i Y belirler', 'Y olmadan X olmaz'.", "KESİN", I),
    (r"\b(?:hayati|kritik|büyük)\s+(?:bir\s+)?öneme?\s+sahip\w*", "Klişe: hayati öneme sahip", "'çok önemli', 'şart' ya da nedenini söyle.", "KESİN", I),
    (r"\bgeniş\s+bir\s+yelpaze|\bzengin\s+bir\s+(?:doku|mozaik)|\bmozaiğ\w*", "Klişe: geniş bir yelpaze / mozaik", "Somut say: 'üç farklı alanda'.", "KESİN", I),
    (r"\b(?:sadece|yalnızca)\s+[^,.!?;:]{1,60}?\s+değil,?\s*aynı\s+zamanda\b", "Negatif paralellik: sadece X değil, aynı zamanda Y", "'Hem X hem Y' ya da yalnızca Y'yi söyle.", "KESİN", I),
    (r"\b(?:sadece|yalnızca)\s+[^,.!?;:]{1,60}?\s+(?:olmakla|yapmakla|kalmakla|göstermekle)\s+kalma\w*", "Negatif paralellik: ... olmakla kalmayıp", "'Hem X hem Y'.", "KESİN", I),
    (r"\bgünümüzün\s+hızla\s+değişen|\bdijitalleşen\s+çağımızda|\bhızla\s+değişen\s+dünya", "Sahneleme girişi", "Sil, konuya doğrudan gir.", "KESİN", I),
    (r"\bçığır\s+açan\b|\bdönüm\s+noktası\w*|\bkilometre\s+taşı\w*", "Şişirme: çığır açan / dönüm noktası", "Ne değiştiğini somut söyle. (Bilim tarihinde gerçekten dönüm noktasıysa kalabilir.)", "GÖZ AT", I),
    (r"\bpotansiyelini\s+(?:ortaya\s+çıkar|açığa\s+çıkar)\w*|\bbir\s+üst\s+seviyeye\s+taşı\w*|\bkilidini\s+aç\w*", "Pazarlama klişesi", "'geliştir', 'hızlandır', ne kazanıldığını söyle.", "KESİN", I),
    (r"\b(?:en\s+büyük\s+)?(?:kanıtıdır|göstergesidir|nişanesidir)\b", "Şişirme: ...nın kanıtıdır", "'...-dığını gösterir'.", "GÖZ AT", I),
    (r"\bkusursuz\s+bir\s+şekilde|\bpürüzsüz(?:ce|\s+bir\s+şekilde)|\bzahmetsizce\b|\btitizlikle\b", "Klişe: kusursuz bir şekilde / titizlikle", "'kolayca', 'takılmadan' ya da somut kanıt.", "KESİN", I),
    (r"\boyunun\s+kurallarını\s+değiştir\w*|\boyun\s+değiştirici", "Çeviri klişesi: oyunun kurallarını değiştiren", "Ne değiştiğini söyle.", "KESİN", I),
    (r"\bbaşlamaya\s+hazır\s+mısın\w*|\bhadi\s+(?:başlayalım|dalalım)|\bgelin\s+(?:birlikte\s+)?(?:inceleyelim|bakalım)", "Çeviri klişesi: Başlamaya hazır mısın? / Gelin birlikte...", "Sil ya da 'Hemen başla'.", "KESİN", I),
    (r"\bbu\s+(?:yazıda|derste|videoda|bölümde)\s+[^.!?]{0,60}?(?:ele\s+alacağız|inceleyeceğiz|öğreneceğiz|göreceğiz)", "Sahneleme: Bu derste X'i ele alacağız", "Duyurmadan konuya gir.", "GÖZ AT", I),
    # 2. Dolgu, bürokratik bağlaç, kapanış
    (r"\bbununla\s+birlikte\b|\böte\s+yandan\b|\bbuna\s+ek\s+olarak\b", "Geçiş dolgusu: bununla birlikte / öte yandan", "Sil ya da 'ama', 'ayrıca', 'ise'.", "GÖZ AT", I),
    (r"\bbelirtmek\s+gerekir\s+ki|\bunutulmamalıdır\s+ki|\b(?:vurgulamak|belirtmek|not\s+etmek)\s+(?:gerekir|önemlidir|gerekiyor)\s*(?:ki)?|\bşunu\s+(?:belirtelim|vurgulayalım)", "Sahte vurgu girişi", "Duyurmayı sil, bilgiyi yaz.", "KESİN", I),
    (r"\bsöz\s+konusu\b|\bbu\s+bağlamda\b|\bbu\s+doğrultuda\b|\bbu\s+çerçevede\b|\bbahsi\s+geçen\b|\bmezkûr\b", "Bürokratik gönderim: söz konusu / bu bağlamda", "'bu', 'o' ya da ismin kendisi.", "GÖZ AT", I),
    (r"\bözetlemek\s+gerekirse\b|\bson\s+tahlilde\b|\bgenel\s+bir\s+değerlendirme", "Özet kuyruğu", "Etiketi sil, son sözü söyle.", "KESİN", I),
    (r"\bsonuç\s+olarak\b", "Kapanış etiketi: sonuç olarak", "Bir hesabın ya da olayın sonucuysa kalsın; paragraf kapanışıysa sil.", "GÖZ AT", I),
    (r"\bbütüncül\s+(?:bir\s+)?yaklaşım|\bparadigma\s+değişimi|\bsinerji\b|\bholistik\b|\bproaktif\b", "Kurumsal jargon", "Somut karşılık yaz.", "KESİN", I),
    (r"\b(?:uzmanlar|araştırmalar|bilim\s+insanları)\s+(?:belirtiyor|gösteriyor|göstermektedir|belirtmektedir)\s+ki\b|\bpek\s+çok\s+gözlemciye\s+göre", "Belirsiz otorite", "Kaynağın adını yaz ya da cümleyi sil.", "KESİN", I),
    (r"\bpotansiyel\s+olarak\b[^.!?]{0,40}?(?:ebil|abil)", "İhtiyat yığılması", "Tek ihtiyat yeter: '-ebilir'.", "KESİN", I),
    # 3. Cümle yapısı
    (r"\btarafından\s+(?:gerçekleştiril|sağlan|yapıl|paylaşıl|geliştiril|hazırlan)\w*", "Edilgen + kof fiil: ... tarafından gerçekleştirilir", "Etken çatı: 'Enzim parçalar.'", "GÖZ AT", I),
    (r"\b\w+(?:mekte|makta)d[ıi]r\b", "-mAktAdIr eki", "Ders anlatımında geniş zaman ya da şimdiki zaman: 'hızlanır', 'hızlanıyor'.", "GÖZ AT", I),
    (r"\b(?:göstermektedir|belirtmektedir|kanıtlamaktadır|ortaya\s+koymaktadır)\s+ki\b", "Çeviri yan cümlesi: ...-mektedir ki", "Sola dallanan cümle kur.", "KESİN", I),
    (r"\b(?:katkıda\s+bulun|ev\s+sahipliği\s+yap|artış\s+sağla|azalma\s+sağla|gerçekleştirmekte)\w*", "Kof yardımcı fiil", "'katkı sunar', 'artırır', 'azaltır', 'yapar'.", "GÖZ AT", I),
    (r"\b(?:büyük|yüksek|kritik|ciddi|derin|önemli)\s+bir\s+(?:önem|performans|etki|artış|büyüme|başarı|fark)\b", "Gereksiz 'bir' (a/an çevirisi)", "'büyük etki', 'ciddi artış'.", "GÖZ AT", I),
    # 4. Noktalama ve TDK yazımı
    (r"—", "Uzun çizgi (—)", "Virgül ya da nokta koy. Uzun çizgi yalnızca diyalogda kullanılır.", "KESİN", 0),
    # Kimyasal bağ (H–H, C–H, A–T) ve grafik ekseni (V–I) gösteriminde orta çizgi doğrudur, işaretlenmez.
    (r"(?<=\d)\s?–\s?(?=\d)|(?<=\d\s)–\s?(?=\d)", "Sayı aralığında orta çizgi (–)", "Aralıkta kısa çizgi: 2024-2026, 38-39 °C.", "KESİN", 0),
    (r"(?<=[a-zçğıöşü])\s–\s(?=[a-zçğıöşüA-ZÇĞİÖŞÜ])", "Ara söz için orta çizgi ( – )", "Virgül, nokta ya da iki nokta. Eşleştirme etiketinde 've' ile bağla.", "GÖZ AT", 0),
    (r",\s*(?:ve|veya|ya\s+da|ile)\s", "Bağlaçtan önce virgül (ve / veya / ya da)", "Virgülü sil.", "GÖZ AT", I),
    (r",\s*(?:ama|fakat|lakin)\s", "Bağlaçtan önce virgül (ama / fakat)", "Virgülsüz daha doğal: 'Hızlı ama pahalı.' Yeni yazarken uy; eski metni toplu düzeltmeye gerek yok.", "ÜSLUP", I),
    (r"\b(?:birşey|herşey|hiçbirşey|yada|bir\s+çok\b|bir\s+kaç\b|pekçok|ard\s+arda|artarda|yanısıra|işbirliği|farketm\w*|farkettir\w*|terketm\w*|halbu\s+ki|oysa\s+ki|madem\s+ki|hiç\s+bir\b|her\s+hangi|herhangibir|yanyana|içiçe|başbaşa|kayıt\s+etm\w*|red\s+etm\w*|keşif\s+etm\w*)", "TDK yazım hatası", "birçok, birkaç, pek çok, art arda, yanı sıra, iş birliği, fark etmek, hiçbir, herhangi bir, ya da, bir şey, her şey...", "KESİN", I),
    (r"(?<![\d.])(?:[01]?\d|2[0-3]):[0-5]\d(?![\d:])", "Saatte iki nokta (12:00)", "TDK: 12.00, 21.30.", "GÖZ AT", 0),
    (r"%\s?\d+\.\d+|(?<![\d.\w])\d+\.(?!\d{3}(?!\d))\d+\s?(?:°C|K|m/s|kg|g|mol|L|mL|cm|mm|km|N|J|W|V|A|Ω|Pa|atm|eV|Hz|s\b|%)", "Ondalıkta nokta (9.8)", "Türkçede ondalık virgülle yazılır: 9,8 m/s².", "KESİN", 0),
    (r"%\s\d", "Yüzde işaretinden sonra boşluk", "%25 (bitişik).", "GÖZ AT", 0),
    # 5. Sohbet artığı
    (r"\belbette[!,]|\bharika\s+(?:bir\s+)?soru|\bumarım\s+(?:bu|işine|faydalı)|\bbaşka\s+bir\s+(?:sorun|değişiklik)\s+(?:olursa|isterseniz)", "Sohbet artığı", "Sil.", "KESİN", I),
]
DERLI = [(re.compile(d, b), ad, oneri, duzey) for d, ad, oneri, duzey, b in KURALLAR]

# Arayüzde ve kodda kalıp olarak geçen, metin olmayan şeyler (yanlış alarm önler)
YOKSAY = re.compile(r"https?://|\bclassName\b|\bvar\(--")

def duz(html):
    s = re.sub(r"<svg.*?</svg>", " ", html or "", flags=re.S)
    s = re.sub(r"<br\s*/?>", " ", s)
    s = re.sub(r"<[^>]+>", "", s)
    s = s.replace("&nbsp;", " ").replace("&amp;", "&")
    return re.sub(r"\s+", " ", s).strip()

TR = re.compile(r"[A-Za-zÇĞİÖŞÜçğıöşü]{2,}\s+[A-Za-zÇĞİÖŞÜçğıöşü]{2,}")
ATLA_ANAHTAR = {"svg", "id", "img", "sahne", "tur", "ad", "renk", "ikon", "on", "url", "src", "poster", "kart", "kartlar", "video"}

def json_metinleri(veri, yol=""):
    """JSON içindeki insanın okuyacağı tüm dizgeleri (yol, metin) olarak verir."""
    if isinstance(veri, dict):
        for k, v in veri.items():
            if k in ATLA_ANAHTAR: continue
            yield from json_metinleri(v, f"{yol}.{k}" if yol else k)
    elif isinstance(veri, list):
        for i, v in enumerate(veri):
            yield from json_metinleri(v, f"{yol}[{i}]")
    elif isinstance(veri, str):
        if veri.lstrip().startswith("<svg") or not TR.search(veri): return
        yield yol, duz(veri)

def kaynaklar():
    """(tür, dosya, yer, metin) dörtlüleri."""
    for ders in ("fizik", "kimya", "biyoloji"):
        f = os.path.join(ROOT, "content", ders + ".json")
        for konu, t in json.load(open(f, encoding="utf-8")).items():
            for yol, m in json_metinleri(t):
                yield "İçerik", f"content/{ders}.json", f"{konu} › {yol}", m
    for f in sorted(glob.glob(os.path.join(ROOT, "content", "adimli", "*.json"))):
        for yol, m in json_metinleri(json.load(open(f, encoding="utf-8"))):
            yield "Adımlı ders", os.path.relpath(f, ROOT), yol, m
    for f in [os.path.join(ROOT, "content", "videolar.json"), os.path.join(ROOT, "app", "yenilikler.json")]:
        if os.path.isfile(f):
            for yol, m in json_metinleri(json.load(open(f, encoding="utf-8"))):
                yield "Video ve yenilik", os.path.relpath(f, ROOT), yol, m
    for f in sorted(glob.glob(os.path.join(ROOT, "video", "senaryolar", "*.md"))):
        metin = open(f, encoding="utf-8").read()
        b = re.search(r"##\s*Konuşma metni[^\n]*\n(.*?)(?=\n##\s|\Z)", metin, re.S)
        if not b: continue
        for i, p in enumerate(x.strip() for x in b.group(1).split("\n\n")):
            if TR.search(p): yield "Video seslendirme", os.path.relpath(f, ROOT), f"paragraf {i + 1}", p
    kod = []
    for kalip in ("app/**/*.tsx", "app/**/*.ts", "components/**/*.tsx", "lib/**/*.ts", "supabase/functions/**/*.ts"):
        kod += glob.glob(os.path.join(ROOT, kalip), recursive=True)
    for f in sorted(set(kod)):
        tur = "E-posta" if "supabase" in f else "Arayüz"
        for no, satir in enumerate(open(f, encoding="utf-8"), 1):
            s = satir.strip()
            if s.startswith(("//", "*", "/*", "import ")) or YOKSAY.search(s): continue
            parcalar = re.findall(r">([^<>{}]+)<", s) + re.findall(r"[\"'`]([^\"'`]{6,})[\"'`]", s)
            if not parcalar and not re.search(r"[<>{}=;()]", s): parcalar = [s]   # JSX içinde düz metin satırı
            for p in parcalar:
                if TR.search(p) and re.search(r"[çğıöşüÇĞİÖŞÜ]|\s(?:ve|bir|bu|ile)\s", p):
                    yield tur, os.path.relpath(f, ROOT), f"satır {no}", duz(p)

def cumleler(m):
    return [c for c in re.split(r"(?<=[^\d\s][.!?…])\s+", m) if len(c.split()) > 1]

def bitis(c):
    w = re.findall(r"\w+", c.lower())
    if not w: return None
    if re.search(r"m[ae]kt[ae]d[ıi]r$", w[-1]): return "-mAktAdIr"
    if re.search(r"m[ıiuü]şt[ıiuü]r$", w[-1]): return "-mIştIr"
    return None

def baslik_title_case(h):
    w = [x for x in re.findall(r"[A-Za-zÇĞİÖŞÜçğıöşü]+", h)]
    if len(w) < 3: return False
    kucuk = {"ve", "ile", "ya", "da", "de", "ki", "mi", "veya"}
    icerik = [x for x in w[1:] if x.lower() not in kucuk and len(x) >= 3 and x[1:] == x[1:].lower()]
    return len(icerik) >= 2 and all(x[0].isupper() for x in icerik) and any(x[0].isupper() and x.lower() == x.lower() and not x.isupper() for x in icerik)

def tara_metin(m):
    """Tek bir metindeki bulgular: [(düzey, kural, eşleşme, öneri)]."""
    out = []
    for r, ad, oneri, duzey in DERLI:
        for e in r.finditer(m):
            out.append((duzey, ad, e.group(0).strip(), oneri))
    cs = cumleler(m); seri = 0; onceki = None
    for c in cs:
        b = bitis(c)
        seri = seri + 1 if b and b == onceki else (1 if b else 0); onceki = b
        if seri == 3: out.append(("GÖZ AT", "Art arda 3 cümle aynı ekle bitiyor", b, "Birini geniş zamana çevir ya da cümleleri birleştir."))
    if ";" in m and not re.search(r"[a-zçğıöşü]\s*;\s*[a-zçğıöşü0-9]+\s*$", m):
        for e in re.finditer(r"[^;.!?]{12,};\s*[^;.!?]{12,}", m):
            out.append(("GÖZ AT", "Noktalı virgülle bağlanmış iki cümle", e.group(0)[:90], "İki ayrı cümle yaz."))
    return out

def kontrol(kok_dosya=None):
    bulgular = []   # (tür, dosya, yer, düzey, kural, eşleşme, öneri, bağlam)
    if kok_dosya:
        kaynak = [("Dosya", kok_dosya, f"paragraf {i + 1}", p) for i, p in enumerate(open(kok_dosya, encoding="utf-8").read().split("\n\n")) if p.strip()]
    else:
        kaynak = kaynaklar()
    sayac = {}
    for tur, dosya, yer, m in kaynak:
        sayac[tur] = sayac.get(tur, 0) + 1
        for duzey, ad, es, oneri in tara_metin(m):
            bulgular.append((tur, dosya, yer, duzey, ad, es, oneri, m))
        if not kok_dosya and dosya.startswith("content/") and re.search(r"\.h$|\.title$|\.baslik$", yer) and baslik_title_case(m):
            bulgular.append((tur, dosya, yer, "GÖZ AT", "Başlıkta her kelime büyük harfle (Title Case)", m, "Türkçede başlık tümce düzeninde yazılır: 'Atomun yapısı'.", m))
    return bulgular, sayac

def rapor(bulgular, sayac):
    from datetime import date
    kesin = [b for b in bulgular if b[3] == "KESİN"]; gozat = [b for b in bulgular if b[3] == "GÖZ AT"]
    uslup = [b for b in bulgular if b[3] == "ÜSLUP"]
    kural_say = {}
    for b in bulgular: kural_say[(b[3], b[4])] = kural_say.get((b[3], b[4]), 0) + 1
    L = [f"# Doğal Türkçe denetimi ({date.today().isoformat()})", "",
         "Bu rapor `npm run dogal-turkce` ile üretilir, elle düzenleme. Kurallar ve gerekçeleri: `docs/DOGAL-TURKCE.md`.", "",
         f"Taranan metin parçası: " + ", ".join(f"{k} {v}" for k, v in sayac.items()) + ".", "",
         f"**{len(kesin)} kesin**, **{len(gozat)} göz at** bulgu, {len(uslup)} üslup notu (yalnızca sayılır, örnekleri en altta).", "", "## Kurala göre", "", "| Düzey | Kural | Sayı |", "|---|---|---|"]
    for (d, k), n in sorted(kural_say.items(), key=lambda x: (["KESİN", "GÖZ AT", "ÜSLUP"].index(x[0][0]), -x[1])):
        L.append(f"| {d} | {k} | {n} |")
    for duzey, liste in (("Kesin", kesin), ("Göz at", gozat)):
        L += ["", f"## {duzey}", ""]
        if not liste: L.append("Bulgu yok."); continue
        tur_once = None
        for tur, dosya, yer, d, ad, es, oneri, m in sorted(liste, key=lambda b: (b[0], b[1], b[2])):
            if tur != tur_once: L += ["", f"### {tur}", ""]; tur_once = tur
            baglam = m if len(m) <= 220 else m[:220] + "…"
            L.append(f"- `{dosya}` {yer}: **{ad}** «{es}». {oneri}  \n  > {baglam}")
    if uslup:
        L += ["", "## Üslup notları (örnekler)", "", "Bunlar hata değil, tercih. Yeni metin yazarken uyulur; eski metin toplu düzeltilmez.", ""]
        for tur, dosya, yer, d, ad, es, oneri, m in uslup[:8]:
            L.append(f"- `{dosya}` {yer}: **{ad}** «{es}»  \n  > {m[:200]}")
    os.makedirs(os.path.dirname(RAPOR), exist_ok=True)
    open(RAPOR, "w", encoding="utf-8").write("\n".join(L) + "\n")
    return kesin, gozat, uslup, kural_say

def main():
    dosya = sys.argv[sys.argv.index("--dosya") + 1] if "--dosya" in sys.argv else None
    bulgular, sayac = kontrol(dosya)
    if dosya:
        for tur, f, yer, d, ad, es, oneri, m in bulgular: print(f"[{d}] {yer}: {ad} «{es}». {oneri}")
        print(f"{len(bulgular)} bulgu."); return
    kesin, gozat, uslup, kural_say = rapor(bulgular, sayac)
    print("Taranan: " + ", ".join(f"{k} {v}" for k, v in sayac.items()))
    for (d, k), n in sorted(kural_say.items(), key=lambda x: (["KESİN", "GÖZ AT", "ÜSLUP"].index(x[0][0]), -x[1])): print(f"  {d:7} {n:4}  {k}")
    print(f"{len(kesin)} kesin, {len(gozat)} göz at, {len(uslup)} üslup notu. Ayrıntı: {os.path.relpath(RAPOR, ROOT)}")

if __name__ == "__main__":
    main()
