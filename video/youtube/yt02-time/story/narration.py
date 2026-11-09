"""Narration timing for YT-02: each line starts at an anchor shot (+offset). If the longest language does not fit before the next
line's anchor, every shot in that group is slowed down (params.tscale) so it fits. Writes story/scales.json and story/lines.json.
Run: python3 story/narration.py <segs.json>  then  python3 story/build_shots.py"""
import json, os, sys
D = os.path.dirname(os.path.abspath(__file__))
ANCH = [("h01", .1), ("h02", .6), ("h04", .4), ("s01", .3), ("s02", .2), ("s03", .3), ("s04", .3), ("s05", .3), ("s06", .2), ("s07", .3),
        ("s08", .2), ("t01", .3), ("t02", .3), ("t03", .3), ("t04", .3), ("t05", .3), ("t06", .3), ("g01", .3), ("g02", .2), ("g03", .3),
        ("g04", .3), ("p01", .3), ("p02", .4), ("p03", .3), ("p04", .3), ("p05", .3), ("p06", .2), ("p07", .3), ("p08", .3), ("p09", .3),
        ("p10", .3), ("e01", .4), ("e02", .3)]
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
