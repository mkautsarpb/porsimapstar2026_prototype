import { DAFTAR_LOMBA } from '@/data/lomba';
import type { BarisCabang, DetailCabang } from '@/types/admin';

/**
 * Fixture modul Lomba — desain "Batch E2 · Lomba dan Jadwal" (E2.1).
 *
 * TODO(api-contract): diganti oleh
 *   GET  /api/v1/admin/competitions
 *   GET  /api/v1/admin/competitions/{id}
 *   POST /api/v1/admin/competitions/{id}/quota
 *        body { capacity, waitlist_policy, reason, version }
 *        200  { reference_id, affected_registrations[], auto_closed }
 *
 * Aturan yang diulang di setiap layar modul ini, bukan sekali di dokumentasi:
 * **kuota cabang tim menghitung TIM, kuota cabang individu menghitung ORANG.**
 * Salah paham paling sering terjadi di sini — kapasitas 16 pada cabang tim
 * berarti 16 tim, bukan 16 orang. Karena itu `satuan` ikut di setiap objek kuota
 * dan selalu dicetak bersama angkanya, tidak pernah disimpulkan dari tipe cabang
 * di komponen.
 */

export const TENGGAT_PENDAFTARAN_ISO = '2026-10-05T23:59:00+07:00';

/**
 * Cakupan panitia contoh yang dipakai seluruh mock Panel Panitia: enam cabang
 * olahraga. Kodenya ditulis di sini, tapi namanya selalu diambil dari
 * `DAFTAR_LOMBA` — satu-satunya daftar lomba yang benar. Dulu panel memakai
 * nama karangan sendiri ("Catur", "Tenis Meja") yang tidak ada di daftar itu.
 */
export const KODE_CAKUPAN_PANITIA: readonly string[] = [
  'VOL-01',
  'SPK-02',
  'BDM-03',
  'BKT-04',
  'ATL-06',
  'ESP-07',
];

export const CAKUPAN_PANITIA: readonly string[] = DAFTAR_LOMBA.filter((l) =>
  KODE_CAKUPAN_PANITIA.includes(l.kode),
).map((l) => l.nama);

/** Nama resmi satu cabang menurut kodenya. Melempar bila kodenya tidak ada. */
export function namaLomba(kode: string): string {
  const lomba = DAFTAR_LOMBA.find((l) => l.kode === kode);
  if (!lomba) throw new Error(`Kode lomba tidak dikenal: ${kode}`);
  return lomba.nama;
}

/** Slug filter URL diturunkan dari namanya, bukan ditulis ulang. */
export function slugLomba(nama: string): string {
  return nama.toLowerCase().replace(/\s+/g, '-');
}

