"use client";
// Sayfaların ortak parçaları: logo, üst çubuk, sayfa başlığı, liste satırı. Görünüm shadcn/ui + Tailwind,
// hareket Motion ile. Sade: beyaz zemin, 1px çizgiler, renk yalnızca küçük vurgularda (docs/KARARLAR.md).
import Link from "next/link";
import { motion, type HTMLMotionProps } from "motion/react";
import { DERSLER, SINAV_AD, type Entry } from "@/lib/dersler";
import { INSTAGRAM } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Icon } from "./icons";

export const Logo = ({ className }: { className?: string }) => (
  <div className={cn("logo", className)} aria-label="ucler">
    ucler<i>.</i>
  </div>
);

/** Üst çubuk: logo Ana sayfaya götürür. */
export const Top = () => (
  <header className="top">
    <Link href="/" aria-label="ucler, Ana sayfa" className="rounded-lg"><Logo /></Link>
  </header>
);

/** Alt sayfaların üst çubuğu: geri düğmesi (Profil'den açılan Hakkında, Gizlilik gibi). */
export const GeriTop = ({ to, label }: { to: string; label: string }) => {
  const Back = Icon.back;
  return (
    <header className="top">
      <Button asChild variant="outline" size="icon"><Link href={to} aria-label={label}><Back /></Link></Button>
    </header>
  );
};

/** Sayfa gövdesi: açılırken hafifçe yukarı kayarak belirir. */
export const Govde = ({ className, ...props }: HTMLMotionProps<"main">) => (
  <motion.main
    className={cn("view", className)}
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.25, ease: "easeOut" }}
    {...props}
  />
);

export const PageHead = ({ title, text }: { title: string; text?: string }) => (
  <section className="grid gap-1">
    <h1 className="text-[28px]">{title}</h1>
    {text && <p className="text-[15px] text-muted-foreground">{text}</p>}
  </section>
);

export const Bolum = ({ title, more, children, id }: { title?: string; more?: React.ReactNode; children: React.ReactNode; id?: string }) => (
  <section className="grid gap-2.5" id={id}>
    {title && (
      <div className="flex items-baseline justify-between">
        <h2 className="text-[17px]">{title}</h2>
        {more}
      </div>
    )}
    {children}
  </section>
);

/** Satırları alt alta dizen çerçeve: tek kart, aralarda ince çizgi. */
export const Liste = ({ className, ...props }: React.ComponentProps<"div">) => (
  <Card className={cn("grid grid-cols-1 divide-y divide-border overflow-hidden", className)} {...props} />
);

export const Bos = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-dashed border-border-strong px-4 py-7 text-center text-[15px] text-muted-foreground">{children}</div>
);

/** Satırın solundaki küçük simge kutusu; dersin rengini alır. */
export const Simge = ({ children, soluk, className }: { children: React.ReactNode; soluk?: boolean; className?: string }) => (
  <span
    className={cn(
      "grid size-10 flex-none place-items-center rounded-xl [&_svg]:size-5",
      soluk ? "bg-secondary text-muted-foreground" : "bg-acc-soft text-acc",
      className,
    )}
  >
    {children}
  </span>
);

const satir = "flex w-full items-center gap-3 px-4 py-3 text-left";

/** Liste satırı: simge, başlık, alt yazı, sağda kısa etiket. href yoksa (yakında) soluk ve tıklanmaz. */
export function Satir({
  ders, icon, title, sub, tag, href: to, soluk, external,
}: {
  ders?: string; icon: React.ReactNode; title: React.ReactNode; sub?: React.ReactNode; tag?: React.ReactNode;
  href?: string; soluk?: boolean; external?: boolean;
}) {
  const ic = <Simge soluk={soluk}>{icon}</Simge>;
  const body = (
    <>
      {ic}
      <span className="min-w-0 flex-1">
        <b className={cn("block leading-snug", soluk ? "font-medium text-muted-foreground" : "font-semibold")}>{title}</b>
        {sub && <span className="block truncate text-[13px] text-muted-foreground">{sub}</span>}
      </span>
      {tag}
    </>
  );
  if (!to) return <div className={satir} data-ders={ders}>{body}</div>;
  if (external)
    return <a className={cn(satir, "transition-colors active:bg-secondary")} data-ders={ders} href={to} target="_blank" rel="noopener noreferrer">{body}</a>;
  return <Link className={cn(satir, "transition-colors active:bg-secondary")} data-ders={ders} href={to}>{body}</Link>;
}

export const Ok = () => {
  const N = Icon.ileri;
  return <span className="flex-none text-muted-foreground [&_svg]:size-5"><N /></span>;
};

export { INSTAGRAM };

/** Instagram hesabına giden bağlantı satırı. */
export function InstaLink() {
  const I = Icon.instagram;
  return (
    <Liste>
      <Satir
        external
        href={INSTAGRAM.url}
        icon={<I />}
        title={INSTAGRAM.ad}
        sub="Kısa videolar her hafta Instagram'da"
        tag={<Ok />}
      />
    </Liste>
  );
}

export const href = (d: string, id?: string) => (id ? `/${d}/${id}/` : `/${d}/`);

/** Keşfet ve Kaydedilenler listelerindeki satır. */
export function Row({ e, done }: { e: Entry; done?: boolean }) {
  const I = Icon[e.ders];
  if (!e.id)
    return <Satir ders={e.ders} soluk icon={<I />} title={e.ad} sub={DERSLER[e.ders].ad} tag={<Badge>Yakında</Badge>} />;
  return (
    <Satir
      ders={e.ders}
      href={href(e.ders, e.id)}
      icon={<I />}
      title={e.title}
      sub={`${DERSLER[e.ders].ad}${e.sinav ? ` · ${SINAV_AD[e.sinav]}` : ""} · ${e.summary}`}
      tag={done ? <Badge variant="default">Bitti</Badge> : <span className="flex-none text-xs font-semibold text-muted-foreground">{e.cardCount} kart</span>}
    />
  );
}

/** İçerik metinleri küçük HTML parçaları taşır (<em>, <b>, <sub>...). İçerik bizim yazdığımız, doğrulanmış metindir. */
export const Html = ({ as: Tag = "span", html, className }: { as?: "span" | "h2" | "p" | "div"; html: string; className?: string }) => (
  <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />
);
