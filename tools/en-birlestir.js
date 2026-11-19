// İngilizce derlemenin çıktısını (out-en/) Türkçe çıktının içine, out/en/ altına taşır. public/ dosyaları (yazı tipi,
// ses, görsel) iki kopyada da kökten okunur; bu yüzden İngilizce çıktıdaki kopyaları taşınmaz.
const fs = require("fs"), path = require("path");
const KAYNAK = "out-en", HEDEF = path.join("out", "en");
if (!fs.existsSync(path.join(KAYNAK, "index.html"))) { console.error("out-en/index.html yok: önce NEXT_PUBLIC_DIL=en next build"); process.exit(1); }
if (!fs.existsSync("out")) { console.error("out/ yok: önce Türkçe derleme (next build)"); process.exit(1); }
fs.rmSync(HEDEF, { recursive: true, force: true });
let n = 0;
(function tasi(d) {
  for (const f of fs.readdirSync(path.join(KAYNAK, d))) {
    const g = path.join(d, f), k = path.join(KAYNAK, g);
    if (fs.existsSync(path.join("public", g)) && !fs.statSync(k).isDirectory()) continue;
    if (fs.statSync(k).isDirectory()) { tasi(g); continue; }
    if (d === "" && /^(sitemap\.xml|robots\.txt)$/.test(f)) continue; // arama motoru dosyaları yalnızca kökte
    fs.mkdirSync(path.join(HEDEF, d), { recursive: true });
    fs.copyFileSync(k, path.join(HEDEF, g));
    n++;
  }
})("");
console.log(`out/en/: ${n} dosya`);
