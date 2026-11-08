// shots/07_end.js — ice is strong (pipes, rocks, roads), the hero's fix, and the end card.
import { E, V, registerShot, layer, blurLayer, veil, backdrop, ease, prog, key, clamp, lerp, shake, rng, noise, seg, circle, ring, rr, poly, glow, alpha, shade, mix, linGrad, radGrad, text } from '/engine/core.js';
import { POSES, posesAt, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { kitchen, KGY, FRIDGE, SINK_X, COUNTER_TOP, freezerInside } from '../sets/kitchen.js';
import { bottle, snowflake, drop, logo, qmark, ICE } from '../props.js';
import { hero, P, rightX } from '../hero.js';
import { HERO } from '../cast.js';
import { lbl } from './02_night.js';

const HS = 2.3;

// p01 — winter night street: a water pipe bursts, the spray freezes into icicles
registerShot('p01', { draw(g, t) {
  const burst = 1.2, [sx, sy] = t > burst ? shake(t, 12 * (1 - prog(t, burst, burst + 0.6)), 30) : [0, 0];
  const cam = { z: 1.05 + 0.04 * t, x: sx, y: sy };
  layer(g, cam, 0.2, (g) => { backdrop(g, ['#060a1e', '#141c40', '#26305e']); FX.stars(g, t, { count: 80 }); FX.moon(g, E.W * 0.62, 170, 36); });
  layer(g, cam, 1, (g) => {
    // brick wall
    g.fillStyle = '#3a2a3e'; g.fillRect(-200, 200, E.W + 400, E.H);
    g.strokeStyle = 'rgba(0,0,0,.25)'; g.lineWidth = 3; for (let y = 220; y < E.H; y += 50) { g.beginPath(); g.moveTo(-200, y); g.lineTo(E.W + 200, y); g.stroke(); for (let x = -200 + ((y / 50) % 2) * 60; x < E.W + 200; x += 120) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 50); g.stroke(); } }
    FX.lampPost(g, 260, E.H - 60, 560, { light: '#ffd59a', a: 0.25 });
    // pipe
    const py = 560, bx = E.W * 0.55, open = ease.out(prog(t, burst, burst + 0.2)) * 24;
    seg(g, [[-200, py], [bx - open, py]], 46, '#b8743a'); seg(g, [[bx + open, py], [E.W + 200, py]], 46, '#b8743a');
    seg(g, [[-200, py - 12], [bx - open, py - 12]], 6, '#e8a060'); seg(g, [[bx + open, py - 12], [E.W + 200, py - 12]], 6, '#e8a060');
    for (const x of [300, 900, 1500]) { rr(g, x - 16, py - 30, 32, 60, 6); g.fillStyle = '#8a5a3a'; g.fill(); }
    const r = rng(2); for (let i = 0; i < 30; i++) circle(g, r() * E.W, py - 20 + r() * 10, 3 + r() * 5, 'rgba(230,248,255,.85)');
    if (t > burst) {
      const tt = t - burst, frz = prog(tt, 0.8, 2.4);
      // spray arcs: water while fresh, white ice as it freezes
      for (let i = 0; i < 40; i++) { const a = -Math.PI / 2 + (r() - 0.5) * 2.4, sp = 300 + r() * 400, life = Math.min(tt, 0.9 + r() * 0.6); const x = bx + Math.cos(a) * sp * life, y = py + Math.sin(a) * sp * life + 500 * life * life;
        circle(g, x, y, 4 + r() * 6, mix('#7fc8ff', '#f4fdff', frz)); }
      for (let i = 0; i < 9; i++) { const x = bx - 200 + i * 50, L = (40 + (i * 37) % 110) * ease.out(frz); poly(g, [[x - 12, py + 22], [x + 12, py + 22], [x, py + 22 + L]], alpha('#eafaff', 0.95)); }
      if (tt < 0.15) { g.fillStyle = `rgba(255,255,255,${0.7 * (1 - tt / 0.15)})`; g.fillRect(-200, -200, E.W + 400, E.H + 400); }
    }
  });
  FX.snow(g, t, { count: 120, speed: 50 });
  lbl(g, '−10 °C', E.W - V(110, 80), V(160, 230), 1, V(64, 70), '#dff8ff', 'right');
} });

