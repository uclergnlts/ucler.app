// sets/show.js — YT-03 Monty Hall: game-show studio, doors, goat, car, host, mail room, old computer, pigeon lab, 100-door corridor, garages.
import { E, V, layer, backdrop, ease, prog, clamp, lerp, rng, seg, circle, ring, rr, poly, glow, alpha, shade, mix, linGrad, radGrad, text } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';
import { hero } from '../hero.js';
export const GOLD = '#ffd95a', PINK = '#e5466f', CYAN = '#8fd8ff';
export const DOORC = ['#e5466f', '#3f8ff0', '#2fb37a'];

// a numbered door; open 0..1 swings it, inside(g, x, y, w, h) draws what is behind it
export function door(g, x, y, w, h, o = {}) {   // x,y = bottom centre
  const { n = 1, open = 0, color = DOORC[(n - 1) % 3], inside, glowC, frame = '#2a1e3a', label = true } = o;
  rr(g, x - w / 2 - 18, y - h - 18, w + 36, h + 18, 12); g.fillStyle = frame; g.fill();
  g.fillStyle = '#120c1c'; g.fillRect(x - w / 2, y - h, w, h);
  if (open > 0 && inside) { g.save(); g.beginPath(); g.rect(x - w / 2, y - h, w, h); g.clip(); inside(g, x, y, w, h); g.restore(); }
  if (open > 0 && glowC) glow(g, x, y - h * 0.4, w * 1.2, glowC, 0.35 * open);
  const dw = w * (1 - 0.86 * ease.inOut(open));   // door leaf swings toward the viewer (perspective squash)
  g.fillStyle = color; g.beginPath(); g.moveTo(x - w / 2, y - h); g.lineTo(x - w / 2 + dw, y - h - 14 * open); g.lineTo(x - w / 2 + dw, y + 14 * open); g.lineTo(x - w / 2, y); g.fill();
  if (dw > w * 0.3) {
    g.strokeStyle = alpha('#ffffff', 0.25); g.lineWidth = 4; for (const fy of [0.12, 0.55]) { rr(g, x - w / 2 + dw * 0.14, y - h + h * fy, dw * 0.72, h * 0.33, 8); g.stroke(); }
    circle(g, x - w / 2 + dw * 0.86, y - h * 0.48, Math.max(5, w * 0.04), GOLD);
    if (label) text(g, String(n), x - w / 2 + dw / 2, y - h * 0.82, { size: w * 0.34, font: 'Nunito', weight: 900, align: 'center', color: '#ffffff', stroke: 6, strokeColor: shade(color, -0.4) });
  }
  // bulb frame
  for (let i = 0; i < 9; i++) { const bx = x - w / 2 - 9 + (w + 18) * i / 8; circle(g, bx, y - h - 9, 6, alpha('#fff3c4', 0.5 + 0.5 * ((i + Math.floor(o.t * 6 || 0)) % 2))); }
}

