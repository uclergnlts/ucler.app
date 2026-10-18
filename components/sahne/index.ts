// Adımlı derslerin sahne kütüphanesi. İçerikteki "sahne.tur" buradaki adlardan biri olmalıdır.
import { ATOM } from "./atom";
import { BIYOLOJI1 } from "./biyoloji1";
import { FIZIK1 } from "./fizik1";
import { HAREKET } from "./hareket";
import { KIMYA1 } from "./kimya1";
import type { SahneKaydi } from "./ortak";
import { ZAR } from "./zar";

export const SAHNELER: Record<string, SahneKaydi> = { ...HAREKET, ...ATOM, ...ZAR, ...FIZIK1, ...KIMYA1, ...BIYOLOJI1 };
export type { SahneKaydi, SahneProps } from "./ortak";
