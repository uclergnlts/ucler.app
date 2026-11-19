import { cev } from "@/lib/dil";
import Link from "next/link";
import { Bolum, GeriTop, Govde } from "@/components/temel";
import { INSTAGRAM } from "@/lib/site";

export const metadata = { title: cev("Kullanım koşulları"), description: cev("ucler'i kullanma ve ucler Plus aboneliği koşulları.") };

// Plus ekranından (Android) ve Ayarlar'dan açılır. iPhone'da abonelik ekranı ayrıca Apple'ın standart lisansına bağlanır.
export default function Page() {
  return (
    <div className="app">
      <GeriTop to="/profil/ayarlar/" label={cev("Ayarlar'a dön")} baslik={cev("Kullanım koşulları")} />
      <Govde className="text-[15px] leading-relaxed">
        <Bolum title="ucler">
          <p>{cev("ucler, konuları kısa kartlar, etkileşimli adımlar, testler ve videolarla anlatan bir öğrenme uygulamasıdır. Hesap açmadan da kullanılabilir.")}</p>
          <p>{cev("İçerik (metinler, görseller, videolar) ucler'indir. Kendi çalışman için kullanabilirsin. İzin almadan kopyalayıp yayımlayamaz ya da satamazsın.")}</p>
        </Bolum>
        <Bolum title={cev("Ücretsiz ve Plus")}>
          <p>{cev("Her dersin ilk konusu, videolar, oyunlar, ünite ve seviye testleri ücretsizdir. Öteki konular ucler Plus aboneliğiyle açılır.")}</p>
          <p>
            Plus aylık bir aboneliktir ve telefon uygulamasında App Store ya da Google Play üzerinden alınır. İlk kez abone olanlara 7 gün ücretsiz deneme
            verilir; deneme bitmeden en az 24 saat önce iptal edilmezse deneme bitince ilk aylık ücret mağaza hesabından alınır.
            Deneme yoksa ücret, satın almayı onayladığında alınır. Abonelik, dönem bitmeden en az 24 saat önce iptal edilmezse her ay kendiliğinden
            yenilenir ve ücret yeniden alınır. İptal etmek için iPhone&apos;da Ayarlar &gt; adın &gt; Abonelikler, Android&apos;de Google Play &gt;
            Ödemeler ve abonelikler bölümünü kullan. İptal edersen Plus, ödediğin dönemin sonuna kadar açık kalır.
          </p>
          <p>{cev("İade istekleri Apple ya da Google'ın kendi kurallarına göre, onların üzerinden yapılır. Hesabını silmek aboneliği iptal etmez.")}</p>
          <p>{cev("Fiyat değişirse mağaza seni önceden bilgilendirir. Yeni fiyat ancak senin onayınla ya da mağazanın kurallarına göre uygulanır.")}</p>
        </Bolum>
        <Bolum title={cev("Değişiklikler ve iletişim")}>
          <p>{cev("Konular ve özellikler zamanla eklenir, değişebilir. Bu koşullar değişirse bu sayfada yazılır.")}</p>
          <p>
            {cev("Soruların için Instagram'dan yazabilirsin:")}{" "}
            <a href={INSTAGRAM.url} target="_blank" rel="noopener noreferrer" className="-my-2.5 inline-block py-2.5 font-semibold underline underline-offset-2">{INSTAGRAM.ad}</a>{cev(". Verilerinin nasıl tutulduğu")} <Link href="/gizlilik/" className="-my-2.5 inline-block py-2.5 font-semibold underline underline-offset-2">{cev("Gizlilik")}</Link> {cev("sayfasında.")}
          </p>
        </Bolum>
      </Govde>
    </div>
  );
}
