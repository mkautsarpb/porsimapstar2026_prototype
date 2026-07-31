import Link from 'next/link';
import type { ReactNode } from 'react';
import { Ikon } from './Ikon';
import styles from './KepalaHalaman.module.css';

/**
 * Kepala layar area peserta: judul, satu kalimat ringkasan keadaan, dan slot
 * aksi di kanan. Dipakai bersama supaya `page.module.css` tiap rute tidak
 * menyalin blok yang sama (CLAUDE.md aturan 3).
 */
export function KepalaHalaman({
  judul,
  ringkasan,
  kembali,
  aksi,
}: {
  readonly judul: string;
  readonly ringkasan?: ReactNode;
  readonly kembali?: { readonly href: string; readonly label: string };
  readonly aksi?: ReactNode;
}) {
  return (
    <header className={styles.kepala}>
      <div className={styles.kiri}>
        {kembali ? (
          <Link href={kembali.href} className={styles.kembali}>
            <span aria-hidden="true" className={styles.kembaliIkon}>
              <Ikon nama="panah" ukuran={14} tebal={2.4} />
            </span>
            {kembali.label}
          </Link>
        ) : null}
        <h1 className={styles.judul}>{judul}</h1>
        {ringkasan ? <p className={styles.ringkasan}>{ringkasan}</p> : null}
      </div>
      {aksi ? <div className={styles.aksi}>{aksi}</div> : null}
    </header>
  );
}
