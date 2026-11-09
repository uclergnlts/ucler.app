// kit.js — YT-02 props: labels, phone + map, light clock, rocket, satellites, Earth, atomic clock, aging + astronaut twin.
import { E, V, ease, prog, clamp, lerp, rng, noise, seg, circle, ring, rr, poly, glow, alpha, shade, mix, linGrad, radGrad, text, measure } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';
import { hero } from './hero.js';

// on-screen numbers (stay inside a 9:16 re-frame)
export const lbl = (g, str, x, y, a = 1, size = V(64, 72), color = '#ffffff', align = 'left') => {
  if (a <= 0) return;
  if (E.crop) { const w = measure(g, str, size, 'Nunito', 900), L = align === 'left' ? x : align === 'right' ? x - w : x - w / 2, L2 = clamp(L, E.crop[0] + 30, E.crop[1] - 30 - w); x += L2 - L; }
  text(g, str, x, y, { size, font: 'Nunito', weight: 900, align, color, stroke: 7, strokeColor: '#0c1430', alpha: a });
};
export const GOLD = '#ffd95a', PINK = '#e5466f', CYAN = '#8fd8ff', LIGHT = '#fff3c4';

// ---------- phone + map ----------
// map of a lake with roads; pin at map-space (u,v) in 0..1; drift = extra offset of a ghost pin
export function mapView(g, x, y, w, h, o = {}) {
  const { pin = [0.2, 0.78], ghost = null, pulse = 0, a = 1, zoom = 1, ring10 = 0 } = o;
  g.save(); g.globalAlpha *= a; rr(g, x, y, w, h, 18 * (w / 400)); g.clip();
  g.fillStyle = '#e9efe2'; g.fillRect(x, y, w, h);
  g.save(); g.translate(x + w / 2, y + h / 2); g.scale(zoom, zoom); g.translate(-(x + w / 2), -(y + h / 2));
  // parks
  for (const [u, v, r] of [[0.15, 0.2, 0.12], [0.85, 0.75, 0.14], [0.9, 0.15, 0.09]]) { g.fillStyle = '#cfe6c2'; g.beginPath(); g.ellipse(x + u * w, y + v * h, r * w, r * h * 0.8, 0.3, 0, Math.PI * 2); g.fill(); }
  // lake
  g.fillStyle = '#9fd0f2'; g.beginPath(); const cx = x + w * 0.55, cy = y + h * 0.42;
  for (let i = 0; i <= 40; i++) { const an = (i / 40) * Math.PI * 2, rr2 = 1 + 0.18 * Math.sin(an * 3 + 1) + 0.1 * Math.sin(an * 5); const px = cx + Math.cos(an) * w * 0.3 * rr2, py = cy + Math.sin(an) * h * 0.24 * rr2; i ? g.lineTo(px, py) : g.moveTo(px, py); }
  g.closePath(); g.fill(); g.strokeStyle = '#7fbde8'; g.lineWidth = 3 * (w / 400); g.stroke();
  // roads
  g.lineCap = 'round';
  for (const [pts, wd] of [[[[0, 0.86], [0.3, 0.8], [0.6, 0.88], [1, 0.82]], 14], [[[0.12, 0], [0.16, 0.5], [0.08, 1]], 12], [[[0.92, 0], [0.88, 0.4], [1, 0.6]], 10], [[[0.3, 0.8], [0.32, 1]], 8]]) {
    g.strokeStyle = '#ffffff'; g.lineWidth = wd * (w / 400); g.beginPath(); pts.forEach(([u, v], i) => (i ? g.lineTo(x + u * w, y + v * h) : g.moveTo(x + u * w, y + v * h))); g.stroke();
    g.strokeStyle = '#f2d98a'; g.lineWidth = wd * 0.35 * (w / 400); g.stroke(); }
  // blocks
  const r = rng(3); for (let i = 0; i < 26; i++) { const u = r(), v = r(); if (Math.hypot((u - 0.55) / 0.36, (v - 0.42) / 0.3) < 1.05) continue; rr(g, x + u * w, y + v * h, (14 + r() * 18) * (w / 400), (10 + r() * 14) * (w / 400), 3); g.fillStyle = '#dcd8d0'; g.fill(); }
  // distance ring (10 km)
  if (ring10 > 0) { g.setLineDash([10, 8]); ring(g, x + pin[0] * w, y + pin[1] * h, w * 0.42 * ring10, 3, alpha(PINK, 0.8)); g.setLineDash([]); }
  const drawPin = (u, v, col, a2) => { const px = x + u * w, py = y + v * h, s = w / 400;
    if (a2 <= 0) return; g.save(); g.globalAlpha *= a2;
    circle(g, px, py, (18 + 26 * ((pulse * 1.2) % 1)) * s, alpha(col, 0.25 * (1 - ((pulse * 1.2) % 1))));
    circle(g, px, py, 15 * s, '#ffffff'); circle(g, px, py, 11 * s, col); g.restore(); };
  if (ghost) drawPin(ghost[0], ghost[1], '#4a8cff', ghost[2] ?? 1);
  drawPin(pin[0], pin[1], ghost ? '#9aa6c0' : '#2f7cf6', o.pinA ?? 1);
  g.restore(); g.restore();
}
// phone body; content drawn inside the screen rect
export function phone(g, x, y, s = 1, content, o = {}) {
  const w = 240 * s, h = 480 * s; g.save(); if (o.rot) { g.translate(x, y); g.rotate(o.rot); g.translate(-x, -y); }
  glow(g, x, y, w * 1.3, o.glowC || '#9fd0ff', o.glowA ?? 0.18);
  rr(g, x - w / 2, y - h / 2, w, h, 34 * s); g.fillStyle = '#14141c'; g.fill();
  rr(g, x - w / 2 + 2 * s, y - h / 2 + 2 * s, w - 4 * s, h - 4 * s, 32 * s); g.strokeStyle = '#3a3a48'; g.lineWidth = 3 * s; g.stroke();
  const sx = x - w / 2 + 12 * s, sy = y - h / 2 + 14 * s, sw = w - 24 * s, sh = h - 28 * s;
  if (content) content(sx, sy, sw, sh); rr(g, x - 30 * s, y - h / 2 + 22 * s, 60 * s, 14 * s, 7 * s); g.fillStyle = '#14141c'; g.fill();
  g.restore();
}

