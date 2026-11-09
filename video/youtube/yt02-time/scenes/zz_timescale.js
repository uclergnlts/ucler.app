// zz_timescale.js — loaded last: shots with params.tscale > 1 play slower (stretched to fit the narration).
import { E, getShot, registerShot } from '/engine/core.js';
for (const s of E.shots) {
  const k = s.params?.tscale, def = getShot(s.id);
  if (k && k !== 1 && def && !def._scaled) registerShot(s.id, { ...def, _scaled: true, draw: (g, t, info) => def.draw(g, t / k, info) });
}
