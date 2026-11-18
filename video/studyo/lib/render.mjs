// Son çıktı: ham 4K çekimler kesilir, yüz kayması ffmpeg'de, sahneler + altyazı Chrome'da kare kare çizilip üstüne bindirilir.
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright-core';
import { proje, okuJson, metinleriOku, SES_UZANTI } from './yollar.mjs';
import { calistir } from './isle.mjs';
import { srt, kurguHazirla, parcalar, toplamSure, ffmpegKaydirma, yuzKaydirma, goruntuFfmpeg, arkaFfmpeg, W, H } from '../public/motor.js';
import { maskeUret, arkaAnahtar } from './maske.mjs';
import crypto from 'node:crypto';

const KAGIT = '0xF6F2EA';

async function sekmeAc(b, olcek, port, ad) {
  const page = await b.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: olcek });
  page.on('pageerror', e => console.error('sahne hatası:', e.message));
  await page.goto(`http://127.0.0.1:${port}/studyo/render.html?p=${encodeURIComponent(ad)}`);
  await page.waitForFunction('window.HAZIR === true', null, { timeout: 60000 });
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Emulation.setDefaultBackgroundColorOverride', { color: { r: 0, g: 0, b: 0, a: 0 } });
  // clip.scale olmadan CDP her zaman 1920 genişlik verir; 4K için açıkça 2 kat istenir
  const clip = { x: 0, y: 0, width: W, height: H, scale: olcek };
  page.kare = async () => Buffer.from((await cdp.send('Page.captureScreenshot', { format: 'png', optimizeForSpeed: true, clip })).data, 'base64');
  return page;
}
async function tarayici(olcek, port, ad) {
  const b = await chromium.launch({ channel: 'chrome', headless: true });
  return { b, page: await sekmeAc(b, olcek, port, ad) };
}

// 1. geçiş: sahne + altyazı katmanı, saydam PNG kareler olarak .mov dosyasına (yeniden kodlama yok)
async function katmanCiz(ad, { olcek, port, fps, N, hedef, iptal, ilerleme, sekme = 3 }) {
  const b = await chromium.launch({ channel: 'chrome', headless: true });
  const parcaDosyalar = [];
  let biten = 0; const bas = Date.now();
  try {
    const sayfalar = await Promise.all(Array.from({ length: sekme }, () => sekmeAc(b, olcek, port, ad)));
    const boy = Math.ceil(N / sekme);
    await Promise.all(sayfalar.map(async (page, k) => {
      const a = k * boy, z = Math.min(N, a + boy); if (a >= z) return;
      const dosya = `${hedef}.${k}.mov`; parcaDosyalar[k] = dosya;
      const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'png', '-i', 'pipe:0', '-c:v', 'copy', dosya], { stdio: ['pipe', 'ignore', 'pipe'] });
      let hata = ''; ff.stderr.on('data', d => hata += d); ff.stdin.on('error', () => { });
      const bitti = new Promise((ok, no) => ff.on('close', c => c === 0 ? ok() : no(new Error('ffmpeg katman: ' + hata.slice(-1500)))));
      let onceA = null, onceK = null;
      for (let f = a; f < z; f++) {
        if (iptal.var) { ff.kill('SIGKILL'); throw new Error('iptal edildi'); }
        const anahtar = await page.evaluate(t => window.kareHazirla(t), f / fps);
        const kare = anahtar != null && anahtar === onceA && onceK ? onceK : await page.kare();
        onceA = anahtar; onceK = kare;
        if (!ff.stdin.write(kare)) await new Promise(r => ff.stdin.once('drain', r));
        if (++biten % 30 === 0) { const g = (Date.now() - bas) / 1000; ilerleme({ asama: 'çizimler', oran: 0.2 + biten / N * 0.6, kalan: g / biten * (N - biten) * 1.3 }); }
      }
      ff.stdin.end(); await bitti;
    }));
  } finally { await b.close(); }
  const liste = hedef + '.liste.txt';
  fs.writeFileSync(liste, parcaDosyalar.filter(Boolean).map(f => `file '${f.replace(/'/g, "'\\''")}'`).join('\n'));
  await calistir('ffmpeg', ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', liste, '-c', 'copy', hedef]);
  for (const f of parcaDosyalar) if (f) fs.rmSync(f, { force: true });
  fs.rmSync(liste, { force: true });
}

