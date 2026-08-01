import { CAKUPAN_PANITIA, namaLomba } from '@/data/admin/lomba';
import type { PeranPanitia } from './izin';

/**
 * Profil panitia demo — penghubung antara akun yang masuk di `/masuk` dan sesi
 * yang dibaca Server Component Panel Panitia.
 *
 * Kenapa lewat cookie: `bacaSesiPanitia()` berjalan di server, sedangkan mock
 * autentikasi hidup di memori browser. Tanpa penanda yang ikut terkirim di tiap
 * permintaan, server tidak punya cara tahu akun mana yang barusan masuk, dan
 * dashboard akan menampilkan cakupan yang sama untuk semua orang.
 *
 * PRIVASI (FE-PRIV-001): isinya hanya slug profil — bukan email, nama, atau
 * token. Cookie ini penanda demo, BUKAN kredensial; tidak ada keputusan
 * keamanan yang boleh bergantung padanya.
 *
 * TODO(api-contract): hapus begitu `GET /api/v1/admin/me` tersedia. Sesi asli
 * datang dari cookie HttpOnly + Secure + SameSite yang di-set server, dan peran
 * beserta cakupannya dibaca dari sana, bukan dari nilai yang bisa disetel
 * browser.
 */

export const COOKIE_PROFIL_PANITIA = 'porsi_demo_panitia';

export const PROFIL_PANITIA = ['umum', 'basket'] as const;

export type ProfilPanitia = (typeof PROFIL_PANITIA)[number];

export interface IsiProfilPanitia {
  readonly nama: string;
  readonly inisial: string;
  readonly peran: PeranPanitia;
  readonly cakupanLomba: readonly string[];
  /** True bila akun memegang seluruh event, bukan sebagian cabang. */
  readonly cakupanPenuh: boolean;
}

export const ISI_PROFIL: Readonly<Record<ProfilPanitia, IsiProfilPanitia>> = {
  /*
   * Akun serba bisa untuk menelusuri prototipe: `super-admin` memegang seluruh
   * izin, jadi tidak ada layar yang menolak dan tab Sistem ikut tampil.
   *
   * Cakupannya sengaja tetap enam cabang, bukan seluruh event. Izin dan cakupan
   * dua hal berbeda, dan angka dashboard memang disusun untuk enam cabang itu —
   * menaikkannya ke seluruh event membuat sidebar mengaku memegang semuanya
   * sementara widgetnya masih menghitung enam. Gating tetap terbukti hidup
   * lewat akun Basket yang cakupannya satu cabang.
   */
  umum: {
    nama: 'Rakha Adiwangsa',
    inisial: 'RA',
    peran: 'super-admin',
    cakupanLomba: CAKUPAN_PANITIA,
    cakupanPenuh: false,
  },
  /** Panitia satu cabang: seluruh angka dashboard menyempit ke Basket. */
  basket: {
    nama: 'Wulan Kartika',
    inisial: 'WK',
    peran: 'verifier',
    cakupanLomba: [namaLomba('BKT-04')],
    cakupanPenuh: false,
  },
};

/** Nilai tak dikenal jatuh ke profil paling umum, bukan ke cakupan kosong. */
export function bacaProfilPanitia(nilai: string | undefined | null): ProfilPanitia {
  const cocok = PROFIL_PANITIA.find((p) => p === nilai);
  return cocok ?? 'umum';
}
