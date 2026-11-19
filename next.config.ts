import type { NextConfig } from "next";

// Statik çıktı: `npm run build` sonrası `out/` klasörü herhangi bir yerde yayınlanabilir (Vercel, GitHub Pages...).
// İngilizce kopya (`NEXT_PUBLIC_DIL=en`, lib/dil.ts) /en/ altında yayınlanır; çıktısı önce out-en/ klasörüne yazılır,
// tools/en-birlestir.js onu out/en/ içine taşır. İngilizce derleme ÖNCE, Türkçe SONRA çalışır: Vercel kök ayarları
// (basePath, çıktı klasörü) son derlemeden okur. Vercel ayrıca Next çıktısından yalnızca son derlemenin sayfalarını aldığı için
// vercel.json "framework": null ile out/ klasörünü düz statik site olarak yayınlar; böylece out/en/ de yayına girer.
const EN = process.env.NEXT_PUBLIC_DIL === "en";
const nextConfig: NextConfig = {
  output: "export",
  ...(EN ? { basePath: "/en", distDir: "out-en" } : {}),
  trailingSlash: true,
  // Geliştirme sunucusu AGENTS.md dosyasına kendi kurallarını eklemesin; o dosya Codex talimatıdır.
  agentRules: false,
};

export default nextConfig;
