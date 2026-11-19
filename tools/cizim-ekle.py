#!/usr/bin/env python3
"""YouTube videosundaki gravür çizimlerini sitedeki galeriye ekler (/drawings/, /tr/cizimler/).

Kullanım:
    python3 tools/cizim-ekle.py <video-id> <png-klasoru>
    örnek: python3 tools/cizim-ekle.py yt06 /mnt/project-files/youtube-yatay/yeni-video/gravurler

Her PNG için iki WebP yazar: public/cizim/<video>/<ad>.webp (1440 px, büyük görünüm) ve <ad>-k.webp (640 px, ızgara).
content/cizimler.json içine eksik çizimleri boş adlarla ekler. Video yoksa videolar listesinin başına iskelet ekler;
başlığını, YouTube kimliğini, tarihini ve çizim adlarını (tr/en, en çok 4-5 kelime) elle doldur.
Pillow gerekir (pip install pillow). Yalnızca geliştirme aracıdır; CI'da çalışmaz.
"""
import json
import sys
from pathlib import Path

from PIL import Image

KOK = Path(__file__).resolve().parent.parent
VERI = KOK / "content" / "cizimler.json"
BUYUK, KUCUK = 1440, 640


def yaz(img: Image.Image, gen: int, hedef: Path, kalite: int) -> None:
    y = round(img.height * gen / img.width)
    img.resize((gen, y), Image.LANCZOS).save(hedef, "WEBP", quality=kalite, method=6)


def main() -> None:
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    video, klasor = sys.argv[1], Path(sys.argv[2])
    pngler = sorted(p for p in klasor.iterdir() if p.suffix.lower() in (".png", ".jpg", ".jpeg"))
    if not pngler:
        sys.exit(f"{klasor} içinde PNG/JPG yok")
    cikti = KOK / "public" / "cizim" / video
    cikti.mkdir(parents=True, exist_ok=True)

    veri = json.loads(VERI.read_text(encoding="utf-8"))
    if not any(v["id"] == video for v in veri["videolar"]):
        veri["videolar"].insert(0, {"id": video, "baslik": {"en": "", "tr": ""}, "youtube": "", "tarih": ""})
    var = {(c["video"], c["id"]) for c in veri["cizimler"]}
    yeni = []
    for p in pngler:
        img = Image.open(p).convert("RGB")
        yaz(img, BUYUK, cikti / f"{p.stem}.webp", 72)
        yaz(img, KUCUK, cikti / f"{p.stem}-k.webp", 72)
        if (video, p.stem) not in var:
            yeni.append({"id": p.stem, "video": video, "en": "", "tr": ""})
        print(f"{p.name} -> public/cizim/{video}/{p.stem}.webp")
    # Yeni videonun çizimleri listenin başına gelir (sayfa video sırasına göre gruplar).
    veri["cizimler"] = yeni + veri["cizimler"]
    satirlar = ",\n".join("    " + json.dumps(c, ensure_ascii=False) for c in veri["cizimler"])
    videolar = json.dumps(veri["videolar"], ensure_ascii=False, indent=2).replace("\n", "\n  ")
    VERI.write_text(
        "{\n"
        f'  "_not": {json.dumps(veri["_not"], ensure_ascii=False)},\n'
        f'  "videolar": {videolar},\n'
        f'  "cizimler": [\n{satirlar}\n  ]\n'
        "}\n",
        encoding="utf-8",
    )
    print(f"{len(pngler)} çizim yazıldı, {len(yeni)} yeni kayıt. content/cizimler.json içindeki boş adları doldur.")


if __name__ == "__main__":
    main()
