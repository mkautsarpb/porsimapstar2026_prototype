import { formatAngka } from '@/lib/admin/format';
import type { TitikHarian } from '@/types/panitia';
import styles from './Sparkline.module.css';

const LEBAR = 240;
const TINGGI = 40;
const PAD = 4;

/**
 * Visual mikro — konteks di dalam kartu KPI, bukan grafik.
 *
 * Aturannya: tanpa sumbu, tanpa kisi, tanpa judul, tanpa legenda. Kalau sebuah
 * visual mikro butuh penjelasannya sendiri, ia sebenarnya grafik dan tempatnya
 * bukan di dalam kartu angka. Yang dibawa hanya bentuk tren; angka pastinya
 * sudah ada di grafik tren harian pada band yang sama.
 */
export function Sparkline({ titik }: { readonly titik: readonly TitikHarian[] }) {
  const nilai = titik
    .map((t) => t.dikirim)
    .filter((v): v is number => v !== null)
    .slice(-7);

  if (nilai.length < 2) return null;

  const maks = Math.max(...nilai);
  const min = Math.min(...nilai);
  const rentang = Math.max(1, maks - min);

  const x = (i: number) => PAD + (i / (nilai.length - 1)) * (LEBAR - PAD * 2);
  const y = (v: number) => PAD + (1 - (v - min) / rentang) * (TINGGI - PAD * 2);

  const jalur = nilai.map((v, i) => `${x(i)},${y(v)}`).join(' ');
  const area = `${PAD},${TINGGI} ${jalur} ${LEBAR - PAD},${TINGGI}`;
  const akhir = nilai[nilai.length - 1] ?? 0;

  return (
    <div className={styles.blok}>
      <svg
        viewBox={`0 0 ${LEBAR} ${TINGGI}`}
        className={styles.svg}
        role="img"
        aria-label={`Tren pendaftaran tujuh hari terakhir, dari ${formatAngka(nilai[0] ?? 0)} ke ${formatAngka(akhir)} per hari.`}
      >
        <polygon points={area} className={styles.area} />
        <polyline points={jalur} className={styles.garis} vectorEffect="non-scaling-stroke" />
        <circle cx={x(nilai.length - 1)} cy={y(akhir)} r={3} className={styles.ujung} />
      </svg>

      <p className={styles.kaki}>
        <span>{formatAngka(nilai[0] ?? 0)}</span>
        <span className={styles.rentangLabel}>7 hari terakhir</span>
        <span className={styles.akhir}>{formatAngka(akhir)}</span>
      </p>
    </div>
  );
}
