'use client';

import { useState } from 'react';
import { useOnline } from '@/hooks/useOnline';
import { AppSidebar } from './AppSidebar';
import { AppTopbar } from './AppTopbar';
import { BottomNav } from './BottomNav';
import { Ikon } from './Ikon';
import styles from './AppShell.module.css';

/**
 * Kerangka area peserta: sidebar/rail, topbar, area konten yang digulir sendiri,
 * dan bottom nav di mobile.
 *
 * Area konten sengaja punya scroll sendiri (bukan scroll dokumen) supaya sidebar
 * dan topbar tetap di tempat — sekaligus jadi sumber sinyal `digulir` untuk
 * memunculkan border topbar seperti di desain.
 */
export function AppShell({ children }: { readonly children: React.ReactNode }) {
  const [digulir, setDigulir] = useState(false);
  const online = useOnline();

  return (
    <div className={styles.shell}>
      <AppSidebar />

      <div className={styles.utama}>
        <AppTopbar digulir={digulir} />

        {!online ? (
          <div role="status" className={styles.offline}>
            <span aria-hidden="true" className={styles.offlineIkon}>
              <Ikon nama="seru" ukuran={16} />
            </span>
            <p className={styles.offlineTeks}>
              <strong>Kamu sedang offline.</strong> Halaman ini menampilkan data terakhir yang tersimpan;
              perubahan terbaru mungkin belum terlihat.
            </p>
          </div>
        ) : null}

        <main
          onScroll={(e) => {
            const lewat = e.currentTarget.scrollTop > 0;
            if (lewat !== digulir) setDigulir(lewat);
          }}
          className={styles.konten}
        >
          <div className={styles.kolom}>{children}</div>
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
