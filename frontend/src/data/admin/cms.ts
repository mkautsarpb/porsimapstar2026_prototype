import type { BarisKonten, VersiKonten } from '@/types/admin';

/**
 * Fixture modul CMS portal publik — desain "Batch E4" (E4.2).
 *
 * TODO(api-contract): diganti oleh
 *   GET  /api/v1/admin/contents?type=&status=&author=
 *   GET  /api/v1/admin/contents/{id}/versions
 *   POST /api/v1/admin/contents/{id}          body { body_html, publish_at?, channels[] }
 *   POST /api/v1/admin/contents/{id}/publish  // publish_at kosong = terbit sekarang
 *
 * **Sanitasi isi adalah tanggung jawab server**, dijalankan sebelum disimpan dan
 * sebelum dirender. Yang dilakukan client hanya memberi tahu aturannya di editor
 * supaya tidak ada yang menempelkan embed lalu heran embed-nya hilang: hanya tag
 * teks dasar, daftar, dan tautan http/https yang bertahan; skrip, iframe, dan
 * atribut event dihapus tanpa mengubah teksnya (agents.md §6).
 */

export const JENIS_KONTEN: readonly { readonly nama: string; readonly jumlah: number }[] = [
  { nama: 'Pengumuman', jumlah: 12 },
  { nama: 'FAQ', jumlah: 9 },
  { nama: 'Halaman statis', jumlah: 3 },
  { nama: 'Timeline', jumlah: 1 },
  { nama: 'Kontak', jumlah: 1 },
];

export const TOTAL_KONTEN = JENIS_KONTEN.reduce((n, j) => n + j.jumlah, 0);

export const DAFTAR_KONTEN: readonly BarisKonten[] = [
  {
    id: 'cms-tm',
    judul: 'Technical meeting pindah ke pagi',
    jenis: 'Pengumuman',
    status: 'terjadwal',
    waktu: 'terbit 22 jam lagi',
    versi: 'v3',
    penulis: 'Wulan Kartika',
    jadwalTerbit: '29 Sep 2026, 08.00',
  },
  {
    id: 'cms-panduan',
    judul: 'Panduan check-in hari-H',
    jenis: 'Halaman statis',
    status: 'draf',
    waktu: 'disimpan 09.20 · 23 menit lalu',
    versi: 'v2',
    penulis: 'Bayu Setiawan',
    jadwalTerbit: null,
  },
  {
    id: 'cms-tutup',
    judul: 'Pendaftaran ditutup 5 Oktober',
    jenis: 'Pengumuman',
    status: 'tayang',
    waktu: 'terbit 21 Sep, 09.00',
    versi: 'v4',
    penulis: 'Wulan Kartika',
    jadwalTerbit: null,
  },
  {
    id: 'cms-timeline',
    judul: 'Timeline PORSIMAPTAR XXVI',
    jenis: 'Timeline',
    status: 'tayang',
    waktu: 'terbit 27 Sep, 16.45',
    versi: 'v7',
    penulis: 'Wulan Kartika',
    jadwalTerbit: null,
  },
  {
    id: 'cms-faq-dua-cabang',
    judul: 'Apakah boleh ikut dua cabang?',
    jenis: 'FAQ',
    status: 'tayang',
    waktu: 'terbit 24 Sep, 11.10',
    versi: 'v2',
    penulis: 'Rizal Hakim',
    jadwalTerbit: null,
  },
  {
    id: 'cms-color-run',
    judul: 'Rundown color run 26 Oktober',
    jenis: 'Pengumuman',
    status: 'terjadwal',
    waktu: 'terbit 2 hari lagi',
    versi: 'v1',
    penulis: 'Bayu Setiawan',
    jadwalTerbit: '30 Sep 2026, 07.00',
  },
  {
    id: 'cms-kontak',
    judul: 'Kontak sekretariat & PIC cabang',
    jenis: 'Kontak',
    status: 'tayang',
    waktu: 'terbit 25 Sep, 08.30',
    versi: 'v5',
    penulis: 'Wulan Kartika',
    jadwalTerbit: null,
  },
  {
    id: 'cms-sanggahan',
    judul: 'Prosedur sanggahan hasil lomba',
    jenis: 'Halaman statis',
    status: 'draf',
    waktu: 'disimpan 27 Sep, 19.02',
    versi: 'v1',
    penulis: 'Sari Wulandari',
    jadwalTerbit: null,
  },
];

export const ISI_CONTOH = `Technical meeting PORSIMAPTAR XXVI dipindahkan dari 13.00 menjadi 09.00–11.00 pada Rabu, 7 Oktober 2026, karena aula dipakai agenda kampus tuan rumah.

Ketua tim wajib hadir. Tautan ruang daring dikirim H-1 lewat notifikasi dan email. Peserta yang tidak bisa hadir dapat mengirim perwakilan satu anggota.`;

export const VERSI_KONTEN: readonly VersiKonten[] = [
  {
    id: 'v3',
    label: 'v3 · draf terjadwal',
    oleh: 'Wulan Kartika',
    waktu: '28 Sep 2026, 09.42',
    notifikasi: 'belum terkirim',
    keadaan: 'disunting',
  },
  {
    id: 'v2',
    label: 'v2 · tayang sekarang',
    oleh: 'Wulan Kartika',
    waktu: '27 Sep 2026, 16.40',
    notifikasi: '1.284 notifikasi terkirim',
    keadaan: 'tayang',
  },
  {
    id: 'v1',
    label: 'v1',
    oleh: 'Bayu Setiawan',
    waktu: '26 Sep 2026, 10.15',
    notifikasi: '0 notifikasi',
    keadaan: 'lama',
  },
];

export const PERKIRAAN_PENERIMA = 1284;
