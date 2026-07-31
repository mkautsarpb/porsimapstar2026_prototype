import type { TabDashboard } from '@/types/api/admin-dashboard';

/**
 * Serialisasi filter global dashboard panitia ke/dari query URL.
 *
 * Kenapa URL dan bukan state di memori (AC-FE-13, agents.md §10): filter harus
 * bertahan saat panitia membuka drill-down lalu menekan tombol kembali, dan
 * harus bisa dibagikan antar admin berizin. State di memori hilang pada dua-duanya.
 *
 * PRIVASI (FE-PRIV-001): seluruh nilai di sini adalah slug enum terkontrol —
 * tidak ada nama, NIK, email, atau pengenal peserta. Jangan pernah menambahkan
 * filter yang nilainya data pribadi; URL masuk riwayat peramban dan log proxy.
 */

export const KUNCI_FILTER = [
  'event',
  'lomba',
  'kategori',
  'tipe',
  'venue',
  'periode',
  'status',
  'pertandingan',
] as const;

export type KunciFilter = (typeof KUNCI_FILTER)[number];

export type NilaiFilter = Readonly<Record<KunciFilter, string>>;

export interface OpsiFilter {
  readonly nilai: string;
  readonly label: string;
}

interface DefinisiFilter {
  readonly judul: string;
  readonly bawaan: string;
  readonly opsi: readonly OpsiFilter[];
}

/*
 * TODO(api-contract): daftar nilai lomba, kategori, dan venue seharusnya datang
 * dari `GET /api/v1/admin/filters` supaya tidak perlu deploy frontend tiap kali
 * panitia menambah cabang. Sementara ini dikunci di sini agar tipenya ketat.
 */
export const FILTER: Readonly<Record<KunciFilter, DefinisiFilter>> = {
  event: {
    judul: 'Event',
    bawaan: 'xxvi-2026',
    opsi: [{ nilai: 'xxvi-2026', label: 'PORSIMAPTAR XXVI 2026' }],
  },
  lomba: {
    judul: 'Lomba',
    bawaan: 'semua',
    opsi: [
      { nilai: 'semua', label: 'Semua lomba cakupanku' },
      { nilai: 'basket', label: 'Basket Putra' },
      { nilai: 'futsal', label: 'Futsal' },
      { nilai: 'voli', label: 'Voli Putri' },
      { nilai: 'catur', label: 'Catur' },
      { nilai: 'tenis-meja', label: 'Tenis Meja' },
      { nilai: 'esport', label: 'E-sport' },
    ],
  },
  kategori: {
    judul: 'Kategori',
    bawaan: 'semua',
    opsi: [
      { nilai: 'semua', label: 'Semua kategori' },
      { nilai: 'putra', label: 'Putra' },
      { nilai: 'putri', label: 'Putri' },
      { nilai: 'campuran', label: 'Campuran' },
    ],
  },
  tipe: {
    judul: 'Tipe peserta',
    bawaan: 'semua',
    opsi: [
      { nilai: 'semua', label: 'Individu dan tim' },
      { nilai: 'individu', label: 'Individu' },
      { nilai: 'tim', label: 'Tim' },
    ],
  },
  venue: {
    judul: 'Venue',
    bawaan: 'semua',
    opsi: [
      { nilai: 'semua', label: 'Semua venue' },
      { nilai: 'gor-akpol', label: 'GOR AKPOL' },
      { nilai: 'lapangan-utama', label: 'Lapangan Utama' },
      { nilai: 'aula', label: 'Aula Serbaguna' },
    ],
  },
  periode: {
    judul: 'Periode',
    bawaan: '7hari',
    opsi: [
      { nilai: '7hari', label: '7 hari terakhir' },
      { nilai: '30hari', label: '30 hari terakhir' },
      { nilai: 'pendaftaran', label: 'Seluruh masa pendaftaran' },
    ],
  },
  status: {
    judul: 'Status pendaftaran',
    bawaan: 'semua',
    opsi: [
      { nilai: 'semua', label: 'Semua status' },
      { nilai: 'menunggu', label: 'Menunggu verifikasi' },
      { nilai: 'perbaikan', label: 'Perlu perbaikan' },
      { nilai: 'ditolak', label: 'Ditolak' },
      { nilai: 'terverifikasi', label: 'Terverifikasi' },
    ],
  },
  pertandingan: {
    judul: 'Status pertandingan',
    bawaan: 'semua',
    opsi: [
      { nilai: 'semua', label: 'Semua status' },
      { nilai: 'terjadwal', label: 'Terjadwal' },
      { nilai: 'berlangsung', label: 'Berlangsung' },
      { nilai: 'selesai', label: 'Selesai' },
      { nilai: 'ditunda', label: 'Ditunda' },
      { nilai: 'dibatalkan', label: 'Dibatalkan' },
    ],
  },
};

