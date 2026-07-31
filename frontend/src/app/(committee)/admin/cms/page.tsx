import type { Metadata } from 'next';
import { SegeraHadir } from '@/components/app/SegeraHadir';

export const metadata: Metadata = {
  title: 'CMS · Panitia',
  robots: { index: false, follow: false },
};

export default function Halaman() {
  return (
    <SegeraHadir
      ikon="berkas"
      judul="CMS"
      penjelasan="Konten portal publik: pengumuman, FAQ, dan halaman statis."
      isi={[
        'Editor konten dengan sanitasi',
        'Riwayat versi dan penerbitan',
        'Pratinjau sebelum terbit',
      ]}
      kembali={{ href: '/admin/dashboard', label: 'Kembali ke Panel Panitia' }}
    />
  );
}
