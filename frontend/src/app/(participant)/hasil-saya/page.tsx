import type { Metadata } from 'next';
import { SegeraHadir } from '@/components/app/SegeraHadir';

export const metadata: Metadata = {
  title: 'Hasil saya',
  robots: { index: false, follow: false },
};

export default function Halaman() {
  return (
    <SegeraHadir
      ikon="piala"
      judul="Hasil saya"
      penjelasan="Hasil pertandingan dan bagan cabang yang kamu ikuti."
      isi={[
        'Riwayat skor tiap laga',
        'Bagan gugur dan klasemen grup',
        'Status lolos ke babak berikutnya',
      ]}
    />
  );
}
