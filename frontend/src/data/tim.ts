import type { LabelStatusUndangan, StatusTim, StatusUndangan, Tim, Undangan } from '@/types/tim';

/**
 * Data tiruan modul Tim & undangan — isinya mengikuti desain "Batch B — Tim Saya"
 * di Claude Design, dengan nama tim, anggota, dan cabang disamakan dengan
 * `data/lomba-detail.ts` supaya satu peserta tidak punya dua cerita berbeda
 * di dua layar (AC-FE-07).
 *
 * Garis waktu yang dipakai seluruh modul peserta:
 *   hari ini 31 Juli 2026 · roster dikunci 5 Agustus 2026, 23.59
 *   technical meeting 29 Agustus 2026 · pertandingan 2–5 September 2026
 *
 * TODO(api-contract): ganti modul ini dengan fetch ke endpoint di `types/tim.ts`.
 */

export const TIM_SAYA: readonly Tim[] = [
  {
    id: 'garuda-muda',
    nama: 'Garuda Muda',
    inisial: 'GM',
    lomba: 'Futsal Putra',
    lombaId: 'futsal-putra',
    institusi: 'Politeknik Negeri Semarang',
    ketua: 'Bagas Pratama',
    peranSaya: 'Ketua',
    status: 'belum-disubmit',
    dibuat: '22 Juli 2026',

    bergabung: 4,
    menunggu: 1,
    minimal: 5,
    maksimal: 8,
    ringkasan:
      '4 dari 5 anggota minimum sudah bergabung. 1 undangan masih menunggu jawaban dan belum dihitung sebagai anggota, jadi kamu butuh 1 penerimaan lagi sebelum 5 Agustus 2026.',

    terkunci: false,
    kunciPada: '5 Agu 2026, 23.59',
    sisaKunci: 'sisa 5 hari',

    anggota: [
      {
        id: 'gm1',
        nama: 'Bagas Pratama',
        inisial: 'BP',
        identitas: 'PSM-••••-4821 · kamu',
        ketua: true,
        kamu: true,
        keanggotaan: 'bergabung',
        profil: { label: 'Lengkap', nada: 'ok' },
        dokumen: { label: '3/3 terverifikasi', nada: 'ok' },
        syarat: { label: 'Terpenuhi', nada: 'ok' },
      },
      {
        id: 'gm2',
        nama: 'Rizky Ananda',
        inisial: 'RA',
        identitas: 'PSM-••••-2210',
        ketua: false,
        kamu: false,
        keanggotaan: 'bergabung',
        profil: { label: 'Lengkap', nada: 'ok' },
        dokumen: { label: '3/3 terverifikasi', nada: 'ok' },
        syarat: { label: 'Terpenuhi', nada: 'ok' },
      },
      {
        id: 'gm3',
        nama: 'Dimas Saputra',
        inisial: 'DS',
        identitas: 'PSM-••••-3390',
        ketua: false,
        kamu: false,
        keanggotaan: 'bergabung',
        profil: { label: 'Kurang 2 data', nada: 'warn' },
        dokumen: { label: '1 dokumen ditolak', nada: 'danger' },
        syarat: { label: 'Belum terpenuhi', nada: 'warn' },
        catatan:
          'Surat keterangan sehat Dimas ditolak panitia pada 29 Juli 2026, 10.05 karena tanggal terbit lebih dari 14 hari. Hanya Dimas yang bisa mengunggah ulang dari akunnya — kamu bisa mengingatkan, tetapi tidak bisa memperbaiki untuknya.',
      },
      {
        id: 'gm4',
        nama: 'Fajar Nugroho',
        inisial: 'FN',
        identitas: 'PSM-••••-5502',
        ketua: false,
        kamu: false,
        keanggotaan: 'bergabung',
        profil: { label: 'Lengkap', nada: 'ok' },
        dokumen: { label: '3/3 terverifikasi', nada: 'ok' },
        syarat: { label: 'Terpenuhi', nada: 'ok' },
      },
      {
        id: 'gm5',
        nama: 'Yoga Hermawan',
        inisial: 'YH',
        identitas: 'yoga.h@student.polines.ac.id',
        ketua: false,
        kamu: false,
        keanggotaan: 'menunggu',
        berlakuSampai: 'Berlaku sampai 2 Agu, 14.02',
        cooldown: '42.10',
      },
    ],
    catatanRoster:
      'Masih ada 3 slot terbuka sampai batas maksimal 8 orang. Undang lebih dari kebutuhan minimum supaya tim tetap aman kalau ada yang menolak.',

    syarat: [
      {
        id: 's1',
        judul: 'Identitas tim lengkap',
        keterangan: 'Nama tim, institusi, dan logo sudah terisi.',
        keadaan: 'ok',
      },
      {
        id: 's2',
        judul: 'Ketua menyetujui perannya',
        keterangan: 'Disetujui 22 Juli 2026, 10.14.',
        keadaan: 'ok',
      },
      {
        id: 's3',
        judul: 'Jumlah anggota minimum',
        keterangan:
          '4 dari 5 anggota bergabung. 1 undangan yang menunggu tidak dihitung — butuh 1 penerimaan lagi.',
        keadaan: 'warn',
        aksiLabel: 'Undang anggota',
        aksiHref: '/tim/garuda-muda?undang=1',
      },
      {
        id: 's4',
        judul: 'Dokumen seluruh anggota diterima',
        keterangan: '1 dokumen Dimas Saputra ditolak. Hanya Dimas yang bisa mengunggah ulang dari akunnya.',
        keadaan: 'warn',
      },
      {
        id: 's5',
        judul: 'Profil seluruh anggota lengkap',
        keterangan: 'Dimas Saputra kurang 2 data: nomor darurat dan ukuran jersey.',
        keadaan: 'belum',
      },
    ],

    riwayat: [
      {
        id: 'r1',
        teks: 'Undangan dikirim ke Yoga Hermawan',
        meta: 'Bagas Pratama (ketua) · 30 Juli 2026, 14.02',
        nada: 'info',
      },
      {
        id: 'r2',
        teks: 'Dokumen Dimas Saputra ditolak: surat keterangan sehat',
        meta: 'Verifikator panitia · 29 Juli 2026, 10.05 · alasan: tanggal terbit lebih dari 14 hari',
        nada: 'danger',
      },
      {
        id: 'r3',
        teks: 'Fajar Nugroho menerima undangan dan bergabung',
        meta: 'Fajar Nugroho · 28 Juli 2026, 21.18',
        nada: 'ok',
      },
      {
        id: 'r4',
        teks: 'Arif Fauzan menolak undangan',
        meta: 'Arif Fauzan · 26 Juli 2026, 07.55 · slot kembali terbuka',
        nada: 'warn',
      },
      {
        id: 'r5',
        teks: 'Rizky Ananda menerima undangan dan bergabung',
        meta: 'Rizky Ananda · 24 Juli 2026, 19.12',
        nada: 'ok',
      },
      {
        id: 'r6',
        teks: 'Tim dibuat dan Bagas Pratama menjadi ketua sekaligus anggota pertama',
        meta: 'Bagas Pratama · 22 Juli 2026, 10.14',
        nada: 'netral',
      },
    ],

    agenda: [
      {
        id: 'ag1',
        tanggal: '29',
        bulan: 'AGU',
        nama: 'Technical meeting',
        detail: '13.00 · Aula Serbaguna Akpol',
      },
      {
        id: 'ag2',
        tanggal: '02',
        bulan: 'SEP',
        nama: 'Penyisihan Grup B',
        detail: '09.30 · GOR Manunggal Jati',
      },
    ],
  },

  {
    id: 'garuda-muda-b',
    nama: 'Garuda Muda B',
    inisial: 'GB',
    lomba: 'Basket Putra',
    lombaId: 'basket-putra',
    institusi: 'Politeknik Negeri Semarang',
    ketua: 'Rangga Mahendra',
    peranSaya: 'Anggota',
    status: 'terverifikasi',
    dibuat: '20 Juli 2026',

    bergabung: 8,
    menunggu: 1,
    minimal: 5,
    maksimal: 12,
    ringkasan:
      'Roster sudah terpenuhi: 8 dari minimal 5 anggota bergabung dan daftar dikunci sejak tim disubmit. 1 undangan yang belum dijawab ikut ditutup dan tidak pernah dihitung sebagai anggota.',

    terkunci: true,
    kunciPada: '27 Juli 2026, 20.41',
    sisaKunci: 'dikunci sejak tim disubmit',

    anggota: [
      {
        id: 'gb1',
        nama: 'Rangga Mahendra',
        inisial: 'RM',
        identitas: 'PSM-••••-1180',
        ketua: true,
        kamu: false,
        keanggotaan: 'bergabung',
        dokumen: { label: 'Lengkap', nada: 'ok' },
      },
      {
        id: 'gb2',
        nama: 'Bagas Pratama',
        inisial: 'BP',
        identitas: 'PSM-••••-4821 · kamu',
        ketua: false,
        kamu: true,
        keanggotaan: 'bergabung',
        dokumen: { label: '1 dokumen perlu diperbaiki', nada: 'warn' },
      },
      {
        id: 'gb3',
        nama: '6 anggota lain',
        inisial: '+6',
        identitas: 'Seluruhnya bergabung dan lengkap',
        ketua: false,
        kamu: false,
        keanggotaan: 'bergabung',
        dokumen: { label: 'Lengkap', nada: 'ok' },
      },
    ],

    tugasSaya: [
      {
        id: 't1',
        judul: 'Unggah ulang surat keterangan aktif kuliah',
        keterangan:
          'Ditolak 29 Juli 2026, 10.05 — scan terpotong di bagian tanda tangan dan stempel. Batas perbaikan 5 Agustus 2026.',
        cta: 'Unggah ulang',
        href: '/dokumen',
      },
      {
        id: 't2',
        judul: 'Konfirmasi kehadiran technical meeting',
        keterangan: '29 Agustus 2026, 13.00 · Aula Serbaguna Akpol. Konfirmasi sebelum 28 Agustus.',
        cta: 'Buka jadwal',
        href: '/jadwal-saya',
      },
    ],
    bergabungSejak: 'Bergabung sejak 24 Juli 2026',
    ceritaBergabung:
      'Kamu menerima undangan dari Rangga Mahendra pada 24 Juli 2026, 19.12. Karena tim sudah disubmit, kamu tidak bisa keluar sendiri — hubungi ketua atau panitia bila ada perubahan.',

    syarat: [
      {
        id: 'sb1',
        judul: 'Jumlah anggota minimum',
        keterangan: '8 dari minimal 5 anggota bergabung.',
        keadaan: 'ok',
      },
      {
        id: 'sb2',
        judul: 'Dokumen seluruh anggota diterima',
        keterangan: '1 dokumenmu masih perlu diperbaiki. Hanya kamu yang bisa mengunggah ulang.',
        keadaan: 'warn',
        aksiLabel: 'Buka Dokumen',
        aksiHref: '/dokumen',
      },
    ],

    riwayat: [
      {
        id: 'rb1',
        teks: 'Tim disubmit ke panitia',
        meta: 'Rangga Mahendra (ketua) · 27 Juli 2026, 20.41 · nomor referensi TIM-BP-2026-00417',
        nada: 'ok',
      },
      {
        id: 'rb2',
        teks: 'Bagas Pratama menerima undangan dan bergabung',
        meta: 'Bagas Pratama · 24 Juli 2026, 19.12',
        nada: 'ok',
      },
      {
        id: 'rb3',
        teks: 'Tim dibuat dan Rangga Mahendra menjadi ketua sekaligus anggota pertama',
        meta: 'Rangga Mahendra · 20 Juli 2026, 10.02',
        nada: 'netral',
      },
    ],

    agenda: [
      {
        id: 'agb1',
        tanggal: '29',
        bulan: 'AGU',
        nama: 'Technical meeting',
        detail: '13.00 · Aula Serbaguna Akpol',
      },
      {
        id: 'agb2',
        tanggal: '29',
        bulan: 'OKT',
        nama: 'Penyisihan Grup A',
        detail: '15.00 · GOR AKPOL',
      },
    ],

    bukti: {
      nomorReferensi: 'TIM-BP-2026-00417',
      waktu: '27 Juli 2026, 20.41 WIB',
      jumlahAnggota: 8,
    },
  },
];

