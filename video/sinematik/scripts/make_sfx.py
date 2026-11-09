"""tepkinne ses efekti kütüphanesi.

Tüm efektler burada matematiksel olarak üretilir; telif sorunu yoktur.
Çalıştırma:  python3 scripts/make_sfx.py   (video/ klasöründen)
Çıktı:       public/sfx/*.wav  (ffmpeg varsa .mp3'e çevrilir)
"""
import os
import subprocess
import wave

import numpy as np

SR = 44100
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'sfx')
rng = np.random.default_rng(7)


def t(sec):
    return np.arange(int(SR * sec)) / SR


def env(n, attack=0.005, release=0.2, sec=None):
    """Hızlı yükselen, üstel sönen zarf."""
    x = np.arange(n) / SR
    a = np.clip(x / max(attack, 1e-4), 0, 1)
    r = np.exp(-x / max(release, 1e-4))
    return a * r


def lowpass(x, cutoff):
    """Tek kutuplu alçak geçiren filtre (kayan kesim frekansı da olabilir)."""
    cutoff = np.broadcast_to(cutoff, x.shape)
    y = np.zeros_like(x)
    prev = 0.0
    for i in range(len(x)):
        a = 1 - np.exp(-2 * np.pi * cutoff[i] / SR)
        prev += a * (x[i] - prev)
        y[i] = prev
    return y


def norm(x, peak=0.9):
    m = np.max(np.abs(x)) or 1
    return x / m * peak


def save(name, x):
    os.makedirs(OUT, exist_ok=True)
    x = np.clip(x, -1, 1)
    stereo = np.stack([x, x], axis=1)
    path = os.path.join(OUT, f'{name}.wav')
    with wave.open(path, 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((stereo * 32767).astype('<i2').tobytes())
    mp3 = path[:-4] + '.mp3'
    try:
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', path, '-b:a', '160k', mp3], check=True)
        os.remove(path)
        print('ok', mp3)
    except Exception:
        print('ok', path)


def whoosh():
    """Sahne geçişi: filtresi açılıp kapanan gürültü süpürmesi."""
    d = t(0.7)
    n = rng.standard_normal(len(d))
    sweep = 300 + 3500 * np.sin(np.pi * d / d[-1]) ** 2
    x = lowpass(n, sweep)
    x *= np.sin(np.pi * d / d[-1]) ** 1.5
    return norm(x, 0.7)


def impact():
    """Büyük rakam düşer: alçak 'bum' + kısa gürültü vuruşu."""
    d = t(1.4)
    f = 70 * np.exp(-d * 3) + 38
    phase = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(phase) * env(len(d), 0.002, 0.45)
    hit = lowpass(rng.standard_normal(len(d)), 1800) * env(len(d), 0.001, 0.05)
    return norm(body + 0.6 * hit, 0.95)


def tick():
    """Sayaç tıkı."""
    d = t(0.06)
    x = np.sin(2 * np.pi * 2400 * d) * env(len(d), 0.0005, 0.008)
    return norm(x, 0.6)


def ding():
    """Telefon bildirimi: iki notalı yumuşak zil."""
    out = np.zeros(int(SR * 1.2))
    for start, f in [(0.0, 1318.5), (0.12, 1760.0)]:
        d = t(1.0)
        tone = (np.sin(2 * np.pi * f * d) + 0.3 * np.sin(2 * np.pi * f * 2.01 * d)) * env(len(d), 0.003, 0.25)
        s = int(start * SR)
        out[s:s + len(d)] += tone[: len(out) - s]
    return norm(out, 0.7)


def coins():
    """Bozuk para şıkırtısı: rastgele zamanlı metalik tınılar."""
    out = np.zeros(int(SR * 1.0))
    for _ in range(9):
        s = int(rng.uniform(0, 0.6) * SR)
        d = t(0.35)
        f = rng.uniform(2800, 5200)
        part = sum(np.sin(2 * np.pi * f * k * d + rng.uniform(0, 6)) / k for k in (1, 1.47, 2.09))
        part *= env(len(d), 0.0005, 0.06)
        out[s:s + len(d)] += part[: len(out) - s] * rng.uniform(0.4, 1)
    return norm(out, 0.6)


def lock():
    """Kilit / kapanma: metalik 'klak' + alçak gövde."""
    d = t(0.6)
    click = lowpass(rng.standard_normal(len(d)), 5000) * env(len(d), 0.0005, 0.012)
    clunk = np.sin(2 * np.pi * 140 * d) * env(len(d), 0.001, 0.09)
    out = click + 0.8 * clunk
    late = np.zeros_like(out)
    s = int(0.09 * SR)
    late[s:] = out[: len(out) - s] * 0.7
    return norm(out + late, 0.85)


def riser():
    """Kapanış sorusundan önce gerilim: yükselen ton + açılan gürültü."""
    d = t(3.0)
    f = 120 * (2 ** (d / d[-1] * 2.5))
    phase = 2 * np.pi * np.cumsum(f) / SR
    tone = np.sin(phase) + 0.4 * np.sin(phase * 1.5)
    noise = lowpass(rng.standard_normal(len(d)), 400 + 5000 * (d / d[-1]) ** 2)
    x = (0.6 * tone + 0.5 * noise) * (d / d[-1]) ** 2
    x[-int(0.02 * SR):] *= np.linspace(1, 0, int(0.02 * SR))
    return norm(x, 0.7)


def pop():
    """Kısa, yumuşak 'pop': yüzler ve logo belirirken."""
    d = t(0.15)
    f = 900 * np.exp(-d * 25) + 300
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(d), 0.001, 0.03)
    return norm(x, 0.6)


