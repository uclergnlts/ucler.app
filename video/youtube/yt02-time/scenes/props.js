// props.js — objects shared by many shots (bottle, ice, glass, molecules, fish, icons, logo).
import { E, V, S, clamp, lerp, ease, prog, rng, noise, seg, circle, ring, rr, poly, glow, alpha, shade, mix, linGrad, radGrad, text } from '/engine/core.js';

export const ICE = '#cfefff', ICE_D = '#7cc4e6', WATER = '#3f9ad6', WATER_D = '#1f5f9e';

// plastic bottle, base at (x,y). o: { s, fill 0..1, frost 0..1, ice 0..1 (frozen fraction), crack 0..1, bulge 0..1, mush 0..1 (ice pushing out of neck),
//   capOff, tilt, rim colour, light }
export function bottle(g, x, y, o = {}) {
  const s = o.s ?? 1, H = 260 * s, W = 96 * s * (1 + 0.12 * (o.bulge || 0)), nW = 34 * s, nH = 46 * s;
  g.save(); g.translate(x, y); if (o.tilt) g.rotate(o.tilt);
  const body = () => { g.beginPath(); g.moveTo(-W / 2, -8 * s); g.quadraticCurveTo(-W / 2, 0, -W / 2 + 10 * s, 0); g.lineTo(W / 2 - 10 * s, 0); g.quadraticCurveTo(W / 2, 0, W / 2, -8 * s);
    g.lineTo(W / 2, -H * 0.62); g.bezierCurveTo(W / 2, -H * 0.78, nW / 2, -H * 0.8, nW / 2, -H + nH); g.lineTo(nW / 2, -H); g.lineTo(-nW / 2, -H); g.lineTo(-nW / 2, -H + nH);
    g.bezierCurveTo(-nW / 2, -H * 0.8, -W / 2, -H * 0.78, -W / 2, -H * 0.62); g.closePath(); };
  // glow / rim
  if (o.rim) { g.save(); g.translate(-4 * s, -3 * s); body(); g.fillStyle = alpha(o.rim, 0.9); g.fill(); g.restore(); }
  // plastic
  body(); g.fillStyle = 'rgba(200,230,255,.22)'; g.fill();
  // water / ice content
  const fill = o.fill ?? 1, top = -H * (0.06 + 0.9 * fill) + (fill >= 0.99 ? -nH * 0.2 : 0);
  g.save(); body(); g.clip();
  const iceK = o.ice || 0;
  g.fillStyle = linGrad(g, 0, top, 0, 0, [mix(WATER, ICE, iceK * 0.85), mix(WATER_D, ICE_D, iceK * 0.85)]); g.fillRect(-W, top, W * 2, -top);
  if (iceK > 0) { // crystal streaks growing inward from the walls
    const r = rng(7); g.globalAlpha = 0.5 * iceK; g.strokeStyle = '#ffffff'; g.lineWidth = 2 * s;
    for (let i = 0; i < 26; i++) { const side = i % 2 ? 1 : -1, yy = top + r() * (-top), L = (W / 2) * iceK * (0.4 + r() * 0.6); const x0 = side * W / 2; g.beginPath(); g.moveTo(x0, yy); g.lineTo(x0 - side * L, yy + (r() - 0.5) * 30 * s); g.stroke(); g.beginPath(); g.moveTo(x0 - side * L * 0.5, yy); g.lineTo(x0 - side * L * 0.7, yy - 14 * s); g.stroke(); }
    g.globalAlpha = 1;
  }
  // surface line
  if (fill < 0.99) { g.fillStyle = alpha('#ffffff', 0.5); g.fillRect(-W, top, W * 2, 3 * s); }
  // highlight
  g.fillStyle = 'rgba(255,255,255,.28)'; g.fillRect(-W * 0.32, -H * 0.6, W * 0.1, H * 0.52);
  g.restore();
  // frost on the outside
  if (o.frost) { g.save(); body(); g.clip(); const r = rng(3); for (let i = 0; i < 70; i++) circle(g, (r() - 0.5) * W, -r() * H, (1 + r() * 3) * s, alpha('#ffffff', 0.55 * o.frost)); g.restore(); }
  // outline + ribs
  body(); g.strokeStyle = 'rgba(230,245,255,.7)'; g.lineWidth = 3 * s; g.stroke();
  g.strokeStyle = 'rgba(230,245,255,.35)'; g.lineWidth = 2 * s; for (const k of [0.18, 0.36]) { g.beginPath(); g.moveTo(-W / 2, -H * k); g.lineTo(W / 2, -H * k); g.stroke(); }
  // label band
  g.fillStyle = alpha('#e5466f', 0.85); g.fillRect(-W / 2, -H * 0.5, W, H * 0.12); circle(g, 0, -H * 0.44, 9 * s, '#fff');
  // ice mushroom out of the neck
  if (o.mush) { const m = o.mush; g.fillStyle = ICE; g.beginPath(); g.ellipse(0, -H - 10 * s * m, nW * 0.6, 34 * s * m, 0, 0, Math.PI * 2); g.fill(); g.fillStyle = 'rgba(255,255,255,.7)'; g.beginPath(); g.ellipse(-5 * s, -H - 18 * s * m, nW * 0.2, 10 * s * m, 0, 0, Math.PI * 2); g.fill(); }
  // cap
  if (!o.capOff) { const cy = -H - (o.mush ? 58 * s * o.mush : 0); rr(g, -nW / 2 - 4 * s, cy - 22 * s, nW + 8 * s, 24 * s, 5 * s); g.fillStyle = '#e5466f'; g.fill(); g.fillStyle = 'rgba(0,0,0,.2)'; for (let i = 0; i < 5; i++) g.fillRect(-nW / 2 + i * 9 * s, cy - 20 * s, 3 * s, 20 * s); }
  // crack
  if (o.crack) { const c = clamp(o.crack), r = rng(11); g.save(); g.strokeStyle = '#ffffff'; g.lineWidth = 3.5 * s; g.lineJoin = 'miter'; g.shadowColor = '#bff0ff'; g.shadowBlur = 12;
    let px = W * 0.12, py = -H * 0.3; g.beginPath(); g.moveTo(px, py); const n = Math.floor(10 * c); for (let i = 0; i < n; i++) { px += (r() - 0.5) * 40 * s; py -= 26 * s; g.lineTo(clamp(px, -W / 2, W / 2), py); } g.stroke();
    px = W * 0.12; py = -H * 0.3; g.beginPath(); g.moveTo(px, py); for (let i = 0; i < n * 0.7; i++) { px += (r() - 0.3) * 30 * s; py += 24 * s; g.lineTo(clamp(px, -W / 2, W / 2), Math.min(-4 * s, py)); } g.stroke();
    g.restore(); }
  g.restore();
  return { top: y - H, H, W };
}

