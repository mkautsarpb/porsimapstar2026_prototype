import type { NamaIkon } from '@/types/peserta';

export interface ItemNav {
  readonly href: string;
  readonly label: string;
  readonly ikon: NamaIkon;
}

/** Navigasi utama area peserta (sidebar desktop & rail tablet). */
export const NAV_PESERTA: readonly ItemNav[] = [
  { href: '/dashboard', label: 'Dashboard', ikon: 'grid' },
  { href: '/lomba-saya', label: 'Lomba saya', ikon: 'piala' },
  { href: '/tim', label: 'Tim saya', ikon: 'orangBanyak' },
  { href: '/jadwal-saya', label: 'Jadwal', ikon: 'kalender' },
  { href: '/dokumen', label: 'Dokumen', ikon: 'berkas' },
  { href: '/profil', label: 'Profil', ikon: 'orang' },
  { href: '/bantuan', label: 'Bantuan', ikon: 'bantuan' },
];

/** Empat item pertama bottom nav mobile; item kelima "Lainnya" membuka sheet. */
export const NAV_MOBILE: readonly ItemNav[] = [
  { href: '/dashboard', label: 'Dashboard', ikon: 'grid' },
  { href: '/lomba-saya', label: 'Lomba', ikon: 'piala' },
  { href: '/jadwal-saya', label: 'Jadwal', ikon: 'kalender' },
  { href: '/tim', label: 'Tim', ikon: 'orangBanyak' },
];

export interface ItemSheet extends ItemNav {
  readonly keterangan: string;
  readonly badge?: string;
}

/** Isi sheet "Lainnya" di mobile — jalur ke menu yang tidak muat di bottom nav. */
export const MENU_LAINNYA: readonly ItemSheet[] = [
  {
    href: '/dokumen',
    label: 'Dokumen',
    ikon: 'berkas',
    keterangan: 'Berkas persyaratan dan riwayat unggahan',
    badge: '1 revisi',
  },
  { href: '/profil', label: 'Profil', ikon: 'orang', keterangan: 'Data diri, pendidikan, dan kontak' },
  {
    href: '/bantuan',
    label: 'Bantuan',
    ikon: 'bantuan',
    keterangan: 'PIC cabang, live chat, pertanyaan umum',
  },
  { href: '/sertifikat', label: 'Sertifikat', ikon: 'piagam', keterangan: 'Terbit setelah kompetisi selesai' },
];

/** Judul yang tampil di topbar untuk sebuah path. */
export function judulHalaman(pathname: string): string {
  const cocok = NAV_PESERTA.filter((n) => pathname === n.href || pathname.startsWith(`${n.href}/`)).sort(
    (a, b) => b.href.length - a.href.length,
  );
  return cocok[0]?.label ?? 'Dashboard';
}

export function navAktif(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
