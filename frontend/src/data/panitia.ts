import type {
  AlertRowDTO,
  BarisKomposisiDTO,
  ChartsDTO,
  HealthDTO,
  QuotaRowDTO,
  TabDashboard,
  TahapFunnelDTO,
  TitikHarianDTO,
  TitikJamDTO,
  WidgetDTO,
} from '@/types/api/admin-dashboard';
import type { MenuAdmin } from '@/types/panitia';
import { formatAngka } from '@/lib/admin/format';

/**
 * Fixture dashboard panitia — mengikuti desain "Batch D — Dashboard Panitia".
 *
 * TODO(api-contract): seluruh berkas ini diganti oleh respons asli
 * `GET /api/v1/admin/dashboard`. Bentuknya sengaja sudah DTO (snake_case) supaya
 * penggantiannya cukup menukar sumber data, bukan menulis ulang normalisasi.
 *
 * Jam skenario dibekukan di 28 Sep 2026, 09.43 WIB — sama dengan desain. Umur
 * data dihitung dari `server_time` di payload, bukan jam browser, jadi angka
 * "2 menit lalu" tetap benar walau berkas ini dibuka tahun berapa pun.
 */

export const WAKTU_SERVER_ISO = '2026-09-28T09:43:00+07:00';

/** Kalender resmi — dipakai keadaan "belum dimulai" agar tanggalnya konsisten. */
export const KALENDER = {
  pendaftaranMulai: '2026-09-21T00:00:00+07:00',
  pendaftaranTutup: '2026-10-05T23:59:00+07:00',
  daftarUlang: '2026-10-06T08:00:00+07:00',
  technicalMeeting: '2026-10-07T09:00:00+07:00',
  lombaMulai: '2026-10-26T07:00:00+07:00',
  lombaSelesai: '2026-10-29T17:00:00+07:00',
} as const;

function menitLalu(menit: number): string {
  return new Date(Date.parse(WAKTU_SERVER_ISO) - menit * 60_000).toISOString();
}

// ---------------------------------------------------------------------------
// Basis per lomba
//
// Widget di bawah ditulis untuk cakupan penuh enam lomba, lalu dipersempit oleh
// `sesuaikanCakupan()` sesuai cakupan akun yang masuk. Angka per lomba di sini
// adalah sumbernya: panitia cabang Basket harus melihat 168 pendaftaran Basket,
// bukan 1.284 milik seluruh cakupan. Menyempitkan daftar lomba tapi membiarkan
// totalnya utuh justru lebih menyesatkan daripada tidak menyaring sama sekali.
// ---------------------------------------------------------------------------

interface BasisLomba {
  readonly nama: string;
  /** Peserta yang mendaftar sebagai perorangan. */
  readonly individu: number;
  /** Peserta yang mendaftar lewat tim, beserta jumlah timnya. */
  readonly timPeserta: number;
  readonly tim: number;
}

/** Jumlahnya: 630 individu + 654 lewat tim = 1.284 pendaftaran, 104 tim. */
const BASIS_LOMBA: readonly BasisLomba[] = [
  { nama: 'Atletik', individu: 330, timPeserta: 72, tim: 12 },
  { nama: 'Badminton', individu: 300, timPeserta: 40, tim: 10 },
  { nama: 'Sepak Bola', individu: 0, timPeserta: 176, tim: 22 },
  { nama: 'Basket', individu: 0, timPeserta: 168, tim: 24 },
  { nama: 'Voli', individu: 0, timPeserta: 108, tim: 18 },
  { nama: 'E-Sport', individu: 0, timPeserta: 90, tim: 18 },
];

const TOTAL_PENUH = BASIS_LOMBA.reduce((n, l) => n + l.individu + l.timPeserta, 0);

interface RingkasCakupan {
  readonly lomba: readonly BasisLomba[];
  readonly total: number;
  readonly individu: number;
  readonly timPeserta: number;
  readonly tim: number;
  /** Bagian cakupan ini terhadap seluruh pendaftaran; penskala angka turunan. */
  readonly pangsa: number;
}

function ringkasCakupan(cakupan: readonly string[]): RingkasCakupan {
  const lomba = BASIS_LOMBA.filter((l) => cakupan.includes(l.nama));
  const individu = lomba.reduce((n, l) => n + l.individu, 0);
  const timPeserta = lomba.reduce((n, l) => n + l.timPeserta, 0);
  const total = individu + timPeserta;
  return {
    lomba,
    total,
    individu,
    timPeserta,
    tim: lomba.reduce((n, l) => n + l.tim, 0),
    pangsa: TOTAL_PENUH === 0 ? 0 : total / TOTAL_PENUH,
  };
}

/** Cakupan penuh harus menghasilkan angka yang sama persis seperti sebelumnya. */
function skala(nilai: number, pangsa: number): number {
  return pangsa >= 1 ? nilai : Math.round(nilai * pangsa);
}

