'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Ikon } from '@/components/app/Ikon';
import { navAktif } from '@/components/app/nav-peserta';
import { NAV_PANITIA } from '@/data/panitia';
import { LABEL_PERAN, type SesiPanitia } from '@/lib/admin/izin';
import styles from './AdminSidebar.module.css';

/**
 * Sidebar Panel Panitia. Blok identitas di bawah menyebut peran DAN cakupan
 * lomba, karena hampir semua angka di dashboard dibatasi cakupan itu — tanpa
 * ditulis, angka mudah salah dibaca sebagai seluruh event.
 *
 * Peran dan cakupan datang dari sesi server, bukan konstanta: kalau keduanya
 * dari sumber berbeda, sidebar bisa menulis "Panitia umum" sementara gating
 * menjalankan kewenangan lain, dan pengujian izin jadi menyesatkan.
 */
export function AdminSidebar({ sesi }: { readonly sesi: SesiPanitia }) {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <Link href="/admin/dashboard" className={styles.brand}>
        <span aria-hidden="true" className={styles.lambang}>
          P
        </span>
        <span className={styles.brandTeks}>
          <span className={styles.brandNama}>PORSIMAPTAR XXVI</span>
          <span className={styles.brandPanel}>Panel Panitia</span>
        </span>
      </Link>

      <nav aria-label="Navigasi panitia" className={styles.nav}>
        {NAV_PANITIA.map((m) => {
          const aktif = navAktif(pathname, m.href);

          return (
            <Link
              key={m.href}
              href={m.href}
              aria-current={aktif ? 'page' : undefined}
              data-aktif={aktif}
              data-label={m.label}
              className={styles.item}
            >
              <span aria-hidden="true" className={styles.penanda} />
              <Ikon nama={m.ikon} ukuran={16} />
              <span className={styles.label}>{m.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.akun}>
        <div className={styles.akunKepala}>
          <span aria-hidden="true" className={styles.avatar}>
            {sesi.inisial}
          </span>
          <span className={styles.akunTeks}>
            <span className={styles.akunNama}>{sesi.nama}</span>
            <span className={styles.akunPeran}>{LABEL_PERAN[sesi.peran]}</span>
          </span>
        </div>

        <p className={styles.cakupan}>
          {sesi.cakupanPenuh ? 'Cakupan: seluruh event' : `Cakupan: ${sesi.cakupanLomba.length} lomba`}
          {' — '}
          {sesi.cakupanLomba.join(', ')}
        </p>

        <Link href="/admin/kewenangan" className={styles.tautanKewenangan}>
          Lihat kewenangan saya
        </Link>
      </div>
    </aside>
  );
}