def drone():
    """Alt müzik: 30 sn'lik, döngüye uygun koyu pad (Re minör)."""
    d = t(30.0)
    x = np.zeros_like(d)
    for f, a in [(73.42, 1.0), (110.0, 0.6), (146.83, 0.35), (174.61, 0.25), (220.0, 0.15)]:
        lfo = 1 + 0.004 * np.sin(2 * np.pi * 0.1 * d + f)
        x += a * np.sin(2 * np.pi * f * d * lfo)
    x *= 0.75 + 0.25 * np.sin(2 * np.pi * d / 30.0) ** 2  # döngü noktasında yumuşak
    x += 0.08 * lowpass(rng.standard_normal(len(d)), 250)
    fade = int(0.5 * SR)
    x[:fade] *= np.linspace(0, 1, fade)
    x[-fade:] *= np.linspace(1, 0, fade)
    return norm(x, 0.6)


def knock():
    """Kapıya iki sert vuruş (tahta)."""
    out = np.zeros(int(SR * 0.6))
    for st in (0.0, 0.16):
        d = t(0.25)
        body = np.sin(2 * np.pi * (180 * np.exp(-d * 30) + 95) * d) * env(len(d), 0.001, 0.05)
        hit = lowpass(rng.standard_normal(len(d)), 2500) * env(len(d), 0.0005, 0.012)
        s0 = int(st * SR)
        out[s0:s0 + len(d)] += body + 0.7 * hit
    return norm(out, 0.95)


def rewind():
    """Kaset geri sarma: hızlanan cızırtılı tiz süpürme."""
    d = t(1.1)
    f = 600 + 2600 * (d / d[-1]) ** 1.5
    phase = 2 * np.pi * np.cumsum(f) / SR
    x = np.sign(np.sin(phase)) * 0.25 + 0.6 * lowpass(rng.standard_normal(len(d)), 3000)
    x *= np.sin(np.pi * d / d[-1]) ** 0.6
    return norm(x, 0.6)


def buzz():
    """Telefon titreşimi: iki kısa vızz."""
    out = np.zeros(int(SR * 1.0))
    for st in (0.0, 0.45):
        d = t(0.32)
        x = np.sign(np.sin(2 * np.pi * 150 * d)) * np.sin(np.pi * d / d[-1])
        s0 = int(st * SR)
        out[s0:s0 + len(d)] += lowpass(x, 900)
    return norm(out, 0.7)


def chomp():
    """Isırık: kısa çıtırtı + alçak 'hap'."""
    d = t(0.25)
    crunch = lowpass(rng.standard_normal(len(d)), 3500) * env(len(d), 0.001, 0.04) * (1 + 0.8 * np.sign(np.sin(2 * np.pi * 40 * d)))
    gulp = np.sin(2 * np.pi * (260 * np.exp(-d * 12) + 90) * d) * env(len(d), 0.003, 0.06)
    return norm(0.7 * crunch + gulp, 0.85)


