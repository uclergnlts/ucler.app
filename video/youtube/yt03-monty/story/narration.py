"""Narration timing for YT-03: each line starts at an anchor shot (+offset). If the longest language does not fit before the next
line's anchor, every shot in that group is slowed down (params.tscale) so it fits. Writes story/scales.json and story/lines.json.
Run: python3 story/narration.py <segs.json>  then  python3 story/build_shots.py"""
import json, os, sys
D = os.path.dirname(os.path.abspath(__file__))
ANCH = [('k01', 0.1), ('k03', 0.3), ('k05', 0.3), ('o01', 0.3), ('o02', 0.3), ('o03', 0.3), ('o04', 0.3), ('o05', 0.3), ('o06', 0.3), ('o07', 0.3), ('o08', 0.3), ('m01', 0.3), ('m03', 0.3), ('m05', 0.3), ('r01', 0.3), ('r02', 0.3), ('r03', 0.3), ('d01', 0.3), ('d02', 0.3), ('d03', 0.3), ('d05', 0.3), ('d06', 0.3), ('d07', 0.3), ('y01', 0.3), ('y02', 0.3), ('p01', 0.3), ('p02', 0.3), ('p03', 0.3), ('n01', 0.3), ('n02', 0.3), ('n03', 0.3), ('n05', 0.3), ('z01', 0.3), ('z02', 0.3), ('z03', 0.3)]
segs = json.load(open(sys.argv[1])); L = len(ANCH)
need = [max(segs[l][i] for l in segs) for i in range(L)]
sys.argv = [sys.argv[0]]; exec(open(os.path.join(D, "build_shots.py")).read().split("shots, t, starts")[0])  # loads T
ids = [r[0] for r in T]; dur = {r[0]: r[1] for r in T}
scales = {}
for i, (a, off) in enumerate(ANCH):
    j0 = ids.index(a); j1 = ids.index(ANCH[i + 1][0]) if i + 1 < L else len(ids)
    group = ids[j0:j1]; win = sum(dur[s] for s in group); req = off + need[i] + 0.7
    k = max(1.0, req / win)
    for s in group: scales[s] = round(k, 3)
json.dump(scales, open(os.path.join(D, "scales.json"), "w"), indent=1)
json.dump({"anchors": ANCH}, open(os.path.join(D, "lines.json"), "w"))
print({k: v for k, v in scales.items() if v > 1})
