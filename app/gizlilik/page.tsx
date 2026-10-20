import Link from "next/link";
import { Bolum, GeriTop, Govde, PageHead } from "@/components/temel";
import { INSTAGRAM } from "@/lib/site";

export const metadata = { title: "Gizlilik", description: "ucler'de verilerin nerede tutulduğu." };

// Profil'in altından açılır. Metin yalnızca sitenin bugün gerçekten yaptığını anlatır (lib/store.ts, lib/olay.ts).
export default function Page() {
  return (
    <div className="app">
      <GeriTop to="/profil/" label="Profil'e dön" />
      <Govde className="text-[15px] leading-relaxed">
        <PageHead title="Gizlilik" />
        <Bolum title="Hesap yok">
          <p>ucler&apos;i kullanmak için hesap açman, ad, e-posta ya da telefon vermen gerekmez.</p>
        </Bolum>
        <Bolum title="Veriler yalnızca bu cihazda">
          <p>
            Bitirdiğin konular, test sonuçların, puanın, serin, kaydettiğin konular, tekrar sıran ve Profil&apos;e yazdığın ad
            yalnızca bu tarayıcının kendi deposunda (localStorage) tutulur. Bunlar bize gönderilmez; başka bir cihazda ya da
            başka bir tarayıcıda görünmez.
          </p>
          <p>
            Hepsini Profil &gt; Ayarlar&apos;daki &quot;İlerlemeyi sıfırla&quot; ile ya da tarayıcının site verilerini silerek kaldırabilirsin.
          </p>
        </Bolum>
        <Bolum title="Kullanım sayımı">
          <p>
            Şu an hiçbir kullanım verisi toplanmıyor. İleride sitenin nasıl kullanıldığını anlamak için anonim bir sayım
            (ör. hangi kartların &quot;anlamadım&quot; diye işaretlendiği) eklenebilir. Bu sayımda adın ya da kim olduğunu
            gösteren bir bilgi gönderilmez. Sayım eklenirse burada yazılır.
          </p>
        </Bolum>
        <Bolum title="Soruların için">
          <p>
            Instagram&apos;dan yazabilirsin:{" "}
            <a href={INSTAGRAM.url} target="_blank" rel="noopener noreferrer" className="-my-2.5 inline-block py-2.5 font-semibold underline underline-offset-2">{INSTAGRAM.ad}</a>.
            Sitenin ne olduğunu <Link href="/hakkinda/" className="-my-2.5 inline-block py-2.5 font-semibold underline underline-offset-2">Hakkında</Link> sayfasında okuyabilirsin.
          </p>
        </Bolum>
      </Govde>
    </div>
  );
}
