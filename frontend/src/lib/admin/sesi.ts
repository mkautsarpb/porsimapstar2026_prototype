import { cookies } from 'next/headers';
import { CAKUPAN_PANITIA } from '@/data/admin/lomba';
import { COOKIE_PROFIL_PANITIA, ISI_PROFIL, bacaProfilPanitia } from './profil-panitia';
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
 * GATING TETAP HARUS TERBUKTI HIDUP. Kalau setiap akun demo memegang seluruh
 * izin, AC #6 akan terlihat lulus karena semua orang melihat tab Sistem, bukan
 * karena gerbangnya benar-benar bekerja. Karena itu pembuktiannya dipindah ke
 * akun, bukan ke bawaan berkas ini:
 *
 *   - `panitia@porsimaptar.test` — `super-admin`, seluruh layar terbuka. Akun
 *     untuk menelusuri prototipe tanpa membentur penolakan.
 *   - `basket@porsimaptar.test`  — `verifier`, cakupan satu cabang. Di akun ini
 *     Pertandingan dan tab Sistem masih menolak, dan angka dashboard menyempit.
 *
 * `PERAN_BAWAAN` di bawah tetap peran terbatas: ia hanya dipakai saat nilai
 * `ADMIN_DEMO_PERAN` atau `ADMIN_DEMO_IZIN` tidak dikenal, dan jalur yang tidak
 * jelas harus menjawab "tidak boleh", bukan "boleh semua".
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
  /*
   * Profil datang dari akun yang masuk di `/masuk`, lewat cookie penanda demo.
   * `ADMIN_DEMO_PERAN` tetap menang atas peran profil supaya jalur pengembangan
   * di atas masih bisa dipakai tanpa harus login ulang.
   */
  const jar = await cookies();
  const profil = bacaProfilPanitia(jar.get(COOKIE_PROFIL_PANITIA)?.value);
  const isi = ISI_PROFIL[profil];

  const dariEnv = process.env.ADMIN_DEMO_PERAN?.trim();
  const peran = dariEnv ? peranDariEnv() : isi.peran;

  /*
   * Cakupan ikut profil, bukan disimpulkan dari peran. Izin dan cakupan adalah
   * dua sumbu terpisah: akun bisa boleh melakukan segalanya tapi tetap hanya
   * memegang sebagian cabang. Hanya jalur `ADMIN_DEMO_PERAN` yang menaikkan
   * cakupan ke seluruh event, karena di situ profilnya memang ditimpa.
   *
   * Seluruh event ditulis sebagai daftar lomba yang lengkap, bukan satu entri
   * bertuliskan "Seluruh lomba" — kalau begitu jumlahnya terbaca 1 dan semua
   * salinan yang menyebut "N lomba" ikut salah.
   */
  const penuhDariEnv = Boolean(dariEnv) && peran === 'super-admin';

  return {
    nama: isi.nama,
    inisial: isi.inisial,
    peran,
    izin: izinDariEnv(peran),
    cakupanLomba: penuhDariEnv ? SELURUH_LOMBA : isi.cakupanLomba,
    cakupanPenuh: penuhDariEnv ? true : isi.cakupanPenuh,
  };
}