export async function render(ad, { cozunurluk = '1080', port, ilerleme = () => { }, iptal = { var: false } } = {}) {
  const p = proje(ad);
  const kurgu = kurguHazirla(okuJson(p.kurgu), metinleriOku(p));
  const fps = kurgu.fps || 30;
  const olcek = cozunurluk === '4k' ? 2 : 1;
  const OW = W * olcek, OH = H * olcek;
  const T = toplamSure(kurgu);
  if (!T) throw new Error('Kurgu boş');
  const N = Math.round(T * fps);

  // Her parça ayrı bir ara dosyaya kesilir (önbellekli: değişmeyen parça tekrar kesilmez), sonra uç uca eklenir.
  const pars = parcalar(kurgu);
  const parcaKlasor = path.join(p.gecici, 'parcalar'); fs.mkdirSync(parcaKlasor, { recursive: true });
  const parcaDosyalari = [];
  const gf = goruntuFfmpeg(kurgu.goruntu, olcek);
  const arka = kurgu.goruntu && kurgu.goruntu.arka;
  const gAnahtar = (gf ? crypto.createHash('md5').update(gf.adimlar).digest('hex').slice(0, 8) : 'duz') + (arka ? '-a' + arkaAnahtar(arka) : '');
  for (const [j, s] of pars.entries()) {
    if (iptal.var) throw new Error('iptal edildi');
    ilerleme({ asama: 'kesimler', oran: 0.02 + 0.18 * j / pars.length, kalan: null });
    const d = (s.son - s.bas).toFixed(3);
    const ad0 = s.bosluk ? `bosluk-${d}-${OW}.mov` : `${s.dosya.replace(/[^\w.-]/g, '_')}-${s.gir.toFixed(3)}-${d}-${OW}-${fps}-${gAnahtar}.mov`;
    const f = path.join(parcaKlasor, ad0); parcaDosyalari.push(f);
    if (fs.existsSync(f)) continue;
    const ortak = ['-c:v', 'h264_videotoolbox', '-b:v', olcek === 2 ? '90M' : '35M', '-g', String(fps), '-c:a', 'pcm_s16le', '-ar', '48000', '-ac', '2', '-t', d];
    if (s.bosluk) await calistir('ffmpeg', ['-y', '-v', 'error', '-f', 'lavfi', '-i', `color=c=${KAGIT}:s=${OW}x${OH}:r=${fps}`, '-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo',
      '-vf', 'format=yuv420p', ...ortak, f + '.yarim.mov']);
    else if (SES_UZANTI.test(s.dosya)) await calistir('ffmpeg', ['-y', '-v', 'error', '-f', 'lavfi', '-i', `color=c=${KAGIT}:s=${OW}x${OH}:r=${fps}`,
      '-ss', s.gir.toFixed(3), '-t', d, '-i', path.join(p.ham, s.dosya), '-map', '0:v', '-map', '1:a', '-vf', 'format=yuv420p',
      '-af', `aresample=48000,apad,afade=t=in:d=0.02,afade=t=out:st=${Math.max(0, d - 0.03).toFixed(3)}:d=0.03`, ...ortak, f + '.yarim.mov']);
    else {
      const ekGirdi = [];
      let arkaAdim = '';
      if (arka && !SES_UZANTI.test(s.dosya)) {
        ilerleme({ asama: 'arka plan ayrılıyor', oran: 0.02 + 0.18 * j / pars.length, kalan: null });
        ekGirdi.push('-ss', s.gir.toFixed(3), '-t', d, '-i', await maskeUret(ad, s.dosya));
        if (arka.tur === 'resim') ekGirdi.push('-loop', '1', '-i', path.join(p.medya, 'arka', arka.dosya));
        arkaAdim = arkaFfmpeg(arka, OW, OH, 'gh', '1:v', '2:v') + '[g0];';
      }
      await calistir('ffmpeg', ['-y', '-v', 'error', '-hwaccel', 'videotoolbox', '-ss', s.gir.toFixed(3), '-t', d, '-i', path.join(p.ham, s.dosya), ...ekGirdi,
      '-filter_complex', `[0:v]scale=${OW}:${OH}:force_original_aspect_ratio=increase:flags=bicubic,crop=${OW}:${OH},fps=${fps},format=yuv420p,setsar=1[${arkaAdim ? 'gh' : 'g0'}];` + arkaAdim +
        (gf ? gf.adimlar + `;[${gf.son}]` : '[g0]') + `tpad=stop_mode=clone:stop_duration=0.3,format=yuv420p[vo]`, '-map', '[vo]', '-map', '0:a?',
      '-af', `aresample=48000,apad,afade=t=in:d=0.02,afade=t=out:st=${Math.max(0, d - 0.03).toFixed(3)}:d=0.03`, ...ortak, f + '.yarim.mov']);
    }
    fs.renameSync(f + '.yarim.mov', f);
  }
  const liste = path.join(p.gecici, 'parcalar.txt');
  fs.writeFileSync(liste, parcaDosyalari.map(f => `file '${f.replace(/'/g, "'\\''")}'`).join('\n'));
  const args = ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', liste];
  const fg = [];
  let gi = 1;
  const konusmaSonu = pars.length ? pars[pars.length - 1].son : 0;
  const ek = Math.max(0, T - konusmaSonu + 0.1).toFixed(3);
  fg.push(`[0:v]setpts=PTS-STARTPTS,tpad=stop_mode=clone:stop_duration=${ek}[yuz]`);
  fg.push(`[0:a]asetpts=PTS-STARTPTS[konusma0]`);
  fg.push(`color=c=${KAGIT}:s=${OW}x${OH}:r=${fps}:d=${T.toFixed(3)}[zemin]`);
  fg.push(`[zemin][yuz]overlay=x='${ffmpegKaydirma(kurgu, olcek)}':y=0:eval=frame:shortest=1[taban]`);
  // Konuşma sesi: alçak frekans temizliği + hafif sıkıştırma
  fg.push(`[konusma0]highpass=f=80,acompressor=threshold=-20dB:ratio=3:attack=5:release=150:makeup=2,apad=whole_dur=${T.toFixed(3)}[konusma]`);
  let sesEtiket = '[konusma]';
  if (kurgu.muzik && kurgu.muzik.dosya) {
    args.push('-stream_loop', '-1', '-i', path.join(p.muzik, kurgu.muzik.dosya));
    const v = kurgu.muzik.ses ?? 0.12;
    fg.push(`[${gi}:a]aresample=48000,aformat=channel_layouts=stereo,volume=${v},afade=t=out:st=${Math.max(0, T - 2.5).toFixed(2)}:d=2.5[muzik0]`);
    // Konuşma varken müzik kendiliğinden kısılır
    fg.push(`[konusma]asplit[k1][k2]`);
    fg.push(`[muzik0][k2]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=400[muzik]`);
    fg.push(`[k1][muzik]amix=inputs=2:duration=first:normalize=0[karisik]`);
    sesEtiket = '[karisik]';
    gi += 1;
  }
  fg.push(`${sesEtiket}loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000[ses]`);
  // Katman kareleri stdin'den
  const katmanDosya = path.join(p.gecici, 'katman.mov');
  // Tam ekran sahnelerde Chrome saydamlıksız (rgb24) PNG verir; biçim değişince ffmpeg filtreyi baştan kurup videoyu kesiyordu.
  args.push('-reinit_filter', '0', '-i', katmanDosya);
  fg.push(`[${gi}:v]format=rgba[ust]`);
  fg.push(`[taban][ust]overlay=0:0:format=auto:shortest=1,format=yuv420p[goruntu]`);

  fs.mkdirSync(p.cikti, { recursive: true });
  fs.mkdirSync(p.gecici, { recursive: true });
  const fgDosya = path.join(p.gecici, 'filtre.txt');
  fs.writeFileSync(fgDosya, fg.join(';\n'));
  const damga = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
  const cikti = path.join(p.cikti, `${ad}-${cozunurluk}-${damga}.mp4`);
  args.push('-/filter_complex', fgDosya, '-map', '[goruntu]', '-map', '[ses]',
    '-c:v', 'h264_videotoolbox', '-b:v', olcek === 2 ? '45M' : '16M', '-profile:v', 'high',
    '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709',
    '-c:a', 'aac', '-b:a', '256k', '-t', T.toFixed(3), '-movflags', '+faststart', cikti + '.yarim.mp4');

  await katmanCiz(ad, { olcek, port, fps, N, hedef: katmanDosya, iptal, ilerleme });
  if (iptal.var) throw new Error('iptal edildi');
  // 2. geçiş: kesilmiş çekimler + yüz kayması + katman + ses -> son video
  ilerleme({ asama: 'birleştirme', oran: 0.8, kalan: null });
  await new Promise((ok, no) => {
    const ff = spawn('ffmpeg', [...args.slice(0, 3), '-progress', 'pipe:1', ...args.slice(3)], { stdio: ['ignore', 'pipe', 'pipe'] });
    let hata = '';
    ff.stderr.on('data', d => { hata += d; if (hata.length > 100000) hata = hata.slice(-50000); });
    ff.stdout.on('data', d => { const m = /out_time_us=(\d+)/.exec(String(d)); if (m) ilerleme({ asama: 'birleştirme', oran: 0.8 + 0.2 * Math.min(1, m[1] / 1e6 / T), kalan: null }); if (iptal.var) ff.kill('SIGKILL'); });
    ff.on('close', c => c === 0 ? ok() : no(new Error(iptal.var ? 'iptal edildi' : 'ffmpeg: ' + hata.slice(-2000))));
  });
  if (!process.env.STUDYO_SAKLA) fs.rmSync(katmanDosya, { force: true });
  fs.renameSync(cikti + '.yarim.mp4', cikti);
  fs.writeFileSync(cikti.replace(/\.mp4$/, '.srt'), srt(kurgu, metinleriOku(p)));
  ilerleme({ kare: N, toplam: N, oran: 1, kalan: 0 });
  return cikti;
}

