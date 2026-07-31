import type { Metadata } from 'next';
import { AdminShell } from '@/components/admin/AdminShell';
import { TolakAkses } from '@/components/admin/TolakAkses';
import { WAKTU_SERVER_ISO, kesehatanDemo } from '@/data/panitia';
import { keRingkasKesehatan } from '@/lib/admin/dashboard-api';
import { bolehLihatTabSistem, punyaIzin } from '@/lib/admin/izin';
import { bacaSesiPanitia } from '@/lib/admin/sesi';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/**
 * Layout Panel Panitia.
 *
 * Sesi dibaca DI SINI, di server, lalu diturunkan sebagai prop. Komponen client
 * tidak pernah membaca sesi sendiri dan tidak pernah mengirim perannya ke server
 * — peran yang dikirim client bisa dikarang (agents.md §0 prinsip 2).
 *
 * TODO: sesi asli menunggu kontrak auth backend. Setelah ada, layout ini juga
 * harus mengarahkan sesi kedaluwarsa ke halaman masuk, dan status 403 sebaiknya
 * dikirim sebagai status HTTP sungguhan lewat `forbidden()` begitu
 * `experimental.authInterrupts` dinyalakan.
 */
export default async function CommitteeLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const sesi = await bacaSesiPanitia();

  // Gagal tertutup: tanpa izin dasar, isi halaman tidak pernah dirender.
  if (!punyaIzin(sesi, 'dashboard.view')) return <TolakAkses />;

  return (
    <AdminShell
      sesi={sesi}
      kesehatan={keRingkasKesehatan(kesehatanDemo())}
      waktuServerIso={WAKTU_SERVER_ISO}
      bolehBukaSistem={bolehLihatTabSistem(sesi)}
    >
      {children}
    </AdminShell>
  );
}
