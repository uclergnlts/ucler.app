"use client";
// İlerleme ve kaydedilenler yalnızca bu cihazda, localStorage'da durur.
// Anahtarlar eski siteyle aynı (tf-prog, tf-saved), böylece öğrencinin ilerlemesi kaybolmaz.
import { useSyncExternalStore } from "react";

export type Prog = Record<string, string>; // "ders.konu" -> "3/4 doğru", "_last" -> "ders.konu"

const KEYS = { prog: "tf-prog", saved: "tf-saved" } as const;
const listeners = new Set<() => void>();
const cache: Record<string, { raw: string | null; val: unknown }> = {};

function read<T>(key: string, fallback: T): T {
  let raw: string | null = null;
  try { raw = localStorage.getItem(key); } catch {}
  const c = cache[key];
  if (c && c.raw === raw) return c.val as T;
  let val: T = fallback;
  try { val = (raw ? JSON.parse(raw) : fallback) || fallback; } catch {}
  cache[key] = { raw, val };
  return val;
}
function write(key: string, val: unknown) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  listeners.forEach((l) => l());
}
function subscribe(l: () => void) {
  listeners.add(l);
  const onStorage = () => l();
  window.addEventListener("storage", onStorage);
  return () => { listeners.delete(l); window.removeEventListener("storage", onStorage); };
}

const EMPTY_PROG: Prog = {};
const EMPTY_SAVED: string[] = [];

export const useProg = () =>
  useSyncExternalStore(subscribe, () => read<Prog>(KEYS.prog, EMPTY_PROG), () => EMPTY_PROG);
export const useSaved = () =>
  useSyncExternalStore(subscribe, () => read<string[]>(KEYS.saved, EMPTY_SAVED), () => EMPTY_SAVED);

export function setProg(patch: Prog) {
  write(KEYS.prog, { ...read<Prog>(KEYS.prog, EMPTY_PROG), ...patch });
}
export function toggleSaved(key: string) {
  const s = read<string[]>(KEYS.saved, EMPTY_SAVED);
  write(KEYS.saved, s.includes(key) ? s.filter((k) => k !== key) : [key, ...s]);
}
export function resetAll() {
  write(KEYS.prog, {});
  write(KEYS.saved, []);
}

/** Bitirilen konuların anahtarları ("_last" hariç). */
export const doneKeys = (p: Prog) => Object.keys(p).filter((k) => k !== "_last");