// goat: side view, f = facing; chew 0..1; bleat 0..1 opens the mouth
export function goat(g, x, y, s = 1, o = {}) {
  const { f = 1, t = 0, bleat = 0, color = '#f2efe6', dark = '#bfb8a8' } = o; g.save(); g.translate(x, y); g.scale(f * s, s);
  const bob = Math.sin(t * 3) * 3;
  for (const lx of [-46, -26, 26, 44]) seg(g, [[lx, -40], [lx + Math.sin(t * 2 + lx) * 2, 0]], 9, dark);
  g.fillStyle = color; g.beginPath(); g.ellipse(0, -62, 64, 34, 0, 0, Math.PI * 2); g.fill();
  circle(g, -62, -76, 10, color); // tail
  // neck + head
  g.save(); g.translate(52, -86 + bob); g.rotate(-0.25);
  g.fillStyle = color; g.beginPath(); g.ellipse(18, -10, 30, 20, -0.2, 0, Math.PI * 2); g.fill();
  seg(g, [[6, -26], [-6, -52]], 7, '#8a7a62'); seg(g, [[16, -28], [10, -54]], 7, '#8a7a62');   // horns
  g.fillStyle = color; g.beginPath(); g.ellipse(-4, -18, 14, 7, -0.8, 0, Math.PI * 2); g.fill(); // ear
  circle(g, 22, -16, 5, '#1a1424'); circle(g, 23.5, -17.5, 1.6, '#ffffff');
  g.fillStyle = dark; g.beginPath(); g.moveTo(36, 4); g.lineTo(30, 26); g.lineTo(24, 4); g.fill();   // beard
  if (bleat > 0) { g.fillStyle = '#3a1a2a'; g.beginPath(); g.ellipse(44, 2, 6, 3 + 7 * bleat, 0, 0, Math.PI * 2); g.fill(); }
  g.restore(); g.restore();
}
// car: side view with shine
export function car(g, x, y, s = 1, o = {}) {
  const { color = '#e5466f', t = 0, shine = 1 } = o; g.save(); g.translate(x, y); g.scale(s, s);
  g.fillStyle = color; rr(g, -150, -70, 300, 50, 20); g.fill();
  g.beginPath(); g.moveTo(-90, -68); g.quadraticCurveTo(-60, -120, 0, -122); g.quadraticCurveTo(60, -120, 90, -68); g.fill();
  g.fillStyle = '#bfe6ff'; g.beginPath(); g.moveTo(-72, -72); g.quadraticCurveTo(-50, -110, -6, -112); g.lineTo(-6, -72); g.fill(); g.beginPath(); g.moveTo(6, -72); g.lineTo(6, -112); g.quadraticCurveTo(50, -110, 72, -72); g.fill();
  for (const wx of [-90, 90]) { circle(g, wx, -18, 30, '#1a1424'); circle(g, wx, -18, 13, '#cfd3e0'); }
  circle(g, 142, -52, 8, '#fff3c4'); seg(g, [[-140, -40], [140, -40]], 3, alpha('#ffffff', 0.35));
  if (shine) { const sx = -140 + ((t * 160) % 340); g.save(); g.globalAlpha = 0.5 * shine; seg(g, [[sx, -118], [sx - 30, -24]], 10, '#ffffff'); g.restore(); FX.sparkle(g, 60, -110, 16 + 6 * Math.sin(t * 6), '#ffffff', 0.9 * shine); }
  g.restore();
}
// host: hero rig in a dark suit with a bow tie (pass the hero options; facing etc.)
export const HOST = { top: 'suit', color: '#2a2440', head: 'none', legs: '#1a1630' };
export function host(g, o) { const h = hero(g, { ...o, outfit: HOST }); const [hx, hy, r] = h.head; const bx = hx - (o.facing ?? 1) * r * 0.1, by = hy + r * 1.35;
  poly(g, [[bx, by], [bx - 14 * (o.s ?? 1), by - 8 * (o.s ?? 1)], [bx - 14 * (o.s ?? 1), by + 8 * (o.s ?? 1)]], PINK); poly(g, [[bx, by], [bx + 14 * (o.s ?? 1), by - 8 * (o.s ?? 1)], [bx + 14 * (o.s ?? 1), by + 8 * (o.s ?? 1)]], PINK); circle(g, bx, by, 4 * (o.s ?? 1), shade(PINK, -0.3)); return h; }

