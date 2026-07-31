import type {
  AgendaPeserta,
  AksiPerluTindakan,
  AktivitasPeserta,
  HasilPertandingan,
  Kelengkapan,
  KontakBantuan,
  LombaSaya,
  NotifikasiPeserta,
  ProfilPeserta,
  StatistikPeserta,
} from '@/types/peserta';

/**
 * Data tiruan area peserta — isinya mengikuti desain "Dashboard Peserta v3" dan
 * "Batch A" di Claude Design.
 *
 * TODO(api-contract): ganti seluruh modul ini dengan fetch ke endpoint di
 * `src/types/peserta.ts` begitu backend siap. Tidak ada komponen yang menulis
 * angka sendiri — semuanya membaca dari sini, jadi penggantiannya satu pintu.
 */

export const PROFIL: ProfilPeserta = {
  nama: 'Bagas Pratama',
  inisial: 'BP',
  nomorPeserta: 'PSM-••••-4821',
  terverifikasi: true,
};

export const RINGKASAN_SAPAAN =
  'Kamu terdaftar di 2 lomba. Satu perubahan jadwal menunggu konfirmasimu.';

export const AKSI_PERLU_TINDAKAN: readonly AksiPerluTindakan[] = [
  {
    id: 'jadwal-berubah',
    judul: 'Jadwal pertandinganmu berubah',
    konteks: 'Futsal Putra · Penyisihan Grup B — waktu mundur 2 jam',
    tenggat: 'Konfirmasi hari ini',
    cta: 'Lihat perubahan',
    href: '/lomba-saya/futsal-putra?tab=jadwal',
    nada: 'warn',
    ikon: 'ulang',
  },
];

export const KELENGKAPAN: Kelengkapan = {
  persen: 70,
  catatan:
    'Tersisa 2 tahap. Selesaikan sebelum 5 Agustus agar pendaftaranmu masuk antrean review.',
  langkah: [
    { label: 'Data diri', status: 'Lengkap', keadaan: 'ok' },
    { label: 'Data pendidikan', status: 'Lengkap', keadaan: 'ok' },
    {
      label: 'Dokumen persyaratan',
      status: '1 perlu diperbaiki · 1 belum diunggah',
      keadaan: 'warn',
      href: '/dokumen',
    },
    { label: 'Pemeriksaan eligibility', status: 'Usia 20 — memenuhi', keadaan: 'ok' },
    { label: 'Review & kirim', status: 'Belum dikirim', keadaan: 'warn', href: '/pendaftaran' },
  ],
};

