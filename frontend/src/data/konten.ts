import type {
  Acara,
  Faq,
  KontakPanitia,
  LangkahDaftar,
  Sponsor,
  Statistik,
  TahapLinimasa,
} from '@/types/landing';

/** Kuota total peserta belum diumumkan resmi — strip ini sengaja tanpa angka kuota. */
export const STATISTIK: readonly Statistik[] = [
  { nilai: 17, label: 'Cabang lomba' },
  { nilai: 'Terbatas', label: 'Kuota per cabang' },
  { nilai: 8, label: 'Venue pertandingan' },
  { nilai: 4, label: 'Hari pertandingan' },
];

export const RANGKAIAN_ACARA: readonly Acara[] = [
  {
    nama: 'Color Run',
    tanggal: '26 Oktober 2026 · 07.00–11.00',
    tempat: 'Komplek Akpol',
    detail: 'Lari santai lima kilometer dengan taburan bubuk warna di setiap pos. Terbuka untuk peserta dan pendukung.',
  },
  {
    nama: 'Upacara Pembukaan',
    tanggal: '26 Oktober 2026 · 15.00–17.00',
    tempat: 'Stadion Taruna',
    detail: 'Defile kontingen, pengibaran bendera PORSIMAPTAR, dan pembacaan sumpah atlet.',
  },
  {
    nama: 'Jelajah Rasa',
    tanggal: '26–29 Oktober 2026',
    tempat: 'Lapangan parkir Masjid Asy-Syuhada',
    detail: 'Festival kuliner nusantara yang buka tiap hari pertandingan, diisi tenant daerah asal kontingen.',
  },
  {
    nama: 'Harmoni Cakrawala',
    tanggal: '30 Oktober 2026 · 15.00–22.00',
    tempat: 'Lapangan Bhayangkara',
    detail: 'Malam penutupan: penampilan seni gabungan, pengumuman pemenang, dan penyerahan piala bergilir.',
  },
];

export const LINIMASA: readonly TahapLinimasa[] = [
  {
    no: '01',
    tanggal: '21 Sep – 5 Okt',
    judul: 'Pendaftaran',
    detail: 'Buat akun, pilih cabang, dan kunci kuota. Kuota berkurang secara real-time.',
    sunTop: '19px',
    sunSize: '15px',
    sunColor: 'var(--color-blue-500)',
    sunGlow: 'rgba(42,85,168,0.7)',
  },
  {
    no: '02',
    tanggal: '6 – 7 Okt',
    judul: 'Daftar ulang & technical meeting',
    detail:
      'Daftar ulang 6 Oktober, dilanjutkan technical meeting 7 Oktober: pengundian bagan dan penjelasan regulasi.',
    sunTop: '17px',
    sunSize: '19px',
    sunColor: 'var(--color-red-500)',
    sunGlow: 'rgba(211,32,39,0.7)',
  },
  {
    no: '03',
    tanggal: '26 – 29 Okt',
    judul: 'Perlombaan',
    detail: 'Empat hari pertandingan di delapan venue. Scan QR peserta, cek jadwal harian dan skor dari HP.',
    sunTop: '15px',
    sunSize: '23px',
    sunColor: 'var(--color-gold-500)',
    sunGlow: 'rgba(245,166,35,0.65)',
  },
  {
    no: '04',
    tanggal: '30 Okt',
    judul: 'Harmoni Cakrawala',
    detail: 'Malam penutupan di Lapangan Bhayangkara: penampilan seni dan pengumuman pemenang.',
    sunTop: '12px',
    sunSize: '29px',
    sunColor: 'var(--color-gold-300)',
    sunGlow: 'rgba(255,211,122,0.75)',
  },
];

