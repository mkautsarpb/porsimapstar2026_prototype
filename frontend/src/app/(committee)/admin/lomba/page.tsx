import type { Metadata } from 'next';
import { SegeraHadir } from '@/components/app/SegeraHadir';

export const metadata: Metadata = {
  title: 'Lomba · Panitia',
  robots: { index: false, follow: false },
};

export default function Halaman() {
  return (
    <SegeraHadir
      ikon="piala"
      judul="Lomba"
      penjelasan="Pengaturan cabang lomba: kuota, ketentuan, dan daftar tunggu."
      isi={[
        'Kuota per cabang dan status daftar tunggu',
        'Ketentuan dan berkas regulasi',
        'Riwayat perubahan kuota',
      ]}
      kembali={{ href: '/admin/dashboard', label: 'Kembali ke Panel Panitia' }}
    />
  );
}