export const FILTER_BAWAAN: NilaiFilter = Object.fromEntries(
  KUNCI_FILTER.map((k) => [k, FILTER[k].bawaan]),
) as NilaiFilter;

export const TAB_BAWAAN: TabDashboard = 'lomba';

type Query = Readonly<Record<string, string | readonly string[] | undefined>>;

function satu(nilai: string | readonly string[] | undefined): string | undefined {
  if (Array.isArray(nilai)) return nilai[0];
  return typeof nilai === 'string' ? nilai : undefined;
}

/** Nilai tak dikenal jatuh ke bawaan — query yang dikarang tidak pernah lolos. */
export function bacaFilter(query: Query): NilaiFilter {
  const hasil: Record<string, string> = {};

  for (const kunci of KUNCI_FILTER) {
    const mentah = satu(query[kunci]);
    const sah = FILTER[kunci].opsi.some((o) => o.nilai === mentah);
    hasil[kunci] = sah && mentah ? mentah : FILTER[kunci].bawaan;
  }

  return hasil as NilaiFilter;
}

/**
 * Tab dibaca dari URL, lalu disaring terhadap tab yang benar-benar boleh dilihat
 * pengguna ini. `?tab=sistem` tanpa izin integrasi jatuh ke tab bawaan, bukan
 * merender panel kosong (AC #6).
 */
export function bacaTab(query: Query, tersedia: readonly TabDashboard[]): TabDashboard {
  const mentah = satu(query.tab);
  const cocok = tersedia.find((t) => t === mentah);
  return cocok ?? tersedia[0] ?? TAB_BAWAAN;
}

export function label(kunci: KunciFilter, nilai: string): string {
  return FILTER[kunci].opsi.find((o) => o.nilai === nilai)?.label ?? FILTER[kunci].bawaan;
}

export function jumlahAktif(filter: NilaiFilter): number {
  return KUNCI_FILTER.filter((k) => filter[k] !== FILTER[k].bawaan).length;
}

/** Hanya nilai non-bawaan yang ditulis — URL tetap pendek dan bisa dibaca manusia. */
export function keParams(filter: NilaiFilter, tab?: TabDashboard): URLSearchParams {
  const params = new URLSearchParams();
  if (tab && tab !== TAB_BAWAAN) params.set('tab', tab);

  for (const kunci of KUNCI_FILTER) {
    if (filter[kunci] !== FILTER[kunci].bawaan) params.set(kunci, filter[kunci]);
  }

  return params;
}

function gabung(path: string, params: URLSearchParams): string {
  const s = params.toString();
  return s ? `${path}?${s}` : path;
}

export function urlDashboard(filter: NilaiFilter, tab: TabDashboard): string {
  return gabung('/admin/dashboard', keParams(filter, tab));
}

/**
 * Drill-down membawa SELURUH filter aktif ke halaman tujuan dengan nama parameter
 * yang sama persis, supaya total di halaman tujuan bisa direkonsiliasi dengan
 * angka widget (AC-FE-08). `path` boleh sudah punya query sendiri.
 */
export function urlDrilldown(path: string, filter: NilaiFilter, bawaFilter: boolean): string {
  if (!bawaFilter) return path;

  const [dasar = path, queryBawaan] = path.split('?');
  const params = new URLSearchParams(queryBawaan ?? '');

  for (const kunci of KUNCI_FILTER) {
    /*
     * Query bawaan `path` adalah niat khusus widget dan TIDAK boleh ditimpa
     * filter global. Tanpa penjagaan ini, widget "Perlu perbaikan" yang menunjuk
     * `?status=perlu-perbaikan` akan berubah mengikuti filter status yang sedang
     * aktif, lalu membuka daftar yang totalnya tidak cocok dengan angka di kartu
     * — persis yang dilarang AC-FE-08.
     */
    if (params.has(kunci)) continue;
    if (filter[kunci] !== FILTER[kunci].bawaan) params.set(kunci, filter[kunci]);
  }

  return gabung(dasar, params);
}

/** Parameter untuk permintaan ke API — seluruh nilai dikirim, termasuk bawaan. */
export function keParamsApi(filter: NilaiFilter, tab: TabDashboard): URLSearchParams {
  const params = new URLSearchParams({ tab });
  for (const kunci of KUNCI_FILTER) params.set(kunci, filter[kunci]);
  return params;
}