def printer():
    """Fiş yazıcısı: ritmik tıkırtılı vızıltı (2,5 sn)."""
    d = t(2.5)
    gate = (np.sin(2 * np.pi * 22 * d) > 0.2).astype(float)
    x = lowpass(rng.standard_normal(len(d)), 2200) * gate * 0.6 + 0.3 * np.sin(2 * np.pi * 330 * d) * gate
    fade = int(0.05 * SR)
    x[-fade:] *= np.linspace(1, 0, fade)
    return norm(x, 0.55)


def glass():
    """Cam çatlaması: tiz şangırtı + parçalar."""
    out = np.zeros(int(SR * 1.6))
    d = t(0.08)
    out[:len(d)] += rng.standard_normal(len(d)) * env(len(d), 0.0005, 0.02)
    for _ in range(26):
        s0 = int(rng.uniform(0, 0.9) * SR)
        dd = t(0.4)
        f = rng.uniform(3000, 8000)
        part = np.sin(2 * np.pi * f * dd + rng.uniform(0, 6)) * env(len(dd), 0.0005, rng.uniform(0.02, 0.12))
        out[s0:s0 + len(dd)] += part[: len(out) - s0] * rng.uniform(0.2, 0.8)
    return norm(out, 0.8)


def pluck(f, sec, decay=0.5, bright=1.0):
    d = t(sec)
    x = sum((bright ** (k - 1)) / k * np.sin(2 * np.pi * f * k * d) for k in (1, 2, 3, 4))
    return x * env(len(d), 0.003, decay)


def place(out, x, at):
    s0 = int(at * SR)
    n = min(len(x), len(out) - s0)
    if n > 0:
        out[s0:s0 + n] += x[:n]


