import { CAKUPAN_PANITIA } from '@/data/admin/lomba';
import {
  IZIN_PER_PERAN,
  PERAN,
  saringIzin,
  type Izin,
  type PeranPanitia,
  type SesiPanitia,
} from './izin';

/**
 * Sesi Panel Panitia — hanya dipanggil dari Server Component / Route Handler.
 * Jangan diimpor dari komponen `'use client'`: isinya ikut terkirim ke browser.
 *
 * TODO: sesi asli menunggu kontrak auth backend. Yang dibutuhkan nanti:
 *   GET /api/v1/admin/me -> { nama, peran, permissions[], scope_competitions[] }
 * dibaca dengan cookie HttpOnly + Secure + SameSite (agents.md §6). Yang perlu
 * diganti hanya isi `bacaSesiPanitia()`; pemanggilnya tidak berubah.
 *
 * MOCK INI SENGAJA GAGAL TERTUTUP. Bawaannya tetap peran yang izinnya terbatas,
 * bukan `super-admin`. Kalau mock memberi seluruh izin, AC #6 akan terlihat
 * lulus karena semua orang melihat tab Sistem, bukan karena gatingnya
 * benar-benar bekerja.
 *
 * Bawaannya `verifier`, bukan `panitia-umum`: modul Verifikasi adalah bagian
 * utama prototipe ini dan tidak bisa ditinjau kalau layarnya selalu menolak.
 * `match.edit`, `user.manage`, dan `integration.manage` tetap TIDAK diberikan,
 * jadi Pertandingan dan tab Sistem masih membuktikan gatingnya hidup. Pakai
 * `ADMIN_DEMO_PERAN` di bawah untuk mencoba peran lain.
 */

const PERAN_BAWAAN: PeranPanitia = 'verifier';

const SELURUH_LOMBA: readonly string[] = CAKUPAN_PANITIA;

function peranDikenal(nilai: string): nilai is PeranPanitia {
  return (PERAN as readonly string[]).includes(nilai);
}

/**
 * Cara mengganti kewenangan saat pengembangan — variabel lingkungan server,
 * bukan query URL, supaya tidak bisa dinaikkan sendiri dari browser:
 *
 *   ADMIN_DEMO_PERAN=super-admin              # seluruh kombinasi di SRS §14.2
 *   ADMIN_DEMO_IZIN=dashboard.view,match.edit # daftar eksplisit, menang atas peran
 *
 * Nilai yang tidak dikenal diabaikan, lalu jatuh ke bawaan paling minim.
 */
function peranDariEnv(): PeranPanitia {
  const mentah = process.env.ADMIN_DEMO_PERAN?.trim();
  if (!mentah || !peranDikenal(mentah)) return PERAN_BAWAAN;
  return mentah;
}

function izinDariEnv(peran: PeranPanitia): readonly Izin[] {
  const mentah = process.env.ADMIN_DEMO_IZIN?.trim();
  if (!mentah) return IZIN_PER_PERAN[peran];

  const disaring = saringIzin(mentah.split(','));
  // Daftar yang seluruhnya tidak dikenal tidak boleh berarti "semua izin".
  if (disaring.length === 0) return IZIN_PER_PERAN[PERAN_BAWAAN];
  return disaring;
}

export async function bacaSesiPanitia(): Promise<SesiPanitia> {
  const peran = peranDariEnv();

  return {
    nama: 'Rakha Adiwangsa',
    inisial: 'RA',
    peran,
    izin: izinDariEnv(peran),
    /*
     * Super Admin memegang seluruh event, jadi cakupannya daftar lomba yang
     * lengkap — bukan satu entri bertuliskan "Seluruh lomba". Kalau ditulis
     * begitu, jumlah cakupannya terbaca 1 dan seluruh salinan yang menyebut
     * "N lomba" ikut salah.
     */
    cakupanLomba: SELURUH_LOMBA,
    cakupanPenuh: peran === 'super-admin',
  };
}
