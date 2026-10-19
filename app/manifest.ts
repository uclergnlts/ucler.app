import type { MetadataRoute } from "next";

// Web uygulaması bildirimi: telefonda "Ana ekrana ekle" ile uygulama gibi açılır. Statik çıktıda
// derleme sırasında /manifest.webmanifest olarak yazılır. Açık tema (docs/KARARLAR.md): zemin beyaz.
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ucler",
    short_name: "ucler",
    description: "Fizik, kimya ve biyoloji en temelden: kısa, görselli kartlar ve mini testler.",
    lang: "tr",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/simge-192.png", sizes: "192x192", type: "image/png" },
      { src: "/simge-512.png", sizes: "512x512", type: "image/png" },
      { src: "/simge-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
