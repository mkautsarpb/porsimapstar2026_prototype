import type { AntreanNotifikasi, KartuKesehatan, LembarSheets } from '@/types/admin';

/**
 * Fixture modul Sinkronisasi & kesehatan sistem — desain "Batch E4" (E4.4).
 *
 * TODO(api-contract): diganti oleh
 *   GET  /api/v1/admin/integrations/sheets
 *   POST /api/v1/admin/integrations/sheets/sync   body { worksheets[] }  -> 202 { job_id }
 *   GET  /api/v1/admin/notifications/queue
 *   POST /api/v1/admin/notifications/retry        body { failure_ids[] }
 *   GET  /api/v1/admin/system-health              // hanya integration.manage
 *
 * Kalimat yang harus ada di layar, bukan hanya di kepala orang yang membangunnya:
 * **Google Sheets adalah salinan operasional, bukan sumber kebenaran.** Kalau
 * sinkronisasi gagal, pendaftaran, verifikasi, dan check-in tetap tersimpan utuh
 * di basis data dan tidak ada transaksi yang dibatalkan. Tanpa kalimat itu,
 * lencana galat merah di menu memicu kepanikan yang tidak perlu pada hari-H.
 */

export const RINGKAS_SHEETS = {
  suksesTerakhir: '09.38 WIB',
  suksesTerakhirRelatif: '5 menit lalu · 3 dari 4 lembar',
  keterlambatanMenit: 14,
  targetMenit: 5,
  pekerjaanBerjalan: 1,
  pekerjaanRef: 'SYN-8841 · 42% · mulai 09.42',
  intervalOtomatisMenit: 5,
} as const;

export const LEMBAR_SHEETS: readonly LembarSheets[] = [
  {
    id: 'lb-peserta',
    nama: 'Peserta',
    suksesTerakhir: '09.38 · 5 menit lalu',
    baris: '1.284',
    galat: null,
  },
  {
    id: 'lb-tim',
    nama: 'Tim',
    suksesTerakhir: '09.38 · 5 menit lalu',
    baris: '89',
    galat: null,
  },
  {
    id: 'lb-verifikasi',
    nama: 'Verifikasi',
    suksesTerakhir: '09.38 · 5 menit lalu',
    baris: '934',
    galat: null,
  },
  {
    id: 'lb-checkin',
    nama: 'Check-in',
    suksesTerakhir: '09.24 · 19 menit lalu',
    baris: '0 baris baru',
    galat: { kode: '429 · kuota API', teks: 'Kuota 300 permintaan/menit terlampaui' },
  },
];

export const GALAT_AKTIF = {
  ref: 'SYN-8839',
  lembar: 'Check-in',
  judul: 'Galat lembar Check-in',
  teks: 'HTTP 429 dari Google Sheets API pada 09.24.11 — kuota 300 permintaan/menit terlampaui. 214 baris check-in menunggu disalin dan akan terkirim pada percobaan berikutnya. Data check-in di aplikasi tetap lengkap.',
  barisMenunggu: 214,
} as const;

export const ANTREAN_NOTIFIKASI: readonly AntreanNotifikasi[] = [
  { kanal: 'Email', antre: 24, terkirim: 1208, sampai: 1190, gagal: 18 },
  { kanal: 'Dalam aplikasi', antre: 3, terkirim: 1402, sampai: 1402, gagal: 0 },
];

export const RINCIAN_EMAIL_GAGAL: readonly {
  readonly sebab: string;
  readonly jumlah: number;
  readonly layakDicoba: boolean;
}[] = [
  { sebab: 'Alamat tidak ditemukan', jumlah: 14, layakDicoba: false },
  { sebab: 'Kotak masuk penuh', jumlah: 3, layakDicoba: true },
  { sebab: 'Ditolak server penerima', jumlah: 1, layakDicoba: true },
];

export const KESEHATAN_SISTEM: readonly KartuKesehatan[] = [
  {
    id: 'api',
    nama: 'API',
    keadaan: 'normal',
    nilai: 'Sehat',
    rincian: 'p95 210 ms · galat 0,2%',
  },
  {
    id: 'db',
    nama: 'Basis data',
    keadaan: 'normal',
    nilai: 'Sehat',
    rincian: 'koneksi 42/100 · replikasi 0,4 s',
  },
  {
    id: 'redis',
    nama: 'Redis',
    keadaan: 'normal',
    nilai: 'Sehat',
    rincian: 'memori 38% · hit 97%',
  },
  {
    id: 'antrean',
    nama: 'Antrean',
    keadaan: 'perhatian',
    nilai: 'Terlambat',
    rincian: '14 menit · 27 pekerjaan menunggu',
  },
  {
    id: 'disk',
    nama: 'Disk',
    keadaan: 'normal',
    nilai: '62% terpakai',
    rincian: '148 GB dari 240 GB',
  },
  {
    id: 'cadangan',
    nama: 'Cadangan',
    keadaan: 'normal',
    nilai: '03.00 hari ini',
    rincian: 'berhasil · 6 jam 43 menit lalu',
  },
];
