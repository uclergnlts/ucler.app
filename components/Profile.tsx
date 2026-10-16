"use client";
import { DERSLER, DERS_IDS, type DersId, type Entry } from "@/lib/dersler";
import { doneKeys, resetAll, useProg, useSaved, useStorageOk } from "@/lib/store";
import { Icon } from "./icons";
import { PageHead, Top } from "./ui";

export default function Profile({ all }: { all: Record<DersId, Entry[]> }) {
  const prog = useProg(), saved = useSaved(), storageOk = useStorageOk();
  const done = doneKeys(prog).filter((k) => /\//.test(prog[k]));
  let right = 0, total = 0;
  for (const k of done) {
    const m = String(prog[k]).match(/(\d+)\/(\d+)/);
    if (m) { right += +m[1]; total += +m[2]; }
  }
  const User = Icon.profil;

  return (
    <div className="app">
      <Top />
      <main className="view">
        <PageHead title="Profil" />
        <section className="prof">
          <span className="avatar"><User /></span>
          <span>
            <b>Misafir</b>
            <span>
              {storageOk
                ? "İlerlemen şimdilik yalnızca bu cihazda saklanıyor."
                : "Tarayıcın kayıt tutmaya izin vermiyor. İlerlemen ve kaydettiklerin sayfayı yenilersen ya da sekmeyi kapatırsan silinir."}
            </span>
          </span>
        </section>
        <section className="stats">
          <div className="stat"><b>{done.length}</b><span>konu bitti</span></div>
          <div className="stat"><b>{total ? `${Math.round((100 * right) / total)}%` : "–"}</b><span>doğru cevap</span></div>
          <div className="stat"><b>{saved.length}</b><span>kayıtlı</span></div>
        </section>
        <section style={{ display: "grid", gap: 10 }}>
          <div className="label">Derslerdeki ilerleme</div>
          <div className="bars">
            {DERS_IDS.map((d) => {
              const r = all[d].filter((e) => e.id), n = r.filter((e) => prog[`${d}.${e.id}`]).length;
              return (
                <div key={d} className="bar" data-ders={d}>
                  <div>{DERSLER[d].ad}<span>{n} / {r.length} hazır konu</span></div>
                  <i><em style={{ width: `${r.length ? (100 * n) / r.length : 0}%` }} /></i>
                </div>
              );
            })}
          </div>
        </section>
        <section style={{ display: "grid", gap: 10 }}>
          <div className="label">Hesap</div>
          <button className="btn" disabled>Hesap oluştur · yakında</button>
          <button
            className="btn"
            onClick={() => { if (confirm("Tüm ilerlemen ve kaydettiğin konular silinsin mi?")) resetAll(); }}
          >
            İlerlemeyi sıfırla
          </button>
        </section>
      </main>
    </div>
  );
}
