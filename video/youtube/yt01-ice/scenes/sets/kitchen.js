// sets/kitchen.js — the hero's small city kitchen. Night (moonlight + warm pendant lamp) or morning (golden sun through the window).
// kitchen(g, t, cam, { mood:'night'|'golden', lamp 0..1, freezer 0..1 (door open), inside(g, x, y, w, h) draws freezer contents })
// Characters are drawn by the shot at depth 1 with the returned GY.
import { E, V, mood, layer, backdrop, rr, seg, circle, ring, poly, linGrad, radGrad, glow, alpha, shade, mix, rng, clamp } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';

export const KGY = () => E.H * 0.88;
export const FRIDGE = { x: 1300, w: 330, h: 700, fz: 280 };     // fridge-freezer: freezer is the top fz px
export const SINK_X = 560, COUNTER_TOP = () => KGY() - 210;

export function windowView(g, t, x, y, w, h, M, night, skyT = 0) {
  g.fillStyle = linGrad(g, 0, y, 0, y + h, night ? ['#060b20', '#14204a', '#2c3470'] : ['#6c84b8', '#f0b27a', '#ffe2a8']); g.fillRect(x, y, w, h);
  if (night) { FX.stars(g, t, { area: [x, y, w, h * 0.7], count: 50, seed: 4 }); FX.moon(g, x + w * (0.72 - skyT * 0.5), y + h * (0.25 + skyT * 0.1), 26, '#eef2ff'); }
  else { FX.sun(g, x + w * 0.3, y + h * 0.62, 40, '#fff6dc', '#ffcf8f', 4); }
  FX.skyline(g, { x: x - 40, y: y + h, w: w + 80, minH: 40, maxH: h * 0.55, color: night ? '#0b0f26' : '#5a4a6a', windowColor: night ? '#ffc870' : '#ffe9c0', lit: night ? 0.45 : 0.1, seed: 12, minW: 30, maxW: 70 });
}

