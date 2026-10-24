"use client";
// Her sayfada çalışır: oturumu açar ve giriş yapılmışsa ilerlemeyi bulutla eşitler (lib/bulut.ts); Plus durumunu okur (lib/abonelik.ts).
// Hesapsızken kaydedilmek istenen konu, giriş yapılınca Kaydedilenler'e eklenir.
import { useEffect } from "react";
import { bulutKur, useOturum } from "@/lib/bulut";
import { abonelikKur } from "@/lib/abonelik";
import { bekleyenKayitUygula } from "@/lib/store";

export default function Bulut() {
  const girdi = !!useOturum();
  useEffect(() => { bulutKur(); abonelikKur(); }, []);
  useEffect(() => { if (girdi) bekleyenKayitUygula(); }, [girdi]);
  return null;
}
