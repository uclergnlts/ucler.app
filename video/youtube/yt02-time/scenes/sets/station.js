// sets/station.js — night railway platform. station(g, t, cam, {train: x offset of the train or null, trainA}) ; train(g, x, y, s)
import { E, V, layer, backdrop, rr, seg, circle, poly, linGrad, radGrad, glow, alpha, shade, mix, rng, clamp } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';

export const PGY = () => E.H * 0.8;    // platform top surface (feet)
export const RAIL = () => E.H * 0.6;   // rail level (train wheels)
export function trainCar(g, x, y, w = 760, h = 300, o = {}) {   // y = wheel line
  const top = y - h - 30;
  rr(g, x, top, w, h, 40); g.fillStyle = linGrad(g, 0, top, 0, top + h, ['#e8ecf4', '#c4cad8', '#8a92a8']); g.fill();
  g.strokeStyle = '#0c0b18'; g.lineWidth = 6; g.stroke();
  g.fillStyle = o.stripe || '#e5466f'; g.fillRect(x + 6, top + h * 0.68, w - 12, 22);
  for (let i = 0; i < 5; i++) { const wx = x + 50 + i * ((w - 100) / 5); rr(g, wx, top + 50, (w - 100) / 5 - 26, h * 0.38, 12); g.fillStyle = o.lit === false ? '#2a3050' : '#ffd99a'; g.fill(); }
  for (const wx of [x + 120, x + w - 120]) { circle(g, wx, y - 10, 34, '#1a1622'); circle(g, wx, y - 10, 14, '#5a5470'); }
}
export function station(g, t, cam, o = {}) {
  const P = PGY(), R = RAIL();
  layer(g, cam, 0.1, (g) => { backdrop(g, ['#05081a', '#0e1436', '#1e2350']); FX.stars(g, t, { count: 90, area: [-200, -200, E.W + 400, E.H * 0.45] }); FX.moon(g, E.W * 0.82, 150, 40); });
  layer(g, cam, 0.25, (g) => FX.skyline(g, { y: R - 40, seed: 4 }));
  layer(g, cam, 0.6, (g) => {   // far fence + catenary poles
    for (let x = -E.W; x < E.W * 2; x += 420) { seg(g, [[x, R - 6], [x, R - 330]], 10, '#1a1830'); seg(g, [[x - 60, R - 300], [x + 60, R - 300]], 6, '#1a1830'); }
    seg(g, [[-E.W, R - 290], [E.W * 2, R - 290]], 2, 'rgba(160,170,220,.4)');
  });
  layer(g, cam, 0.85, (g) => {  // track bed
    g.fillStyle = '#16142a'; g.fillRect(-E.W, R - 8, E.W * 3, P - R + 40);
    for (let x = -E.W; x < E.W * 2; x += 46) { g.fillStyle = '#2a2438'; g.fillRect(x, R + 8, 30, 14); }
    seg(g, [[-E.W, R + 6], [E.W * 2, R + 6]], 6, '#8a8aa8'); seg(g, [[-E.W, R + 26], [E.W * 2, R + 26]], 6, '#6a6a88');
    if (o.train != null) { g.save(); if (o.blur) { g.globalAlpha = 0.9; } for (let i = -1; i < 3; i++) trainCar(g, o.train + i * 780, R + 4, 760, 300, { lit: true }); g.restore();
      if (o.blur) FX.speedLines(g, t, { cx: E.W / 2, cy: R - 200, count: 40, a: 0.15, inner: 600, color: '#dfe6ff' }); }
  });
  layer(g, cam, 1, (g) => {     // platform
    g.fillStyle = linGrad(g, 0, P - 70, 0, E.H * 2, ['#4a4462', '#2c2840', '#1a1828']); g.fillRect(-E.W, P - 70, E.W * 3, E.H * 2);
    g.fillStyle = '#ffd95a'; g.fillRect(-E.W, P - 70, E.W * 3, 12);
    g.strokeStyle = 'rgba(0,0,0,.2)'; g.lineWidth = 2; for (let x = -E.W; x < E.W * 2; x += 140) { g.beginPath(); g.moveTo(x, P - 58); g.lineTo(x - 80, E.H + 200); g.stroke(); }
    for (const x of [180, 1100, 1800]) FX.lampPost(g, x, P - 40, 520, { light: '#ffd59a', a: 0.2 });
    if (o.clock !== false) { const cx = o.clockX ?? 1460, cy = P - 520; seg(g, [[cx, cy - 80], [cx, cy - 300]], 8, '#1a1830'); FX.clock(g, cx, cy, 70, (o.clockT ?? t) * 1, {}); }
  });
  return { P, R };
}
