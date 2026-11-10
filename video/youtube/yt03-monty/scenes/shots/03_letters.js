// shots/03_letters.js — lines 12-17: her answer (2/3), the flood of letters, angry professors; the great mathematician, the table slam, the computer.
import { E, V, registerShot, layer, veil, ease, prog, clamp, lerp, rng, seg, circle, ring, rr, poly, glow, alpha, mix, linGrad, text } from '/engine/core.js';
import { POSES, posesAt, bigFace, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { hero, P } from '../hero.js';
import { HERO } from '../cast.js';
import { lbl, ambient } from '../kit.js';
import { qmark } from '../props.js';
import * as SH from '../sets/show.js';
const { GOLD, PINK, CYAN, DOORC, WOMAN, PROF, MAILMAN } = SH;
const study = (g, t) => { SH.room(g, '#3a2e24', '#5a4434', E.H * 0.8, '#2e241c'); SH.win(g, E.W * 0.36, E.H * 0.1, 300, 260, ['#7ab0e0', '#c8e0f0'], { frame: '#4a3424' });
  for (let i = 0; i < 3; i++) { rr(g, E.W * 0.62 + i * 0, E.H * (0.1 + i * 0.2), 560, 16, 4); g.fillStyle = '#6a4a34'; g.fill(); for (let j = 0; j < 14; j++) { rr(g, E.W * 0.63 + j * 38, E.H * (0.1 + i * 0.2) - 110 + (j % 3) * 10, 30, 110 - (j % 3) * 10, 3); g.fillStyle = DOORC[(i + j) % 3]; g.globalAlpha = 0.55; g.fill(); g.globalAlpha = 1; } } };

// m01 — typewriter close-up: the key strikes, a big "2/3" stamp lands on the paper
registerShot('m01', { draw(g, t) {
  const cam = { z: 1.0 + 0.06 * t, x: 0, y: 0 };
  layer(g, cam, 0.4, (g) => { g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#3a2e3a', '#5a3a2e']); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); glow(g, E.W * 0.7, E.H * 0.1, 600, '#fff3c4', 0.25); });
  layer(g, cam, 1, (g) => { SH.desk(g, E.W / 2, E.H * 1.08, 1500, '#6a4a3a'); SH.typewriter(g, E.W / 2, E.H * 0.98, 2.2, t, 0.5 + 0.3 * ease.inOut(prog(t, 0, 1.2)));
    for (let k = 0; k < 3; k++) { rr(g, E.W * 0.41 + k * 80, E.H * 0.2, 60, 100, 5); g.fillStyle = DOORC[k]; g.fill(); }
    seg(g, [[E.W * 0.44, E.H * 0.14], [E.W * 0.52, E.H * 0.14]], 8, alpha(PINK, prog(t, 0.6, 0.9))); poly(g, [[E.W * 0.54, E.H * 0.14], [E.W * 0.515, E.H * 0.12], [E.W * 0.515, E.H * 0.16]], alpha(PINK, prog(t, 0.6, 0.9)));
    SH.stamp(g, E.W * 0.66, E.H * 0.3, '2/3', prog(t, 1.1, 1.6), PINK, 120); });
} });

// m02 — she holds up the printed column; switching arrow 1 -> 2, "2/3" glows
registerShot('m02', { draw(g, t) {
  const cam = { z: 1.06 - 0.03 * t, x: 0, y: 0 };
  layer(g, cam, 0.3, (g) => { SH.room(g, '#2a1e3a', '#4a2e48', E.H * 0.84, '#2a1a24'); for (let i = 0; i < 6; i++) SH.magazine(g, E.W * 0.08 + i * 50, E.H * 0.8 - i * 16, 260, 50, { rot: 0.02 * i }); });
  layer(g, cam, 1, (g) => {
    const h = hero(g, { x: E.W * 0.36, y: E.H * 0.88, s: 2.1, facing: 1, t, outfit: WOMAN, pose: posesAt(t, [[0, POSES.relaxed], [0.3, POSES.holdFront]]), expr: 'smile', look: [1, 0], rim: { color: '#fff3c4', dir: [0.7, -0.6], w: 5 } });
    const k = ease.outBack(prog(t, 0.2, 0.7)); g.save(); g.translate(h.hand[0] + 40, h.hand[1] - 60); g.scale(k, k); SH.magazine(g, 0, 0, 360, 460, { rot: 0.06, mark: '2/3' }); g.restore();
    const a = prog(t, 0.9, 1.5), x0 = E.W * 0.62, y0 = E.H * 0.44; [0, 1].forEach((i) => { rr(g, x0 + i * 300, y0, 160, 260, 10); g.fillStyle = DOORC[i]; g.fill(); text(g, String(i + 1), x0 + 80 + i * 300, y0 + 110, { size: 90, font: 'Nunito', weight: 900, align: 'center', color: '#ffffff' }); });
    if (a > 0) { g.strokeStyle = GOLD; g.lineWidth = 12; g.lineCap = 'round'; g.beginPath(); g.moveTo(x0 + 80, y0 - 20); g.quadraticCurveTo(x0 + 230, y0 - 160, x0 + 80 + 300 * a, y0 - 20 - 0 * a); g.stroke(); }
    lbl(g, '2/3', x0 + 380, y0 + 360, ease.out(prog(t, 1.5, 1.9)), 110, GOLD, 'center'); if (t > 1.5) glow(g, x0 + 380, y0 + 130, 240, GOLD, 0.25);
  });
} });

// m03 — a mailman struggles up the path with bulging sacks; the mailbox bursts
registerShot('m03', { draw(g, t) {
  const cam = { z: 1.05, x: -60 * t, y: 0 };
  layer(g, cam, 0.3, (g) => { g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#8ac0e8', '#f4dcc0']); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); FX.clouds(g, { seed: 9, a: 0.6 }); FX.hills(g, { y: E.H * 0.7, color: '#8ab07a', amp: 40 }); });
  layer(g, cam, 0.7, (g) => { g.fillStyle = '#d8b898'; g.fillRect(E.W * 0.68, E.H * 0.36, 620, 440); poly(g, [[E.W * 0.66, E.H * 0.38], [E.W * 0.68 + 310, E.H * 0.16], [E.W * 0.7 + 640, E.H * 0.38]], '#8a4a3a'); SH.win(g, E.W * 0.72, E.H * 0.48, 170, 150, ['#bfe6ff', '#8fc0e8']); });
  layer(g, cam, 1, (g) => {
    g.fillStyle = '#6a9a5a'; g.fillRect(-E.W, E.H * 0.8, E.W * 4, E.H); rr(g, -E.W, E.H * 0.8, E.W * 4, 30, 0); g.fillStyle = '#c8b8a0'; g.fill();
    const mx = E.W * 0.6, my = E.H * 0.82; seg(g, [[mx, my], [mx, my - 200]], 14, '#4a3a2e'); rr(g, mx - 100, my - 300, 200, 110, 36); g.fillStyle = '#3f8ff0'; g.fill();
    const r = rng(2); for (let i = 0; i < 26; i++) { const k = prog(t, 1.4 + r() * 0.3, 2.6), a = -Math.PI / 2 + (r() - 0.5) * 2.4; if (k > 0) SH.envelope(g, mx + Math.cos(a) * 400 * k, my - 260 + Math.sin(a) * 300 * k + 400 * k * k, 0.6, k * 6 + i); }
    const x = E.W * 0.12 + 160 * t, wp = walkPose(t * 2.2); const h = hero(g, { x, y: E.H * 0.84, s: 1.8, facing: 1, t, outfit: MAILMAN, pose: P(wp, { hF: [30, -150], hB: [-30, -150], eF: [24, -170], eB: [-20, -170] }), expr: 'nervous', look: [1, -0.2] });
    for (const dx of [-90, 90]) { g.fillStyle = '#a07a4a'; g.beginPath(); g.ellipse(x + dx, E.H * 0.84 - 330, 90, 70, 0, 0, Math.PI * 2); g.fill(); SH.envelope(g, x + dx, E.H * 0.84 - 400, 0.6, 0.3 * dx / 90); }
  });
} });

// m04 — the sorting room: every slot overflows; university crests on the envelopes
registerShot('m04', { draw(g, t) {
  const cam = { z: 1.15 - 0.08 * t, x: 0, y: 0 };
  layer(g, cam, 1, (g) => {
    SH.room(g, '#3a2a3a', '#5a3e48', E.H * 0.88, '#2a1e28');
    for (let i = 0; i < 10; i++) for (let j = 0; j < 5; j++) { const x = 60 + i * 182, y = 60 + j * 150; rr(g, x, y, 160, 120, 6); g.fillStyle = '#2a1e2a'; g.fill(); const r = rng(i * 7 + j), n = 1 + Math.floor(r() * 3 + t * 2);
      for (let k = 0; k < Math.min(n, 6); k++) { SH.envelope(g, x + 80 + (r() - 0.5) * 40, y + 90 - k * 16 + (k > 3 ? 40 * prog(t, 0.5 + r(), 1.5 + r()) : 0), 0.75, (r() - 0.5) * 0.6, k % 2 ? '#ffe7b0' : '#f4efe6'); circle(g, x + 80, y + 90 - k * 16, 8, DOORC[k % 3]); } }
    SH.letterRain(g, t, { count: 30, seed: 11, speed: 300 });
  });
} });

// m05 — professors in mortarboards shout at the paper; ✗ marks fly out
registerShot('m05', { draw(g, t) {
  const cam = { z: 1.0 + 0.04 * t, x: 0, y: 0 };
  layer(g, cam, 0.3, (g) => { SH.room(g, '#3a2a46', '#5a3e58', E.H * 0.84, '#2a1e2e'); SH.chalkboard(g, E.W * 0.3, E.H * 0.08, 800, 300, (g) => { text(g, '1/2', E.W * 0.5, E.H * 0.3, { size: 140, font: 'Nunito', weight: 900, align: 'center', color: alpha('#f4efe6', 0.8) }); }); });
  layer(g, cam, 1, (g) => {
    [[0.16, 1, 'angry', POSES.point], [0.38, 1, 'angry', POSES.facepalm], [0.62, -1, 'angry', POSES.pointUp], [0.84, -1, 'shocked', POSES.handsOnHead]].forEach(([fx, f, ex, ps], i) => {
      const jump = Math.abs(Math.sin(t * 6 + i)) * 10; const h = hero(g, { x: E.W * fx, y: E.H * 0.88 - jump, s: 1.7, facing: f, t: t + i, outfit: PROF, pose: ps, expr: ex, look: [-f * 0.3 + f, 0] }); SH.cap(g, h, 1.7);
      const k = prog(t, 0.5 + i * 0.35, 1.4 + i * 0.35); if (k > 0 && k < 1) { SH.envelope(g, h.hand[0] + f * 400 * k, h.hand[1] - 300 * k + 300 * k * k, 0.7, k * 8); }
      SH.cross(g, E.W * fx, E.H * 0.5 - 30 * Math.sin(t * 3 + i), 0.7, prog(t, 0.6 + i * 0.3, 1.0 + i * 0.3)); });
  });
} });

// m06 — the pile reaches the ceiling; only the mailman's hand pokes out
registerShot('m06', { draw(g, t) {
  const cam = { z: 1.0 + 0.04 * t, x: 0, y: 0 };
  layer(g, cam, 1, (g) => {
    SH.room(g, '#3a2a3a', '#5a3e48', E.H * 0.88, '#2a1e28');
    const pile = 0.5 + 0.5 * ease.out(prog(t, 0, 2.4)); const r = rng(4);
    for (let i = 0; i < 200; i++) { const x = E.W * 0.5 + (r() - 0.5) * 1700 * (1 - r() * 0.4), y = E.H * 0.9 - r() * E.H * pile * (1 - Math.abs(x - E.W / 2) / 1500); SH.envelope(g, x, y, 0.85, (r() - 0.5) * 1.4, r() > 0.85 ? '#ffe7b0' : '#f4efe6'); }
    const hx = E.W * 0.52, hy = E.H * (0.9 - pile * 0.8); seg(g, [[hx, hy + 60], [hx + 8 * Math.sin(t * 8), hy]], 22, MAILMAN.color); circle(g, hx + 8 * Math.sin(t * 8), hy - 10, 18, '#f2c9a0');
    SH.letterRain(g, t, { count: 24, seed: 5, speed: 400 });
  });
} });

// r01 — a mathematician's study: coffee cups, towers of papers, ≈1 500 papers
registerShot('r01', { draw(g, t) {
  const cam = { z: 1.05 + 0.04 * t, x: 0, y: 0 };
  layer(g, cam, 0.3, (g) => study(g, t));
  layer(g, cam, 1, (g) => {
    for (let k = 0; k < 7; k++) SH.papers(g, E.W * (0.1 + k * 0.12), E.H * 0.8, 12 + ((k * 7) % 10) + Math.floor(t * 4), 1.1, k + 1);
    SH.desk(g, E.W * 0.5, E.H * 0.86, 700, '#6a4a3a');
    const h = hero(g, { x: E.W * 0.42, y: E.H * 0.86, s: 2.0, facing: 1, t, outfit: PROF, pose: P('think', { hF: [60 + 12 * Math.sin(t * 20), -112], eF: [36, -130] }), expr: 'determined', look: [1, 0.5] }); SH.glasses(g, h, 1);
    for (let i = 0; i < 5; i++) SH.cup(g, E.W * 0.58 + i * 46, E.H * 0.86 - 100, 0.55, i % 2 ? '#e8e4d8' : '#d8d0c0');
    for (let i = 0; i < 3; i++) { const ph = (t * 0.9 + i / 3) % 1; seg(g, [[E.W * 0.6 + i * 46, E.H * 0.86 - 150 - ph * 80], [E.W * 0.6 + i * 46 + 6 * Math.sin(ph * 9), E.H * 0.86 - 180 - ph * 80]], 5, alpha('#ffffff', 0.35 * (1 - ph))); }
    for (let i = 0; i < 6; i++) { const ph = prog(t, i * 0.5, i * 0.5 + 1.2); if (ph > 0 && ph < 1) { g.save(); g.translate(E.W * 0.5 + 500 * ph, E.H * 0.6 - 260 * Math.sin(ph * Math.PI)); g.rotate(ph * 6); rr(g, -40, -26, 80, 52, 3); g.fillStyle = '#f4efe6'; g.fill(); g.restore(); } }
  });
  lbl(g, `≈ ${Math.round(1500 * ease.inOut(prog(t, 0.6, 2.4))).toLocaleString('en-US').replace(',', ' ')}`, E.W * 0.06, E.H * 0.12, ease.out(prog(t, 0.5, 0.9)), 100, GOLD);
} });

// r02 — "impossible": he slams the table, a cup jumps, 50/50 bubble
registerShot('r02', { draw(g, t) {
  const hit = t > 0.8, shk = hit ? Math.sin(t * 50) * 14 * (1 - prog(t, 0.8, 1.3)) : 0;
  const cam = { z: 1.35, x: shk, y: -40 };
  layer(g, cam, 0.3, (g) => study(g, t));
  layer(g, cam, 1, (g) => {
    SH.desk(g, E.W * 0.5, E.H * 0.86, 900, '#6a4a3a');
    const h = hero(g, { x: E.W * 0.4, y: E.H * 0.86, s: 2.0, facing: 1, t, outfit: PROF, pose: posesAt(t, [[0, POSES.pointUp], [0.7, POSES.point]]), expr: hit ? 'angry' : 'determined', look: [1, 0.2] }); SH.glasses(g, h, 1);
    const cj = hit ? Math.max(0, Math.sin(Math.min(1, (t - 0.8) * 2) * Math.PI)) * 120 : 0; SH.cup(g, E.W * 0.62, E.H * 0.86 - 100 - cj, 0.7); if (hit && t < 1.4) { for (let i = 0; i < 5; i++) circle(g, E.W * 0.62 + (i - 2) * 30, E.H * 0.86 - 160 - cj - i * 6, 8, alpha('#8a5a3a', 0.8)); FX.sparkle(g, E.W * 0.52, E.H * 0.86 - 110, 50, '#ffffff', 0.9); }
    const b = ease.outBack(prog(t, 1.1, 1.5)); if (b > 0) { g.save(); g.translate(E.W * 0.68, E.H * 0.28); g.scale(b, b); rr(g, -200, -90, 400, 180, 40); g.fillStyle = '#f4efe6'; g.fill(); poly(g, [[-120, 80], [-180, 150], [-60, 86]], '#f4efe6'); text(g, '50/50', 0, 36, { size: 100, font: 'Nunito', weight: 900, align: 'center', color: '#2a1e3a' }); g.restore(); }
  });
} });

// r03 — an old computer plays the game again and again: the switch bar pulls ahead
registerShot('r03', { draw(g, t) {
  const cam = { z: 1.1 + 0.08 * t, x: 0, y: 0 };
  layer(g, cam, 0.3, (g) => { g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#1e2a2a', '#2a3a34']); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); ambient(g, t, { color: '#5fffa0', gears: false, motes: 20 }); });
  layer(g, cam, 1, (g) => {
    rr(g, -100, E.H * 0.8, E.W + 200, 40, 6); g.fillStyle = '#4a3a2a'; g.fill();
    const n = Math.floor(lerp(0, 600, ease.inOut(prog(t, 0.2, 3)))), sw = Math.round(n * 0.66), st = n - sw;
    SH.oldComputer(g, E.W * 0.55, E.H * 0.8, 1.9, (g, x, y, w, h) => { text(g, `${n}`, x + w / 2, y + 46, { size: 40, font: 'Nunito', weight: 900, align: 'center', color: '#5fffa0' });
      rr(g, x + 20, y + 80, (w - 40) * st / 600 + 2, 26, 4); g.fillStyle = alpha('#5fffa0', 0.45); g.fill(); rr(g, x + 20, y + 120, (w - 40) * sw / 600 + 2, 26, 4); g.fillStyle = '#5fffa0'; g.fill();
      for (let k = 0; k < 3; k++) { rr(g, x + w / 2 - 50 + k * 36, y + 152, 26, 14, 2); g.fillStyle = (Math.floor(t * 8) % 3) === k ? '#5fffa0' : alpha('#5fffa0', 0.3); g.fill(); } });
    const h = hero(g, { x: E.W * 0.2 + 80 * ease.inOut(prog(t, 0.5, 2.5)), y: E.H * 0.82, s: 1.9, facing: 1, t, outfit: PROF, pose: P('think', {}), expr: t > 2 ? 'surprised' : 'thinking', look: [1, -0.2] }); SH.glasses(g, h, 1);
  });
} });

// r04 — he gives in: raises a tiny white flag, "!" — then leans in to the screen
registerShot('r04', { draw(g, t) {
  const cam = { z: 1.4 + 0.04 * t, x: -200, y: -60 };
  layer(g, cam, 0.3, (g) => { g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#1e2a2a', '#2a3a34']); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); });
  layer(g, cam, 1, (g) => {
    rr(g, -100, E.H * 0.8, E.W + 200, 40, 6); g.fillStyle = '#4a3a2a'; g.fill();
    SH.oldComputer(g, E.W * 0.62, E.H * 0.8, 1.9, (g, x, y, w, h) => { text(g, '2/3', x + w / 2, y + 110, { size: 90, font: 'Nunito', weight: 900, align: 'center', color: '#5fffa0' }); });
    const h = hero(g, { x: E.W * 0.36, y: E.H * 0.82, s: 2.0, facing: 1, t, outfit: PROF, pose: posesAt(t, [[0, POSES.think], [0.7, POSES.pointUp]]), expr: t > 0.7 ? 'awe' : 'surprised', look: [1, -0.1] }); SH.glasses(g, h, 1);
    if (t > 0.8) { const [x, y] = h.hand; seg(g, [[x, y], [x, y - 110]], 5, '#6a5a4a'); const w = Math.sin(t * 10) * 8; poly(g, [[x, y - 110], [x + 80, y - 100 + w], [x, y - 64]], '#ffffff'); }
    const e = ease.outBack(prog(t, 0.5, 0.8)); if (e > 0) lbl(g, '!', h.head[0] - 10, h.head[1] - 90, 1, 140 * e, GOLD, 'center');
  });
} });