// ice cube (iso-ish), centre (x,y), size r
export function iceCube(g, x, y, r, o = {}) {
  g.save(); g.translate(x, y); g.rotate(o.rot || 0);
  rr(g, -r, -r, r * 2, r * 2, r * 0.28); g.fillStyle = linGrad(g, -r, -r, r, r, [alpha('#f4fdff', 0.95), alpha(ICE, 0.85), alpha(ICE_D, 0.85)]); g.fill();
  g.strokeStyle = 'rgba(255,255,255,.9)'; g.lineWidth = r * 0.06; g.stroke();
  rr(g, -r * 0.62, -r * 0.62, r * 0.7, r * 0.34, r * 0.12); g.fillStyle = 'rgba(255,255,255,.65)'; g.fill();
  const rr2 = rng(o.seed || 5); for (let i = 0; i < 5; i++) circle(g, (rr2() - 0.3) * r, (rr2() - 0.2) * r, r * 0.06, 'rgba(255,255,255,.7)');
  g.restore();
}

// drinking glass, base centre (x,y), height h; water level wl 0..1 of h; drawFn(g, waterTopY) draws contents (clipped)
export function glass(g, x, y, h, wl = 0.6, drawFn) {
  const w = h * 0.62, wb = w * 0.82, top = y - h, wTop = y - h * wl;
  const path = () => { g.beginPath(); g.moveTo(x - w / 2, top); g.lineTo(x - wb / 2, y); g.lineTo(x + wb / 2, y); g.lineTo(x + w / 2, top); g.closePath(); };
  path(); g.fillStyle = 'rgba(210,235,255,.12)'; g.fill();
  g.save(); path(); g.clip();
  g.fillStyle = linGrad(g, 0, wTop, 0, y, [alpha('#6cc0f0', 0.55), alpha('#2a78c0', 0.7)]); g.fillRect(x - w, wTop, w * 2, y - wTop);
  drawFn?.(g, wTop);
  g.fillStyle = 'rgba(255,255,255,.7)'; g.fillRect(x - w, wTop - 2, w * 2, 4);
  g.restore();
  path(); g.strokeStyle = 'rgba(235,248,255,.8)'; g.lineWidth = 4; g.stroke();
  g.fillStyle = 'rgba(255,255,255,.3)'; g.fillRect(x - w * 0.36, top + h * 0.1, w * 0.07, h * 0.75);
  return { wTop, w, wb, top };
}

