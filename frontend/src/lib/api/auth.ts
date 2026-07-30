import type {
  ApiResult,
  LoginPayload,
  LoginResult,
  RegisterPayload,
  RegisterResult,
} from '@/types/api/auth';
import {
  akunUntukKunci,
  catatGagal,
  catatKunci,
  cariAkun,
  JEDA_RATE_LIMIT,
  resetGagal,
  tambahAkun,
  tandaiTerverifikasi,
  terkunci,
} from './mock-auth-db';

/**
 * Lapisan pemanggilan API autentikasi.
 *
 * TODO(api-contract): implementasi di bawah masih MOCK karena endpoint
 * `POST /api/v1/auth/{login,register,email/resend}` belum tersedia. Datanya datang
 * dari `mock-auth-db.ts` (di memori, lihat catatan privasi di sana). Yang perlu
 * diganti nanti hanya isi fungsi-fungsi ini — komponen tidak menyentuh `fetch`
 * langsung. Kontrak yang diharapkan ada di `src/types/api/auth.ts`.
 *
 * Catatan keamanan: sesi nantinya dibawa cookie HttpOnly + Secure + SameSite yang
 * di-set server (agents.md §6). Mock ini sengaja TIDAK menulis apa pun ke
 * localStorage/sessionStorage.
 */

/**
 * Penanda bahwa autentikasi masih berjalan di atas data tiruan. Dipakai UI untuk
 * menampilkan panel akun demo dan tombol verifikasi demo. Set `false` (lalu hapus
 * `mock-auth-db.ts`) begitu backend siap.
 */
export const AUTH_MOCK = true;

/** Skenario respons untuk memaksa error sisi server (dibaca dari query `?simulasi=`). */
export type SimulasiRespons =
  | 'sukses'
  | 'kredensial-salah'
  | 'belum-verifikasi'
  | 'suspended'
  | 'rate-limit'
  | 'server-error'
  | 'konflik';

const SIMULASI: readonly SimulasiRespons[] = [
  'sukses',
  'kredensial-salah',
  'belum-verifikasi',
  'suspended',
  'rate-limit',
  'server-error',
  'konflik',
];

export function bacaSimulasi(nilai: string | null | undefined): SimulasiRespons {
  const cocok = SIMULASI.find((s) => s === nilai);
  return cocok ?? 'sukses';
}

const JEDA_MOCK_MS = 900;
const JEDA_KIRIM_ULANG = 60;

function tunggu(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/** Idempotency key untuk aksi kritis (agents.md §6). */
export function buatIdempotencyKey(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `idem-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function sedangOffline(): boolean {
  return typeof navigator !== 'undefined' && navigator.onLine === false;
}

/** Error yang bisa dipaksa lewat `?simulasi=`, berlaku untuk semua endpoint. */
function paksaError(simulasi: SimulasiRespons): ApiResult<never> | null {
  if (sedangOffline()) return { ok: false, error: { code: 'OFFLINE' } };
  if (simulasi === 'rate-limit') {
    return {
      ok: false,
      error: { code: 'RATE_LIMITED', retryAfter: JEDA_RATE_LIMIT, correlationId: 'mock-429' },
    };
  }
  if (simulasi === 'server-error') {
    return { ok: false, error: { code: 'SERVER_ERROR', correlationId: 'mock-500' } };
  }
  return null;
}

export async function kirimMasuk(
  payload: LoginPayload,
  simulasi: SimulasiRespons = 'sukses',
): Promise<ApiResult<LoginResult>> {
  await tunggu(JEDA_MOCK_MS);

  const dipaksa = paksaError(simulasi);
  if (dipaksa) return dipaksa;

  switch (simulasi) {
    case 'kredensial-salah':
      return { ok: false, error: { code: 'INVALID_CREDENTIALS', correlationId: 'mock-401' } };
    case 'belum-verifikasi':
      return { ok: false, error: { code: 'EMAIL_NOT_VERIFIED', correlationId: 'mock-403-verif' } };
    case 'suspended':
      return { ok: false, error: { code: 'ACCOUNT_SUSPENDED', correlationId: 'mock-403-susp' } };
    default:
      break;
  }

  // Penguncian dulu: percobaan ke-6 dan seterusnya tidak lagi memeriksa password.
  if (terkunci(payload.email)) {
    return {
      ok: false,
      error: { code: 'RATE_LIMITED', retryAfter: JEDA_RATE_LIMIT, correlationId: 'mock-429' },
    };
  }

  const akun = cariAkun(payload.email);

  // Email tidak dikenal dan password salah dibalas kode yang sama, supaya tidak
  // bisa dipakai menebak email mana yang terdaftar.
  if (!akun || akun.password !== payload.password) {
    catatGagal(payload.email);
    return { ok: false, error: { code: 'INVALID_CREDENTIALS', correlationId: 'mock-401' } };
  }

  if (akun.status === 'belum-verifikasi') {
    return { ok: false, error: { code: 'EMAIL_NOT_VERIFIED', correlationId: 'mock-403-verif' } };
  }

  if (akun.status === 'ditangguhkan') {
    return { ok: false, error: { code: 'ACCOUNT_SUSPENDED', correlationId: 'mock-403-susp' } };
  }

  resetGagal(payload.email);
  return { ok: true, data: { role: akun.peran } };
}

export async function kirimDaftar(
  payload: RegisterPayload,
  simulasi: SimulasiRespons = 'sukses',
): Promise<ApiResult<RegisterResult>> {
  await tunggu(JEDA_MOCK_MS);

  const dipaksa = paksaError(simulasi);
  if (dipaksa) return dipaksa;

  if (simulasi === 'konflik') {
    return { ok: false, error: { code: 'CONFLICT', correlationId: 'mock-409' } };
  }

  // Retry dengan idempotency key yang sama mengembalikan hasil pertama, bukan konflik.
  const sudahAda = akunUntukKunci(payload.idempotencyKey);
  if (sudahAda) {
    return { ok: true, data: { email: sudahAda.email, resendAfter: JEDA_KIRIM_ULANG } };
  }

  if (cariAkun(payload.email)) {
    return { ok: false, error: { code: 'CONFLICT', correlationId: 'mock-409' } };
  }

  const baru = tambahAkun(payload.email, payload.password);
  catatKunci(payload.idempotencyKey, baru.email);

  return { ok: true, data: { email: baru.email, resendAfter: JEDA_KIRIM_ULANG } };
}

export async function kirimUlangVerifikasi(
  email: string,
  simulasi: SimulasiRespons = 'sukses',
): Promise<ApiResult<{ readonly resendAfter: number }>> {
  await tunggu(JEDA_MOCK_MS);

  const dipaksa = paksaError(simulasi);
  if (dipaksa) return dipaksa;

  // Email yang tidak terdaftar tetap dibalas sukses: kalau tidak, endpoint ini
  // jadi alat untuk memeriksa email mana yang punya akun.
  void email;
  return { ok: true, data: { resendAfter: JEDA_KIRIM_ULANG } };
}

/**
 * Jalan pintas khusus prototype: menandai email sudah memverifikasi tautannya,
 * karena tidak ada email yang benar-benar terkirim. Tidak ada padanannya di API.
 */
export async function verifikasiDemo(email: string): Promise<boolean> {
  await tunggu(400);
  return tandaiTerverifikasi(email);
}
