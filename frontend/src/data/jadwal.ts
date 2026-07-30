/**
 * Jadwal resmi PORSIMAPTAR 2026 — semua waktu WIB (UTC+7). Satu sumber kebenaran.
 *
 * TODO(api-contract): tanggal acuan seharusnya datang dari server supaya countdown
 * tidak bisa dimanipulasi lewat jam lokal perangkat (agents.md §5).
 */
export const JADWAL = {
  daftarBuka: new Date('2026-09-21T00:00:00+07:00').getTime(),
  daftarTutup: new Date('2026-10-05T23:59:59+07:00').getTime(),
  mulai: new Date('2026-10-26T07:00:00+07:00').getTime(),
  selesai: new Date('2026-10-30T22:00:00+07:00').getTime(),
} as const;

export const TANGGAL_ACARA = '26–30 Oktober 2026';
export const PERIODE_PENDAFTARAN = '21 September – 5 Oktober 2026';
export const LOKASI_ACARA = 'Akademi Kepolisian, Semarang';
export const BATAS_PENDAFTARAN = 'Pendaftaran ditutup 5 Oktober 2026, 23.59 WIB';
