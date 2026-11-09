"""10 Kasım seslendirmesi -> src/onkasim/captions.ts

Satır zamanları whisper.cpp çıktısından (small model, tr) alındı; satır içinde kelimeler
harf sayısına göre dağıtılır. Metin, seslendirmenin onaylı yazımıdır.
"""
import json, os
LINES = [
 (0.00, 4.40, "Saat dokuzu beş geçiyor ve bütün bir ülke aynı anda duruyor."),
 (5.56, 7.16, "Bu sabah sınava geç kalıyorsun."),
 (8.36, 10.80, "Otobüs kaçıyor, notların rüzgârda uçuşuyor."),
 (11.92, 13.76, "Koşarken saate bakıyorsun: dokuz."),
 (14.96, 16.24, "Sonra siren başlıyor."),
 (17.44, 21.00, "1938. 10 Kasım. İstanbul, Dolmabahçe."),
 (22.44, 26.40, "Sabah saat dokuzu beş geçe Mustafa Kemal Atatürk gözlerini hayata yumuyor."),
 (27.92, 31.08, "Odasındaki saat o günden beri dokuzu beş geçeyi gösteriyor."),
 (32.68, 36.52, "Haber bütün ülkeye yayılıyor, insanlar sokaklarda ağlıyor."),
 (38.12, 40.40, "Peki bir milleti bu kadar derinden sarsan neydi?"),
 (41.84, 44.44, "Elindeki deftere bak, yazdığın harflere."),
 (45.88, 50.84, "1927'de bu topraklarda her 10 kişiden yalnızca biri okuma yazma biliyordu."),
 (52.32, 56.56, "Bir yıl sonra yeni harfler geldi, genç yaşlı herkes sıraya oturdu."),
 (58.08, 60.24, "Tahtanın başında Başöğretmen vardı."),
 (61.80, 65.68, "Kız çocukları okula gitti, kadınlar seçme ve seçilme hakkını kazandı."),
 (67.32, 71.76, "Ve o yolu tek bir sözle gösterdi: Hayatta en hakiki mürşit ilimdir."),
 (73.36, 76.84, "Siren hâlâ çalıyor, yaşlı bir adam şapkasını göğsüne bastırmış."),
 (78.36, 82.92, "Okuduğun kitap, girmek üzere olduğun sınav, hepsi o yolun bir parçası."),
 (84.40, 87.92, "Siren susuyor, sen de yürüyorsun ama bu sefer koşmuyorsun."),
 (89.36, 92.40, "Çünkü onu anmanın en güzel yolu, öğrenmeye devam etmek."),
 (94.04, 100.84, "Ulu Önder Mustafa Kemal Atatürk'ü, aramızdan ayrılışının 88. yılında saygı, sevgi ve özlemle anıyoruz."),
]
words, line_first = [], []
for a, b, text in LINES:
    ws = text.split()
    weights = [len(w.strip('.,:?!')) + 2 for w in ws]
    tot = sum(weights)
    t = a
    line_first.append(len(words))
    for w, k in zip(ws, weights):
        d = (b - a) * k / tot
        words.append({'w': w, 's': round(t, 2), 'e': round(t + d - 0.04, 2)})
        t += d
starts = [x['s'] for x in words]
out = os.path.join(os.path.dirname(__file__), '..', 'src', 'onkasim', 'captions.ts')
open(out, 'w').write(
    "// 10 Kasım seslendirmesinin kelime zamanları (scripts/onkasim_captions.py üretir).\n"
    "import type { Word } from '../captions';\n"
    f"export const ON_WORDS: Word[] = {json.dumps(words, ensure_ascii=False)};\n"
    f"export const ON_STARTS: number[] = {json.dumps(starts)};\n"
    f"/** Her satırın ilk kelimesinin sırası. */\nexport const ON_LINES: number[] = {json.dumps(line_first)};\n")
print(len(words), 'kelime')
for i, (a, b, text) in enumerate(LINES):
    print(i, line_first[i], text[:40])