// Kontrol için tek kare: ham çekimden yüz + kayma + katman. Claude kurguya bakarken kullanır.
export async function kareler(ad, zamanlar, { port }) {
  const p = proje(ad);
  const kurgu = kurguHazirla(okuJson(p.kurgu), metinleriOku(p));
  const pars = parcalar(kurgu);
  const gf = goruntuFfmpeg(kurgu.goruntu, 1);
  fs.mkdirSync(path.join(p.gecici, 'kare'), { recursive: true });
  const { b, page } = await tarayici(1, port, ad);
  const ciktilar = [];
  try {
    for (const t of zamanlar) {
      const ust = path.join(p.gecici, 'kare', `ust-${t}.png`);
      await page.evaluate(t => window.kareHazirla(t), t);
      fs.writeFileSync(ust, await page.kare());
      const s = pars.find(s => t >= s.bas && t < s.son) || pars[pars.length - 1];
      const out = path.join(p.gecici, 'kare', `kare-${String(t).replace('.', '_')}.jpg`);
      const x = yuzKaydirma(kurgu, t).toFixed(0);
      const girdi = s && !s.bosluk && !SES_UZANTI.test(s.dosya) ? ['-ss', Math.min(s.cik, s.gir + Math.max(0, t - s.bas)).toFixed(3), '-i', path.join(p.ham, s.dosya)]
        : ['-f', 'lavfi', '-i', `color=c=${KAGIT}:s=${W}x${H}`];
      await calistir('ffmpeg', ['-y', '-v', 'error', ...girdi, '-i', ust, '-f', 'lavfi', '-i', `color=c=${KAGIT}:s=${W}x${H}`, '-filter_complex',
        `[0:v]scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},setpts=PTS-STARTPTS,format=yuv420p[g0];${gf ? gf.adimlar + `;[${gf.son}]` : '[g0]'}null[y];[2:v]setpts=PTS-STARTPTS[z];[z][y]overlay=x=${x}:y=0:eof_action=repeat[t];[t][1:v]overlay=0:0`, '-frames:v', '1', '-q:v', '3', out]);
      ciktilar.push(out);
    }
  } finally { await b.close(); }
  return ciktilar;
}
