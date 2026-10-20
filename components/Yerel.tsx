"use client";
// Yalnızca telefon uygulamasında (Capacitor) çalışır: üst çubuk yazıları koyu olsun, açılış ekranı sayfa hazır olunca kapansın.
import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { SplashScreen } from "@capacitor/splash-screen";
import { StatusBar, Style } from "@capacitor/status-bar";

export default function Yerel() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    void StatusBar.setStyle({ style: Style.Light }).catch(() => {});
    void SplashScreen.hide().catch(() => {});
  }, []);
  return null;
}
