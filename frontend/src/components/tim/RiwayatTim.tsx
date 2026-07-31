import type { JejakTim } from '@/types/tim';
import styles from './RiwayatTim.module.css';

/**
 * Linimasa perubahan tim. Urutan terbaru di atas, dan tiap baris menyebut
 * siapa · apa · kapan. Riwayat tidak bisa dihapus dari sisi peserta — panitia
 * melihat daftar yang sama, jadi copy-nya tidak boleh menjanjikan sebaliknya.
 */
export function RiwayatTim({ jejak }: { readonly jejak: readonly JejakTim[] }) {
  return (
    <ol className={styles.linimasa}>
      {jejak.map((j) => (
        <li key={j.id} data-nada={j.nada} className={styles.item}>
          <span aria-hidden="true" className={styles.penanda}>
            <span className={styles.titik} />
            <span className={styles.garis} />
          </span>
          <span className={styles.isi}>
            <span className={styles.teks}>{j.teks}</span>
            <span className={styles.meta}>{j.meta}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}
