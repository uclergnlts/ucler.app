"use client";
import type { DersId, Entry } from "@/lib/dersler";
import { useProg } from "@/lib/store";
import { Bos, Liste, Row } from "../temel";
import Kabuk from "./Kabuk";
import { useKaydedilenler } from "./veri";

export default function Kaydedilenler({ all }: { all: Record<DersId, Entry[]> }) {
  const prog = useProg();
  const list = useKaydedilenler(all);
  return (
    <Kabuk title="Kaydedilenler">
      {list.length ? (
        <Liste>
          {list.map((e) => <Row key={`${e.ders}.${e.id}`} e={e} done={!!prog[`${e.ders}.${e.id}`]} />)}
        </Liste>
      ) : (
        <Bos>Henüz kaydettiğin bir konu yok. Ders ekranında sağ üstteki ya da videonun altındaki işaret simgesine dokunarak konuyu buraya ekleyebilirsin.</Bos>
      )}
    </Kabuk>
  );
}