/*
 * Deret grafik diskalakan titik demi titik, lalu angka besar di kepala widget
 * diambil dari JUMLAH deret itu — bukan diskalakan sendiri. Menskalakan
 * keduanya secara terpisah membuat pembulatan tiap titik menumpuk, dan kepala
 * widget berbeda satu-dua dari keterangan yang menjumlahkan grafiknya.
 */
function harianSkala(pangsa: number): readonly TitikHarianDTO[] {
  if (pangsa >= 1) return TREN_HARIAN;
  return TREN_HARIAN.map((t) => ({
    date: t.date,
    submitted: t.submitted === null ? null : skala(t.submitted, pangsa),
    verified: t.verified === null ? null : skala(t.verified, pangsa),
    rejected: t.rejected === null ? null : skala(t.rejected, pangsa),
  }));
}

function jamSkala(pangsa: number): readonly TitikJamDTO[] {
  if (pangsa >= 1) return TREN_JAM;
  return TREN_JAM.map((t) => ({ ...t, value: skala(t.value, pangsa) }));
}

function jumlahHarian(deret: readonly TitikHarianDTO[]): number {
  return deret.reduce((n, t) => n + (t.submitted ?? 0), 0);
}

function jumlahJam(deret: readonly TitikJamDTO[]): number {
  return deret.reduce((n, t) => n + t.value, 0);
}

const FILTER_PENDAFTARAN = ['event', 'lomba', 'kategori', 'tipe', 'periode', 'status'];

/*
 * Metrik antrean sudah menentukan statusnya sendiri ("yang menunggu", "yang
 * dikembalikan", "yang terverifikasi"), jadi filter status global tidak berlaku
 * untuknya. Kalau tetap didaftarkan sebagai filter yang berlaku, memilih
 * "Terverifikasi" di filter global sambil melihat kartu "Menunggu verifikasi"
 * jadi tidak masuk akal.
 */
const CAKUPAN_ANTREAN = {
  follows_global_filter: false,
  override_label: 'Filter status pendaftaran tidak berlaku — metrik ini menentukan statusnya sendiri',
  applied_filters: ['event', 'lomba', 'kategori', 'tipe', 'periode'],
  ignored_filters: ['status', 'venue', 'pertandingan'],
} as const;

// ---------------------------------------------------------------------------
// Tab Lomba — analisis kepesertaan
// ---------------------------------------------------------------------------

const WIDGET_LOMBA: readonly WidgetDTO[] = [
  {
    id: 'total-pendaftaran',
    title: 'Total pendaftaran',
    status: 'ready',
    value: 1284,
    denominator_label: 'sejak 21 Sep 2026',
    breakdown: [
      { label: 'Individu', value: '630' },
      { label: 'Tim', value: '654 peserta · 104 tim' },
    ],
    last_updated_at: menitLalu(1),
    definition: {
      counted: 'Pendaftaran yang sudah dikirim peserta, semua status keputusan.',
      not_counted: 'Draf yang belum dikirim.',
      source: 'Basis data pendaftaran',
      recompute_interval_seconds: 60,
    },
    scope: { follows_global_filter: true, applied_filters: FILTER_PENDAFTARAN, ignored_filters: [] },
    drill_down: {
      label: 'Daftar pendaftaran per status',
      path: '/admin/peserta?kelompok=status',
      carry_filters: true,
    },
    stale_decision_warning: 'Jangan pakai angka ini untuk laporan resmi ke pimpinan.',
  },
  {
    id: 'total-akun',
    title: 'Total akun peserta',
    status: 'ready',
    value: 1512,
    breakdown: [
      { label: 'Email terverifikasi', value: '1.388', tone: 'ok' },
      { label: 'Belum verifikasi email', value: '124', tone: 'warn' },
    ],
    last_updated_at: menitLalu(3),
    definition: {
      counted: 'Akun peserta yang pernah dibuat, terlepas sudah mendaftar lomba atau belum.',
      not_counted: 'Akun panitia dan super admin.',
      source: 'Basis data akun',
      recompute_interval_seconds: 300,
    },
    scope: {
      follows_global_filter: false,
      override_label: 'Tidak mengikuti filter lomba dan kategori',
      applied_filters: ['event', 'periode'],
      ignored_filters: ['lomba', 'kategori', 'tipe', 'venue', 'status', 'pertandingan'],
    },
    drill_down: { label: 'Daftar akun', path: '/admin/peserta', carry_filters: true },
    stale_decision_warning: 'Jangan pakai angka ini untuk memperkirakan beban verifikasi.',
  },
  {
    id: 'peserta-per-lomba',
    title: 'Peserta dan tim per lomba',
    status: 'ready',
    value: 6,
    display_value: '6 lomba',
    denominator_label: 'dalam cakupanmu',
    // `share` menggerakkan bar latar tiap baris — proporsi terhadap lomba terbesar.
    breakdown: [
      // Atletik dan Badminton punya nomor perorangan sekaligus beregu (estafet,
      // ganda), jadi keduanya menyumbang peserta individu dan tim sekaligus.
      { label: 'Atletik', value: '402 peserta · 12 tim', share: 1 },
      { label: 'Badminton', value: '340 peserta · 10 tim', share: 340 / 402 },
      { label: 'Sepak Bola', value: '176 peserta · 22 tim', share: 176 / 402 },
      { label: 'Basket', value: '168 peserta · 24 tim', share: 168 / 402 },
      { label: 'Voli', value: '108 peserta · 18 tim', share: 108 / 402 },
      { label: 'E-Sport', value: '90 peserta · 18 tim', share: 90 / 402 },
    ],
    last_updated_at: menitLalu(2),
    definition: {
      counted: 'Peserta terverifikasi dan menunggu verifikasi, dikelompokkan per lomba.',
      not_counted: 'Pendaftaran ditolak, ditarik peserta, dan draf.',
      source: 'Basis data pendaftaran',
      recompute_interval_seconds: 60,
    },
    scope: { follows_global_filter: true, applied_filters: FILTER_PENDAFTARAN, ignored_filters: [] },
    drill_down: { label: 'Rincian per lomba', path: '/admin/lomba', carry_filters: true },
    stale_decision_warning: 'Jangan pakai angka ini untuk menyusun bagan pertandingan.',
  },
  {
    id: 'kuota-lomba',
    title: 'Pemanfaatan kuota',
    status: 'stale',
    value: 1,
    display_value: '1 lomba penuh',
    denominator_label: '2 hampir penuh',
    last_updated_at: menitLalu(91),
    definition: {
      counted: 'Slot terpakai per lomba, dari pendaftaran terverifikasi dan menunggu.',
      not_counted: 'Pendaftaran yang ditolak dan yang ditarik peserta.',
      source: 'Basis data kuota',
      recompute_interval_seconds: 300,
    },
    scope: {
      follows_global_filter: false,
      override_label: '4 dari 6 lomba cakupanmu punya kuota',
      applied_filters: ['event', 'lomba', 'kategori'],
      ignored_filters: ['periode', 'venue', 'status', 'pertandingan'],
    },
    drill_down: { label: 'Pengaturan kuota', path: '/admin/lomba?tab=kuota', carry_filters: true },
    stale_decision_warning:
      'Jangan pakai angka ini untuk menutup pendaftaran atau membuka daftar tunggu.',
  },
];

