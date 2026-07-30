import type { Metadata } from 'next';
import { SegeraHadir } from '@/components/app/SegeraHadir';

export const metadata: Metadata = {
  title: 'Profil',
  robots: { index: false, follow: false },
};

export default function Halaman() {
  return (
    <SegeraHadir
      ikon="orang"
      judul="Profil"
      penjelasan="Data diri, pendidikan, dan kontak yang dipakai untuk verifikasi pendaftaran."
      isi={[
        'Stepper kelengkapan data',
        'Ubah kontak dan institusi',
        'Status verifikasi akun',
      ]}
    />
  );
}
