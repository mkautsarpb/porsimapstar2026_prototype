import { Ikon } from '@/components/app/Ikon';
import styles from './SlotGrafik.module.css';

/**
 * Tempat kosong untuk grafik yang desainnya belum selesai.
 *
 * Sengaja TIDAK menggambar grafik apa pun. Gaya grafik — sumbu, kisi, urutan
 * warna seri, perlakuan nol, dan label — adalah keputusan sistem desain, bukan
 * keputusan implementasi. Grafik karangan sendiri akan menyimpang dari sistem
 * dan lebih mahal dibongkar daripada dibuat.
 *
 * Slot ini menyebutkan metrik dan bentuk yang direncanakan supaya panitia tahu
 * apa yang menyusul, dan supaya layoutnya sudah menyediakan ruang yang benar.
 */
export function SlotGrafik({
  judul,
  bentuk,
  keterangan,
}: {
  readonly judul: string;
  readonly bentuk: string;
  readonly keterangan: string;
}) {
  return (
    <section className={styles.slot}>
      <div className={styles.kepala}>
        <h3 className={styles.judul}>{judul}</h3>
        <span className={styles.label}>Desain belum final</span>
      </div>

      <div className={styles.kotak}>
        <span aria-hidden="true" className={styles.ikon}>
          <Ikon nama="grid" ukuran={20} />
        </span>
        <p className={styles.bentuk}>{bentuk}</p>
      </div>

      <p className={styles.keterangan}>{keterangan}</p>
    </section>
  );
}
