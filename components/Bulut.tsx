"use client";
// Her sayfada çalışır: oturumu açar ve giriş yapılmışsa ilerlemeyi bulutla eşitler (lib/bulut.ts).
import { useEffect } from "react";
import { bulutKur } from "@/lib/bulut";

export default function Bulut() {
  useEffect(() => { bulutKur(); }, []);
  return null;
}
