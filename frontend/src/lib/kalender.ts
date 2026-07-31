import type { AgendaSaya } from '@/types/peserta';

/**
 * Pembangun kisi kalender bulanan untuk halaman Jadwal Saya.
 *
 * Semua perhitungan memakai `Date.UTC` supaya hasilnya sama di server dan di
 * browser peserta apa pun zona waktunya — kalender yang bergeser satu hari
 * antara SSR dan hidrasi adalah bug yang sulit dilihat tapi fatal untuk jadwal.
 */

export interface HariKalender {
  readonly iso: string;
  readonly angka: number;
  /** Hari di luar bulan yang ditampilkan (ekor bulan sebelum atau sesudah). */
  readonly luarBulan: boolean;
  readonly agenda: readonly AgendaSaya[];
}

export const NAMA_HARI = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'] as const;

const NAMA_BULAN = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
] as const;

/** `2026-08` → `[2026, 8]`. Nilai tidak valid jatuh ke bulan pertama rangkaian lomba. */
export function pecahBulan(kunci: string): readonly [number, number] {
  const cocok = /^(\d{4})-(\d{2})$/.exec(kunci);
  if (!cocok) return [2026, 8];

  const tahun = Number(cocok[1]);
  const bulan = Number(cocok[2]);

  return bulan >= 1 && bulan <= 12 ? [tahun, bulan] : [2026, 8];
}

export function labelBulan(kunci: string): string {
  const [tahun, bulan] = pecahBulan(kunci);
  return `${NAMA_BULAN[bulan - 1]} ${tahun}`;
}

/** Menggeser kunci bulan sejumlah `langkah` bulan, maju atau mundur. */
export function geserBulan(kunci: string, langkah: number): string {
  const [tahun, bulan] = pecahBulan(kunci);
  const d = new Date(Date.UTC(tahun, bulan - 1 + langkah, 1));

  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
}

/**
 * Membangun kisi lima atau enam pekan (Senin–Minggu) untuk satu bulan, lengkap
 * dengan agenda yang jatuh di tiap harinya.
 */
export function bangunBulan(kunci: string, agenda: readonly AgendaSaya[]): readonly HariKalender[] {
  const [tahun, bulan] = pecahBulan(kunci);
  const pertama = new Date(Date.UTC(tahun, bulan - 1, 1));

  // getUTCDay(): Minggu = 0. Kisi dimulai Senin, jadi Minggu digeser ke akhir pekan.
  const offset = (pertama.getUTCDay() + 6) % 7;

  const hari: HariKalender[] = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(Date.UTC(tahun, bulan - 1, 1 - offset + i));
    const kunciHari = d.toISOString().slice(0, 10);

    return {
      iso: kunciHari,
      angka: d.getUTCDate(),
      luarBulan: d.getUTCMonth() !== pertama.getUTCMonth(),
      agenda: agenda.filter((a) => a.iso === kunciHari),
    };
  });

  // Pekan keenam dibuang bila seluruhnya milik bulan lain — baris kosong hanya
  // menambah tinggi tanpa menambah informasi.
  const pekanTerakhir = hari.slice(35);
  return pekanTerakhir.every((h) => h.luarBulan && h.agenda.length === 0) ? hari.slice(0, 35) : hari;
}
