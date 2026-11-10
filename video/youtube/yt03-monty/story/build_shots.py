"""Builds story/shots.json from the shot table below (durations -> contiguous start/end). Run: python3 story/build_shots.py"""
import json, os
D = os.path.dirname(os.path.abspath(__file__))
# id, seconds, scene note, transition-in, sfx [(at, name, gain, extra)], ambience (name, gain)
T = [
 # HOOK (lines 1-3)
 ("k01", 3.2, "1990 night desk: woman types, lamp, 1990", ("cut",), [(0.0, "tick", -14, {"pitch": 1.6}), (0.4, "tick", -14, {"pitch": 1.5}), (0.8, "tick", -14, {"pitch": 1.7}), (1.2, "tick", -14, {"pitch": 1.6})], ("roomtone", -26)),
 ("k02", 2.6, "magazine page lands: three doors, ?", ("cut",), [(0.0, "whoosh", -14, {"dur": 0.6}), (0.6, "hit", -14, {"pitch": 0.8}), (0.8, "pop", -12, {})], None),
 ("k03", 3.2, "letters pour into her mailbox, 10 000", ("cut",), [(0.2, "rain", -18, {"dur": 3.0}), (0.3, "counter", -14, {})], None),
 ("k04", 3.0, "PhDs in mortarboards scribble, ≈1 000", ("cut",), [(0.4, "counter", -14, {}), (1.9, "hit", -12, {"pitch": 1.6})], ("murmur", -24)),
 ("k05", 2.8, "a great mathematician crosses his arms, ✗", ("cut",), [(1.2, "buzz", -12, {})], None),
 ("k06", 2.8, "the PhDs freeze grey, the woman smiles, ✓", ("cut",), [(0.2, "freeze", -12, {}), (1.3, "ding", -10, {})], None),
 ("k07", 3.0, "three doors and ?, hero peeks in and shrugs", ("cut",), [(0.3, "pop", -12, {}), (1.9, "swish", -14, {})], None),
 # THE GAME (lines 4-11)
 ("o01", 3.4, "TV studio: lights, cheering audience, hero at the podium", ("dip", 0.4), [(0.0, "applause", -16, {"dur": 2.4}), (0.2, "stinger", -12, {})], ("murmur", -26)),
 ("o02", 3.4, "x-ray doors: car glows behind 2, goats behind 1 and 3", ("cut",), [(0.3, "shimmer", -12, {}), (1.6, "hit", -16, {"pitch": 1.4})], None),
 ("o03", 2.4, "hero points at door 1, spotlight", ("cut",), [(0.5, "impact", -14, {"pitch": 1.2})], None),
 ("o04", 4.2, "host checks card, opens door 3: goat, burp", ("cut",), [(0.4, "swish", -14, {}), (1.4, "whoosh", -14, {"pitch": 0.7}), (2.6, "stinger", -14, {}), (2.9, "buzz", -16, {"pitch": 0.5})], ("murmur", -26)),
 ("o05", 3.2, "host holds out the mic: switch to 2?", ("cut",), [(0.3, "swish", -14, {}), (1.0, "pop", -12, {})], None),
 ("o06", 3.6, "freeze, pause sign, hero's big thinking face between 1 and 2", ("cut",), [(0.0, "freeze", -10, {}), (1.4, "heartbeat", -12, {"dur": 2.0})], None),
 ("o07", 3.4, "audience waves 50/50 signs", ("cut",), [(0.2, "murmur", -16, {"dur": 3.0})], ("murmur", -24)),
 ("o08", 2.8, "signs flip, big ✗ over 50/50", ("cut",), [(0.3, "swish", -12, {}), (1.1, "hit", -8, {"pitch": 0.7})], None),
 # MARILYN (lines 12-14)
 ("m01", 3.6, "typewriter close: 2/3 stamp", ("dip", 0.4), [(0.0, "tick", -12, {"pitch": 1.6}), (0.3, "tick", -12, {"pitch": 1.5}), (1.2, "hit", -10, {"pitch": 0.6})], ("roomtone", -26)),
 ("m02", 4.4, "she holds up the column: arrow 1 -> 2, 2/3", ("cut",), [(0.3, "pop", -12, {}), (1.0, "swish", -14, {}), (1.6, "ding", -10, {})], None),
 ("m03", 3.4, "mailman staggers in with sacks, mailbox bursts", ("cut",), [(0.0, "footstep", -16, {}), (1.4, "impact", -12, {"pitch": 1.2})], ("wind", -26)),
 ("m04", 2.6, "sorting room: every slot overflows", ("cut",), [(0.2, "rain", -20, {"dur": 2.4})], None),
 ("m05", 4.0, "professors in caps shout, ✗ marks", ("cut",), [(0.5, "murmur", -14, {"dur": 3.0}), (0.7, "buzz", -16, {}), (1.4, "buzz", -16, {"pitch": 1.3})], None),
 ("m06", 3.6, "the pile reaches the ceiling, a hand pokes out", ("cut",), [(0.2, "rain", -18, {"dur": 3.0}), (2.0, "pop", -12, {"pitch": 0.7})], None),
 # ERDOS (lines 15-17)
 ("r01", 4.6, "mathematician's study: cups, paper towers, ≈1 500", ("dip", 0.4), [(0.6, "counter", -14, {}), (0.2, "tick", -18, {"pitch": 1.8})], ("roomtone", -26)),
 ("r02", 3.4, "he slams the table, cup jumps, 50/50", ("cut",), [(0.8, "impact", -6, {"pitch": 0.8}), (1.1, "pop", -12, {})], None),
 ("r03", 3.4, "old computer plays again and again, switch bar wins", ("cut",), [(0.2, "counter", -14, {}), (0.4, "hum", -20, {"dur": 3.0})], None),
 ("r04", 2.6, "he gives in: white flag, !, 2/3 on the screen", ("cut",), [(0.5, "ding", -10, {}), (0.8, "swish", -16, {})], None),
 # 100 DOORS (lines 18-23)
 ("d01", 3.2, "three doors multiply into a hundred", ("whip", 0.4), [(0.8, "riser", -14, {"dur": 1.2}), (1.8, "shimmer", -12, {})], None),
 ("d02", 3.0, "hero picks one: 1%", ("cut",), [(0.4, "pop", -10, {}), (0.6, "ding", -14, {})], None),
 ("d03", 3.4, "the host opens 98 doors in a wave", ("cut",), [(0.3 + i * 0.25, "pop", -16, {"pitch": 0.8 + i * 0.05}) for i in range(10)], None),
 ("d04", 2.8, "goat chorus", ("cut",), [(0.25, "buzz", -14, {"pitch": 0.6}), (1.25, "buzz", -14, {"pitch": 0.6}), (2.25, "buzz", -14, {"pitch": 0.6})], None),
 ("d05", 3.8, "two doors left: hero's and the far one, ?", ("cut",), [(0.3, "hum", -22, {"dur": 3.0}), (1.4, "pop", -12, {})], None),
 ("d06", 3.6, "the 99% drains into the skipped door", ("cut",), [(0.4, "riser", -14, {"dur": 2.0}), (2.4, "shimmer", -10, {})], None),
 ("d07", 3.6, "three doors: 1/3 bubble, 2/3 cloud over 2 and 3", ("dip", 0.4), [(0.3, "pop", -12, {}), (1.2, "pop", -12, {"pitch": 0.8})], None),
 ("d08", 3.4, "door 3 opens, 2/3 pours into door 2", ("cut",), [(0.2, "whoosh", -14, {"pitch": 0.7}), (1.0, "riser", -14, {"dur": 1.4}), (2.4, "ding", -10, {})], None),
 ("d09", 2.6, "hero's big face: aha", ("cut",), [(0.2, "shimmer", -12, {})], None),
 # PLAY IT (lines 24-25)
 ("y01", 3.0, "hero rolls up sleeves at the machine, ×1 000", ("cut",), [(0.3, "pop", -12, {}), (1.5, "powerup", -12, {})], ("wind", -28)),
 ("y02", 4.2, "two garages fill: 353 vs 647", ("cut",), [(0.3, "counter", -12, {}), (0.4, "hum", -22, {"dur": 3.4})], None),
 ("y03", 2.6, "switch garage overflows, hero cheers", ("cut",), [(0.2, "impact", -12, {"pitch": 1.1}), (0.3, "cheer", -14, {"dur": 2.0})], None),
 # PIGEONS (lines 26-28)
 ("p01", 3.0, "2010 lab: pigeon boxes with lit keys", ("dip", 0.4), [(0.4, "blip", -14, {}), (1.0, "blip", -14, {"pitch": 1.2})], ("roomtone", -26)),
 ("p02", 5.0, "calendar 1 -> 30, switch rate 33% -> 96%", ("cut",), [(0.4, "counter", -14, {})] + [(0.6 + i * 0.4, "tick", -16, {"pitch": 1.4}) for i in range(7)], None),
 ("p03", 3.6, "students scratch heads, pigeon in glasses writes 2/3", ("cut",), [(0.8, "tick", -14, {"pitch": 0.8}), (1.2, "tick", -14, {"pitch": 0.8}), (2.1, "ding", -10, {})], None),
 # MONTY (lines 29-32)
 ("n01", 3.8, "1991 sunny house, palms, reporter knocks", ("dip", 0.4), [(0.0, "footstep", -16, {}), (1.7, "impact", -16, {"pitch": 1.6}), (1.95, "impact", -16, {"pitch": 1.6})], ("wind", -28)),
 ("n02", 5.2, "dining table, cups, tallies 4/10 vs 8/10", ("cut",), [(0.6 + i * 0.12, "blip", -18, {"pitch": 1 + i * 0.03}) for i in range(8)], ("roomtone", -26)),
 ("n03", 4.0, "host pulls a wad of cash, bills flutter", ("cut",), [(0.5, "swish", -12, {}), (0.7, "shimmer", -14, {})], None),
 ("n04", 4.0, "host's mood flips: door or cash", ("cut",), [(0.0, "stinger", -12, {}), (0.62, "pop", -14, {}), (1.25, "pop", -14, {"pitch": 0.8}), (1.87, "pop", -14, {}), (2.5, "pop", -14, {"pitch": 0.8})], None),
 ("n05", 5.0, "rule card: goat door 100% ✓, switch offer 100% ✓", ("cut",), [(0.1, "pop", -12, {}), (0.9, "ding", -10, {}), (1.7, "ding", -10, {"pitch": 1.2})], None),
 # END (lines 33-35)
 ("z01", 4.6, "dusk fork in the road: his hand still tied to road 1", ("dip", 0.6), [(0.0, "footstep", -18, {})], ("wind", -26)),
 ("z02", 4.0, "he lets go, takes road 2, a goat follows", ("cut",), [(0.5, "pop", -12, {"pitch": 0.6}), (1.2, "shimmer", -12, {})], ("wind", -26)),
 ("z03", 3.4, "back to the three doors and ?", ("cut",), [(0.6, "pop", -12, {}), (0.8, "stinger", -14, {})], ("murmur", -28)),
 ("z04", 9.0, "end card: logo, hero waves, goat, end-screen slots", ("fade", 0.6), [(0.2, "shimmer", -12, {})], None),
]
MUSIC = [
 ("k01", "mystery", 0.5), ("o01", "playful", 0.6), ("o06", "tension", 0.5), ("m01", "playful", 0.5), ("r01", "mystery", 0.5),
 ("d01", "wonder", 0.55), ("y01", "action", 0.55), ("p01", "playful", 0.5), ("n01", "calm", 0.5), ("n04", "tension", 0.5), ("z01", "hopeful", 0.5),
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
json.dump({"title": "10,000 People Told Her She Was Wrong", "duration": total, "shots": shots, "music": mus}, open(os.path.join(D, "shots.json"), "w"), indent=1)
print(len(shots), "shots,", total, "s")
