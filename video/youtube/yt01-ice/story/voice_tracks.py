"""Places the 34 split narration lines (vo/<L>_NN.wav) at their anchors -> input/vo_<L>.wav for each language."""
import json, os, sys, wave
import numpy as np
D = os.path.dirname(os.path.abspath(__file__)); VO = sys.argv[1]
shots = json.load(open(os.path.join(D, "shots.json"))); st = {s["id"]: s["start"] for s in shots["shots"]}
anch = json.load(open(os.path.join(D, "lines.json")))["anchors"]; SR = 48000; n = int((shots["duration"] + 1) * SR)
def rd(p):
    w = wave.open(p); x = np.frombuffer(w.readframes(w.getnframes()), np.int16).reshape(-1, w.getnchannels()).astype(np.float32) / 32768; return x
for L in ["EN", "TR", "ES", "AR"]:
    out = np.zeros((n, 2), np.float32)
    for i, (a, off) in enumerate(anch):
        x = rd(os.path.join(VO, f"{L}_{i + 1:02d}.wav")); k = int((st[a] + off) * SR)
        f = int(0.02 * SR); x[:f] *= np.linspace(0, 1, f)[:, None]; x[-f:] *= np.linspace(1, 0, f)[:, None]
        out[k:k + len(x)] += x[: n - k]
    w = wave.open(os.path.join(D, "..", "input", f"vo_{L}.wav"), "wb"); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((np.clip(out, -1, 1) * 32767).astype(np.int16).tobytes()); w.close(); print(L, "ok")