// the TV studio: purple backdrop, sweeping spotlights, light-bulb arch, audience silhouettes, stage floor
export const SGY = () => E.H * 0.84;
export function studio(g, t, cam, o = {}) {
  layer(g, cam, 0.1, (g) => {
    backdrop(g, ['#1a0c2e', '#3a1650', '#5a1e5a']);
    for (let i = 0; i < 4; i++) { const a = Math.PI / 2 + 0.5 * Math.sin(t * 0.7 + i * 1.7); FX.lightCone(g, 200 + i * 520, -40, { angle: a, spread: 0.22, len: 1300, color: i % 2 ? '#ffd7f0' : '#c8e6ff', a: 0.12 }); }
    // curtain folds
    for (let x = -200; x < E.W + 200; x += 70) { g.fillStyle = alpha(x % 140 ? '#000000' : '#ffffff', 0.05); g.fillRect(x, 0, 35, E.H); }
  });
  layer(g, cam, 0.5, (g) => {
    // arch of bulbs + sign shape (no words)
    g.strokeStyle = alpha(GOLD, 0.35); g.lineWidth = 10; g.beginPath(); g.ellipse(E.W / 2, E.H * 0.62, E.W * 0.46, E.H * 0.5, 0, Math.PI, Math.PI * 2); g.stroke();
    for (let i = 0; i <= 30; i++) { const a = Math.PI + Math.PI * i / 30; circle(g, E.W / 2 + Math.cos(a) * E.W * 0.46, E.H * 0.62 + Math.sin(a) * E.H * 0.5, 9, alpha('#fff3c4', 0.35 + 0.65 * ((i + Math.floor(t * 5)) % 3 === 0))); }
  });
  layer(g, cam, 1, (g) => {
    g.fillStyle = linGrad(g, 0, SGY() - 40, 0, E.H, ['#4a2a5a', '#24142e']); g.fillRect(-E.W, SGY() - 40, E.W * 3, E.H);
    g.strokeStyle = alpha('#ffd95a', 0.35); g.lineWidth = 4; g.beginPath(); g.moveTo(-E.W, SGY() - 40); g.lineTo(E.W * 2, SGY() - 40); g.stroke();
    FX.pool(g, E.W / 2, SGY(), 700, 70, '#ffd7f0', 0.18);
  });
  if (o.audience !== false) layer(g, cam, 1.25, (g) => { const r = rng(21); for (let i = 0; i < 26; i++) { const x = -100 + i * 85 + r() * 30, y = E.H + 40 + r() * 30, cl = o.cheer ? Math.abs(Math.sin(t * 8 + i)) * 26 : Math.sin(t * 2 + i) * 4;
    circle(g, x, y - 120 - cl, 34, '#0e0816'); g.fillStyle = '#0e0816'; g.beginPath(); g.ellipse(x, y - 40 - cl, 52, 70, 0, 0, Math.PI * 2); g.fill();
    if (o.cheer) { seg(g, [[x - 30, y - 70 - cl], [x - 50, y - 150 - cl * 2]], 14, '#0e0816'); seg(g, [[x + 30, y - 70 - cl], [x + 50, y - 150 - cl * 2]], 14, '#0e0816'); }
    if (o.signs && i % 4 === 1) { rr(g, x - 60, y - 230 - cl, 120, 70, 6); g.fillStyle = '#f4efe6'; g.fill(); text(g, o.signs, x, y - 195 - cl, { size: 38, font: 'Nunito', weight: 900, align: 'center', color: '#2a1e3a' }); } } });
}
// envelopes flying / piled
export function envelope(g, x, y, s = 1, rot = 0, color = '#f4efe6') { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); rr(g, -40, -26, 80, 52, 4); g.fillStyle = color; g.fill(); g.strokeStyle = alpha('#2a1e3a', 0.4); g.lineWidth = 3; g.beginPath(); g.moveTo(-40, -26); g.lineTo(0, 4); g.lineTo(40, -26); g.stroke(); circle(g, 26, -12, 6, alpha(PINK, 0.8)); g.restore(); }
export function letterRain(g, t, o = {}) { const { count = 40, seed = 3, speed = 260, area = [0, -100, E.W, E.H] } = o, r = rng(seed); for (let i = 0; i < count; i++) { const x = area[0] + r() * area[2], y = area[1] + ((r() * area[3] + t * speed * (0.6 + r() * 0.8)) % (area[3] + 120)) - 60; envelope(g, x + Math.sin(t * 2 + i) * 30, y, 0.6 + r() * 0.6, Math.sin(t * 3 + i) * 0.6); } }
// retro computer with a counter on screen
export function oldComputer(g, x, y, s = 1, screenFn) { g.save(); g.translate(x, y); g.scale(s, s);
  rr(g, -150, -260, 300, 230, 20); g.fillStyle = '#d8d0b8'; g.fill(); rr(g, -120, -235, 240, 170, 10); g.fillStyle = '#0a1a10'; g.fill();
  if (screenFn) { g.save(); g.beginPath(); g.rect(-120, -235, 240, 170); g.clip(); screenFn(g, -120, -235, 240, 170); g.restore(); }
  glow(g, 0, -150, 180, '#5fffa0', 0.12); rr(g, -60, -30, 120, 30, 6); g.fillStyle = '#bfb8a0'; g.fill(); rr(g, -170, 0, 340, 40, 8); g.fillStyle = '#cfc6ac'; g.fill();
  for (let i = 0; i < 12; i++) rr(g, -155 + i * 26, 8, 20, 12, 3), g.fillStyle = '#a89e84', g.fill(); g.restore(); }
