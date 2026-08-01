import type { DetailLomba, KodeLomba, Lomba } from '@/types/landing';

/**
 * 17 cabang resmi PORSIMAPTAR XXVI.
 *
 * DATA SEMENTARA: angka `terisi`/`kapasitas` masih contoh sampai panitia
 * mengonfirmasi. TODO(api-contract): kuota real-time harus dari endpoint
 * cabang lomba — client tidak boleh menghitung ulang eligibility/kuota.
 */
export const DAFTAR_LOMBA: readonly Lomba[] = [
  { kode: 'VOL-01', nama: 'Voli', kategori: 'Olahraga · beregu', tim: 'Tim', terisi: 24, kapasitas: 24, icon: 'voli' },
  { kode: 'SPK-02', nama: 'Sepak Bola', kategori: 'Olahraga · beregu', tim: 'Tim', terisi: 18, kapasitas: 24, icon: 'futsal' },
  { kode: 'BDM-03', nama: 'Badminton', kategori: 'Olahraga · perorangan', tim: 'Individu', terisi: 44, kapasitas: 64, icon: 'badminton' },
  { kode: 'BKT-04', nama: 'Basket', kategori: 'Olahraga · beregu', tim: 'Tim', terisi: 22, kapasitas: 24, icon: 'basket' },
  { kode: 'TNS-05', nama: 'Tenis', kategori: 'Olahraga · perorangan', tim: 'Individu', terisi: 26, kapasitas: 48, icon: 'tenis' },
  { kode: 'ATL-06', nama: 'Atletik', kategori: 'Olahraga · perorangan', tim: 'Individu', terisi: 61, kapasitas: 120, icon: 'atletik' },
  { kode: 'ESP-07', nama: 'E-Sport', kategori: 'Olahraga · beregu', tim: 'Tim', terisi: 30, kapasitas: 32, icon: 'esport' },
  { kode: 'RNG-08', nama: 'Renang', kategori: 'Olahraga · perorangan', tim: 'Individu', terisi: 34, kapasitas: 60, icon: 'renang' },
  { kode: 'BND-09', nama: 'Band', kategori: 'Seni · panggung', tim: 'Tim', terisi: 9, kapasitas: 20, icon: 'akustik' },
  { kode: 'TAR-10', nama: 'Tari Kontemporer', kategori: 'Seni · panggung', tim: 'Tim', terisi: 12, kapasitas: 18, icon: 'tari' },
  { kode: 'FTG-11', nama: 'Fotografi', kategori: 'Seni · karya', tim: 'Individu', terisi: 38, kapasitas: 60, icon: 'fotografi' },
  { kode: 'FLM-12', nama: 'Film Pendek', kategori: 'Seni · karya', tim: 'Tim', terisi: 11, kapasitas: 20, icon: 'film' },
  { kode: 'LKB-13', nama: 'LKBB', kategori: 'Seni · panggung', tim: 'Tim', terisi: 14, kapasitas: 16, icon: 'lkbb' },
  { kode: 'ESY-14', nama: 'Essay', kategori: 'Akademik · perorangan', tim: 'Individu', terisi: 40, kapasitas: 80, icon: 'essay' },
  { kode: 'ING-15', nama: 'Bahasa Inggris', kategori: 'Akademik · perorangan', tim: 'Individu', terisi: 33, kapasitas: 60, icon: 'inggris' },
  { kode: 'CDC-16', nama: 'Cerdas Cermat', kategori: 'Akademik · beregu', tim: 'Tim', terisi: 16, kapasitas: 24, icon: 'cerdascermat' },
  { kode: 'CYB-17', nama: 'Cyber Security', kategori: 'Akademik · beregu', tim: 'Tim', terisi: 12, kapasitas: 20, icon: 'cyber' },
];

/**
 * Detail teknis per cabang. DATA SEMENTARA — juknis resmi belum diserahkan panitia.
 * Ganti isi objek ini saja; markup modal tidak perlu disentuh.
 */