// ---------- clocks ----------
export function lightClock(g, cx, baseY, hgt, ph, o = {}) {  // ph = photon position 0..1..2 (up/down)
  const w = o.w ?? 140, col = o.color ?? CYAN, a = o.a ?? 1; g.save(); g.globalAlpha *= a;
  for (const yy of [baseY, baseY - hgt]) { rr(g, cx - w / 2, yy - 8, w, 16, 6); g.fillStyle = '#cfe8ff'; g.fill(); seg(g, [[cx - w / 2 + 6, yy - (yy === baseY ? 8 : -8)], [cx + w / 2 - 6, yy - (yy === baseY ? 8 : -8)]], 3, '#ffffff'); }
  seg(g, [[cx - w / 2, baseY], [cx - w / 2, baseY - hgt]], 4, alpha(col, 0.35)); seg(g, [[cx + w / 2, baseY], [cx + w / 2, baseY - hgt]], 4, alpha(col, 0.35));
  if (!o.noPhoton) { const k = ph % 2, py = k < 1 ? baseY - 10 - (hgt - 20) * k : baseY - hgt + 10 + (hgt - 20) * (k - 1); glow(g, cx, py, 60, LIGHT, 0.7); circle(g, cx, py, 12, '#ffffff'); }
  g.restore();
}
// digital atomic clock box with a running readout
export function atomic(g, x, y, s, str, o = {}) {
  const w = (o.w ?? 230) * s, h = 110 * s; rr(g, x - w / 2, y - h / 2, w, h, 16 * s); g.fillStyle = o.body || '#1a2238'; g.fill(); g.strokeStyle = alpha(o.color || CYAN, 0.7); g.lineWidth = 4 * s; g.stroke();
  rr(g, x - w / 2 + 14 * s, y - h / 2 + 16 * s, w - 28 * s, h - 32 * s, 8 * s); g.fillStyle = '#060a14'; g.fill();
  text(g, str, x, y + 2 * s, { size: 44 * s, font: 'Nunito', weight: 900, color: o.color || CYAN, glow: 14, glowColor: alpha(o.color || CYAN, 0.6) });
  // atom symbol on top
  g.save(); g.translate(x, y - h / 2 - 34 * s); for (let i = 0; i < 3; i++) { g.save(); g.rotate(i * Math.PI / 3 + (o.t || 0)); g.strokeStyle = alpha(o.color || CYAN, 0.8); g.lineWidth = 3 * s; g.beginPath(); g.ellipse(0, 0, 30 * s, 11 * s, 0, 0, Math.PI * 2); g.stroke(); g.restore(); } circle(g, 0, 0, 6 * s, o.color || CYAN); g.restore();
}

