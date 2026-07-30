/**
 * Validasi client untuk UX saja — backend tetap authoritative (agents.md §1).
 * Tidak ada nilai di sini yang dipakai untuk mengklaim sukses.
 */

export interface SyaratPassword {
  readonly label: string;
  readonly ok: boolean;
}

export type LevelPassword = 'kosong' | 'lemah' | 'cukup' | 'kuat';

export interface KekuatanPassword {
  readonly level: LevelPassword;
  readonly label: string;
  /** Jumlah segmen meter yang terisi, dari 3. */
  readonly segmen: 0 | 1 | 2 | 3;
  readonly syarat: readonly SyaratPassword[];
}

const POLA_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function syaratPassword(password: string): readonly SyaratPassword[] {
  return [
    { label: 'Minimal 8 karakter', ok: password.length >= 8 },
    { label: 'Huruf besar dan kecil', ok: /[a-z]/.test(password) && /[A-Z]/.test(password) },
    { label: 'Sedikitnya satu angka', ok: /[0-9]/.test(password) },
    { label: 'Sedikitnya satu simbol', ok: /[^A-Za-z0-9]/.test(password) },
  ];
}

export function kekuatanPassword(password: string): KekuatanPassword {
  const syarat = syaratPassword(password);

  if (!password) {
    return { level: 'kosong', label: 'Belum diisi', segmen: 0, syarat };
  }

  const terpenuhi = syarat.filter((s) => s.ok).length;

  if (terpenuhi >= 4) return { level: 'kuat', label: 'Kuat', segmen: 3, syarat };
  if (terpenuhi === 3) return { level: 'cukup', label: 'Cukup', segmen: 2, syarat };
  return { level: 'lemah', label: 'Lemah', segmen: 1, syarat };
}

export function errorEmail(email: string): string | undefined {
  const nilai = email.trim();
  if (!nilai) return 'Email wajib diisi.';
  if (!POLA_EMAIL.test(nilai)) return 'Format email belum benar. Contoh: nama@gmail.com';
  return undefined;
}

export function errorPasswordMasuk(password: string): string | undefined {
  if (!password) return 'Password wajib diisi.';
  return undefined;
}

export function errorPasswordBaru(password: string): string | undefined {
  if (!password) return 'Password wajib diisi.';
  const syarat = syaratPassword(password);
  if (!syarat[0]?.ok) return 'Password minimal 8 karakter.';
  if (syarat.filter((s) => s.ok).length < 3) {
    return 'Tambahkan huruf besar, angka, atau simbol supaya password lebih kuat.';
  }
  return undefined;
}

export function errorKonfirmasi(password: string, konfirmasi: string): string | undefined {
  if (!konfirmasi) return 'Konfirmasi password wajib diisi.';
  if (konfirmasi !== password) return 'Konfirmasi belum sama dengan password.';
  return undefined;
}

/**
 * Menyamarkan email untuk ditampilkan di layar verifikasi. PII tidak pernah masuk
 * URL/log/analytics (agents.md §6) — di layar pun hanya versi tersamarkan.
 */
export function samarkanEmail(email: string): string {
  const nilai = email.trim().toLowerCase();
  const at = nilai.indexOf('@');
  if (at < 1) return nilai || 'email kamu';
  return `${nilai.slice(0, Math.min(2, at))}***${nilai.slice(at)}`;
}
