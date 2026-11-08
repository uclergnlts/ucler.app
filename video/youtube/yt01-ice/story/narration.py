"""Narration timing for YT-01: each line starts at an anchor shot (+offset). If the longest language does not fit before the next
line's anchor, every shot in that group is slowed down (params.tscale) so it fits. Writes story/scales.json and story/lines.json.
Run: python3 story/narration.py <segs.json>  then  python3 story/build_shots.py"""
import json, os, sys
D = os.path.dirname(os.path.abspath(__file__))
ANCH = [("o01", .4), ("o04", .3), ("o05", .2), ("n01", .4), ("n04", .3), ("n06", .3), ("n08", .2), ("n09", .2), ("n11", .4), ("m03", .3),
        ("m05", .2), ("m06", .2), ("x01", .3), ("x02", .2), ("x03", .3), ("x04", .3), ("x05", .3), ("x06", .3), ("f01", .3), ("f03", .2),
        ("f04", .3), ("f05", .2), ("l01", .5), ("l04", .4), ("l05", .3), ("w01", .4), ("w02", .3), ("w03", .3), ("w05", .3), ("w06", .5),
        ("p01", .3), ("e01", .3), ("e02", .3), ("e04", .8)]
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
