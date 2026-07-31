import { formatAngka } from '@/lib/admin/format';
import styles from './DaftarBar.module.css';

export interface BarisBar {
  readonly id: string;
  readonly nama: string;
  readonly jumlah: number;
  readonly keterangan?: string;
}

/**
 * Daftar bar terurut — "berapa banyak per kategori", dibaca dari atas ke bawah.
 *
 * Beda dari `grafik/BarProporsi` yang menumpuk beberapa segmen dalam satu rel
 * untuk menunjukkan komposisi: di sini tiap baris berdiri sendiri dan yang
 * dibandingkan panjangnya, bukan bagiannya dari keseluruhan.
 *
 * Angkanya selalu tertulis di sebelah bar. Panjang bar itu bantuan membaca,
 * bukan satu-satunya cara mengetahui nilainya — bar tanpa angka memaksa orang
 * menaksir, dan taksiran tidak bisa dipakai mengambil keputusan.
 */
export function DaftarBar({
  baris,
  satuan,
}: {
  readonly baris: readonly BarisBar[];
  readonly satuan: string;
}) {
  const maks = baris.reduce((m, b) => Math.max(m, b.jumlah), 0);

  return (
    <ul className={styles.daftar}>
      {baris.map((b) => (
        <li key={b.id} className={styles.baris}>
          <span className={styles.nama}>{b.nama}</span>

          <span aria-hidden="true" className={styles.rel}>
            <span
              style={{ width: maks > 0 ? `${Math.round((b.jumlah / maks) * 100)}%` : '0%' }}
              className={styles.isi}
            />
          </span>

          <span className={styles.nilai}>
            {formatAngka(b.jumlah)} {satuan}
          </span>

          {b.keterangan ? <span className={styles.keterangan}>{b.keterangan}</span> : null}
        </li>
      ))}
    </ul>
  );
}
