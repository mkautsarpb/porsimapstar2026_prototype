import type { BentrokJadwal, SesiJadwal, VersiJadwal } from '@/types/admin';

/**
 * Fixture modul Jadwal — desain "Batch E2 · Lomba dan Jadwal" (E2.2).
 *
 * TODO(api-contract): diganti oleh
 *   GET  /api/v1/admin/schedule?date=&venues[]=
 *   POST /api/v1/admin/schedule/sessions/{id}/move  body { start, venue, version }
 *   GET  /api/v1/admin/schedule/conflicts?date=
 *   POST /api/v1/admin/schedule/publish
 *        body { version_note, confirm: true }
 *        200  { reference_id, version, notified_count }
 *
 * **Deteksi bentrok adalah wewenang server.** Yang di berkas ini hanya hasilnya,
 * bukan aturannya. Menghitung ulang bentrok di client akan menghasilkan jawaban
 * berbeda dari server pada kasus batas (sesi yang bersinggungan tepat di menit
 * yang sama, peserta yang terdaftar di dua tim), dan panitia akan mempercayai
 * yang salah — layar ini yang mereka lihat (agents.md §0 prinsip 1).
 */

export const TANGGAL_PAPAN = '2026-10-27T00:00:00+07:00';
export const VENUE_PAPAN: readonly string[] = [
  'GOR AKPOL — Lap 1',
  'GOR AKPOL — Lap 2',
  'Lapangan Voli',
  'Aula Utama',
];

/** Rentang papan waktu. Sesi di luar rentang ini hanya terlihat di tampilan daftar. */
export const JAM_PAPAN = { mulai: 8, selesai: 15 } as const;

export const SESI_JADWAL: readonly SesiJadwal[] = [
  {
    id: 'ses-1',
    mulai: '08.00',
    selesai: '09.00',
    cabang: 'Basket Putri',
    babak: 'Penyisihan A',
    venue: 'GOR AKPOL — Lap 2',
    ofisial: 'Nanda Pratama',
    jumlahBentrok: 0,
  },
  {
    id: 'ses-2',
    mulai: '09.00',
    selesai: '10.30',
    cabang: 'Basket Putra',
    babak: 'Penyisihan A',
    venue: 'GOR AKPOL — Lap 1',
    ofisial: 'Yudha Santoso',
    jumlahBentrok: 0,
  },
  {
    id: 'ses-3',
    mulai: '10.00',
    selesai: '11.00',
    cabang: 'Voli Putri',
    babak: 'Penyisihan A',
    venue: 'Lapangan Voli',
    ofisial: 'Sari Wulandari',
    jumlahBentrok: 0,
  },
  {
    id: 'ses-4',
    mulai: '11.00',
    selesai: '12.30',
    cabang: 'Basket Putri',
    babak: 'Penyisihan B',
    venue: 'GOR AKPOL — Lap 2',
    ofisial: 'Nanda Pratama',
    jumlahBentrok: 0,
  },
  {
    id: 'ses-5',
    mulai: '13.00',
    selesai: '14.30',
    cabang: 'Basket Putra',
    babak: 'Penyisihan C',
    venue: 'GOR AKPOL — Lap 1',
    ofisial: 'Yudha Santoso',
    jumlahBentrok: 2,
  },
  {
    id: 'ses-6',
    mulai: '13.00',
    selesai: '15.00',
    cabang: 'Debat Bahasa Indonesia',
    babak: 'Semifinal',
    venue: 'Aula Utama',
    ofisial: 'Rizal Hakim',
    jumlahBentrok: 1,
  },
  {
    id: 'ses-7',
    mulai: '14.00',
    selesai: '15.00',
    cabang: 'Basket Putra',
    babak: 'Penyisihan D',
    venue: 'GOR AKPOL — Lap 1',
    ofisial: null,
    jumlahBentrok: 1,
  },
  {
    id: 'ses-8',
    mulai: '14.00',
    selesai: '15.30',
    cabang: 'Voli Putra',
    babak: 'Penyisihan A',
    venue: 'Lapangan Voli',
    ofisial: 'Rizal Hakim',
    jumlahBentrok: 2,
  },
  {
    id: 'ses-9',
    mulai: '15.30',
    selesai: '16.30',
    cabang: 'Voli Putri',
    babak: 'Penyisihan B',
    venue: 'Lapangan Voli',
    ofisial: 'Sari Wulandari',
    jumlahBentrok: 0,
  },
];