// p02 — mountain: water seeps into a crack, freezes, the rock splits
registerShot('p02', { draw(g, t) {
  const split = 3.0, sp = ease.out(prog(t, split, split + 0.8)) * 120, [sx, sy] = t > split ? shake(t, 14 * (1 - prog(t, split, split + 0.8)), 30) : [0, 0];
  const cam = { z: 1.0 + 0.05 * t, x: sx, y: sy };
  layer(g, cam, 0.2, (g) => { backdrop(g, ['#3a4a86', '#8a7ab0', '#f0b8a0']); FX.sun(g, E.W * 0.2, 300, 40, '#fff0d8', '#ffc0a0', 4); });
  layer(g, cam, 0.5, (g) => { FX.hills(g, { y: E.H * 0.7, amp: 260, color: '#5a5084', seed: 3, freq: 0.003 }); });
  layer(g, cam, 1, (g) => {
    g.fillStyle = '#eef0fa'; g.fillRect(-200, E.H * 0.82, E.W + 400, 400);
    const cx = E.W / 2, by = E.H * 0.84, cw = 30 + 30 * ease.out(prog(t, 1.4, 2.8)) + sp * 0.2;
    for (const s of [-1, 1]) { g.save(); g.translate(s * (cw / 2 + sp), s < 0 ? 0 : 0); if (t > split) { g.translate(cx, by); g.rotate(s * 0.1 * ease.out(prog(t, split, split + 0.8))); g.translate(-cx, -by); }
      const pts = s < 0 ? [[cx, by], [cx - 520, by], [cx - 470, by - 300], [cx - 280, by - 470], [cx, by - 520]] : [[cx, by], [cx + 500, by], [cx + 450, by - 280], [cx + 260, by - 480], [cx, by - 520]];
      poly(g, pts, s < 0 ? '#6a6488' : '#5a5478'); poly(g, [[cx + s * 0, by - 520], [cx + s * 280, by - 470 + (s > 0 ? -10 : 0)], [cx + s * 200, by - 420], [cx, by - 440]], '#eef0fa'); g.restore(); }
    // the crack (filled with water, then ice)
    const frz = prog(t, 1.2, 2.2), wedge = cw;
    poly(g, [[cx - wedge / 2, by - 520], [cx + wedge / 2, by - 520], [cx, by - 120]], mix('#3f9ad6', '#eafaff', frz));
    if (t < 1.2) { const ph = (t * 1.5) % 1; drop(g, cx, by - 640 + ph * 120, 14, '#5fc0ff'); }
    if (frz > 0.5 && t < split) for (let i = 0; i < 3; i++) FX.sparkle(g, cx + (i - 1) * 30, by - 500 + i * 90, 16, '#ffffff', 0.7);
    if (t > split) { const r = rng(5); for (let i = 0; i < 16; i++) { const a = -Math.PI / 2 + (r() - 0.5) * 2, d = (t - split) * (200 + r() * 300); circle(g, cx + Math.cos(a) * d, by - 300 + Math.sin(a) * d + 300 * (t - split) ** 2, 6 + r() * 10, '#8a84a8'); } }
  });
  snowflake(g, V(130, 90), V(165, 230), 34, '#dff8ff', 6, t);
  lbl(g, '−5 °C', V(190, 150), V(165, 230), ease.out(prog(t, 1.2, 1.6)), V(64, 70), '#dff8ff', 'left');
} });