export const LOMBA_SAYA: readonly LombaSaya[] = [
  {
    id: 'futsal-putra',
    nama: 'Futsal Putra',
    kategori: 'Olahraga',
    tipe: 'Tim',
    ikon: 'futsal',
    status: 'terverifikasi',
    peran: 'Ketua',
    roster: [
      { inisial: 'BP', nada: 'navy' },
      { inisial: 'RA', nada: 'sky' },
      { inisial: 'DS', nada: 'gold' },
      { inisial: '+1', nada: 'netral' },
    ],
    rosterTeks: '4 dari 5 anggota bergabung',
    kuotaTerpakai: 24,
    kuotaTotal: 32,
    kuotaSatuan: 'tim',
    jadwalTeks: 'Sen, 2 Sep · 07.30 · GOR Manunggal Jati',
    nomorReferensi: 'REG-4821-FT',
    didaftarkan: '26 Jul 2026',
    riwayat: false,
    artiStatus:
      'Pendaftaranmu sudah disetujui panitia. Simpan QR check-in dan pantau perubahan jadwal.',
  },
  {
    id: 'fotografi',
    nama: 'Fotografi',
    kategori: 'Seni',
    tipe: 'Individual',
    ikon: 'fotografi',
    status: 'menunggu-review',
    kuotaTerpakai: 48,
    kuotaTotal: 60,
    kuotaSatuan: 'peserta',
    jadwalTeks: 'Rab, 4 Sep · 09.00 · Gedung Serbaguna Lt. 2',
    nomorReferensi: 'REG-4821-FG',
    didaftarkan: '26 Jul 2026',
    riwayat: false,
    artiStatus:
      'Berkasmu sedang diperiksa panitia. Tidak ada yang perlu kamu lakukan sekarang.',
    tenggat: 'Perkiraan selesai 2 hari kerja',
  },
  {
    id: 'basket-putra',
    nama: 'Basket Putra',
    kategori: 'Olahraga',
    tipe: 'Tim',
    ikon: 'basket',
    status: 'perlu-perbaikan',
    peran: 'Anggota',
    roster: [
      { inisial: 'GM', nada: 'navy' },
      { inisial: 'BP', nada: 'sky' },
      { inisial: '+6', nada: 'netral' },
    ],
    rosterTeks: '8 dari 10 anggota bergabung',
    kuotaTerpakai: 14,
    kuotaTotal: 16,
    kuotaSatuan: 'tim',
    jadwalTeks: 'Kam, 29 Okt · 15.00 · GOR AKPOL',
    nomorReferensi: 'REG-4821-BK',
    didaftarkan: '24 Jul 2026',
    riwayat: false,
    artiStatus: 'Pendaftaran belum bisa disetujui sampai satu dokumen kamu perbaiki.',
    catatanPanitia:
      'Scan surat keterangan aktif kuliah terpotong di bagian tanda tangan dan stempel. Unggah ulang halaman penuh.',
    tenggat: 'Perbaiki sebelum Kamis, 1 Oktober 2026',
  },
  {
    id: 'cerdas-cermat',
    nama: 'Cerdas Cermat',
    kategori: 'Akademik',
    tipe: 'Tim',
    ikon: 'cerdascermat',
    status: 'selesai',
    peran: 'Anggota',
    rosterTeks: '3 dari 3 anggota bergabung',
    kuotaTerpakai: 16,
    kuotaTotal: 16,
    kuotaSatuan: 'tim',
    jadwalTeks: 'Selesai · 12 Okt 2025',
    nomorReferensi: 'REG-3390-CC',
    didaftarkan: '2 Agu 2025',
    riwayat: true,
    artiStatus: 'Kompetisi sudah selesai. Sertifikat terbit di menu Sertifikat.',
  },
  {
    id: 'esport',
    nama: 'E-Sport',
    kategori: 'Olahraga',
    tipe: 'Tim',
    ikon: 'esport',
    status: 'ditarik',
    kuotaTerpakai: 30,
    kuotaTotal: 32,
    kuotaSatuan: 'tim',
    jadwalTeks: 'Pendaftaran ditarik · 9 Agu 2025',
    nomorReferensi: 'REG-3390-ES',
    didaftarkan: '1 Agu 2025',
    riwayat: true,
    artiStatus: 'Kamu menarik pendaftaran ini. Slot sudah dikembalikan ke kuota cabang.',
  },
];

export const AGENDA: readonly AgendaPeserta[] = [
  {
    id: 'a1',
    tanggal: '02',
    bulan: 'SEP',
    nama: 'Futsal Putra',
    detail: 'Penyisihan Grup B · vs Tim Bina Taruna',
    jam: '09.30',
    jamLama: '07.30',
    venue: 'GOR Manunggal Jati',
    berubah: true,
  },
  {
    id: 'a2',
    tanggal: '04',
    bulan: 'SEP',
    nama: 'Fotografi',
    detail: 'Sesi hunting foto · pengumpulan karya',
    jam: '09.00',
    venue: 'Gedung Serbaguna Lt. 2',
    berubah: false,
  },
  {
    id: 'a3',
    tanggal: '05',
    bulan: 'SEP',
    nama: 'Futsal Putra',
    detail: 'Perempat final · lawan menyusul',
    jam: '15.00',
    venue: 'GOR Manunggal Jati',
    berubah: false,
  },
];

export const HASIL: readonly HasilPertandingan[] = [
  {
    id: 'h1',
    nama: 'Futsal Putra',
    skor: '3 — 1',
    lawan: 'Tim Bina Taruna',
    babak: 'Penyisihan Grup B · Laga 1',
    status: 'Lolos',
    nada: 'ok',
  },
  {
    id: 'h2',
    nama: 'Futsal Putra',
    skor: '2 — 2',
    lawan: 'STIE Cendekia',
    babak: 'Penyisihan Grup B · Laga 2',
    status: 'Seri',
    nada: 'netral',
  },
];

