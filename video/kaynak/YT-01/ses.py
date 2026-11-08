"""YT-01 "Donan şişe" ses izi: ses efektleri ve müzik koddan üretilir (kayıt yok, lisans sorunu yok).
Uygulamanın public/ses/ dosyalarından üçü (earshot, MIT) de kullanılır: dogru, konfeti, seviye.
Kullanım: python3 ses.py  ->  ses.wav (44,1 kHz, stereo, 60 sn)
Zamanlar scene.html'deki sahne zamanlarıyla aynıdır.
"""
import subprocess, os
import numpy as np

SR = 44100
SURE = 60.0
KOK = os.path.dirname(os.path.abspath(__file__))
SES_KLASORU = os.path.join(KOK, '..', '..', '..', 'public', 'ses')
rng = np.random.default_rng(11)
iz = np.zeros(int(SR * SURE))


def t_(d):
    return np.arange(int(SR * d)) / SR


def ekle(sinyal, t, kazanc=1.0):
    i = int(t * SR)
    if i >= len(iz):
        return
    n = min(len(sinyal), len(iz) - i)
    iz[i:i + n] += sinyal[:n] * kazanc


def zarf(n, atak=0.005, dusus=0.2):
    t = np.arange(n) / SR
    a = np.clip(t / max(atak, 1e-4), 0, 1)
    return a * np.exp(-t / dusus)


def gurultu(d):
    return rng.standard_normal(int(SR * d))


def alcak(x, kesim):  # tek kutuplu alçak geçiren
    a = np.exp(-2 * np.pi * kesim / SR)
    y = np.zeros_like(x); s = 0.0
    for i in range(len(x)):
        s = (1 - a) * x[i] + a * s; y[i] = s
    return y


def bant(x, f, q=5.0):  # basit rezonans süzgeci (biquad bant geçiren)
    w = 2 * np.pi * f / SR; al = np.sin(w) / (2 * q)
    b0, b2 = al, -al; a0, a1, a2 = 1 + al, -2 * np.cos(w), 1 - al
    y = np.zeros_like(x); x1 = x2 = y1 = y2 = 0.0
    for i in range(len(x)):
        v = (b0 * x[i] + b2 * x2 - a1 * y1 - a2 * y2) / a0
        x2, x1, y2, y1 = x1, x[i], y1, v; y[i] = v
    return y


def mp3(ad):
    yol = os.path.join(SES_KLASORU, ad)
    ham = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', yol, '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(ham, dtype=np.float32).astype(float)


# ---------- efektler ----------
def adim():  # yumuşak ayakkabı sesi
    n = gurultu(0.09)
    return alcak(n, 900) * zarf(len(n), 0.002, 0.025) * 2.2 + np.sin(2 * np.pi * 90 * t_(0.09)) * zarf(int(SR * .09), .001, .02) * .5


def kapak_ac():  # buzdolabı contası: emme "pop" + hafif gıcırtı
    t = t_(0.35)
    pop = np.sin(2 * np.pi * (180 - 120 * t / .35) * t) * zarf(len(t), .002, .05)
    hava = bant(gurultu(.35), 1500, 2) * zarf(len(t), .02, .12) * .6
    return pop * .9 + hava


def kapak_kapa():
    t = t_(0.3)
    return np.sin(2 * np.pi * 70 * t) * zarf(len(t), .001, .06) * 1.2 + alcak(gurultu(.3), 600) * zarf(len(t), .001, .03) * 2


def ugultu(d):  # buzdolabı motoru
    t = t_(d)
    x = np.sin(2 * np.pi * 55 * t) * .5 + np.sin(2 * np.pi * 110 * t) * .25 + alcak(gurultu(d), 300) * .4
    k = np.minimum(1, np.minimum(t / .3, (d - t) / .3))
    return x * k


def cin(f=2400):  # cam tıngırtısı
    t = t_(0.5)
    return sum(np.sin(2 * np.pi * f * m * t) * np.exp(-t / (.18 / m)) for m in (1, 1.47, 2.09)) * zarf(len(t), .001, 1) * .35