export const BENTROK_JADWAL: readonly BentrokJadwal[] = [
  {
    id: 'btk-venue',
    jenis: 'venue',
    judul: 'Venue dipakai bersamaan',
    subjek: 'GOR AKPOL — Lapangan 1',
    rincian:
      'Basket Putra Penyisihan C (13.00–14.30) dan Penyisihan D (14.00–15.00) memakai lapangan yang sama pada 27 Okt 2026.',
    tumpangTindih: '30 menit · 14.00–14.30',
    saran: ['Geser Penyisihan D ke 14.30', 'Pindah lapangan'],
  },
  {
    id: 'btk-peserta',
    jenis: 'peserta',
    judul: 'Peserta terjadwal di dua tempat',
    subjek: 'Rafi Ardiansyah · PSM-2026-••••-4471',
    rincian:
      'Terdaftar di Garuda Biru (Basket Putra, 13.00–14.30, Lap 1) dan Elang Timur (Voli Putra, 14.00–15.30, Lapangan Voli) pada 27 Okt 2026. Satu orang, dua venue.',
    tumpangTindih: '30 menit · 14.00–14.30',
    saran: ['Geser sesi Voli', 'Lihat 2 sesi terkait'],
  },
  {
    id: 'btk-ofisial',
    jenis: 'ofisial',
    judul: 'Wasit / juri bertugas ganda',
    subjek: 'Bripka Rizal Hakim',
    rincian:
      'Juri Debat Bahasa Indonesia Semifinal (13.00–15.00, Aula Utama) sekaligus wasit Voli Putra Penyisihan A (14.00–15.30, Lapangan Voli) pada 27 Okt 2026.',
    tumpangTindih: '1 jam · 14.00–15.00',
    saran: ['Ganti wasit Voli', 'Geser sesi Debat'],
  },
];

export const VERSI_JADWAL: readonly VersiJadwal[] = [
  {
    id: 'v5',
    label: 'v5 · draf',
    diterbitkan: 'Belum diterbitkan',
    perubahan: '5 waktu, 2 venue, 2 sesi baru',
    notifikasi: '143 menunggu',
    draf: true,
  },
  {
    id: 'v4',
    label: 'v4',
    diterbitkan: '25 Sep 2026, 14.10 · Wulan Kartika',
    perubahan: '3 sesi digeser, 1 venue diganti',
    notifikasi: '86 terkirim',
    draf: false,
  },
  {
    id: 'v3',
    label: 'v3',
    diterbitkan: '23 Sep 2026, 10.35 · Wulan Kartika',
    perubahan: 'Penugasan wasit 8 sesi',
    notifikasi: '54 terkirim',
    draf: false,
  },
  {
    id: 'v2',
    label: 'v2',
    diterbitkan: '22 Sep 2026, 16.50 · Aiptu Dedi Kurniawan',
    perubahan: 'Koreksi 2 jam mulai',
    notifikasi: '12 terkirim',
    draf: false,
  },
  {
    id: 'v1',
    label: 'v1',
    diterbitkan: '21 Sep 2026, 09.00 · Wulan Kartika',
    perubahan: 'Jadwal awal 34 sesi',
    notifikasi: '210 terkirim',
    draf: false,
  },
];

/** Ringkasan draf v5 dibanding v4 — dasar dialog publikasi. */
export const RINGKAS_PUBLIKASI = {
  versiBaru: 5,
  versiLama: 4,
  terbitLama: '25 Sep 2026, 14.10',
  sesiSebelum: 34,
  sesiSesudah: 36,
  waktuBerubah: 5,
  venueBerubah: 2,
  sesiBaru: 2,
  penerima: { peserta: 128, ofisial: 12, pic: 3 },
  drafSejak: '28 Sep 2026, 09.20',
} as const;

export const TOTAL_PENERIMA =
  RINGKAS_PUBLIKASI.penerima.peserta +
  RINGKAS_PUBLIKASI.penerima.ofisial +
  RINGKAS_PUBLIKASI.penerima.pic;
