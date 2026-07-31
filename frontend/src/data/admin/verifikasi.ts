import type { BarisAntreanVerifikasi, DokumenKeputusan } from '@/types/admin';

/**
 * Fixture modul Verifikasi — desain "Batch E1 · Peserta dan Verifikasi" (E1.2).
 *
 * TODO(api-contract): diganti oleh
 *   GET  /api/v1/admin/verifications?status=&competition=&document_type=&page=
 *   GET  /api/v1/admin/verifications/{id}
 *   POST /api/v1/admin/verifications/{id}/decision
 *        body { decision: 'approve'|'revision'|'reject', standard_reason, note, version }
 *        409 VERSION_CONFLICT bila dokumen sudah diputuskan verifikator lain.
 *
 * `tautanKedaluwarsaDetik` datang dari server, bukan dihitung client: masa
 * berlaku tautan pratinjau ditentukan penerbit tautannya, dan hitung mundur yang
 * dihitung dari jam perangkat akan meleset begitu jamnya tidak sinkron.
 */

export const TOTAL_MENUNGGU = 64;
export const SUDAH_DIPUTUSKAN_HARI_INI = 12;

export const ANTREAN_VERIFIKASI: readonly BarisAntreanVerifikasi[] = [
  {
    id: 'vrf-7781-kartu',
    umurJam: 19,
    masukIso: '2026-09-27T14:30:00+07:00',
    namaPeserta: 'Yoga Hermawan',
    idTermasking: 'PSM-2026-••••-7781',
    lomba: 'Basket Putra',
    jenisDokumen: 'Kartu pelajar',
    versi: 'v1',
    otomatis: { lolos: 2, total: 3 },
    ditugaskan: null,
  },
  {
    id: 'vrf-3390-sehat',
    umurJam: 17,
    masukIso: '2026-09-27T16:20:00+07:00',
    namaPeserta: 'Dimas Prakoso',
    idTermasking: 'PSM-2026-••••-3390',
    lomba: 'Basket Putra',
    jenisDokumen: 'Surat keterangan sehat',
    versi: 'v2',
    otomatis: { lolos: 3, total: 3 },
    ditugaskan: 'Wulan Kartika',
  },
  {
    id: 'vrf-5502-kartu',
    umurJam: 14,
    masukIso: '2026-09-27T19:05:00+07:00',
    namaPeserta: 'Laras Kirana',
    idTermasking: 'PSM-2026-••••-5502',
    lomba: 'Debat Bahasa Indonesia',
    jenisDokumen: 'Kartu mahasiswa',
    versi: 'v1',
    otomatis: { lolos: 3, total: 3 },
    ditugaskan: 'Wulan Kartika',
  },
  {
    id: 'vrf-4471-foto',
    umurJam: 11,
    masukIso: '2026-09-27T22:14:00+07:00',
    namaPeserta: 'Rafi Ardiansyah',
    idTermasking: 'PSM-2026-••••-4471',
    lomba: 'Basket Putra',
    jenisDokumen: 'Foto diri',
    versi: 'v2',
    otomatis: { lolos: 3, total: 3 },
    ditugaskan: 'Wulan Kartika',
  },
  {
    id: 'vrf-9014-taruna',
    umurJam: 6,
    masukIso: '2026-09-28T03:30:00+07:00',
    namaPeserta: 'Rizky Amanda',
    idTermasking: 'PSM-2026-••••-9014',
    lomba: 'Voli Putra',
    jenisDokumen: 'Kartu taruna',
    versi: 'v1',
    otomatis: { lolos: 3, total: 3 },
    ditugaskan: null,
  },
  {
    id: 'vrf-2210-ktp',
    umurJam: 2,
    masukIso: '2026-09-28T07:45:00+07:00',
    namaPeserta: 'Bagas Saputra',
    idTermasking: 'PSM-2026-••••-2210',
    lomba: 'Basket Putra',
    jenisDokumen: 'KTP',
    versi: 'v1',
    otomatis: { lolos: 3, total: 3 },
    ditugaskan: null,
  },
];

/** Alasan baku keputusan. Wajib salah satu, lalu keterangan bebas menyusul. */
export const ALASAN_MINTA_PERBAIKAN: readonly string[] = [
  'Sebagian informasi pada kartu tidak terbaca',
  'Berkas kabur atau resolusi terlalu kecil',
  'Jenis berkas tidak sesuai yang diminta',
  'Data pada berkas berbeda dengan data profil',
];

