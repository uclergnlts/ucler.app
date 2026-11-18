// Yeni gelen klibi işler: bilgi, önizleme kopyası (720p), Whisper ile kelime zamanlı metin, kurguya ekleme.
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { proje, okuJson, yazJson, MODEL, VIDEO_UZANTI } from './yollar.mjs';

export function calistir(kmt, args, { girdi } = {}) {
  return new Promise((ok, hata) => {
    const p = spawn(kmt, args, { stdio: [girdi ? 'pipe' : 'ignore', 'pipe', 'pipe'] });
    let out = '', err = '';
    p.stdout.on('data', d => out += d); p.stderr.on('data', d => { err += d; if (err.length > 200000) err = err.slice(-100000); });
    p.on('error', hata);
    p.on('close', c => c === 0 ? ok(out) : hata(new Error(`${kmt} çıkış ${c}: ${err.slice(-1500)}`)));
  });
}

export async function bilgi(dosya) {
  const j = JSON.parse(await calistir('ffprobe', ['-v', 'error', '-print_format', 'json', '-show_format', '-show_streams', dosya]));
  const v = j.streams.find(s => s.codec_type === 'video') || {};
  const a = j.streams.find(s => s.codec_type === 'audio');
  const [n, d] = (v.avg_frame_rate || '30/1').split('/').map(Number);
  const don = Number((v.side_data_list || []).find(s => s.rotation != null)?.rotation || v.tags?.rotate || 0);
  let w = v.width, h = v.height; if (Math.abs(don) === 90) [w, h] = [h, w];
  return {
    sure: Number(j.format.duration), w, h, fps: d ? +(n / d).toFixed(2) : 30, kodek: v.codec_name,
    hdr: ['arib-std-b67', 'smpte2084'].includes(v.color_transfer), ses: !!a, boyut: Number(j.format.size),
  };
}

export const durumlar = new Map();   // "proje/dosya" -> {asama, hata}
let kuyruk = Promise.resolve();
const sirada = new Set();

export function sirayaKoy(ad, dosya, bildir) {
  const anahtar = ad + '/' + dosya;
  if (sirada.has(anahtar)) return;
  sirada.add(anahtar);
  durumlar.set(anahtar, { asama: 'sırada' }); bildir();
  kuyruk = kuyruk.then(() => isle(ad, dosya, a => { durumlar.set(anahtar, { asama: a }); bildir(); }))
    .then(() => { durumlar.set(anahtar, { asama: 'hazır' }); })
    .catch(e => { console.error(e); durumlar.set(anahtar, { asama: 'hata', hata: String(e.message || e).slice(0, 500) }); })
    .finally(() => { sirada.delete(anahtar); bildir(); });
}

export function hazirMi(ad, dosya) {
  const p = proje(ad);
  const b = path.parse(dosya).name;
  return fs.existsSync(path.join(p.vekil, b + '.mp4')) && fs.existsSync(path.join(p.metin, dosya + '.json'));
}

async function dosyaSabitMi(f) {
  // AirDrop / kopyalama sürerken dosya büyümeye devam eder; boyut sabitlenene kadar bekle
  let once = -1;
  for (let i = 0; i < 600; i++) {
    const s = fs.statSync(f).size;
    if (s === once && s > 0) return;
    once = s; await new Promise(r => setTimeout(r, 1500));
  }
}

async function isle(ad, dosya, asama) {
  const p = proje(ad);
  const ham = path.join(p.ham, dosya);
  const b = path.parse(dosya).name;
  asama('kopyalanıyor'); await dosyaSabitMi(ham);
  const bi = await bilgi(ham);

  const vekil = path.join(p.vekil, b + '.mp4');
  if (!fs.existsSync(vekil)) {
    asama('önizleme kopyası');
    const gec = vekil + '.yarim.mp4';
    await calistir('ffmpeg', ['-y', '-v', 'error', '-i', ham, '-vf', 'scale=-2:720,format=yuv420p', '-c:v', 'h264_videotoolbox', '-b:v', '5M', '-g', '15',
      '-c:a', 'aac', '-b:a', '160k', '-ac', '2', '-movflags', '+faststart', gec]);
    fs.renameSync(gec, vekil);
  }

  const metinF = path.join(p.metin, dosya + '.json');
  if (!fs.existsSync(metinF)) {
    asama('konuşma metne çevriliyor');
    const kurgu = okuJson(p.kurgu, {});
    const wav = path.join(p.gecici, b + '.wav');
    await calistir('ffmpeg', ['-y', '-v', 'error', '-i', ham, '-vn', '-ac', '1', '-ar', '16000', '-c:a', 'pcm_s16le', wav]);
    const cikis = path.join(p.gecici, b + '.whisper');
    await calistir('whisper-cli', ['-m', MODEL, '-l', kurgu.konusmaDili || 'tr', '-ml', '1', '-sow', '-oj', '-of', cikis, '-t', '8', '-np', '-f', wav]);
    const j = JSON.parse(fs.readFileSync(cikis + '.json', 'utf8'));
    const kelimeler = [];
    for (const s of j.transcription || []) {
      const w = s.text.trim(); if (!w) continue;
      const k = { w, s: s.offsets.from / 1000, e: s.offsets.to / 1000 };
      // Whisper bazen noktalama işaretini ayrı kelime yapar: öncekine ekle
      if (/^[.,!?…:;]+$/.test(w) && kelimeler.length) { kelimeler[kelimeler.length - 1].w += w; continue; }
      kelimeler.push(k);
    }
    yazJson(metinF, { dosya, sure: bi.sure, dil: kurgu.konusmaDili || 'tr', bilgi: bi, kelimeler });
    fs.rmSync(wav, { force: true }); fs.rmSync(cikis + '.json', { force: true });
  }

  // Kurguda yoksa sona ekle; baştaki ve sondaki sessizliği kırp
  const kurgu = okuJson(p.kurgu, null);
  if (kurgu && !(kurgu.klipler || []).some(k => k.dosya === dosya) && !(kurgu.cikarilan || []).includes(dosya)) {
    const m = okuJson(metinF, { kelimeler: [] });
    const ilk = m.kelimeler[0], son = m.kelimeler[m.kelimeler.length - 1];
    const gir = ilk ? Math.max(0, +(ilk.s - 0.3).toFixed(2)) : 0;
    const cik = son ? Math.min(bi.sure, +(son.e + 0.45).toFixed(2)) : +bi.sure.toFixed(2);
    kurgu.klipler = kurgu.klipler || [];
    kurgu.klipler.push({ dosya, gir, cik, not: 'otomatik eklendi' });
    yazJson(p.kurgu, kurgu);
  }
}

export function hamDosyalar(ad) {
  const p = proje(ad);
  if (!fs.existsSync(p.ham)) return [];
  return fs.readdirSync(p.ham).filter(f => VIDEO_UZANTI.test(f) && !f.startsWith('.')).sort((a, b) => a.localeCompare(b, 'tr', { numeric: true }));
}
