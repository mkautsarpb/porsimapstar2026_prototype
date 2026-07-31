import Link from 'next/link';
import { Ikon } from '@/components/app/Ikon';
import type { TahapProfil } from '@/data/profil';
import styles from './StepperProfil.module.css';

/**
 * Stepper empat tahap profil.
 *
 * Tahap adalah tautan, bukan tombol: peserta boleh melompat mundur untuk
 * memeriksa isian tanpa kehilangan draf, dan posisinya bisa ditautkan langsung
 * dari notifikasi. Keadaan tiap tahap selalu punya ikon atau teks, tidak hanya
 * warna (agents.md §7).
 */
export function StepperProfil({
  tahap,
  aktif,
}: {
  readonly tahap: readonly TahapProfil[];
  readonly aktif: string;
}) {
  return (
    <ol className={styles.stepper}>
      {tahap.map((t) => {
        const sekarang = t.kunci === aktif;

        return (
          <li key={t.kunci} data-keadaan={sekarang ? 'aktif' : t.keadaan} className={styles.item}>
            <Link
              href={`/profil?tahap=${t.kunci}`}
              aria-current={sekarang ? 'step' : undefined}
              className={styles.tautan}
            >
              <span aria-hidden="true" className={styles.nomor}>
                {t.keadaan === 'selesai' && !sekarang ? (
                  <Ikon nama="centang" ukuran={13} tebal={3} />
                ) : (
                  t.nomor
                )}
              </span>
              <span className={styles.teks}>
                <span className={styles.label}>{t.label}</span>
                <span className={styles.keadaan}>
                  {t.ringkas ??
                    (t.keadaan === 'selesai' ? 'Lengkap' : sekarang ? 'Sedang dibuka' : 'Belum diisi')}
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
