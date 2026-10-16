// Uygulama simgeleri. Konu görselleri değil; onlar content/*.json içindeki SVG'lerdir.
const base = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2.4 } as const;

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
  profil: () => (
    <svg {...base} strokeLinecap="round"><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></svg>
  ),
  back: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg>
  ),
  play: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
  ),
  bulb: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#1d3557" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6M10 21h4" /><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" fill="#ffc93c" /></svg>
  ),
};
