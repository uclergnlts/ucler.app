import type { NextConfig } from "next";

// Statik çıktı: `npm run build` sonrası `out/` klasörü herhangi bir yerde yayınlanabilir (Vercel, GitHub Pages...).
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  // Geliştirme sunucusu AGENTS.md dosyasına kendi kurallarını eklemesin; o dosya Codex talimatıdır.
  agentRules: false,
};

export default nextConfig;