// pigeon: side view
export function pigeon(g, x, y, s = 1, o = {}) { const { f = 1, t = 0, peck = 0 } = o; g.save(); g.translate(x, y); g.scale(f * s, s);
  g.fillStyle = '#8a92a8'; g.beginPath(); g.ellipse(0, -40, 40, 26, -0.15, 0, Math.PI * 2); g.fill(); poly(g, [[-30, -46], [-70, -30], [-34, -30]], '#5a6278');
  const hy = -70 + peck * 30, hx = 30 + peck * 10; g.fillStyle = '#6a7290'; circle(g, hx, hy, 17, '#6a7290'); g.fillStyle = alpha('#5fc8a0', 0.8); g.beginPath(); g.ellipse(18, -54, 12, 10, 0, 0, Math.PI * 2); g.fill();
  circle(g, hx + 6, hy - 4, 4, '#1a1424'); circle(g, hx + 6, hy - 4, 1.5, '#ff8a3a'); poly(g, [[hx + 14, hy], [hx + 28, hy + 4], [hx + 14, hy + 6]], '#d8a070');
  seg(g, [[-6, -16], [-8, 0]], 4, '#e0806a'); seg(g, [[8, -16], [10, 0]], 4, '#e0806a'); g.restore(); }
// garage with a roll-up door; fill 0..1 stacks goats or cars inside
export function garage(g, x, y, w, h, o = {}) { const { color = '#3a3450', open = 1 } = o;
  poly(g, [[x - w / 2 - 30, y - h], [x, y - h - 90], [x + w / 2 + 30, y - h]], shade(color, -0.2)); g.fillStyle = color; g.fillRect(x - w / 2 - 20, y - h, w + 40, h);
  g.fillStyle = '#120c1c'; g.fillRect(x - w / 2, y - h + 30, w, h - 30);
  if (o.inside) { g.save(); g.beginPath(); g.rect(x - w / 2, y - h + 30, w, h - 30); g.clip(); o.inside(g); g.restore(); }
  const dh = (h - 30) * (1 - open); g.fillStyle = '#8a84a8'; g.fillRect(x - w / 2, y - h + 30, w, dh); for (let yy = y - h + 40; yy < y - h + 30 + dh; yy += 22) seg(g, [[x - w / 2, yy], [x + w / 2, yy]], 2, alpha('#000000', 0.2)); }

// ---- extra props for the full script ----
export function cap(g, h, s = 1, color = '#1a1424') {   // mortarboard on a hero head
  const [x, y, r] = h.head; poly(g, [[x - r * 1.5, y - r * 0.85], [x, y - r * 1.35], [x + r * 1.5, y - r * 0.85], [x, y - r * 0.45]], color);
  g.fillStyle = color; g.fillRect(x - r * 0.75, y - r * 0.85, r * 1.5, r * 0.45); seg(g, [[x + r * 0.2, y - r * 0.9], [x + r * 1.1, y - r * 0.4]], 3 * s, GOLD); circle(g, x + r * 1.1, y - r * 0.35, 4 * s, GOLD);
}
export function glasses(g, h, f = 1) { const [x, y, r] = h.head; g.strokeStyle = '#e9dcc0'; g.lineWidth = r * 0.07; for (const u of [0.08, 0.66]) { g.beginPath(); g.arc(x + f * u * r, y - r * 0.16, r * 0.2, 0, Math.PI * 2); g.stroke(); } }
export function typewriter(g, x, y, s = 1, t = 0, paper = null) { g.save(); g.translate(x, y); g.scale(s, s);
  if (paper !== null) { rr(g, -90, -250 - paper * 60, 180, 200, 4); g.fillStyle = '#f4efe6'; g.fill(); for (let i = 0; i < 6; i++) seg(g, [[-70, -230 - paper * 60 + i * 22], [-70 + 140 * Math.min(1, Math.max(0, paper * 6 - i)), -230 - paper * 60 + i * 22]], 4, alpha('#2a1e3a', 0.5)); }
  rr(g, -150, -110, 300, 110, 22); g.fillStyle = '#2a3a4a'; g.fill(); rr(g, -170, -130, 340, 34, 12); g.fillStyle = '#1a2430'; g.fill();
  for (let r = 0; r < 3; r++) for (let i = 0; i < 9; i++) { const dn = Math.floor(t * 14) % 27 === r * 9 + i ? 4 : 0; circle(g, -112 + i * 28 + r * 8, -70 + r * 24 + dn, 10, '#e8e4d8'); } g.restore(); }
