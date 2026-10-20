import Link from "next/link";
import { Bolum, GeriTop, Govde, PageHead } from "@/components/temel";
import { INSTAGRAM } from "@/lib/site";

export const metadata = { title: "Hakkında", description: "ucler nedir, nasıl kullanılır." };

// Profil'in altından açılır (alt menüye eklenmez; bkz. docs/KARARLAR.md).
export default function Page() {
  return (
    <div className="app">
      <GeriTop to="/profil/" label="Profil'e dön" />
      <Govde className="text-[15px] leading-relaxed">
        <PageHead title="Hakkında" />
        <p>
          ucler, fizik, kimya ve biyolojiyi en temelden anlatan bir öğrenme sitesi. Konular kısa, görselli kartlarla anlatılır;
          9. sınıftan üniversitenin ilk yıllarına kadar herkes için yazıldı ve YKS&apos;nin konularını kapsamayı amaçlar.
          Site şu an deneme sürümünde; içerik ve görünüm geliştirilmeye devam ediyor.
        </p>
        <Bolum title="Nasıl kullanılır?">
          <ol className="grid list-decimal gap-2 pl-5">
            <li>Ana sayfadan ya da <Link href="/kesfet/" className="font-semibold underline underline-offset-2">Keşfet</Link>&apos;ten bir konu seç. Konular sırayla önerilir ama istediğine atlayabilirsin.</li>
            <li>Her konu birkaç aşamadan oluşur. Kartları oku, aradaki küçük görevleri çöz.</li>
            <li>Konunun sonunda 4 soruluk mini test var. Konuyu biliyorsan teste doğrudan da geçebilirsin.</li>
            <li>Yanlış yaptığın sorular tekrar sırana girer ve birkaç gün arayla yeniden sorulur. Ana sayfada &quot;Tekrar zamanı&quot; olarak görünür.</li>
            <li>Anlamadığın kartı sağ üstteki ? simgesiyle işaretle; Profil&apos;de listelenir.</li>
          </ol>
        </Bolum>
        <Bolum title="İletişim">
          <p>
            Soru, öneri ya da hata bildirimi için Instagram&apos;dan yazabilirsin:{" "}
            <a href={INSTAGRAM.url} target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-2">{INSTAGRAM.ad}</a>
          </p>
        </Bolum>
        <p className="text-muted-foreground">
          Verilerinin nasıl tutulduğunu <Link href="/gizlilik/" className="font-semibold underline underline-offset-2">Gizlilik</Link> sayfasında okuyabilirsin.
        </p>
      </Govde>
    </div>
  );
}
