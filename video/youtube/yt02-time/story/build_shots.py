"""Builds story/shots.json from the shot table below (durations -> contiguous start/end). Run: python3 story/build_shots.py"""
import json, os
D = os.path.dirname(os.path.abspath(__file__))
# id, seconds, scene note, transition-in, sfx [(at, name, gain, extra)], ambience (name, gain)
T = [
 # ACT 0 — hook: the phone puts you in the lake (lines 1-3)
 ("h01", 3.0, "winter dusk shore, hero looks at his phone", ("cut",), [(0.0, "wind", -22, {"dur": 3.0}), (1.6, "blip", -12, {"pitch": 0.8})], ("wind", -22)),
 ("h02", 2.6, "phone close: blue dot slides into the middle of the lake, ?", ("cut",), [(0.5, "whoosh", -14, {"dur": 1.0}), (1.6, "hit", -10, {"pitch": 0.7}), (1.8, "stinger", -12, {})], None),
 ("h03", 2.0, "bigFace confused -> shocked", ("cut",), [(0.9, "hit", -12, {"pitch": 1.3})], None),
 ("h04", 3.6, "wide: hero on dry snow, dot out on the lake, ?", ("cut",), [(0.6, "blip", -12, {}), (1.4, "pop", -12, {})], ("wind", -22)),
 ("h05", 4.4, "two clocks tick at different speeds, ≠, the phone dot", ("dip", 0.4), [(0.2, "pop", -12, {}), (0.6, "pop", -12, {"pitch": 0.8}), (1.2, "ding", -12, {}), (2.6, "blip", -10, {})], None),
 # ACT 1 — light (lines 4-11)
 ("s01", 3.2, "night station platform, hero with a flashlight, train lights far away", ("whip", 0.4), [(0.0, "swish", -12, {}), (1.6, "tick", -8, {"pitch": 1.4})], ("city", -24)),
 ("s02", 3.6, "flash beam shoots across the dark, 300 000 km/s", ("cut",), [(0.2, "whoosh", -10, {"dur": 0.8, "pitch": 1.4})], None),
 ("s03", 4.8, "blueprint: standing vs running hero, light passes both at c", ("cut",), [(0.5, "whoosh", -16, {}), (2.4, "whoosh", -16, {}), (3.6, "ding", -12, {})], None),
 ("s04", 5.0, "light clock: two mirrors, photon bounces, ticks", ("zoom", 0.5), [(0.6 + i * 0.8, "tick", -12, {}) for i in range(5)], None),
 ("s05", 5.4, "the light clock rides a train: slanted zig-zag path", ("cut",), [(0.3, "carpass", -16, {})] + [(1.4 + i * 1.2, "tick", -12, {"pitch": 0.8}) for i in range(3)], None),
 ("s06", 3.8, "short straight path vs long slanted path, same speed", ("cut",), [(0.4, "pop", -12, {}), (1.6, "pop", -12, {"pitch": 0.8}), (2.6, "ding", -12, {})], None),
 ("s07", 4.4, "train passes the platform: clock inside slow, platform clock fast", ("cut",), [(0.0, "carpass", -10, {}), (0.4, "clock", -16, {"dur": 3.8, "rate": 5})], ("city", -24)),
 ("s08", 3.6, "speed meter up, clock hands slow; bigFace awe", ("cut",), [(0.2, "riser", -12, {"dur": 2.0}), (2.2, "shimmer", -12, {})], None),
 # ACT 2 — the twin (lines 12-17)
 ("t01", 3.6, "meet the twin: hero and astronaut twin side by side", ("dip", 0.5), [(0.4, "pop", -12, {}), (0.8, "pop", -12, {"pitch": 1.2})], ("roomtone", -26)),
 ("t02", 4.8, "rocket launch, twin waves from the window, 0.9c", ("cut",), [(0.3, "riser", -12, {"dur": 1.6}), (1.6, "impact", -8, {"pitch": 0.6}), (1.7, "rain", -14, {"dur": 2.8, "heavy": 1.0})], ("wind", -24)),
 ("t03", 4.2, "on Earth: calendar flies, +20 years, hero grows a beard", ("cut",), [(0.2, "clock", -14, {"dur": 3.8, "rate": 10})], ("roomtone", -26)),
 ("t04", 2.8, "the rocket lands in dust", ("cut",), [(0.2, "whoosh", -12, {"pitch": 0.5}), (1.4, "impact", -10, {"pitch": 0.7})], ("wind", -24)),
 ("t05", 5.4, "old hero meets young twin: +20 vs < 9, +11", ("cut",), [(0.6, "blip", -12, {}), (1.6, "blip", -12, {"pitch": 1.3}), (3.0, "ding", -10, {})], ("wind", -26)),
 ("t06", 3.6, "bigFace old hero shocked, twin grins", ("cut",), [(0.0, "stinger", -10, {})], None),
 # ACT 3 — gravity (lines 18-21)
 ("g01", 4.2, "blueprint space grid bends around a planet", ("dip", 0.5), [(0.3, "riser", -14, {"dur": 2.4, "pitch": 0.6})], None),
 ("g02", 3.8, "clocks on the grid: near the planet slow, far away fast", ("cut",), [(0.3, "clock", -16, {"dur": 3.4, "rate": 4})], None),
 ("g03", 4.8, "beach clock vs mountain-top clock, mountain ticks faster", ("cut",), [(0.3, "wind", -20, {"dur": 4.4}), (2.6, "ding", -12, {})], None),
 ("g04", 5.4, "hero with atomic clocks at head and feet, feet slower", ("cut",), [(0.5, "blip", -12, {}), (1.0, "blip", -12, {"pitch": 0.8}), (3.2, "shimmer", -12, {})], None),
 # ACT 4 — GPS (lines 22-31)
 ("p01", 2.8, "back on the shore, hero frowns at the phone, ?", ("dip", 0.4), [(0.6, "blip", -12, {})], ("wind", -22)),
 ("p02", 4.6, "camera flies up to space: Earth, GPS satellites, 20 000 km", ("whip", 0.5), [(0.0, "whoosh", -10, {"dur": 1.4}), (2.4, "shimmer", -14, {})], None),
 ("p03", 4.8, "satellite with atomic clock, signal rings travel to the phone", ("cut",), [(0.6 + i * 0.9, "blip", -14, {"pitch": 1.2}) for i in range(4)], None),
 ("p04", 5.6, "satellite speeds along its orbit, 3.9 km/s, clock -7 µs", ("cut",), [(0.3, "whoosh", -12, {"dur": 1.2}), (2.6, "counter", -14, {}), (3.6, "hit", -12, {"pitch": 0.7})], None),
 ("p05", 5.2, "gravity weaker up high, clock +45 µs", ("cut",), [(0.8, "riser", -14, {"dur": 1.4}), (2.6, "counter", -14, {}), (3.4, "ding", -12, {})], None),
 ("p06", 3.8, "sum: −7 + 45 = +38 µs / day", ("cut",), [(0.3, "pop", -12, {}), (0.9, "pop", -12, {}), (1.6, "ding", -8, {})], None),
 ("p07", 4.4, "a beam of light races 11 km across the map", ("cut",), [(0.3, "whoosh", -10, {"dur": 1.6, "pitch": 1.4}), (2.2, "hit", -12, {})], None),
 ("p08", 5.2, "map: the dot drifts further every day, 10 km", ("cut",), [(0.4 + i * 0.9, "blip", -14, {"pitch": 0.9 - i * 0.08}) for i in range(4)], None),
 ("p09", 4.6, "engineers tune the satellite clock, launch", ("cut",), [(0.6, "tick", -8, {"pitch": 1.4}), (1.0, "tick", -8, {"pitch": 1.4}), (2.4, "riser", -12, {"dur": 1.6})], None),
 ("p10", 3.8, "dot snaps back to the hero on the shore, he smiles", ("dipWhite", 0.5), [(0.4, "ding", -10, {}), (1.0, "powerup", -12, {})], ("wind", -24)),
 # ACT 5 — end (lines 32-33)
 ("e01", 5.2, "night sky: hero watches satellites cross the stars, two clocks", ("dip", 0.6), [(0.6, "shimmer", -14, {})], ("wind", -26)),
 ("e02", 3.0, "bigFace wink", ("cut",), [(0.3, "pop", -10, {})], None),
 ("e03", 9.0, "end card: ucler. logo + ? + end-screen slots", ("fade", 0.6), [(0.2, "shimmer", -12, {})], None),
]
MUSIC = [
 ("h01", "mystery", 0.5), ("s01", "wonder", 0.55), ("t01", "playful", 0.55), ("t03", "tension", 0.5), ("g01", "wonder", 0.6),
 ("p01", "mystery", 0.5), ("p04", "tension", 0.6), ("p10", "triumph", 0.6), ("e01", "hopeful", 0.5),
]
SC = json.load(open(os.path.join(D, "scales.json"))) if os.path.exists(os.path.join(D, "scales.json")) else {}   # narration fit (story/narration.py)
shots, t, starts = [], 0.0, {}
for (sid, d, note, tr, sfx, amb) in T:
    k = SC.get(sid, 1.0); d = round(d * k, 3); sfx = [(a * k, n, gg, x) for (a, n, gg, x) in sfx]
    s = {"id": sid, "start": round(t, 3), "end": round(t + d, 3), "line": "", "scene": note, "bars": None,
         "in": {"type": tr[0], **({"dur": tr[1]} if len(tr) > 1 else {})},
         "sfx": [{"at": round(a, 3), "name": n, "gain": gg, **x} for (a, n, gg, x) in sfx], "notes": ""}
    if k != 1.0: s["params"] = {"tscale": k}
    if amb: s["amb"] = {"name": amb[0], "gain": amb[1]}
    starts[sid] = t; shots.append(s); t += d
total = round(t, 3)
mus = []
for i, (sid, m, k) in enumerate(MUSIC):
    end = starts[MUSIC[i + 1][0]] if i + 1 < len(MUSIC) else total
    mus.append({"start": round(starts[sid], 3), "end": round(end, 3), "mood": m, "intensity": k})
json.dump({"title": "Einstein and Your Phone", "duration": total, "shots": shots, "music": mus}, open(os.path.join(D, "shots.json"), "w"), indent=1)
print(len(shots), "shots,", total, "s")
