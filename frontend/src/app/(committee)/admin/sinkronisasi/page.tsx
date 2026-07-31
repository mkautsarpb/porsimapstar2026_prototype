import type { Metadata } from 'next';
import { SegeraHadir } from '@/components/app/SegeraHadir';

export const metadata: Metadata = {
  title: 'Sinkronisasi · Panitia',
  robots: { index: false, follow: false },
};

export default function Halaman() {
  return (
    <SegeraHadir
      ikon="ulang"
      judul="Sinkronisasi"
      penjelasan="Status integrasi Google Sheets, antrean notifikasi, dan kesehatan sistem."
      isi={[
        'Sync manual dan daftar galat',
        'Coba ulang notifikasi yang gagal',
        'Status API, database, Redis, dan cadangan',
      ]}
      kembali={{ href: '/admin/dashboard', label: 'Kembali ke Panel Panitia' }}
    />
  );
}
