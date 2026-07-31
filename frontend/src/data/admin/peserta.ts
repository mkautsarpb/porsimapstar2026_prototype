import type { BarisPeserta, DetailPeserta } from '@/types/admin';

/**
 * Fixture modul Peserta — mengikuti desain "Batch E1 · Peserta dan Verifikasi".
 *
 * TODO(api-contract): diganti oleh
 *   GET /api/v1/admin/participants?competition=&account_status=&q=&page=
 *   GET /api/v1/admin/participants/{id}
 * Server yang menyaring, menghalaman, dan MEMASKING — bukan client. Yang dikirim
 * ke browser hanya `masked_participant_id`; ID penuh dan NIK tidak pernah ikut,
 * termasuk di atribut DOM (agents.md §6, Batch E1 aturan modul).
 *
 * Jam skenario dibekukan di 28 Sep 2026, 09.43 WIB, sama dengan `data/panitia.ts`.
 */

export const TOTAL_DALAM_CAKUPAN = 1284;

export const DAFTAR_PESERTA: readonly BarisPeserta[] = [
  {
    id: 'psr-4471',
    nama: 'Rafi Ardiansyah',
    idTermasking: 'PSM-2026-••••-4471',
    kategori: 'Mahasiswa',
    institusi: 'Poltekkes Semarang',
    statusAkun: 'aktif',
    kelengkapan: { terisi: 6, total: 8 },
    jumlahLomba: 2,
    terakhirAktifIso: '2026-09-28T08:52:00+07:00',
    lomba: ['Basket Putra', 'Debat Bahasa Indonesia'],
  },
  {
    id: 'psr-2210',
    nama: 'Bagas Saputra',
    idTermasking: 'PSM-2026-••••-2210',
    kategori: 'Mahasiswa',
    institusi: 'Poltekkes Semarang',
    statusAkun: 'aktif',
    kelengkapan: { terisi: 8, total: 8 },
    jumlahLomba: 1,
    terakhirAktifIso: '2026-09-28T07:10:00+07:00',
    lomba: ['Basket Putra'],
  },
  {
    id: 'psr-3390',
    nama: 'Dimas Prakoso',
    idTermasking: 'PSM-2026-••••-3390',
    kategori: 'Mahasiswa',
    institusi: 'Poltekkes Semarang',
    statusAkun: 'aktif',
    kelengkapan: { terisi: 4, total: 8 },
    jumlahLomba: 1,
    terakhirAktifIso: '2026-09-27T21:44:00+07:00',
    lomba: ['Basket Putra'],
  },
  {
    id: 'psr-5502',
    nama: 'Laras Kirana',
    idTermasking: 'PSM-2026-••••-5502',
    kategori: 'Mahasiswa',
    institusi: 'Poltekkes Semarang',
    statusAkun: 'aktif',
    kelengkapan: { terisi: 8, total: 8 },
    jumlahLomba: 1,
    terakhirAktifIso: '2026-09-27T19:02:00+07:00',
    lomba: ['Debat Bahasa Indonesia'],
  },
  {
    id: 'psr-7781',
    nama: 'Yoga Hermawan',
    idTermasking: 'PSM-2026-••••-7781',
    kategori: 'Pelajar SMA',
    institusi: 'SMAN 3 Semarang',
    statusAkun: 'belum-verifikasi-email',
    kelengkapan: { terisi: 2, total: 8 },
    jumlahLomba: 0,
    terakhirAktifIso: '2026-09-26T14:30:00+07:00',
    lomba: ['Basket Putra'],
  },
  {
    id: 'psr-9014',
    nama: 'Rizky Amanda',
    idTermasking: 'PSM-2026-••••-9014',
    kategori: 'Taruna',
    institusi: 'Poltekpel Semarang',
    statusAkun: 'aktif',
    kelengkapan: { terisi: 8, total: 8 },
    jumlahLomba: 2,
    terakhirAktifIso: '2026-09-26T21:18:00+07:00',
    lomba: ['Voli Putra', 'Basket Putra'],
  },
  {
    id: 'psr-6620',
    nama: 'Fajar Nugroho',
    idTermasking: 'PSM-2026-••••-6620',
    kategori: 'Mahasiswa',
    institusi: 'Poltekkes Semarang',
    statusAkun: 'nonaktif',
    kelengkapan: { terisi: 7, total: 8 },
    jumlahLomba: 1,
    terakhirAktifIso: '2026-09-24T09:40:00+07:00',
    lomba: ['Basket Putra'],
  },
  {
    id: 'psr-1180',
    nama: 'Satria Wibowo',
    idTermasking: 'PSM-2026-••••-1180',
    kategori: 'Mahasiswa',
    institusi: 'Poltekkes Semarang',
    statusAkun: 'aktif',
    kelengkapan: { terisi: 8, total: 8 },
    jumlahLomba: 3,
    terakhirAktifIso: '2026-09-23T16:05:00+07:00',
    lomba: ['Basket Putra', 'Voli Putra', 'Esai Kebangsaan'],
  },
];

