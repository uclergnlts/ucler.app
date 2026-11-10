// shots/05_real.js — lines 26-32: pigeons beat students (2010); the host's own dining-table test (1991), the cash twist, the rule card.
import { E, V, registerShot, layer, veil, ease, prog, clamp, lerp, rng, seg, circle, ring, rr, poly, glow, alpha, mix, linGrad, text } from '/engine/core.js';
import { POSES, posesAt, bigFace, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { hero, P } from '../hero.js';
import { HERO } from '../cast.js';
import { lbl, ambient } from '../kit.js';
import { qmark } from '../props.js';
import * as SH from '../sets/show.js';
const { GOLD, PINK, CYAN, DOORC, REPORTER, STUDENT, HOST } = SH;
const lab = (g) => { g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#e8eef4', '#c8d4e0']); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); for (let x = 0; x < E.W; x += 160) seg(g, [[x, 0], [x, E.H * 0.62]], 2, alpha('#8aa0b8', 0.2)); rr(g, -100, E.H * 0.62, E.W + 200, 30, 6); g.fillStyle = '#7a8aa0'; g.fill(); g.fillStyle = '#9aa8bc'; g.fillRect(-100, E.H * 0.62 + 30, E.W + 200, E.H); };
function box(g, bx, by, t, lit, peck, s = 1) { g.save(); g.translate(bx, by); g.scale(s, s); rr(g, -170, -280, 340, 280, 14); g.fillStyle = alpha('#ffffff', 0.5); g.fill(); g.strokeStyle = '#5a6a80'; g.lineWidth = 6; g.stroke();
  for (let j = 0; j < 3; j++) { circle(g, -90 + j * 90, -200, 26, lit === j ? GOLD : '#c8d0dc'); ring(g, -90 + j * 90, -200, 26, 4, '#5a6a80'); } SH.pigeon(g, -20, -10, 1.6, { t, peck }); g.restore(); }

// p01 — 2010: a lab with pigeon boxes, three lit keys each
registerShot('p01', { draw(g, t) {
  const cam = { z: 1.15 - 0.08 * t, x: 0, y: 0 };
  layer(g, cam, 1, (g) => { lab(g); for (let k = 0; k < 3; k++) box(g, E.W * (0.2 + k * 0.3), E.H * 0.62, t + k, (Math.floor(t * 1.5) + k) % 3, Math.max(0, Math.sin(t * 5 + k * 2))); });
  lbl(g, '2010', E.W * 0.06, E.H * 0.12, ease.out(prog(t, 0.2, 0.6)), 110, PINK);
} });

// p02 — calendar pages fly 1 -> 30; the pigeon's switch rate climbs 33% -> ~96%
registerShot('p02', { draw(g, t) {
  lab(g); const k = ease.inOut(prog(t, 0.4, 3.2)), day = Math.max(1, Math.round(1 + 29 * k));
  box(g, E.W * 0.32, E.H * 0.62, t, 1, Math.max(0, Math.sin(t * (4 + 10 * k))), 1.2);
  for (let i = 0; i < 4; i++) { const ph = (t * 2.5 + i / 4) % 1; if (k < 1) SH.calPage(g, E.W * 0.7 + ph * 500, E.H * 0.3 - ph * 200 + ph * ph * 500, 0.8, String(Math.max(1, day - i)), ph * 3, 1 - ph); }
  SH.calPage(g, E.W * 0.7, E.H * 0.3, 1.0, String(day));
  const pct = Math.round(33 + 63 * k); rr(g, E.W * 0.58, E.H * 0.62, 600, 50, 20); g.fillStyle = alpha('#2a3a50', 0.2); g.fill(); rr(g, E.W * 0.58, E.H * 0.62, 600 * pct / 100, 50, 20); g.fillStyle = GOLD; g.fill();
  text(g, '⇄', E.W * 0.555, E.H * 0.62 + 42, { size: 60, font: 'Nunito', weight: 900, align: 'right', color: '#2a3a50' }); lbl(g, `${pct}%`, E.W * 0.58 + 600 * pct / 100 - 10, E.H * 0.62 + 140, 1, 80, '#2a3a50', 'right');
} });

// p03 — students scratch their heads; a pigeon in glasses writes 2/3 on the chalkboard
registerShot('p03', { draw(g, t) {
  const cam = { z: 1.0 + 0.04 * t, x: 0, y: 0 };
  layer(g, cam, 1, (g) => { SH.room(g, '#d8e0ea', '#b8c4d4', E.H * 0.84, '#8a7a6a');
    SH.chalkboard(g, E.W * 0.52, E.H * 0.12, 760, 420, (g) => { const w = prog(t, 0.8, 2.0); g.save(); g.beginPath(); g.rect(E.W * 0.52, E.H * 0.12, 760 * (0.25 + 0.6 * w), 420); g.clip(); text(g, '2/3', E.W * 0.52 + 380, E.H * 0.12 + 290, { size: 230, font: 'Nunito', weight: 900, align: 'center', color: alpha('#f4efe6', 0.9) }); g.restore(); });
    const px = E.W * 0.6 + 500 * prog(t, 0.8, 2.0); g.save(); g.translate(px, E.H * 0.54); SH.pigeon(g, 0, 0, 1.5, { t, f: 1 }); g.strokeStyle = '#1a1424'; g.lineWidth = 4; for (const dx of [36, 56]) { g.beginPath(); g.arc(dx * 1.5 - 4, -110, 12, 0, Math.PI * 2); g.stroke(); } g.restore();
    seg(g, [[E.W * 0.5, E.H * 0.6], [E.W * 0.98, E.H * 0.6]], 18, '#6a4a2a');
    for (let i = 0; i < 3; i++) { const x = E.W * (0.08 + i * 0.14); SH.desk(g, x + 40, E.H * 0.9, 220, '#8a6a4a'); hero(g, { x, y: E.H * 0.9, s: 1.5, facing: 1, t: t + i, outfit: STUDENT, pose: i === 1 ? POSES.handsOnHead : P('think', { hF: [20 + 6 * Math.sin(t * 12 + i), -200] }), expr: 'confused', look: [1, -0.4] }); qmark(g, x + 10, E.H * 0.42 - 10 * Math.sin(t * 3 + i), 80, 0.8, '#5a6a80'); }
  });
} });

// n01 — 1991: a sunny house with palms; a reporter with a notebook knocks on the door
registerShot('n01', { draw(g, t) {
  const cam = { z: 1.0 + 0.03 * t, x: 0, y: 0 };
  layer(g, cam, 0.3, (g) => { g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#6ab0f0', '#fde0b0']); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); FX.sun(g, E.W * 0.86, E.H * 0.16, 60); FX.hills(g, { y: E.H * 0.7, color: '#c8a88a', amp: 40 }); });
  layer(g, cam, 0.8, (g) => { g.fillStyle = '#f4ece0'; g.fillRect(E.W * 0.36, E.H * 0.34, 900, 470); poly(g, [[E.W * 0.33, E.H * 0.36], [E.W * 0.36 + 450, E.H * 0.2], [E.W * 0.39 + 900, E.H * 0.36]], '#c8644a');
    SH.win(g, E.W * 0.42, E.H * 0.46, 200, 160, ['#bfe6ff', '#8fc0e8'], { frame: '#e8dccc' }); SH.win(g, E.W * 0.78, E.H * 0.46, 200, 160, ['#bfe6ff', '#8fc0e8'], { frame: '#e8dccc' });
    rr(g, E.W * 0.6, E.H * 0.53, 150, 280, 8); g.fillStyle = '#6a3a2a'; g.fill(); circle(g, E.W * 0.6 + 125, E.H * 0.68, 8, GOLD); SH.palm(g, E.W * 0.28, E.H * 0.82, 1.4, t); SH.palm(g, E.W * 0.92, E.H * 0.82, 1.2, t + 1); });
  layer(g, cam, 1, (g) => { g.fillStyle = '#7aa05a'; g.fillRect(-E.W, E.H * 0.81, E.W * 3, E.H); rr(g, E.W * 0.58, E.H * 0.81, 200, 30, 4); g.fillStyle = '#d8c8b0'; g.fill();
    const k = ease.inOut(prog(t, 0, 1.4)), knock = t > 1.6 ? Math.abs(Math.sin(t * 12)) : 0;
    const h = hero(g, { x: lerp(E.W * 0.2, E.W * 0.54, k), y: E.H * 0.86, s: 1.8, facing: 1, t, outfit: REPORTER, pose: k < 1 ? walkPose(t * 2.2) : P('point', { hF: [44 + 10 * knock, -140] }), expr: 'happy', look: [1, 0] });
    rr(g, h.handB[0] - 30, h.handB[1] - 40, 50, 66, 4); g.fillStyle = '#f4efe6'; g.fill(); if (knock > 0.8) { FX.sparkle(g, E.W * 0.6 + 4, E.H * 0.62, 20, '#ffffff', 0.8); } });
  lbl(g, '1991', E.W * 0.06, E.H * 0.12, ease.out(prog(t, 0.2, 0.6)), 110, PINK);
} });

// n02 — dining table: three upside-down cups; tallies stay 4/10, switch 8/10
registerShot('n02', { draw(g, t) {
  const cam = { z: 1.05 + 0.03 * t, x: 0, y: 0 };
  layer(g, cam, 0.3, (g) => { SH.room(g, '#f4e4cc', '#e0c8a8', E.H * 0.8, '#8a6a4a'); SH.win(g, E.W * 0.7, E.H * 0.1, 360, 300, ['#6ab0f0', '#fde0b0'], { sun: true, frame: '#c8b098' }); SH.palm(g, E.W * 0.82, E.H * 0.42, 0.6, t); });
  layer(g, cam, 1, (g) => {
    const host = SH.host(g, { x: E.W * 0.62, y: E.H * 0.86, s: 1.8, facing: -1, t, pose: P('reach', { hF: [60 + 30 * Math.sin(t * 4), -116] }), expr: 'smile', look: [-1, 0.4] });
    hero(g, { x: E.W * 0.12, y: E.H * 0.86, s: 1.8, facing: 1, t, outfit: REPORTER, pose: POSES.think, expr: 'thinking', look: [1, 0.3] });
    rr(g, E.W * 0.2, E.H * 0.86 - 190, 780, 26, 8); g.fillStyle = '#7a4a2e'; g.fill(); seg(g, [[E.W * 0.23, E.H * 0.86 - 170], [E.W * 0.23, E.H * 0.86]], 14, '#5a3420'); seg(g, [[E.W * 0.6, E.H * 0.86 - 170], [E.W * 0.6, E.H * 0.86]], 14, '#5a3420');
    const sh = Math.floor(t * 3); for (let i = 0; i < 3; i++) { const x = E.W * 0.28 + ((i + sh) % 3) * 160 + 10 * Math.sin(t * 8 + i); SH.cup(g, x, E.H * 0.86 - 190, 1.1, DOORC[i]); }
    const tally = (x, y, n, c, sym) => { text(g, sym, x - 70, y + 22, { size: 70, font: 'Nunito', weight: 900, align: 'center', color: '#5a3a2a' }); for (let i = 0; i < 10; i++) { const on = i < n && t > 0.6 + i * 0.12; circle(g, x + i * 72, y, 28, on ? c : alpha('#5a3a2a', 0.2)); if (on) SH.car(g, x + i * 72, y + 14, 0.15, { shine: 0, color: '#ffffff' }); } lbl(g, `${Math.min(n, Math.max(0, Math.floor((t - 0.6) / 0.12) + 1))}/10`, x + 740, y + 30, 1, 84, c, 'left'); };
    tally(E.W * 0.1, E.H * 0.15, 4, CYAN, '='); tally(E.W * 0.1, E.H * 0.27, 8, GOLD, '⇄');
  });
} });

// n03 — the twist: the host pulls a wad of cash from his jacket; bills flutter
registerShot('n03', { draw(g, t) {
  const cam = { z: 1.3 + 0.05 * t, x: 120, y: -40 };
  layer(g, cam, 0.3, (g) => { SH.room(g, '#f4e4cc', '#e0c8a8', E.H * 0.8, '#8a6a4a'); SH.win(g, E.W * 0.7, E.H * 0.1, 360, 300, ['#6ab0f0', '#fde0b0'], { sun: true, frame: '#c8b098' }); });
  layer(g, cam, 1, (g) => { const h = SH.host(g, { x: E.W * 0.56, y: E.H * 0.9, s: 2.0, facing: -1, t, pose: posesAt(t, [[0, P('holdFront', { hF: [6, -150] })], [0.6, POSES.reach]]), expr: t > 0.6 ? 'smirk' : 'neutral', look: [-1, 0] });
    if (t > 0.5) { SH.cash(g, h.hand[0] - 20, h.hand[1] - 10, 1.0, -0.2 + 0.1 * Math.sin(t * 3)); const r = rng(8); for (let i = 0; i < 10; i++) { const ph = (t - 0.6) * 0.6 + r(); const y = h.hand[1] - 60 + ((ph * 300) % 700), x = h.hand[0] - 300 + r() * 400 + 40 * Math.sin(ph * 6); SH.bill(g, x, y, 0.8, ph * 4); } }
    SH.cup(g, E.W * 0.24, E.H * 0.9 - 190, 1.1, DOORC[0]); rr(g, E.W * 0.1, E.H * 0.9 - 190, 700, 26, 8); g.fillStyle = '#7a4a2e'; g.fill(); });
} });

// n04 — his mood decides: the host's big face flips between a grin and a frown; door or cash
registerShot('n04', { draw(g, t) {
  g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#1a0c2e', '#3a1650']); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); ambient(g, t, { color: '#9ad86a', gears: false, motes: 30 });
  const m = Math.floor(t * 1.6) % 2; bigFace(g, E.W / 2, E.H * 0.64, V(290, 300), { outfit: HOST, expr: m ? 'smirk' : 'angry', look: [m ? 1 : -1, 0], rimColor: '#ffd7f0', rimSide: 1 });
  const by = E.H * 0.64 + V(290, 300) * 0.95; poly(g, [[E.W / 2, by], [E.W / 2 - 50, by - 26], [E.W / 2 - 50, by + 26]], PINK); poly(g, [[E.W / 2, by], [E.W / 2 + 50, by - 26], [E.W / 2 + 50, by + 26]], PINK);
  SH.door(g, E.W * 0.15, E.H * 0.86, 260, 430, { n: 2, t, color: DOORC[1], glowC: GOLD }); if (!m) glow(g, E.W * 0.15, E.H * 0.6, 200, GOLD, 0.3);
  SH.cash(g, E.W * 0.85, E.H * 0.6, 2.6, 0.1 * Math.sin(t * 2)); if (m) glow(g, E.W * 0.85, E.H * 0.6, 200, '#6abe7a', 0.35);
} });

// n05 — the rule card: host always opens a goat door ✓, always offers the switch ✓
registerShot('n05', { draw(g, t) {
  g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#1a0c2e', '#3a1650']); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); ambient(g, t, { color: GOLD, gears: false, motes: 24 });
  const c = ease.outBack(prog(t, 0, 0.5)); g.save(); g.translate(E.W / 2, E.H / 2); g.scale(c, c); g.rotate(-0.02); rr(g, -620, -380, 1240, 760, 30); g.fillStyle = '#f4efe6'; g.fill(); rr(g, -620, -380, 1240, 90, 30); g.fillStyle = PINK; g.fill(); g.restore();
  if (c < 0.9) return;
  const row = (y, k, drawIcon) => { drawIcon(E.W * 0.33, y); SH.check(g, E.W * 0.68, y - 10, 1.4, k); };
  row(E.H * 0.47, prog(t, 0.8, 1.3), (x, y) => { SH.door(g, x - 110, y + 90, 130, 200, { n: 3, t, open: 1, label: false, color: DOORC[2], inside: (g, cx, cy) => SH.goat(g, cx, cy, 0.6, { t, f: -1 }) }); seg(g, [[x - 10, y], [x + 80, y]], 8, '#2a1e3a'); text(g, '100%', x + 170, y + 30, { size: 90, font: 'Nunito', weight: 900, align: 'center', color: '#2a1e3a' }); });
  row(E.H * 0.75, prog(t, 1.6, 2.1), (x, y) => { SH.mic(g, x - 110, y + 10, 1.4, -0.4); seg(g, [[x - 40, y], [x + 80, y]], 8, '#2a1e3a'); text(g, '⇄ 100%', x + 200, y + 30, { size: 90, font: 'Nunito', weight: 900, align: 'center', color: '#2a1e3a' }); });
} });
