"""Örnek: serbest düşmede hız-zaman grafiği, altındaki alan = alınan yol.

Kareler: video/manim/kareler.sh ornek_hiz_zaman.py HizZaman ../ornek/kutuphaneler/manim
"""
from ucler_stil import *


class HizZaman(Scene):
    def construct(self):
        eks = Axes(
            x_range=[0, 3.5, 1], y_range=[0, 35, 10], x_length=6, y_length=5.2,
            axis_config={"color": LACIVERT, "stroke_width": 5, "include_tip": True, "tip_length": 0.22},
        ).shift(DOWN * 0.25 + RIGHT * 0.3)
        xl = etiket("zaman (s)").next_to(eks.x_axis, DOWN, buff=0.35).align_to(eks.x_axis, RIGHT)
        yl = etiket("hız (m/s)").next_to(eks.y_axis, UP, buff=0.2).align_to(eks.y_axis, LEFT)
        sayilar = VGroup(*[etiket(str(i), 30).next_to(eks.c2p(i, 0), DOWN, buff=0.2) for i in (1, 2, 3)],
                         *[etiket(str(v), 30).next_to(eks.c2p(0, v), LEFT, buff=0.2) for v in (10, 20, 30)])
        self.play(Create(eks), FadeIn(xl, yl, sayilar), run_time=1.2)

        dogru = eks.plot(lambda t: 10 * t, x_range=[0, 3], color=FIZIK, stroke_width=8).set_z_index(2)
        self.play(Create(dogru), run_time=1.5)

        t = ValueTracker(0.01)
        alan = always_redraw(lambda: eks.get_area(dogru, x_range=[0, t.get_value()], color=SARI, opacity=1))
        nokta = always_redraw(lambda: Dot(eks.c2p(t.get_value(), 10 * t.get_value()), radius=0.11, color=LACIVERT).set_z_index(3))
        self.add(alan, nokta)
        self.play(t.animate.set_value(3), run_time=2.5, rate_func=linear)

        f = formul("alan = yol = 45 m", 34).move_to(eks.c2p(1.3, 32))
        self.play(FadeIn(f, shift=UP * 0.2), run_time=0.5)
        self.wait(1.3)