// H2O molecule (top view): O big, two H. angle a. colours from style.
export function molecule(g, x, y, r, a = 0, o = {}) {
  const ox = o.oColor || '#ff6f7f', hx = o.hColor || '#f4f8ff', al = o.alpha ?? 1;
  g.save(); g.globalAlpha *= al;
  const d = r * 1.05, spread = 0.91; // ~104.5°
  for (const s of [-1, 1]) { const ang = a + s * spread; const px = x + Math.cos(ang) * d, py = y + Math.sin(ang) * d; seg(g, [[x, y], [px, py]], r * 0.35, alpha('#ffffff', 0.35)); circle(g, px, py, r * 0.52, hx); circle(g, px - r * 0.14, py - r * 0.14, r * 0.16, 'rgba(255,255,255,.9)'); }
  circle(g, x, y, r, ox); circle(g, x - r * 0.3, y - r * 0.3, r * 0.3, 'rgba(255,255,255,.45)');
  if (o.glowC) glow(g, x, y, r * 2.6, o.glowC, 0.35);
  g.restore();
}

// fish (side view), centre x,y, length L, facing f
export function fish(g, x, y, L, f = 1, t = 0, o = {}) {
  const c = o.color || '#ff9a4a', w = Math.sin(t * 8 + (o.seed || 0)) * 0.25;
  g.save(); g.translate(x, y); g.scale(f, 1);
  g.fillStyle = c; g.beginPath(); g.ellipse(0, 0, L * 0.5, L * 0.22, 0, 0, Math.PI * 2); g.fill();
  g.save(); g.translate(-L * 0.45, 0); g.rotate(w); poly(g, [[0, 0], [-L * 0.3, -L * 0.2], [-L * 0.3, L * 0.2]], shade(c, -0.15)); g.restore();
  poly(g, [[-L * 0.05, -L * 0.18], [L * 0.12, -L * 0.34], [L * 0.2, -L * 0.16]], shade(c, -0.15));
  circle(g, L * 0.3, -L * 0.04, L * 0.06, '#fff'); circle(g, L * 0.32, -L * 0.04, L * 0.035, '#111');
  if (o.frozen) { rr(g, -L * 0.85, -L * 0.45, L * 1.5, L * 0.9, L * 0.12); g.fillStyle = alpha(ICE, 0.55); g.fill(); g.strokeStyle = 'rgba(255,255,255,.8)'; g.lineWidth = 3; g.stroke(); }
  g.restore();
}

// thermometer, bulb at (x,y), height h, value k 0..1
export function thermometer(g, x, y, h, k, o = {}) {
  const c = o.color || (k < 0.4 ? '#5fd0ff' : '#ff5a5a'), w = h * 0.09;
  rr(g, x - w, y - h, w * 2, h, w); g.fillStyle = 'rgba(255,255,255,.9)'; g.fill();
  rr(g, x - w * 0.45, y - h * (0.12 + 0.82 * k), w * 0.9, h * (0.12 + 0.82 * k), w * 0.45); g.fillStyle = c; g.fill();
  circle(g, x, y, w * 1.9, 'rgba(255,255,255,.9)'); circle(g, x, y, w * 1.5, c);
  for (let i = 1; i < 8; i++) seg(g, [[x + w, y - h * (0.1 + i * 0.105)], [x + w * 1.8, y - h * (0.1 + i * 0.105)]], 2, 'rgba(255,255,255,.7)');
}

