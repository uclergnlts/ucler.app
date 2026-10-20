"use client";
// Profil'in alt ekranlarının ortak çerçevesi: üstte Profil'e dönen geri düğmesi, altında başlık ve içerik.
import { GeriTop, Govde, PageHead } from "../temel";

export default function Kabuk({ title, text, children }: { title: string; text?: string; children: React.ReactNode }) {
  return (
    <div className="app">
      <GeriTop to="/profil/" label="Profil'e dön" />
      <Govde>
        <PageHead title={title} text={text} />
        {children}
      </Govde>
    </div>
  );
}