/**
 * Detail peserta. `identitas` sudah datang termasking dari server: komponen
 * tidak pernah menerima nilai penuh lalu menyembunyikannya di client — itu hanya
 * memindahkan kebocoran ke payload.
 */
export const DETAIL_PESERTA: Readonly<Record<string, DetailPeserta>> = {
  'psr-4471': {
    id: 'psr-4471',
    nama: 'Rafi Ardiansyah',
    inisial: 'RA',
    idTermasking: 'PSM-2026-••••-4471',
    statusAkun: 'aktif',
    kategori: 'Mahasiswa',
    institusi: 'Poltekkes Kemenkes Semarang',
    terdaftarIso: '2026-09-22T10:14:00+07:00',
    identitas: [
      { label: 'NIK', nilai: '•••• •••• •••• 0021' },
      { label: 'ID peserta', nilai: 'PSM-2026-••••-4471' },
      { label: 'Tanggal lahir', nilai: '12 Maret 2004' },
      { label: 'Usia pada 26 Okt 2026', nilai: '22 tahun · dalam rentang 17–22' },
      { label: 'Email', nilai: 'r••••@student.poltekkes-smg.ac.id' },
      { label: 'Telepon', nilai: '0812 •••• 7788' },
    ],
    berkas: [
      {
        id: 'brk-foto',
        jenis: 'Foto diri',
        riwayat: 'versi 2 · diunggah 26 Sep, 21.30 · versi 1 ditolak 25 Sep',
        keadaan: 'menunggu',
        keterangan: 'Menunggu keputusan · 11 jam',
        hrefPratinjau: '/admin/verifikasi/vrf-4471-foto',
      },
      {
        id: 'brk-ktp',
        jenis: 'KTP',
        riwayat: 'versi 1 · disetujui 25 Sep, 09.02 oleh Wulan Kartika',
        keadaan: 'disetujui',
        keterangan: 'Disetujui',
        hrefPratinjau: '/admin/verifikasi/vrf-4471-ktp',
      },
      {
        id: 'brk-kartu',
        jenis: 'Kartu mahasiswa',
        riwayat: 'belum ada berkas',
        keadaan: 'belum-diunggah',
        keterangan: 'Belum diunggah',
        hrefPratinjau: null,
      },
    ],
    pendaftaran: [
      {
        id: 'pdf-basket',
        lomba: 'Basket Putra',
        tim: 'Garuda Biru',
        peran: 'Ketua',
        status: 'Menunggu verifikasi',
        nada: 'warn',
      },
      {
        id: 'pdf-debat',
        lomba: 'Debat Bahasa Indonesia',
        tim: 'Debat Poltekkes A',
        peran: 'Anggota',
        status: 'Terverifikasi',
        nada: 'ok',
      },
    ],
    lombaDiLuarCakupan: 1,
    aktivitas: [
      {
        id: 'akt-1',
        judul: 'Mengunggah ulang foto diri (versi 2)',
        meta: 'Peserta · 26 Sep 2026, 21.30 · 2 hari lalu',
      },
      {
        id: 'akt-2',
        judul: 'Foto diri versi 1 ditolak · resolusi terlalu kecil',
        meta: 'Wulan Kartika (verifikator) · 25 Sep 2026, 09.05 · ref VRF-3312',
      },
      {
        id: 'akt-3',
        judul: 'Membuat tim Garuda Biru',
        meta: 'Peserta · 22 Sep 2026, 10.14',
      },
      {
        id: 'akt-4',
        judul: 'Akun dibuat dan email diverifikasi',
        meta: 'Peserta · 21 Sep 2026, 20.02',
      },
    ],
  },
  'psr-7781': {
    id: 'psr-7781',
    nama: 'Yoga Hermawan',
    inisial: 'YH',
    idTermasking: 'PSM-2026-••••-7781',
    statusAkun: 'belum-verifikasi-email',
    kategori: 'Pelajar SMA',
    institusi: 'SMAN 3 Semarang',
    terdaftarIso: '2026-09-25T08:20:00+07:00',
    identitas: [
      { label: 'NIK', nilai: '•••• •••• •••• 1147' },
      { label: 'ID peserta', nilai: 'PSM-2026-••••-7781' },
      { label: 'Tanggal lahir', nilai: '3 Mei 2008' },
      { label: 'Usia pada 26 Okt 2026', nilai: '18 tahun · dalam rentang 17–22' },
      { label: 'Email', nilai: 'y••••@sman3smg.sch.id' },
      { label: 'Telepon', nilai: '0857 •••• 2043' },
    ],
    berkas: [
      {
        id: 'brk-kartu-pelajar',
        jenis: 'Kartu pelajar',
        riwayat: 'versi 1 · diunggah 27 Sep, 14.30',
        keadaan: 'menunggu',
        keterangan: 'Menunggu keputusan · 19 jam',
        hrefPratinjau: '/admin/verifikasi/vrf-7781-kartu',
      },
      {
        id: 'brk-foto-yoga',
        jenis: 'Foto diri',
        riwayat: 'versi 1 · disetujui 26 Sep, 10.02',
        keadaan: 'disetujui',
        keterangan: 'Disetujui',
        hrefPratinjau: '/admin/verifikasi/vrf-7781-foto',
      },
      {
        id: 'brk-sehat',
        jenis: 'Surat keterangan sehat',
        riwayat: 'belum ada berkas',
        keadaan: 'belum-diunggah',
        keterangan: 'Belum diunggah',
        hrefPratinjau: null,
      },
    ],
    pendaftaran: [
      {
        id: 'pdf-basket-yoga',
        lomba: 'Basket Putra',
        tim: 'Garuda Biru',
        peran: 'Anggota',
        status: 'Menunggu verifikasi',
        nada: 'warn',
      },
    ],
    lombaDiLuarCakupan: 0,
    aktivitas: [
      {
        id: 'akt-y1',
        judul: 'Mengunggah kartu pelajar (versi 1)',
        meta: 'Peserta · 27 Sep 2026, 14.30 · 19 jam lalu',
      },
      {
        id: 'akt-y2',
        judul: 'Menerima undangan tim Garuda Biru',
        meta: 'Peserta · 26 Sep 2026, 09.12',
      },
      {
        id: 'akt-y3',
        judul: 'Akun dibuat · email belum diverifikasi',
        meta: 'Peserta · 25 Sep 2026, 08.20',
      },
    ],
  },
};

export const KOLOM_EKSPOR_PESERTA: readonly string[] = [
  'nama',
  'id_peserta_termasking',
  'kategori_peserta',
  'institusi',
  'status_akun',
  'kelengkapan_profil',
  'jumlah_lomba',
  'terakhir_aktif',
];
