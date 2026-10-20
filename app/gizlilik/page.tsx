import Link from "next/link";
import { Bolum, GeriTop, Govde, PageHead } from "@/components/temel";
import { INSTAGRAM } from "@/lib/site";

export const metadata = { title: "Gizlilik", description: "ucler'de verilerin nerede tutulduğu." };

// Profil'in altından açılır. Metin yalnızca sitenin bugün gerçekten yaptığını anlatır (lib/store.ts, lib/bulut.ts, lib/olay.ts).
export default function Page() {
  return (
    <div className="app">
      <GeriTop to="/profil/" label="Profil'e dön" />
      <Govde className="text-[15px] leading-relaxed">
        <PageHead title="Gizlilik" />
        <Bolum title="Hesap isteğe bağlı">
          <p>ucler&apos;i hesap açmadan da kullanabilirsin. Hesap açarsan yalnızca e-posta adresini, şifreni ve istersen adını alırız.</p>
        </Bolum>
        <Bolum title="Veriler nerede tutulur">
          <p>
            Bitirdiğin konular, test sonuçların, puanın, serin, kaydettiğin konular, tekrar sıran ve Profil&apos;e yazdığın ad
            önce bu tarayıcının kendi deposunda (localStorage) tutulur. Hesabın yoksa bunlar bize gönderilmez.
          </p>
          <p>
            Hesabınla giriş yaptıysan aynı bilgiler, başka cihazlarda da devam edebilmen için hesabına kaydedilir. Hesaplar ve
            ilerleme Supabase üzerinde, Avrupa Birliği&apos;ndeki (Frankfurt) sunucularda saklanır; şifren şifrelenmiş olarak
            tutulur ve kimse göremez. Verilerini kimseyle paylaşmayız, reklam için kullanmayız.
          </p>
          <p>
            Bu cihazdaki ilerlemeyi Profil &gt; Ayarlar&apos;daki &quot;İlerlemeyi sıfırla&quot; ile silebilirsin. Hesabını ve buluttaki
            bütün verini aynı ekrandaki &quot;Hesabımı sil&quot; ile kalıcı olarak silebilirsin.
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