export function kitchen(g, t, cam, o = {}) {
  const night = (o.mood || 'night') === 'night', M = mood(night ? 'night' : 'golden'), GY = KGY();
  const lamp = o.lamp ?? (night ? 1 : 0), fz = o.freezer ?? 0;
  const wall = night ? '#1e2240' : '#5a4152', wallLo = night ? '#151831' : '#4a3344';
  layer(g, cam, 1, (g) => {
    // back wall + subtle tiles
    g.fillStyle = linGrad(g, 0, 0, 0, GY, [shade(wall, -0.25), wall, wallLo]); g.fillRect(-900, -400, E.W + 1800, GY + 400);
    g.strokeStyle = 'rgba(255,255,255,.035)'; g.lineWidth = 2; for (let y = COUNTER_TOP() - 160; y < COUNTER_TOP(); y += 40) { g.beginPath(); g.moveTo(80, y); g.lineTo(1160, y); g.stroke(); }
    for (let x = 80; x < 1160; x += 60) { g.beginPath(); g.moveTo(x, COUNTER_TOP() - 160); g.lineTo(x, COUNTER_TOP()); g.stroke(); }
    // window
    const wx = 270, wy = 150, ww = 520, wh = 420;
    FX.windowFrame(g, { x: wx, y: wy, w: ww, h: wh, cols: 2, rows: 2, frame: night ? '#0e1024' : '#3a2632', bar: 12 }, (g, x, y, w, h) => windowView(g, t, x, y, w, h, M, night, o.skyT || 0));
    rr(g, wx - 24, wy + wh, ww + 48, 18, 4); g.fillStyle = night ? '#2a2e52' : '#6a4a58'; g.fill();
    // light from the window onto the wall/floor
    if (night) FX.lightCone(g, wx + ww * 0.7, wy + 40, { angle: Math.PI * 0.62, spread: 0.45, len: 900, color: '#9fb4ff', a: 0.07 });
    else FX.godRays(g, wx + ww * 0.3, wy + wh * 0.6, { angle: Math.PI * 0.3, spread: 0.5, len: 1500, color: '#ffd9a0', a: 0.09, t });
    // upper cabinets
    for (let i = 0; i < 2; i++) { const cx = 860 + i * 150; rr(g, cx, 140, 140, 250, 6); g.fillStyle = night ? '#2a2c4e' : '#6e4e5e'; g.fill(); seg(g, [[cx + (i ? 18 : 122), 330], [cx + (i ? 18 : 122), 370]], 6, alpha('#ffffff', 0.35)); }
    // shelf with jars
    rr(g, 60, 300, 170, 10, 3); g.fillStyle = night ? '#2a2c4e' : '#6e4e5e'; g.fill();
    [['#c9774a', 40], ['#e8c860', 52], ['#7aa86a', 36]].forEach(([c, h], i) => { rr(g, 76 + i * 52, 300 - h, 40, h, 8); g.fillStyle = alpha(c, night ? 0.55 : 0.9); g.fill(); });
    // clock
    FX.clock(g, 1135, 230, 54, (o.clockT ?? 0) + 23 * 3600 + 40 * 60, { face: night ? '#cfd3ea' : '#f6efe2', ink: '#1a1830' });
    // counter
    const ct = COUNTER_TOP();
    g.fillStyle = night ? '#232647' : '#5e4253'; g.fillRect(60, ct, 1140, GY - ct);
    g.fillStyle = night ? '#3a3e6a' : '#8a6a72'; g.fillRect(48, ct - 14, 1164, 16);
    g.strokeStyle = 'rgba(0,0,0,.3)'; g.lineWidth = 3; for (let i = 1; i < 6; i++) { g.beginPath(); g.moveTo(60 + i * 190, ct + 14); g.lineTo(60 + i * 190, GY - 8); g.stroke(); }
    for (let i = 0; i < 6; i++) seg(g, [[60 + i * 190 + 150, ct + 40], [60 + i * 190 + 150, ct + 80]], 5, 'rgba(255,255,255,.3)');
    // sink + tap
    rr(g, SINK_X - 110, ct - 12, 220, 10, 4); g.fillStyle = '#9aa2c0'; g.fill();
    seg(g, [[SINK_X + 60, ct - 14], [SINK_X + 60, ct - 110], [SINK_X + 10, ct - 110], [SINK_X + 10, ct - 92]], 12, night ? '#9aa2c8' : '#d8d0d8');
    seg(g, [[SINK_X + 80, ct - 30], [SINK_X + 100, ct - 30]], 9, night ? '#9aa2c8' : '#d8d0d8');
    // plant + kettle + cutting board
    rr(g, 140, ct - 60, 60, 60, 10); g.fillStyle = '#b5654a'; g.fill();
    for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * 0.32; g.fillStyle = night ? '#2f5a4a' : '#4f8a55'; g.beginPath(); g.ellipse(170 + Math.cos(a) * 46, ct - 76 + Math.sin(a) * 46, 12, 34, a + Math.PI / 2, 0, Math.PI * 2); g.fill(); }
    rr(g, 880, ct - 90, 110, 90, 30); g.fillStyle = night ? '#4a3a5a' : '#c25a4a'; g.fill(); seg(g, [[900, ct - 90], [935, ct - 120], [970, ct - 90]], 8, '#2a2030');
    rr(g, 1030, ct - 140, 110, 140, 10); g.fillStyle = night ? '#3a2e3a' : '#a07850'; g.fill();
    // light switch
    rr(g, 1218, 470, 30, 50, 5); g.fillStyle = night ? '#c8cce4' : '#f0e6dc'; g.fill(); rr(g, 1228, (o.switchOn ?? lamp) > 0.5 ? 478 : 494, 10, 18, 3); g.fillStyle = '#888'; g.fill();
    // fridge-freezer
    fridge(g, t, GY, night, fz, o.inside, M);
    // floor
    g.fillStyle = linGrad(g, 0, GY, 0, E.H + 300, [night ? '#1a1c34' : '#5a3e44', night ? '#0c0d1c' : '#2e1e24']); g.fillRect(-900, GY, E.W + 1800, 700);
    g.strokeStyle = 'rgba(255,255,255,.05)'; g.lineWidth = 2; for (let x = -900; x < E.W + 900; x += 120) { g.beginPath(); g.moveTo(x, GY); g.lineTo(x + (x - 960) * 0.5, E.H + 300); g.stroke(); }
    FX.floorLines(g, GY, E.H + 300, 'rgba(255,255,255,.05)', 0.12);
    // pendant lamp
    seg(g, [[700, -400], [700, 110]], 3, '#0a0a14');
    poly(g, [[650, 150], [750, 150], [725, 110], [675, 110]], night ? '#3a3050' : '#6a4a50');
    if (lamp > 0) { circle(g, 700, 152, 12, alpha('#fff0c8', lamp)); glow(g, 700, 160, 520, M.practical, 0.28 * lamp); FX.lightCone(g, 700, 150, { angle: Math.PI / 2, spread: 0.9, len: 900, color: '#ffd59a', a: 0.12 * lamp }); FX.pool(g, 700, GY + 20, 420, 60, '#ffd59a', 0.18 * lamp); }
    if (fz > 0) { const fx = FRIDGE.x + FRIDGE.w / 2; FX.pool(g, fx, GY + 30, 380, 70, '#bfefff', 0.25 * fz); }
    // darkness when the lamp is off (night)
    if (night && lamp < 1) { g.save(); g.fillStyle = alpha('#04050e', 0.45 * (1 - lamp)); g.fillRect(-900, -400, E.W + 1800, E.H + 800); g.restore(); }
  });
  return { GY, M, night };
}

