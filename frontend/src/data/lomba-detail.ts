import type { Nada, NamaIkon } from '@/types/peserta';

/**
 * Isi tab halaman detail lomba (jadwal, tim, QR, dokumen, riwayat).
 *
 * TODO(api-contract): satu endpoint `GET /api/v1/me/registrations/{id}` yang
 * mengembalikan seluruh blok ini. Status kelengkapan anggota TIDAK boleh
 * membawa dokumen atau data pribadi anggota lain (agents.md §9 FE-TEAM-207).
 */

export interface JadwalLomba {
  readonly id: string;
  readonly tanggal: string;
  readonly bulan: string;
  readonly hari: string;
  readonly judul: string;
  readonly keterangan: string;
  readonly jam: string;
  readonly jamLama?: string;
  readonly venue: string;
  readonly status: 'mendatang' | 'selesai' | 'berubah';
}

export interface AnggotaTim {
  readonly id: string;
  readonly nama: string;
  readonly inisial: string;
  readonly peran: 'Ketua' | 'Anggota';
  /** Hanya status kelengkapan — bukan isi dokumennya. */
  readonly kelengkapan: 'lengkap' | 'perlu-revisi' | 'menunggu';
  readonly keterangan: string;
}

export interface TimLomba {
  readonly nama: string;
  readonly institusi: string;
  readonly ketua: string;
  readonly minimal: number;
  readonly maksimal: number;
  readonly diterima: number;
  readonly menunggu: number;
  readonly anggota: readonly AnggotaTim[];
}

export interface KodeQr {
  readonly aktif: boolean;
  readonly referensi: string;
  readonly berlaku: string;
  readonly catatan: string;
}

export interface BerkasLomba {
  readonly id: string;
  readonly nama: string;
  readonly meta: string;
  readonly keadaan: 'diterima' | 'perlu-revisi' | 'menunggu';
  readonly keterangan: string;
  readonly sumber: 'panitia' | 'peserta';
}

export interface JejakLomba {
  readonly id: string;
  readonly teks: string;
  readonly waktu: string;
  readonly nada: Nada;
  readonly ikon: NamaIkon;
}

export interface DetailLomba {
  readonly jadwal: readonly JadwalLomba[];
  readonly tim?: TimLomba;
  readonly qr: KodeQr;
  readonly berkas: readonly BerkasLomba[];
  readonly jejak: readonly JejakLomba[];
}

const JEJAK_UMUM: readonly JejakLomba[] = [
  { id: 'j1', teks: 'Pendaftaran dikirim untuk review', waktu: '26 Jul 2026, 10.02', nada: 'info', ikon: 'amplop' },
  { id: 'j2', teks: 'Dokumen persyaratan diunggah', waktu: '26 Jul 2026, 10.00', nada: 'info', ikon: 'berkas' },
];

