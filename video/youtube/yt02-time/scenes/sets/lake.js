// sets/lake.js — frozen mountain lake. lake(g, t, cam, {mood:'dusk'|'storm'}) — surface view; section(g, t, o) — cut-away under the ice.
import { E, V, mood, layer, backdrop, rr, seg, circle, ring, poly, linGrad, radGrad, glow, alpha, shade, mix, rng, noise, clamp } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';
import { fish, ICE } from '../props.js';

export const LGY = () => E.H * 0.6;     // far shore / horizon line of the lake
function mountains(g, y, col, snow, seed, amp, step) {
  const r = rng(seed); let x = -E.W; const pts = [[-E.W, E.H * 2]];
  while (x < E.W * 2) { pts.push([x, y - amp * (0.4 + r() * 0.6)]); x += step * (0.6 + r() * 0.8); pts.push([x, y - amp * r() * 0.3]); x += step * (0.4 + r() * 0.5); }
  pts.push([E.W * 2, E.H * 2]); poly(g, pts, col);
  for (let i = 1; i < pts.length - 1; i += 2) { const [px, py] = pts[i], [qx, qy] = pts[i + 1] || pts[i], [ox, oy] = pts[i - 1];
    const k = 0.28; poly(g, [[px, py], [px + (qx - px) * k, py + (qy - py) * k], [px + (qx - px) * k * 0.5, py + (qy - py) * k * 0.7], [px + (ox - px) * k * 0.4, py + (oy - py) * k * 0.7], [px + (ox - px) * k, py + (oy - py) * k]], snow); }
}
export function lake(g, t, cam, o = {}) {
  const storm = o.mood === 'storm', GY = LGY();
  layer(g, cam, 0.08, (g) => {
    backdrop(g, storm ? ['#0a0e22', '#1c2448', '#2e3866'] : ['#2a2456', '#6a4a86', '#e0906e', '#f6c890']);
    if (!storm) { FX.stars(g, t, { count: 60, area: [-200, -200, E.W + 400, E.H * 0.35] }); FX.sun(g, E.W * 0.68, GY - 40, 46, '#fff0d8', '#ffb07a', 5); }
    else { FX.clouds(g, { y: 60, h: 260, color: '#9aa6d8', a: 0.18, count: 10, seed: 4 }); }
  });
  layer(g, cam, 0.2, (g) => mountains(g, GY - 20, storm ? '#1a2040' : '#4a3a6e', storm ? '#8a96c8' : '#f4e6f0', 3, 300, 260));
  layer(g, cam, 0.35, (g) => { mountains(g, GY, storm ? '#121834' : '#33285a', storm ? '#6a76a8' : '#e8d4e4', 9, 170, 180); FX.fog(g, GY - 120, 180, storm ? '#4a5580' : '#f0b0a0', 0.3); });
  layer(g, cam, 0.55, (g) => { const r = rng(5); for (let x = -E.W; x < E.W * 2; x += 26 + r() * 30) FX.pine(g, x, GY + 6, 0.35 + r() * 0.45, storm ? '#0a0e20' : '#1c1838'); g.fillStyle = storm ? '#2a3256' : '#d8c8dc'; g.fillRect(-E.W, GY, E.W * 3, 14); });
  layer(g, cam, 1, (g) => {
    // ice surface reflecting the sky
    g.fillStyle = linGrad(g, 0, GY + 10, 0, E.H + 300, storm ? ['#3a4670', '#26304e', '#1a2038'] : ['#f2c8b4', '#b8b4d8', '#7a86b8']); g.fillRect(-E.W, GY + 10, E.W * 3, E.H * 2);
    if (!storm) { g.save(); g.globalCompositeOperation = 'lighter'; const sx = E.W * 0.68; g.translate(sx, GY + 12); g.scale(1, 0.18); g.fillStyle = radGrad(g, 0, 0, 0, 500, [alpha('#ffc090', 0.55), alpha('#ffb07a', 0.15), alpha('#ffb07a', 0)]); g.beginPath(); g.arc(0, 0, 500, 0, Math.PI); g.fill(); g.restore(); }
    const r = rng(8); g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 2;
    for (let i = 0; i < 18; i++) { let x = r() * E.W * 2 - E.W * 0.5, y = GY + 30 + r() * (E.H - GY); g.beginPath(); g.moveTo(x, y); for (let k = 0; k < 4; k++) { x += 40 + r() * 80; y += (r() - 0.5) * 20; g.lineTo(x, y); } g.stroke(); }
    for (let i = 0; i < 10; i++) { g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.ellipse(r() * E.W * 2 - E.W * 0.5, GY + 40 + r() * (E.H - GY), 120 + r() * 200, 10 + r() * 14, 0, 0, Math.PI * 2); g.fill(); }
  });
  return { GY, storm };
}
// foreground snowdrifts (call after characters for depth)
export function drifts(g, cam) {
  layer(g, cam, 1.3, (g) => { g.fillStyle = '#eef0fa'; g.beginPath(); g.ellipse(-60, E.H + 40, 420, 150, 0, 0, Math.PI * 2); g.fill(); g.beginPath(); g.ellipse(E.W + 80, E.H + 60, 380, 140, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = 'rgba(160,170,220,.35)'; g.beginPath(); g.ellipse(-40, E.H + 70, 400, 120, 0, 0, Math.PI * 2); g.fill(); });
}

// cut-away under the ice. o: { iceY (top of ice), iceH, bottom, mood, temps: bool, fishFrozen, sinkK (what-if: ice at the bottom 0..1), layers }
export function section(g, t, o = {}) {
  const storm = o.mood === 'storm', iceY = o.iceY ?? 330, iceH = o.iceH ?? 70, bottom = o.bottom ?? E.H + 120;
  // air above
  g.fillStyle = linGrad(g, 0, iceY - 600, 0, iceY, storm ? ['#0a0e22', '#2a3358'] : ['#6a4a86', '#f0a888']); g.fillRect(-E.W, iceY - 1400, E.W * 3, 1400);
  // water: lighter near the top (0 °C), deeper blue near the bottom (4 °C)
  g.fillStyle = linGrad(g, 0, iceY + iceH, 0, bottom, storm ? ['#1a2a4a', '#0a1428'] : ['#4aa0d0', '#1f5a9a', '#0e2a5a']); g.fillRect(-E.W, iceY, E.W * 3, bottom - iceY + 400);
  // light shafts through the ice
  if (!storm && iceH > 0) FX.godRays(g, E.W * 0.6, iceY + iceH, { angle: Math.PI / 2 + 0.15, spread: 0.6, len: 800, color: '#bfe8ff', a: 0.06, t, count: 6 });
  // lake bed
  g.fillStyle = storm ? '#141220' : '#2a2238'; g.beginPath(); g.moveTo(-E.W, bottom); for (let x = -E.W; x <= E.W * 2; x += 60) g.lineTo(x, bottom - 30 - noise(x * 0.004, 2) * 40); g.lineTo(E.W * 2, bottom + 600); g.lineTo(-E.W, bottom + 600); g.fill();
  const r = rng(4); for (let i = 0; i < 14; i++) { const x = r() * E.W; seg(g, [[x, bottom - 10], [x + Math.sin(t + i) * 12, bottom - 80 - r() * 80]], 6, storm ? '#1a2a24' : '#2f6a4a'); }
  // ice lid
  if (iceH > 0) { g.fillStyle = linGrad(g, 0, iceY, 0, iceY + iceH, ['#f4fdff', '#bfe6f4', '#9fd4ea']); g.fillRect(-E.W, iceY, E.W * 3, iceH);
    for (let i = 0; i < 30; i++) circle(g, r() * E.W * 1.4 - E.W * 0.2, iceY + 10 + r() * (iceH - 20), 2 + r() * 4, 'rgba(255,255,255,.8)');
    g.fillStyle = '#ffffff'; g.fillRect(-E.W, iceY - 10, E.W * 3, 12); }
  return { iceY, iceH, bottom };
}
export function school(g, t, area, n = 6, o = {}) {
  const r = rng(o.seed || 3);
  for (let i = 0; i < n; i++) { const sp = 40 + r() * 50, f = r() < 0.5 ? 1 : -1, L = 60 + r() * 40, w = area[2] + 200;
    const x = area[0] + (((r() * w + f * t * sp) % w) + w) % w - 100, y = area[1] + r() * area[3] + Math.sin(t * 1.5 + i) * 12;
    fish(g, x, y, L, f, t, { color: ['#ff9a4a', '#ffcf5a', '#ff7a6a', '#7ad0a0'][i % 4], seed: i }); }
}