// glowing icons (symbols only — the channel is wordless)
export function qmark(g, x, y, size, a = 1, color) { text(g, '?', x, y, { size, color: color || S().ui.gold, glow: 30, glowColor: alpha(color || S().ui.gold, 0.7), alpha: a, weight: 700 }); }
export function bulb(g, x, y, r, a = 1) {
  if (a <= 0) return; g.save(); g.globalAlpha *= a; glow(g, x, y, r * 4, '#ffe9a0', 0.6); circle(g, x, y, r, '#fff6c8'); rr(g, x - r * 0.45, y + r * 0.8, r * 0.9, r * 0.6, r * 0.15); g.fillStyle = '#c9c4b8'; g.fill();
  for (let i = 0; i < 8; i++) { const an = -Math.PI / 2 + (i - 3.5) * 0.4; seg(g, [[x + Math.cos(an) * r * 1.5, y + Math.sin(an) * r * 1.5], [x + Math.cos(an) * r * 2.1, y + Math.sin(an) * r * 2.1]], r * 0.14, '#ffe9a0'); }
  g.restore();
}
export function snowflake(g, x, y, r, col = '#e8fbff', w = 4, rot = 0) {
  for (let i = 0; i < 6; i++) { const a = rot + i * Math.PI / 3, ex = x + Math.cos(a) * r, ey = y + Math.sin(a) * r; seg(g, [[x, y], [ex, ey]], w, col);
    for (const k of [0.55]) { const bx = x + Math.cos(a) * r * k, by = y + Math.sin(a) * r * k; for (const s of [-1, 1]) seg(g, [[bx, by], [bx + Math.cos(a + s * 0.8) * r * 0.3, by + Math.sin(a + s * 0.8) * r * 0.3]], w * 0.8, col); } }
}
export function drop(g, x, y, r, col = '#5fc0ff') { g.fillStyle = col; g.beginPath(); g.moveTo(x, y - r * 1.6); g.bezierCurveTo(x + r * 0.2, y - r * 1.1, x + r, y - r * 0.4, x + r, y + r * 0.1); g.arc(x, y + r * 0.1, r, 0, Math.PI); g.bezierCurveTo(x - r, y - r * 0.4, x - r * 0.2, y - r * 1.1, x, y - r * 1.6); g.fill(); circle(g, x - r * 0.35, y - r * 0.05, r * 0.22, 'rgba(255,255,255,.6)'); }

// ucler. wordmark (brand) — Manrope 800, dot in accent pink
export function logo(g, x, y, size, a = 1, color = '#ffffff') {
  g.save(); g.globalAlpha *= a; g.font = `800 ${size}px Manrope`; g.textBaseline = 'middle'; g.textAlign = 'left';
  if ('letterSpacing' in g) g.letterSpacing = `${-size * 0.03}px`;
  const w1 = g.measureText('ucler').width, w2 = g.measureText('.').width, x0 = x - (w1 + w2) / 2;
  g.fillStyle = color; g.fillText('ucler', x0, y); g.fillStyle = '#e5466f'; g.fillText('.', x0 + w1, y); g.restore();
}

// magnifying glass, lens centre (x,y), radius r; inner(g) draws the magnified view (clipped)
export function magnifier(g, x, y, r, inner, ang = 0.8) {
  const hx = x + Math.cos(ang) * r * 1.05, hy = y + Math.sin(ang) * r * 1.05;
  seg(g, [[hx, hy], [hx + Math.cos(ang) * r * 1.1, hy + Math.sin(ang) * r * 1.1]], r * 0.2, '#2a1a14');
  g.save(); g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.clip(); inner?.(g); g.fillStyle = 'rgba(255,255,255,.08)'; g.fillRect(x - r, y - r, r * 2, r * 2); g.restore();
  ring(g, x, y, r, r * 0.1, '#c9a24a'); ring(g, x, y, r * 0.95, r * 0.03, 'rgba(255,255,255,.5)');
  g.save(); g.beginPath(); g.arc(x, y, r * 0.8, Math.PI * 1.1, Math.PI * 1.45); g.strokeStyle = 'rgba(255,255,255,.6)'; g.lineWidth = r * 0.06; g.stroke(); g.restore();
}

// breath vapour puffs from a point
export function breath(g, x, y, t, f = 1, a = 0.35) {
  for (let i = 0; i < 4; i++) { const ph = ((t * 0.6 + i / 4) % 1); circle(g, x + f * ph * 70, y - ph * 30, 6 + ph * 22, alpha('#ffffff', a * (1 - ph))); }
}
