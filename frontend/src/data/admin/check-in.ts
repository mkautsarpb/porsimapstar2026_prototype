import type { BarisPindai, KodeAlasanPindai, LajuPindai } from '@/types/admin';

/**
 * Fixture modul Check-in — desain "Batch E3 · Pertandingan dan Check-in" (E3.2).
 *
 * TODO(api-contract): diganti oleh
 *   POST /api/v1/admin/checkins/scan    body { qr_payload, competition_id, device_id }
 *        200 { result: 'success'|'duplicate'|'rejected', reason_code?, first_checkin_at?, ... }
 *   POST /api/v1/admin/checkins/manual  body { participant_code, reason, confirm }
 *   GET  /api/v1/admin/checkins/monitor?venue=&officer=   // selalu hari berjalan
 *
 * Aturan privasi yang mengikat seluruh modul ini: **keadaan ditolak tidak pernah
 * menampilkan nama, ID, atau data pribadi apa pun** — hanya kode alasan. Petugas
 * check-in berdiri di antrean terbuka dengan layar yang terlihat orang lain,
 * jadi menampilkan "ditolak: pendaftaran Rafi Ardiansyah belum terverifikasi"
 * mengumumkan urusan seseorang ke antrean (agents.md §6).
 */

export const WAKTU_HARI_H_ISO = '2026-10-27T13:42:00+07:00';

export const KODE_ALASAN: readonly KodeAlasanPindai[] = [
  { kode: 'CHK-01', arti: 'Kartu tidak dikenal' },
  { kode: 'CHK-02', arti: 'Pendaftaran belum terverifikasi' },
  { kode: 'CHK-03', arti: 'Di luar jam check-in' },
  { kode: 'CHK-04', arti: 'Bukan cabang ini' },
  { kode: 'CHK-05', arti: 'Peserta dibatalkan' },
];

export const ALASAN_MANUAL: readonly string[] = [
  'QR rusak atau tidak terbaca',
  'Peserta tidak membawa kartu',
  'Kamera perangkat bermasalah',
];

export const RINGKAS_HARI_INI = {
  berhasil: 412,
  duplikat: 18,
  ditolak: 9,
  manual: 7,
  lajuLimaMenit: 24,
  antreanDiMeja: 12,
  antreanTerpanjang: 'GOR AKPOL meja 1 · 7 orang · tunggu ±4 menit',
  perangkatDaring: 5,
  perangkatTotal: 5,
  petugasManualTerbanyak: 'Rina Marlina · 4 kali · alasan QR rusak',
} as const;

export const TOTAL_PINDAI =
  RINGKAS_HARI_INI.berhasil + RINGKAS_HARI_INI.duplikat + RINGKAS_HARI_INI.ditolak;

export const LAJU_VENUE: readonly LajuPindai[] = [
  { id: 'gor', nama: 'GOR AKPOL', jumlah: 14 },
  { id: 'voli', nama: 'Lapangan Voli', jumlah: 7 },
  { id: 'aula', nama: 'Aula Utama', jumlah: 3 },
];

export const LAJU_PETUGAS: readonly LajuPindai[] = [
  { id: 'rina', nama: 'Rina Marlina', jumlah: 9 },
  { id: 'agus', nama: 'Agus Prasetyo', jumlah: 7 },
  { id: 'dewi', nama: 'Dewi Anggraeni', jumlah: 5 },
  { id: 'lain', nama: '2 petugas lain', jumlah: 3 },
];

export const PINDAI_TERAKHIR: readonly BarisPindai[] = [
  {
    id: 'pd-1',
    waktu: '13.42.08',
    venue: 'GOR AKPOL',
    petugas: 'Rina Marlina',
    cabang: 'Basket Putra',
    hasil: 'berhasil',
    kode: null,
  },
  {
    id: 'pd-2',
    waktu: '13.41.30',
    venue: 'GOR AKPOL',
    petugas: 'Rina Marlina',
    cabang: 'Basket Putra',
    hasil: 'duplikat',
    kode: 'CHK-10 · pertama 11.18',
  },
  {
    id: 'pd-3',
    waktu: '13.40.55',
    venue: 'Lapangan Voli',
    petugas: 'Agus Prasetyo',
    cabang: 'Voli Putra',
    hasil: 'berhasil',
    kode: null,
  },
  {
    id: 'pd-4',
    waktu: '13.39.12',
    venue: 'GOR AKPOL',
    petugas: 'Dewi Anggraeni',
    cabang: 'Basket Putra',
    hasil: 'ditolak',
    kode: 'CHK-04 · bukan cabang ini',
  },
  {
    id: 'pd-5',
    waktu: '13.38.41',
    venue: 'Aula Utama',
    petugas: 'Bagas Nur',
    cabang: 'Debat Bahasa Indonesia',
    hasil: 'manual',
    kode: 'MAN-01 · QR rusak',
  },
  {
    id: 'pd-6',
    waktu: '13.37.58',
    venue: 'Lapangan Voli',
    petugas: 'Agus Prasetyo',
    cabang: 'Voli Putra',
    hasil: 'ditolak',
    kode: 'CHK-02 · belum terverifikasi',
  },
  {
    id: 'pd-7',
    waktu: '13.36.20',
    venue: 'GOR AKPOL',
    petugas: 'Rina Marlina',
    cabang: 'Basket Putra',
    hasil: 'berhasil',
    kode: null,
  },
  {
    id: 'pd-8',
    waktu: '13.35.02',
    venue: 'GOR AKPOL',
    petugas: 'Dewi Anggraeni',
    cabang: 'Basket Putra',
    hasil: 'berhasil',
    kode: null,
  },
];