def catlak():  # cam ve buz çatlaması: keskin tıklar + kırık rezonanslar
    d = 0.7; x = np.zeros(int(SR * d))
    for k in range(14):
        i = int(SR * (abs(rng.normal(0, .08))))
        if i < len(x) - 2000:
            klik = gurultu(.03) * zarf(int(SR * .03), .0005, .004)
            x[i:i + len(klik)] += klik * (1.5 if k < 3 else .7)
    t = t_(d)
    x += sum(np.sin(2 * np.pi * f * t) * np.exp(-t / .12) * .12 for f in (1870, 3150, 4420))
    return bant(x, 3000, .7) * 2.4 + x * .3


def sok():  # şaşkınlık vuruşu: iki notalı, kısa
    out = np.zeros(int(SR * .7))
    for j, (f, b) in enumerate(((392, 0), (370, .14))):
        t = t_(.5)
        s = sum(np.sign(np.sin(2 * np.pi * f * h * t)) / h for h in (1, 2, 3)) * zarf(len(t), .004, .18)
        i = int(b * SR); out[i:i + len(s)] += alcak(s, 2200)[:len(out) - i] * .35
    return out


def soru_blip():  # yükselen "hı?"
    t = t_(.32)
    f = 420 + 380 * (t / .32) ** 2
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * zarf(len(t), .01, .16) * .45


def geri_sar(d):  # kaset geri sarma
    t = t_(d)
    f = 900 + 700 * np.sin(2 * np.pi * 11 * t) * .3 + 1600 * t / d
    ton = np.sin(2 * np.pi * np.cumsum(f) / SR) * .18
    c = bant(gurultu(d), 2500, 1.5) * .25
    k = np.minimum(1, np.minimum(t / .08, (d - t) / .12))
    return (ton + c) * k


def esneme():  # konuşmasız esneme: yavaşça düşen yumuşak ton
    t = t_(.9)
    f = 520 - 260 * (t / .9)
    return alcak(np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)), 900) * np.sin(np.pi * t / .9) * .12


def tik():
    t = t_(.04)
    return bant(gurultu(.04), 4200, 4) * zarf(len(t), .0005, .006) * 2.5


def cirdak(d):  # gece cırcır böceği
    t = t_(d); x = np.zeros(len(t))
    for b in np.arange(0, d, .7):
        for j in range(3):
            i = int((b + j * .06) * SR); n = int(.04 * SR)
            if i + n < len(x): x[i:i + n] += np.sin(2 * np.pi * 4300 * t[:n]) * np.sin(np.pi * np.arange(n) / n)
    return x * .08


def kus():  # sabah kuşu: iki cıvıltı
    out = np.zeros(int(SR * .6))
    for b in (0, .22):
        t = t_(.14); f = 2600 + 1400 * np.sin(np.pi * t / .14)
        s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / .14)
        i = int(b * SR); out[i:i + len(s)] += s * .18
    return out


def hus(d, yukari=True):  # hız geçişi
    t = t_(d); n = gurultu(d)
    f0, f1 = (400, 3500) if yukari else (3500, 400)
    parcalar = []
    adim_ = int(SR * .02)
    y = np.zeros_like(n)
    for i in range(0, len(n), adim_):
        f = f0 + (f1 - f0) * (i / len(n))
        seg = n[i:i + adim_]
        y[i:i + len(seg)] = bant(seg, f, 1.2)
    return y * np.sin(np.pi * t / d) ** 1.5 * .7


def kabarcik(f=600):
    t = t_(.08)
    return np.sin(2 * np.pi * (f + 900 * t / .08) * t) * zarf(len(t), .002, .03) * .3


def ding(f):
    t = t_(.8)
    return (np.sin(2 * np.pi * f * t) + .3 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t / .1)) * zarf(len(t), .002, .35) * .16


