import Link from "next/link";
import { Bolum, GeriTop, Govde, UstEylem } from "@/components/temel";
import { Icon } from "@/components/icons";
import { INSTAGRAM } from "@/lib/site";

export const metadata = { title: "Gizlilik", description: "ucler'de verilerin nerede tutulduğu." };

// Profil'in altından açılır. Metin yalnızca sitenin bugün gerçekten yaptığını anlatır (lib/store.ts, lib/bulut.ts, lib/olay.ts).
export default function Page() {
  return (
    <div className="app">
      <GeriTop to="/profil/" label="Profil'e dön" baslik="Gizlilik" sag={<UstEylem href="/profil/ayarlar/" label="Ayarlar" icon={<Icon.ayar />} />} />
      <Govde className="text-[15px] leading-relaxed">
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
            tutulur ve kimse göremez. Haftalık lig dışında verilerini kimseyle paylaşmayız, reklam için kullanmayız.
          </p>
          <p>
            Bu cihazdaki ilerlemeyi Profil &gt; Ayarlar&apos;daki &quot;İlerlemeyi sıfırla&quot; ile silebilirsin. Hesabını ve buluttaki
            bütün verini aynı ekrandaki &quot;Hesabımı sil&quot; ile kalıcı olarak silebilirsin.
          </p>
        </Bolum>
        <Bolum title="Haftalık lig">
          <p>
            Hesabın varsa adın (Profil&apos;e yazdığın ad, boşsa &quot;Öğrenci 4821&quot; gibi bir takma ad) ve o hafta kazandığın puan
            haftalık lig listesinde görünür. E-posta adresin ve başka hiçbir bilgin listede yer almaz. Listede görünmek
            istemezsen Profil &gt; Ayarlar&apos;daki &quot;Haftalık ligde görün&quot;ü kapat; o zaman sıranı yalnızca sen görürsün.
          </p>
        </Bolum>
        <Bolum title="E-postalar">
          <p>
            Hesabın varsa e-posta adresine yalnızca hesapla ilgili e-postalar (hesap onayı, şifre yenileme) , serin bitmek
            üzereyken akşam bir hatırlatma ve yeni ders, konu ya da video eklenince bir bildirim göndeririz. Bu ikisini
            Profil &gt; Ayarlar&apos;dan ya da e-postadaki bağlantıdan kapatabilirsin. E-postalar Resend üzerinden gönderilir.
          </p>
        </Bolum>
        <Bolum title="Sorun bildirimleri">
          <p>
            Bir yerde ? simgesine dokunup &quot;Anlamadım&quot; ya da &quot;Hata var&quot; dersen, seçtiğin tür, yazdığın not ve bildirimin
            yeri (ders, konu, kart ya da soru numarası, cihaz türü) ekibimize gönderilir. Hesabınla giriş yaptıysan bildirim
            hesabına bağlanır; hesabını silersen bu bağ da silinir. Bildirimleri yalnızca ekip görür ve yalnızca içeriği
            düzeltmek için kullanır.
          </p>
        </Bolum>
        <Bolum title="Kullanım sayımı">
          <p>
            Sitenin ve uygulamanın nasıl kullanıldığını anlamak için Umami ile toplu, anonim bir sayım yapılır (ör. hangi
            sayfaların açıldığı, hangi kartların &quot;anlamadım&quot; diye işaretlendiği). Çerez kullanılmaz; adın, e-posta adresin ya da
            kim olduğunu gösteren bir bilgi gönderilmez.
          </p>
        </Bolum>
        <Bolum title="ucler Plus aboneliği">
          <p>
            Plus aboneliği telefon uygulamasında App Store ya da Google Play üzerinden alınır. Ödeme bilgilerin (kart numaran
            dahil) yalnızca Apple ya da Google&apos;da kalır; biz görmeyiz. Aboneliğin açık olup olmadığını ve ne zaman bittiğini
            RevenueCat üzerinden öğreniriz. Hesabınla giriş yaptıysan bu bilgi, web sitesinde de açılabilmesi için hesabına
            kaydedilir. Hesabını silmek aboneliği iptal etmez; aboneliği mağaza ayarlarından iptal etmen gerekir.
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
