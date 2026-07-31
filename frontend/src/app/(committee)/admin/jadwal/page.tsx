import type { Metadata } from 'next';
import { SegeraHadir } from '@/components/app/SegeraHadir';

export const metadata: Metadata = {
  title: 'Jadwal · Panitia',
  robots: { index: false, follow: false },
};

export default function Halaman() {
  return (
    <SegeraHadir
      ikon="kalender"
      judul="Jadwal"
      penjelasan="Penyusunan jadwal pertandingan per venue dan per cabang."
      isi={[
        'Editor jadwal per venue',
        'Deteksi bentrok jadwal peserta',
        'Publikasi perubahan disertai notifikasi',
      ]}
      kembali={{ href: '/admin/dashboard', label: 'Kembali ke Panel Panitia' }}
    />
  );
}