// ---------------------------------------------------------------------------
// Grafik tab Lomba
//
// Angkanya sengaja direkonsiliasi dengan widget, bukan dikarang terpisah:
//   harian  → dikirim 1.284 · diverifikasi 936 · ditolak 24
//   funnel  → 1.512 akun → 1.388 email → 1.284 dikirim → 936 diverifikasi
//   komposisi → individu 630 + tim 654 = 1.284, tersebar di 6 lomba
// Grafik yang totalnya beda dari kartu di atasnya adalah cara tercepat membuat
// panitia berhenti memercayai dashboard.
// ---------------------------------------------------------------------------

function tanggalPendaftaran(offsetHari: number): string {
  return new Date(Date.parse(KALENDER.pendaftaranMulai) + offsetHari * 86_400_000).toISOString();
}

/** 21 Sep – 5 Okt. Delapan hari pertama sudah terjadi, sisanya null. */
const HARIAN: readonly (readonly [number, number, number])[] = [
  [96, 62, 1],
  [143, 101, 2],
  [187, 140, 4],
  [165, 128, 3],
  [210, 158, 5],
  [152, 112, 2],
  [194, 143, 4],
  [137, 92, 3],
];

const TREN_HARIAN: readonly TitikHarianDTO[] = Array.from({ length: 15 }, (_, i) => {
  const nilai = HARIAN[i];
  return {
    date: tanggalPendaftaran(i),
    submitted: nilai ? nilai[0] : null,
    verified: nilai ? nilai[1] : null,
    rejected: nilai ? nilai[2] : null,
  };
});

const PENANDA_HARIAN = [
  { date: WAKTU_SERVER_ISO, label: 'Hari ini' },
  { date: KALENDER.pendaftaranTutup, label: 'Tenggat' },
];

/** 24 jam terakhir. Puncaknya 20.00 — dasar penentuan jam siaga verifikator. */
const TREN_JAM: readonly TitikJamDTO[] = [
  2, 1, 0, 0, 1, 3, 6, 11, 18, 23, 19, 16, 9, 12, 17, 21, 24, 20, 26, 31, 38, 29, 14, 6,
].map((value, hour) => ({ hour, value }));

const FUNNEL: readonly TahapFunnelDTO[] = [
  { id: 'akun', label: 'Akun dibuat', value: 1512 },
  { id: 'email', label: 'Email terverifikasi', value: 1388 },
  { id: 'dikirim', label: 'Pendaftaran dikirim', value: 1284 },
  { id: 'diverifikasi', label: 'Diverifikasi', value: 936 },
  { id: 'daftar-ulang', label: 'Daftar ulang', value: null, not_started_from: KALENDER.daftarUlang },
  { id: 'check-in', label: 'Check-in', value: null, not_started_from: KALENDER.lombaMulai },
];