def gerilme(d):  # kutu ya da şişe zorlanır: alçak gıcırtı
    t = t_(d)
    f = 70 + 40 * t / d
    x = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * (0.6 + 0.4 * np.sin(2 * np.pi * 9 * t))
    return alcak(x, 700) * np.sin(np.pi * t / d) * .22


def dusus_islik(d):
    t = t_(d); f = 1500 - 900 * t / d
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / d) * .12


def lop():  # suya düşme
    t = t_(.35)
    f = 900 * np.exp(-t / .05) + 220
    blop = np.sin(2 * np.pi * np.cumsum(f) / SR) * zarf(len(t), .002, .08) * .6
    sicrama = bant(gurultu(.35), 3500, 1) * zarf(len(t), .003, .07) * .5
    return blop + sicrama


def pop():
    t = t_(.12)
    return np.sin(2 * np.pi * (500 + 1500 * t / .12) * t) * zarf(len(t), .001, .03) * .35


def ruzgar(d):
    t = t_(d)
    n = alcak(gurultu(d), 500) * (0.6 + 0.4 * np.sin(2 * np.pi * .3 * t))
    return n * np.minimum(1, np.minimum(t / .8, (d - t) / .8)) * .9


def batis(d):  # derine batan buz: alçalan derin ton
    t = t_(d); f = 160 - 90 * t / d
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / d) * .4


def soru_muzik():  # açık uçlu soru: yükselen iki nota
    out = np.zeros(int(SR * 1.6))
    for f, b in ((440, 0), (659.3, .3), (698.5, .6)):
        t = t_(1.0)
        s = (np.sin(2 * np.pi * f * t) + .25 * np.sin(2 * np.pi * 4 * f * t) * np.exp(-t / .05)) * zarf(len(t), .003, .45)
        i = int(b * SR); out[i:i + len(s)] += s * .2
    return out


# ---------- müzik: yumuşak marimba arpeji ----------
def marimba(f, d=.9, v=1.0):
    t = t_(d)
    return (np.sin(2 * np.pi * f * t) * np.exp(-t / .5) + .35 * np.sin(2 * np.pi * f * 3.93 * t) * np.exp(-t / .06)) * zarf(len(t), .002, 5) * v


def nota(ad):
    adlar = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}
    return 261.63 * 2 ** ((adlar[ad[0]] + 12 * (int(ad[1]) - 4)) / 12)


def muzik():
    bpm = 104; vurus = 60 / bpm
    out = np.zeros(len(iz))
    akor_neseli = [['C4', 'E4', 'G4', 'E5'], ['A3', 'C4', 'E4', 'C5'], ['F3', 'A3', 'C4', 'A4'], ['G3', 'B3', 'D4', 'B4']]
    akor_merak = [['A3', 'C4', 'E4', 'A4'], ['F3', 'A3', 'C4', 'F4'], ['A3', 'C4', 'E4', 'A4'], ['E3', 'G3', 'B3', 'E4']]
    t = 0.0; olcu = 0
    while t < 58:
        merak = 19.8 <= t < 34.6 or 54 <= t < 58
        akor = (akor_merak if merak else akor_neseli)[olcu % 4]
        sira = [0, 1, 2, 3, 2, 1, 2, 3]
        for k, j in enumerate(sira):
            tt = t + k * vurus / 2
            if tt >= 58: break
            s = marimba(nota(akor[j]), .9, .11 if k % 2 == 0 else .08)
            i = int(tt * SR); n = min(len(s), len(out) - i); out[i:i + n] += s[:n]
        bas = marimba(nota(akor[0]) / 2, 1.6, .16)
        i = int(t * SR); n = min(len(bas), len(out) - i); out[i:i + n] += bas[:n]
        t += 4 * vurus; olcu += 1
    # geri sarmada ve gece geçişinde müzik kısılır
    zaman = np.arange(len(out)) / SR
    k = np.ones(len(out))
    for a, b, s in ((3.0, 4.2, .15), (12.6, 15.0, .35), (17.5, 19.0, .3), (38.3, 39.0, .3), (58, 60, 0)):
        k[(zaman >= a) & (zaman < b)] = s
    k = alcak(k, 4)
    return out * k


