/**
 * Isi halaman Bantuan (desain "Batch C — Bantuan").
 *
 * TODO(api-contract):
 *   GET  /api/v1/help/contacts   -> PIC per cabang, hanya kanal resmi
 *   GET  /api/v1/help/faq        -> FAQ + kategori
 *   POST /api/v1/me/support      -> laporan masalah, mengembalikan nomor tiket
 * Nomor referensi peserta datang dari sesi, bukan diketik peserta.
 */

export interface KontakPic {
  readonly id: string;
  readonly cabang: string;
  readonly nama: string;
  readonly email: string;
  readonly catatan?: string;
}

export interface Faq {
  readonly id: string;
  readonly kategori: 'Pendaftaran' | 'Dokumen' | 'Tim' | 'Jadwal & check-in';
  readonly tanya: string;
  readonly jawab: string;
}

export const NOMOR_REFERENSI = 'PSM-2026-4821';

export const JAM_LAYANAN = 'Jam layanan 08.00–16.00 WIB, balasan maksimal 1×24 jam pada hari kerja.';

export const PIC_CABANG: readonly KontakPic[] = [
  {
    id: 'futsal',
    cabang: 'Futsal Putra & Putri',
    nama: 'Rian Kusuma',
    email: 'futsal@porsimaptar.id',
  },
  {
    id: 'basket',
    cabang: 'Basket Putra & Putri',
    nama: 'Andi Prasetya',
    email: 'basket@porsimaptar.id',
  },
  {
    id: 'seni',
    cabang: 'Fotografi & cabang seni',
    nama: 'Sari Wulandari',
    email: 'seni@porsimaptar.id',
  },
  {
    id: 'akademik',
    cabang: 'Cerdas Cermat & cabang akademik',
    nama: 'Rizal Hakim',
    email: 'akademik@porsimaptar.id',
  },
  {
    id: 'sekretariat',
    cabang: 'Sekretariat umum',
    nama: 'Gedung Sekretariat PORSIMAPTAR',
    email: 'sekretariat@porsimaptar.id',
    catatan: 'Datang langsung 08.00–16.00 · (024) 7460 118',
  },
];

export const FAQ: readonly Faq[] = [
  {
    id: 'f1',
    kategori: 'Dokumen',
    tanya: 'Dokumen saya ditolak, apa yang harus saya lakukan?',
    jawab:
      'Buka halaman Dokumen dan baca catatan panitia di kartu dokumen tersebut — catatannya selalu menyebut alasan spesifik dan contoh berkas yang biasanya diterima. Perbaiki sesuai catatan, lalu unggah ulang. Versi lama tetap tersimpan di riwayat versi, jadi kamu tidak kehilangan bukti unggahan sebelumnya.',
  },
  {
    id: 'f2',
    kategori: 'Dokumen',
    tanya: 'Berapa lama pemeriksaan dokumen?',
    jawab:
      'Maksimal 1×24 jam kerja sejak berkas diunggah. Selama status “sedang diperiksa”, kamu tidak perlu mengunggah ulang — unggahan baru akan menggeser posisimu ke belakang antrean.',
  },
  {
    id: 'f3',
    kategori: 'Tim',
    tanya: 'Kenapa anggota yang saya undang belum terhitung?',
    jawab:
      'Undangan yang masih menunggu jawaban tidak pernah dihitung sebagai anggota. Orang yang kamu undang harus menerima undangan dari akunnya sendiri lebih dulu. Ini disengaja: keanggotaan tim tidak boleh ditentukan sepihak oleh ketua.',
  },
  {
    id: 'f4',
    kategori: 'Tim',
    tanya: 'Bisakah saya ikut dua tim di cabang yang sama?',
    jawab:
      'Tidak. Satu peserta hanya boleh berada di satu tim pada lomba yang sama. Kalau kamu sudah bergabung di satu tim, undangan lain untuk cabang itu otomatis ditandai konflik dan tidak bisa diterima. Untuk pindah, keluar dari tim sebelumnya lebih dulu selama roster belum dikunci.',
  },
  {
    id: 'f5',
    kategori: 'Pendaftaran',
    tanya: 'Kenapa NIK saya diminta, dan siapa yang bisa melihatnya?',
    jawab:
      'NIK dipakai sekali untuk memastikan satu orang tidak terdaftar dua kali di cabang yang sama dan untuk mencocokkan identitas saat check-in. Setelah tersimpan, NIK ditampilkan termasking bahkan kepadamu sendiri; verifikator panitia membuka versi penuh hanya saat memeriksa dokumenmu, dan setiap pembukaan tercatat.',
  },
  {
    id: 'f6',
    kategori: 'Pendaftaran',
    tanya: 'Saya salah mengisi tanggal lahir, bagaimana memperbaikinya?',
    jawab:
      'Selama profil belum dikirim, ubah langsung di tahap Identitas — kelayakan usia dihitung ulang oleh server begitu tanggalnya berubah. Kalau profil sudah dikirim dan sedang diverifikasi, ajukan perbaikan lewat formulir di halaman ini dengan menyebut nomor referensimu.',
  },
  {
    id: 'f7',
    kategori: 'Jadwal & check-in',
    tanya: 'Dua jadwal saya bertabrakan, apa yang terjadi?',
    jawab:
      'Kedua agenda tetap ditampilkan di halaman Jadwal Saya dan diberi penanda konflik — kami tidak menyembunyikan salah satunya, karena hanya panitia yang boleh memindahkan jadwal. Laporkan satu kali lewat formulir di halaman ini; panitia melihat kedua agenda dalam satu laporan.',
  },
  {
    id: 'f8',
    kategori: 'Jadwal & check-in',
    tanya: 'QR saya gagal dibaca petugas, apakah saya gugur?',
    jawab:
      'Tidak. Petugas bisa mencari namamu manual di daftar check-in, dan kamu tidak perlu mengulang pendaftaran. Check-in dibuka 90 menit sebelum pertandingan dan ditutup 20 menit sebelum mulai, jadi datang lebih awal memberi ruang kalau ada kendala teknis.',
  },
];

export const KATEGORI_FAQ = ['Semua', 'Pendaftaran', 'Dokumen', 'Tim', 'Jadwal & check-in'] as const;

export const PENDAFTARAN_TERKAIT = [
  'Futsal Putra · tim Garuda Muda',
  'Fotografi · perorangan',
  'Basket Putra · tim Garuda Muda B',
  'Tidak terkait pendaftaran tertentu',
] as const;

export const JENIS_MASALAH = [
  { nilai: 'jadwal', label: 'Jadwal bertabrakan antar cabang' },
  { nilai: 'dokumen', label: 'Dokumen & verifikasi' },
  { nilai: 'tim', label: 'Tim & undangan' },
  { nilai: 'akun', label: 'Akun & data pribadi' },
  { nilai: 'checkin', label: 'Check-in & QR' },
  { nilai: 'lain', label: 'Lain-lain' },
] as const;
