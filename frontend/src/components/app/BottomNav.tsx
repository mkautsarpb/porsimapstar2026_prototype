'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useState } from 'react';
import { PROFIL } from '@/data/peserta';
import { Ikon } from './Ikon';
import { JUMLAH_LAINNYA, MENU_LAINNYA, NAV_MOBILE, navAktif } from './nav-peserta';
import styles from './BottomNav.module.css';

/**
 * Navigasi bawah untuk mobile: empat tujuan utama plus "Lainnya" yang membuka
 * sheet berisi menu sisanya.
 *
 * Sheet dibuka dengan kartu identitas peserta — itu jalur ke Profil sekaligus
 * pengingat akun mana yang sedang dipakai — dan ditutup dengan Keluar yang
 * sengaja dipisahkan dan diberi warna berbeda. Jumlah tugas di balik menu ini
 * dinaikkan ke lencana ikon "Lainnya" supaya tidak ada tugas yang tersembunyi.
 */
export function BottomNav() {
  const pathname = usePathname();
  const [buka, setBuka] = useState(false);
  const sheetId = useId();

  // Sheet ditutup saat pindah halaman supaya tidak menutupi konten tujuan.
  useEffect(() => setBuka(false), [pathname]);

  useEffect(() => {
    if (!buka) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setBuka(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [buka]);

  const lainnyaAktif = MENU_LAINNYA.some((m) => navAktif(pathname, m.href));

  return (
    <>
      {buka ? (
        <>
          <button
            type="button"
            aria-label="Tutup menu lainnya"
            onClick={() => setBuka(false)}
            className={styles.tirai}
          />
          <div id={sheetId} role="dialog" aria-label="Menu lainnya" className={styles.sheet}>
            <span aria-hidden="true" className={styles.pegangan} />

            <Link href="/profil" className={styles.identitas}>
              <span aria-hidden="true" className={styles.avatar}>
                {PROFIL.inisial}
              </span>
              <span className={styles.sheetTeks}>
                <span className={styles.sheetLabel}>{PROFIL.nama}</span>
                <span className={styles.sheetKet}>
                  {PROFIL.nomorPeserta} · Politeknik Negeri Semarang
                </span>
              </span>
              <span aria-hidden="true" className={styles.sheetPanah}>
                <Ikon nama="panah" ukuran={16} tebal={2.4} />
              </span>
            </Link>

            <ul className={styles.sheetDaftar}>
              {MENU_LAINNYA.map((m) => (
                <li key={m.href}>
                  <Link href={m.href} className={styles.sheetItem}>
                    <span aria-hidden="true" className={styles.sheetIkon}>
                      <Ikon nama={m.ikon} ukuran={18} />
                    </span>
                    <span className={styles.sheetTeks}>
                      <span className={styles.sheetLabel}>
                        {m.label}
                        {m.badge ? <span className={styles.sheetBadge}>{m.badge}</span> : null}
                      </span>
                      <span className={styles.sheetKet}>{m.keterangan}</span>
                    </span>
                    <span aria-hidden="true" className={styles.sheetPanah}>
                      <Ikon nama="panah" ukuran={16} tebal={2.4} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* TODO(api-contract): POST /api/v1/auth/logout — sesi dihapus server,
                cookie HttpOnly dibersihkan di sana, bukan di client (§6). */}
            <Link href="/masuk" className={styles.keluar}>
              <span aria-hidden="true" className={styles.keluarIkon}>
                <Ikon nama="panah" ukuran={18} tebal={2} />
              </span>
              Keluar
            </Link>

            <p className={styles.versi}>PORSIMAPTAR XXVI 2026 · versi aplikasi 2.4.0</p>
          </div>
        </>
      ) : null}

      <nav aria-label="Navigasi peserta" className={styles.bar}>
        {NAV_MOBILE.map((item) => {
          const aktif = navAktif(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={aktif ? 'page' : undefined}
              data-aktif={aktif}
              className={styles.item}
            >
              <Ikon nama={item.ikon} ukuran={20} />
              <span className={styles.label}>{item.label}</span>
            </Link>
          );
        })}

        <button
          type="button"
          aria-expanded={buka}
          aria-controls={sheetId}
          data-aktif={lainnyaAktif}
          onClick={() => setBuka((v) => !v)}
          className={styles.item}
        >
          <span className={styles.ikonLencana}>
            <Ikon nama="titik" ukuran={20} />
            {JUMLAH_LAINNYA > 0 ? (
              <span aria-hidden="true" className={styles.lencana}>
                {JUMLAH_LAINNYA}
              </span>
            ) : null}
          </span>
          <span className={styles.label}>
            Lainnya
            {JUMLAH_LAINNYA > 0 ? (
              <span className={styles.sr}> · {JUMLAH_LAINNYA} tugas menunggu</span>
            ) : null}
          </span>
        </button>
      </nav>
    </>
  );
}
