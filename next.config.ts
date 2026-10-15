import type { NextConfig } from "next";

// Statik çıktı: `npm run build` sonrası `out/` klasörü herhangi bir yerde yayınlanabilir (Vercel, GitHub Pages...).
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
};

export default nextConfig;
