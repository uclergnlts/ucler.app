// shots/03_twin.js — the twin flies at 0.9 c; 20 years on Earth, less than 9 on the rocket.
import { E, V, registerShot, layer, blurLayer, veil, backdrop, ease, prog, clamp, lerp, shake, rng, seg, circle, ring, rr, poly, glow, alpha, mix, linGrad, radGrad, text } from '/engine/core.js';
import { POSES, posesAt, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { hero, P } from '../hero.js';
import { HERO } from '../cast.js';
import { lbl, rocket, twin, helmet, beard, cane, GOLD, PINK, CYAN } from '../kit.js';

const GY = () => E.H * 0.86, HS = 1.9;
// launch site at dusk: desert flats, gantry, the rocket on the pad
export function launchSite(g, t, cam, o = {}) {
  const night = o.night ?? 0;
  layer(g, cam, 0.1, (g) => { backdrop(g, [mix('#3a3a86', '#0a0e26', night), mix('#8a6ab0', '#1a1640', night), mix('#f2a07a', '#2a2050', night)]); FX.stars(g, t, { count: 40 + 120 * night, area: [-200, -200, E.W + 400, E.H * 0.5] }); if (night < 0.5) FX.sun(g, E.W * 0.2, E.H * 0.62, 50, '#fff0d8', '#ffb07a', 4); else FX.moon(g, E.W * 0.2, 180, 40); });
  layer(g, cam, 0.3, (g) => FX.hills(g, { y: E.H * 0.7, amp: 90, color: mix('#6a4a7a', '#1c1830', night), seed: 5, freq: 0.003 }));
  layer(g, cam, 0.7, (g) => {
    g.fillStyle = mix('#c88a6a', '#2a2238', night); g.fillRect(-E.W, E.H * 0.72, E.W * 3, E.H);
    const px = o.padX ?? 1350, py = E.H * 0.74;
    // gantry tower
    g.strokeStyle = mix('#3a2a3a', '#0e0c18', night); g.lineWidth = 8; g.strokeRect(px + 130, py - 560, 70, 560);
    for (let y = py - 560; y < py; y += 70) { seg(g, [[px + 130, y], [px + 200, y + 70]], 4, mix('#3a2a3a', '#0e0c18', night)); }
    rr(g, px - 140, py - 10, 320, 30, 6); g.fillStyle = mix('#5a4a5a', '#1a1626', night); g.fill();
    if (o.rocket !== false) rocket(g, px, py - 10 - (o.rise ?? 0), 0.95, { flame: o.flame ?? 0, t });
    if (o.smoke) { const r = rng(4); for (let i = 0; i < 24; i++) { const k = o.smoke, a = r() * Math.PI, d = (100 + r() * 360) * k; g.fillStyle = alpha(mix('#f4e8e4', '#8a8aa8', night), 0.7 * (1 - k * 0.4)); g.beginPath(); g.arc(px + Math.cos(a) * d * (r() < 0.5 ? -1 : 1), py - 20 - Math.sin(a) * d * 0.3, 60 + r() * 80 * k, 0, Math.PI * 2); g.fill(); } }
  });
  layer(g, cam, 1, (g) => { g.fillStyle = mix('#d8a07a', '#2a2238', night); g.fillRect(-E.W, GY() - 30, E.W * 3, E.H); });
}

// t01 — meet the twin: same face, one of them in a spacesuit
registerShot('t01', { draw(g, t) {
  const cam = { z: 1.1 + 0.04 * t, x: -120, y: 40 };
  launchSite(g, t, cam);
  layer(g, cam, 1, (g) => {
    const a = hero(g, { x: 640, y: GY(), s: HS, facing: 1, t, pose: posesAt(t, [[0, POSES.relaxed], [0.6, POSES.wave]]), expr: 'happy', rim: { color: '#ffc68a', dir: [-0.7, -0.6], w: 5 } });
    const b = twin(g, { x: 1000, y: GY(), s: HS, facing: -1, t: t + 0.3, pose: posesAt(t, [[0, POSES.relaxed], [0.8, POSES.wave]]), expr: 'happy', rim: { color: '#ffc68a', dir: [0.7, -0.6], w: 5 } });
    const q = ease.out(prog(t, 1.2, 1.6)); lbl(g, '=', (a.head[0] + b.head[0]) / 2, a.head[1], q, V(100, 96), '#ffffff', 'center');
  });
} });

// t02 — lift-off: the twin waves from the window, 0.9 c
registerShot('t02', { draw(g, t) {
  const L = 1.6, rise = t > L ? 260 * (t - L) ** 2 : 0, [sx, sy] = t > L - 0.4 ? shake(t, 10 * clamp(1 - (t - L) / 2.4), 30) : [0, 0];
  const cam = { z: 1.15, x: 260 + sx, y: -60 - rise * 0.55 + sy };
  launchSite(g, t, cam, { padX: 900, rise, flame: clamp((t - (L - 0.6)) * 2), smoke: t > L - 0.4 ? clamp((t - L + 0.4) / 2) : 0 });
  layer(g, cam, 0.7, (g) => { const wx = 900, wy = E.H * 0.74 - 10 - rise - 260 * 0.95; circle(g, wx, wy, 22, '#eef0f6'); circle(g, wx, wy + 2, 14, '#0c0b18'); circle(g, wx - 4, wy, 3, '#fff'); circle(g, wx + 4, wy, 3, '#fff'); });
  const a = ease.out(prog(t, 2.6, 3.0)); lbl(g, '0.9 c', E.W - V(160, 120), V(150, 230), a, V(96, 96), PINK, 'right');
} });

// t03 — on Earth 20 years fly by: seasons flicker, the hero grows a beard, +20
registerShot('t03', { draw(g, t) {
  const k = ease.inOut(prog(t, 0.3, 3.8)), cam = { z: 1.25, x: -260, y: 60 };
  const night = 0.5 + 0.5 * Math.sin(t * 9);
  launchSite(g, t, cam, { rocket: false, night: night * 0.8 });
  layer(g, cam, 1, (g) => {
    const h = hero(g, { x: 760, y: GY(), s: HS, facing: 1, t, pose: P('relaxed', {}), expr: k > 0.6 ? 'sad' : 'neutral', look: [0.6, -0.6], rim: { color: '#ffc68a', dir: [-0.7, -0.6], w: 5 } });
    beard(g, h, k, HS); cane(g, h, HS, clamp((k - 0.7) * 4));
  });
  if (Math.sin(t * 4.5) > 0.6) FX.snow(g, t, { count: 80, speed: 60 });
  lbl(g, `+${Math.round(20 * k)}`, E.W - V(180, 120), V(160, 230), 1, V(110, 110), GOLD, 'right');
  FX.clock(g, V(200, 140), V(170, 230), 70, t * 40, {});
} });

// t04 — touchdown in a cloud of dust
registerShot('t04', { draw(g, t) {
  const d = ease.out(prog(t, 0, 1.4)), y = lerp(-900, 0, d), [sx, sy] = t > 1.3 ? shake(t, 8 * clamp(1 - (t - 1.3)), 30) : [0, 0];
  const cam = { z: 1.1, x: 260 + sx, y: -40 + sy };
  launchSite(g, t, cam, { padX: 900, rise: -y, flame: t < 1.4 ? 0.7 : clamp(1.8 - t), smoke: clamp((t - 0.6) / 1.5), night: 0.3 });
} });

// t05 — reunion: the old hero and his young twin; +20 vs < 9; +11
registerShot('t05', { draw(g, t) {
  const cam = { z: 1.15 + 0.03 * t, x: -120, y: 40 };
  launchSite(g, t, cam, { night: 0.3 }); const outer = g.getTransform(); let ah, bh;
  const q = ease.outBack(prog(t, 2.9, 3.3)), a1 = ease.out(prog(t, 0.5, 0.9)), a2 = ease.out(prog(t, 1.5, 1.9));
  layer(g, cam, 1, (g) => {
    const a = hero(g, { x: 640, y: GY(), s: HS, facing: 1, t, pose: P('relaxed', {}), expr: t > 3 ? 'shocked' : 'surprised', look: [1, 0], rim: { color: '#ffc68a', dir: [-0.7, -0.6], w: 5 } });
    beard(g, a, 1, HS); cane(g, a, HS, 1);
    const b = twin(g, { x: 1040, y: GY(), s: HS, facing: -1, t: t + 0.3, pose: posesAt(t, [[0, POSES.relaxed], [0.4, POSES.cheer]]), expr: 'joy', rim: { color: '#ffc68a', dir: [0.7, -0.6], w: 5 } });
    if (E.crop) { const m = outer.inverse().multiply(g.getTransform()); ah = m.transformPoint({ x: a.head[0], y: a.head[1] }); bh = m.transformPoint({ x: b.head[0], y: b.head[1] }); return; }
    lbl(g, '+20', a.head[0], a.head[1] - 150, a1, V(90, 90), GOLD, 'center');
    lbl(g, '< 9', b.head[0], b.head[1] - 150, a2, V(90, 90), CYAN, 'center');
    if (q > 0) { g.save(); g.translate((a.head[0] + b.head[0]) / 2 - 20, a.head[1] + 110); g.scale(q, q); lbl(g, '+11', 0, 0, 1, V(110, 110), PINK, 'center'); g.restore(); }
  });
  if (E.crop) { // 9:16 Shorts: labels in screen space, only for figures inside the frame
    const vis = (p) => (p.x > E.crop[0] + 20 && p.x < E.crop[1] - 20 ? 1 : 0);
    lbl(g, '+20', ah.x, ah.y - 170, vis(ah) * a1, 90, GOLD, 'center'); lbl(g, '< 9', bh.x, bh.y - 170, vis(bh) * a2, 90, CYAN, 'center');
    if (q > 0) lbl(g, '+11', (E.crop[0] + E.crop[1]) / 2, ah.y - 330, Math.min(1, q), 110 * Math.max(0.3, q), PINK, 'center');
  }
} });

// t06 — giant bearded face, stunned; nobody cheated
registerShot('t06', { draw(g, t) {
  blurLayer(g, 14, (g) => launchSite(g, t, { z: 1.4, x: 0, y: 0 }, { night: 0.3 })); veil(g, '#14081e', 0.3);
  const r = V(300, 330) * (1 + 0.03 * t), cx = E.W / 2, cy = E.H * 0.6;
  bigFace(g, cx, cy, r, { outfit: HERO, expr: t < 1.2 ? 'shocked' : 'confused', rimColor: '#ffc68a', rimSide: -1 });
  beard(g, { head: [cx, cy, r] }, 1, 1);
} });
