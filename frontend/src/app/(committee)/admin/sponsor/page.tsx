import type { Metadata } from 'next';
import { SegeraHadir } from '@/components/app/SegeraHadir';

export const metadata: Metadata = {
  title: 'Sponsor · Panitia',
  robots: { index: false, follow: false },
};

export default function Halaman() {
  return (
    <SegeraHadir
      ikon="piagam"
      judul="Sponsor"
      penjelasan="Pengelolaan sponsor dan penempatan logo di portal publik."
      isi={[
        'Daftar sponsor per level',
        'Unggah logo dan tautan',
        'Pratinjau penempatan di landing',
      ]}
      kembali={{ href: '/admin/dashboard', label: 'Kembali ke Panel Panitia' }}
    />
  );
}