export function magazine(g, x, y, w, h, o = {}) {   // open magazine page: column lines, a three-door drawing and a "?"
  g.save(); g.translate(x, y); g.rotate(o.rot || 0); rr(g, -w / 2, -h / 2, w, h, 6); g.fillStyle = '#f6f1e4'; g.fill(); rr(g, -w / 2, -h / 2, w, h * 0.12, 6); g.fillStyle = PINK; g.fill();
  for (let i = 0; i < 14; i++) seg(g, [[-w * 0.44, -h * 0.3 + i * h * 0.05], [-w * 0.05, -h * 0.3 + i * h * 0.05]], 4, alpha('#2a1e3a', 0.35));
  for (let k = 0; k < 3; k++) { rr(g, w * 0.05 + k * w * 0.13, -h * 0.25, w * 0.1, h * 0.22, 4); g.fillStyle = DOORC[k]; g.fill(); }
  text(g, o.mark ?? '?', w * 0.25, h * 0.2, { size: h * 0.18, font: 'Nunito', weight: 900, align: 'center', color: '#2a1e3a' }); g.restore(); }
export function stamp(g, x, y, str, k, color = PINK, size = 120) { if (k <= 0) return; const sc = 1 + 2 * (1 - ease.out(Math.min(1, k * 1.6))); g.save(); g.translate(x, y); g.rotate(-0.15); g.scale(sc, sc); g.globalAlpha *= Math.min(1, k * 2);
  rr(g, -size * 1.1, -size * 0.6, size * 2.2, size * 1.2, 16); g.strokeStyle = color; g.lineWidth = 10; g.stroke(); text(g, str, 0, size * 0.05, { size, font: 'Nunito', weight: 900, align: 'center', color }); g.restore(); }
export function check(g, x, y, s, k = 1, color = '#3fd07a') { if (k <= 0) return; g.strokeStyle = color; g.lineWidth = 14 * s; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); g.moveTo(x - 40 * s, y); const a = Math.min(1, k * 2); g.lineTo(x - 40 * s + 30 * s * a, y + 30 * s * a); if (k > 0.5) g.lineTo(x - 10 * s + 60 * s * (k - 0.5) * 2, y + 30 * s - 80 * s * (k - 0.5) * 2); g.stroke(); }
export function cross(g, x, y, s, k = 1, color = PINK) { if (k <= 0) return; g.strokeStyle = color; g.lineWidth = 16 * s; g.lineCap = 'round'; const a = Math.min(1, k * 2), b = Math.max(0, k * 2 - 1); seg(g, [[x - 40 * s, y - 40 * s], [x - 40 * s + 80 * s * a, y - 40 * s + 80 * s * a]], 16 * s, color); if (b > 0) seg(g, [[x + 40 * s, y - 40 * s], [x + 40 * s - 80 * s * b, y - 40 * s + 80 * s * b]], 16 * s, color); }
export function pauseIcon(g, x, y, s, a = 1) { if (a <= 0) return; g.save(); g.globalAlpha *= a; circle(g, x, y, 110 * s, alpha('#000000', 0.45)); ring(g, x, y, 110 * s, 8 * s, '#ffffff'); rr(g, x - 45 * s, y - 55 * s, 30 * s, 110 * s, 8 * s); g.fillStyle = '#ffffff'; g.fill(); rr(g, x + 15 * s, y - 55 * s, 30 * s, 110 * s, 8 * s); g.fill(); g.restore(); }
// probability "bubble": a glowing liquid blob with a value label
export function blob(g, x, y, r, str, color = GOLD, t = 0) { if (r <= 1) return; glow(g, x, y, r * 2.2, color, 0.35); g.fillStyle = alpha(color, 0.85); g.beginPath();
  for (let i = 0; i <= 24; i++) { const a = i / 24 * Math.PI * 2, rr_ = r * (1 + 0.06 * Math.sin(a * 3 + t * 4)); const px = x + Math.cos(a) * rr_, py = y + Math.sin(a) * rr_; i ? g.lineTo(px, py) : g.moveTo(px, py); } g.fill();
  if (str && r > 26) text(g, str, x, y + r * 0.12, { size: Math.min(r * 0.7, 96), font: 'Nunito', weight: 900, align: 'center', color: '#1a1424' }); }
