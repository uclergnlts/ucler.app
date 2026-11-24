import { cev } from "@/lib/dil";
import Link from "next/link";
import { Bolum, GeriTop, Govde } from "@/components/temel";
import { INSTAGRAM } from "@/lib/site";

export const metadata = { title: cev("Hesabını sil"), description: cev("ucler hesabını ve verilerini nasıl silebileceğin.") };

// Google Play'in "hesap silme URL'si" bu sayfa. Uygulamayı kurmadan da okunabilmeli, adımlar sitede de çalışmalı.
export default function Page() {
  return (
    <div className="app">
      <GeriTop to="/profil/" label={cev("Profil'e dön")} baslik={cev("Hesabını sil")} />
      <Govde className="text-[15px] leading-relaxed">
        <Bolum title={cev("ucler hesabını silmek")}>
          <p>{cev("Hesabını uygulamadan ya da web sitesinden, istediğin zaman kendin silebilirsin:")}</p>
          <ol className="list-decimal space-y-1 pl-5">
            <li>
              {cev("ucler uygulamasını aç ya da")}{" "}
              <Link href="/profil/ayarlar/" className="font-semibold underline underline-offset-2">{cev("ucler.app/profil/ayarlar")}</Link>{" "}
              {cev("adresine git.")}
            </li>
            <li>{cev("Hesabınla giriş yap.")}</li>
            <li>{cev("Profil > Ayarlar'da \"Hesabımı sil\"e dokun ve onayla.")}</li>
          </ol>
        </Bolum>
        <Bolum title={cev("Neler silinir")}>
          <p>
            {cev("Hesabın hemen ve kalıcı olarak silinir: e-posta adresin, şifren, adın, bitirdiğin konular, test sonuçların, puanın, serin, kaydettiklerin, haftalık lig kaydın ve e-posta tercihlerin. Gönderdiğin \"Anlamadım\" ya da \"Hata var\" bildirimleri hesabından ayrılır; içerikleri adsız olarak, içeriği düzeltmek için kalabilir.")}
          </p>
          <p>
            {cev("Hesabını silmek aboneliği iptal etmez. Aboneliğin varsa App Store ya da Google Play abonelik ayarlarından iptal et.")}
          </p>
        </Bolum>
        <Bolum title={cev("Giriş yapamıyorsan")}>
          <p>
            {cev("Hesabına giremiyorsan bize Instagram'dan yaz:")}{" "}
            <a href={INSTAGRAM.url} target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-2">{INSTAGRAM.ad}</a>{cev(". Hesabının e-posta adresini belirt; hesabını 7 gün içinde sileriz.")}
          </p>
        </Bolum>
      </Govde>
    </div>
  );
}
