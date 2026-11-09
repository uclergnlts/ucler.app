// wrap.js — 9:16 Shorts from the 16:9 YT-02 shots (same method as YT-01: params { src, cx: [[t, x], ...] }).
import { E, registerShot, getShot, key, ease, prog, glow, alpha, linGrad, rng } from '/engine/core.js';
import { POSES, posesAt } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import '/projects/yt02-time/scenes/shots/01_hook.js';
import '/projects/yt02-time/scenes/shots/02_light.js';
import '/projects/yt02-time/scenes/shots/03_twin.js';
import '/projects/yt02-time/scenes/shots/04_gravity.js';
import '/projects/yt02-time/scenes/shots/05_gps.js';
import '/projects/yt02-time/scenes/shots/06_end.js';
import { hero } from '/projects/yt02-time/scenes/hero.js';
import { logo, qmark } from '/projects/yt02-time/scenes/props.js';

const LW = 1920, LH = 1080;
function reframe(g, t, info, src, cxKeys) {
  const def = getShot(src); if (!def) return;
  const s = E.H / LH, cx = key(t, cxKeys, ease.inOut), half = E.W / 2 / s;
  const keep = { W: E.W, H: E.H, vertical: E.vertical };
  Object.assign(E, { W: LW, H: LH, vertical: false, crop: [cx - half, cx + half] });
  g.save();
  try { g.translate(keep.W / 2, 0); g.scale(s, s); g.translate(-cx, 0); def.draw(g, t, info); }
  finally { g.restore(); Object.assign(E, keep, { crop: null }); }
}
function endv(g, t) {
  g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#0c1230', '#1c1a44', '#2a1e48']); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
  glow(g, E.W * 0.5, E.H * 0.85, 700, '#ffb070', 0.2); glow(g, E.W * 0.5, E.H * 0.2, 700, '#5fc0ff', 0.14);
  FX.stars(g, t, { count: 160 });
  logo(g, E.W / 2, 420, 150, ease.out(prog(t, 0.1, 0.6)));
  const pose = posesAt(t, [[0, POSES.relaxed], [0.3, POSES.wave]]); if (t > 0.3) pose.hF = [pose.hF[0] + Math.sin(t * 9) * 10, pose.hF[1]];
  hero(g, { x: E.W / 2 - 80, y: E.H - 300, s: 3.4, facing: 1, t, pose, expr: 'happy', rim: { color: '#ffc68a', dir: [-0.6, -0.8], w: 5 } });
  const q = ease.outBack(prog(t, 0.5, 0.9)); if (q > 0) { g.save(); g.translate(E.W / 2 + 300, E.H - 1150); g.scale(q, q); qmark(g, 0, 0, 220); g.restore(); }
}
for (const s of E.shots) {
  const p = s.params || {};
  if (p.src === 'endv') registerShot(s.id, { draw: (g, t) => endv(g, t) });
  else if (p.src) registerShot(s.id, { draw: (g, t, info) => reframe(g, t, info, p.src, p.cx || [[0, 960]]) });
}
