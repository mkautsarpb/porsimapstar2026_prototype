import type { Metadata } from 'next';
import { SegeraHadir } from '@/components/app/SegeraHadir';

export const metadata: Metadata = {
  title: 'Verifikasi · Panitia',
  robots: { index: false, follow: false },
};

export default function Halaman() {
  return (
    <SegeraHadir
      ikon="centang"
      judul="Verifikasi"
      penjelasan="Worklist verifikasi pendaftaran: antrean, keputusan, dan alasan penolakan."
      isi={[
        'Antrean diurutkan menurut umur tertua',
        'Keputusan wajib disertai alasan',
        'Keputusan dokumen tidak boleh lewat bulk action',
      ]}
      kembali={{ href: '/admin/dashboard', label: 'Kembali ke Panel Panitia' }}
    />
  );
}