function fridge(g, t, GY, night, fz, inside, M) {
  const { x, w, h, fz: fh } = FRIDGE, top = GY - h, body = night ? '#c8ccdf' : '#efe8e4', edge = night ? '#8a90ae' : '#bdb2b2';
  g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(x - 12, top + 10, 12, h - 10);
  rr(g, x, top, w, h, 18); g.fillStyle = linGrad(g, x, 0, x + w, 0, [shade(body, -0.08), body, shade(body, -0.15)]); g.fill();
  seg(g, [[x + 4, top + fh], [x + w - 4, top + fh]], 5, edge);
  seg(g, [[x + w - 40, top + fh + 40], [x + w - 40, top + fh + 200]], 10, edge);   // fridge handle
  // freezer compartment
  if (fz > 0) {
    const ix = x + 16, iy = top + 16, iw = w - 32, ih = fh - 30;
    g.save(); rr(g, ix, iy, iw, ih, 10); g.clip();
    g.fillStyle = linGrad(g, 0, iy, 0, iy + ih, ['#eafaff', '#a8dcf0', '#6aaecc']); g.fillRect(ix, iy, iw, ih);
    seg(g, [[ix, iy + ih * 0.55], [ix + iw * 0.42, iy + ih * 0.55]], 6, 'rgba(255,255,255,.8)');
    inside?.(g, ix, iy, iw, ih);
    const r = rng(9); for (let i = 0; i < 40; i++) circle(g, ix + r() * iw, iy + (r() < 0.5 ? r() * 14 : ih - r() * 14), 2 + r() * 4, 'rgba(255,255,255,.8)');
    g.restore(); glow(g, x + w / 2, iy + ih / 2, 420, '#c8f4ff', 0.45 * fz);
    // door swinging toward the camera (left hinge) — drawn as a narrowing panel
    const dw = w * (1 - fz) + 26 * fz, dx = x - 26 * fz * 0.3;
    rr(g, dx, top, Math.max(26, dw), fh, 14); g.fillStyle = shade(body, -0.05); g.fill();
    rr(g, dx - 4, top + 4, 30, fh - 8, 12); g.fillStyle = shade(body, 0.04); g.fill();
    // mist spilling down
    for (let i = 0; i < 9; i++) { const ph = (t * 0.35 + i / 9) % 1; circle(g, x + w * (0.2 + 0.07 * i) + Math.sin(t + i) * 20, iy + ih + ph * 260, 26 + ph * 50, alpha('#eafaff', 0.22 * fz * (1 - ph))); }
  } else {
    seg(g, [[x + w - 40, top + 60], [x + w - 40, top + 190]], 10, edge);   // freezer handle
  }
  // magnets
  circle(g, x + 70, top + fh + 90, 12, '#e5466f'); rr(g, x + 50, top + fh + 100, 80, 60, 4); g.fillStyle = alpha('#fff6dc', 0.9); g.fill(); circle(g, x + 140, top + fh + 130, 10, '#3fa6e0');
  // rim light on the fridge edge (lamp side)
  seg(g, [[x + 3, top + 20], [x + 3, GY - 10]], 3, alpha(night ? '#ffd59a' : '#ffe2b0', 0.5));
  // feet
  g.fillStyle = '#1a1a24'; g.fillRect(x + 20, GY - 8, 30, 8); g.fillRect(x + w - 50, GY - 8, 30, 8);
}

// standard freezer contents: peas box + ice tray on the shelf, the bottle on the floor of the compartment
import { bottle } from '../props.js';
export const freezerBottle = (ix, iy, iw, ih) => ({ x: ix + iw * 0.68, y: iy + ih - 6, s: 0.6 });
export function freezerInside(b = {}) {
  return (g, ix, iy, iw, ih) => {
    rr(g, ix + 14, iy + ih * 0.55 - 70, 80, 70, 6); g.fillStyle = '#3f9a5a'; g.fill(); circle(g, ix + 54, iy + ih * 0.55 - 36, 16, '#8fe08a');
    rr(g, ix + 18, iy + ih - 30, 100, 24, 4); g.fillStyle = 'rgba(255,255,255,.6)'; g.fill();
    for (let i = 0; i < 4; i++) { rr(g, ix + 22 + i * 24, iy + ih - 26, 18, 16, 3); g.fillStyle = '#e8fbff'; g.fill(); }
    if (b.hide) return; const p = freezerBottle(ix, iy, iw, ih);
    bottle(g, p.x + (b.dx || 0), p.y, { s: p.s, fill: 1, ...b });
  };
}
