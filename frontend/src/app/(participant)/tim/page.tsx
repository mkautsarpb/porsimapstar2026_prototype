import type { Metadata } from 'next';
import { SegeraHadir } from '@/components/app/SegeraHadir';

export const metadata: Metadata = {
  title: 'Tim saya',
  robots: { index: false, follow: false },
};

export default function Halaman() {
  return (
    <SegeraHadir
      ikon="orangBanyak"
      judul="Tim saya"
      penjelasan="Semua tim yang kamu ikuti beserta status roster dan undangan."
      isi={[
        'Daftar tim beserta peran kamu',
        'Undang anggota lewat kode peserta atau email',
        'Status undangan: menunggu, diterima, kedaluwarsa',
      ]}
    />
  );
}