export const UNDANGAN: readonly Undangan[] = [
  {
    id: 'u1',
    token: 'elang-timur',
    status: 'menunggu',
    tim: 'Elang Timur',
    inisial: 'ET',
    lomba: 'Voli Putra',
    institusi: 'Politeknik Negeri Semarang',
    ketua: 'Satria Wibowo',
    dikirim: '31 Jul 2026, 09.15',
    batasJawab: '3 Agu 2026, 09.15',
    sisa: 'sisa 2 hari 23 jam',
    rosterTim: '6 bergabung · butuh 8 minimum',
    jadwalCabang: '3–4 September 2026 · GOR AKPOL',
  },
  {
    id: 'u2',
    token: 'samudra-basket',
    status: 'konflik',
    tim: 'Samudra Basket',
    inisial: 'SB',
    lomba: 'Basket Putra',
    institusi: 'Politeknik Negeri Semarang',
    ketua: 'Yudha Nugraha',
    dikirim: '30 Jul 2026, 11.20',
    batasJawab: '2 Agu 2026, 11.20',
    sisa: 'sisa 1 hari 22 jam',
    rosterTim: '9 bergabung · maksimal 12',
    jadwalCabang: '29 Oktober 2026 · GOR AKPOL',
    timKonflik: 'Garuda Muda B',
    timKonflikId: 'garuda-muda-b',
  },
  {
    id: 'u3',
    token: 'garuda-muda-b',
    status: 'diterima',
    tim: 'Garuda Muda B',
    inisial: 'GB',
    lomba: 'Basket Putra',
    institusi: 'Politeknik Negeri Semarang',
    ketua: 'Rangga Mahendra',
    dikirim: '23 Jul 2026, 16.40',
    batasJawab: '26 Jul 2026, 16.40',
    sisa: '—',
    rosterTim: '8 bergabung · roster dikunci',
    jadwalCabang: '29 Oktober 2026 · GOR AKPOL',
    penutup: 'Diterima 24 Jul 2026, 19.12',
  },
  {
    id: 'u4',
    token: 'cakra-cendekia',
    status: 'diterima',
    tim: 'Cakra Cendekia',
    inisial: 'CC',
    lomba: 'Cerdas Cermat',
    institusi: 'Politeknik Negeri Semarang',
    ketua: 'Nadia Salsabila',
    dikirim: '1 Agu 2025, 08.00',
    batasJawab: '4 Agu 2025, 08.00',
    sisa: '—',
    rosterTim: '3 bergabung · kompetisi selesai',
    jadwalCabang: 'Selesai · 12 Oktober 2025',
    penutup: 'Diterima 2 Agu 2025, 09.30',
  },
  {
    id: 'u5',
    token: 'tim-bahari',
    status: 'ditolak',
    tim: 'Tim Bahari',
    inisial: 'TB',
    lomba: 'Voli Putra',
    institusi: 'Politeknik Negeri Semarang',
    ketua: 'Aditya Ramadhan',
    dikirim: '20 Jul 2026, 09.10',
    batasJawab: '23 Jul 2026, 09.10',
    sisa: '—',
    rosterTim: '7 bergabung',
    jadwalCabang: '3–4 September 2026 · GOR AKPOL',
    penutup: 'Kamu menolak 21 Jul 2026, 08.40',
  },
  {
    id: 'u6',
    token: 'garuda-perkasa',
    status: 'kedaluwarsa',
    tim: 'Garuda Perkasa',
    inisial: 'GP',
    lomba: 'Basket Putra',
    institusi: 'Politeknik Negeri Semarang',
    ketua: 'Wisnu Baskoro',
    dikirim: '16 Jul 2026, 12.00',
    batasJawab: '19 Jul 2026, 12.00',
    sisa: '—',
    rosterTim: '10 bergabung · roster dikunci',
    jadwalCabang: '29 Oktober 2026 · GOR AKPOL',
    penutup: 'Kedaluwarsa 19 Jul 2026, 12.00 tanpa jawaban',
  },
  {
    id: 'u7',
    token: 'elang-muda',
    status: 'dibatalkan',
    tim: 'Elang Muda',
    inisial: 'EM',
    lomba: 'Futsal Putra',
    institusi: 'Politeknik Negeri Semarang',
    ketua: 'Bayu Setiawan',
    dikirim: '17 Jul 2026, 10.05',
    batasJawab: '20 Jul 2026, 10.05',
    sisa: '—',
    rosterTim: '8 bergabung',
    jadwalCabang: '2–5 September 2026 · GOR Manunggal Jati',
    penutup: 'Dibatalkan ketua 18 Jul 2026, 16.30',
  },
];

