"use client";
import { DERSLER, DERS_IDS, type DersId, type Entry, isDers } from "@/lib/dersler";
import { doneKeys, gunAdi, resetAll, setAd, toggleAnlamadim, useAd, useAnlamadim, useProg, useSaved, useStorageOk, useTekrar } from "@/lib/store";
import { Icon } from "./icons";
import { girisYap, seri, usePuan, type Gun } from "@/lib/puan";
import { gun } from "@/lib/store";
import Link from "next/link";
import { Bolum, Bos, Govde, href, Html, INSTAGRAM, Liste, Ok, PageHead, Row, Satir, Simge, Top } from "./temel";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./ui/dialog";

export default function Profile({ all, basliklar }: { all: Record<DersId, Entry[]>; basliklar: Record<string, string[]> }) {
  const puan = usePuan();
  const prog = useProg(), saved = useSaved(), storageOk = useStorageOk(), ad = useAd(), anlamadim = useAnlamadim();
  const done = doneKeys(prog).filter((k) => /\//.test(prog[k]));
  let right = 0, total = 0;
  for (const k of done) {
    const m = String(prog[k]).match(/(\d+)\/(\d+)/);
    if (m) { right += +m[1]; total += +m[2]; }
  }
  const User = Icon.profil;
  const savedList = saved.flatMap((k) => {
    const [d, id] = k.split(".");
    const e = isDers(d) ? all[d].find((x) => x.id === id) : undefined;
    return e ? [e] : [];
  });
  // "ders.konu.kart no" → konu ve kart başlığı; silinmiş kartlar atlanır.
  const anlamadimList = anlamadim.flatMap((k) => {
    const [d, id, no] = k.split(".");
    const e = isDers(d) ? all[d].find((x) => x.id === id) : undefined;
    const h = basliklar[`${d}.${id}`]?.[+no - 1];
    return e && h ? [{ k, e, no: +no, h }] : [];
  });
  const Soru = Icon.soru, Kapat = Icon.kapat, TekrarI = Icon.tekrar, Kitap = Icon.kitap, Insta = Icon.instagram, Bulb = Icon.bulb, Kilit = Icon.kilit;
  const tekrar = useTekrar();
  const sira = Object.values(tekrar).map((x) => x.g).sort(), kalan = sira.length;
  // Ders başına: bitirilen konu sayısı ve testlerdeki doğru oranı.
  const dersOran = DERS_IDS.map((d) => {
    let r = 0, t = 0, n = 0;
    for (const k of done) {
      if (!k.startsWith(`${d}.`)) continue;
      const m = String(prog[k]).match(/(\d+)\/(\d+)/);
      n++;
      if (m) { r += +m[1]; t += +m[2]; }
    }
    return { d, n, toplam: all[d].filter((e) => e.id).length, oran: t ? Math.round((100 * r) / t) : null };
  });

  return (
    <div className="app">
      <Top />
      <Govde>
        <PageHead title="Profil" />
        <section className="flex items-center gap-3.5">
          <span className="grid size-14 flex-none place-items-center rounded-full bg-secondary text-muted-foreground [&_svg]:size-7"><User /></span>
          <span className="min-w-0 flex-1">
            <label htmlFor="ad" className="block text-[13px] font-semibold text-muted-foreground">Sana nasıl hitap edelim?</label>
            <input
              id="ad"
              className="block w-full border-0 border-b border-dashed border-border-strong bg-transparent py-0.5 font-display text-xl font-extrabold text-foreground outline-none placeholder:font-bold placeholder:text-muted-foreground focus:border-solid focus:border-foreground"
              defaultValue={ad}
              key={ad}
              placeholder="Adın"
              maxLength={30}
              onBlur={(e) => setAd(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur(); }}
            />
            <span className="text-sm text-muted-foreground">
              {storageOk
                ? "İlerlemen şimdilik yalnızca bu cihazda saklanıyor."
                : "Tarayıcın kayıt tutmaya izin vermiyor. İlerlemen ve kaydettiklerin sayfayı yenilersen ya da sekmeyi kapatırsan silinir."}
            </span>
          </span>
        </section>
        <Card className="grid grid-cols-3 gap-0 py-0 [&>div]:border-border [&>div:nth-child(-n+3)]:border-b [&>div:not(:nth-child(3n+1))]:border-l">
          {([
            [puan.toplam ?? 0, "puan"], [`${seri(puan)} gün`, "seri"], [`${puan.enUzun ?? 0} gün`, "en uzun seri"],
            [done.length, "konu bitti"], [total ? `%${Math.round((100 * right) / total)}` : "–", "doğru cevap"], [saved.length, "kaydedilen konu"],
          ] as const).map(([b, l]) => (
            <div key={l} className="px-2 py-3.5 text-center">
              <b className="block font-display text-2xl leading-tight font-extrabold">{b}</b>
              <span className="text-xs font-semibold text-muted-foreground">{l}</span>
            </div>
          ))}
        </Card>
        <Liste>
          <Satir
            href="/tekrar/"
            icon={<TekrarI />}
            title="Tekrar sırası"
            sub={kalan ? `${kalan} soru · ilki ${gunAdi(sira[0])}` : "Testte yanlış yaptığın sorular burada toplanır"}
            tag={<Ok />}
          />
          {done.length > 0 && (
            <Satir href="/tekrar/?karisik" icon={<Kitap />} title="Karışık test" sub="Bitirdiğin konulardan rastgele 10 soru" tag={<Ok />} />
          )}
        </Liste>
        <HaftalikPuan gunler={puan.gunler ?? {}} />
        <Bolum title="Kaydedilenler" id="kaydedilenler">
          {savedList.length ? (
            <Liste>
              {savedList.map((e) => <Row key={`${e.ders}.${e.id}`} e={e} done={!!prog[`${e.ders}.${e.id}`]} />)}
            </Liste>
          ) : (
            <Bos>Henüz kaydettiğin bir konu yok. Ders ekranında sağ üstteki ya da videonun altındaki işaret simgesine dokunarak konuyu buraya ekleyebilirsin.</Bos>
          )}
        </Bolum>
        <Bolum title="Anlamadığım kartlar" id="anlamadim">
          {anlamadimList.length ? (
            <Liste>
              {anlamadimList.map(({ k, e, no, h }) => (
                <div key={k} className="flex items-center" data-ders={e.ders}>
                  <Link href={`${href(e.ders, e.id)}?kart=${no}`} className="flex min-w-0 flex-1 items-center gap-3 py-3 pl-4 transition-colors active:bg-secondary">
                    <Simge><Soru /></Simge>
                    <span className="min-w-0 flex-1">
                      <Html as="span" className="block leading-snug font-semibold" html={h} />
                      <span className="block truncate text-[13px] text-muted-foreground">{e.title} · {no}. kart</span>
                    </span>
                  </Link>
                  <button className="grid size-11 flex-none place-items-center text-muted-foreground [&_svg]:size-4" aria-label="İşareti kaldır" onClick={() => toggleAnlamadim(k)}>
                    <Kapat />
                  </button>
                </div>
              ))}
            </Liste>
          ) : (
            <Bos>Bir kartı anlamadıysan ders ekranında sağ üstteki ? simgesine dokun. Kart buraya gelir, sonra dönüp yeniden bakabilirsin.</Bos>
          )}
        </Bolum>
        <Bolum title="Derslere göre doğru oranı">
          <Card className="grid gap-3.5 px-4 py-3.5">
            {dersOran.map(({ d, n, toplam, oran }) => (
              <div key={d} className="grid gap-1.5" data-ders={d}>
                <div className="flex justify-between text-[15px] font-semibold">
                  {DERSLER[d].ad}
                  <span className="text-[13px] font-medium text-muted-foreground">
                    {oran === null ? `Henüz test yok · ${toplam} konu` : `%${oran} doğru · ${n} / ${toplam} konu`}
                  </span>
                </div>
                <Progress value={oran ?? 0} label={oran === null ? `${DERSLER[d].ad}: henüz test yok` : `${DERSLER[d].ad}: yüzde ${oran} doğru`} />
              </div>
            ))}
          </Card>
        </Bolum>
        <Bolum title="ucler">
          <Liste>
            <Satir href="/hakkinda/" icon={<Bulb />} title="Hakkında" sub="ucler nedir, nasıl kullanılır" tag={<Ok />} />
            <Satir href="/gizlilik/" icon={<Kilit />} title="Gizlilik" sub="Verilerin nerede tutulur" tag={<Ok />} />
            <Satir external href={INSTAGRAM.url} icon={<Insta />} title="İletişim" sub={`Instagram'da ${INSTAGRAM.ad}`} tag={<Ok />} />
          </Liste>
        </Bolum>
        <Bolum title="Hesap">
          <p className="text-[14px] text-muted-foreground">Hesap yakında. Şimdilik ilerlemen, puanın ve serin yalnızca bu cihazda tutulur.</p>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className="mt-2 justify-self-start px-0 text-bad hover:bg-transparent">İlerlemeyi sıfırla</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>İlerlemen silinsin mi?</DialogTitle>
              <DialogDescription>
                Bitirdiğin konular, puanın, serin, kaydettiğin konular, tekrar sıran ve işaretlediğin kartlar bu cihazdan silinir. Bu geri alınamaz.
              </DialogDescription>
              <div className="mt-2 grid gap-2">
                <DialogClose asChild>
                  <Button
                    className="bg-bad text-white hover:bg-bad/90"
                    onClick={() => {
                      resetAll();
                      // Sıfırlama yeni bir başlangıç: bugünün görevleri hemen yeniden kurulur, giriş puanı yeniden verilir.
                      girisYap();
                    }}
                  >
                    Evet, sıfırla
                  </Button>
                </DialogClose>
                <DialogClose asChild><Button variant="ghost">Vazgeç</Button></DialogClose>
              </div>
            </DialogContent>
          </Dialog>
        </Bolum>
      </Govde>
    </div>
  );
}

const GUN_ADI = ["Pz", "Pt", "Sa", "Ça", "Pe", "Cu", "Ct"];

/** Son 7 günün puanı: tek seri sütun grafik; bugünün sütunu koyu, değeri üstünde yazar. */
function HaftalikPuan({ gunler }: { gunler: Record<string, Gun> }) {
  const g = Array.from({ length: 7 }, (_, k) => {
    const t = gun(k - 6);
    return { t, ad: GUN_ADI[new Date(Date.parse(t + "T12:00:00")).getDay()], p: gunler[t]?.p ?? 0, bugun: k === 6 };
  });
  const max = Math.max(20, ...g.map((x) => x.p)), toplam = g.reduce((n, x) => n + x.p, 0);
  return (
    <Bolum title="Son 7 gün" more={<span className="text-sm font-bold tabular-nums text-muted-foreground">{toplam} puan</span>}>
      <Card className="px-4 pt-4 pb-3">
        <ol className="flex h-36 items-end gap-2" aria-label="Son 7 günün puanı">
          {g.map((x) => (
            <li key={x.t} className="group relative grid h-full flex-1 grid-rows-[1fr_auto] justify-items-center gap-1.5" title={`${x.ad}: ${x.p} puan`}>
              <span className="flex w-full flex-col items-center justify-end">
                {(x.bugun || x.p === max) && x.p > 0 && <span className="mb-1 text-[11px] font-bold tabular-nums text-muted-foreground">{x.p}</span>}
                <span
                  className={x.bugun ? "w-full max-w-7 rounded-t-[4px] bg-[var(--c1)]" : "w-full max-w-7 rounded-t-[4px] bg-[#a9c8fb] group-hover:bg-[#7fadf9]"}
                  style={{ height: `${Math.max(x.p ? 4 : 2, (100 * x.p) / max)}%` }}
                />
              </span>
              <span className={x.bugun ? "text-[11px] font-bold" : "text-[11px] font-semibold text-muted-foreground"}>{x.ad}</span>
            </li>
          ))}
        </ol>
      </Card>
    </Bolum>
  );
}
