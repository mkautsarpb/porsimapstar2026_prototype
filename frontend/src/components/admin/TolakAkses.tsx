import Link from 'next/link';
import { Ikon } from '@/components/app/Ikon';
import styles from './TolakAkses.module.css';

/**
 * Layar 403 Panel Panitia.
 *
 * Tidak menyebut halaman apa yang diminta, tidak menyebut apakah resource-nya
 * ada — pesan yang terlalu membantu di layar forbidden justru membocorkan peta
 * sistem (agents.md §4 "Unauthorized").
 */
export function TolakAkses() {
  return (
    <div className={styles.layar}>
      <div className={styles.kartu}>
        <span aria-hidden="true" className={styles.ikon}>
          <Ikon nama="seru" ukuran={24} />
        </span>

        <h1 className={styles.judul}>Tidak berwenang</h1>
        <p className={styles.teks}>
          Akun ini tidak punya kewenangan membuka Panel Panitia. Bila kamu merasa seharusnya punya,
          minta Super Admin memeriksa peran akunmu.
        </p>

        <Link href="/" className={styles.tautan}>
          Kembali ke beranda
        </Link>
      </div>
    </div>
  );
}
