import type { ApiError, AuthErrorCode } from '@/types/api/auth';

/**
 * Satu-satunya tempat pemetaan kode error autentikasi → teks aman untuk pengguna
 * (agents.md §4: "error mapping terpusat di satu modul, bukan tersebar di komponen").
 *
 * Aturan yang dijaga di sini:
 * - Login gagal TIDAK menyebutkan apakah email atau password yang salah (enumerasi akun).
 * - Registrasi dengan email yang sudah terpakai TIDAK dikonfirmasi keberadaannya;
 *   instruksinya dikirim ke email tersebut, UI hanya bilang "tidak dapat dilanjutkan".
 * - Tidak ada teks mentah dari server yang dirender.
 */

export type PesanNada = 'danger' | 'warn' | 'info';

export interface PesanError {
  readonly judul: string;
  readonly detail: string;
  readonly nada: PesanNada;
  /** Label aksi lanjutan, kalau error ini punya jalan keluar yang jelas. */
  readonly aksi?: string;
}

const PESAN: Record<AuthErrorCode, PesanError> = {
  INVALID_CREDENTIALS: {
    judul: 'Email atau password salah',
    detail:
      'Periksa kembali email dan password kamu. Kami tidak menyebutkan mana yang keliru untuk melindungi akun.',
    nada: 'danger',
  },
  EMAIL_NOT_VERIFIED: {
    judul: 'Email belum diverifikasi',
    detail:
      'Akun kamu ada, tapi emailnya belum dikonfirmasi. Buka tautan verifikasi yang kami kirim, atau minta kirim ulang.',
    nada: 'info',
    aksi: 'Kirim ulang tautan verifikasi',
  },
  ACCOUNT_SUSPENDED: {
    judul: 'Akun sedang ditangguhkan',
    detail:
      'Akun ini belum bisa dipakai masuk. Hubungi panitia agar dibantu memeriksa statusnya.',
    nada: 'danger',
  },
  RATE_LIMITED: {
    judul: 'Terlalu banyak percobaan',
    detail: 'Untuk keamanan, percobaan masuk dikunci sebentar. Tombol aktif kembali otomatis.',
    nada: 'warn',
  },
  CONFLICT: {
    judul: 'Pendaftaran tidak dapat dilanjutkan',
    detail:
      'Kalau alamat ini sudah pernah dipakai, kami mengirim instruksi ke email tersebut. Coba masuk atau pakai fitur lupa password.',
    nada: 'danger',
  },
  VALIDATION_FAILED: {
    judul: 'Data belum diterima server',
    detail: 'Server menolak isian ini. Periksa kembali email dan password kamu, lalu coba lagi.',
    nada: 'danger',
  },
  SERVER_ERROR: {
    judul: 'Ada gangguan di sisi kami',
    detail: 'Bukan kesalahan kamu. Coba lagi sebentar. Kalau tetap gagal, hubungi panitia.',
    nada: 'danger',
  },
  NETWORK_TIMEOUT: {
    judul: 'Permintaan kelamaan',
    detail:
      'Kami belum tahu apakah permintaan tadi tersimpan. Muat ulang halaman dan cek status terbaru sebelum mencoba lagi.',
    nada: 'warn',
  },
  OFFLINE: {
    judul: 'Tidak ada koneksi',
    detail: 'Permintaan belum terkirim. Sambungkan kembali internet kamu lalu coba lagi.',
    nada: 'warn',
  },
};

export function pesanError(error: ApiError): PesanError {
  return PESAN[error.code];
}