/**
 * Arti tiap status undangan. Badge selalu ikon + teks, tidak pernah warna saja
 * (agents.md §7), dan status yang mengunci keputusan tidak pernah tampil
 * bersama tombol Terima/Tolak yang mati — tombolnya dihapus.
 */
export const LABEL_UNDANGAN: Record<StatusUndangan, LabelStatusUndangan> = {
  menunggu: {
    label: 'Menunggu jawabanmu',
    nada: 'warn',
    ikon: 'jam',
    arti: 'Undangan sudah terkirim, kamu belum menjawab, dan kamu belum dihitung sebagai anggota.',
    tindakan: 'Jawab dari akunmu sendiri. Ketua boleh mengirim ulang setelah cooldown atau membatalkan.',
  },
  diterima: {
    label: 'Diterima',
    nada: 'ok',
    ikon: 'centang',
    arti: 'Undangan sudah diterima dan kamu resmi terhitung sebagai anggota roster.',
    tindakan: 'Lengkapi profil dan dokumenmu sendiri; ketua memantau sampai tim disubmit.',
  },
  ditolak: {
    label: 'Ditolak',
    nada: 'netral',
    ikon: 'silang',
    arti: 'Kamu menjawab tidak bersedia bergabung. Slot langsung kembali terbuka untuk orang lain.',
    tindakan: 'Tidak ada. Ketua tetap boleh mengirim undangan baru ke orang yang sama.',
  },
  kedaluwarsa: {
    label: 'Kedaluwarsa',
    nada: 'netral',
    ikon: 'jam',
    arti: 'Masa berlaku 3×24 jam lewat tanpa jawaban. Sistem menutup undangan otomatis.',
    tindakan: 'Minta ketua mengirim undangan baru bila slot dan waktu pendaftaran masih ada.',
  },
  dibatalkan: {
    label: 'Dibatalkan ketua',
    nada: 'netral',
    ikon: 'silang',
    arti: 'Ketua menarik undangan sebelum dijawab, misalnya karena salah orang atau slot dialihkan.',
    tindakan: 'Tidak ada yang perlu kamu lakukan; undangan hilang dari tab Menunggu.',
  },
  konflik: {
    label: 'Konflik tim',
    nada: 'danger',
    ikon: 'seru',
    arti: 'Kamu sudah bergabung di tim lain pada lomba yang sama, jadi undangan ini tidak bisa diterima.',
    tindakan: 'Keluar dari tim sebelumnya lebih dulu, atau tolak undangan ini.',
  },
  dicabut: {
    label: 'Dicabut panitia',
    nada: 'danger',
    ikon: 'silang',
    arti: 'Panitia membatalkan undangan karena pelanggaran syarat, data ganda, atau roster sudah dikunci.',
    tindakan: 'Ketua dan penerima menghubungi sekretariat; alasan pencabutan tercatat di riwayat tim.',
  },
};

