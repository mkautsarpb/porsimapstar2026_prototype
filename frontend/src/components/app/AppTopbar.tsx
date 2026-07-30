'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import { NOTIFIKASI, PROFIL } from '@/data/peserta';
import { Ikon } from './Ikon';
import { judulHalaman } from './nav-peserta';
import styles from './AppTopbar.module.css';

/**
 * Topbar area peserta: judul halaman, lonceng notifikasi, dan chip akun.
 * `digulir` dikirim dari AppShell — border dan bayangan baru muncul setelah
 * area konten digulir, persis seperti di desain.
 */
export function AppTopbar({ digulir }: { readonly digulir: boolean }) {
  const pathname = usePathname();
  const [bukaNotif, setBukaNotif] = useState(false);
  const [dibaca, setDibaca] = useState(false);
  const bungkusRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  const belumDibaca = dibaca ? 0 : NOTIFIKASI.filter((n) => n.baru).length;

  // Dropdown ditutup lewat klik di luar dan Escape — pola disclosure biasa,
  // bukan role="menu", karena isinya tautan.
  useEffect(() => {
    if (!bukaNotif) return;

    const onKlik = (e: MouseEvent) => {
      if (!bungkusRef.current?.contains(e.target as Node)) setBukaNotif(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setBukaNotif(false);
    };

    document.addEventListener('mousedown', onKlik);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onKlik);
      document.removeEventListener('keydown', onKey);
    };
  }, [bukaNotif]);

  return (
    <header data-digulir={digulir} className={styles.topbar}>
      {/* Bukan <h1>: judul utama halaman hidup di area konten, topbar hanya penanda lokasi. */}
      <p className={styles.judul}>{judulHalaman(pathname)}</p>

      <div className={styles.kanan}>
        <div ref={bungkusRef} className={styles.notifBungkus}>
          <button
            type="button"
            aria-expanded={bukaNotif}
            aria-controls={panelId}
            aria-label={
              belumDibaca > 0 ? `Notifikasi, ${belumDibaca} belum dibaca` : 'Notifikasi, semua sudah dibaca'
            }
            onClick={() => setBukaNotif((v) => !v)}
            className={styles.tombolIkon}
          >
            <Ikon nama="lonceng" />
            {belumDibaca > 0 ? (
              <span aria-hidden="true" className={styles.badge}>
                {belumDibaca}
              </span>
            ) : null}
          </button>

          {bukaNotif ? (
            <div id={panelId} className={styles.panel}>
              <div className={styles.panelKepala}>
                <span className={styles.panelJudul}>Notifikasi</span>
                {belumDibaca > 0 ? (
                  <button type="button" onClick={() => setDibaca(true)} className={styles.tandai}>
                    Tandai sudah dibaca
                  </button>
                ) : null}
              </div>

              <ul className={styles.daftar}>
                {NOTIFIKASI.slice(0, 5).map((n) => (
                  <li key={n.id} data-baru={!dibaca && n.baru} className={styles.notif}>
                    <span aria-hidden="true" data-nada={n.nada} className={styles.notifIkon}>
                      <Ikon nama={n.ikon} ukuran={16} />
                    </span>
                    <span className={styles.notifTeks}>
                      <span className={styles.notifJudul}>{n.judul}</span>
                      <span className={styles.notifKonteks}>{n.konteks}</span>
                      <span className={styles.notifWaktu}>{n.waktu}</span>
                    </span>
                  </li>
                ))}
              </ul>

              <Link href="/notifikasi" onClick={() => setBukaNotif(false)} className={styles.panelKaki}>
                Lihat semua notifikasi
              </Link>
            </div>
          ) : null}
        </div>

        <Link href="/profil" className={styles.chip}>
          <span aria-hidden="true" className={styles.chipAvatar}>
            {PROFIL.inisial}
          </span>
          <span className={styles.chipNama}>{PROFIL.nama.split(' ')[0]}</span>
        </Link>
      </div>
    </header>
  );
}
