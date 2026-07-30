import type { Metadata } from 'next';
import { SegeraHadir } from '@/components/app/SegeraHadir';

export const metadata: Metadata = {
  title: 'Bantuan',
  robots: { index: false, follow: false },
};

export default function Halaman() {
  return (
    <SegeraHadir
      ikon="bantuan"
      judul="Bantuan"
      penjelasan="Kontak PIC cabang, live chat panitia, dan pertanyaan yang sering muncul."
      isi={[
        'Kontak PIC per cabang lomba',
        'Formulir laporan masalah',
        'Pertanyaan umum pendaftaran',
      ]}
    />
  );
}