// ---------- rocket / satellite / Earth ----------
export function rocket(g, x, y, s = 1, o = {}) {   // y = base of the body
  const { flame = 0, t = 0, window: win = true, tilt = 0 } = o;
  g.save(); g.translate(x, y); g.rotate(tilt); g.scale(s, s);
  if (flame > 0) { const f = flame * (1 + 0.15 * Math.sin(t * 40)); glow(g, 0, 40 * f, 160 * f, '#ffb04a', 0.6); poly(g, [[-34, 0], [34, 0], [0, 220 * f]], '#ff8a3a'); poly(g, [[-20, 0], [20, 0], [0, 140 * f]], '#ffe08a'); }
  poly(g, [[-46, -40], [-100, 20], [-100, 40], [-46, 10]], PINK); poly(g, [[46, -40], [100, 20], [100, 40], [46, 10]], PINK);
  g.fillStyle = linGrad(g, -50, 0, 50, 0, ['#c8ccd8', '#f6f6fa', '#b8bccc']); g.beginPath(); g.moveTo(-50, 0); g.lineTo(-50, -260); g.quadraticCurveTo(-46, -380, 0, -440); g.quadraticCurveTo(46, -380, 50, -260); g.lineTo(50, 0); g.closePath(); g.fill();
  g.strokeStyle = '#0c0b18'; g.lineWidth = 6; g.stroke();
  poly(g, [[-36, -400], [36, -400], [0, -442]], PINK); rr(g, -50, -70, 100, 22, 4); g.fillStyle = PINK; g.fill();
  if (win) { circle(g, 0, -260, 34, '#0c0b18'); circle(g, 0, -260, 27, '#6ab8f0'); circle(g, -8, -268, 8, 'rgba(255,255,255,.7)'); }
  poly(g, [[-12, 0], [12, 0], [0, 40]], '#5a5f70');
  g.restore();
  return { win: [x + Math.sin(tilt) * 260 * s, y - Math.cos(tilt) * 260 * s] };
}
export function satellite(g, x, y, s = 1, o = {}) {
  g.save(); g.translate(x, y); g.rotate(o.rot || 0); g.scale(s, s);
  for (const d of [-1, 1]) { seg(g, [[d * 30, 0], [d * 54, 0]], 6, '#9aa0b4'); rr(g, d > 0 ? 54 : -174, -34, 120, 68, 6); g.fillStyle = '#2a4a9a'; g.fill(); g.strokeStyle = '#8fb4ff'; g.lineWidth = 3; g.stroke();
    for (let i = 1; i < 4; i++) seg(g, [[(d > 0 ? 54 : -174) + i * 30, -34], [(d > 0 ? 54 : -174) + i * 30, 34]], 2, 'rgba(160,190,255,.6)'); seg(g, [[d > 0 ? 54 : -174, 0], [d > 0 ? 174 : -54, 0]], 2, 'rgba(160,190,255,.6)'); }
  rr(g, -32, -40, 64, 80, 8); g.fillStyle = '#e8c86a'; g.fill(); g.strokeStyle = '#0c0b18'; g.lineWidth = 4; g.stroke();
  seg(g, [[0, 40], [0, 66]], 4, '#cfd4e0'); g.fillStyle = '#cfd4e0'; g.beginPath(); g.ellipse(0, 70, 22, 8, 0, 0, Math.PI * 2); g.fill();
  if (o.clock) { circle(g, 0, -6, 18, '#0c1430'); circle(g, 0, -6, 6, CYAN); glow(g, 0, -6, 40, CYAN, 0.6); }
  g.restore();
}
export function earth(g, x, y, r, t = 0, o = {}) {
  glow(g, x, y, r * 1.35, '#6ab8ff', 0.35);
  circle(g, x, y, r, '#1f5fae'); g.save(); g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.clip();
  g.fillStyle = radGrad(g, x - r * 0.35, y - r * 0.4, r * 0.1, r * 1.3, ['#4aa0e8', '#1f5fae', '#0e2a5a']); g.fillRect(x - r, y - r, r * 2, r * 2);
  const rot = (o.spin ?? 0.03) * t; const R = rng(12);
  for (let i = 0; i < 9; i++) { const lon = R() * Math.PI * 2 + rot, lat = (R() - 0.5) * 2.2, sz = 0.18 + R() * 0.3; const cxp = x + Math.sin(lon) * Math.cos(lat * 0.7) * r, cyp = y + Math.sin(lat * 0.7) * r * 0.9; if (Math.cos(lon) < -0.1) continue;
    g.fillStyle = mix('#3f9a5a', '#c8b47a', R() * 0.5); g.beginPath(); for (let k = 0; k <= 14; k++) { const an = (k / 14) * Math.PI * 2, rr2 = sz * r * (0.7 + 0.3 * noise(k * 0.7 + i, 3)); const px = cxp + Math.cos(an) * rr2 * Math.max(0.25, Math.cos(lon)), py = cyp + Math.sin(an) * rr2 * 0.75; k ? g.lineTo(px, py) : g.moveTo(px, py); } g.fill(); }
  g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.ellipse(x, y - r * 0.96, r * 0.3, r * 0.06, 0, 0, Math.PI * 2); g.fill();
  for (let i = 0; i < 6; i++) { g.fillStyle = 'rgba(255,255,255,.22)'; g.beginPath(); g.ellipse(x - r + ((i * 0.37 + rot * 0.6) % 2) * r, y - r * 0.6 + i * r * 0.22, r * 0.35, r * 0.05, 0.1, 0, Math.PI * 2); g.fill(); }
  // night shade
  g.fillStyle = linGrad(g, x - r, y, x + r, y, ['rgba(0,0,20,0)', 'rgba(0,0,20,0)', 'rgba(0,4,24,.55)']); g.fillRect(x - r, y - r, r * 2, r * 2);
  g.restore(); ring(g, x, y, r, 3, 'rgba(160,210,255,.6)');
}
export function space(g, t, o = {}) {
  g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#03050f', '#0a0f2a', '#120f30']); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
  FX.stars(g, t, { count: o.count ?? 260, area: [-E.W * 0.5, -E.H * 0.5, E.W * 2, E.H * 2], seed: o.seed ?? 7 });
  glow(g, E.W * 0.8, E.H * 0.2, 700, '#6a4aff', 0.08); glow(g, E.W * 0.15, E.H * 0.85, 600, '#2a8aff', 0.08);
}

