import type { BabakBagan, BarisPertandingan, RiwayatHasil } from '@/types/admin';

/**
 * Fixture modul Pertandingan — desain "Batch E3 · Pertandingan dan Check-in".
 *
 * TODO(api-contract): diganti oleh
 *   GET  /api/v1/admin/matches?date=&competition=&venue=&status=
 *   GET  /api/v1/admin/matches/{id}/bracket
 *   POST /api/v1/admin/matches/{id}/result
 *        body { score_a, score_b, winner_id, special_win?, confirm, idempotency_key }
 *        200  { reference_id, advanced_to: { round, slot, scheduled_at }, notified_count }
 *   POST /api/v1/admin/matches/{id}/result/correction   // butuh izin koordinator
 *
 * Jam skenario modul ini BUKAN 28 September: hari-H memakai
 * **Selasa, 27 Oktober 2026, 13.42 WIB** — hari kedua perlombaan di AKPOL.
 */

export const WAKTU_HARI_H_ISO = '2026-10-27T13:42:00+07:00';

export const PERTANDINGAN_HARI_INI: readonly BarisPertandingan[] = [
  {
    id: 'mtc-pf1',
    jamJadwal: '13.00',
    terlambatMenit: 35,
    jamMulaiAktual: '13.35',
    cabang: 'Basket Putra',
    babak: 'Penyisihan C',
    pesertaA: 'Garuda Biru',
    pesertaB: 'Elang Timur',
    venue: 'GOR AKPOL — Lap 1',
    status: 'berlangsung',
    skor: '34 – 28',
    skorMeta: 'kuarter 3',
    catatanStatus: null,
    bolehCatat: true,
  },
  {
    id: 'mtc-debat-sf',
    jamJadwal: '13.00',
    terlambatMenit: 18,
    jamMulaiAktual: '13.18',
    cabang: 'Debat Bahasa Indonesia',
    babak: 'Semifinal',
    pesertaA: 'Debat Poltekkes A',
    pesertaB: 'Nusantara Satu',
    venue: 'Aula Utama',
    status: 'berlangsung',
    skor: null,
    skorMeta: 'Belum ada skor',
    catatanStatus: null,
    bolehCatat: true,
  },
  {
    id: 'mtc-voli-pa',
    jamJadwal: '14.00',
    terlambatMenit: null,
    jamMulaiAktual: null,
    cabang: 'Voli Putra',
    babak: 'Penyisihan A',
    pesertaA: 'Elang Timur',
    pesertaB: 'Samudra Voli',
    venue: 'Lapangan Voli',
    status: 'terjadwal',
    skor: null,
    skorMeta: null,
    catatanStatus: '18 menit lagi',
    bolehCatat: false,
  },
  {
    id: 'mtc-basket-putri-b',
    jamJadwal: '11.00',
    terlambatMenit: null,
    jamMulaiAktual: '11.00',
    cabang: 'Basket Putri',
    babak: 'Penyisihan B',
    pesertaA: 'Srikandi',
    pesertaB: 'Melati Putih',
    venue: 'GOR AKPOL — Lap 2',
    status: 'selesai',
    skor: '58 – 47',
    skorMeta: 'Srikandi',
    catatanStatus: null,
    bolehCatat: true,
  },
  {
    id: 'mtc-voli-putri-a',
    jamJadwal: '10.00',
    terlambatMenit: null,
    jamMulaiAktual: '10.00',
    cabang: 'Voli Putri',
    babak: 'Penyisihan A',
    pesertaA: 'Srikandi Voli',
    pesertaB: 'Bahari Putri',
    venue: 'Lapangan Voli',
    status: 'selesai',
    skor: '3 – 1',
    skorMeta: 'Srikandi Voli',
    catatanStatus: null,
    bolehCatat: true,
  },
  {
    id: 'mtc-basket-a',
    jamJadwal: '09.00',
    terlambatMenit: null,
    jamMulaiAktual: '09.00',
    cabang: 'Basket Putra',
    babak: 'Penyisihan A',
    pesertaA: 'Garuda Biru',
    pesertaB: 'Taruna Bahari',
    venue: 'GOR AKPOL — Lap 1',
    status: 'selesai',
    skor: '62 – 55',
    skorMeta: 'Garuda Biru',
    catatanStatus: null,
    bolehCatat: true,
  },
  {
    id: 'mtc-futsal-b',
    jamJadwal: '12.00',
    terlambatMenit: null,
    jamMulaiAktual: null,
    cabang: 'Futsal Putra',
    babak: 'Penyisihan B',
    pesertaA: 'Bahari FC',
    pesertaB: 'Samudra Muda',
    venue: 'Lapangan Futsal',
    status: 'ditunda',
    skor: null,
    skorMeta: null,
    catatanStatus: 'Hujan · ditunda ke 28 Okt, 09.00 · jadwal baru sudah terbit',
    bolehCatat: false,
  },
  {
    id: 'mtc-voli-putra-b',
    jamJadwal: '08.00',
    terlambatMenit: null,
    jamMulaiAktual: null,
    cabang: 'Voli Putra',
    babak: 'Penyisihan B',
    pesertaA: 'Elang Timur',
    pesertaB: 'Bahari Voli',
    venue: 'Lapangan Voli',
    status: 'dibatalkan',
    skor: 'WO',
    skorMeta: 'Elang Timur',
    catatanStatus: 'Walkout lawan',
    bolehCatat: true,
  },
];

