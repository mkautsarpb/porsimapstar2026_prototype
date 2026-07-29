import { JADWAL } from '@/data/jadwal';

export interface UnitCountdown {
  readonly value: string;
  readonly label: string;
}

export interface StatusCountdown {
  readonly label: string;
  /** Sudah lewat seluruh rangkaian — countdown diganti kalimat penutup. */
  readonly selesai: boolean;
  readonly units: readonly UnitCountdown[];
  /** Teks untuk aria-live; angka detik sengaja tidak diucapkan (agents.md §7). */
  readonly spoken: string;
}

export const KALIMAT_PENUTUP =
  'Rangkaian PORSIMAPTAR 2026 telah selesai. Terima kasih untuk 17 cabang dan seluruh kontingen.';

const pad = (n: number): string => String(Math.max(0, n)).padStart(2, '0');

/** Fase mana yang sedang dihitung mundur, berdasarkan waktu `now`. */
export function hitungCountdown(now: number): StatusCountdown {
  let target: number | null = JADWAL.daftarBuka;
  let label = 'Pendaftaran dibuka dalam';

  if (now >= JADWAL.selesai) {
    target = null;
    label = 'PORSIMAPTAR 2026 telah selesai';
  } else if (now >= JADWAL.daftarTutup) {
    target = JADWAL.mulai;
    label = 'PORSIMAPTAR dimulai dalam';
  } else if (now >= JADWAL.daftarBuka) {
    target = JADWAL.daftarTutup;
    label = 'Pendaftaran ditutup dalam';
  }

  // Perbandingan ditulis inline supaya TypeScript ikut mempersempit tipe `target`.
  const selesai = target === null;
  const sisa = target === null ? 0 : Math.max(0, target - now);

  const hari = Math.floor(sisa / 86_400_000);
  const jam = Math.floor(sisa / 3_600_000) % 24;
  const menit = Math.floor(sisa / 60_000) % 60;
  const detik = Math.floor(sisa / 1000) % 60;

  return {
    label,
    selesai,
    units: [
      { value: pad(hari), label: 'Hari' },
      { value: pad(jam), label: 'Jam' },
      { value: pad(menit), label: 'Menit' },
      { value: pad(detik), label: 'Detik' },
    ],
    spoken: selesai
      ? 'PORSIMAPTAR 2026 telah selesai.'
      : `${label} ${hari} hari ${jam} jam ${menit} menit.`,
  };
}