# ---------- zaman çizelgesi ----------
ekle(kapak_ac(), 0.0, .7)
ekle(catlak(), 0.08, .9)
ekle(sok(), 0.25)
ekle(soru_blip(), 1.75)
ekle(geri_sar(1.2), 3.0)
for a, b, x0, x1 in ((4.2, 7.0, -150, 1110), (10.8, 12.6, 1110, -180), (15.0, 17.0, -150, 1110)):
    adim_say = abs(x1 - x0) / 150
    k = 0
    while (k + .5) / adim_say <= 1:
        ekle(adim(), a + (b - a) * (k + .5) / adim_say, .5); k += 1
ekle(cin(2600), 7.05, .5)          # kapak sıkılır
ekle(kapak_ac(), 7.3, .6)
ekle(ugultu(2.1), 7.4, .25)
ekle(cin(), 8.55, .6)              # şişe rafa
ekle(kapak_kapa(), 9.35, .8)
ekle(esneme(), 9.6)
for i in range(30):                 # zaman hızla akar
    tt = 12.8 + 2.0 * (i / 30) ** .8
    ekle(tik(), tt, .35)
ekle(cirdak(1.6), 12.6, .7)
ekle(kus(), 14.3)
ekle(kapak_ac(), 17.3, .7)
ekle(catlak(), 17.62, 1.0)
ekle(sok(), 17.8)
ekle(soru_blip(), 18.6)
ekle(hus(.9, True), 18.9)
# mikro dünya
for i in range(40):
    tt = 20.2 + i * .14 + rng.uniform(0, .08)
    if tt < 25.5: ekle(kabarcik(rng.uniform(400, 900)), tt, .5 * (1 - (tt - 20) / 7))
penta = [523.3, 587.3, 659.3, 784.0, 880.0, 1046.5, 1174.7, 1318.5]
for i in range(12):
    ekle(ding(penta[i % 8] * (1 if i < 8 else 2)), 26.3 + i * 0.14)
ekle(gerilme(2.8), 26.6)
ekle(pop(), 27.0, .8)
ekle(hus(.6, False), 34.0)
ekle(mp3('konfeti.mp3'), 35.7, .35)
ekle(gerilme(1.0), 37.4, 1.2)
ekle(catlak(), 38.42, 1.0)
ekle(pop(), 38.5, 1.0)
ekle(mp3('dogru.mp3'), 39.2, .7)
ekle(hus(.4, True), 40.85, .5)
ekle(dusus_islik(.5), 42.8)
ekle(lop(), 43.3, .9)
ekle(pop(), 44.45, .6)
ekle(pop(), 44.6, .5)
ekle(hus(.4, True), 47.35, .5)
ekle(ruzgar(6.5), 47.5, .35)
for i in range(8):
    ekle(kabarcik(rng.uniform(500, 800)), 48 + i * .7 + rng.uniform(0, .3), .35)
ekle(hus(.4, True), 53.85, .5)
ekle(batis(1.6), 54.4)
for i in range(6):
    ekle(kabarcik(rng.uniform(300, 500)), 54.5 + i * .25, .4)
ekle(soru_muzik(), 56.0)
ekle(mp3('seviye.mp3'), 58.05, .8)

karisim = iz + muzik()
# yumuşak sınırlayıcı
tepe = np.max(np.abs(karisim))
karisim = np.tanh(karisim / max(tepe, 1e-6) * 1.4) * 0.85
stereo = np.stack([karisim, karisim], axis=1)
veri = (stereo * 32767).astype('<i2').tobytes()
import wave
with wave.open(os.path.join(KOK, 'ses.wav'), 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(veri)
print('ses.wav yazıldı')
