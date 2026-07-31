import { formatAngka, formatPersen } from '@/lib/admin/format';
import styles from './BarProporsi.module.css';

export interface SegmenProporsi {
  readonly label: string;
  readonly nilai: number;
  readonly nada: 'ok' | 'warn' | 'danger';
}

/**
 * Visual mikro — satu bar bertumpuk setinggi 8px menggantikan dua baris angka.
 *
 * Satu bar menyampaikan proporsi lebih cepat daripada dua angka yang harus
 * dibagi sendiri di kepala. Angkanya tetap ada di bawah sebagai legenda, jadi
 * tidak ada nilai yang hanya bisa dibaca lewat warna atau panjang.
 *
 * Warnanya token status, dan itu memang berarti status: terverifikasi aman,
 * belum verifikasi perlu ditindak. Bukan warna dipinjam untuk identitas.
 */
export function BarProporsi({ segmen }: { readonly segmen: readonly SegmenProporsi[] }) {
  const total = segmen.reduce((n, s) => n + s.nilai, 0);
  if (total <= 0) return null;

  return (
    <div className={styles.blok}>
      <span aria-hidden="true" className={styles.rel}>
        {segmen
          .filter((s) => s.nilai > 0)
          .map((s) => (
            <span
              key={s.label}
              data-nada={s.nada}
              style={{ flexGrow: s.nilai }}
              className={styles.segmen}
            />
          ))}
      </span>

      <ul className={styles.legenda}>
        {segmen.map((s) => (
          <li key={s.label} className={styles.item}>
            <span aria-hidden="true" data-nada={s.nada} className={styles.swatch} />
            <span className={styles.label}>{s.label}</span>
            <span data-nada={s.nada} className={styles.nilai}>
              {formatAngka(s.nilai)}
              <span className={styles.persen}>{formatPersen(s.nilai, total)}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
