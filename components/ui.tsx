"use client";
import Link from "next/link";
import { DERSLER, type Entry } from "@/lib/dersler";
import { Icon } from "./icons";

export const Logo = () => (
  <div className="logo" aria-label="ucler">
    ucler<i>.</i>
  </div>
);

export const Top = () => (
  <header className="top">
    <Logo />
  </header>
);

export const PageHead = ({ title, text }: { title: string; text?: string }) => (
  <section className="pagehead">
    <h1>{title}</h1>
    {text && <p>{text}</p>}
  </section>
);

export const INSTAGRAM = { ad: "@ucler.app", url: "https://www.instagram.com/ucler.app/" };

/** Instagram hesabına giden bağlantı satırı. */
export function InstaLink() {
  const I = Icon.instagram, Next = Icon.ileri;
  return (
    <a className="insta" href={INSTAGRAM.url} target="_blank" rel="noopener noreferrer">
      <span className="ic"><I /></span>
      <span className="txt"><b>{INSTAGRAM.ad}</b><span className="s">Kısa videolar her hafta Instagram'da</span></span>
      <Next />
    </a>
  );
}

export const href = (d: string, id?: string) => (id ? `/${d}/${id}/` : `/${d}/`);

/** Keşfet ve Kaydedilenler listelerindeki satır. */
export function Row({ e, done }: { e: Entry; done?: boolean }) {
  const I = Icon[e.ders];
  if (!e.id)
    return (
      <div className="row soon" data-ders={e.ders}>
        <span className="ic"><I /></span>
        <span><b>{e.ad}</b><span className="s">{DERSLER[e.ders].ad}</span></span>
        <span className="tag">Yakında</span>
      </div>
    );
  return (
    <Link className="row" data-ders={e.ders} href={href(e.ders, e.id)}>
      <span className="ic"><I /></span>
      <span style={{ minWidth: 0 }}>
        <b>{e.title}</b>
        <span className="s">{DERSLER[e.ders].ad} · {e.summary}</span>
      </span>
      <span className="tag">{done ? "✓" : `${e.cardCount} kart`}</span>
    </Link>
  );
}

/** İçerik metinleri küçük HTML parçaları taşır (<em>, <b>, <sub>...). İçerik bizim yazdığımız, doğrulanmış metindir. */
export const Html = ({ as: Tag = "span", html, className }: { as?: "span" | "h2" | "p" | "div"; html: string; className?: string }) => (
  <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />
);