export const LANGKAH_DAFTAR: readonly LangkahDaftar[] = [
  {
    no: 'LANGKAH 1',
    judul: 'Buat akun',
    detail: 'Cukup nama, email aktif, dan nomor WhatsApp. Kode verifikasi dikirim langsung ke email.',
  },
  {
    no: 'LANGKAH 2',
    judul: 'Lengkapi profil & dokumen',
    detail:
      'Unggah KTM atau kartu pelajar, surat sehat, dan surat rekomendasi institusi. Format JPG atau PDF, maksimal 2 MB.',
  },
  {
    no: 'LANGKAH 3',
    judul: 'Pilih lomba',
    detail: 'Maksimal dua cabang. Untuk lomba beregu, undang anggota tim lewat kode tim yang muncul di dashboard.',
  },
  {
    no: 'LANGKAH 4',
    judul: 'Dapat QR peserta',
    detail: 'Setelah dokumen disetujui, QR peserta terbit otomatis. Simpan di HP untuk absensi tiap pertandingan.',
  },
];

/**
 * TODO(api-contract): masih placeholder. Nama sponsor sebenarnya baru dipasang
 * setelah kontrak sponsorship final; `level` yang menentukan ukuran logo di rail.
 * Urut dari level tertinggi supaya rail terbaca berjenjang.
 */
export const SPONSORS: readonly Sponsor[] = [
  { nama: 'Sponsor 1', level: 'gold' },
  { nama: 'Sponsor 2', level: 'gold' },
  { nama: 'Sponsor 3', level: 'silver' },
  { nama: 'Sponsor 4', level: 'silver' },
  { nama: 'Sponsor 5', level: 'silver' },
  { nama: 'Sponsor 6', level: 'bronze' },
  { nama: 'Sponsor 7', level: 'bronze' },
  { nama: 'Sponsor 8', level: 'bronze' },
  { nama: 'Sponsor 9', level: 'bronze' },
];

export const FAQS: readonly Faq[] = [
  {
    q: 'Siapa saja yang boleh ikut?',
    a: 'Mahasiswa aktif D3–S1, pelajar SMA/sederajat kelas X–XII, dan taruna Akpol. Bukti status berupa KTM, kartu pelajar, atau surat keterangan aktif wajib diunggah saat verifikasi.',
  },
  {
    q: 'Berapa lomba yang boleh saya ikuti?',
    a: 'Maksimal dua cabang, dan keduanya tidak boleh dijadwalkan pada hari yang sama. Sistem akan menolak pilihan kedua jika jadwalnya bentrok dan menunjukkan cabang penggantinya.',
  },
  {
    q: 'Apakah ada biaya pendaftaran?',
    a: 'Tidak ada. Seluruh cabang gratis. Akomodasi dan transportasi ditanggung masing-masing kontingen.',
  },
  {
    q: 'Dokumen saya ditolak, apa yang harus dilakukan?',
    a: 'Alasan penolakan muncul di dashboard beserta bagian yang bermasalah — biasanya foto buram atau masa berlaku kartu habis. Unggah ulang file yang diminta, verifikasi diproses lagi dalam 1×24 jam.',
  },
  {
    q: 'Bagaimana kalau tim saya kurang anggota?',
    a: 'Simpan pendaftaran sebagai draf. Tim bisa dilengkapi sampai H-7 technical meeting; setelah itu kuota dilepas ke tim daftar tunggu.',
  },
];

/**
 * TODO(api-contract): masih placeholder. Sengaja tidak memakai nama, nomor, dan
 * domain yang terlihat asli supaya prototipe tidak dikira memuat kontak beneran —
 * `example.com` adalah domain contoh yang memang dicadangkan (RFC 2606).
 * Nomor telepon masih bertopeng, jadi belum bisa jadi tautan `tel:`
 * (lihat HeaderMenu.tsx); pasang lagi begitu nomor asli tersedia.
 */
export const KONTAK: readonly KontakPanitia[] = [
  {
    peran: 'Ketua panitia',
    nama: 'Nama Ketua Panitia',
    telp: '+62 8xx-xxxx-xxxx',
    email: 'ketua@example.com',
  },
  {
    peran: 'Pendaftaran & verifikasi',
    nama: 'Nama Koordinator Pendaftaran',
    telp: '+62 8xx-xxxx-xxxx',
    email: 'daftar@example.com',
  },
  {
    peran: 'Media & sponsor',
    nama: 'Nama Koordinator Media',
    telp: '+62 8xx-xxxx-xxxx',
    email: 'media@example.com',
  },
];

export const ALAMAT_PANITIA = 'Akademi Kepolisian, Jl. Sultan Agung, Semarang 50232';
