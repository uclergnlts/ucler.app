// Adımlı derslerin sahne kütüphanesi. İçerikteki "sahne.tur" buradaki adlardan biri olmalıdır.
import { ATOM } from "./atom";
import { BIYOLOJI1 } from "./biyoloji1";
import { BIYOLOJI2 } from "./biyoloji2";
import { BIYOLOJI3 } from "./biyoloji3";
import { FIZIK1 } from "./fizik1";
import { FIZIK2 } from "./fizik2";
import { FIZIK3 } from "./fizik3";
import { HAREKET } from "./hareket";
import { KIMYA1 } from "./kimya1";
import { KIMYA2 } from "./kimya2";
import { KIMYA3 } from "./kimya3";
import type { SahneKaydi } from "./ortak";
import { ZAR } from "./zar";

export const SAHNELER: Record<string, SahneKaydi> = { ...HAREKET, ...ATOM, ...ZAR, ...FIZIK1, ...FIZIK2, ...FIZIK3, ...KIMYA1, ...KIMYA2, ...KIMYA3, ...BIYOLOJI1, ...BIYOLOJI2, ...BIYOLOJI3 };
export type { SahneKaydi, SahneProps } from "./ortak";
