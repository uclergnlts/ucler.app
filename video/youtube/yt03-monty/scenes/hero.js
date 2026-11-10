// hero.js — helpers to draw the hero and find his hands in world space.
import { drawFigure, POSES, breathe } from '/engine/rig2d.js';
import { HERO } from './cast.js';
import { E } from '/engine/core.js';
// corner anchors that stay on screen when a 9:16 wrapper re-frames the 16:9 shot (E.crop = [x0, x1])
export const rightX = (d) => (E.crop ? E.crop[1] - Math.min(d, 130) : E.W - d);
export const leftX = (d) => (E.crop ? E.crop[0] + Math.min(d, 130) : d);

// hero(g, {x, y, s, facing, pose, expr, look, rim, blink, t}) -> { hand: [x,y], handB: [x,y], head: [x,y,r] }
export function hero(g, o) {
  const p = o.t != null && o.breathe !== false ? breathe(o.pose || POSES.stand, o.t) : (o.pose || POSES.stand);
  const f = o.facing ?? 1, s = o.s ?? 1;
  drawFigure(g, { outfit: HERO, shadow: true, ...o, pose: p, blink: o.blink ?? (o.t != null && (o.t % 3.1) > 3.0) });
  const w = (q) => [o.x + q[0] * f * s, o.y + q[1] * s];
  return { hand: w(p.hF), handB: w(p.hB), head: [...w(p.head), 26 * s], p };
}
export const P = (base, patch) => ({ ...(typeof base === 'string' ? POSES[base] : base), ...patch });
