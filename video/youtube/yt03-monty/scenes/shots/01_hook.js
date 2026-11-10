// shots/01_hook.js — lines 1-3: 1990 column, 10 000 angry letters, PhDs, a famous mathematician says no; she was right.
import { E, V, registerShot, layer, veil, ease, prog, clamp, lerp, rng, seg, circle, ring, rr, poly, glow, alpha, mix, linGrad, text } from '/engine/core.js';
import { POSES, posesAt, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { hero, P } from '../hero.js';
import { HERO } from '../cast.js';
import { lbl, ambient } from '../kit.js';
import { qmark } from '../props.js';
import * as SH from '../sets/show.js';
const { GOLD, PINK, CYAN, DOORC, WOMAN, PROF } = SH;

// k01 — night, 1990: a woman at her desk types an answer; lamp, window, magazine
registerShot('k01', { draw(g, t) {
  const cam = { z: 1.04 + 0.03 * t, x: 0, y: 0 };
  layer(g, cam, 0.3, (g) => { SH.room(g, '#2a1e3a', '#4a2e48', E.H * 0.8, '#2a1a24'); SH.win(g, E.W * 0.12, E.H * 0.14, 380, 300, undefined, { moon: true, t });
    for (let i = 0; i < 4; i++) { rr(g, E.W * 0.74 + i * 34, E.H * 0.22, 26, 150 - i * 12, 3); g.fillStyle = DOORC[i % 3]; g.fill(); } seg(g, [[E.W * 0.72, E.H * 0.37], [E.W * 0.86, E.H * 0.37]], 10, '#5a3e48'); });
  layer(g, cam, 1, (g) => {
    const dy = E.H * 0.8;
    SH.chair2(g, E.W * 0.36, dy, 1.4, '#3a2630', 1);
    hero(g, { x: E.W * 0.38, y: dy - 10, s: 1.8, facing: 1, t, outfit: WOMAN, pose: P('sit', { hF: [70 + 6 * Math.sin(t * 18), -112], hB: [62 + 6 * Math.cos(t * 16), -116], eF: [40, -128], eB: [34, -130] }), expr: 'thinking', look: [1, 0.2], rim: { color: '#fff3c4', dir: [0.8, -0.5], w: 4 } });
    SH.desk(g, E.W * 0.55, dy, 560, '#5a3a2e');
    SH.typewriter(g, E.W * 0.52, dy - 100, 0.9, t, ease.inOut(prog(t, 0.2, 3)));
    SH.lamp(g, E.W * 0.7, dy - 100, 1.1, 1);
    SH.magazine(g, E.W * 0.66, dy - 112, 160, 40, { rot: -0.05 });
  });
  const a = ease.out(prog(t, 0.3, 0.9)); lbl(g, '1990', E.W * 0.06, E.H * 0.9, a, 110, GOLD);
} });

// k02 — close: the magazine page with three doors and a "?", a pen circles door 1 then door 2
registerShot('k02', { draw(g, t) {
  const cam = { z: 1.0 + 0.05 * t, x: 0, y: 0 };
  layer(g, cam, 0.4, (g) => { g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#5a3a2e', '#3a241e']); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); for (let y = 0; y < E.H; y += 90) seg(g, [[-E.W, y + 20 * Math.sin(y)], [E.W * 2, y]], 3, alpha('#000000', 0.12)); glow(g, E.W * 0.6, E.H * 0.2, 700, '#fff3c4', 0.18); });
  layer(g, cam, 1, (g) => {
    const drop = 1 - ease.out(prog(t, 0, 0.6)); SH.magazine(g, E.W * 0.5, E.H * 0.52 - drop * 300, 1100, 760, { rot: -0.04 + drop * 0.2, mark: '' });
    const q = ease.outBack(prog(t, 0.7, 1.1)); if (q > 0) qmark(g, E.W * 0.63, E.H * 0.78, 200 * q, 1, PINK);
    // pen loops around the doors
    const ph = prog(t, 1.2, 2.6); if (ph > 0) { const px = E.W * 0.5 + 55 + 1100 * 0.05 + 1100 * 0.13 * Math.floor(ph * 2.99) + 50 + 70 * Math.cos(t * 9), py = E.H * 0.52 - 760 * 0.14 + 60 * Math.sin(t * 9);
      g.save(); g.translate(px, py); g.rotate(0.6); rr(g, -12, -150, 24, 150, 8); g.fillStyle = '#2a3a6a'; g.fill(); poly(g, [[-12, 0], [12, 0], [0, 30]], '#e8d8a0'); g.restore(); }
  });
} });

// k03 — letters pour into her mailbox: the counter climbs to 10 000
registerShot('k03', { draw(g, t) {
  const cam = { z: 1.0 + 0.02 * t, x: 0, y: 0 };
  layer(g, cam, 0.3, (g) => { g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#7ab0e0', '#f0d0b0']); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); FX.clouds(g, { seed: 4, a: 0.5, y: E.H * 0.1 }); FX.hills(g, { y: E.H * 0.72, color: '#7aa07a', amp: 50 }); });
  layer(g, cam, 0.7, (g) => { g.fillStyle = '#c8a88a'; g.fillRect(E.W * 0.58, E.H * 0.38, 600, 420); poly(g, [[E.W * 0.56, E.H * 0.4], [E.W * 0.58 + 300, E.H * 0.18], [E.W * 0.6 + 620, E.H * 0.4]], '#8a4a3a'); SH.win(g, E.W * 0.62, E.H * 0.5, 160, 140, ['#bfe6ff', '#8fc0e8'], {}); rr(g, E.W * 0.82, E.H * 0.52, 120, 230, 6); g.fillStyle = '#5a3a2e'; g.fill(); });
  layer(g, cam, 1, (g) => {
    g.fillStyle = '#5a8a4a'; g.fillRect(-E.W, E.H * 0.8, E.W * 3, E.H);
    const mx = E.W * 0.36, my = E.H * 0.8; seg(g, [[mx, my], [mx, my - 220]], 14, '#4a3a2e'); rr(g, mx - 110, my - 330, 220, 120, 40); g.fillStyle = '#3f8ff0'; g.fill(); seg(g, [[mx + 100, my - 320], [mx + 100, my - 380]], 6, PINK); poly(g, [[mx + 100, my - 380], [mx + 150, my - 365], [mx + 100, my - 350]], PINK);
    const pile = ease.out(prog(t, 0.2, 3.2)), r = rng(7); for (let i = 0; i < Math.floor(90 * pile); i++) SH.envelope(g, mx + (r() - 0.5) * 520 * pile, my - r() * 220 * pile, 0.7, (r() - 0.5) * 1.4, r() > 0.8 ? '#ffe7b0' : '#f4efe6');
    SH.letterRain(g, t, { count: 50, seed: 3, speed: 520, area: [mx - 500, -200, 1000, E.H * 0.6] });
  });
  const n = Math.round(10000 * ease.inOut(prog(t, 0.3, 2.6)));
  lbl(g, n.toLocaleString('en-US').replace(',', ' '), E.W * 0.06, E.H * 0.2, ease.out(prog(t, 0.2, 0.5)), 130, GOLD); for (let k = 0; k < 4; k++) SH.envelope(g, E.W * 0.08 + k * 60, E.H * 0.3, 0.6, 0.1 * k);
} });

// k04 — rows of PhDs in mortarboards scribble furious letters; ≈1 000
registerShot('k04', { draw(g, t) {
  const cam = { z: 1.08 - 0.03 * t, x: 0, y: 0 };
  layer(g, cam, 0.3, (g) => { SH.room(g, '#3a2a46', '#5a3e58', E.H * 0.78, '#2a1e2e'); for (let i = 0; i < 5; i++) { rr(g, 120 + i * 360, E.H * 0.12, 220, 300, 6); g.fillStyle = '#4a3450'; g.fill(); for (let j = 0; j < 7; j++) { rr(g, 132 + i * 360 + j * 30, E.H * 0.16, 24, 240, 3); g.fillStyle = DOORC[(i + j) % 3]; g.globalAlpha = 0.5; g.fill(); g.globalAlpha = 1; } } });
  const rows = [[E.H * 0.7, 0.95, 5], [E.H * 0.96, 1.35, 4]];
  rows.forEach(([y, s, n], ri) => layer(g, cam, 0.8 + ri * 0.2, (g) => { for (let i = 0; i < n; i++) { const x = E.W * (0.1 + i / n * 0.86) + ri * 60, ph = t * 14 + i * 2;
    const h = hero(g, { x, y, s, facing: 1, t: t + i, outfit: PROF, pose: P('think', { hF: [44 + 10 * Math.sin(ph), -112 + 4 * Math.cos(ph)], eF: [30, -132] }), expr: i % 2 ? 'angry' : 'determined', look: [0.6, 0.6] });
    SH.cap(g, h, s); SH.desk(g, x + 70 * s, y + 4, 200 * s, '#6a4a3a'); rr(g, x + 30 * s, y - 112 * s, 80 * s, 10 * s, 2); g.fillStyle = '#f4efe6'; g.fill();
    if (ri === 1 && i === 2 && t > 1.8) { const k = prog(t, 1.8, 2.3); seg(g, [[h.hand[0], h.hand[1]], [h.hand[0] + 30 * k, h.hand[1] - 50 * k]], 6, '#2a3a6a'); FX.sparkle(g, h.hand[0] + 10, h.hand[1] - 20, 30 * (1 - k), '#ffffff', 0.8); } } }));
  const a = ease.out(prog(t, 0.4, 0.8)); g.save(); g.globalAlpha = a; rr(g, E.W * 0.36, E.H * 0.04, 560, 150, 30); g.fillStyle = alpha('#0c1430', 0.6); g.fill(); g.restore();
  lbl(g, `≈ ${Math.round(1000 * ease.inOut(prog(t, 0.4, 1.8)))}`, E.W * 0.4, E.H * 0.14, a, 110, GOLD);
  const hc = { head: [E.W * 0.6, E.H * 0.13, 34] }; if (a > 0) SH.cap(g, hc, 1.4, '#ffffff');
} });

// k05 — a great mathematician (generic figure with glasses) crosses his arms: no
registerShot('k05', { draw(g, t) {
  const cam = { z: 1.15 + 0.05 * t, x: 0, y: -20 };
  layer(g, cam, 0.3, (g) => { SH.room(g, '#1e2a3a', '#2e3e52', E.H * 0.82, '#1a2230'); SH.chalkboard(g, E.W * 0.08, E.H * 0.14, 900, 440, (g) => { for (let i = 0; i < 6; i++) seg(g, [[E.W * 0.1, E.H * 0.2 + i * 60], [E.W * 0.1 + 300 + 400 * ((i * 37) % 7) / 7, E.H * 0.2 + i * 60]], 5, alpha('#f4efe6', 0.5)); text(g, '∑ ∫ π', E.W * 0.33, E.H * 0.52, { size: 90, font: 'Nunito', weight: 900, align: 'center', color: alpha('#f4efe6', 0.7) }); }); });
  layer(g, cam, 1, (g) => {
    const shake = t > 1.0 ? Math.sin(t * 16) * 8 * (1 - prog(t, 1.0, 2.2)) : 0;
    const h = hero(g, { x: E.W * 0.62, y: E.H * 0.86, s: 2.3, facing: -1, t, outfit: PROF, pose: posesAt(t, [[0, POSES.relaxed], [0.6, POSES.crossArms]]), expr: t > 0.6 ? 'angry' : 'neutral', look: [-1 + shake * 0.05, 0] });
    SH.glasses(g, h, -1);
    SH.cross(g, E.W * 0.82, E.H * 0.3, 1.6, prog(t, 1.2, 1.8));
  });
} });

// k06 — the PhDs freeze and turn grey; the woman smiles; a green check
registerShot('k06', { draw(g, t) {
  const cam = { z: 1.0 + 0.03 * t, x: 0, y: 0 };
  layer(g, cam, 0.3, (g) => { SH.room(g, '#2a1e3a', '#4a2e48', E.H * 0.82, '#2a1a24'); FX.stars(g, t, { count: 40 }); });
  const gk = ease.inOut(prog(t, 0.2, 0.9));
  layer(g, cam, 0.8, (g) => { for (let i = 0; i < 6; i++) { const x = E.W * (0.06 + i * 0.12) + (i > 2 ? E.W * 0.28 : 0), s = 1.1; const h = hero(g, { x, y: E.H * 0.82, s, facing: i > 2 ? -1 : 1, t: t * (1 - gk), outfit: PROF, pose: POSES.point, expr: 'angry', look: [i > 2 ? -1 : 1, 0], alpha: 1 - 0.55 * gk }); SH.cap(g, h, s, mix('#1a1424', '#8a8a9a', gk)); } });
  veil(g, '#5a5a6a', 0.25 * gk, 'saturation');
  layer(g, cam, 1, (g) => {
    glow(g, E.W * 0.5, E.H * 0.55, 420, '#fff3c4', 0.35 * gk);
    hero(g, { x: E.W * 0.5, y: E.H * 0.88, s: 2.0, facing: 1, t, outfit: WOMAN, pose: posesAt(t, [[0, POSES.relaxed], [0.9, POSES.crossArms]]), expr: t > 0.9 ? 'smirk' : 'neutral', look: [0.3, -0.1], rim: { color: '#fff3c4', dir: [0, -1], w: 5 } });
    SH.check(g, E.W * 0.62, E.H * 0.24, 2, prog(t, 1.3, 1.9));
  });
} });

// k07 — three closed doors and a "?"; the hero peeks in and shrugs ("probably")
registerShot('k07', { draw(g, t) {
  const cam = { z: 1.06 - 0.04 * t, x: 0, y: 0 };
  SH.studio(g, t, cam, { audience: false });
  layer(g, cam, 1, (g) => {
    [0.3, 0.5, 0.7].forEach((fx, i) => SH.door(g, E.W * fx, SH.SGY() - 40, 230, 380, { n: i + 1, t }));
    const q = ease.outBack(prog(t, 0.3, 0.8)); if (q > 0) qmark(g, E.W * 0.5, E.H * 0.2, 220 * q, 1, GOLD);
    const k = ease.out(prog(t, 0.6, 1.3));
    hero(g, { x: E.W * (1.05 - 0.17 * k), y: SH.SGY(), s: 1.9, facing: -1, t, pose: posesAt(t, [[0, POSES.relaxed], [1.9, POSES.shrug]]), expr: t > 1.9 ? 'smirk' : 'surprised', look: [-1, -0.3], rim: { color: '#ffd7f0', dir: [0.7, -0.6], w: 4 } });
  });
} });
