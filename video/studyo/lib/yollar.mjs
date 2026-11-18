import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

export const STUDYO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const DEPO = path.resolve(STUDYO, '..', '..');
// Kurgu, sahneler, metinler ve notlar depoda (küçük, sürüm takibi yapılır).
export const PROJELER = path.join(STUDYO, 'projeler');
// Ham çekimler, önizleme kopyaları ve çıktılar depo dışında (büyük dosyalar).
export const MEDYA = process.env.STUDYO_MEDYA || path.join(os.homedir(), 'Movies', 'ucler-studyo');
export const MODEL = process.env.WHISPER_MODEL || path.join(MEDYA, '_modeller', 'ggml-large-v3-turbo-q5_0.bin');

export const VIDEO_UZANTI = /\.(mov|mp4|m4v|hevc)$/i;

export function proje(ad) {
  if (!/^[a-z0-9][a-z0-9-]{0,60}$/.test(ad)) throw new Error('Geçersiz proje adı: ' + ad);
  const p = {
    ad,
    kok: path.join(PROJELER, ad),
    kurgu: path.join(PROJELER, ad, 'kurgu.json'),
    notlar: path.join(PROJELER, ad, 'notlar.json'),
    sahneler: path.join(PROJELER, ad, 'sahneler'),
    metin: path.join(PROJELER, ad, 'metin'),
    medya: path.join(MEDYA, ad),
    ham: path.join(MEDYA, ad, 'ham'),
    vekil: path.join(MEDYA, ad, 'vekil'),
    cikti: path.join(MEDYA, ad, 'cikti'),
    muzik: path.join(MEDYA, ad, 'muzik'),
    gecici: path.join(MEDYA, ad, 'gecici'),
  };
  return p;
}

export function projeKur(ad, baslik) {
  const p = proje(ad);
  for (const d of [p.sahneler, p.metin, p.ham, p.vekil, p.cikti, p.muzik, p.gecici]) fs.mkdirSync(d, { recursive: true });
  if (!fs.existsSync(p.kurgu)) yazJson(p.kurgu, {
    baslik: baslik || ad, konusmaDili: 'tr', fps: 30,
    klipler: [], sahneler: [],
    altyazi: { acik: true },
    muzik: null,
  });
  if (!fs.existsSync(p.notlar)) yazJson(p.notlar, []);
  return p;
}

export function okuJson(f, varsayilan) {
  try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return varsayilan; }
}
export function yazJson(f, v) {
  const gec = f + '.tmp';
  fs.writeFileSync(gec, JSON.stringify(v, null, 2) + '\n');
  fs.renameSync(gec, f);
}
export function projeListesi() {
  if (!fs.existsSync(PROJELER)) return [];
  return fs.readdirSync(PROJELER).filter(d => fs.existsSync(path.join(PROJELER, d, 'kurgu.json')));
}
