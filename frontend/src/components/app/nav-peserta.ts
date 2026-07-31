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
  /** Jumlah tugas tertunda; dijumlahkan ke lencana ikon "Lainnya" di bottom nav. */
  readonly jumlah?: number;
}

/**
 * Isi sheet "Lainnya" di mobile — jalur ke menu yang tidak muat di bottom nav.
 *
 * Sidebar desktop memuat tujuh menu, bottom nav hanya menampung empat. Empat
 * yang paling sering dipakai saat lomba tetap di bottom nav; sisanya pindah ke
 * sheet ini, dengan lencana yang naik ke ikon "Lainnya" supaya tidak ada tugas
 * yang tersembunyi di balik satu ketukan.
 */
export const MENU_LAINNYA: readonly ItemSheet[] = [
  {
    href: '/dokumen',
    label: 'Dokumen',
    ikon: 'berkas',
    keterangan: '1 perlu diperbaiki, 1 belum diunggah',
    badge: '2 tugas',
    jumlah: 2,
  },
  { href: '/profil', label: 'Profil', ikon: 'orang', keterangan: 'Data diri, pendidikan, dan kontak' },
  {
    href: '/undangan-tim',
    label: 'Kotak undangan',
    ikon: 'amplop',
    keterangan: 'Undangan tim yang menunggu jawabanmu',
    badge: '1 menunggu',
    jumlah: 1,
  },
  {
    href: '/bantuan',
    label: 'Bantuan',
    ikon: 'bantuan',
    keterangan: 'Kontak PIC, lapor masalah, FAQ',
  },
  { href: '/sertifikat', label: 'Sertifikat', ikon: 'piagam', keterangan: 'Terbit setelah kompetisi selesai' },
];

/** Total tugas tertunda di balik menu "Lainnya". */
export const JUMLAH_LAINNYA = MENU_LAINNYA.reduce((n, m) => n + (m.jumlah ?? 0), 0);

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
