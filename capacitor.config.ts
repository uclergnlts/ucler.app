import type { CapacitorConfig } from "@capacitor/cli";

// Telefon uygulaması (iOS + Android): `npm run build` ile üretilen out/ klasörü uygulamanın içine paketlenir.
// Güncelleme: `npm run app` (build + cap sync), sonra Xcode / Android Studio'dan çalıştır. Ayrıntı: docs/UYGULAMA.md
const config: CapacitorConfig = {
  appId: "app.ucler",
  appName: "ucler",
  webDir: "out",
  backgroundColor: "#ffffff",
  ios: { contentInset: "never" },
  // Android 15 kenardan kenara çizer; üst çubuk ve alt gezinme çubuğu içeriğin üstüne binmesin.
  android: { adjustMarginsForEdgeToEdge: "auto" },
  plugins: {
    SplashScreen: { launchShowDuration: 2000, backgroundColor: "#ffffff", showSpinner: false },
  },
};

export default config;
