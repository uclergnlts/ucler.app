import Link from "next/link";
import { Bolum, GeriTop, Govde } from "@/components/temel";
import { INSTAGRAM } from "@/lib/site";

export const metadata = { title: "Kullanım koşulları", description: "ucler'i kullanma ve ucler Plus aboneliği koşulları." };

// Plus ekranından (Android) ve Ayarlar'dan açılır. iPhone'da abonelik ekranı ayrıca Apple'ın standart lisansına bağlanır.
export default function Page() {
  return (
    <div className="app">
      <GeriTop to="/profil/ayarlar/" label="Ayarlar'a dön" baslik="Kullanım koşulları" />
      <Govde className="text-[15px] leading-relaxed">
        <Bolum title="ucler">
          <p>ucler, konuları kısa kartlar, etkileşimli adımlar, testler ve videolarla anlatan bir öğrenme uygulamasıdır. Hesap açmadan da kullanılabilir.</p>
          <p>İçerik (metinler, görseller, videolar) ucler&apos;indir. Kendi çalışman için kullanabilirsin; izin almadan kopyalayıp yayımlayamaz ya da satamazsın.</p>
        </Bolum>
        <Bolum title="Ücretsiz ve Plus">
          <p>Her dersin ilk konusu, videolar, oyunlar, ünite ve seviye testleri ücretsizdir. Öteki konular ucler Plus aboneliğiyle açılır.</p>
          <p>
            Plus aylık bir aboneliktir ve telefon uygulamasında App Store ya da Google Play üzerinden alınır. İlk kez abone olanlara 7 gün ücretsiz deneme
            verilir; deneme bitmeden en az 24 saat önce iptal edilmezse deneme bitince ilk aylık ücret mağaza hesabından alınır.
            Deneme yoksa ücret, satın almayı onayladığında alınır. Abonelik, dönem bitmeden en az 24 saat önce iptal edilmezse her ay kendiliğinden
            yenilenir ve ücret yeniden alınır. İptal etmek için iPhone&apos;da Ayarlar &gt; adın &gt; Abonelikler, Android&apos;de Google Play &gt;
            Ödemeler ve abonelikler bölümünü kullan. İptal edersen Plus, ödediğin dönemin sonuna kadar açık kalır.
          </p>
          <p>İade istekleri Apple ya da Google&apos;ın kendi kurallarına göre, onların üzerinden yapılır. Hesabını silmek aboneliği iptal etmez.</p>
          <p>Fiyat değişirse mağaza seni önceden bilgilendirir; yeni fiyat ancak senin onayınla ya da mağazanın kurallarına göre uygulanır.</p>
        </Bolum>
        <Bolum title="Değişiklikler ve iletişim">
          <p>Konular ve özellikler zamanla eklenir, değişebilir. Bu koşullar değişirse bu sayfada yazılır.</p>
          <p>
            Soruların için Instagram&apos;dan yazabilirsin:{" "}
            <a href={INSTAGRAM.url} target="_blank" rel="noopener noreferrer" className="-my-2.5 inline-block py-2.5 font-semibold underline underline-offset-2">{INSTAGRAM.ad}</a>.
            Verilerinin nasıl tutulduğu <Link href="/gizlilik/" className="-my-2.5 inline-block py-2.5 font-semibold underline underline-offset-2">Gizlilik</Link> sayfasında.
          </p>
        </Bolum>
      </Govde>
    </div>
  );
}
