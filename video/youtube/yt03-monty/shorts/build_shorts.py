"""Builds the two 9:16 Shorts projects from the YT-03 long video, with the English narration lines placed per shot.
Each row: (16:9 source shot, narration line number or None, line offset, minimum seconds, cx keyframes).
Run from studio/: python3 projects/yt02-shorts/build_shorts.py <vo dir with EN_NN.wav>"""
import json, os, shutil, sys, wave
import numpy as np
SRC = "projects/yt03-monty"; VO = sys.argv[1]; SR = 48000
long = {s["id"]: s for s in json.load(open(f"{SRC}/story/shots.json"))["shots"]}
SHORTS = {
 "yt03-short-a": ("10,000 people said she was wrong", [
   ("k03", 2, .1, 3.0, [[0, 700]]), ("k04", None, 0, 1.4, [[0, 960]]), ("k01", 1, .1, 3.0, [[0, 820]]), ("m01", 12, .2, 3.0, [[0, 960], [1.4, 960], [2.2, 1240]]),
   ("m02", None, 0, 3.2, [[0, 1340]]), ("m04", 13, .1, 2.6, [[0, 960]]), ("m05", 14, .1, 3.0, [[0, 700], [2.5, 1300]]), ("m06", None, 0, 2.0, [[0, 1000]])],
   [(0, "mystery", 0.55), (9, "playful", 0.55)]),
 "yt03-short-b": ("Stay or switch?", [
   ("o04", 7, .2, 4.2, [[0, 1420]]), ("o01", 4, .1, 2.4, [[0, 330], [1.4, 330], [2.2, 1000]]), ("o02", 5, .1, 3.0, [[0, 1020]]),
   ("o03", 6, .1, 2.0, [[0, 450]]), ("o05", 8, .1, 3.0, [[0, 1180]]), ("o06", 9, .1, 3.4, [[0, 960]])],
   [(0, "playful", 0.6), (13, "tension", 0.55)]),
 "yt03-short-c": ("Imagine a hundred doors", [
   ("d03", 20, .1, 3.4, [[0, 700], [2.0, 1400]]), ("d01", 18, .1, 2.6, [[0, 960]]), ("d02", 19, .1, 3.0, [[0, 620]]), ("d04", None, 0, 1.6, [[0, 960]]),
   ("d05", 21, .1, 3.0, [[0, 700], [1.6, 1300]]), ("d06", 22, .1, 3.4, [[0, 1100]])],
   [(0, "wonder", 0.6)]),
 "yt03-short-d": ("We played it 1,000 times", [
   ("y02", 25, .1, 4.0, [[0, 520], [1.8, 1400]]), ("y01", 24, .1, 3.0, [[0, 700]]), ("d07", 23, .1, 4.0, [[0, 600], [2.0, 1200]]), ("d08", None, 0, 3.4, [[0, 1100], [1.2, 1000]]), ("y03", None, 0, 2.2, [[0, 960]])],
   [(0, "action", 0.55), (7, "wonder", 0.55)]),
 "yt03-short-e": ("Pigeons beat students", [
   ("p03", 28, .1, 3.0, [[0, 1500], [1.6, 400]]), ("p01", 26, .1, 2.6, [[0, 960]]), ("p02", 27, .1, 4.0, [[0, 620], [2.5, 1450]])],
   [(0, "playful", 0.55)]),
 "yt03-short-f": ("A genius said impossible", [
   ("r02", 16, .1, 3.0, [[0, 900], [1.2, 1250]]), ("r01", 15, .1, 3.0, [[0, 820]]), ("r03", 17, .1, 3.0, [[0, 700], [1.5, 1050]]), ("r04", None, 0, 2.4, [[0, 900]])],
   [(0, "mystery", 0.55)]),
 "yt03-short-g": ("The host's secret", [
   ("n03", 31, .1, 4.0, [[0, 1000]]), ("n01", 29, .1, 3.0, [[0, 1100]]), ("n02", 30, .1, 4.0, [[0, 600], [2.5, 1300]]), ("n04", None, 0, 1.8, [[0, 960]]), ("n05", 32, .1, 3.0, [[0, 640], [0.7, 640], [1.3, 1200]])],
   [(0, "tension", 0.5), (10, "calm", 0.5)]),
}
def rd(p):
    w = wave.open(p); return np.frombuffer(w.readframes(w.getnframes()), np.int16).reshape(-1, w.getnchannels()).astype(np.float32) / 32768
for name, (title, rows, music) in SHORTS.items():
    P = f"projects/{name}"
    for d in ["story", "scenes", "input", "build", "out"]: os.makedirs(f"{P}/{d}", exist_ok=True)
    if os.path.exists(f"{P}/assets"): shutil.rmtree(f"{P}/assets")
    shutil.copytree(f"{SRC}/assets", f"{P}/assets")
    shutil.copy("projects/yt03-shorts/wrap.js", f"{P}/scenes/wrap.js")
    shots, t, place = [], 0.0, []
    for i, (src, ln, off, dmin, cx) in enumerate(rows):
        L = long.get(src, {}); sid = f"{name[-1]}{i + 1:02d}"
        d = dmin
        if ln: x = rd(f"{VO}/EN_{ln:02d}.wav"); d = max(dmin, off + len(x) / SR + 0.45); place.append((t + off, x))
        d = round(d, 3)
        s = {"id": sid, "start": round(t, 3), "end": round(t + d, 3), "line": "", "scene": f"9:16 of {src}", "bars": None,
             "in": L.get("in", {"type": "cut"}) if i else {"type": "cut"}, "sfx": [c for c in L.get("sfx", []) if c["at"] < d], "notes": "",
             "params": {"src": src, "cx": cx}}
        if src == "endv": s["in"] = {"type": "fade", "dur": 0.4}; s["sfx"] = [{"at": 0.1, "name": "shimmer", "gain": -12}]
        if L.get("amb"): s["amb"] = L["amb"]
        shots.append(s); t += d
    total = round(t, 3)
    mus = [{"start": a, "end": (music[k + 1][0] if k + 1 < len(music) else total), "mood": m, "intensity": it} for k, (a, m, it) in enumerate(music)]
    json.dump({"title": title, "duration": total, "shots": shots, "music": mus}, open(f"{P}/story/shots.json", "w"), indent=1)
    cfg = json.load(open(f"{SRC}/config.json")); cfg.update({"title": title, "aspect": "9:16", "duration": total, "fadeIn": 0.0, "fadeOut": 0.4, "bars": None, "voiceover": "input/vo.wav"})
    json.dump(cfg, open(f"{P}/config.json", "w"), indent=1)
    n = int(SR * (total + 1)); out = np.zeros((n, 2), np.float32)
    for (a, x) in place: k = int(a * SR); out[k:k + len(x)] += x[: n - k]
    w = wave.open(f"{P}/input/vo.wav", "wb"); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(out, -1, 1) * 32767).astype(np.int16).tobytes()); w.close()
    print(name, len(shots), "shots", total, "s")
