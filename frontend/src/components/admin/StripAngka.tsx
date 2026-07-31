import type { Nada } from '@/types/panitia';
import styles from './StripAngka.module.css';

export interface AngkaRingkas {
  readonly id: string;
  readonly nilai: string;
  readonly label: string;
  readonly nada?: Nada;
}

/**
 * Strip angka di atas tabel: tiga sampai lima angka yang menjawab "seberapa
 * banyak, seberapa genting" sebelum mata turun ke baris.
 *
 * Sengaja bukan `Widget`: widget dashboard membawa definisi metrik, umur data,
 * keadaan basi, dan drill-down karena angkanya di-polling dan dipakai mengambil
 * keputusan lintas modul. Angka di sini dihitung dari daftar yang sedang
 * ditampilkan di halaman yang sama — kalimat "diperbarui 2 menit lalu" justru
 * akan menyesatkan.
 */
export function StripAngka({ angka }: { readonly angka: readonly AngkaRingkas[] }) {
  return (
    <ul className={styles.strip}>
      {angka.map((a) => (
        <li key={a.id} data-nada={a.nada ?? 'netral'} className={styles.item}>
          <span className={styles.nilai}>{a.nilai}</span>
          <span className={styles.label}>{a.label}</span>
        </li>
      ))}
    </ul>
  );
}
