import type { Metadata } from 'next';
import { SegeraHadir } from '@/components/app/SegeraHadir';

export const metadata: Metadata = {
  title: 'Dokumen',
  robots: { index: false, follow: false },
};

export default function Halaman() {
  return (
    <SegeraHadir
      ikon="berkas"
      judul="Dokumen"
      penjelasan="Berkas persyaratan yang kamu unggah dan status pemeriksaannya."
      isi={[
        'Unggah ulang berkas yang perlu revisi',
        'Riwayat versi tiap berkas',
        'Catatan panitia per dokumen',
      ]}
    />
  );
}
