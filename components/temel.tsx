"use client";
// Sayfaların ortak parçaları: logo, üst çubuk, sayfa başlığı, liste satırı. Görünüm shadcn/ui + Tailwind,
// hareket Motion ile. Sade: beyaz zemin, 1px çizgiler, renk yalnızca küçük vurgularda (docs/KARARLAR.md).
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { sekmeRengi } from "./Tabs";
import { motion, type HTMLMotionProps } from "motion/react";
import { DERSLER, type Entry } from "@/lib/dersler";
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

/** Üst çubuk: logo Ana sayfaya götürür; children sağa yaslanır (Ana sayfada seri ve görev simgeleri). */
export const Top = ({ children }: { children?: React.ReactNode }) => (
  <header className="top">
    <Link href="/" aria-label="ucler, Ana sayfa" className="rounded-lg"><Logo /></Link>
    {children}
  </header>
);

/**
 * Uygulama üst çubuğu (iOS/Android gibi): solda geri, yanında başlık, sağda o ekranın işi olan düğmeler.
 * Sayfa kaydırılınca altında ince çizgi belirir. Başlık sayfanın h1'idir.
 */
export function UstBar({ geri, baslik, sag }: {
  geri?: { to: string; label: string };
  baslik: React.ReactNode;
  sag?: React.ReactNode;
}) {
  const Back = Icon.back;
  const [kaydi, setKaydi] = useState(false);
  useEffect(() => {
    const f = () => setKaydi(window.scrollY > 4);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  return (
    <header className={cn("top ust-bar", !geri && "ust-kok", kaydi && "kaydi")}>
      {geri && (
        <Button asChild variant="ghost" size="icon" className="flex-none text-foreground">
          <Link href={geri.to} aria-label={geri.label}><Back /></Link>
        </Button>
      )}
      <h1 className="ust-baslik">{baslik}</h1>
      {sag && <div className="flex flex-none items-center">{sag}</div>}
    </header>
  );
}

/** Üst çubuğun sağındaki simge düğmesi: href verilirse bağlantı, yoksa düğme. */
export function UstEylem({ icon, label, href: to, onClick, aktif, external }: {
  icon: React.ReactNode; label: string; href?: string; onClick?: () => void; aktif?: boolean; external?: boolean;
}) {
  // Simge bulunduğu sekmenin rengini alır (alt menüyle aynı); ders sayfasında dersin rengi.
  const renk = sekmeRengi(usePathname()) ?? "var(--acc)";
  const cls = cn("hover:bg-secondary", aktif && "[&_svg]:fill-current");
  const style = { color: renk };
  if (to && external)
    return <Button asChild variant="ghost" size="icon" className={cls}><a href={to} target="_blank" rel="noopener noreferrer" aria-label={label} title={label} style={style}>{icon}</a></Button>;
  if (to)
    return <Button asChild variant="ghost" size="icon" className={cls}><Link href={to} aria-label={label} title={label} style={style}>{icon}</Link></Button>;
  return <Button variant="ghost" size="icon" className={cls} aria-label={label} title={label} style={style} onClick={onClick}>{icon}</Button>;
}

/** Eski ad: yalnızca geri düğmesi olan üst çubuk. */
export const GeriTop = ({ to, label, baslik, sag }: { to: string; label: string; baslik: React.ReactNode; sag?: React.ReactNode }) => (
  <UstBar geri={{ to, label }} baslik={baslik} sag={sag} />
);

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

/** Sayfanın kısa açıklaması (başlık üst çubukta, UstBar). */
export const PageHead = ({ text }: { text?: string }) =>
  text ? <p className="text-[15px] text-muted-foreground">{text}</p> : null;

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
export const Simge = ({ children, soluk, className, renk }: { children: React.ReactNode; soluk?: boolean; className?: string; renk?: string }) => (
  <span
    style={renk && !soluk ? { color: renk, backgroundColor: `color-mix(in srgb, ${renk} 13%, white)` } : undefined}
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
  ders, icon, title, sub, tag, href: to, soluk, external, renk,
}: {
  ders?: string; icon: React.ReactNode; title: React.ReactNode; sub?: React.ReactNode; tag?: React.ReactNode;
  href?: string; soluk?: boolean; external?: boolean; renk?: string;
}) {
  const ic = <Simge soluk={soluk} renk={renk}>{icon}</Simge>;
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
      sub={`${DERSLER[e.ders].ad} · ${e.summary}`}
      tag={done ? <Badge variant="default">Bitti</Badge> : <span className="flex-none text-xs font-semibold text-muted-foreground">{e.cardCount} kart</span>}
    />
  );
}

/** İçerik metinleri küçük HTML parçaları taşır (<em>, <b>, <sub>...). İçerik bizim yazdığımız, doğrulanmış metindir. */
export const Html = ({ as: Tag = "span", html, className }: { as?: "span" | "h2" | "p" | "div"; html: string; className?: string }) => (
  <Tag className={className} dangerouslySetInnerHTML={{ __html: birimBagla(html) }} />
);

/** Sayı ile birimi aynı satırda tutar ("2,7 g/cm³" kırılıp "2,7" bir satırda, "g/cm³" ötekinde kalmasın).
 *  Yalnızca etiket dışındaki metne dokunur; SVG ve öznitelikler değişmez. */
const birimBagla = (html: string) =>
  html.includes("<svg") ? html : html.replace(/(^|>)([^<]+)/g, (_, a: string, t: string) => a + t.replace(/(\d) (?=[a-zA-ZµμΩ°%‰Å])/g, "$1\u00a0"));
