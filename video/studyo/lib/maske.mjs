// Arka plan değiştirme: kişi maskesi (Apple Vision) ve arka planı değiştirilmiş önizleme kopyası.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import { STUDYO, proje, okuJson, SES_UZANTI } from './yollar.mjs';
import { calistir } from './isle.mjs';
import { arkaFfmpeg } from '../public/motor.js';

const ARAC = path.join(STUDYO, 'arac', 'kisi-maske');
const MW = 960, MH = 540;

async function aracHazir() {
  const kaynak = ARAC + '.swift';
  if (fs.existsSync(ARAC) && fs.statSync(ARAC).mtimeMs >= fs.statSync(kaynak).mtimeMs) return;
  await calistir('swiftc', ['-O', kaynak, '-o', ARAC]);
}

export const maskeYolu = (ad, dosya) => path.join(proje(ad).medya, 'maske', path.parse(dosya).name + '.mp4');
export const arkaAnahtar = arka => crypto.createHash('md5').update(JSON.stringify(arka)).digest('hex').slice(0, 8);
export const arkaVekilAdi = (dosya, arka) => `${path.parse(dosya).name}.arka-${arkaAnahtar(arka)}.mp4`;

export async function maskeUret(ad, dosya) {
  const hedef = maskeYolu(ad, dosya);
  if (fs.existsSync(hedef)) return hedef;
  await aracHazir();
  fs.mkdirSync(path.dirname(hedef), { recursive: true });
  const p = proje(ad);
  const bilgi = okuJson(path.join(p.metin, dosya + '.json'), {}).bilgi || {};
  const fps = bilgi.fps || 30;
  const gec = hedef + '.yarim.mp4';
  await new Promise((ok, no) => {
    const m = spawn(ARAC, [path.join(p.ham, dosya), String(MW), String(MH), 'dogru'], { stdio: ['ignore', 'pipe', 'pipe'] });
    const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'rawvideo', '-pix_fmt', 'gray', '-s', `${MW}x${MH}`, '-r', String(fps), '-i', 'pipe:0',
      '-c:v', 'h264_videotoolbox', '-b:v', '6M', '-pix_fmt', 'yuv420p', gec], { stdio: ['pipe', 'ignore', 'pipe'] });
    let hata = '';
    m.stderr.on('data', d => hata += d); ff.stderr.on('data', d => hata += d);
    m.stdout.pipe(ff.stdin);
    let kalan = 2; const bitti = c => { if (c !== 0) no(new Error('maske: ' + hata.slice(-1000))); else if (--kalan === 0) ok(); };
    m.on('close', bitti); ff.on('close', bitti);
  });
  fs.renameSync(gec, hedef);
  return hedef;
}

// Önizleme için arka planı değiştirilmiş 720p kopya
export async function arkaVekilUret(ad, dosya, arka) {
  const p = proje(ad);
  const hedef = path.join(p.vekil, arkaVekilAdi(dosya, arka));
  if (fs.existsSync(hedef)) return hedef;
  const maske = await maskeUret(ad, dosya);
  const girdiler = ['-i', path.join(p.vekil, path.parse(dosya).name + '.mp4'), '-i', maske];
  if (arka.tur === 'resim') girdiler.push('-loop', '1', '-i', path.join(p.medya, 'arka', arka.dosya));
  const gec = hedef + '.yarim.mp4';
  await calistir('ffmpeg', ['-y', '-v', 'error', ...girdiler, '-filter_complex',
    `[0:v]scale=1280:720,format=yuv420p[y];` + arkaFfmpeg(arka, 1280, 720, 'y', '1:v', '2:v') + '[v]',
    '-map', '[v]', '-map', '0:a?', '-c:v', 'h264_videotoolbox', '-b:v', '5M', '-g', '15', '-c:a', 'copy', '-movflags', '+faststart', gec]);
  fs.renameSync(gec, hedef);
  return hedef;
}

// Kurgudaki tüm klipler için (arka plan açıksa) maske + önizleme kopyası; sırayla, arka planda
const durum = new Map(); // ad/dosya -> aşama
let kuyruk = Promise.resolve();
const sirada = new Set();
export const arkaDurum = (ad, dosya) => durum.get(ad + '/' + dosya);
export function arkaHazirla(ad, bildir) {
  const kurgu = okuJson(proje(ad).kurgu, {});
  const arka = kurgu.goruntu && kurgu.goruntu.arka;
  if (!arka) return;
  for (const k of kurgu.klipler || []) {
    if (!k.dosya || SES_UZANTI.test(k.dosya)) continue;
    const anahtar = `${ad}/${k.dosya}/${arkaAnahtar(arka)}`;
    if (sirada.has(anahtar) || fs.existsSync(path.join(proje(ad).vekil, arkaVekilAdi(k.dosya, arka)))) continue;
    sirada.add(anahtar);
    durum.set(ad + '/' + k.dosya, 'arka plan ayrılıyor'); bildir();
    kuyruk = kuyruk.then(() => arkaVekilUret(ad, k.dosya, arka))
      .then(() => durum.delete(ad + '/' + k.dosya))
      .catch(e => { console.error(e); durum.set(ad + '/' + k.dosya, 'arka plan hatası: ' + String(e.message).slice(0, 200)); })
      .finally(() => { sirada.delete(anahtar); bildir(); });
  }
}