export const DETAIL_LOMBA: Readonly<Record<KodeLomba, DetailLomba>> = {
  'VOL-01': {
    ringkasan:
      'Voli campuran dimainkan enam lawan enam dengan minimal dua pemain putri di lapangan sepanjang pertandingan. Format ini dipilih supaya kontingen kecil tetap bisa turun.',
    inti: '6 pemain',
    cadangan: '4 pemain',
    official: '2 orang',
    perInstitusi: '1 tim',
    sistem: 'Grup lalu gugur, best of three',
    jadwal: '27–29 Oktober 2026',
    venue: 'GOR Biru',
  },
  'SPK-02': {
    ringkasan:
      'Sepak bola sebelas lawan sebelas di lapangan penuh, dua babak 35 menit. Cabang dengan penonton terbanyak tiap tahun.',
    inti: '11 pemain',
    cadangan: '7 pemain',
    official: '3 orang',
    perInstitusi: '1 tim',
    sistem: 'Grup lalu gugur',
    jadwal: '26–29 Oktober 2026',
    venue: 'Stadion Taruna',
  },
  'BDM-03': {
    ringkasan: 'Badminton dipertandingkan dalam nomor tunggal dan ganda, memakai sistem rally point 21 poin.',
    perInstitusi: '4 peserta',
    sistem: 'Gugur tunggal, best of three game',
    jadwal: '27–29 Oktober 2026',
    venue: 'GOR Badminton',
  },
  'BKT-04': {
    ringkasan:
      'Basket lima lawan lima, empat babak sepuluh menit dengan waktu bersih. Wajib membawa dua set jersey berbeda warna.',
    inti: '5 pemain',
    cadangan: '7 pemain',
    official: '2 orang',
    perInstitusi: '1 tim',
    sistem: 'Grup lalu gugur',
    jadwal: '27–29 Oktober 2026',
    venue: 'GOR Biru',
  },
  'TNS-05': {
    ringkasan: 'Tenis nomor tunggal putra dan putri di lapangan outdoor. Bola disediakan panitia, raket bawa sendiri.',
    perInstitusi: '3 peserta',
    sistem: 'Gugur tunggal, satu set 6 game',
    jadwal: '27–28 Oktober 2026',
    venue: 'Lap. Tenis',
  },
  'ATL-06': {
    ringkasan:
      'Atletik mencakup nomor lari 100 m, 400 m, dan estafet 4×100 m. Satu peserta boleh mengambil maksimal dua nomor.',
    perInstitusi: '8 peserta',
    sistem: 'Babak kualifikasi lalu final',
    jadwal: '28–29 Oktober 2026',
    venue: 'Stadion Taruna',
  },
  'ESP-07': {
    ringkasan:
      'E-Sport mempertandingkan satu judul MOBA lima lawan lima. Perangkat dan jaringan disediakan panitia.',
    inti: '5 pemain',
    cadangan: '1 pemain',
    official: '1 orang',
    perInstitusi: '1 tim',
    sistem: 'Double elimination',
    jadwal: '26–28 Oktober 2026',
    venue: 'Gedung Serbaguna',
  },
  'RNG-08': {
    ringkasan: 'Renang nomor gaya bebas 50 m dan gaya dada 50 m, ditambah estafet campuran antar kontingen.',
    perInstitusi: '6 peserta',
    sistem: 'Seri waktu, tanpa babak final',
    jadwal: '27–28 Oktober 2026',
    venue: 'Kolam Renang',
  },
  'BND-09': {
    ringkasan:
      'Band membawakan satu lagu wajib bertema kebangsaan dan satu lagu pilihan. Durasi total maksimal 12 menit.',
    inti: '4–6 personel',
    cadangan: '1 personel',
    official: '1 orang',
    perInstitusi: '1 tim',
    sistem: 'Penilaian juri: harmoni, teknik, penampilan',
    jadwal: '28 Oktober 2026',
    venue: 'Gedung Serbaguna',
  },
  'TAR-10': {
    ringkasan: 'Tari kontemporer dengan tema wajib "Cakrawala". Boleh memakai musik rekaman, durasi 7–10 menit.',
    inti: '3–7 penari',
    cadangan: '1 penari',
    official: '1 orang',
    perInstitusi: '1 tim',
    sistem: 'Penilaian juri: koreografi, kekompakan, tema',
    jadwal: '28 Oktober 2026',
    venue: 'Gedung Serbaguna',
  },
  'FTG-11': {
    ringkasan:
      'Fotografi jurnalistik memotret jalannya PORSIMAPTAR. Karya dikumpulkan tiap hari, maksimal lima frame per peserta.',
    perInstitusi: '3 peserta',
    sistem: 'Penilaian juri: nilai berita, komposisi, caption',
    jadwal: '26–29 Oktober 2026',
    venue: 'Seluruh venue',
  },
  'FLM-12': {
    ringkasan:
      'Film pendek berdurasi 3–7 menit, diproduksi selama rangkaian acara berlangsung. Tema mengikuti pengumuman di technical meeting.',
    inti: '3–5 kru',
    cadangan: '1 kru',
    official: '1 orang',
    perInstitusi: '1 tim',
    sistem: 'Penilaian juri: naskah, sinematografi, pesan',
    jadwal: '26–29 Oktober 2026',
    venue: 'Gd. Cendekia',
  },
  'LKB-13': {
    ringkasan:
      'LKBB menampilkan variasi dan formasi baris-berbaris dengan komandan pasukan. Waktu tampil maksimal 10 menit di dalam kotak ukuran 12×12 meter.',
    inti: '13 orang',
    cadangan: '2 orang',
    official: '2 orang',
    perInstitusi: '1 tim',
    sistem: 'Penilaian juri: ketepatan aba-aba, formasi, kekompakan',
    jadwal: '29 Oktober 2026',
    venue: 'Lapangan Bhayangkara',
  },
  'ESY-14': {
    ringkasan:
      'Essay ditulis di tempat selama 150 menit dengan tema yang dibuka saat lomba dimulai. Panjang 800–1.200 kata.',
    perInstitusi: '5 peserta',
    sistem: 'Penilaian juri: argumen, struktur, orisinalitas',
    jadwal: '27 Oktober 2026',
    venue: 'Gd. Cendekia',
  },
  'ING-15': {
    ringkasan: 'Bahasa Inggris terdiri dari speech babak penyisihan dan impromptu speaking di final.',
    perInstitusi: '4 peserta',
    sistem: 'Penyisihan lalu final enam besar',
    jadwal: '27–28 Oktober 2026',
    venue: 'Gd. Cendekia',
  },
  'CDC-16': {
    ringkasan:
      'Cerdas cermat beregu tiga orang, materi wawasan kebangsaan, hukum dasar, dan pengetahuan umum.',
    inti: '3 orang',
    cadangan: '1 orang',
    official: '1 orang',
    perInstitusi: '2 tim',
    sistem: 'Babak penyisihan, semifinal, final',
    jadwal: '28 Oktober 2026',
    venue: 'Gd. Cendekia',
  },
  'CYB-17': {
    ringkasan:
      'Cyber Security memakai format capture the flag selama enam jam, kategori web, forensik, dan kriptografi dasar.',
    inti: '3 orang',
    cadangan: '0 orang',
    official: '1 orang',
    perInstitusi: '2 tim',
    sistem: 'Capture the flag, skor kumulatif',
    jadwal: '29 Oktober 2026',
    venue: 'Gd. Cendekia',
  },
};