/** Sudah terurut menurun — urutan adalah bagian dari desainnya, bukan kebetulan. */
const KOMPOSISI: readonly BarisKomposisiDTO[] = [
  { competition: 'Atletik', individual: 330, team: 72 },
  { competition: 'Badminton', individual: 300, team: 40 },
  { competition: 'Sepak Bola', individual: 0, team: 176 },
  { competition: 'Basket', individual: 0, team: 168 },
  { competition: 'Voli', individual: 0, team: 108 },
  { competition: 'E-Sport', individual: 0, team: 90 },
];

export const GRAFIK: ChartsDTO = {
  daily_registrations: TREN_HARIAN,
  daily_markers: PENANDA_HARIAN,
  hourly_registrations: TREN_JAM,
  funnel: FUNNEL,
  composition: KOMPOSISI,
};

/*
 * Grafik memakai anatomi widget yang sama persis dengan kartu angka: judul,
 * definisi metrik, waktu pembaruan, penanda cakupan, drill-down, dan keempat
 * kondisi. Grafik yang tidak bisa jadi stale atau gagal adalah grafik yang
 * diam-diam berbohong saat sumbernya berhenti.
 */
const WIDGET_GRAFIK: readonly WidgetDTO[] = [
  {
    id: 'grafik-harian',
    title: 'Tren pendaftaran harian',
    status: 'ready',
    value: 1284,
    display_value: '1.284 dikirim',
    denominator_label: '21 Sep – 5 Okt 2026',
    last_updated_at: menitLalu(1),
    definition: {
      counted: 'Pendaftaran dikirim, diverifikasi, dan ditolak per hari kalender.',
      not_counted: 'Draf yang belum dikirim dan pendaftaran yang ditarik peserta.',
      source: 'Basis data pendaftaran',
      recompute_interval_seconds: 300,
    },
    scope: {
      follows_global_filter: false,
      override_label: 'Rentang tetap 21 Sep – 5 Okt · mengabaikan filter periode',
      applied_filters: ['event', 'lomba', 'kategori', 'tipe'],
      ignored_filters: ['periode', 'status', 'venue', 'pertandingan'],
    },
    drill_down: { label: 'Daftar per tanggal', path: '/admin/peserta?kelompok=tanggal', carry_filters: true },
    stale_decision_warning: 'Jangan pakai grafik ini untuk memperkirakan lonjakan menjelang tenggat.',
  },
  {
    id: 'grafik-per-jam',
    title: 'Tren pendaftaran per jam',
    status: 'ready',
    value: 347,
    display_value: '347 pendaftaran',
    denominator_label: '24 jam terakhir',
    last_updated_at: menitLalu(1),
    definition: {
      counted: 'Pendaftaran dikirim, dikelompokkan per jam pengiriman.',
      not_counted: 'Perubahan status setelah pengiriman.',
      source: 'Basis data pendaftaran',
      recompute_interval_seconds: 300,
    },
    scope: {
      follows_global_filter: false,
      override_label: 'Selalu 24 jam terakhir · mengabaikan rentang tanggal',
      applied_filters: ['event', 'lomba', 'kategori', 'tipe'],
      ignored_filters: ['periode', 'status', 'venue', 'pertandingan'],
    },
    drill_down: { label: 'Atur jadwal verifikator', path: '/admin/jadwal?tab=verifikator', carry_filters: false },
    stale_decision_warning: 'Jangan pakai grafik ini untuk menyusun jadwal siaga hari ini.',
  },
  {
    id: 'grafik-funnel',
    title: 'Funnel pendaftaran',
    status: 'ready',
    value: 936,
    display_value: '62% sampai diverifikasi',
    denominator_label: 'dari 1.512 akun dibuat',
    last_updated_at: menitLalu(2),
    definition: {
      counted: 'Jumlah orang yang mencapai tiap tahap, dihitung per akun peserta.',
      not_counted: 'Orang yang mundur ke tahap sebelumnya tetap dihitung pada tahap tertingginya.',
      source: 'Basis data akun dan pendaftaran',
      recompute_interval_seconds: 300,
    },
    scope: {
      follows_global_filter: false,
      override_label: 'Dua tahap pertama tidak terikat lomba',
      applied_filters: ['event', 'lomba', 'kategori', 'tipe'],
      ignored_filters: ['periode', 'status', 'venue', 'pertandingan'],
    },
    drill_down: { label: 'Rincian per tahap', path: '/admin/laporan?tab=funnel', carry_filters: true },
    stale_decision_warning: 'Jangan pakai konversi ini untuk memutuskan pengiriman pengingat massal.',
  },
  {
    id: 'grafik-komposisi',
    title: 'Komposisi individu versus tim',
    status: 'ready',
    value: 1284,
    display_value: '630 individu · 654 lewat tim',
    denominator_label: '6 lomba dalam cakupanmu',
    last_updated_at: menitLalu(2),
    definition: {
      counted: 'Peserta terverifikasi dan menunggu, dipisah menurut cara mendaftar.',
      not_counted: 'Pendaftaran ditolak dan yang ditarik peserta.',
      source: 'Basis data pendaftaran',
      recompute_interval_seconds: 300,
    },
    scope: {
      follows_global_filter: true,
      applied_filters: ['event', 'lomba', 'kategori', 'tipe', 'periode'],
      ignored_filters: ['status', 'venue', 'pertandingan'],
    },
    drill_down: { label: 'Daftar per tipe peserta', path: '/admin/peserta?kelompok=tipe', carry_filters: true },
    stale_decision_warning: 'Jangan pakai komposisi ini untuk memesan jumlah medali.',
  },
];

