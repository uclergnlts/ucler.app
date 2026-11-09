// shots/03_twin.js — the twin flies at 0.9 c; 20 years on Earth, less than 9 on the rocket.
import { E, V, registerShot, layer, blurLayer, veil, backdrop, ease, prog, clamp, lerp, shake, rng, seg, circle, ring, rr, poly, glow, alpha, mix, linGrad, radGrad, text } from '/engine/core.js';
import { POSES, posesAt, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { hero, P } from '../hero.js';
import { HERO } from '../cast.js';
import { lbl, rocket, twin, helmet, aged, agedFace, stoop, cane2, GOLD, PINK, CYAN } from '../kit.js';

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
  const k = ease.inOut(prog(t, 0.3, 3.8)), cam = { z: 1.2, x: -200, y: 50 };
  const night = 0.5 - 0.5 * Math.cos(t * 6), yr = t * 1.6, sea = yr % 1;   // sky cycles day/night, one season loop per year
  launchSite(g, t, cam, { rocket: false, night: night * 0.75 });
  layer(g, cam, 1, (g) => {
    // a tree grows from a sapling; leaves follow the seasons
    const tx = 1180, gy = GY() - 20, gk = ease.out(prog(t, 0, 4.0)), th = lerp(50, 300, gk), cr = lerp(26, 150, gk), sw = Math.sin(t * 3) * 6 * gk;
    seg(g, [[tx, gy], [tx + sw * 0.3, gy - th]], lerp(6, 26, gk), '#4a3226');
    for (const [dx, dy, bl] of [[-0.6, 0.35, 0.5], [0.55, 0.45, 0.45], [0.1, 0.75, 0.4]]) seg(g, [[tx + sw * 0.2, gy - th * bl], [tx + cr * dx + sw, gy - th - cr * (dy - 0.6)]], lerp(3, 12, gk), '#4a3226');
    const leaf = sea < 0.25 ? '#8fd46a' : sea < 0.5 ? '#3f9a4a' : sea < 0.75 ? '#e88a3a' : null;
    if (leaf) for (const [dx, dy, q] of [[0, -0.2, 1], [-0.6, 0.15, 0.75], [0.6, 0.1, 0.8], [-0.3, -0.55, 0.7], [0.35, -0.5, 0.7]]) circle(g, tx + sw + cr * dx, gy - th + cr * dy, cr * 0.62 * q, leaf);
    if (sea >= 0.5 && sea < 0.75) { const r = rng(9); for (let i = 0; i < 14; i++) { const ph = (r() + (sea - 0.5) * 4) % 1; circle(g, tx - cr + r() * cr * 2.4 + ph * 80, gy - th + ph * (th + 20), 7, '#e8913a'); } }
    if (sea >= 0.75) { for (const [dx, dy] of [[0, -0.2], [-0.5, 0.1], [0.5, 0.05]]) { g.fillStyle = 'rgba(255,255,255,.85)'; g.beginPath(); g.ellipse(tx + cr * dx, gy - th + cr * dy - 6, cr * 0.35, 9, 0, 0, Math.PI * 2); g.fill(); } g.fillStyle = 'rgba(245,248,255,.8)'; g.fillRect(-E.W, GY() - 32, E.W * 3, 14); }
    const h = hero(g, { x: 720, y: GY(), s: HS, facing: 1, t, pose: stoop(P('relaxed', {}), k), expr: k > 0.7 ? 'worried' : 'neutral', look: [0.6, -0.6], rim: { color: '#ffc68a', dir: [-0.7, -0.6], w: 5 } });
    aged(g, h, k, HS, 1); cane2(g, h, HS, GY(), clamp((k - 0.6) * 4), 1);
  });
  if (sea >= 0.75) FX.snow(g, t, { count: 90, speed: 70 });
  // calendar: pages tear off and fly away
  const cx = V(230, 160), cy = V(200, 260), n = Math.floor(yr * 4);
  rr(g, cx - 90, cy - 70, 180, 160, 14); g.fillStyle = '#f4efe6'; g.fill(); rr(g, cx - 90, cy - 70, 180, 44, 14); g.fillStyle = PINK; g.fill();
  for (const dx of [-45, 45]) seg(g, [[cx + dx, cy - 84], [cx + dx, cy - 56]], 8, '#2a2238');
  const rg = rng(3); for (let i = 0; i < 7; i++) for (let j = 0; j < 4; j++) if (rg() > 0.15) rr(g, cx - 72 + i * 21, cy - 10 + j * 22, 14, 14, 3), g.fillStyle = alpha('#2a2238', 0.35), g.fill();
  for (let i = 0; i < 6; i++) { const ph = (yr * 4 - n + i / 6) % 1; if (n + i < 2) continue; g.save(); g.translate(cx + ph * 520, cy - ph * 160 + Math.sin(ph * 8 + i) * 30); g.rotate(ph * 4 + i); g.globalAlpha = 1 - ph; rr(g, -40, -36, 80, 72, 8); g.fillStyle = '#f4efe6'; g.fill(); g.restore(); }
  lbl(g, `+${Math.round(20 * k)}`, E.W - V(180, 120), V(160, 230), 1, V(110, 110), GOLD, 'right');
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
    const a = hero(g, { x: 640, y: GY(), s: HS, facing: 1, t, pose: stoop(P('relaxed', {}), 1), expr: t > 3 ? 'shocked' : 'surprised', look: [1, 0], rim: { color: '#ffc68a', dir: [-0.7, -0.6], w: 5 } });
    aged(g, a, 1, HS, 1); cane2(g, a, HS, GY(), 1, 1);
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
  agedFace(g, cx, cy, r, 1);
} });
