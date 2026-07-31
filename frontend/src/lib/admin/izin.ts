/**
 * Gating kewenangan Panel Panitia (SRS §14.2, FE-ADMIN-002).
 *
 * Prinsip berkas ini: **gagal tertutup**. Setiap jalur yang tidak jelas —
 * permission tak dikenal, sesi tidak lengkap, daftar izin kosong — menjawab
 * "tidak boleh". Mengizinkan sebagai bawaan membuat kebocoran gating baru
 * ketahuan setelah sesi asli terpasang, saat biayanya jauh lebih mahal.
 *
 * Menyembunyikan UI BUKAN kontrol keamanan. Backend tetap wajib menolak;
 * berkas ini hanya membuat antarmuka jujur terhadap kewenangan.
 */

export const IZIN = [
  'dashboard.view',
  'verification.decide',
  'match.edit',
  'user.manage',
  'integration.manage',
] as const;

export type Izin = (typeof IZIN)[number];

export const PERAN = ['panitia-umum', 'verifier', 'operator-pertandingan', 'super-admin'] as const;

export type PeranPanitia = (typeof PERAN)[number];

/** SRS §14.2. Panitia umum hanya melihat statistik sesuai cakupannya. */
export const IZIN_PER_PERAN: Readonly<Record<PeranPanitia, readonly Izin[]>> = {
  'panitia-umum': ['dashboard.view'],
  verifier: ['dashboard.view', 'verification.decide'],
  'operator-pertandingan': ['dashboard.view', 'match.edit'],
  'super-admin': ['dashboard.view', 'verification.decide', 'match.edit', 'user.manage', 'integration.manage'],
};

export const LABEL_PERAN: Readonly<Record<PeranPanitia, string>> = {
  'panitia-umum': 'Panitia umum',
  verifier: 'Verifier',
  'operator-pertandingan': 'Operator pertandingan',
  'super-admin': 'Super Admin',
};

export interface SesiPanitia {
  readonly nama: string;
  readonly inisial: string;
  readonly peran: PeranPanitia;
  readonly izin: readonly Izin[];
  /** Lomba yang dipegang. Hampir semua angka dashboard dibatasi cakupan ini. */
  readonly cakupanLomba: readonly string[];
  /** True bila akun ini memang memegang seluruh event, bukan sebagian lomba. */
  readonly cakupanPenuh: boolean;
}

function izinDikenal(nilai: string): nilai is Izin {
  return (IZIN as readonly string[]).includes(nilai);
}

/**
 * Satu-satunya pintu pemeriksaan izin. Menolak bila:
 * sesi tidak ada · sesi tidak lengkap · izin tidak dikenal · izin tidak dimiliki.
 */
export function punyaIzin(sesi: SesiPanitia | null | undefined, izin: string): boolean {
  if (!sesi || !Array.isArray(sesi.izin) || sesi.izin.length === 0) return false;
  if (!izinDikenal(izin)) return false;
  return sesi.izin.includes(izin);
}

export function punyaSemuaIzin(sesi: SesiPanitia | null | undefined, daftar: readonly string[]): boolean {
  if (daftar.length === 0) return false;
  return daftar.every((i) => punyaIzin(sesi, i));
}

/** Menyaring daftar string bebas (mis. dari env atau payload) ke izin yang sah. */
export function saringIzin(nilai: readonly string[]): readonly Izin[] {
  return nilai.map((n) => n.trim()).filter(izinDikenal);
}

/**
 * Tab Sistem memuat sinkronisasi Sheets, notifikasi, dan kesehatan sistem —
 * seluruhnya pengaturan integrasi, yang di SRS §14.2 hanya milik Super Admin.
 */
export function bolehLihatTabSistem(sesi: SesiPanitia | null | undefined): boolean {
  return punyaIzin(sesi, 'integration.manage');
}
