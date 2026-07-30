import { Ikon } from '@/components/app/Ikon';
import type { JejakLomba } from '@/data/lomba-detail';
import ui from '@/components/app/ui.module.css';
import tab from './tab.module.css';
import styles from './TabRiwayat.module.css';

/** Tab Riwayat: jejak perubahan pendaftaran, terbaru di atas. */
export function TabRiwayat({ jejak }: { readonly jejak: readonly JejakLomba[] }) {
  return (
    <div className={ui.kartu}>
      <h2 className={tab.judul}>Riwayat pendaftaran</h2>

      <ol className={styles.linimasa}>
        {jejak.map((j) => (
          <li key={j.id} data-nada={j.nada} className={styles.item}>
            <span aria-hidden="true" className={styles.tanda}>
              <Ikon nama={j.ikon} ukuran={14} />
            </span>
            <span className={styles.isi}>
              <span className={styles.teks}>{j.teks}</span>
              <span className={styles.waktu}>{j.waktu}</span>
            </span>
          </li>
        ))}
      </ol>

      <p className={`${tab.teks} ${tab.jarakAtas}`}>
        Riwayat ini hanya mencatat perubahan status pendaftaranmu. Untuk pertanyaan soal keputusan
        panitia, sertakan nomor referensi saat menghubungi bantuan.
      </p>
    </div>
  );
}
