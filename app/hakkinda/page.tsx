import { cev } from "@/lib/dil";
import Link from "next/link";
import { Bolum, GeriTop, Govde, UstEylem } from "@/components/temel";
import { Icon } from "@/components/icons";
import { INSTAGRAM } from "@/lib/site";

export const metadata = { title: cev("Hakkında"), description: cev("ucler nedir, nasıl kullanılır.") };

// Profil'in altından açılır (alt menüye eklenmez; bkz. docs/KARARLAR.md).
export default function Page() {
  return (
    <div className="app">
      <GeriTop to="/profil/" label={cev("Profil'e dön")} baslik={cev("Hakkında")} sag={<UstEylem external href={INSTAGRAM.url} label={cev("Instagram: {0}", INSTAGRAM.ad)} icon={<Icon.instagram />} />} />
      <Govde className="text-[15px] leading-relaxed">
        <p>
          {cev("ucler, fizik, kimya ve biyolojiyi en temelden anlatan bir öğrenme uygulamasıdır. Konular kısa ve görselli kartlarla anlatılır. Her ders en temelden başlar ve üniversitenin ilk yılına kadar gider. İçerik ve görünüm geliştirilmeye devam ediyor.")}
        </p>
        <Bolum title={cev("Nasıl kullanılır?")}>
          <ol className="grid list-decimal gap-2 pl-5">
            <li>{cev("Ana sayfadan ya da")} <Link href="/kesfet/" className="-my-2.5 inline-block py-2.5 font-semibold underline underline-offset-2">{cev("Keşfet")}</Link>{cev("'ten bir konu seç. Konular sırayla önerilir ama istediğine atlayabilirsin.")}</li>
            <li>{cev("Her konu birkaç aşamadan oluşur. Kartları oku, aradaki küçük görevleri çöz.")}</li>
            <li>{cev("Konunun sonunda 4 soruluk mini test var. Konuyu biliyorsan teste doğrudan da geçebilirsin.")}</li>
            <li>{cev("Yanlış yaptığın sorular tekrar sırana girer ve birkaç gün arayla yeniden sorulur. Ana sayfada \"Tekrar zamanı\" olarak görünür.")}</li>
            <li>{cev("Anlamadığın kartı sağ üstteki ? simgesiyle işaretle. Kart, Profil'deki Anlamadıklarım ekranında listelenir.")}</li>
          </ol>
        </Bolum>
        <Bolum title={cev("İletişim")}>
          <p>
            {cev("Soru, öneri ya da hata bildirimi için Instagram'dan yazabilirsin:")}{" "}
            <a href={INSTAGRAM.url} target="_blank" rel="noopener noreferrer" className="-my-2.5 inline-block py-2.5 font-semibold underline underline-offset-2">{INSTAGRAM.ad}</a>
          </p>
        </Bolum>
        <p className="text-muted-foreground">
          {cev("Verilerinin nasıl tutulduğunu")} <Link href="/gizlilik/" className="-my-2.5 inline-block py-2.5 font-semibold underline underline-offset-2">{cev("Gizlilik")}</Link> {cev("sayfasında okuyabilirsin.")}
        </p>
      </Govde>
    </div>
  );
}
