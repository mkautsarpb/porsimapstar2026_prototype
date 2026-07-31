import type { Metadata } from 'next';
import { SegeraHadir } from '@/components/app/SegeraHadir';

export const metadata: Metadata = {
  title: 'Peserta · Panitia',
  robots: { index: false, follow: false },
};

export default function Halaman() {
  return (
    <SegeraHadir
      ikon="orangBanyak"
      judul="Peserta"
      penjelasan="Daftar seluruh akun dan pendaftaran peserta dalam cakupan lombamu."
      isi={[
        'Tabel server-side dengan filter dan pagination',
        'Ekspor menghormati filter, permission, dan masking',
        'NIK selalu termasking di tabel maupun tooltip',
      ]}
      kembali={{ href: '/admin/dashboard', label: 'Kembali ke Panel Panitia' }}
    />
  );
}
