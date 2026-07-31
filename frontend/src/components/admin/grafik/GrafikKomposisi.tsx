import { formatAngka } from '@/lib/admin/format';
import type { BarisKomposisi } from '@/types/panitia';
import { TabelNilai } from './TabelNilai';
import styles from './GrafikKomposisi.module.css';

/** Label hanya dilukis di dalam segmen bila segmennya cukup lebar untuk memuatnya. */
const AMBANG_LABEL_DALAM = 0.22;

/**
 * Komposisi individu versus tim per lomba — batang bertumpuk horizontal.
 *
 * Panjang batang membawa jumlah peserta, warna membawa cara mendaftar. Skalanya
 * absolut, bukan 100%: kalau semua batang dipaksa penuh, lomba dengan 90 peserta
 * terlihat sama besar dengan yang 402 dan perbandingan antar lomba hilang.
 *
 * Lomba yang seluruhnya satu tipe digambar sebagai satu batang utuh — bukan
 * batang bertumpuk dengan segmen nol. Segmen selebar nol tetap menghasilkan
 * celah pemisah dan terbaca sebagai "ada, tapi kecil sekali".
 *
 * Label di dalam segmen hanya dilukis kalau muat. Yang tidak muat tidak dipotong,
 * melainkan dilepas ke legenda dan tabel — nilainya tidak pernah hilang.
 */
export function GrafikKomposisi({ baris }: { readonly baris: readonly BarisKomposisi[] }) {
  if (baris.length === 0) return null;

  const terbesar = Math.max(1, ...baris.map((b) => b.individu + b.tim));
  const totalIndividu = baris.reduce((n, b) => n + b.individu, 0);
  const totalTim = baris.reduce((n, b) => n + b.tim, 0);

  return (
    <div className={styles.grafik}>
      <ul className={styles.daftar}>
        {baris.map((b) => {
          const total = b.individu + b.tim;
          const segmen = [
            { kunci: 'individu' as const, nilai: b.individu, kelas: styles.individu, label: 'Individu' },
            { kunci: 'tim' as const, nilai: b.tim, kelas: styles.tim, label: 'Tim' },
          ].filter((s) => s.nilai > 0);

          return (
            <li key={b.lomba} className={styles.baris}>
              <span className={styles.lomba}>{b.lomba}</span>

              <span style={{ width: `${(total / terbesar) * 100}%` }} className={styles.rel}>
                {segmen.map((s) => {
                  const porsi = s.nilai / total;
                  return (
                    <span
                      key={s.kunci}
                      style={{ flexGrow: s.nilai }}
                      className={`${styles.segmen} ${s.kelas}`}
                      title={`${b.lomba} · ${s.label} ${formatAngka(s.nilai)}`}
                    >
                      {porsi >= AMBANG_LABEL_DALAM ? (
                        <span className={styles.labelDalam}>{formatAngka(s.nilai)}</span>
                      ) : null}
                    </span>
                  );
                })}
              </span>

              <span className={styles.total}>{formatAngka(total)}</span>
            </li>
          );
        })}
      </ul>

      <ul className={styles.legenda}>
        <li className={styles.legendaItem}>
          <span aria-hidden="true" className={`${styles.swatch} ${styles.individu}`} />
          Individu · {formatAngka(totalIndividu)}
        </li>
        <li className={styles.legendaItem}>
          <span aria-hidden="true" className={`${styles.swatch} ${styles.tim}`} />
          Lewat tim · {formatAngka(totalTim)}
        </li>
      </ul>

      <TabelNilai
        ringkasan="komposisi per lomba"
        kolom={['Lomba', 'Individu', 'Lewat tim', 'Total']}
        baris={baris.map((b) => [
          b.lomba,
          formatAngka(b.individu),
          formatAngka(b.tim),
          formatAngka(b.individu + b.tim),
        ])}
      />
    </div>
  );
}
