/**
 * Pemformatan angka dan waktu area admin.
 *
 * Seluruh formatter mengunci locale `id-ID` dan zona `Asia/Jakarta` secara
 * eksplisit. Tanpa itu, server (UTC) dan browser (WIB) menghasilkan teks berbeda
 * untuk ISO yang sama, dan React melaporkannya sebagai hydration mismatch.
 */

const ZONA = 'Asia/Jakarta';

const fAngka = new Intl.NumberFormat('id-ID');

const fWaktu = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: ZONA,
});

const fTanggal = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: ZONA,
});

const fHariTanggal = new Intl.DateTimeFormat('id-ID', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: ZONA,
});

export function formatAngka(nilai: number): string {
  return fAngka.format(nilai);
}

export function formatPersen(bagian: number, total: number): string {
  if (total <= 0) return '0%';
  return `${Math.round((bagian / total) * 100)}%`;
}

/** "28 Sep 2026, 09.41" */
export function formatWaktu(iso: string): string {
  return fWaktu.format(new Date(iso));
}

/** "26 Oktober 2026" */
export function formatTanggal(iso: string): string {
  return fTanggal.format(new Date(iso));
}

/** "Senin, 28 September 2026 · 09.43 WIB" */
export function formatWaktuServer(iso: string): string {
  return `${fHariTanggal.format(new Date(iso)).replace(' pukul ', ' · ')} WIB`;
}

/**
 * Umur data dalam kalimat pendek: "40 detik", "2 menit", "1 jam 31 menit",
 * "2 hari 4 jam". Dua satuan terbesar saja — presisi detik pada data berumur
 * hari tidak menambah keputusan apa pun.
 */
export function formatUmur(detik: number): string {
  const aman = Math.max(0, Math.floor(detik));
  if (aman < 60) return `${aman} detik`;

  const menit = Math.floor(aman / 60);
  if (menit < 60) return `${menit} menit`;

  const jam = Math.floor(menit / 60);
  const sisaMenit = menit % 60;
  if (jam < 24) return sisaMenit > 0 ? `${jam} jam ${sisaMenit} menit` : `${jam} jam`;

  const hari = Math.floor(jam / 24);
  const sisaJam = jam % 24;
  return sisaJam > 0 ? `${hari} hari ${sisaJam} jam` : `${hari} hari`;
}

/** Baris kaki widget: "Diperbarui 2 menit lalu · 28 Sep 2026, 09.41". */
export function teksDiperbarui(iso: string, umurDetik: number): string {
  return `Diperbarui ${formatUmur(umurDetik)} lalu · ${formatWaktu(iso)}`;
}
