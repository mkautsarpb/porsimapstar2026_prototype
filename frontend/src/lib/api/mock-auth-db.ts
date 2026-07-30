import type { LoginResult } from '@/types/api/auth';

/**
 * Basis data akun tiruan untuk prototype — HANYA di memori.
 *
 * Sengaja tidak memakai localStorage/sessionStorage: kredensial dan email adalah
 * data pribadi, dan agents.md §6 melarang menyimpannya di storage browser. Efek
 * sampingnya, akun yang dibuat lewat form hilang saat halaman di-reload penuh
 * (navigasi antar halaman auth tetap aman karena client-side routing). Itu
 * trade-off yang disengaja sampai endpoint asli tersedia.
 *
 * TODO(api-contract): hapus file ini begitu `POST /api/v1/auth/*` siap; tidak ada
 * komponen yang mengimpornya langsung — semuanya lewat `lib/api/auth.ts`.
 */

export type StatusAkun = 'aktif' | 'belum-verifikasi' | 'ditangguhkan';

export interface AkunMock {
  email: string;
  password: string;
  status: StatusAkun;
  peran: LoginResult['role'];
}

/** Akun contoh untuk mencoba tiap cabang alur. Semua fiktif, domain `.test` tidak routable. */
export const AKUN_DEMO: readonly {
  readonly email: string;
  readonly password: string;
  readonly label: string;
  readonly hasil: string;
}[] = [
  {
    email: 'peserta@porsimaptar.test',
    password: 'Peserta2026!',
    label: 'Peserta aktif',
    hasil: 'Masuk berhasil',
  },
  {
    email: 'belumverif@porsimaptar.test',
    password: 'Peserta2026!',
    label: 'Email belum diverifikasi',
    hasil: 'Banner verifikasi + kirim ulang tautan',
  },
  {
    email: 'ditangguhkan@porsimaptar.test',
    password: 'Peserta2026!',
    label: 'Akun ditangguhkan',
    hasil: 'Banner akun ditangguhkan',
  },
];

function seed(): AkunMock[] {
  return [
    { email: 'peserta@porsimaptar.test', password: 'Peserta2026!', status: 'aktif', peran: 'peserta' },
    {
      email: 'belumverif@porsimaptar.test',
      password: 'Peserta2026!',
      status: 'belum-verifikasi',
      peran: 'peserta',
    },
    {
      email: 'ditangguhkan@porsimaptar.test',
      password: 'Peserta2026!',
      status: 'ditangguhkan',
      peran: 'peserta',
    },
    { email: 'panitia@porsimaptar.test', password: 'Panitia2026!', status: 'aktif', peran: 'panitia' },
  ];
}

const akun: AkunMock[] = seed();

/** Hitungan gagal per email, untuk mensimulasikan penguncian rate limit. */
const gagal = new Map<string, number>();

const BATAS_GAGAL = 5;
export const JEDA_RATE_LIMIT = 45;

function normal(email: string): string {
  return email.trim().toLowerCase();
}

export function cariAkun(email: string): AkunMock | undefined {
  return akun.find((a) => a.email === normal(email));
}

export function tambahAkun(email: string, password: string): AkunMock {
  const baru: AkunMock = {
    email: normal(email),
    password,
    status: 'belum-verifikasi',
    peran: 'peserta',
  };
  akun.push(baru);
  return baru;
}

/** Idempotency key yang sudah pernah dipakai, supaya retry tidak bikin akun kedua. */
const idempotency = new Map<string, string>();

export function akunUntukKunci(kunci: string): AkunMock | undefined {
  const email = idempotency.get(kunci);
  return email === undefined ? undefined : cariAkun(email);
}

export function catatKunci(kunci: string, email: string): void {
  idempotency.set(kunci, normal(email));
}

export function terkunci(email: string): boolean {
  return (gagal.get(normal(email)) ?? 0) >= BATAS_GAGAL;
}

export function catatGagal(email: string): number {
  const kunci = normal(email);
  const jumlah = (gagal.get(kunci) ?? 0) + 1;
  gagal.set(kunci, jumlah);
  return jumlah;
}

export function resetGagal(email: string): void {
  gagal.delete(normal(email));
}

/**
 * Menandai email sebagai terverifikasi. Di produksi ini terjadi saat pengguna
 * membuka tautan di email; di prototype dipanggil dari tombol demo.
 */
export function tandaiTerverifikasi(email: string): boolean {
  const ditemukan = cariAkun(email);
  if (!ditemukan || ditemukan.status !== 'belum-verifikasi') return false;
  ditemukan.status = 'aktif';
  return true;
}
