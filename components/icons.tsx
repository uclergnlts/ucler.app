// Uygulama simgeleri. Konu görselleri değil; onlar content/*.json içindeki SVG'lerdir.
const base = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2 } as const;

export const Icon = {
  home: () => (
    <svg {...base} strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" /></svg>
  ),
  fizik: () => (
    <svg {...base} strokeLinecap="round"><path d="M4 19L19 5" /><path d="M12 5h7v7" /><circle cx="4" cy="19" r="1.8" fill="currentColor" /></svg>
  ),
  kimya: () => (
    <svg {...base} strokeLinecap="round" strokeLinejoin="round"><path d="M9 3h6M10 3v6L4.5 18.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3" /><path d="M7 15h10" /></svg>
  ),
  biyoloji: () => (
    <svg {...base}><ellipse cx="12" cy="12" rx="9" ry="7" /><circle cx="13.5" cy="11" r="2.8" /><circle cx="7.5" cy="14" r="1" fill="currentColor" /><circle cx="16" cy="16.5" r="1" fill="currentColor" /></svg>
  ),
  matematik: () => (
    <svg {...base} strokeLinecap="round"><path d="M7 4v6M4 7h6M14 7h6M4.5 15.5l5 5M9.5 15.5l-5 5M14 16h6M14 20h6" /></svg>
  ),
  tarih: () => (
    <svg {...base} strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M4 9h16M12 3l8 4H4z" /><path d="M6 9v9M10 9v9M14 9v9M18 9v9" /></svg>
  ),
  cografya: () => (
    <svg {...base} strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3z" /></svg>
  ),
  hukuk: () => (
    <svg {...base} strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18M8 21h8M5 6h14M5 6l-3 7a3 3 0 0 0 6 0zM19 6l-3 7a3 3 0 0 0 6 0z" /></svg>
  ),
  kesfet: () => (
    <svg {...base} strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
  ),
  video: () => (
    <svg {...base} strokeLinejoin="round"><rect x="5" y="2.5" width="14" height="19" rx="3" /><path d="M10 9v6l5-3z" fill="currentColor" /></svg>
  ),
  sesAcik: () => (
    <svg {...base} strokeLinecap="round" strokeLinejoin="round"><path d="M4 9h4l5-4v14l-5-4H4z" /><path d="M17 9a4 4 0 0 1 0 6M19.5 6.5a7.5 7.5 0 0 1 0 11" /></svg>
  ),
  sesKapali: () => (
    <svg {...base} strokeLinecap="round" strokeLinejoin="round"><path d="M4 9h4l5-4v14l-5-4H4z" /><path d="M17 10l4 4M21 10l-4 4" /></svg>
  ),
  kayit: () => (
    <svg {...base} strokeLinejoin="round"><path d="M6 3h12v18l-6-4.5L6 21z" /></svg>
  ),
  instagram: () => (
    <svg {...base} strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" /></svg>
  ),
  profil: () => (
    <svg {...base} strokeLinecap="round"><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></svg>
  ),
  back: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg>
  ),
  play: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
  ),
  oyun: () => (
    <svg {...base} strokeLinejoin="round"><rect x="3.5" y="3.5" width="7" height="7" rx="2" /><rect x="13.5" y="3.5" width="7" height="7" rx="2" /><rect x="3.5" y="13.5" width="7" height="7" rx="2" /><rect x="13.5" y="13.5" width="7" height="7" rx="2" /></svg>
  ),
  paylas: () => (
    <svg {...base} strokeLinecap="round" strokeLinejoin="round"><path d="M12 15V3M7 8l5-5 5 5" /><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" /></svg>
  ),
  soru: () => (
    <svg {...base} strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a8.5 8.5 0 0 1-12.4 7.6L3 21l1.4-5.1A8.5 8.5 0 1 1 21 12z" /><path d="M9.8 9.5a2.3 2.3 0 0 1 4.4.8c0 1.6-2.2 2-2.2 3.4" /><circle cx="12" cy="16.6" r=".6" fill="currentColor" /></svg>
  ),
  ileri: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5l7 7-7 7" /></svg>
  ),
  kapat: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
  ),
  check: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
  ),
  pause: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
  ),
  kilit: () => (
    <svg {...base} strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="10.5" width="14" height="10" rx="2.5" /><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" /></svg>
  ),
  harita: () => (
    <svg {...base} strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="5" r="2.2" /><circle cx="18" cy="12" r="2.2" /><circle cx="7" cy="19" r="2.2" /><path d="M7.6 6.6l8.6 4M16.2 13.4l-7.4 4.4" /></svg>
  ),
  tekrar: () => (
    <svg {...base} strokeLinecap="round" strokeLinejoin="round"><path d="M20 11a8 8 0 1 0-2.3 5.7" /><path d="M20 4v7h-7" /></svg>
  ),
  kupa: () => (
    <svg {...base} strokeLinecap="round" strokeLinejoin="round"><path d="M7 4h10v5a5 5 0 0 1-10 0z" /><path d="M7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3" /><path d="M12 14v3M8.5 20h7l-.8-3h-5.4z" /></svg>
  ),
  yildiz: () => (
    <svg {...base} strokeLinejoin="round"><path d="M12 3l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.8l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8z" /></svg>
  ),
  kitap: () => (
    <svg {...base} strokeLinecap="round" strokeLinejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z" /><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5" /></svg>
  ),
  seri: () => (
    <svg {...base} strokeLinecap="round" strokeLinejoin="round"><path d="M12 21c-3.9 0-6.5-2.6-6.5-6.2 0-3.4 2.5-5.4 3.6-8.3.9 1.5 1.3 2.8 1.3 4.2 1.6-1.2 2.6-3.6 2.4-6.7 3.6 2.4 5.7 6.4 5.7 10.6 0 3.7-2.6 6.4-6.5 6.4z" /></svg>
  ),
  bulb: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#1d3557" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6M10 21h4" /><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" fill="#ffc93c" /></svg>
  ),
};
