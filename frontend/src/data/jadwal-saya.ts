import type { AgendaSaya, KelompokAgenda, KonflikJadwal } from '@/types/peserta';

/**
 * Agenda peserta lintas cabang (desain "Batch C — Jadwal Saya").
 *
 * Halaman Jadwal Saya memuat SELURUH agenda peserta; tab Jadwal di detail lomba
 * hanya agenda satu cabang. Keduanya membaca sumber yang sama supaya jam dan
 * venue tidak pernah berbeda antar layar.
 *
 * TODO(api-contract): `GET /api/v1/me/schedule?from=&to=` yang mengembalikan
 * agenda beserta penanda perubahan dan konflik. Deteksi konflik dilakukan
 * SERVER — client tidak menghitung tabrakan waktu sendiri, karena hanya panitia
 * yang boleh memindahkan jadwal (agents.md §0 prinsip 1).
 */

export const AGENDA_SAYA: readonly AgendaSaya[] = [
  {
    id: 'j0',
    kelompok: 'sebelum',
    iso: '2026-07-26',
    tanggal: '26',
    bulan: 'JUL',
    nama: 'Sosialisasi & pembukaan pendaftaran',
    subjudul: 'Semua cabang',
    jam: '09.00–10.30',
    venue: 'Daring · Zoom',
    keadaan: 'selesai',
    catatan: 'Kamu hadir. Rekaman dan materi tersedia di halaman Bantuan.',
  },
  {
    id: 'j1',
    kelompok: 'sebelum',
    iso: '2026-08-05',
    tanggal: '05',
    bulan: 'AGU',
    nama: 'Penutupan pendaftaran & penguncian roster',
    subjudul: 'Semua cabang',
    jam: 'sampai 23.59',
    venue: 'Daring',
    keadaan: 'normal',
    catatan:
      'Setelah jam ini, undangan tim dan perubahan roster ditutup. Dokumen yang masih perlu diperbaiki tetap bisa diunggah sampai batas perbaikan.',
  },
  {
    id: 'j2',
    kelompok: 'sebelum',
    iso: '2026-08-06',
    tanggal: '06',
    bulan: 'AGU',
    nama: 'Daftar ulang peserta',
    subjudul: 'Semua cabang',
    jam: '08.00–15.00',
    venue: 'Gedung Sekretariat PORSIMAPTAR',
    keadaan: 'normal',
    catatan:
      'Bawa kartu peserta dan identitas asli. Daftar ulang bisa diwakilkan ketua tim untuk seluruh anggota.',
  },
  {
    id: 'j3',
    kelompok: 'sebelum',
    iso: '2026-08-29',
    tanggal: '29',
    bulan: 'AGU',
    nama: 'Technical meeting',
    subjudul: 'Futsal Putra & Basket Putra',
    jam: '13.00–15.00',
    venue: 'Aula Serbaguna Akpol',
    keadaan: 'normal',
    catatan: 'Pengundian bagan dan penjelasan regulasi. Kehadiran ketua tim wajib.',
  },
  {
    id: 'j4',
    kelompok: 'check-in',
    iso: '2026-09-02',
    tanggal: '02–05',
    bulan: 'SEP',
    nama: 'Check-in harian di venue',
    subjudul: 'Dibuka 90 menit sebelum tiap pertandingan, ditutup 20 menit sebelum mulai',
    jam: 'Pertama: 2 Sep, 08.00–09.10',
    venue: 'GOR Manunggal Jati, meja check-in Futsal',
    keadaan: 'normal',
    catatan:
      'Tunjukkan QR kartu peserta ke petugas. Kalau QR gagal dibaca, petugas mencari namamu manual — kamu tidak perlu mengulang pendaftaran.',
  },
  {
    id: 'j5',
    kelompok: 'pertandingan',
    iso: '2026-09-02',
    tanggal: '02',
    bulan: 'SEP',
    nama: 'Futsal Putra · Penyisihan Grup B',
    subjudul: 'vs Tim Bina Taruna · tim Garuda Muda',
    jam: '09.30–11.00',
    jamLama: '07.30–09.00',
    venue: 'GOR Manunggal Jati, lapangan 1',
    keadaan: 'berubah',
    perubahan:
      'Diubah panitia pada 30 Juli 2026, 16.40 karena bentrok dengan agenda kampus tuan rumah.',
    lombaId: 'futsal-putra',
  },
  {
    id: 'j6',
    kelompok: 'pertandingan',
    iso: '2026-09-04',
    tanggal: '04',
    bulan: 'SEP',
    nama: 'Fotografi · Sesi hunting foto',
    subjudul: 'Pengumpulan karya di akhir sesi',
    jam: '09.00–12.00',
    venue: 'Gedung Serbaguna Lt. 2',
    keadaan: 'normal',
    lombaId: 'fotografi',
  },
  {
    id: 'j7',
    kelompok: 'pertandingan',
    iso: '2026-09-05',
    tanggal: '05',
    bulan: 'SEP',
    nama: 'Futsal Putra · Perempat final',
    subjudul: 'Lawan menyusul setelah penyisihan',
    jam: '15.00–16.30',
    venue: 'GOR Manunggal Jati, lapangan 1',
    keadaan: 'konflik',
    konflik:
      'Bertabrakan 60 menit dengan Fotografi · Penjurian karya 14.00–16.00 di Gedung Serbaguna Lt. 2. Kamu tidak bisa hadir di keduanya — panitia perlu memindahkan salah satunya.',
    lombaId: 'futsal-putra',
  },
  {
    id: 'j8',
    kelompok: 'pertandingan',
    iso: '2026-09-05',
    tanggal: '05',
    bulan: 'SEP',
    nama: 'Fotografi · Penjurian & presentasi karya',
    subjudul: 'Peserta hadir saat karyanya dinilai',
    jam: '14.00–16.00',
    venue: 'Gedung Serbaguna Lt. 2',
    keadaan: 'konflik',
    konflik:
      'Bertabrakan 60 menit dengan Futsal Putra · Perempat final 15.00–16.30 di GOR Manunggal Jati. Laporkan satu kali saja — panitia melihat kedua agenda dalam satu laporan.',
    lombaId: 'fotografi',
  },
];

