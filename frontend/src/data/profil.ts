/**
 * Isian profil peserta (desain "Batch C — Profil").
 *
 * TODO(api-contract):
 *   GET   /api/v1/me/profile          -> nilai tersimpan + status tiap tahap
 *   PATCH /api/v1/me/profile          -> simpan draf per tahap (autosave)
 *   POST  /api/v1/me/profile/submit   -> kirim profil (idempotency key)
 *
 * Dua nilai yang TIDAK boleh dihitung client: kelayakan usia dan kelengkapan
 * tahap. Tanggal acuan usia datang dari server — menghitungnya di browser
 * membuat hasilnya bergeser mengikuti jam perangkat peserta (agents.md §5).
 */

export type KeadaanTahap = 'selesai' | 'aktif' | 'belum';

export interface TahapProfil {
  readonly nomor: number;
  readonly kunci: 'identitas' | 'pendidikan' | 'dokumen' | 'tinjau';
  readonly label: string;
  readonly keadaan: KeadaanTahap;
  /** Catatan singkat di stepper, misal "1/4" untuk dokumen. */
  readonly ringkas?: string;
}

export interface IsianProfil {
  readonly id: string;
  readonly label: string;
  readonly nilai: string;
  readonly bantuan?: string;
  readonly wajib: boolean;
  readonly tipe: 'teks' | 'pilihan';
  readonly opsi?: readonly string[];
}

export const TAHAP_PROFIL: readonly TahapProfil[] = [
  { nomor: 1, kunci: 'identitas', label: 'Identitas', keadaan: 'selesai' },
  { nomor: 2, kunci: 'pendidikan', label: 'Pendidikan', keadaan: 'selesai' },
  { nomor: 3, kunci: 'dokumen', label: 'Dokumen', keadaan: 'aktif', ringkas: '2 dari 4 beres' },
  { nomor: 4, kunci: 'tinjau', label: 'Tinjau', keadaan: 'belum' },
];

export const ISIAN_IDENTITAS: readonly IsianProfil[] = [
  {
    id: 'nama',
    label: 'Nama lengkap',
    nilai: 'Bagas Pratama',
    bantuan: 'Tulis sesuai KTP, tanpa gelar.',
    wajib: true,
    tipe: 'teks',
  },
  {
    id: 'kelamin',
    label: 'Jenis kelamin',
    nilai: 'Laki-laki',
    bantuan: 'Dipakai untuk penempatan cabang putra/putri.',
    wajib: true,
    tipe: 'pilihan',
    opsi: ['Laki-laki', 'Perempuan'],
  },
  {
    id: 'lahir',
    label: 'Tanggal lahir',
    nilai: '12 Maret 2006',
    bantuan:
      'Syarat usia 17–22 tahun dihitung pada 2 September 2026 — usiamu 20 tahun, memenuhi syarat.',
    wajib: true,
    tipe: 'teks',
  },
  {
    id: 'telepon',
    label: 'Nomor telepon',
    nilai: '0812 3344 7788',
    bantuan: 'Dipakai panitia hanya untuk hal mendesak saat lomba. Format +62 juga diterima.',
    wajib: true,
    tipe: 'teks',
  },
  {
    id: 'domisili',
    label: 'Domisili',
    nilai: 'Jl. Kelud Raya 21, Semarang, Jawa Tengah',
    wajib: true,
    tipe: 'teks',
  },
];

export const ISIAN_PENDIDIKAN: readonly IsianProfil[] = [
  {
    id: 'jenjang',
    label: 'Jenjang pendidikan saat ini',
    nilai: 'Diploma / sarjana',
    wajib: true,
    tipe: 'pilihan',
    opsi: ['SMA / sederajat', 'Diploma / sarjana', 'Pendidikan kedinasan'],
  },
  {
    id: 'institusi',
    label: 'Institusi',
    nilai: 'Politeknik Negeri Semarang',
    bantuan:
      'Institusi ini dipakai untuk seluruh tim yang kamu ikuti dan harus sama dengan kartu mahasiswamu.',
    wajib: true,
    tipe: 'teks',
  },
  {
    id: 'nim',
    label: 'NIM / nomor induk',
    nilai: '3.31.22.1.05',
    wajib: true,
    tipe: 'teks',
  },
];

/** NIK sudah tersamarkan server; nilai penuh tidak pernah dikirim ke client (§6). */
export const NIK_TERSIMPAN = '•••• •••• •••• 0021';

export const ELIGIBILITAS = {
  memenuhi: true,
  judul: '20 tahun pada 2 September 2026 — memenuhi syarat',
  penjelasan:
    'Syarat usia peserta adalah 17–22 tahun pada tanggal acuan 2 September 2026 (hari pertama lomba). Usiamu dihitung server dari tanggal lahir yang kamu isi, bukan dari jam perangkatmu.',
} as const;

/** Salinan copy untuk keadaan tidak memenuhi syarat — spesifik, tanpa menghakimi. */
export const TIDAK_MEMENUHI = {
  judul: 'Usiamu di luar rentang yang dibolehkan tahun ini',
  penjelasan:
    'Syarat peserta PORSIMAPTAR 2026 adalah 17–22 tahun pada 2 September 2026. Ini aturan rentang usia kompetisi, bukan penilaian atas kemampuanmu.',
  jalanKeluar: [
    'Kalau tanggal lahirnya salah tulis, perbaiki di tahap Identitas — perubahan langsung dihitung ulang server.',
    'Kalau tanggalnya benar, kamu bisa mendaftar sebagai official tim atau volunteer panitia; keduanya tidak dibatasi rentang usia ini.',
    'Drafmu tetap tersimpan, jadi tidak ada isian yang hilang kalau kamu ingin memeriksanya lagi bersama panitia.',
  ],
} as const;