export const LABEL_STATUS_TIM: Record<StatusTim, { label: string; nada: 'warn' | 'info' | 'ok' }> = {
  'belum-disubmit': { label: 'Belum disubmit', nada: 'warn' },
  'menunggu-review': { label: 'Menunggu review', nada: 'info' },
  terverifikasi: { label: 'Terverifikasi', nada: 'ok' },
};

/**
 * Tab kotak undangan. Konflik ikut tab "Menunggu" karena masih butuh keputusanmu,
 * dan dicabut ikut "Dibatalkan" karena sama-sama ditutup pihak lain.
 */
export type IdTabUndangan = 'menunggu' | 'diterima' | 'ditolak' | 'kedaluwarsa' | 'dibatalkan';

export const TAB_UNDANGAN: readonly {
  readonly id: IdTabUndangan;
  readonly label: string;
  readonly status: readonly StatusUndangan[];
}[] = [
  { id: 'menunggu', label: 'Menunggu', status: ['menunggu', 'konflik'] },
  { id: 'diterima', label: 'Diterima', status: ['diterima'] },
  { id: 'ditolak', label: 'Ditolak', status: ['ditolak'] },
  { id: 'kedaluwarsa', label: 'Kedaluwarsa', status: ['kedaluwarsa'] },
  { id: 'dibatalkan', label: 'Dibatalkan', status: ['dibatalkan', 'dicabut'] },
];

