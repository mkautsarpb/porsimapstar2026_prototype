import type { Metadata } from 'next';
import { SegeraHadir } from '@/components/app/SegeraHadir';

export const metadata: Metadata = {
  title: 'Kewenangan saya · Panitia',
  robots: { index: false, follow: false },
};

export default function Halaman() {
  return (
    <SegeraHadir
      ikon="gear"
      judul="Kewenangan saya"
      penjelasan="Rincian peran, cakupan lomba, dan batas tindakan akunmu."
      isi={[
        'Daftar tindakan yang boleh dan tidak',
        'Cakupan lomba yang kamu pegang',
        'Cara mengajukan perluasan akses',
      ]}
      kembali={{ href: '/admin/dashboard', label: 'Kembali ke Panel Panitia' }}
    />
  );
}
