/**
 * Kontrak API autentikasi — versi frontend.
 *
 * TODO(api-contract): endpoint dan nama field di bawah masih asumsi frontend.
 * Yang dibutuhkan dari backend (agents.md §1 prinsip 3):
 *   POST /api/v1/auth/login     { email, password, remember }  -> 204 + cookie sesi
 *   POST /api/v1/auth/register  { email, password, password_confirmation, consent }
 *                               header: Idempotency-Key       -> 201 { data: { email } }
 *   POST /api/v1/auth/email/resend { email }                   -> 202 { data: { retry_after } }
 * Semua error dibalas dengan bentuk `ApiError` di bawah; teks mentah dari server
 * TIDAK pernah dirender — hanya `code` yang dipetakan lewat `src/lib/auth-errors.ts`.
 */

/** Kode error autentikasi yang punya penanganan UI eksplisit. */
export type AuthErrorCode =
  | 'INVALID_CREDENTIALS'
  | 'EMAIL_NOT_VERIFIED'
  | 'ACCOUNT_SUSPENDED'
  | 'RATE_LIMITED'
  | 'CONFLICT'
  | 'VALIDATION_FAILED'
  | 'SERVER_ERROR'
  | 'NETWORK_TIMEOUT'
  | 'OFFLINE';

export interface ApiError {
  readonly code: AuthErrorCode;
  /** Detik sampai tombol boleh dicoba lagi (dikirim server pada RATE_LIMITED). */
  readonly retryAfter?: number;
  /** Dicetak di UI untuk keperluan support (agents.md §4). */
  readonly correlationId?: string;
}

export interface LoginPayload {
  readonly email: string;
  readonly password: string;
  readonly remember: boolean;
}

export interface RegisterPayload {
  readonly email: string;
  readonly password: string;
  readonly passwordConfirmation: string;
  readonly consent: boolean;
  /** Wajib untuk aksi kritis supaya double submit maksimal satu efek (agents.md §6). */
  readonly idempotencyKey: string;
}

export interface LoginResult {
  readonly role: 'peserta' | 'panitia' | 'super-admin';
}

export interface RegisterResult {
  /** Email yang diterima server (sudah dinormalisasi lowercase). */
  readonly email: string;
  /** Detik sampai tautan verifikasi boleh dikirim ulang. */
  readonly resendAfter: number;
}

/** Hasil pemanggilan API: sukses membawa data, gagal membawa kode error. */
export type ApiResult<T> = { readonly ok: true; readonly data: T } | { readonly ok: false; readonly error: ApiError };
