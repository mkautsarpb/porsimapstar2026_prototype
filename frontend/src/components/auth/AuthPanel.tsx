import Image from 'next/image';
import Link from 'next/link';
import { PERIODE_PENDAFTARAN, TANGGAL_ACARA } from '@/data/jadwal';
import { LangkahPendaftaran } from './LangkahPendaftaran';
import styles from './AuthPanel.module.css';

/**
 * Panel brand di sisi kiri halaman autentikasi. Server Component — satu-satunya
 * bagian ber-state adalah pelipat "tiga langkah" untuk layar sempit.
 */
export function AuthPanel() {
  return (
    <aside className={styles.panel}>
      <span aria-hidden="true" className={styles.ring1} />
      <span aria-hidden="true" className={styles.ring2} />
      <span aria-hidden="true" className={styles.glow} />
      <span aria-hidden="true" className={styles.maskot} />

      <div className={styles.atas}>
        <Link href="/" className={styles.brand}>
          <Image
            src="/uploads/porsimaptar-trim.png"
            alt="Logo PORSIMAPTAR XXVI 2026"
            width={84}
            height={46}
            priority
            className={styles.logo}
          />
          <span className={styles.eyebrow}>PORSIMAPTAR XXVI · Akademi Kepolisian</span>
        </Link>

        <div>
          <p className={styles.tema}>Cakrawala</p>
          <span aria-hidden="true" className={styles.rule} />
          <p className={styles.tagline}>
            Bersaing dengan Sportivitas,
            <br />
            Bersatu dalam Solidaritas.
          </p>
        </div>

        <LangkahPendaftaran />
      </div>

      <div className={styles.kartuJadwal}>
        <p className={styles.jadwalBaris}>
          <span className={styles.jadwalLabel}>Pendaftaran ·</span> {PERIODE_PENDAFTARAN}
        </p>
        <p className={styles.jadwalBaris}>
          <span className={styles.jadwalLabel}>Perlombaan ·</span> {TANGGAL_ACARA}
        </p>
      </div>
    </aside>
  );
}
