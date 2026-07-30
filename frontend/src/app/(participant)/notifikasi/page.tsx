import type { Metadata } from 'next';
import { SegeraHadir } from '@/components/app/SegeraHadir';

export const metadata: Metadata = {
  title: 'Notifikasi',
  robots: { index: false, follow: false },
};

export default function Halaman() {
  return (
    <SegeraHadir
      ikon="lonceng"
      judul="Notifikasi"
      penjelasan="Seluruh kabar soal verifikasi, perubahan jadwal, dan hasil pertandingan."
      isi={[
        'Filter belum dibaca',
        'Tandai semua sudah dibaca',
        'Tautan langsung ke lomba terkait',
      ]}
    />
  );
}