export const ALASAN_TOLAK: readonly string[] = [
  'Identitas pada berkas bukan milik peserta ini',
  'Masa berlaku dokumen sudah habis',
  'Ada indikasi berkas telah diubah',
  'Peserta tidak memenuhi syarat kategori lomba',
];

export const DOKUMEN_KEPUTUSAN: Readonly<Record<string, DokumenKeputusan>> = {
  'vrf-7781-kartu': {
    id: 'vrf-7781-kartu',
    jenisDokumen: 'Kartu pelajar',
    namaBerkas: 'kartu-pelajar-yoga.jpg',
    ukuran: '1,2 MB',
    unggahIso: '2026-09-27T14:30:00+07:00',
    versi: 'v1',
    umurJam: 19,
    namaPeserta: 'Yoga Hermawan',
    idTermasking: 'PSM-2026-••••-7781',
    kategori: 'Pelajar SMA',
    institusi: 'SMAN 3 Semarang',
    lomba: 'Basket Putra',
    nikTermasking: '•••• •••• •••• 1147',
    pemeriksaan: [
      {
        id: 'usia',
        judul: 'Usia pada tanggal acuan',
        lolos: true,
        rincian:
          '18 tahun pada 26 Oktober 2026, di dalam rentang 17–22 tahun. Dihitung dari tanggal lahir 3 Mei 2008 di profil peserta.',
      },
      {
        id: 'jenjang',
        judul: 'Jenjang pendidikan',
        lolos: true,
        rincian:
          'SMA/sederajat, memenuhi syarat minimal. Jenjang diambil dari profil, bukan dari berkas ini.',
      },
      {
        id: 'kelengkapan',
        judul: 'Kelengkapan berkas',
        lolos: false,
        rincian:
          'Masa berlaku kartu tidak terbaca oleh sistem: area kanan bawah terpotong sekitar 8% dari lebar gambar. Nama dan nomor induk terbaca.',
      },
    ],
    tautanKedaluwarsaDetik: 252,
    refLog: 'VRF-LOG-9921',
    posisi: { indeks: 1, total: TOTAL_MENUNGGU },
    hrefSebelumnya: null,
    hrefBerikutnya: '/admin/verifikasi/vrf-3390-sehat',
  },
  'vrf-3390-sehat': {
    id: 'vrf-3390-sehat',
    jenisDokumen: 'Surat keterangan sehat',
    namaBerkas: 'skt-sehat-dimas-v2.pdf',
    ukuran: '840 KB',
    unggahIso: '2026-09-27T16:20:00+07:00',
    versi: 'v2',
    umurJam: 17,
    namaPeserta: 'Dimas Prakoso',
    idTermasking: 'PSM-2026-••••-3390',
    kategori: 'Mahasiswa',
    institusi: 'Poltekkes Semarang',
    lomba: 'Basket Putra',
    nikTermasking: '•••• •••• •••• 3390',
    pemeriksaan: [
      {
        id: 'usia',
        judul: 'Usia pada tanggal acuan',
        lolos: true,
        rincian: '21 tahun pada 26 Oktober 2026, di dalam rentang 17–22 tahun.',
      },
      {
        id: 'penerbit',
        judul: 'Penerbit dokumen',
        lolos: true,
        rincian: 'Terbaca sebagai fasilitas kesehatan berizin, tertanggal 24 September 2026.',
      },
      {
        id: 'masa-berlaku',
        judul: 'Masa berlaku',
        lolos: true,
        rincian: 'Berlaku sampai 24 Desember 2026, melewati seluruh hari perlombaan.',
      },
    ],
    tautanKedaluwarsaDetik: 300,
    refLog: 'VRF-LOG-9922',
    posisi: { indeks: 2, total: TOTAL_MENUNGGU },
    hrefSebelumnya: '/admin/verifikasi/vrf-7781-kartu',
    hrefBerikutnya: '/admin/verifikasi/vrf-5502-kartu',
  },
};

/**
 * Dokumen yang sudah diputuskan verifikator lain saat layar ini dibuka.
 * Dipakai menggambarkan keadaan konflik (agents.md §4) tanpa perlu dua sesi.
 */
export const KONFLIK_CONTOH = {
  dokumen: 'Kartu pelajar Yoga Hermawan',
  olehSiapa: 'Bayu Setiawan',
  keputusan: 'disetujui',
  waktu: '28 Sep 2026, 09.47',
  revisiDibuka: 'rev 4 · 09.46',
  revisiServer: 'rev 5 · 09.47',
} as const;
