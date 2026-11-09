"""Builds the two 9:16 Shorts projects from the YT-02 long video, with the English narration lines placed per shot.
Each row: (16:9 source shot, narration line number or None, line offset, minimum seconds, cx keyframes).
Run from studio/: python3 projects/yt02-shorts/build_shorts.py <vo dir with EN_NN.wav>"""
import json, os, shutil, sys, wave
import numpy as np
SRC = "projects/yt02-time"; VO = sys.argv[1]; SR = 48000
long = {s["id"]: s for s in json.load(open(f"{SRC}/story/shots.json"))["shots"]}
SHORTS = {
 "yt02-short-a": ("Your twin comes back younger", [
   ("t01", 12, .2, 3.2, [[0, 930]]), ("t02", 13, .2, 4.2, [[0, 700]]), ("t03", 14, .2, 3.4, [[0, 1040]]),
   ("t04", 15, .2, 2.2, [[0, 750]]), ("t05", 16, .2, 5.6, [[0, 760], [2.0, 760], [3.2, 1180]]), ("t06", 17, .1, 3.6, [[0, 960]]),
   ("s08", 11, .1, 3.4, [[0, 620], [0.8, 620], [1.6, 1300], [2.3, 960]]), ("endv", None, 0, 2.6, None)],
   [(0, "playful", 0.55), (9, "tension", 0.55), (17, "wonder", 0.6)]),
 "yt02-short-b": ("Without Einstein your phone gets lost", [
   ("h02", 1, .1, 2.6, [[0, 960]]), ("h04", 2, .1, 4.6, [[0, 600], [2.0, 600], [3.0, 1250]]),
   ("p02", 23, .3, 4.4, [[0, 960], [2.2, 960], [3.2, 1300]]), ("p03", 24, .2, 4.8, [[0, 760], [1.5, 760], [3.0, 1280]]),
   ("p04", 25, .2, 5.6, [[0, 1100], [2.4, 1100], [3.4, 520]]), ("p05", 26, .2, 5.0, [[0, 968]]),
   ("p06", 27, .1, 3.6, [[0, 960]]), ("p08", 29, .2, 5.0, [[0, 800]]), ("p09", 30, .2, 4.4, [[0, 700], [1.5, 700], [2.5, 1350]]),
   ("p10", 31, .2, 3.4, [[0, 860], [1.2, 860], [2.2, 1300]]), ("endv", None, 0, 2.6, None)],
   [(0, "mystery", 0.55), (7, "wonder", 0.55), (17, "tension", 0.6), (40, "triumph", 0.6)]),
}
def rd(p):
    w = wave.open(p); return np.frombuffer(w.readframes(w.getnframes()), np.int16).reshape(-1, w.getnchannels()).astype(np.float32) / 32768
for name, (title, rows, music) in SHORTS.items():
    P = f"projects/{name}"
    for d in ["story", "scenes", "input", "build", "out"]: os.makedirs(f"{P}/{d}", exist_ok=True)
    if os.path.exists(f"{P}/assets"): shutil.rmtree(f"{P}/assets")
    shutil.copytree(f"{SRC}/assets", f"{P}/assets")
    shutil.copy("projects/yt02-shorts/wrap.js", f"{P}/scenes/wrap.js")
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