/*
 * Jumlah terpakainya harus cocok dengan widget "Peserta dan tim per lomba" di
 * atasnya — 24 tim Basket di sini adalah 24 tim yang sama. Satuannya mengikuti
 * tipe cabang: cabang tim menghitung tim, Atletik yang perorangan menghitung
 * orang.
 */
const KUOTA_PENUH: readonly QuotaRowDTO[] = [
  { competition: 'Basket', used: 24, capacity: 24, unit: 'tim', state: 'waitlist' },
  { competition: 'Sepak Bola', used: 22, capacity: 24, unit: 'tim', state: 'tight' },
  { competition: 'Voli', used: 18, capacity: 20, unit: 'tim', state: 'tight' },
  { competition: 'Atletik', used: 402, capacity: 480, unit: 'peserta', state: 'open' },
];

// ---------------------------------------------------------------------------
// Tab Operasional — antrean yang menunggu tindakan orang
// ---------------------------------------------------------------------------

const WIDGET_OPERASIONAL: readonly WidgetDTO[] = [
  {
    id: 'menunggu-verifikasi',
    title: 'Menunggu verifikasi',
    status: 'ready',
    value: 148,
    denominator_label: 'dari 1.284 pendaftaran',
    highlight: { label: 'Antrean tertua', value: '2 hari 4 jam', meta: 'dikirim 26 Sep 2026, 05.30' },
    breakdown: [
      { label: 'Masuk hari ini', value: '37' },
      { label: 'Selesai ditinjau hari ini', value: '52', tone: 'ok' },
    ],
    last_updated_at: menitLalu(2),
    definition: {
      counted: 'Pendaftaran berstatus dikirim yang belum diputuskan panitia, per pendaftaran.',
      not_counted: 'Draf, pendaftaran yang sudah diputuskan, dan daftar tunggu.',
      source: 'Basis data pendaftaran',
      recompute_interval_seconds: 60,
    },
    scope: CAKUPAN_ANTREAN,
    drill_down: {
      label: 'Buka antrean tertua',
      path: '/admin/verifikasi?status=menunggu&urut=tertua',
      carry_filters: true,
    },
    stale_decision_warning: 'Jangan pakai angka ini untuk membagi beban verifikator hari ini.',
    tone: 'warn',
    emphasis: true,
  },
  {
    id: 'perlu-perbaikan',
    title: 'Perlu perbaikan / ditolak',
    status: 'ready',
    value: 200,
    denominator_label: 'perbaikan 176 · ditolak 24',
    highlight: {
      label: 'Alasan tersering',
      value: 'Foto kartu pelajar tidak terbaca — 61',
      meta: 'Surat izin sekolah belum ditandatangani — 44',
    },
    last_updated_at: menitLalu(2),
    definition: {
      counted: 'Pendaftaran yang dikembalikan untuk diperbaiki, dan yang ditolak final.',
      not_counted: 'Pendaftaran yang sudah diperbaiki lalu diverifikasi ulang.',
      source: 'Basis data pendaftaran',
      recompute_interval_seconds: 60,
    },
    scope: CAKUPAN_ANTREAN,
    drill_down: {
      label: 'Distribusi alasan',
      path: '/admin/verifikasi?status=perbaikan',
      carry_filters: true,
    },
    stale_decision_warning: 'Jangan pakai angka ini untuk memutuskan perpanjangan tenggat.',
    tone: 'danger',
  },
  {
    id: 'peserta-terverifikasi',
    title: 'Peserta terverifikasi',
    status: 'ready',
    value: 936,
    denominator_label: '73% dari 1.284 pendaftaran',
    last_updated_at: menitLalu(1),
    definition: {
      counted: 'Pendaftaran berstatus terverifikasi, dihitung per peserta bukan per dokumen.',
      not_counted: 'Akun tanpa pendaftaran, draf, pendaftaran dibatalkan, dan daftar tunggu.',
      source: 'Basis data pendaftaran',
      recompute_interval_seconds: 60,
    },
    scope: CAKUPAN_ANTREAN,
    drill_down: {
      label: 'Worklist terverifikasi',
      path: '/admin/verifikasi?status=terverifikasi',
      carry_filters: true,
    },
    stale_decision_warning: 'Jangan pakai angka ini untuk mencetak daftar hadir.',
    tone: 'ok',
  },
  {
    id: 'check-in',
    title: 'Check-in',
    status: 'not_started',
    value: null,
    last_updated_at: menitLalu(1),
    not_started: {
      reason:
        'Check-in mulai di AKPOL. Belum ada pindaian, jadi belum ada angka — bukan nol.',
      meaningful_from: KALENDER.lombaMulai,
    },
    definition: {
      counted: 'Pindaian QR yang diterima petugas pada hari berjalan.',
      not_counted: 'Pindaian ditolak dan duplikat — keduanya dihitung terpisah.',
      source: 'Layanan check-in, aliran langsung',
      recompute_interval_seconds: 30,
    },
    scope: {
      follows_global_filter: false,
      override_label: 'Selalu hari ini · mengabaikan rentang tanggal',
      applied_filters: ['event', 'lomba', 'venue'],
      ignored_filters: ['periode', 'kategori', 'tipe', 'status', 'pertandingan'],
    },
    drill_down: { label: 'Monitoring check-in', path: '/admin/check-in', carry_filters: true },
  },
  {
    id: 'pertandingan',
    title: 'Pertandingan',
    status: 'not_started',
    value: null,
    last_updated_at: menitLalu(2),
    not_started: {
      reason:
        'Jadwal dirilis setelah technical meeting. Status terjadwal, berlangsung, selesai, ditunda, dan dibatalkan akan muncul di sini.',
      meaningful_from: KALENDER.technicalMeeting,
    },
    definition: {
      counted: 'Pertandingan yang sudah punya slot jadwal, dikelompokkan per status.',
      not_counted: 'Bagan yang belum diundi.',
      source: 'Basis data pertandingan',
      recompute_interval_seconds: 60,
    },
    scope: {
      follows_global_filter: true,
      applied_filters: ['event', 'lomba', 'venue', 'periode', 'pertandingan'],
      ignored_filters: ['status'],
    },
    drill_down: { label: 'Kontrol pertandingan', path: '/admin/pertandingan', carry_filters: true },
  },
];

