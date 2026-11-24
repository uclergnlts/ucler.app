// Tanıtım sayfasının yapılandırılmış verisi (schema.org JSON-LD): kim olduğumuz, sosyal hesaplar ve mağazadaki uygulama.
// Yalnızca sayfada görünen, doğru bilgiler yazılır; puan ya da yorum sayısı eklenmez.
import { APP_STORE_URL, INSTAGRAM, PLAY_URL, SITE_URL, YOUTUBE } from "@/lib/site";

export default function YapisalVeri({ dil }: { dil: "tr" | "en" }) {
  const en = dil === "en";
  const org = `${SITE_URL}/#org`;
  const veri = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": org, name: "ucler", url: `${SITE_URL}/`, logo: `${SITE_URL}/simge-512.png`, sameAs: [YOUTUBE.url, INSTAGRAM.url, APP_STORE_URL, PLAY_URL] },
      { "@type": "WebSite", "@id": `${SITE_URL}/#site`, name: "ucler", url: `${SITE_URL}/`, inLanguage: ["en", "tr"], publisher: { "@id": org } },
      {
        "@type": "MobileApplication",
        name: "ucler",
        operatingSystem: "iOS, Android",
        applicationCategory: "EducationalApplication",
        description: en
          ? "Short interactive science lessons with visuals and mini tests."
          : "Görselli, kısa ve etkileşimli bilim dersleri ve mini testler.",
        inLanguage: ["en", "tr"],
        installUrl: [APP_STORE_URL, PLAY_URL],
        offers: { "@type": "Offer", price: "0", priceCurrency: en ? "USD" : "TRY" },
        publisher: { "@id": org },
      },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(veri).replace(/</g, "\\u003c") }} />;
}