export const BAGAN_BASKET_PUTRA: readonly BabakBagan[] = [
  {
    id: 'penyisihan',
    label: 'Penyisihan',
    jumlahLaga: 8,
    catatan: '4 laga penyisihan lain berada di luar area yang terlihat — geser kanvas.',
    laga: [
      {
        id: 'p1',
        a: { nama: 'Garuda Biru', skor: '62' },
        b: { nama: 'Taruna Bahari', skor: '55' },
        keadaan: 'selesai',
        meta: null,
      },
      {
        id: 'p2',
        a: { nama: 'Elang Timur', skor: '70' },
        b: { nama: 'Samudra Muda', skor: '51' },
        keadaan: 'selesai',
        meta: null,
      },
      {
        id: 'p3',
        a: { nama: 'Bahari Muda', skor: '48' },
        b: { nama: 'Nusantara Satu', skor: '44' },
        keadaan: 'selesai',
        meta: null,
      },
      {
        id: 'p4',
        a: { nama: 'Melati Putih', skor: '59' },
        b: { nama: 'Taruna Muda', skor: '52' },
        keadaan: 'selesai',
        meta: null,
      },
    ],
  },
  {
    id: 'perempat',
    label: 'Perempat final',
    jumlahLaga: 4,
    catatan: null,
    laga: [
      {
        id: 'pf1',
        a: { nama: 'Garuda Biru', skor: '34' },
        b: { nama: 'Elang Timur', skor: '28' },
        keadaan: 'berlangsung',
        meta: 'Berlangsung · kuarter 3 · +35 menit',
      },
      {
        id: 'pf2',
        a: { nama: 'Bahari Muda', skor: '55' },
        b: { nama: 'Melati Putih', skor: '49' },
        keadaan: 'selesai',
        meta: null,
      },
    ],
  },
  {
    id: 'semifinal',
    label: 'Semifinal',
    jumlahLaga: 2,
    catatan: null,
    laga: [
      {
        id: 'sf1',
        a: { nama: 'Pemenang PF-1', skor: null },
        b: { nama: 'Bahari Muda', skor: null },
        keadaan: 'menunggu',
        meta: '28 Okt, 09.00 · Lap 1',
      },
    ],
  },
  {
    id: 'final',
    label: 'Final',
    jumlahLaga: 1,
    catatan: null,
    laga: [
      {
        id: 'f1',
        a: { nama: 'Pemenang SF-1', skor: null },
        b: { nama: 'Pemenang SF-2', skor: null },
        keadaan: 'menunggu',
        meta: '29 Okt, 15.00 · Lap 1',
      },
    ],
  },
];

export const RIWAYAT_HASIL: readonly RiwayatHasil[] = [
  {
    id: 'kor-3310',
    waktuIso: '2026-10-27T13:05:00+07:00',
    oleh: 'Ipda Sari Wulandari',
    peran: 'Koordinator lomba',
    perubahan: '58–47 Srikandi → 47–58 Melati Putih',
    alasan: 'Skor tertukar saat pencatatan',
    ref: 'KOR-3310',
  },
  {
    id: 'hsl-7690',
    waktuIso: '2026-10-27T12:30:00+07:00',
    oleh: 'Bayu Setiawan',
    peran: 'Operator pertandingan',
    perubahan: 'Belum ada hasil → 58–47 Srikandi',
    alasan: 'Pencatatan pertama',
    ref: 'HSL-7690',
  },
];
