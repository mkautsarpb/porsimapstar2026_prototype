import type { Metadata } from 'next';
import { SegeraHadir } from '@/components/app/SegeraHadir';

export const metadata: Metadata = {
  title: 'Pendaftaran',
  robots: { index: false, follow: false },
};

export default function Halaman() {
  return (
    <SegeraHadir
      ikon="amplop"
      judul="Pendaftaran"
      penjelasan="Tahap akhir sebelum pendaftaran dikirim ke panitia untuk diperiksa."
      isi={[
        'Review data diri dan dokumen',
        'Pilih cabang lomba',
        'Kirim untuk diperiksa panitia',
      ]}
    />
  );
}
