import Link from 'next/link';
import { Ikon } from '@/components/app/Ikon';
import type { NamaIkon } from '@/types/peserta';
import type { SyaratSubmit } from '@/types/tim';
import ui from '@/components/app/ui.module.css';
import styles from './SyaratTim.module.css';

const IKON: Record<SyaratSubmit['keadaan'], NamaIkon> = {
  ok: 'centang',
  warn: 'seru',
  belum: 'titik',
};

/**
 * Checklist syarat submit tim.
 *
 * Kesiapan tim dihitung server, bukan di sini — komponen hanya merender daftar
 * yang dikirim beserta keadaannya (agents.md §0 prinsip 1). Setiap syarat yang
 * belum terpenuhi wajib menyebut siapa yang bisa memperbaikinya, karena hampir
 * semuanya ada di tangan anggota, bukan ketua.
 */
export function SyaratTim({ syarat }: { readonly syarat: readonly SyaratSubmit[] }) {
  return (
    <ul className={styles.daftar}>
      {syarat.map((s) => (
        <li key={s.id} data-keadaan={s.keadaan} className={styles.item}>
          <span aria-hidden="true" className={styles.tanda}>
            <Ikon nama={IKON[s.keadaan]} ukuran={14} tebal={2.4} />
          </span>

          <span className={styles.isi}>
            <span className={styles.judul}>
              {s.judul}
              <span className={styles.keadaan}>
                {s.keadaan === 'ok' ? 'Terpenuhi' : 'Belum terpenuhi'}
              </span>
            </span>
            <span className={styles.keterangan}>{s.keterangan}</span>
          </span>

          {s.aksiLabel && s.aksiHref ? (
            <Link href={s.aksiHref} className={`${ui.tombol} ${ui.tombolKecil}`}>
              {s.aksiLabel}
            </Link>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