export const PERINGATAN: readonly AlertRowDTO[] = [
  {
    id: 'antrean-tertua',
    severity: 'danger',
    subject: 'Antrean verifikasi melewati 48 jam',
    detail: '12 pendaftaran menunggu lebih dari 2 hari. Tenggat pendaftaran tinggal 7 hari.',
    since: menitLalu(3124),
    action: { label: 'Buka antrean tertua', path: '/admin/verifikasi?urut=tertua' },
  },
  {
    id: 'kuota-penuh',
    severity: 'danger',
    competition: 'Basket',
    subject: 'Basket penuh',
    detail: '24 dari 24 tim terisi. Pendaftar berikutnya otomatis masuk daftar tunggu.',
    since: menitLalu(410),
    action: { label: 'Pengaturan kuota', path: '/admin/lomba?tab=kuota' },
  },
  {
    id: 'notifikasi-gagal',
    severity: 'warn',
    subject: 'Notifikasi gagal terkirim',
    detail: '61 notifikasi gagal — 47 email, 14 in-app. Peserta belum tentu tahu status barunya.',
    since: menitLalu(63),
    action: { label: 'Coba ulang yang gagal', path: '/admin/sinkronisasi?tab=notifikasi' },
  },
  {
    id: 'email-belum-verifikasi',
    severity: 'warn',
    subject: '124 akun belum verifikasi email',
    detail: 'Akun ini tidak bisa menerima pemberitahuan jadwal dan hasil.',
    since: menitLalu(180),
    action: { label: 'Daftar akun', path: '/admin/peserta?email=belum-verifikasi' },
  },
];

// ---------------------------------------------------------------------------
// Tab Sistem — integrasi dan kesehatan
// ---------------------------------------------------------------------------