/** Ilustrasi maskot per cabang → `/uploads/m/<slug>.webp`. */
export const MASKOT_LOMBA: Readonly<Record<KodeLomba, string>> = {
  'VOL-01': 'voli',
  'SPK-02': 'sepakbola',
  'BDM-03': 'badminton',
  'BKT-04': 'basket',
  'TNS-05': 'tenis',
  'ATL-06': 'atletik',
  'ESP-07': 'esport',
  'RNG-08': 'renang',
  'BND-09': 'akustik',
  'TAR-10': 'tari',
  'FTG-11': 'fotografi',
  'FLM-12': 'film',
  'LKB-13': 'lkbb',
  'ESY-14': 'essay',
  'ING-15': 'inggris',
  'CDC-16': 'cerdascermat',
  'CYB-17': 'cyber',
};

/**
 * Rasio lebar : tinggi bidang gambar tiap ikon di `/uploads/icon_cabor/`.
 * Rentangnya lebar sekali — perenang 3.61 sampai pebasket 0.36 — sehingga
 * `background-size: contain` menyamakan sisi terpanjang saja dan ikon jangkung
 * terbaca jauh lebih kecil. Modal memakai angka ini untuk menyetarakan luasnya.
 * Wajib ikut diperbarui kalau berkas ikonnya diganti.
 */
export const RASIO_IKON: Readonly<Record<string, number>> = {
  akustik: 0.74,
  atletik: 0.86,
  badminton: 0.447,
  basket: 0.36,
  cerdascermat: 0.807,
  cyber: 0.987,
  esport: 0.827,
  essay: 0.853,
  film: 0.387,
  fotografi: 0.913,
  futsal: 1.207,
  inggris: 0.413,
  lkbb: 0.773,
  renang: 3.614,
  silat: 1.187,
  tari: 0.987,
  tenis: 0.953,
  voli: 0.673,
};

/** DATA SEMENTARA: syarat, dokumen, dan PIC masih seragam untuk semua cabang. */
export const SYARAT_UMUM: readonly string[] = [
  'Mahasiswa aktif D3–S1, pelajar SMA/sederajat, atau taruna Akpol',
  'Berusia maksimal 23 tahun pada 26 Oktober 2026',
  'Terdaftar dalam satu kontingen institusi, maksimal dua cabang',
  'Menyertakan surat keterangan sehat dari fasilitas kesehatan',
];

export const DOKUMEN_UMUM: readonly string[] = [
  'KTM / kartu pelajar',
  'Surat keterangan sehat',
  'Surat rekomendasi institusi',
  'Foto 3×4 latar merah',
];

/** TODO(api-contract): placeholder, samakan gayanya dengan `KONTAK` di konten.ts. */
export const PIC_DEFAULT = { nama: 'Nama Koordinator Pendaftaran', kontak: '+62 8xx-xxxx-xxxx' } as const;
