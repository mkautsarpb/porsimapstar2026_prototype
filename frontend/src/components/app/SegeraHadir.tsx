import Link from 'next/link';
import { Ikon } from './Ikon';
import type { NamaIkon } from '@/types/peserta';
import ui from './ui.module.css';
import styles from './SegeraHadir.module.css';

/**
 * Halaman area peserta yang belum dibangun. Sengaja bukan 404: menunya sudah ada
 * di navigasi, jadi tujuannya harus tetap menjelaskan diri dan menawarkan jalan
 * keluar, bukan layar kosong (agents.md §4 "Empty").
 */
export function SegeraHadir({
  ikon,
  judul,
  penjelasan,
  isi,
  kembali = { href: '/dashboard', label: 'Kembali ke dashboard' },
}: {
  readonly ikon: NamaIkon;
  readonly judul: string;
  readonly penjelasan: string;
  /** Apa yang nanti ada di halaman ini. */
  readonly isi: readonly string[];
  /** Tujuan tombol kembali — beda antara area peserta dan Panel Panitia. */
  readonly kembali?: { readonly href: string; readonly label: string };
}) {
  return (
    <div className={`${ui.kartu} ${styles.kartu}`}>
      <span aria-hidden="true" className={styles.ikon}>
        <Ikon nama={ikon} ukuran={24} />
      </span>

      <h1 className={styles.judul}>{judul}</h1>
      <p className={styles.teks}>{penjelasan}</p>

      <ul className={styles.daftar}>
        {isi.map((i) => (
          <li key={i} className={styles.item}>
            <Ikon nama="centang" ukuran={14} tebal={2.2} />
            {i}
          </li>
        ))}
      </ul>

      <p className={styles.catatan}>
        Halaman ini menyusul di batch desain berikutnya. Yang sudah bisa dipakai sekarang: dashboard,
        daftar lomba, dan detail lomba.
      </p>

      <Link href={kembali.href} className={`${ui.tombol} ${ui.tombolUtama}`}>
        {kembali.label}
      </Link>
    </div>
  );
}
