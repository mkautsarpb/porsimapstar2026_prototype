'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Ikon } from '@/components/app/Ikon';
import { navAktif } from '@/components/app/nav-peserta';
import { NAV_PANITIA } from '@/data/panitia';
import { useOnline } from '@/hooks/useOnline';
import { formatWaktuServer } from '@/lib/admin/format';
import type { SesiPanitia } from '@/lib/admin/izin';
import type { RingkasKesehatan } from '@/types/panitia';
import { AdminSidebar } from './AdminSidebar';
import { PilKesehatan } from './PilKesehatan';
import styles from './AdminShell.module.css';

/**
 * Kerangka Panel Panitia: sidebar/rail, topbar dengan waktu server dan pil
 * kesehatan, lalu area konten yang digulir sendiri.
 *
 * Waktu di topbar sengaja waktu server, bukan jam perangkat — seluruh angka
 * dashboard punya waktu pembaruan sendiri dan harus dibaca pada acuan yang sama.
 *
 * Sesi datang sebagai prop dari layout Server Component. Komponen ini TIDAK
 * boleh membaca sesi sendiri: apa pun yang dibaca di sini ikut terkirim ke
 * browser (agents.md §6).
 */
export function AdminShell({
  sesi,
  kesehatan,
  waktuServerIso,
  bolehBukaSistem,
  children,
}: {
  readonly sesi: SesiPanitia;
  readonly kesehatan: RingkasKesehatan;
  readonly waktuServerIso: string;
  readonly bolehBukaSistem: boolean;
  readonly children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [digulir, setDigulir] = useState(false);
  const online = useOnline();

  const judul = NAV_PANITIA.find((m) => navAktif(pathname, m.href))?.label ?? 'Panel Panitia';

  return (
    <div className={styles.shell}>
      <AdminSidebar sesi={sesi} />

      <div className={styles.utama}>
        <header data-digulir={digulir} className={styles.topbar}>
          <div className={styles.judulBlok}>
            <p className={styles.judul}>{judul}</p>
            <p className={styles.waktu}>{formatWaktuServer(waktuServerIso)}</p>
          </div>

          <div className={styles.kanan}>
            <span className={styles.event}>PORSIMAPTAR XXVI 2026</span>

            <PilKesehatan kesehatan={kesehatan} bolehBukaSistem={bolehBukaSistem} />

            <Link href="/admin/sinkronisasi?tab=notifikasi" className={styles.tombolIkon}>
              <Ikon nama="lonceng" ukuran={18} />
              <span aria-hidden="true" className={styles.badge}>
                3
              </span>
              <span className="sr-only">Notifikasi panitia, 3 perlu perhatian</span>
            </Link>

            <span className={styles.avatar} aria-hidden="true">
              {sesi.inisial}
            </span>
          </div>
        </header>

        {!online ? (
          <div role="status" className={styles.offline}>
            <Ikon nama="seru" ukuran={16} />
            <p className={styles.offlineTeks}>
              <strong>Kamu sedang offline.</strong> Angka di halaman ini tidak lagi diperbarui — jangan
              dipakai untuk keputusan sampai koneksi kembali.
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
          {children}
        </main>
      </div>
    </div>
  );
}
