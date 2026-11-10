// shots/02_game.js — lines 4-11: the game, the host opens a goat door, pause and decide, everyone says 50/50, and it's wrong.
import { E, V, registerShot, layer, veil, ease, prog, clamp, lerp, rng, seg, circle, ring, rr, poly, glow, alpha, mix, linGrad, text } from '/engine/core.js';
import { POSES, posesAt, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { hero, P } from '../hero.js';
import { HERO } from '../cast.js';
import { lbl } from '../kit.js';
import { qmark } from '../props.js';
import * as SH from '../sets/show.js';
const { GOLD, PINK, CYAN, DOORC } = SH;
const DW = 230, DH = 380, DX = [E.W * 0.36, E.W * 0.53, E.W * 0.7];
const inside = (n, t, o = {}) => (g, cx, cy) => (n === 2 ? SH.car(g, cx + 40, cy - 6, 0.62, { t, shine: o.shine ?? 1 }) : SH.goat(g, cx - 10, cy, 1.05, { t: t + n, f: -1, bleat: o.bleat || 0 }));
const heroAtPodium = (g, t, pose, expr, look = [1, -0.2]) => { const h = hero(g, { x: E.W * 0.14, y: SH.SGY(), s: 1.9, facing: 1, t, pose, expr, look, rim: { color: '#c8e6ff', dir: [-0.7, -0.6], w: 4 } }); SH.podium(g, E.W * 0.155, SH.SGY() + 6, 1.0); return h; };

// o01 — the TV studio: lights sweep, the audience cheers, the hero steps up to the podium
registerShot('o01', { draw(g, t) {
  const cam = { z: 1.25 - 0.18 * ease.inOut(prog(t, 0, 2.5)), x: 0, y: 0 };
  SH.studio(g, t, cam, { cheer: t < 2 });
  layer(g, cam, 1, (g) => { DX.forEach((x, i) => SH.door(g, x, SH.SGY() - 40, DW, DH, { n: i + 1, t })); heroAtPodium(g, t, posesAt(t, [[0, POSES.wave], [1.6, POSES.relaxed]]), 'happy'); });
  for (let i = 0; i < 30; i++) { const r = rng(i + 3), x = r() * E.W, y = ((r() * E.H + t * 260) % (E.H + 60)) - 30; g.save(); g.translate(x, y); g.rotate(t * 3 + i); rr(g, -8, -4, 16, 8, 2); g.fillStyle = [GOLD, PINK, CYAN][i % 3]; g.globalAlpha = 0.8 * (1 - prog(t, 1.5, 2.5)); g.fill(); g.restore(); }
} });

// o02 — x-ray: the doors turn see-through, a car glows behind 2, goat horns behind 1 and 3
registerShot('o02', { draw(g, t) {
  const cam = { z: 1.18, x: 0, y: -30 };
  SH.studio(g, t, cam, { audience: false });
  const k = ease.inOut(prog(t, 0.3, 1.0));
  layer(g, cam, 1, (g) => DX.forEach((x, i) => {
    SH.door(g, x, SH.SGY() - 40, DW, DH, { n: i + 1, t, open: 1, label: false, glowC: i === 1 ? '#fff3c4' : null, inside: inside(i + 1, t, { bleat: i !== 1 && t > 1.6 ? Math.abs(Math.sin(t * 7 + i)) : 0 }) });
    g.save(); g.globalAlpha = 1 - 0.7 * k; SH.door(g, x, SH.SGY() - 40, DW, DH, { n: i + 1, t }); g.restore();
    if (k > 0.5) { for (let s = 0; s < 3; s++) seg(g, [[x - DW / 2, SH.SGY() - 40 - DH * (0.2 + 0.3 * s) - ((t * 120) % 60)], [x + DW / 2, SH.SGY() - 40 - DH * (0.2 + 0.3 * s) - ((t * 120) % 60)]], 2, alpha(CYAN, 0.25)); }
  }));
  FX.sparkle(g, DX[1] + 60, E.H * 0.42, 34 * k, '#ffffff', 0.9);
} });

// o03 — the hero points at door 1; a spotlight snaps onto it
registerShot('o03', { draw(g, t) {
  const cam = { z: 1.1 + 0.03 * t, x: 0, y: 0 };
  SH.studio(g, t, cam, { audience: true });
  const sp = ease.out(prog(t, 0.5, 0.8));
  layer(g, cam, 1, (g) => {
    if (sp > 0) FX.lightCone(g, DX[0], -60, { angle: Math.PI / 2, spread: 0.12, len: 1100, color: '#fff3c4', a: 0.35 * sp });
    DX.forEach((x, i) => SH.door(g, x, SH.SGY() - 40, DW, DH, { n: i + 1, t, glowC: '#fff3c4' }));
    if (sp > 0) { FX.pool(g, DX[0], SH.SGY() - 30, 220, 34, '#fff3c4', 0.4 * sp); ring(g, DX[0], SH.SGY() - 40 - DH - 70, 50, 6, alpha(GOLD, sp)); lbl(g, '1', DX[0], SH.SGY() - 40 - DH - 46, sp, 70, GOLD, 'center'); }
    heroAtPodium(g, t, posesAt(t, [[0, POSES.think], [0.35, POSES.point]]), 'determined', [1, 0]);
  });
} });

// o04 — the host checks his card, then opens door 3: a goat. It burps.
registerShot('o04', { draw(g, t) {
  const cam = { z: 1.12 + 0.04 * t, x: 40, y: 0 };
  SH.studio(g, t, cam, { audience: true });
  const op = ease.inOut(prog(t, 1.4, 2.2));
  layer(g, cam, 1, (g) => {
    DX.forEach((x, i) => SH.door(g, x, SH.SGY() - 40, DW, DH, { n: i + 1, t, open: i === 2 ? op : 0, glowC: '#fff3c4', inside: inside(3, t, { bleat: t > 2.6 ? Math.abs(Math.sin(t * 5)) * 0.6 : 0 }) }));
    SH.burp(g, DX[2] + 60, SH.SGY() - 220, prog(t, 2.8, 3.8));
    const h = SH.host(g, { x: E.W * 0.88, y: SH.SGY(), s: 1.9, facing: -1, t, pose: posesAt(t, [[0, POSES.holdFront], [1.2, POSES.point]]), expr: t < 1.2 ? 'thinking' : 'smirk', look: t < 1.2 ? [-0.4, 0.8] : [-1, 0], rim: { color: '#ffd7f0', dir: [0.7, -0.6], w: 4 } });
    if (t < 1.3) SH.card(g, h.hand[0] - 10, h.hand[1] - 20, 1.1, -0.1, 1);
    heroAtPodium(g, t, POSES.relaxed, t > 2.8 ? 'surprised' : 'neutral');
  });
} });

// o05 — the host holds out the microphone: switch to door 2?
registerShot('o05', { draw(g, t) {
  const cam = { z: 1.1 + 0.04 * t, x: 0, y: 0 };
  SH.studio(g, t, cam, { audience: false });
  layer(g, cam, 1, (g) => {
    DX.forEach((x, i) => SH.door(g, x, SH.SGY() - 40, DW, DH, { n: i + 1, t, open: i === 2 ? 1 : 0, glowC: i === 1 ? GOLD : '#fff3c4', inside: inside(3, t) }));
    glow(g, DX[1], SH.SGY() - 240, 260, GOLD, 0.25 + 0.15 * Math.sin(t * 5));
    const k = ease.out(prog(t, 0.2, 0.8));
    const h = SH.host(g, { x: E.W * (0.7 - 0.085 * k), y: SH.SGY(), s: 1.75, facing: -1, t, pose: P('reach', {}), expr: 'smirk', look: [-1, 0] });
    SH.mic(g, h.hand[0] - 10, h.hand[1] - 10, 1.2, -1.2);
    heroAtPodium(g, t, POSES.think, 'thinking', [1, -0.3]);
    const q = ease.outBack(prog(t, 1.0, 1.4)); if (q > 0) { seg(g, [[DX[0], SH.SGY() - 40 - DH - 60], [DX[1] - 30, SH.SGY() - 40 - DH - 60]], 8, alpha(GOLD, q)); poly(g, [[DX[1], SH.SGY() - 40 - DH - 60], [DX[1] - 40, SH.SGY() - 40 - DH - 82], [DX[1] - 40, SH.SGY() - 40 - DH - 38]], alpha(GOLD, q)); qmark(g, DX[1] + 70, SH.SGY() - 40 - DH - 30, 120 * q, 1, GOLD); }
  });
} });

// o06 — freeze: everything stops, a huge pause sign, then the hero's big thinking face between 1 and 2
registerShot('o06', { draw(g, t) {
  const swap = t > 1.4;
  if (!swap) {
    const cam = { z: 1.2, x: 0, y: 0 }; SH.studio(g, 1.0, cam, { audience: true });
    layer(g, cam, 1, (g) => { DX.forEach((x, i) => SH.door(g, x, SH.SGY() - 40, DW, DH, { n: i + 1, t: 1, open: i === 2 ? 1 : 0, inside: inside(3, 1) })); heroAtPodium(g, 1, POSES.think, 'thinking'); });
    veil(g, '#1a1424', 0.45 * ease.out(prog(t, 0, 0.3))); veil(g, '#808080', 0.6, 'saturation');
    SH.pauseIcon(g, E.W / 2, E.H / 2, 1.6 * ease.outBack(prog(t, 0.1, 0.5)), 1);
    return;
  }
  const u = t - 1.4; g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#1a0c2e', '#3a1650']); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
  const r = V(300, 320) * (1 + 0.03 * u), look = Math.sin(u * 2.4);
  bigFace(g, E.W / 2, E.H * 0.62, r, { outfit: HERO, expr: 'thinking', look: [look, -0.2], rimColor: '#ffd7f0', rimSide: 1 });
  for (const [x, n, c] of [[E.W * 0.16, 1, DOORC[0]], [E.W * 0.84, 2, DOORC[1]]]) { const on = (n === 1 ? -look : look) > 0.2; rr(g, x - 90, E.H * 0.3, 180, 300, 10); g.fillStyle = on ? c : alpha(c, 0.4); g.fill(); text(g, String(n), x, E.H * 0.42, { size: 110, font: 'Nunito', weight: 900, align: 'center', color: '#ffffff' }); if (on) glow(g, x, E.H * 0.45, 200, c, 0.3); }
} });

// o07 — the audience waves 50/50 signs; the hero nods along
registerShot('o07', { draw(g, t) {
  const cam = { z: 1.05, x: 0, y: -40 + 30 * t };
  SH.studio(g, t, cam, { cheer: false });
  layer(g, cam, 1.4, (g) => { const r = rng(5); for (let i = 0; i < 9; i++) { if (i === 1) continue; const x = 60 + i * 230, y = E.H * 1.06 + Math.abs(Math.sin(t * 4 + i)) * -16; rr(g, x - 90, y - 330, 180, 110, 8); g.fillStyle = '#f4efe6'; g.fill(); seg(g, [[x, y - 220], [x, y]], 10, '#5a3a2a'); text(g, '50/50', x, y - 260, { size: 54, font: 'Nunito', weight: 900, align: 'center', color: '#2a1e3a' }); } });
  layer(g, cam, 1, (g) => { DX.forEach((x, i) => SH.door(g, x, SH.SGY() - 40, DW, DH, { n: i + 1, t, open: i === 2 ? 1 : 0, inside: inside(3, t) })); heroAtPodium(g, t, P('relaxed', { head: [8, -202 + 6 * Math.sin(t * 6)] }), 'smile'); });
} });

// o08 — the signs flip; a huge red cross stamps over 50/50
registerShot('o08', { draw(g, t) {
  const cam = { z: 1.1 + 0.05 * t, x: 0, y: 0 };
  SH.studio(g, t, cam, { audience: false });
  layer(g, cam, 1, (g) => { DX.forEach((x, i) => SH.door(g, x, SH.SGY() - 40, DW, DH, { n: i + 1, t, open: i === 2 ? 1 : 0, inside: inside(3, t) })); heroAtPodium(g, t, POSES.relaxed, t > 1.2 ? 'shocked' : 'smile'); });
  layer(g, cam, 1.4, (g) => { for (let i = 0; i < 9; i++) { const x = 60 + i * 230, y = E.H * 1.06, fl = Math.cos(Math.PI * ease.inOut(prog(t, 0.3 + i * 0.05, 0.8 + i * 0.05)));
    g.save(); g.translate(x, y - 275); g.scale(Math.abs(fl) || 0.02, 1); rr(g, -90, -55, 180, 110, 8); g.fillStyle = fl > 0 ? '#f4efe6' : PINK; g.fill(); text(g, fl > 0 ? '50/50' : '✗', 0, 18, { size: 54, font: 'Nunito', weight: 900, align: 'center', color: fl > 0 ? '#2a1e3a' : '#ffffff' }); g.restore(); seg(g, [[x, y - 220], [x, y]], 10, '#5a3a2a'); } });
  const k = prog(t, 1.1, 1.6); if (k > 0) { lbl(g, '50/50', E.W / 2, E.H * 0.42, 1, 200, '#ffffff', 'center'); SH.cross(g, E.W / 2, E.H * 0.35, 3, k); }
} });
