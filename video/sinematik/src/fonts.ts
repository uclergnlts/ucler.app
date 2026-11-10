import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';

// Manrope (variable, OFL): ucler'in başlık yazı tipi. Yerel dosyadan yüklenir; render ağa bağlı kalmaz.
export const fontFamily = 'Manrope';

loadFont({
  family: fontFamily,
  url: staticFile('fonts/manrope-latin-ext-wght-normal.woff2'),
  weight: '200 800',
  unicodeRange: 'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF',
});
loadFont({ family: fontFamily, url: staticFile('fonts/manrope-latin-wght-normal.woff2'), weight: '200 800' });

// Shorts için sabit 800 kalınlıkta, üst üste binen kontürleri birleştirilmiş Manrope.
// Değişken yazı tipinde dış çizgi (stroke) harflerin içindeki kesişimleri gösteriyordu (A, K, R).
export const fontDuz = 'Manrope Duz';
loadFont({ family: fontDuz, url: staticFile('fonts/manrope-800-duz.woff2'), weight: '800' });
loadFont({
  family: fontDuz,
  url: staticFile('fonts/manrope-800-duz-ext.woff2'),
  weight: '800',
  unicodeRange: 'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF',
});