export const DAFTAR_CABANG: readonly BarisCabang[] = [
  {
    id: 'basket-putra',
    nama: 'Basket Putra',
    kategori: 'Olahraga',
    tipe: 'Tim',
    kuota: { terisi: 12, kapasitas: 16, satuan: 'tim', daftarTunggu: 0 },
    status: 'buka',
    tenggatIso: TENGGAT_PENDAFTARAN_ISO,
    pic: 'Kompol Andi Prasetya',
  },
  {
    id: 'basket-putri',
    nama: 'Basket Putri',
    kategori: 'Olahraga',
    tipe: 'Tim',
    kuota: { terisi: 16, kapasitas: 16, satuan: 'tim', daftarTunggu: 0 },
    status: 'penuh',
    tenggatIso: TENGGAT_PENDAFTARAN_ISO,
    pic: 'Kompol Andi Prasetya',
  },
  {
    id: 'voli-putra',
    nama: 'Voli Putra',
    kategori: 'Olahraga',
    tipe: 'Tim',
    kuota: { terisi: 14, kapasitas: 16, satuan: 'tim', daftarTunggu: 0 },
    status: 'buka',
    tenggatIso: TENGGAT_PENDAFTARAN_ISO,
    pic: 'Ipda Sari Wulandari',
  },
  {
    id: 'voli-putri',
    nama: 'Voli Putri',
    kategori: 'Olahraga',
    tipe: 'Tim',
    kuota: { terisi: 9, kapasitas: 16, satuan: 'tim', daftarTunggu: 0 },
    status: 'buka',
    tenggatIso: TENGGAT_PENDAFTARAN_ISO,
    pic: 'Ipda Sari Wulandari',
  },
  {
    id: 'futsal-putra',
    nama: 'Futsal Putra',
    kategori: 'Olahraga',
    tipe: 'Tim',
    kuota: { terisi: 20, kapasitas: 20, satuan: 'tim', daftarTunggu: 3 },
    status: 'daftar-tunggu',
    tenggatIso: TENGGAT_PENDAFTARAN_ISO,
    pic: 'Aiptu Dedi Kurniawan',
  },
  {
    id: 'debat-indonesia',
    nama: 'Debat Bahasa Indonesia',
    kategori: 'Non-olahraga',
    tipe: 'Tim',
    kuota: { terisi: 18, kapasitas: 24, satuan: 'tim', daftarTunggu: 0 },
    status: 'buka',
    tenggatIso: TENGGAT_PENDAFTARAN_ISO,
    pic: 'Bripka Rizal Hakim',
  },
  {
    id: 'menembak',
    nama: 'Lomba Menembak',
    kategori: 'Olahraga',
    tipe: 'Individu',
    kuota: { terisi: 96, kapasitas: 120, satuan: 'peserta', daftarTunggu: 0 },
    status: 'buka',
    tenggatIso: TENGGAT_PENDAFTARAN_ISO,
    pic: 'Kompol Andi Prasetya',
  },
  {
    id: 'esai-kebangsaan',
    nama: 'Esai Kebangsaan',
    kategori: 'Non-olahraga',
    tipe: 'Individu',
    kuota: { terisi: 120, kapasitas: 120, satuan: 'peserta', daftarTunggu: 5 },
    status: 'daftar-tunggu',
    tenggatIso: TENGGAT_PENDAFTARAN_ISO,
    pic: 'Bripka Rizal Hakim',
  },
];

const RIWAYAT_FUTSAL = [
  {
    id: 'kuo-2291',
    waktuIso: '2026-09-27T09:10:00+07:00',
    oleh: 'Wulan Kartika',
    perubahan: '18 → 20 tim',
    alasan: 'Tambahan slot dari lapangan cadangan',
    ref: 'KUO-2291',
  },
  {
    id: 'kuo-2140',
    waktuIso: '2026-09-24T15:40:00+07:00',
    oleh: 'Aiptu Dedi Kurniawan',
    perubahan: '16 → 18 tim',
    alasan: 'Minat lebih tinggi dari perkiraan',
    ref: 'KUO-2140',
  },
  {
    id: 'kuo-2098',
    waktuIso: '2026-09-22T11:05:00+07:00',
    oleh: 'Aiptu Dedi Kurniawan',
    perubahan: 'Daftar tunggu: nonaktif → aktif',
    alasan: 'Agar pendaftar tetap tercatat saat penuh',
    ref: 'KUO-2098',
  },
  {
    id: 'kuo-2001',
    waktuIso: '2026-09-21T08:00:00+07:00',
    oleh: 'Wulan Kartika',
    perubahan: 'Kapasitas awal: 16 tim',
    alasan: 'Pembukaan pendaftaran',
    ref: 'KUO-2001',
  },
];

