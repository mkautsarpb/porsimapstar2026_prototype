import type { Metadata } from 'next';
import { SegeraHadir } from '@/components/app/SegeraHadir';

export const metadata: Metadata = {
  title: 'Pertandingan · Panitia',
  robots: { index: false, follow: false },
};

export default function Halaman() {
  return (
    <SegeraHadir
      ikon="piala"
      judul="Pertandingan"
      penjelasan="Kontrol pertandingan berjalan: skor, status, dan hasil."
      isi={[
        'Status terjadwal, berlangsung, selesai, ditunda, dibatalkan',
        'Pencatatan hasil dengan konfirmasi eksplisit',
        'Bagan gugur dan klasemen grup',
      ]}
      kembali={{ href: '/admin/dashboard', label: 'Kembali ke Panel Panitia' }}
    />
  );
}