N = {'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.0, 'A3': 220.0, 'Bb3': 233.08, 'C4': 261.63, 'D4': 293.66,
     'E4': 329.63, 'F4': 349.23, 'G4': 392.0, 'A4': 440.0, 'Bb4': 466.16, 'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'A2': 110.0, 'D2': 73.42, 'F2': 87.31, 'G2': 98.0, 'Bb2': 116.54, 'C2': 65.41}


def music_dark():
    """Alaycı-gergin alt müzik: Re minörde pizzicato ostinato + koyu bas (16 sn döngü, 90 bpm)."""
    L = 16.0
    out = np.zeros(int(SR * L))
    beat = 60 / 90 / 2
    bars = [('D2', ['D4', 'F4', 'A4', 'F4']), ('Bb2', ['D4', 'F4', 'Bb4', 'F4']), ('G2', ['D4', 'G4', 'Bb4', 'G4']), ('A2', ['C4', 'E4', 'A4', 'E4'])]
    step = 0
    tt = 0.0
    while tt < L - 0.01:
        bass, arp = bars[int(tt // 4) % 4]
        if step % 8 == 0:
            place(out, 0.9 * pluck(N[bass], 2.0, 0.9, 0.5), tt)
        place(out, 0.35 * pluck(N[arp[step % 4]], 0.4, 0.12, 0.6), tt)
        step += 1
        tt += beat
    # döngü uçlarında kısa geçiş
    fade = int(0.03 * SR)
    out[-fade:] *= np.linspace(1, 0, fade)
    return norm(out, 0.6)


def music_happy():
    """Rüya/neşe: Do majörde zıplayan pluck melodi (8 sn döngü, 128 bpm)."""
    L = 7.5
    out = np.zeros(int(SR * L))
    b = 60 / 128
    chords = [('C3', ['C4', 'E4', 'G4', 'C5']), ('G2', ['D4', 'G4', 'D5', 'G4']), ('A2', ['C4', 'E4', 'A4', 'E5']), ('F2', ['C4', 'F4', 'A4', 'C5'])]
    for bar in range(4):
        bass, arp = chords[bar]
        t0 = bar * 4 * b
        for k in range(4):
            place(out, 0.8 * pluck(N[bass] if k % 2 == 0 else N[bass] * 2, 0.5, 0.15, 0.4), t0 + k * b)
        for k in range(8):
            place(out, 0.4 * pluck(N[arp[(k * 3) % 4]] * 2, 0.3, 0.09, 0.8), t0 + k * b / 2)
    for k in range(int(L / (b / 2))):
        d = t(0.04)
        place(out, 0.08 * rng.standard_normal(len(d)) * env(len(d), 0.0005, 0.01), k * b / 2 + b / 4)
    return norm(out, 0.6)


def music_hope():
    """Kapanış: Fa majörde yükselen yumuşak pad + piyano notaları (12 sn)."""
    L = 12.0
    d = t(L)
    out = np.zeros(len(d))
    prog = [['F3', 'A3', 'C4'], ['C3', 'E3', 'G3'], ['D3', 'F3', 'A3'], ['Bb2', 'D3', 'F3']]
    for i, ch in enumerate(prog):
        t0 = i * 3.0
        seg = t(3.4)
        e = np.sin(np.pi * np.clip(seg / 3.4, 0, 1)) ** 1.2
        pad = sum(np.sin(2 * np.pi * N[n] * seg) + 0.3 * np.sin(2 * np.pi * N[n] * 2.003 * seg) for n in ch) * e
        place(out, 0.25 * pad, t0)
        for k, n in enumerate(ch + [ch[1]]):
            place(out, 0.35 * pluck(N[n] * 2, 1.5, 0.6, 0.5), t0 + k * 0.7)
    out *= np.clip(d / 1.5, 0, 1)
    return norm(out, 0.6)


def alarm():
    """Telefon alarmı: üç kısa çift bip."""
    out = np.zeros(int(SR * 1.6))
    for k in range(3):
        for j in range(2):
            d = t(0.09)
            tone = np.sign(np.sin(2 * np.pi * 1900 * d)) * 0.5 + np.sin(2 * np.pi * 3800 * d) * 0.3
            place(out, tone * env(len(d), 0.002, 0.2), k * 0.5 + j * 0.14)
    return norm(lowpass(out, 6000), 0.6)


def gavel():
    """Hâkim tokmağı: tahta vuruş + yankı."""
    d = t(1.2)
    hit = np.sin(2 * np.pi * (420 * np.exp(-d * 40) + 180) * d) * env(len(d), 0.0005, 0.06)
    crack = lowpass(rng.standard_normal(len(d)), 4000) * env(len(d), 0.0003, 0.01)
    x = hit + 0.8 * crack
    out = x.copy()
    for dl, g in [(0.11, 0.35), (0.23, 0.18), (0.37, 0.08)]:
        s0 = int(dl * SR)
        out[s0:] += x[: len(x) - s0] * g
    return norm(out, 0.95)


def click():
    """Elektrik düğmesi: iki parçalı plastik klik."""
    out = np.zeros(int(SR * 0.3))
    for st, f in [(0.0, 3200), (0.025, 1800)]:
        d = t(0.04)
        place(out, np.sin(2 * np.pi * f * d) * env(len(d), 0.0003, 0.006) + 0.5 * rng.standard_normal(len(d)) * env(len(d), 0.0003, 0.003), st)
    return norm(out, 0.8)


def birds():
    """Sabah kuşları: rastgele cıvıltılar (3 sn)."""
    out = np.zeros(int(SR * 3.0))
    for _ in range(14):
        st = rng.uniform(0, 2.6)
        n = rng.integers(2, 5)
        base = rng.uniform(2800, 4200)
        for k in range(n):
            d = t(0.07)
            f = base + 1400 * np.sin(np.pi * d / d[-1]) * (1 if k % 2 else -0.5)
            ph = 2 * np.pi * np.cumsum(f) / SR
            place(out, np.sin(ph) * np.sin(np.pi * d / d[-1]) * rng.uniform(0.3, 0.8), st + k * 0.09)
    return norm(out, 0.5)


if __name__ == '__main__':
    for name, fn in [
        ('whoosh', whoosh), ('impact', impact), ('tick', tick), ('ding', ding), ('coins', coins),
        ('lock', lock), ('riser', riser), ('pop', pop), ('drone', drone),
        ('knock', knock), ('rewind', rewind), ('buzz', buzz), ('chomp', chomp), ('printer', printer), ('glass', glass),
        ('alarm', alarm), ('gavel', gavel), ('click', click), ('birds', birds),
        ('music-dark', music_dark), ('music-happy', music_happy), ('music-hope', music_hope),
    ]:
        save(name, fn())
