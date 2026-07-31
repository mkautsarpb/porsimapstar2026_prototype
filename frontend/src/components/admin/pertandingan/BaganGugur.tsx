import type { BabakBagan } from '@/types/admin';
import adm from '@/components/admin/adm.module.css';
import styles from './BaganGugur.module.css';

/**
 * Bagan gugur (E3.1b).
 *
 * Kanvas digulir mendatar per babak, dengan ikhtisar di atasnya. Yang penting
 * bukan gambarnya melainkan tetap tahu posisi: bagan 16 tim tidak muat di layar
 * mana pun, dan tanpa ikhtisar orang kehilangan jejak setelah dua kali geser
 * (agents.md §7 — bracket scrollable + overview).
 *
 * Keadaan laga memakai tiga kata, bukan tiga warna: Selesai · Berlangsung ·
 * Menunggu pemenang. Slot yang belum terisi menulis asal pengisinya
 * ("Pemenang PF-1"), bukan kotak kosong.
 */
export function BaganGugur({
  babak,
  judul,
  meta,
}: {
  readonly babak: readonly BabakBagan[];
  readonly judul: string;
  readonly meta: string;
}) {
  const total = babak.reduce((n, b) => n + b.jumlahLaga, 0);
  const selesai = babak.flatMap((b) => b.laga).filter((l) => l.keadaan === 'selesai').length;
  const berlangsung = babak.flatMap((b) => b.laga).filter((l) => l.keadaan === 'berlangsung').length;

  return (
    <section className={styles.bagan}>
      <header className={styles.kepala}>
        <div>
          <h2 className={adm.kartuJudul}>{judul}</h2>
          <p className={adm.catatan}>{meta}</p>
        </div>

        <nav aria-label="Ikhtisar babak" className={styles.ikhtisar}>
          {babak.map((b) => (
            <a key={b.id} href={`#babak-${b.id}`} className={styles.ikhtisarItem}>
              <span className={styles.ikhtisarLabel}>{b.label}</span>
              <span className={styles.ikhtisarAngka}>{b.jumlahLaga}</span>
            </a>
          ))}
        </nav>
      </header>

      <div className={styles.kanvas}>
        {babak.map((b) => (
          <div key={b.id} id={`babak-${b.id}`} className={styles.kolom}>
            <p className={adm.eyebrow}>
              {b.label} · {b.jumlahLaga} laga
            </p>

            <ul className={styles.lagaDaftar}>
              {b.laga.map((l) => (
                <li key={l.id} data-keadaan={l.keadaan} className={styles.laga}>
                  <div className={styles.sisi}>
                    <span className={styles.tim}>{l.a.nama}</span>
                    <span className={styles.skor}>{l.a.skor ?? '—'}</span>
                  </div>
                  <div className={styles.sisi}>
                    <span className={styles.tim}>{l.b.nama}</span>
                    <span className={styles.skor}>{l.b.skor ?? '—'}</span>
                  </div>
                  <p className={styles.keadaan}>
                    {l.keadaan === 'selesai'
                      ? 'Selesai'
                      : l.keadaan === 'berlangsung'
                        ? 'Berlangsung'
                        : 'Menunggu pemenang'}
                    {l.meta ? ` · ${l.meta}` : ''}
                  </p>
                </li>
              ))}
            </ul>

            {b.catatan ? <p className={adm.catatan}>{b.catatan}</p> : null}
          </div>
        ))}
      </div>

      <div className={styles.legenda}>
        <span className={styles.legendaItem}>
          <span aria-hidden="true" data-keadaan="selesai" className={styles.contoh} />
          Selesai · {selesai} laga
        </span>
        <span className={styles.legendaItem}>
          <span aria-hidden="true" data-keadaan="berlangsung" className={styles.contoh} />
          Berlangsung · {berlangsung} laga
        </span>
        <span className={styles.legendaItem}>
          <span aria-hidden="true" data-keadaan="menunggu" className={styles.contoh} />
          Menunggu pemenang · {total - selesai - berlangsung} laga
        </span>
      </div>
    </section>
  );
}
