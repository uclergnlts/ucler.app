// cast.js — ucler. YouTube recurring hero. Signature: mustard-yellow hoodie, dark-blue jeans, no hat.
// The hero is the same in every horizontal ucler. video (character "A · Çizgi").
export const HERO = { top: 'hoodie', color: '#f2c21a', head: 'none', legs: '#26324f' };
export const CAST = [HERO];

// brand font (Manrope, OFL) for the ucler. logo only
try {
  const ff = new FontFace('Manrope', 'url(/project/assets/manrope-latin-wght-normal.woff2)', { weight: '200 800' });
  await ff.load(); document.fonts.add(ff);
} catch (e) { console.log('manrope missing', e.message); }
