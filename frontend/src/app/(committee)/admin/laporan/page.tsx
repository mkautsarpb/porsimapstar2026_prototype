import type { Metadata } from 'next';
import { SegeraHadir } from '@/components/app/SegeraHadir';

export const metadata: Metadata = {
  title: 'Laporan · Panitia',
  robots: { index: false, follow: false },
};

export default function Halaman() {
  return (
    <SegeraHadir
      ikon="grid"
      judul="Laporan"
      penjelasan="Rekapitulasi peserta, verifikasi, check-in, dan hasil pertandingan."
      isi={[
        'Ekspor CSV dengan proteksi formula injection',
        'Rekap per cabang dan per institusi',
        'Jejak siapa mengekspor apa',
      ]}
      kembali={{ href: '/admin/dashboard', label: 'Kembali ke Panel Panitia' }}
    />
  );
}
