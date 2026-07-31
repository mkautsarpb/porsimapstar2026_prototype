import type {
  BarisRiwayatEkspor,
  PekerjaanEkspor,
  RekapCabang,
  RekapInstitusi,
} from '@/types/admin';

/**
 * Fixture modul Laporan — desain "Batch E4" (E4.3).
 *
 * TODO(api-contract): diganti oleh
 *   POST /api/v1/admin/exports        body { report, filters, format: 'csv' }
 *        202 { job_id, reference_id }            // pekerjaan latar belakang
 *   GET  /api/v1/admin/exports/{id}   -> { state, progress, download_url?, expires_at }
 *   GET  /api/v1/admin/exports/history
 *
 * Tiga kalimat yang ditulis di antarmuka, bukan disimpan sebagai asumsi:
 *  1. **Tautan unduhan kedaluwarsa.** Masa berlakunya ditulis di sebelah tombol
 *     unduh, bukan setelah tautannya mati.
 *  2. **Ekspor adalah jejak audit.** Siapa mengekspor apa, kapan, dengan filter
 *     apa — tercatat permanen dan tidak bisa dihapus, termasuk yang gagal.
 *  3. **Masking mengikuti peran** dan tidak pernah dilonggarkan lewat dialog.
 *
 * Proteksi formula injection pada CSV (agents.md §6) dikerjakan server saat
 * menulis berkas; client tidak pernah menyusun CSV-nya sendiri.
 */

export const PEKERJAAN_EKSPOR: readonly PekerjaanEkspor[] = [
  {
    id: 'exp-9120',
    ref: 'EXP-9120',
    judul: 'Rekap peserta per cabang',
    keadaan: 'berjalan',
    persen: 62,
    barisDiproses: 718,
    totalBaris: 1158,
    jumlahKolom: 11,
    oleh: 'Wulan Kartika',
    mulai: '09.42',
    selesai: null,
    berlakuSampai: null,
    sisaMenit: null,
    ukuran: null,
    catatanMasking:
      'Masking mengikuti peranmu: NIK tidak disertakan dan ID peserta tetap termasking di dalam berkas.',
  },
  {
    id: 'exp-9118',
    ref: 'EXP-9118',
    judul: 'Rekap verifikasi dokumen',
    keadaan: 'siap',
    persen: 100,
    barisDiproses: 934,
    totalBaris: 934,
    jumlahKolom: 11,
    oleh: 'Wulan Kartika',
    mulai: '09.25',
    selesai: '09.31',
    berlakuSampai: '09.51 WIB',
    sisaMenit: 8,
    ukuran: '1,2 MB',
    catatanMasking:
      'Masking mengikuti peranmu: NIK tidak disertakan dan ID peserta termasking di dalam berkas.',
  },
  {
    id: 'exp-9004',
    ref: 'EXP-9004',
    judul: 'Rekap peserta per cabang',
    keadaan: 'gagal',
    persen: 38,
    barisDiproses: 420,
    totalBaris: 1102,
    jumlahKolom: 11,
    oleh: 'Wulan Kartika',
    mulai: '25 Sep, 08.40',
    selesai: '25 Sep, 08.41',
    berlakuSampai: null,
    sisaMenit: null,
    ukuran: null,
    catatanMasking:
      'Tidak ada berkas sebagian yang dibuat dan tidak ada tautan yang terbit — tidak ada data yang keluar dari sistem.',
  },
];

export const RIWAYAT_EKSPOR: readonly BarisRiwayatEkspor[] = [
  {
    id: 'rw-1',
    waktu: '28 Sep, 09.31',
    oleh: 'Wulan Kartika',
    laporan: 'Rekap verifikasi dokumen',
    filter: '21–28 Sep · 6 cabang',
    baris: 934,
    statusTautan: 'Aktif · sisa 8 menit',
    nada: 'ok',
  },
  {
    id: 'rw-2',
    waktu: '27 Sep, 17.02',
    oleh: 'Bayu Setiawan',
    laporan: 'Rekap peserta per institusi',
    filter: '21–27 Sep · seluruh cabang',
    baris: 1204,
    statusTautan: 'Kedaluwarsa 17.22',
    nada: 'netral',
  },
  {
    id: 'rw-3',
    waktu: '26 Sep, 11.14',
    oleh: 'Sari Wulandari',
    laporan: 'Rekap tim per cabang',
    filter: '21–26 Sep · Voli Putra, Voli Putri',
    baris: 48,
    statusTautan: 'Kedaluwarsa 11.34',
    nada: 'netral',
  },
  {
    id: 'rw-4',
    waktu: '25 Sep, 08.40',
    oleh: 'Wulan Kartika',
    laporan: 'Rekap peserta per cabang',
    filter: '21–25 Sep · 6 cabang',
    baris: 1102,
    statusTautan: 'Gagal · ref EXP-9004',
    nada: 'danger',
  },
];

export const TOTAL_CATATAN_EKSPOR = 37;

export const REKAP_CABANG: readonly RekapCabang[] = [
  { id: 'rc-basket', cabang: 'Basket Putra', jumlah: 312 },
  { id: 'rc-voli', cabang: 'Voli Putra', jumlah: 258 },
  { id: 'rc-futsal', cabang: 'Futsal Putra', jumlah: 228 },
  { id: 'rc-debat', cabang: 'Debat B. Indonesia', jumlah: 144 },
  { id: 'rc-esai', cabang: 'Esai Kebangsaan', jumlah: 120 },
  { id: 'rc-menembak', cabang: 'Menembak', jumlah: 96 },
];

export const REKAP_INSTITUSI: readonly RekapInstitusi[] = [
  { id: 'ri-poltekkes', institusi: 'Poltekkes Semarang', peserta: 284, tim: 22 },
  { id: 'ri-poltekpel', institusi: 'Poltekpel Semarang', peserta: 241, tim: 19 },
  { id: 'ri-akpol', institusi: 'AKPOL Semarang', peserta: 198, tim: 16 },
  { id: 'ri-sman3', institusi: 'SMAN 3 Semarang', peserta: 152, tim: 11 },
  { id: 'ri-lain', institusi: '14 institusi lain', peserta: 283, tim: 21 },
];

export const TOTAL_PENDAFTARAN = REKAP_CABANG.reduce((n, r) => n + r.jumlah, 0);
export const TOTAL_TIM = REKAP_INSTITUSI.reduce((n, r) => n + r.tim, 0);
export const JUMLAH_INSTITUSI = 18;

export const KOLOM_EKSPOR_LAPORAN: readonly string[] = [
  'cabang',
  'nama',
  'id_peserta_termasking',
  'kategori_peserta',
  'institusi',
  'tim',
  'peran_tim',
  'status_pendaftaran',
  'status_dokumen',
  'tanggal_daftar',
  'terakhir_diperbarui',
];

export const MASA_BERLAKU_TAUTAN_MENIT = 20;