export function palm(g, x, y, s = 1, t = 0) { g.strokeStyle = '#5a3a2a'; g.lineWidth = 16 * s; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 30 * s, y - 200 * s, x + 10 * s, y - 360 * s); g.stroke();
  for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i - 2.5) * 0.55 + Math.sin(t * 1.5 + i) * 0.05; g.strokeStyle = '#2f8a4a'; g.lineWidth = 14 * s; g.beginPath(); g.moveTo(x + 10 * s, y - 360 * s); g.quadraticCurveTo(x + 10 * s + Math.cos(a) * 90 * s, y - 360 * s + Math.sin(a) * 90 * s - 30 * s, x + 10 * s + Math.cos(a) * 170 * s, y - 360 * s + Math.sin(a) * 170 * s + 60 * s); g.stroke(); } }
export function cup(g, x, y, s = 1, color = '#e8e4d8') { poly(g, [[x - 40 * s, y], [x + 40 * s, y], [x + 30 * s, y - 70 * s], [x - 30 * s, y - 70 * s]], color); seg(g, [[x - 30 * s, y - 70 * s], [x + 30 * s, y - 70 * s]], 6 * s, shade(color, -0.2)); }
export function cash(g, x, y, s = 1, rot = 0) { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); for (let i = 0; i < 5; i++) { rr(g, -60, -30 - i * 6, 120, 56, 6); g.fillStyle = i % 2 ? '#5aa86a' : '#6abe7a'; g.fill(); } rr(g, -8, -60, 16, 60, 2); g.fillStyle = '#e8d8a0'; g.fill(); circle(g, 0, -28, 14, alpha('#2a5a3a', 0.6)); g.restore(); }
export function bill(g, x, y, s = 1, rot = 0) { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); rr(g, -50, -24, 100, 48, 5); g.fillStyle = '#6abe7a'; g.fill(); circle(g, 0, 0, 12, alpha('#2a5a3a', 0.6)); g.restore(); }
export function chalkboard(g, x, y, w, h, draw) { rr(g, x - 14, y - 14, w + 28, h + 28, 10); g.fillStyle = '#6a4a2a'; g.fill(); g.fillStyle = '#23402f'; g.fillRect(x, y, w, h); if (draw) { g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); draw(g); g.restore(); } }
export function desk(g, x, y, w = 260, color = '#6a4a3a') { rr(g, x - w / 2, y - 100, w, 22, 6); g.fillStyle = color; g.fill(); seg(g, [[x - w / 2 + 20, y - 80], [x - w / 2 + 20, y]], 10, shade(color, -0.3)); seg(g, [[x + w / 2 - 20, y - 80], [x + w / 2 - 20, y]], 10, shade(color, -0.3)); }
export const WOMAN = { top: 'dress', color: '#6a4a8a', head: 'bun', legs: null };
export const PROF = { top: 'suit', color: '#3a3a52', head: 'none', legs: '#22223a' };

// ---- room helpers for the full shot list ----
export function room(g, top, bot, floorY = E.H * 0.82, floor = '#2a1e28') { g.fillStyle = linGrad(g, 0, 0, 0, E.H, [top, bot]); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); g.fillStyle = floor; g.fillRect(-E.W, floorY, E.W * 3, E.H * 2); seg(g, [[-E.W, floorY], [E.W * 2, floorY]], 4, alpha('#000000', 0.25)); }
export function win(g, x, y, w, h, sky = ['#0a0e26', '#22204a'], o = {}) { rr(g, x - 12, y - 12, w + 24, h + 24, 8); g.fillStyle = o.frame || '#3a2a30'; g.fill(); g.fillStyle = linGrad(g, 0, y, 0, y + h, sky); g.fillRect(x, y, w, h);
  if (o.moon) { g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); FX.moon(g, x + w * 0.7, y + h * 0.3, h * 0.12); FX.stars(g, o.t || 0, { count: 30 }); g.restore(); }
  if (o.sun) { g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); FX.sun(g, x + w * 0.7, y + h * 0.35, h * 0.12); g.restore(); }
  seg(g, [[x + w / 2, y], [x + w / 2, y + h]], 8, o.frame || '#3a2a30'); seg(g, [[x, y + h / 2], [x + w, y + h / 2]], 8, o.frame || '#3a2a30'); }
