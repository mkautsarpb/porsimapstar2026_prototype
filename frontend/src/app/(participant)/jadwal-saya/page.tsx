import type { Metadata } from 'next';
import { SegeraHadir } from '@/components/app/SegeraHadir';

export const metadata: Metadata = {
  title: 'Jadwal saya',
  robots: { index: false, follow: false },
};

export default function Halaman() {
  return (
    <SegeraHadir
      ikon="kalender"
      judul="Jadwal saya"
      penjelasan="Seluruh agenda pertandingan dan sesi lomba yang kamu ikuti, dalam satu linimasa."
      isi={[
        'Tampilan harian dan daftar',
        'Penanda jadwal yang berubah',
        'Filter per cabang lomba',
      ]}
    />
  );
}
