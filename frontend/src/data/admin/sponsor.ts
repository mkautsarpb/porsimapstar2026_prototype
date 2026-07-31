import type { BarisSponsor, TingkatSponsor } from '@/types/admin';

/**
 * Fixture modul Sponsor — desain "Batch E4 · Sponsor, CMS, Laporan, Sinkronisasi".
 *
 * TODO(api-contract): diganti oleh
 *   GET  /api/v1/admin/sponsors
 *   POST /api/v1/admin/sponsors/{id}/logo   (multipart; validasi ukuran final di server)
 *   POST /api/v1/admin/sponsors/order       body { order: [id, ...] }   // tersimpan sebagai draf
 *   POST /api/v1/admin/sponsors/publish     // menerbitkan susunan draf ke portal
 *
 * Panduan ukuran logo ditulis SEBELUM orang memilih berkas, bukan sebagai pesan
 * galat setelah unggahan ditolak. Validasi final tetap milik server: dimensi,
 * MIME, dan pemindaian berkas tidak bisa dipercaya dari client (agents.md §5).
 */

export const PANDUAN_LOGO =
  'SVG (disarankan) atau PNG latar transparan · lebar minimal 800px · rasio antara 2:1 dan 4:1 · maksimal 1 MB · hindari margin kosong tebal di sekitar logo.';

export const TINGGI_LOGO: Readonly<Record<TingkatSponsor, string>> = {
  utama: '56px',
  pendukung: '40px',
  media: '28px',
};

export const LABEL_TINGKAT: Readonly<Record<TingkatSponsor, string>> = {
  utama: 'Utama',
  pendukung: 'Pendukung',
  media: 'Media partner',
};

export const DAFTAR_SPONSOR: readonly BarisSponsor[] = [
  {
    id: 'spn-bank-jateng',
    urutan: 1,
    nama: 'Bank Jateng',
    tingkat: 'utama',
    formatLogo: 'SVG',
    dimensiLogo: '1200×400',
    memenuhiPanduan: true,
    tautan: 'bankjateng.co.id',
    tayang: true,
    catatan: null,
  },
  {
    id: 'spn-telkomsel',
    urutan: 2,
    nama: 'Telkomsel',
    tingkat: 'utama',
    formatLogo: 'PNG',
    dimensiLogo: '1600×534',
    memenuhiPanduan: true,
    tautan: 'telkomsel.com',
    tayang: true,
    catatan: null,
  },
  {
    id: 'spn-semen-gresik',
    urutan: 3,
    nama: 'Semen Gresik',
    tingkat: 'pendukung',
    formatLogo: 'PNG',
    dimensiLogo: '320×140',
    memenuhiPanduan: false,
    tautan: 'semengresik.com',
    tayang: false,
    catatan: 'Di bawah lebar minimum 800px — akan tampak pecah pada tinggi 40px.',
  },
  {
    id: 'spn-aqua',
    urutan: 4,
    nama: 'Aqua',
    tingkat: 'pendukung',
    formatLogo: 'SVG',
    dimensiLogo: '800×300',
    memenuhiPanduan: true,
    tautan: 'sehataqua.co.id',
    tayang: true,
    catatan: null,
  },
  {
    id: 'spn-indomaret',
    urutan: 5,
    nama: 'Indomaret',
    tingkat: 'pendukung',
    formatLogo: 'SVG',
    dimensiLogo: '900×320',
    memenuhiPanduan: true,
    tautan: 'indomaret.co.id',
    tayang: true,
    catatan: null,
  },
  {
    id: 'spn-kopi-kenangan',
    urutan: 6,
    nama: 'Kopi Kenangan',
    tingkat: 'pendukung',
    formatLogo: 'PNG',
    dimensiLogo: '1024×400',
    memenuhiPanduan: true,
    tautan: 'kopikenangan.com',
    tayang: false,
    catatan: 'Draf — belum pernah diterbitkan ke portal.',
  },
  {
    id: 'spn-suara-merdeka',
    urutan: 7,
    nama: 'Suara Merdeka',
    tingkat: 'media',
    formatLogo: 'SVG',
    dimensiLogo: '900×300',
    memenuhiPanduan: true,
    tautan: 'suaramerdeka.com',
    tayang: true,
    catatan: null,
  },
  {
    id: 'spn-radio-idola',
    urutan: 8,
    nama: 'Radio Idola',
    tingkat: 'media',
    formatLogo: 'SVG',
    dimensiLogo: '880×300',
    memenuhiPanduan: true,
    tautan: 'radioidola.com',
    tayang: true,
    catatan: null,
  },
  {
    id: 'spn-tribun-jateng',
    urutan: 9,
    nama: 'Tribun Jateng',
    tingkat: 'media',
    formatLogo: 'PNG',
    dimensiLogo: '1000×340',
    memenuhiPanduan: true,
    tautan: 'jateng.tribunnews.com',
    tayang: true,
    catatan: null,
  },
];

export const PERUBAHAN_BELUM_TERBIT = 2;
