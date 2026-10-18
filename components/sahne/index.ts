// Adımlı derslerin sahne kütüphanesi. İçerikteki "sahne.tur" buradaki adlardan biri olmalıdır.
import { ATOM } from "./atom";
import { BIYOLOJI1 } from "./biyoloji1";
import { BIYOLOJI2 } from "./biyoloji2";
import { BIYOLOJI3 } from "./biyoloji3";
import { BIYOLOJI4 } from "./biyoloji4";
import { FIZIK1 } from "./fizik1";
import { FIZIK2 } from "./fizik2";
import { FIZIK3 } from "./fizik3";
import { FIZIK4 } from "./fizik4";
import { HAREKET } from "./hareket";
import { KIMYA1 } from "./kimya1";
import { KIMYA2 } from "./kimya2";
import { KIMYA3 } from "./kimya3";
import { KIMYA4 } from "./kimya4";
import type { SahneKaydi } from "./ortak";
import { ZAR } from "./zar";

export const SAHNELER: Record<string, SahneKaydi> = { ...HAREKET, ...ATOM, ...ZAR, ...FIZIK1, ...FIZIK2, ...FIZIK3, ...FIZIK4, ...KIMYA1, ...KIMYA2, ...KIMYA3, ...KIMYA4, ...BIYOLOJI1, ...BIYOLOJI2, ...BIYOLOJI3, ...BIYOLOJI4 };
export type { SahneKaydi, SahneProps } from "./ortak";