// p03 — winter road (cut-away): ice lens under the asphalt lifts it, a car breaks it → pothole
registerShot('p03', { draw(g, t) {
  const cam = { z: 1.0 + 0.03 * t };
  layer(g, cam, 1, (g) => {
    backdrop(g, ['#141a3a', '#2a3460']);
    const ry = 560, rh = 70, cx = E.W / 2, lens = ease.out(prog(t, 0.3, 1.8)), broken = t > 2.2;
    g.fillStyle = '#4a3a34'; g.fillRect(-200, ry + rh, E.W + 400, 600);                // soil
    const r = rng(6); for (let i = 0; i < 60; i++) circle(g, r() * E.W, ry + rh + 20 + r() * 400, 4 + r() * 8, '#5a4a40');
    g.fillStyle = '#eafaff'; g.beginPath(); g.ellipse(cx, ry + rh + 30, 180 * lens, 60 * lens, 0, 0, Math.PI * 2); g.fill();      // ice lens
    // asphalt with a bump
    const bump = broken ? 0 : 50 * lens;
    g.fillStyle = '#2a2a34'; g.beginPath(); g.moveTo(-200, ry); for (let x = -200; x <= E.W + 200; x += 20) { const d = (x - cx) / 220; g.lineTo(x, ry - (Math.abs(d) < 1 ? bump * (1 - d * d) : 0)); } g.lineTo(E.W + 200, ry + rh); g.lineTo(-200, ry + rh); g.closePath(); g.fill();
    for (let x = -200; x < E.W + 200; x += 160) seg(g, [[x, ry + 10], [x + 80, ry + 10]], 6, broken && Math.abs(x + 40 - cx) < 160 ? 'rgba(0,0,0,0)' : '#e8d070');
    if (broken) { g.fillStyle = '#141420'; g.beginPath(); g.ellipse(cx, ry + 6, 150, 34, 0, 0, Math.PI); g.fill(); const rr2 = rng(3); for (let i = 0; i < 10; i++) poly(g, [[cx - 140 + rr2() * 280, ry - 6], [cx - 130 + rr2() * 280, ry - 18], [cx - 120 + rr2() * 280, ry - 4]], '#3a3a44'); }
    // car
    const carX = lerp(-300, E.W + 300, prog(t, 0.6, 3.6)), over = Math.abs(carX - cx) < 160, cyy = ry - 10 - (over && !broken ? 20 : 0) + (over && broken ? 14 : 0);
    rr(g, carX - 150, cyy - 70, 300, 60, 18); g.fillStyle = '#c84a3a'; g.fill(); rr(g, carX - 80, cyy - 120, 170, 60, 22); g.fill(); g.fillStyle = '#9fd0ff'; g.fillRect(carX - 60, cyy - 108, 60, 36); g.fillRect(carX + 10, cyy - 108, 60, 36);
    for (const dx of [-90, 90]) { circle(g, carX + dx, cyy - 8, 34, '#111'); circle(g, carX + dx, cyy - 8, 14, '#888'); }
    glow(g, carX + 150, cyy - 50, 160, '#fff0c0', 0.5);
  });
  snowflake(g, V(130, 90), V(165, 230), 34, '#dff8ff', 6, t);
  FX.snow(g, t, { count: 100, speed: 40 });
} });

// e01 — the fix: pour a little out, leave room for the +9 %
registerShot('e01', { draw(g, t) {
  const ct = COUNTER_TOP(), cam = { z: 2.1, x: SINK_X + 140 - 960, y: -40 };
  const { M } = kitchen(g, t, cam, { mood: 'night', lamp: 1 });
  layer(g, cam, 1, (g) => {
    const pour = t > 0.4 && t < 1.7, tilt = pour ? lerp(0, -2.0, ease.inOut(prog(t, 0.4, 0.8))) * (1 - ease.inOut(prog(t, 1.4, 1.7))) : 0;
    const pose = P('holdFront', { hF: [64, -170], eF: [36, -150] });
    const h = hero(g, { x: SINK_X + 330, y: KGY(), s: HS, facing: -1, t, pose, expr: t > 2.2 ? 'smirk' : 'thinking', look: [0.6, 0.4], rim: { color: M.practical, dir: [-0.6, -0.8], w: 4 } });
    const fill = lerp(1, 0.86, ease.inOut(prog(t, 0.6, 1.5)));
    bottle(g, h.hand[0], h.hand[1] + 60, { s: 0.42, fill, capOff: true, tilt });
    if (pour && tilt < -1.2) seg(g, [[h.hand[0] - 60, h.hand[1] + 40], [h.hand[0] - 70, ct - 20]], 6, alpha('#8fd0ff', 0.75));
    const a = ease.out(prog(t, 1.8, 2.2)); if (a > 0) { const top = h.hand[1] + 60 - 260 * 0.42; g.fillStyle = alpha('#ffd95a', 0.5 * a); g.fillRect(h.hand[0] - 20, top + 6, 40, 16); }
  });
  const a = ease.out(prog(t, 2.0, 2.4)); if (a > 0) lbl(g, '+9%', E.W * 0.36, E.H * 0.36, a, V(84, 88), '#ffd95a', 'center');
} });

