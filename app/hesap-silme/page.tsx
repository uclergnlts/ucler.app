import Link from "next/link";
import { Bolum, GeriTop, Govde } from "@/components/temel";
import { INSTAGRAM } from "@/lib/site";

export const metadata = { title: "Hesabını sil", description: "ucler hesabını ve verilerini nasıl silebileceğin." };

// Google Play'in "hesap silme URL'si" bu sayfa. Uygulamayı kurmadan da okunabilmeli, adımlar sitede de çalışmalı.
export default function Page() {
  return (
    <div className="app">
      <GeriTop to="/profil/" label="Profil'e dön" baslik="Hesabını sil" />
      <Govde className="text-[15px] leading-relaxed">
        <Bolum title="ucler hesabını silmek">
          <p>Hesabını uygulamadan ya da web sitesinden, istediğin zaman kendin silebilirsin:</p>
          <ol className="list-decimal space-y-1 pl-5">
            <li>
              ucler uygulamasını aç ya da{" "}
              <Link href="/profil/ayarlar/" className="font-semibold underline underline-offset-2">ucler.app/profil/ayarlar</Link>{" "}
              adresine git.
            </li>
            <li>Hesabınla giriş yap.</li>
            <li>Profil &gt; Ayarlar&apos;da &quot;Hesabımı sil&quot;e dokun ve onayla.</li>
          </ol>
        </Bolum>
        <Bolum title="Neler silinir">
          <p>
            Hesabın hemen ve kalıcı olarak silinir: e-posta adresin, şifren, adın, bitirdiğin konular, test sonuçların, puanın,
            serin, kaydettiklerin, haftalık lig kaydın ve e-posta tercihlerin. Gönderdiğin &quot;Anlamadım&quot; ya da &quot;Hata
            var&quot; bildirimleri hesabından ayrılır; içerikleri adsız olarak, içeriği düzeltmek için kalabilir.
          </p>
          <p>
            Hesabını silmek aboneliği iptal etmez. Aboneliğin varsa App Store ya da Google Play abonelik ayarlarından iptal et.
          </p>
        </Bolum>
        <Bolum title="Giriş yapamıyorsan">
          <p>
            Hesabına giremiyorsan bize Instagram&apos;dan yaz:{" "}
            <a href={INSTAGRAM.url} target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-2">{INSTAGRAM.ad}</a>.
            Hesabının e-posta adresini belirt; hesabını 7 gün içinde sileriz.
          </p>
        </Bolum>
      </Govde>
    </div>
  );
}