export const STATISTIK: readonly StatistikPeserta[] = [
  { nilai: '2', label: 'Lomba diikuti', ikon: 'piala' },
  { nilai: '1', label: 'Pendaftaran terverifikasi', ikon: 'centang' },
  { nilai: '3', label: 'Jadwal mendatang', ikon: 'kalender' },
  { nilai: '1', label: 'Total check-in', ikon: 'qr' },
];

export const AKTIVITAS: readonly AktivitasPeserta[] = [
  { id: 'v1', teks: 'Check-in berhasil di GOR Manunggal Jati', waktu: 'Hari ini, 07.12', nada: 'ok' },
  { id: 'v2', teks: 'Kode QR Futsal Putra diterbitkan', waktu: 'Kemarin, 19.40', nada: 'ok' },
  { id: 'v3', teks: 'Pendaftaran Futsal Putra diverifikasi panitia', waktu: '28 Jul, 16.05', nada: 'ok' },
  { id: 'v4', teks: 'Dokumen kartu tanda mahasiswa diunggah ulang', waktu: '27 Jul, 21.18', nada: 'info' },
  { id: 'v5', teks: 'Pendaftaran Fotografi dikirim untuk review', waktu: '26 Jul, 10.02', nada: 'info' },
];

export const BANTUAN: readonly KontakBantuan[] = [
  { nama: 'Rian Kusuma', keterangan: 'PIC Futsal · WhatsApp 08xx-xxxx-118', ikon: 'telepon' },
  { nama: 'Panitia Pendaftaran', keterangan: 'Live chat · setiap hari 08.00–20.00', ikon: 'chat' },
];

export const NOTIFIKASI: readonly NotifikasiPeserta[] = [
  {
    id: 'n1',
    judul: 'Jadwal pertandingan berubah',
    konteks: 'Futsal Putra · Penyisihan Grup B',
    waktu: '12 menit lalu',
    baru: true,
    nada: 'warn',
    ikon: 'ulang',
  },
  {
    id: 'n2',
    judul: 'Dokumen perlu diperbaiki',
    konteks: 'Basket Putra · surat keterangan aktif',
    waktu: '2 jam lalu',
    baru: true,
    nada: 'danger',
    ikon: 'berkas',
  },
  {
    id: 'n3',
    judul: 'Kode QR check-in diterbitkan',
    konteks: 'Futsal Putra',
    waktu: 'Kemarin, 19.40',
    baru: true,
    nada: 'ok',
    ikon: 'qr',
  },
  {
    id: 'n4',
    judul: 'Pendaftaran diverifikasi',
    konteks: 'Futsal Putra',
    waktu: '28 Jul',
    baru: false,
    nada: 'ok',
    ikon: 'centang',
  },
  {
    id: 'n5',
    judul: 'Hasil pertandingan terbit',
    konteks: 'Futsal Putra · menang 3–1 atas Tim Bina Taruna',
    waktu: '28 Jul',
    baru: false,
    nada: 'info',
    ikon: 'piala',
  },
];

/** Label + nada badge status pendaftaran, dipakai kartu lomba dan halaman detail. */
export const LABEL_STATUS = {
  terverifikasi: { label: 'Terverifikasi', nada: 'ok', ikon: 'centang' },
  'menunggu-review': { label: 'Menunggu review', nada: 'info', ikon: 'jam' },
  'perlu-perbaikan': { label: 'Perlu diperbaiki', nada: 'warn', ikon: 'seru' },
  ditolak: { label: 'Ditolak', nada: 'danger', ikon: 'silang' },
  ditarik: { label: 'Ditarik', nada: 'netral', ikon: 'silang' },
  selesai: { label: 'Selesai', nada: 'netral', ikon: 'piala' },
} as const;

export function cariLomba(id: string): LombaSaya | undefined {
  return LOMBA_SAYA.find((l) => l.id === id);
}