function kesehatan(keadaan: 'ok' | 'degraded' | 'down'): HealthDTO {
  const sheets =
    keadaan === 'ok'
      ? { state: 'ok' as const, summary: 'Sinkron · keterlambatan di bawah 1 menit' }
      : { state: 'degraded' as const, summary: 'Sedang berjalan · keterlambatan 13 menit' };

  const notifikasi =
    keadaan === 'down'
      ? { state: 'down' as const, summary: 'Gagal 61 — email 47 · in-app 14' }
      : { state: 'ok' as const, summary: 'Antre 12 · terkirim 4.820 · sampai 4.611' };

  const layanan = [
    {
      id: 'sheets',
      name: 'Sinkronisasi Google Sheets',
      state: sheets.state,
      summary: sheets.summary,
      details: ['Sukses terakhir 28 Sep 2026, 09.30', 'Baris tersinkron 1.284'],
      checked_at: menitLalu(1),
    },
    {
      id: 'notifikasi',
      name: 'Notifikasi',
      state: notifikasi.state,
      summary: notifikasi.summary,
      // Kanal HANYA email dan in-app (batasan SRS §13.1). Jangan menambah kanal.
      details: ['Kanal: email dan in-app', 'Antre 12', 'Terkirim 4.820'],
      checked_at: menitLalu(1),
    },
    { id: 'api', name: 'API', state: 'ok' as const, summary: 'Normal · p95 180 ms', details: ['Galat 5xx 0,02%'], checked_at: menitLalu(0) },
    { id: 'database', name: 'Database', state: 'ok' as const, summary: 'Normal · koneksi 24/100', details: ['Replikasi tertunda 0 detik'], checked_at: menitLalu(0) },
    { id: 'redis', name: 'Redis', state: 'ok' as const, summary: 'Normal · memori 38%', details: ['Antrean tertunda 13 menit'], checked_at: menitLalu(0) },
    { id: 'penyimpanan', name: 'Penyimpanan', state: 'ok' as const, summary: 'Normal · disk 68%', details: ['Cadangan terakhir 28 Sep 2026, 03.00'], checked_at: menitLalu(0) },
  ];

  const bermasalah = layanan.filter((l) => l.state !== 'ok');

  return {
    state: keadaan,
    services_total: layanan.length,
    services_unhealthy: bermasalah.length,
    unhealthy_names: bermasalah.map((l) => l.name),
    last_checked_at: menitLalu(0),
    services: layanan,
  };
}

/**
 * Skenario kesehatan bisa diganti saat pengembangan:
 *   ADMIN_DEMO_KESEHATAN=ok | degraded | down
 * Bawaannya `down` supaya pil peringatan di topbar dan tautannya ke tab Sistem
 * terlihat tanpa perlu disetel — itu jalur yang paling mudah lolos tanpa diuji.
 */
export function kesehatanDemo(): HealthDTO {
  const mentah = process.env.ADMIN_DEMO_KESEHATAN?.trim();
  if (mentah === 'ok' || mentah === 'degraded' || mentah === 'down') return kesehatan(mentah);
  return kesehatan('down');
}

/**
 * Memaksa satu widget masuk kondisi gagal, untuk membuktikan kegagalan satu
 * widget tidak menjatuhkan yang lain (AC #5):
 *   ADMIN_DEMO_GALAT=peserta-per-lomba
 */
function terapkanGalatDemo(widget: readonly WidgetDTO[]): readonly WidgetDTO[] {
  const target = process.env.ADMIN_DEMO_GALAT?.trim();
  if (!target) return widget;

  return widget.map((w) =>
    w.id !== target
      ? w
      : {
          ...w,
          status: 'error' as const,
          value: null,
          // Pesan galat tidak memuat data pribadi (FE-PRIV-001).
          error: {
            ref: 'ERR-DASH-7Q2M',
            reason_code: 'UPSTREAM_TIMEOUT',
            attempted_at: menitLalu(0),
          },
        },
  );
}

/**
 * Mempersempit widget ke cakupan akun. Angka per lomba diambil ulang dari
 * `BASIS_LOMBA`; angka turunan yang tidak bisa dipecah per lomba (antrean
 * verifikasi, funnel, tren) diskalakan menurut pangsa cakupan.
 *
 * Total akun peserta dan dua tahap pertama funnel sengaja TIDAK diskalakan —
 * keduanya sudah menyatakan diri tidak terikat lomba, karena satu akun bisa
 * mendaftar di beberapa cabang dan tidak bisa dibagi ke salah satunya.
 */