// e02 — next morning: bottle in one piece, ice domed, hero cheers
registerShot('e02', { draw(g, t) {
  const fz = ease.out(prog(t, 0.0, 0.5)), cam = { z: 1.45, x: 330, y: -130 };
  const { M } = kitchen(g, t, cam, { mood: 'golden', lamp: 0, freezer: fz, inside: freezerInside({ fill: 0.86, ice: 1, frost: 1, capOff: true, bulge: 0.15 }) });
  layer(g, cam, 1, (g) => {
    const pose = posesAt(t, [[0, P('reach', { hF: [70, -250], eF: [40, -205] })], [0.7, POSES.cheer]]);
    hero(g, { x: FRIDGE.x - 150, y: KGY(), s: HS, facing: 1, t, pose, expr: t > 0.7 ? 'joy' : 'happy', rim: { color: '#bff4ff', dir: [1, -0.3], w: 5 } });
  });
  const ck = ease.outBack(prog(t, 0.9, 1.3)); if (ck > 0) { g.save(); g.translate(rightX(V(200, 150)), V(190, 260)); g.scale(ck, ck); circle(g, 0, 0, 70, '#5fe0a8'); seg(g, [[-32, 2], [-8, 26], [36, -24]], 16, '#ffffff'); g.restore(); }
  FX.dust(g, t, { count: 50, color: '#eafaff', a: 0.4 });
} });

// e03 — giant face: smirk + wink to camera
registerShot('e03', { draw(g, t) {
  blurLayer(g, 14, (g) => kitchen(g, t, { z: 1.9, x: 300, y: -220 }, { mood: 'golden', lamp: 0 })); veil(g, '#1a0e14', 0.25);
  const r = V(300, 330) * (1 + 0.03 * t), cx = E.W / 2, cy = E.H * 0.6, wink = t > 0.9 && t < 1.8;
  bigFace(g, cx, cy, r, { outfit: HERO, expr: 'smirk', rimColor: '#ffc68a', rimSide: -1 });
  if (wink) { circle(g, cx + r * 0.34, cy - r * 0.16, r * 0.17, '#0c0b18'); seg(g, [[cx + r * 0.2, cy - r * 0.14], [cx + r * 0.48, cy - r * 0.14]], r * 0.08, '#fff7ea'); FX.sparkle(g, cx + r * 0.7, cy - r * 0.5, 40, '#ffffff', 0.9); }
} });

// e04 — end card: logo, hero waving, space for the end-screen videos
registerShot('e04', { draw(g, t) {
  g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#0c1230', '#1c1a44', '#2a1e48']); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
  glow(g, E.W * 0.22, E.H * 0.9, 600, '#ffb070', 0.18); glow(g, E.W * 0.7, E.H * 0.2, 700, '#5fc0ff', 0.12);
  const r = rng(4); for (let i = 0; i < 26; i++) snowflake(g, r() * E.W, ((r() * E.H + t * 30 * (0.5 + r())) % (E.H + 60)) - 30, 8 + r() * 14, alpha('#dff8ff', 0.25 + r() * 0.3), 2, t * (r() - 0.5));
  const a = ease.out(prog(t, 0.2, 0.9));
  logo(g, E.W / 2, V(170, 260), V(110, 120), a);
  // hero waving
  const pose = posesAt(t, [[0, POSES.relaxed], [0.6, POSES.wave]]); if (t > 0.6) pose.hF = [pose.hF[0] + Math.sin(t * 9) * 10, pose.hF[1]];
  const k = ease.out(prog(t, 0.3, 1.0));
  hero(g, { x: V(380, 540), y: E.H - V(130, 300) + (1 - k) * 60, s: 1.9, facing: 1, t, pose, expr: 'happy', alpha: k, rim: { color: '#ffc68a', dir: [-0.6, -0.8], w: 5 } });
  // end-screen slots (YouTube elements sit on top of these)
  for (const [x, y] of [[V(760, 140), 400], [V(1290, 140), 400]]) { const kk = ease.out(prog(t, 0.6, 1.2)); rr(g, x, y, 480, 270, 18); g.strokeStyle = alpha('#cfe0ff', 0.35 * kk); g.lineWidth = 4; g.stroke(); g.fillStyle = alpha('#ffffff', 0.04 * kk); g.fill(); }
  const q = ease.outBack(prog(t, 1.2, 1.6)); if (q > 0) { g.save(); g.translate(V(1530, 540), V(830, 1500)); g.scale(q, q); qmark(g, 0, 0, 120); g.restore(); }
} });
