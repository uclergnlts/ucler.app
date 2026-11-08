"""Builds story/shots.json from the shot table below (durations -> contiguous start/end). Run: python3 story/build_shots.py"""
import json, os
D = os.path.dirname(os.path.abspath(__file__))
# id, seconds, scene note, transition-in, sfx [(at, name, gain, extra)], ambience (name, gain)
T = [
 # ACT 0 — cold open
 ("o01", 3.4, "dark kitchen, slow push on the freezer, a crack inside", ("cut",), [(0.0, "hum", -20, {"dur": 3.4}), (2.6, "hit", -10, {"pitch": 0.6})], ("roomtone", -24)),
 ("o02", 2.2, "freezer opens, cold light + mist, hero silhouette", ("cut",), [(0.1, "whoosh", -14, {}), (0.3, "shimmer", -16, {})], ("hum", -26)),
 ("o03", 2.0, "bigFace shocked, cyan rim", ("cut",), [(0.0, "hit", -12, {"pitch": 1.3})], None),
 ("o04", 3.0, "FREEZE: cracked bottle, shards hang, -18 C", ("flash", 0.4), [(0.0, "freeze", -6, {})], None),
 ("o05", 2.6, "rewind: clock spins back, -8 h", ("cut",), [(0.0, "glitch", -10, {}), (0.2, "riser", -14, {"dur": 2.2, "pitch": 0.7})], None),
 # ACT 1 — the night before
 ("n01", 4.0, "city at night, push in on one lit window", ("dip", 0.6), [], ("city", -22)),
 ("n02", 4.2, "night kitchen wide, hero walks in with full bottle", ("cut",), [(0.5, "footstep", -16, {}), (1.0, "footstep", -16, {}), (1.5, "footstep", -16, {}), (2.0, "footstep", -16, {}), (2.5, "footstep", -16, {})], ("roomtone", -22)),
 ("n03", 3.6, "close: bottle filled to the brim, cap twisted on, 1.00 L", ("cut",), [(0.3, "pop", -14, {"pitch": 0.7}), (1.8, "tick", -12, {}), (2.1, "tick", -12, {}), (2.4, "tick", -12, {})], ("roomtone", -24)),
 ("n04", 3.2, "hero opens the freezer, cold light on the face", ("cut",), [(0.3, "whoosh", -14, {}), (0.4, "shimmer", -18, {})], ("hum", -24)),
 ("n05", 2.6, "inside the freezer: bottle placed, door closes to black", ("cut",), [(0.6, "hit", -16, {"pitch": 0.8}), (2.0, "impact", -14, {"pitch": 1.6})], None),
 ("n06", 3.4, "hero yawns, switches the lamp off", ("cut",), [(2.2, "blip", -10, {"pitch": 0.6})], ("roomtone", -24)),
 ("n07", 4.2, "time-lapse: clock spins, moon crosses the window", ("dip", 0.5), [(0.0, "clock", -14, {"dur": 4.0, "rate": 9})], ("roomtone", -28)),
 ("n08", 4.4, "x-ray freezer: thermometer 20 -> -18 C, frost grows", ("zoom", 0.5), [(0.2, "counter", -16, {}), (2.0, "shimmer", -14, {})], ("hum", -24)),
 ("n09", 3.0, "macro: ice crystals grow inward, plastic creaks", ("cut",), [(0.4, "hit", -18, {"pitch": 0.5}), (1.4, "hit", -16, {"pitch": 0.45}), (2.2, "riser", -14, {"dur": 0.9})], ("hum", -26)),
 ("n10", 2.4, "CRACK: bottle splits, flash, shake", ("cut",), [(0.0, "impact", -6, {}), (0.02, "glitch", -14, {})], None),
 ("n11", 3.8, "bedroom: hero asleep, one eye opens, closes", ("cut",), [(0.3, "hit", -22, {"pitch": 0.5})], ("roomtone", -26)),
 # ACT 2 — morning discovery
 ("m01", 3.6, "morning kitchen, golden sun, hero walks in happy", ("dip", 0.6), [(0.6, "shimmer", -18, {}), (1.0, "footstep", -16, {}), (1.5, "footstep", -16, {}), (2.0, "footstep", -16, {})], ("roomtone", -24)),
 ("m02", 2.6, "freezer opens, mist rolls out", ("cut",), [(0.2, "whoosh", -14, {})], ("hum", -24)),
 ("m03", 2.2, "bigFace shocked (callback)", ("cut",), [(0.0, "stinger", -10, {})], None),
 ("m04", 4.0, "hero holds up the cracked bottle, ice mushroom out of the neck", ("cut",), [(0.3, "shimmer", -14, {}), (2.2, "pop", -12, {})], ("roomtone", -26)),
 ("m05", 3.4, "hero confused, scratches head, ? appears", ("cut",), [(1.0, "blip", -12, {}), (1.2, "blip", -12, {"pitch": 1.3})], ("roomtone", -26)),
 ("m06", 3.8, "magnifier over the ice, zoom into the micro world", ("cut",), [(1.6, "whoosh", -10, {"dur": 1.2})], None),
 # ACT 3 — micro world
 ("x01", 4.4, "liquid water molecules jostling, 20 C", ("zoom", 0.6), [(0.2, "hum", -22, {"dur": 4})], None),
 ("x02", 4.0, "temperature falls 20 -> 0 C, molecules slow", ("cut",), [(0.1, "counter", -14, {})], None),
 ("x03", 5.4, "molecules snap into hexagons one by one", ("cut",), [(0.5 + i * 0.32, "pop", -12, {"pitch": 0.9 + i * 0.06}) for i in range(12)], None),
 ("x04", 4.2, "pull out: lattice with empty holes glowing", ("cut",), [(0.4, "shimmer", -12, {})], None),
 ("x05", 5.6, "same molecules: liquid box vs ice box, 1.00 L -> 1.09 L, +9%", ("cut",), [(0.5, "whoosh", -16, {}), (2.2, "riser", -14, {"dur": 1.4}), (3.6, "ding", -10, {})], None),
 ("x06", 4.4, "blueprint bottle: ice pushes the walls, crack line", ("cut",), [(1.4, "riser", -14, {"dur": 1.6}), (3.0, "impact", -12, {"pitch": 1.4})], None),
 ("x07", 3.0, "hero bigFace awe, lattice glow in the eyes", ("cut",), [(0.2, "shimmer", -14, {})], None),
 # ACT 4 — ice floats
 ("f01", 3.6, "table by the window: hero drops ice into a glass", ("dip", 0.5), [(2.5, "swish", -12, {}), (3.15, "hit", -14, {"pitch": 1.8})], ("roomtone", -24)),
 ("f02", 3.0, "FREEZE mid-splash", ("flash", 0.35), [(0.0, "freeze", -8, {})], None),
 ("f03", 4.2, "ice bobs and floats, ~90% under the surface", ("cut",), [(0.1, "hit", -16, {"pitch": 1.8}), (0.5, "pop", -18, {})], ("roomtone", -26)),
 ("f04", 4.6, "density bars: water 1.00 vs ice 0.92 g/cm3", ("zoom", 0.5), [(0.4, "blip", -12, {}), (0.7, "blip", -12, {"pitch": 1.2}), (2.2, "ding", -12, {})], None),
 ("f05", 3.0, "hero smirk, light bulb idea, points up", ("cut",), [(0.6, "powerup", -12, {})], ("roomtone", -26)),
 # ACT 5 — the lake
 ("l01", 4.8, "winter lake at dusk, snow, pines, mountains", ("whip", 0.4), [(0.0, "swish", -12, {})], ("wind", -18)),
 ("l02", 4.0, "hero walks onto the ice with rod and bucket, breath vapour", ("cut",), [(0.4 + i * 0.5, "footstep", -14, {"pitch": 1.3}) for i in range(7)], ("wind", -20)),
 ("l03", 3.6, "hero fishing through a hole, calm", ("cut",), [], ("wind", -22)),
 ("l04", 5.4, "camera sinks below: ice on top 0 C, fish swim, 4 C at the bottom", ("cut",), [(0.2, "whoosh", -14, {"dur": 1.4, "pitch": 0.6}), (2.4, "blip", -14, {}), (3.4, "blip", -14, {"pitch": 0.8})], ("hum", -28)),
 ("l05", 4.6, "blueprint: water densest at 4 C sinks; ice lid insulates", ("cut",), [(0.4, "pop", -14, {}), (1.6, "pop", -14, {"pitch": 1.2}), (2.8, "ding", -14, {})], None),
 ("l06", 3.8, "fish bites, hero cheers, lets it go", ("cut",), [(0.6, "pop", -10, {}), (1.6, "swish", -12, {}), (2.2, "hit", -14, {"pitch": 1.6})], ("wind", -22)),
 # ACT 6 — what if ice sank?
 ("w01", 3.4, "glitch: ice cube in a glass SINKS", ("cut",), [(0.0, "glitch", -8, {}), (0.4, "stinger", -10, {}), (1.4, "hit", -14, {"pitch": 0.7})], None),
 ("w02", 6.0, "storm lake section: ice sinks, layers stack, lake freezes from the bottom", ("dip", 0.5), [(0.4 + i * 1.0, "hit", -16, {"pitch": 0.6}) for i in range(5)], ("wind", -16)),
 ("w03", 3.4, "fish trapped in ice, dark", ("cut",), [(0.3, "freeze", -10, {})], ("wind", -20)),
 ("w04", 3.0, "hero bigFace scared", ("cut",), [(0.0, "heartbeat", -10, {"dur": 3.0, "bpm": 90})], None),
 ("w05", 4.0, "planet freezes white from the poles", ("cut",), [(0.2, "riser", -12, {"dur": 3.5, "pitch": 0.5})], None),
 ("w06", 3.6, "rewind to reality: ice floats, fish happy", ("dipWhite", 0.6), [(0.0, "glitch", -12, {}), (0.4, "ding", -12, {})], ("hum", -28)),
 # ACT 7 — ice is strong
 ("p01", 4.0, "winter night street: pipe bursts, spray freezes into icicles", ("whip", 0.35), [(0.0, "swish", -12, {}), (1.2, "impact", -8, {}), (1.3, "rain", -14, {"dur": 2.6, "heavy": 0.9})], ("wind", -20)),
 ("p02", 4.4, "mountain rock: water in a crack freezes, rock splits", ("cut",), [(1.6, "freeze", -14, {}), (3.0, "impact", -8, {"pitch": 0.7})], ("wind", -22)),
 ("p03", 3.8, "winter road: crack -> ice -> pothole, car bumps", ("cut",), [(0.6, "carpass", -12, {}), (2.2, "hit", -10, {"pitch": 0.8})], ("wind", -24)),
 # ACT 8 — payoff + end
 ("e01", 4.0, "hero pours some water out, leaves room, cap off, into the freezer", ("dip", 0.5), [(0.5, "rain", -22, {"dur": 1.2}), (2.6, "hit", -16, {"pitch": 0.8})], ("roomtone", -24)),
 ("e02", 3.4, "next morning: bottle intact, ice domed, hero thumbs up", ("cut",), [(0.2, "whoosh", -14, {}), (0.9, "ding", -10, {})], ("roomtone", -24)),
 ("e03", 3.0, "bigFace wink/smirk to camera", ("cut",), [(0.3, "pop", -10, {})], None),
 ("e04", 9.0, "end card: ucler. logo + ? + space for end-screen elements", ("fade", 0.6), [(0.2, "shimmer", -12, {})], None),
]
MUSIC = [
 ("o01", "mystery", 0.45), ("n01", "calm", 0.4), ("n08", "tension", 0.55), ("m01", "playful", 0.5), ("x01", "wonder", 0.6),
 ("f01", "playful", 0.55), ("l01", "calm", 0.5), ("w01", "dark", 0.6), ("w06", "hopeful", 0.55), ("p01", "action", 0.6), ("e01", "triumph", 0.6),
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
json.dump({"title": "Why Ice Breaks Bottles (and Saves Fish)", "duration": total, "shots": shots, "music": mus}, open(os.path.join(D, "shots.json"), "w"), indent=1)
print(len(shots), "shots,", total, "s")
