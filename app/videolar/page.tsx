import VideoFeed from "@/components/VideoFeed";
import { topic } from "@/lib/content";
import { VIDEOLAR } from "@/lib/videolar";

export const metadata = { title: "Videolar" };

export default function Page() {
  // Akışta her videonun altında konusunun adı yazar; adlar derleme sırasında içerikten alınır.
  const konular = Object.fromEntries(
    VIDEOLAR.map((v) => [v.id, topic(v.yerler[0].ders, v.yerler[0].konu)?.title ?? ""]),
  );
  return <VideoFeed konular={konular} />;
}
