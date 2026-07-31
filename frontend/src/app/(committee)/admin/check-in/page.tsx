import type { Metadata } from 'next';
import { SegeraHadir } from '@/components/app/SegeraHadir';

export const metadata: Metadata = {
  title: 'Check-in · Panitia',
  robots: { index: false, follow: false },
};

export default function Halaman() {
  return (
    <SegeraHadir
      ikon="qr"
      judul="Check-in"
      penjelasan="Monitoring pindaian QR di venue selama hari pertandingan."
      isi={[
        'Pindaian per venue dan per petugas',
        'Alasan pindaian ditolak — kode saja, tanpa data pribadi',
        'Selalu menampilkan hari berjalan',
      ]}
      kembali={{ href: '/admin/dashboard', label: 'Kembali ke Panel Panitia' }}
    />
  );
}