function sesuaikanCakupan(widget: readonly WidgetDTO[], c: RingkasCakupan): readonly WidgetDTO[] {
  if (c.pangsa >= 1) return widget;
  const puncak = c.lomba.reduce((n, l) => Math.max(n, l.individu + l.timPeserta), 0);

  return widget.map((w): WidgetDTO => {
    switch (w.id) {
      case 'total-pendaftaran':
        return {
          ...w,
          value: c.total,
          breakdown: [
            { label: 'Individu', value: formatAngka(c.individu) },
            { label: 'Tim', value: `${formatAngka(c.timPeserta)} peserta · ${c.tim} tim` },
          ],
        };

      case 'peserta-per-lomba':
        return {
          ...w,
          value: c.lomba.length,
          display_value: `${c.lomba.length} lomba`,
          breakdown: c.lomba.map((l) => {
            const jumlah = l.individu + l.timPeserta;
            return {
              label: l.nama,
              value: `${formatAngka(jumlah)} peserta · ${l.tim} tim`,
              share: puncak === 0 ? 0 : jumlah / puncak,
            };
          }),
        };

      case 'kuota-lomba': {
        const baris = KUOTA_PENUH.filter((k) => c.lomba.some((l) => l.nama === k.competition));
        const penuh = baris.filter((k) => k.state === 'waitlist').length;
        const hampir = baris.filter((k) => k.state === 'tight').length;
        return {
          ...w,
          value: penuh,
          display_value: `${penuh} lomba penuh`,
          denominator_label: `${hampir} hampir penuh`,
          scope: {
            ...w.scope,
            override_label: `${baris.length} dari ${c.lomba.length} lomba cakupanmu punya kuota`,
          },
        };
      }

      case 'grafik-harian': {
        const nilai = jumlahHarian(harianSkala(c.pangsa));
        return { ...w, value: nilai, display_value: `${formatAngka(nilai)} dikirim` };
      }

      case 'grafik-per-jam': {
        const nilai = jumlahJam(jamSkala(c.pangsa));
        return { ...w, value: nilai, display_value: `${formatAngka(nilai)} pendaftaran` };
      }

      case 'grafik-funnel': {
        const diverifikasi = skala(w.value ?? 0, c.pangsa);
        return {
          ...w,
          value: diverifikasi,
          display_value: `${Math.round((diverifikasi / Math.max(c.total, 1)) * 100)}% sampai diverifikasi`,
          denominator_label: `dari ${formatAngka(c.total)} pendaftaran dikirim`,
        };
      }

      case 'grafik-komposisi':
        return {
          ...w,
          value: c.total,
          display_value: `${formatAngka(c.individu)} individu · ${formatAngka(c.timPeserta)} lewat tim`,
          denominator_label: `${c.lomba.length} lomba dalam cakupanmu`,
        };

      case 'menunggu-verifikasi': {
        const nilai = skala(w.value ?? 0, c.pangsa);
        return {
          ...w,
          value: nilai,
          denominator_label: `dari ${formatAngka(c.total)} pendaftaran`,
          breakdown: w.breakdown?.map((b) => ({
            ...b,
            value: formatAngka(skala(Number(String(b.value).replace(/\D/g, '')), c.pangsa)),
          })),
        };
      }

      case 'perlu-perbaikan': {
        const perbaikan = skala(176, c.pangsa);
        const ditolak = skala(24, c.pangsa);
        return {
          ...w,
          value: perbaikan + ditolak,
          denominator_label: `perbaikan ${perbaikan} · ditolak ${ditolak}`,
        };
      }

      case 'peserta-terverifikasi': {
        const nilai = skala(w.value ?? 0, c.pangsa);
        return {
          ...w,
          value: nilai,
          denominator_label: `${Math.round((nilai / Math.max(c.total, 1)) * 100)}% dari ${formatAngka(c.total)} pendaftaran`,
        };
      }

      default:
        return w;
    }
  });
}

export function widgetUntukTab(tab: TabDashboard, cakupan: readonly string[]): readonly WidgetDTO[] {
  if (tab === 'sistem') return [];
  const dasar = tab === 'lomba' ? [...WIDGET_LOMBA, ...WIDGET_GRAFIK] : WIDGET_OPERASIONAL;
  return terapkanGalatDemo(sesuaikanCakupan(dasar, ringkasCakupan(cakupan)));
}

export function kuotaUntuk(cakupan: readonly string[]): readonly QuotaRowDTO[] {
  return KUOTA_PENUH.filter((k) => cakupan.includes(k.competition));
}

export function grafikUntuk(cakupan: readonly string[]): ChartsDTO {
  const c = ringkasCakupan(cakupan);
  if (c.pangsa >= 1) return GRAFIK;

  return {
    ...GRAFIK,
    daily_registrations: harianSkala(c.pangsa),
    hourly_registrations: jamSkala(c.pangsa),
    // Dua tahap pertama menghitung akun, bukan pendaftaran, jadi tidak ikut menyempit.
    funnel: FUNNEL.map((f) =>
      f.value === null || f.id === 'akun' || f.id === 'email'
        ? f
        : { ...f, value: skala(f.value, c.pangsa) },
    ),
    composition: KOMPOSISI.filter((k) => cakupan.includes(k.competition)),
  };
}

/** Peringatan yang menyebut satu lomba hanya tampil bila lomba itu dipegang. */
export function peringatanUntuk(cakupan: readonly string[]): readonly AlertRowDTO[] {
  return PERINGATAN.filter((p) => !p.competition || cakupan.includes(p.competition));
}

export const NAV_PANITIA: readonly MenuAdmin[] = [
  { href: '/admin/dashboard', label: 'Dashboard', ikon: 'grid' },
  { href: '/admin/peserta', label: 'Peserta', ikon: 'orangBanyak' },
  { href: '/admin/verifikasi', label: 'Verifikasi', ikon: 'centang' },
  { href: '/admin/lomba', label: 'Lomba', ikon: 'piala' },
  { href: '/admin/jadwal', label: 'Jadwal', ikon: 'kalender' },
  { href: '/admin/pertandingan', label: 'Pertandingan', ikon: 'piala' },
  { href: '/admin/check-in', label: 'Check-in', ikon: 'qr' },
  { href: '/admin/sponsor', label: 'Sponsor', ikon: 'piagam' },
  { href: '/admin/cms', label: 'CMS', ikon: 'berkas' },
  { href: '/admin/laporan', label: 'Laporan', ikon: 'grid' },
  { href: '/admin/sinkronisasi', label: 'Sinkronisasi', ikon: 'ulang' },
];