export const KONFLIK_JADWAL: readonly KonflikJadwal[] = [
  {
    id: 'k1',
    ringkas: '1 konflik waktu antar cabang pada 5 September 2026',
    penjelasan:
      'Futsal Putra 15.00–16.30 di GOR Manunggal Jati bertabrakan dengan Fotografi 14.00–16.00 di Gedung Serbaguna Lt. 2. Keduanya tetap ditampilkan di bawah — kami tidak menyembunyikan salah satunya karena hanya panitia yang boleh memindahkan jadwal.',
  },
];

export const JUDUL_KELOMPOK: Record<KelompokAgenda, { judul: string; keterangan: string }> = {
  sebelum: {
    judul: 'Sebelum lomba',
    keterangan: 'Wajib diikuti sebelum kamu boleh check-in',
  },
  'check-in': {
    judul: 'Periode check-in',
    keterangan: 'Dibuka 90 menit sebelum tiap pertandingan, ditutup 20 menit sebelum mulai',
  },
  pertandingan: {
    judul: 'Pertandingan',
    keterangan: '2 cabang · jadwal bisa berubah sampai H-1',
  },
};

/** Cabang yang bisa dipakai memfilter linimasa. */
export const FILTER_CABANG = [
  { nilai: 'semua', label: 'Semua cabang' },
  { nilai: 'futsal-putra', label: 'Futsal Putra' },
  { nilai: 'fotografi', label: 'Fotografi' },
] as const;

export function agendaTersaring(cabang: string): readonly AgendaSaya[] {
  if (cabang === 'semua') return AGENDA_SAYA;
  return AGENDA_SAYA.filter((a) => a.lombaId === cabang || !a.lombaId);
}
