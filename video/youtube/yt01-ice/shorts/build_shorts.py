"""Builds the two 9:16 Shorts projects from the YT-01 long video: each short shot re-frames a 16:9 shot (params.src, params.cx keyframes).
Run from studio/: python3 projects/yt01-shorts/build_shorts.py"""
import json, os, shutil, wave
import numpy as np
SRC = "projects/yt01-ice"
long = {s["id"]: s for s in json.load(open(f"{SRC}/story/shots.json"))["shots"]}
SHORTS = {
 "yt01-short-a": ("Why bottles explode in the freezer", [
   ("o04", 3.0, [[0, 1040]]), ("o05", 2.6, [[0, 960]]), ("n03", 3.6, [[0, 960]]), ("n04", 3.2, [[0, 1230], [1.0, 1230], [2.0, 830]]),
   ("n05", 2.6, [[0, 1000]]), ("n08", 4.4, [[0, 1420], [1.4, 1420], [2.6, 940]]), ("n09", 3.0, [[0, 960]]), ("n10", 2.4, [[0, 960]]),
   ("x03", 5.4, [[0, 960]]), ("x05", 5.6, [[0, 520], [1.6, 520], [2.4, 1400]]), ("x06", 4.4, [[0, 960]]), ("e01", 4.0, [[0, 1200]]),
   ("e02", 3.4, [[0, 1180], [0.6, 1180], [1.2, 800]]), ("endv", 2.6, None)],
   [(0, "tension", 0.6), (6, "mystery", 0.55), (24, "wonder", 0.65), (42, "triumph", 0.6)]),
 "yt01-short-b": ("What if ice sank?", [
   ("w01", 3.4, [[0, 960], [1.4, 960], [2.0, 1120]]), ("f02", 3.0, [[0, 960]]), ("f03", 4.2, [[0, 840], [1.2, 840], [2.0, 1010]]),
   ("f04", 4.6, [[0, 960]]), ("l04", 5.4, [[0, 900]]), ("w02", 6.0, [[0, 960]]), ("w03", 3.4, [[0, 960]]),
   ("w04", 3.0, [[0, 960]]), ("w05", 4.0, [[0, 960]]), ("w06", 3.6, [[0, 900]]), ("endv", 2.6, None)],
   [(0, "dark", 0.55), (3.4, "wonder", 0.6), (20.6, "dark", 0.65), (36.4, "hopeful", 0.6)]),
}
for name, (title, rows, music) in SHORTS.items():
    P = f"projects/{name}"
    for d in ["story", "scenes", "input", "build", "out"]: os.makedirs(f"{P}/{d}", exist_ok=True)
    if os.path.exists(f"{P}/assets"): shutil.rmtree(f"{P}/assets")
    shutil.copytree(f"{SRC}/assets", f"{P}/assets")
    shutil.copy("projects/yt01-shorts/wrap.js", f"{P}/scenes/wrap.js")
    shots, t = [], 0.0
    for i, (src, d, cx) in enumerate(rows):
        L = long.get(src, {}); sid = f"{name[-1]}{i + 1:02d}"
        s = {"id": sid, "start": round(t, 3), "end": round(t + d, 3), "line": "", "scene": f"9:16 of {src}", "bars": None,
             "in": L.get("in", {"type": "cut"}) if i else {"type": "cut"}, "sfx": [c for c in L.get("sfx", []) if c["at"] < d], "notes": "",
             "params": {"src": src, "cx": cx}}
        if src == "endv": s["in"] = {"type": "fade", "dur": 0.4}; s["sfx"] = [{"at": 0.1, "name": "shimmer", "gain": -12}]
        if L.get("amb"): s["amb"] = L["amb"]
        shots.append(s); t += d
    total = round(t, 3)
    mus = [{"start": a, "end": (music[k + 1][0] if k + 1 < len(music) else total), "mood": m, "intensity": it} for k, (a, m, it) in enumerate(music)]
    json.dump({"title": title, "duration": total, "shots": shots, "music": mus}, open(f"{P}/story/shots.json", "w"), indent=1)
    cfg = json.load(open(f"{SRC}/config.json")); cfg.update({"title": title, "aspect": "9:16", "duration": total, "fadeIn": 0.0, "fadeOut": 0.4, "bars": None})
    json.dump(cfg, open(f"{P}/config.json", "w"), indent=1)
    n = int(48000 * (total + 1)); w = wave.open(f"{P}/input/silence.wav", "wb"); w.setnchannels(2); w.setsampwidth(2); w.setframerate(48000); w.writeframes(np.zeros(n * 2, np.int16).tobytes()); w.close()
    print(name, len(shots), "shots", total, "s")