// ---------- hero variants ----------
// old hero: white beard + cane (k = 0..1 aging)
export function beard(g, h, k, s = 1) {
  if (k <= 0) return; const [hx, hy, r] = h.head; g.save(); g.globalAlpha *= clamp(k * 1.4);
  g.fillStyle = '#f2f0ea'; g.beginPath(); g.moveTo(hx - r * 0.8, hy + r * 0.25); g.quadraticCurveTo(hx, hy + r * (0.9 + 0.9 * k), hx + r * 0.8, hy + r * 0.25); g.quadraticCurveTo(hx, hy + r * 0.62, hx - r * 0.8, hy + r * 0.25); g.fill();
  g.fillStyle = '#f2f0ea'; g.beginPath(); g.ellipse(hx - r * 0.22, hy + r * 0.18, r * 0.24, r * 0.09, -0.2, 0, Math.PI * 2); g.ellipse(hx + r * 0.22, hy + r * 0.18, r * 0.24, r * 0.09, 0.2, 0, Math.PI * 2); g.fill();
  g.restore();
}
export function cane(g, h, s, a = 1) { if (a <= 0) return; g.save(); g.globalAlpha *= a; const [x, y] = h.handB; seg(g, [[x, y], [x + 6 * s, y + 100 * s]], 6 * s, '#6a4a2a'); seg(g, [[x - 10 * s, y], [x + 6 * s, y - 4 * s]], 6 * s, '#6a4a2a'); g.restore(); }
// astronaut twin: same hero, white suit, glass helmet
export const SUIT = { top: 'tracksuit', color: '#eef0f6', head: 'none', legs: '#d8dce8' };
export function helmet(g, h, s = 1) { const [x, y, r] = h.head; circle(g, x, y, r * 1.45, 'rgba(180,220,255,.18)'); ring(g, x, y, r * 1.45, 4 * s, 'rgba(230,245,255,.9)'); seg(g, [[x - r * 0.9, y - r * 0.7], [x - r * 0.5, y - r * 1.05]], 4 * s, 'rgba(255,255,255,.8)'); }
export function twin(g, o) { const h = hero(g, { ...o, outfit: SUIT }); if (o.helmet !== false) helmet(g, h, o.s ?? 1); circle(g, h.head[0] + (o.facing ?? 1) * 0, h.head[1] + h.head[2] * 2.1, 6 * (o.s ?? 1), PINK); return h; }
