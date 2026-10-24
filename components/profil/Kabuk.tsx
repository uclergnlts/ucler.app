"use client";
// Profil'in alt ekranlarının ortak çerçevesi: üst çubukta Profil'e dönen geri, başlık ve sağda ekranın düğmesi.
import { GeriTop, Govde, PageHead } from "../temel";

export default function Kabuk({ title, text, sag, children }: { title: string; text?: string; sag?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="app">
      <GeriTop to="/profil/" label="Profil'e dön" baslik={title} sag={sag} />
      <Govde>
        <PageHead text={text} />
        {children}
      </Govde>
    </div>
  );
}
