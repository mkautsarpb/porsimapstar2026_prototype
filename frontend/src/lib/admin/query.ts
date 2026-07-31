/**
 * Pembacaan `searchParams` halaman modul admin.
 *
 * `lib/admin/filter-url.ts` mengurus himpunan filter dashboard yang tetap dan
 * bernilai enum tertutup. Halaman modul filternya berbeda-beda, jadi yang
 * dibutuhkan di sini bukan kamus filter melainkan tiga hal kecil: membaca satu
 * kunci dengan aman, membaca nomor halaman, dan menyusun ulang query saat
 * berpindah halaman tanpa menjatuhkan filter yang sedang aktif (AC-FE-13).
 *
 * Nilai yang tidak dikenal SELALU jatuh ke bawaan, tidak pernah dipakai apa
 * adanya: query URL bisa ditulis siapa saja, dan meneruskannya mentah-mentah ke
 * pencocokan data membuat halaman bergantung pada masukan yang tidak divalidasi.
 */

export type Query = Readonly<Record<string, string | readonly string[] | undefined>>;

/** Membaca satu kunci. Array (kunci ditulis dua kali) diambil elemen pertamanya. */
export function bacaKunci(query: Query, kunci: string, bawaan: string): string {
  const mentah = query[kunci];
  const nilai = Array.isArray(mentah) ? mentah[0] : mentah;
  return typeof nilai === 'string' && nilai.trim() !== '' ? nilai : bawaan;
}

/** Membaca kunci yang nilainya harus salah satu dari daftar sah. */
export function bacaEnum<T extends string>(
  query: Query,
  kunci: string,
  sah: readonly T[],
  bawaan: T,
): T {
  const nilai = bacaKunci(query, kunci, bawaan);
  return (sah as readonly string[]).includes(nilai) ? (nilai as T) : bawaan;
}

export function bacaHalaman(query: Query, totalHalaman: number): number {
  const angka = Number.parseInt(bacaKunci(query, 'halaman', '1'), 10);
  if (!Number.isFinite(angka) || angka < 1) return 1;
  return Math.min(angka, Math.max(1, totalHalaman));
}

/**
 * Menyusun href dengan query yang sama, hanya menimpa kunci yang disebut.
 * Nilai `undefined` menghapus kuncinya — dipakai tombol Reset.
 */
export function susunHref(
  dasar: string,
  query: Query,
  ubah: Readonly<Record<string, string | undefined>> = {},
): string {
  const params = new URLSearchParams();

  for (const [kunci, nilai] of Object.entries(query)) {
    if (kunci in ubah) continue;
    const satu = Array.isArray(nilai) ? nilai[0] : nilai;
    if (typeof satu === 'string' && satu !== '') params.set(kunci, satu);
  }

  for (const [kunci, nilai] of Object.entries(ubah)) {
    if (typeof nilai === 'string' && nilai !== '') params.set(kunci, nilai);
  }

  const teks = params.toString();
  return teks === '' ? dasar : `${dasar}?${teks}`;
}