export function lamp(g, x, y, s = 1, on = 1) { seg(g, [[x, y], [x + 30 * s, y - 120 * s], [x - 20 * s, y - 190 * s]], 8 * s, '#2a2a34'); poly(g, [[x - 60 * s, y - 170 * s], [x + 10 * s, y - 220 * s], [x + 30 * s, y - 180 * s]], '#3fb37a');
  if (on) { g.save(); g.globalCompositeOperation = 'lighter'; poly(g, [[x - 40 * s, y - 180 * s], [x + 20 * s, y - 195 * s], [x + 160 * s, y + 10 * s], [x - 200 * s, y + 10 * s]], alpha('#fff3c4', 0.10 * on)); g.restore(); glow(g, x - 10 * s, y - 185 * s, 60 * s, '#fff3c4', 0.6 * on); } }
export function podium(g, x, y, s = 1, color = PINK) { poly(g, [[x - 110 * s, y], [x + 110 * s, y], [x + 90 * s, y - 190 * s], [x - 90 * s, y - 190 * s]], color); rr(g, x - 110 * s, y - 210 * s, 220 * s, 26 * s, 8 * s); g.fillStyle = shade(color, -0.3); g.fill();
  for (let i = 0; i < 5; i++) circle(g, x - 60 * s + i * 30 * s, y - 120 * s, 7 * s, alpha('#fff3c4', 0.8)); }
export function mic(g, x, y, s = 1, rot = 0) { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); rr(g, -8, -10, 16, 90, 6); g.fillStyle = '#2a2a34'; g.fill(); circle(g, 0, -24, 22, '#cfd3e0'); for (let i = -2; i <= 2; i++) seg(g, [[-18, -24 + i * 7], [18, -24 + i * 7]], 2, alpha('#6a6a7a', 0.6)); g.restore(); }
export function card(g, x, y, s = 1, rot = 0, mark = null) { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); rr(g, -50, -34, 100, 68, 6); g.fillStyle = '#f4efe6'; g.fill(); if (mark !== null) for (let k = 0; k < 3; k++) { rr(g, -38 + k * 28, -20, 20, 32, 3); g.fillStyle = k === mark ? GOLD : alpha('#2a1e3a', 0.4); g.fill(); } g.restore(); }
export function burp(g, x, y, k) { if (k <= 0 || k >= 1) return; const a = Math.sin(k * Math.PI); for (let i = 0; i < 4; i++) circle(g, x + i * 26 * k * 2, y - i * 18 * k * 2, (18 + i * 8) * (0.4 + k), alpha('#9ad86a', 0.45 * a)); }
export function chair2(g, x, y, s = 1, color = '#3a2a30', f = 1) { rr(g, x - 50 * s, y - 92 * s, 100 * s, 18 * s, 5 * s); g.fillStyle = color; g.fill(); seg(g, [[x - 40 * s, y - 80 * s], [x - 40 * s, y]], 8 * s, color); seg(g, [[x + 40 * s, y - 80 * s], [x + 40 * s, y]], 8 * s, color); seg(g, [[x - f * 44 * s, y - 90 * s], [x - f * 48 * s, y - 220 * s]], 10 * s, color); }
export function papers(g, x, y, n, s = 1, seed = 1) { const r = rng(seed); for (let i = 0; i < n; i++) { rr(g, x - 50 * s + (r() - 0.5) * 10 * s, y - (i + 1) * 9 * s, 100 * s, 8 * s, 2); g.fillStyle = i % 3 ? '#f4efe6' : '#e6dcc4'; g.fill(); } }
export function calPage(g, x, y, s, str, rot = 0, a = 1) { if (a <= 0) return; g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); g.globalAlpha *= a; rr(g, -90, -110, 180, 220, 10); g.fillStyle = '#f4efe6'; g.fill(); rr(g, -90, -110, 180, 50, 10); g.fillStyle = PINK; g.fill(); for (const cx of [-50, 50]) circle(g, cx, -110, 8, '#2a1e3a');
  text(g, str, 0, 40, { size: 96, font: 'Nunito', weight: 900, align: 'center', color: '#2a1e3a' }); g.restore(); }
export function note(g, x, y, s = 1, color = '#ffffff') { circle(g, x, y, 12 * s, color); seg(g, [[x + 10 * s, y], [x + 10 * s, y - 50 * s], [x + 30 * s, y - 40 * s]], 5 * s, color); }
export const REPORTER = { top: 'tshirt', color: '#5a7a9a', head: 'capBack', legs: '#2a3448' };
export const STUDENT = { top: 'hoodie', color: '#5aa0c8', head: 'none', legs: '#2a3448' };
export const MAILMAN = { top: 'tshirt', color: '#3a6ab0', head: 'capBack', legs: '#26324f' };
