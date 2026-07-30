'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PROFIL } from '@/data/peserta';
import { Ikon } from './Ikon';
import { NAV_PESERTA, navAktif } from './nav-peserta';
import styles from './AppSidebar.module.css';

/**
 * Sidebar area peserta. Satu markup untuk dua bentuk: sidebar 248px di desktop
 * dan rail 72px di tablet — label tetap ada di DOM (dibaca screen reader) dan
 * hanya disembunyikan secara visual, lalu dimunculkan lagi sebagai tooltip CSS
 * saat hover/fokus (agents.md §7).
 */
export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <Link href="/dashboard" className={styles.brand}>
        <Image
          src="/uploads/porsimaptar-trim.png"
          alt="PORSIMAPTAR XXVI 2026"
          width={60}
          height={32}
          priority
          className={styles.logo}
        />
        <span className={styles.brandTeks}>
          <span className={styles.brandNama}>PORSIMAPTAR</span>
          <span className={styles.brandEdisi}>XXVI · 2026</span>
        </span>
      </Link>

      <nav aria-label="Navigasi peserta" className={styles.nav}>
        {NAV_PESERTA.map((item) => {
          const aktif = navAktif(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={aktif ? 'page' : undefined}
              data-aktif={aktif}
              data-label={item.label}
              className={styles.item}
            >
              <span aria-hidden="true" className={styles.penanda} />
              <Ikon nama={item.ikon} ukuran={18} />
              <span className={styles.label}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.akun}>
        <span aria-hidden="true" className={styles.avatar}>
          {PROFIL.inisial}
        </span>
        <span className={styles.akunTeks}>
          <span className={styles.akunNama}>{PROFIL.nama}</span>
          <span className={styles.akunNomor}>{PROFIL.nomorPeserta}</span>
        </span>
      </div>
    </aside>
  );
}
