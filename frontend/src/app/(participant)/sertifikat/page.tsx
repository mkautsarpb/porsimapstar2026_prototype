import type { Metadata } from 'next';
import { SegeraHadir } from '@/components/app/SegeraHadir';

export const metadata: Metadata = {
  title: 'Sertifikat',
  robots: { index: false, follow: false },
};

export default function Halaman() {
  return (
    <SegeraHadir
      ikon="piagam"
      judul="Sertifikat"
      penjelasan="Sertifikat peserta dan pemenang, terbit setelah kompetisi selesai."
      isi={[
        'Unduh sertifikat per cabang',
        'Verifikasi keaslian lewat nomor seri',
      ]}
    />
  );
}
