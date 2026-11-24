import { cev } from "@/lib/dil";
import Link from "next/link";
import { Bolum, GeriTop, Govde, UstEylem } from "@/components/temel";
import { Icon } from "@/components/icons";
import { INSTAGRAM } from "@/lib/site";

export const metadata = { title: cev("Gizlilik"), description: cev("ucler'de verilerin nerede tutulduğu.") };

// Profil'in altından açılır. Metin yalnızca sitenin bugün gerçekten yaptığını anlatır (lib/store.ts, lib/bulut.ts, lib/olay.ts).
export default function Page() {
  return (
    <div className="app">
      <GeriTop to="/profil/" label={cev("Profil'e dön")} baslik={cev("Gizlilik")} sag={<UstEylem href="/profil/ayarlar/" label={cev("Ayarlar")} icon={<Icon.ayar />} />} />
      <Govde className="text-[15px] leading-relaxed">
        <Bolum title={cev("Hesap isteğe bağlı")}>
          <p>{cev("ucler'i hesap açmadan da kullanabilirsin. Hesap açarsan yalnızca e-posta adresini, şifreni ve istersen adını alırız. Google ya da Apple ile girersen şifre almayız. Bu hizmetler bize yalnızca e-posta adresini ve adını verir (Apple ile girerken e-postanı gizlemeyi seçebilirsin).")}</p>
        </Bolum>
        <Bolum title={cev("Veriler nerede tutulur")}>
          <p>
            {cev("Bitirdiğin konular, test sonuçların, puanın, serin, kaydettiğin konular, tekrar sıran ve Profil'e yazdığın ad önce bu tarayıcının kendi deposunda (localStorage) tutulur. Hesabın yoksa bunlar bize gönderilmez.")}
          </p>
          <p>
            {cev("Hesabınla giriş yaptıysan aynı bilgiler, başka cihazlarda da devam edebilmen için hesabına kaydedilir. Hesaplar ve ilerleme Supabase üzerinde, Avrupa Birliği'ndeki (Frankfurt) sunucularda saklanır; şifren şifrelenmiş olarak tutulur ve kimse göremez. Haftalık lig dışında verilerini kimseyle paylaşmayız, reklam için kullanmayız.")}
          </p>
          <p>
            {cev("Bu cihazdaki ilerlemeyi Profil > Ayarlar'daki \"İlerlemeyi sıfırla\" ile silebilirsin. Hesabını ve buluttaki bütün verini aynı ekrandaki \"Hesabımı sil\" ile kalıcı olarak silebilirsin.")}
          </p>
        </Bolum>
        <Bolum title={cev("Haftalık lig")}>
          <p>
            {cev("Hesabın varsa adın (Profil'e yazdığın ad, boşsa \"Öğrenci 4821\" gibi bir takma ad) ve o hafta kazandığın puan haftalık lig listesinde görünür. E-posta adresin ve başka hiçbir bilgin listede yer almaz. Listede görünmek istemezsen Profil > Ayarlar'daki \"Haftalık ligde görün\"ü kapat; o zaman sıranı yalnızca sen görürsün.")}
          </p>
        </Bolum>
        <Bolum title={cev("E-postalar")}>
          <p>
            {cev("Hesabın varsa e-posta adresine yalnızca hesapla ilgili e-postalar (hesap onayı, şifre yenileme), serin bitmek üzereyken akşam bir hatırlatma ve yeni ders, konu ya da video eklenince bir bildirim göndeririz. Bu ikisini Profil > Ayarlar'dan ya da e-postadaki bağlantıdan kapatabilirsin. E-postalar Resend üzerinden gönderilir.")}
          </p>
        </Bolum>
        <Bolum title={cev("Sorun bildirimleri")}>
          <p>
            {cev("Bir yerde ? simgesine dokunup \"Anlamadım\" ya da \"Hata var\" dersen, seçtiğin tür, yazdığın not ve bildirimin yeri (ders, konu, kart ya da soru numarası, cihaz türü) ekibimize gönderilir. Hesabınla giriş yaptıysan bildirim hesabına bağlanır; hesabını silersen bu bağ da silinir. Bildirimleri yalnızca ekip görür ve yalnızca içeriği düzeltmek için kullanır.")}
          </p>
        </Bolum>
        <Bolum title={cev("Kullanım sayımı")}>
          <p>
            {cev("Sitenin ve uygulamanın nasıl kullanıldığını anlamak için Umami ile toplu, anonim bir sayım yapılır (ör. hangi sayfaların açıldığı, hangi kartların \"anlamadım\" diye işaretlendiği). Çerez kullanılmaz; adın, e-posta adresin ya da kim olduğunu gösteren bir bilgi gönderilmez.")}
          </p>
        </Bolum>
        <Bolum title={cev("ucler Plus aboneliği")}>
          <p>
            {cev("Plus aboneliği telefon uygulamasında App Store ya da Google Play üzerinden alınır. Ödeme bilgilerin (kart numaran dahil) yalnızca Apple ya da Google'da kalır; biz görmeyiz. Aboneliğin açık olup olmadığını ve ne zaman bittiğini RevenueCat üzerinden öğreniriz. Hesabınla giriş yaptıysan bu bilgi, web sitesinde de açılabilmesi için hesabına kaydedilir. Hesabını silmek aboneliği iptal etmez; aboneliği mağaza ayarlarından iptal etmen gerekir.")}
          </p>
        </Bolum>
        <Bolum title={cev("Soruların için")}>
          <p>
            {cev("Instagram'dan yazabilirsin:")}{" "}
            <a href={INSTAGRAM.url} target="_blank" rel="noopener noreferrer" className="-my-2.5 inline-block py-2.5 font-semibold underline underline-offset-2">{INSTAGRAM.ad}</a>{cev(". Sitenin ne olduğunu")} <Link href="/hakkinda/" className="-my-2.5 inline-block py-2.5 font-semibold underline underline-offset-2">{cev("Hakkında")}</Link> {cev("sayfasında okuyabilirsin.")}
          </p>
        </Bolum>
      </Govde>
    </div>
  );
}