/**
 * Hasil pencarian calon anggota — bukan direktori publik.
 *
 * Server hanya menjawab kecocokan PERSIS pada participant code atau email
 * terdaftar, dengan rate limit (agents.md §9). Modul ini meniru jawaban itu:
 * kuncinya kode/email lengkap, dan tidak ada pencarian sebagian nama.
 *
 * TODO(api-contract): `GET /api/v1/me/teams/{teamId}/candidates?q=` yang
 * mengembalikan salah satu dari `ditemukan | tidak-ditemukan | sudah-diundang |
 * anggota-tim-lain`. Keputusan status ini milik server, bukan client.
 */
export type HasilCari =
  | { readonly jenis: 'ditemukan'; readonly nama: string; readonly inisial: string; readonly identitas: string; readonly institusi: string; readonly catatan: string }
  | { readonly jenis: 'tidak-ditemukan'; readonly kueri: string }
  | { readonly jenis: 'sudah-diundang'; readonly nama: string; readonly dikirim: string; readonly berlaku: string; readonly cooldown: string }
  | { readonly jenis: 'anggota-tim-lain'; readonly nama: string; readonly tim: string; readonly lomba: string };

const DIREKTORI: Record<string, HasilCari> = {
  'psm-2026-8802': {
    jenis: 'ditemukan',
    nama: 'Arif Fauzan',
    inisial: 'AF',
    identitas: 'PSM-••••-8802',
    institusi: 'Politeknik Negeri Semarang',
    catatan: 'Belum tergabung di tim Futsal Putra mana pun',
  },
  'arif.fauzan@student.polines.ac.id': {
    jenis: 'ditemukan',
    nama: 'Arif Fauzan',
    inisial: 'AF',
    identitas: 'PSM-••••-8802',
    institusi: 'Politeknik Negeri Semarang',
    catatan: 'Belum tergabung di tim Futsal Putra mana pun',
  },
  'yoga.h@student.polines.ac.id': {
    jenis: 'sudah-diundang',
    nama: 'Yoga Hermawan',
    dikirim: '30 Jul 2026, 14.02',
    berlaku: '2 Agu 2026, 14.02',
    cooldown: '42.10',
  },
  'psm-2026-1180': {
    jenis: 'anggota-tim-lain',
    nama: 'Rangga Mahendra',
    tim: 'Elang Muda',
    lomba: 'Futsal Putra',
  },
};

export function cariCalonAnggota(kueri: string): HasilCari {
  const kunci = kueri.trim().toLowerCase();
  return DIREKTORI[kunci] ?? { jenis: 'tidak-ditemukan', kueri: kueri.trim() };
}

export function cariTim(id: string): Tim | undefined {
  return TIM_SAYA.find((t) => t.id === id);
}

export function cariUndangan(token: string): Undangan | undefined {
  return UNDANGAN.find((u) => u.token === token);
}

export function undanganMenunggu(): readonly Undangan[] {
  return UNDANGAN.filter((u) => u.status === 'menunggu');
}