const DETAIL: Record<string, DetailLomba> = {
  'futsal-putra': {
    jadwal: [
      {
        id: 'f1',
        tanggal: '02',
        bulan: 'SEP',
        hari: 'Senin',
        judul: 'Penyisihan Grup B · Laga 1',
        keterangan: 'vs Tim Bina Taruna',
        jam: '09.30',
        jamLama: '07.30',
        venue: 'GOR Manunggal Jati',
        status: 'berubah',
      },
      {
        id: 'f2',
        tanggal: '05',
        bulan: 'SEP',
        hari: 'Kamis',
        judul: 'Perempat final',
        keterangan: 'Lawan ditentukan setelah penyisihan grup selesai',
        jam: '15.00',
        venue: 'GOR Manunggal Jati',
        status: 'mendatang',
      },
      {
        id: 'f3',
        tanggal: '29',
        bulan: 'AGU',
        hari: 'Jumat',
        judul: 'Technical meeting',
        keterangan: 'Pengundian bagan dan penjelasan regulasi',
        jam: '13.00',
        venue: 'Aula Serbaguna Akpol',
        status: 'selesai',
      },
    ],
    tim: {
      nama: 'Garuda Muda',
      institusi: 'Politeknik Negeri Semarang',
      ketua: 'Bagas Pratama',
      minimal: 5,
      maksimal: 8,
      diterima: 4,
      menunggu: 1,
      anggota: [
        {
          id: 't1',
          nama: 'Bagas Pratama',
          inisial: 'BP',
          peran: 'Ketua',
          kelengkapan: 'lengkap',
          keterangan: 'Data dan dokumen lengkap',
        },
        {
          id: 't2',
          nama: 'Rizky Ananda',
          inisial: 'RA',
          peran: 'Anggota',
          kelengkapan: 'lengkap',
          keterangan: 'Data dan dokumen lengkap',
        },
        {
          id: 't3',
          nama: 'Dimas Saputra',
          inisial: 'DS',
          peran: 'Anggota',
          kelengkapan: 'perlu-revisi',
          keterangan: 'Satu dokumen perlu diperbaiki — kami sudah memberi tahu yang bersangkutan',
        },
        {
          id: 't4',
          nama: 'Fajar Nugroho',
          inisial: 'FN',
          peran: 'Anggota',
          kelengkapan: 'lengkap',
          keterangan: 'Data dan dokumen lengkap',
        },
        {
          id: 't5',
          nama: 'Undangan terkirim',
          inisial: '?',
          peran: 'Anggota',
          kelengkapan: 'menunggu',
          keterangan: 'Undangan menunggu jawaban · kedaluwarsa 3 hari lagi',
        },
      ],
    },
    qr: {
      aktif: true,
      referensi: '4821-KQ',
      berlaku: 'Sel, 2 Sep 2026 · 07.00–10.00',
      catatan: 'Tunjukkan kode ini di meja registrasi venue. Kode berganti tiap hari pertandingan.',
    },
    berkas: [
      {
        id: 'b1',
        nama: 'Regulasi Futsal PORSIMAPTAR XXVI',
        meta: 'PDF · 1,2 MB · versi 2',
        keadaan: 'diterima',
        keterangan: 'Aturan pertandingan, sanksi, dan format bagan.',
        sumber: 'panitia',
      },
      {
        id: 'b2',
        nama: 'Kartu tanda mahasiswa',
        meta: 'JPG · 480 KB · diunggah 27 Jul 2026',
        keadaan: 'diterima',
        keterangan: 'Sudah diverifikasi panitia.',
        sumber: 'peserta',
      },
      {
        id: 'b3',
        nama: 'Surat keterangan sehat',
        meta: 'PDF · 720 KB · diunggah 26 Jul 2026',
        keadaan: 'diterima',
        keterangan: 'Sudah diverifikasi panitia.',
        sumber: 'peserta',
      },
    ],
    jejak: [
      { id: 'jf1', teks: 'Kode QR check-in diterbitkan', waktu: 'Kemarin, 19.40', nada: 'ok', ikon: 'qr' },
      { id: 'jf2', teks: 'Pendaftaran diverifikasi panitia', waktu: '28 Jul 2026, 16.05', nada: 'ok', ikon: 'centang' },
      ...JEJAK_UMUM,
    ],
  },

  fotografi: {
    jadwal: [
      {
        id: 'g1',
        tanggal: '04',
        bulan: 'SEP',
        hari: 'Rabu',
        judul: 'Sesi hunting foto',
        keterangan: 'Tema diumumkan di lokasi · karya dikumpulkan hari yang sama',
        jam: '09.00',
        venue: 'Gedung Serbaguna Lt. 2',
        status: 'mendatang',
      },
    ],
    qr: {
      aktif: false,
      referensi: '—',
      berlaku: 'Terbit setelah pendaftaran diverifikasi',
      catatan: 'Kode check-in baru muncul setelah panitia menyetujui pendaftaranmu.',
    },
    berkas: [
      {
        id: 'g-b1',
        nama: 'Ketentuan karya fotografi',
        meta: 'PDF · 860 KB · versi 1',
        keadaan: 'diterima',
        keterangan: 'Format file, batas editing, dan hak pakai karya.',
        sumber: 'panitia',
      },
      {
        id: 'g-b2',
        nama: 'Kartu tanda mahasiswa',
        meta: 'JPG · 512 KB · diunggah 26 Jul 2026',
        keadaan: 'menunggu',
        keterangan: 'Sedang diperiksa panitia.',
        sumber: 'peserta',
      },
    ],
    jejak: JEJAK_UMUM,
  },

  'basket-putra': {
    jadwal: [
      {
        id: 'k1',
        tanggal: '29',
        bulan: 'OKT',
        hari: 'Kamis',
        judul: 'Perempat final',
        keterangan: 'Lawan ditentukan setelah penyisihan Grup C selesai',
        jam: '15.00',
        venue: 'GOR AKPOL',
        status: 'mendatang',
      },
    ],
    tim: {
      nama: 'Garuda Muda B',
      institusi: 'Politeknik Negeri Semarang',
      ketua: 'Rangga Mahendra',
      minimal: 5,
      maksimal: 12,
      diterima: 8,
      menunggu: 1,
      anggota: [
        {
          id: 'kb1',
          nama: 'Rangga Mahendra',
          inisial: 'RM',
          peran: 'Ketua',
          kelengkapan: 'lengkap',
          keterangan: 'Data dan dokumen lengkap',
        },
        {
          id: 'kb2',
          nama: 'Bagas Pratama',
          inisial: 'BP',
          peran: 'Anggota',
          kelengkapan: 'perlu-revisi',
          keterangan: 'Surat keterangan aktif kuliah perlu diunggah ulang',
        },
        {
          id: 'kb3',
          nama: 'Anggota lain',
          inisial: '+6',
          peran: 'Anggota',
          kelengkapan: 'lengkap',
          keterangan: '6 anggota lain sudah lengkap',
        },
      ],
    },
    qr: {
      aktif: false,
      referensi: '—',
      berlaku: 'Terbit setelah dokumen diperbaiki',
      catatan: 'Selesaikan perbaikan dokumen agar pendaftaran bisa disetujui dan kode terbit.',
    },
    berkas: [
      {
        id: 'kb-b1',
        nama: 'Regulasi Basket PORSIMAPTAR XXVI',
        meta: 'PDF · 1,4 MB · versi 3',
        keadaan: 'diterima',
        keterangan: 'Versi terbaru — perubahan pada aturan pergantian pemain.',
        sumber: 'panitia',
      },
      {
        id: 'kb-b2',
        nama: 'Surat keterangan aktif kuliah',
        meta: 'PDF · 300 KB · diunggah 24 Jul 2026',
        keadaan: 'perlu-revisi',
        keterangan: 'Scan terpotong di bagian tanda tangan dan stempel. Unggah ulang halaman penuh.',
        sumber: 'peserta',
      },
      {
        id: 'kb-b3',
        nama: 'Kartu tanda mahasiswa',
        meta: 'JPG · 480 KB · diunggah 24 Jul 2026',
        keadaan: 'diterima',
        keterangan: 'Sudah diverifikasi panitia.',
        sumber: 'peserta',
      },
    ],
    jejak: [
      {
        id: 'jk1',
        teks: 'Panitia meminta perbaikan dokumen',
        waktu: '28 Jul 2026, 09.10',
        nada: 'warn',
        ikon: 'seru',
      },
      ...JEJAK_UMUM,
    ],
  },
};

const DETAIL_KOSONG: DetailLomba = {
  jadwal: [],
  qr: {
    aktif: false,
    referensi: '—',
    berlaku: 'Tidak berlaku lagi',
    catatan: 'Pendaftaran ini sudah tidak aktif, jadi tidak ada kode check-in.',
  },
  berkas: [],
  jejak: JEJAK_UMUM,
};

export function detailLomba(id: string): DetailLomba {
  return DETAIL[id] ?? DETAIL_KOSONG;
}