export const DETAIL_CABANG: Readonly<Record<string, DetailCabang>> = {
  'basket-putra': {
    ...DAFTAR_CABANG[0]!,
    roster: { minimum: 8, maksimum: 12 },
    ketentuan:
      'Sistem gugur setelah penyisihan grup. Setiap tim wajib membawa dua set jersey berbeda warna. Pemain hanya boleh terdaftar di satu tim.',
    juknis: {
      nama: 'juknis-basket-putra-v3.pdf',
      versi: 3,
      tanggalIso: '2026-09-24T00:00:00+07:00',
      ukuran: '1,4 MB',
      dilihat: 212,
    },
    picEmail: 'basket@porsimaptar.id',
    venue: ['GOR AKPOL — Lapangan 1', 'GOR AKPOL — Lapangan 2'],
    ofisial: [
      { id: 'of-yudha', nama: 'Bripka Yudha Santoso', peran: 'Wasit utama', jumlahSesi: 4 },
      { id: 'of-nanda', nama: 'Brigadir Nanda Pratama', peran: 'Wasit kedua', jumlahSesi: 3 },
    ],
    kebijakanDaftarTunggu: 'Nonaktif · pendaftaran ditolak saat penuh',
    keadaanSekarang:
      '12 dari 16 tim terisi. Pendaftaran masih terbuka sampai tenggat, dan cabang akan tertutup otomatis begitu kapasitas penuh.',
    riwayatKuota: [
      {
        id: 'kuo-basket-1',
        waktuIso: '2026-09-21T08:00:00+07:00',
        oleh: 'Wulan Kartika',
        perubahan: 'Kapasitas awal: 16 tim',
        alasan: 'Pembukaan pendaftaran',
        ref: 'KUO-2002',
      },
    ],
    daftarTunggu: [],
  },
  'futsal-putra': {
    ...DAFTAR_CABANG[4]!,
    roster: { minimum: 10, maksimum: 14 },
    ketentuan:
      'Penyisihan grup dilanjutkan sistem gugur. Setiap tim wajib membawa dua set jersey dan satu penjaga gawang cadangan.',
    juknis: {
      nama: 'juknis-futsal-putra-v2.pdf',
      versi: 2,
      tanggalIso: '2026-09-22T00:00:00+07:00',
      ukuran: '1,1 MB',
      dilihat: 168,
    },
    picEmail: 'futsal@porsimaptar.id',
    venue: ['Lapangan Futsal AKPOL'],
    ofisial: [
      { id: 'of-dedi', nama: 'Aiptu Dedi Kurniawan', peran: 'Wasit utama', jumlahSesi: 6 },
    ],
    kebijakanDaftarTunggu: 'Aktif · urut waktu pendaftaran',
    keadaanSekarang:
      '20 dari 20 tim terisi, 3 tim menunggu di daftar tunggu. Pendaftaran baru langsung masuk daftar tunggu, dan tim di daftar tunggu naik otomatis bila ada tim yang mundur sebelum tenggat.',
    riwayatKuota: RIWAYAT_FUTSAL,
    daftarTunggu: [
      { posisi: 1, tim: 'Bahari FC', daftarIso: '2026-09-27T20:02:00+07:00', jumlahPeserta: 11 },
      { posisi: 2, tim: 'Samudra Muda', daftarIso: '2026-09-28T07:15:00+07:00', jumlahPeserta: 12 },
      { posisi: 3, tim: 'Elang Futsal', daftarIso: '2026-09-28T08:40:00+07:00', jumlahPeserta: 10 },
    ],
  },
};

/**
 * Dampak perubahan kapasitas 20 → 18 tim pada Futsal Putra.
 *
 * TODO(api-contract): angka-angka ini WAJIB datang dari server lewat pratinjau
 * dampak (`POST .../quota/preview`), bukan dihitung client. Menghitung siapa
 * yang tergeser di browser berarti menebak urutan pendaftaran yang otoritatif
 * ada di basis data (agents.md §0 prinsip 1).
 */
export const DAMPAK_KUOTA_FUTSAL = {
  dari: 20,
  ke: 18,
  timTerdampak: 2,
  pesertaTerdampak: 24,
  daftarTungguSetelah: 5,
  tertutupOtomatis: true,
  timDipindahkan: [
    { tim: 'Taruna Futsal', meta: 'mendaftar 27 Sep, 22.10 · 12 peserta' },
    { tim: 'Bahari Muda', meta: 'mendaftar 27 Sep, 19.44 · 12 peserta' },
  ],
} as const;
