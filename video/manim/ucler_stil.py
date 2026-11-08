"""ucler video stili için Manim ayarları (STIL.md ile aynı renkler ve yazı tipleri).

Sahne dosyaları bunu içe aktarır:  from ucler_stil import *
Yazı tipleri manim/fonts içindeki ttf dosyalarından yüklenir; sisteme kurmak gerekmez.
LaTeX gerekmez: formüller Text/MarkupText ile yazılır.
"""
from pathlib import Path
from manim import *  # noqa: F401,F403
import manimpango

_FONTS = Path(__file__).parent / "fonts"
for f in _FONTS.glob("*.ttf"):
    manimpango.register_font(str(f))

LACIVERT = ManimColor("#1d3557")
GRI = ManimColor("#9aa6b6")
ACIK_GRI = ManimColor("#c9d3e0")
IKINCIL = ManimColor("#5f6f88")
SARI = ManimColor("#ffd95a")
FIZIK = ManimColor("#2f7cf6")
KIMYA = ManimColor("#d63c63")
BIYOLOJI = ManimColor("#1fa463")

BASLIK = "Manrope 800"   # başlık ve formül
ETIKET = "Inter 600"     # etiketler
KALIN = "Inter 800"


def etiket(metin, boyut=34, renk=IKINCIL, font=ETIKET):
    """Inter 600 etiket. Manim'de 1 birim ~ 1080/8 px; boyut px olarak verilir."""
    return Text(metin, font=font, color=renk).scale(boyut / 48)


def formul(metin, boyut=56, renk=LACIVERT):
    return Text(metin, font=BASLIK, color=renk).scale(boyut / 48)


# Saydam zemin, kare tuval: sahne.html içine <img> olarak oturur.
config.background_opacity = 0
config.pixel_width = 1080
config.pixel_height = 1080
config.frame_rate = 30
config.frame_height = 8
config.frame_width = 8
