import type { NamaIkon } from '@/types/peserta';

/**
 * Ikon garis 24×24 dari desain dashboard. Semua memakai `currentColor` supaya
 * warnanya ikut teks di sekitarnya, dan `aria-hidden` karena maknanya selalu
 * disampaikan lagi lewat teks di sebelahnya (agents.md §7).
 */
const JALUR: Record<NamaIkon, readonly string[]> = {
  grid: ['M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z'],
  piala: [
    'M8 4h8v5a4 4 0 0 1-8 0V4Z',
    'M8 5.5H5.5v1.5a3 3 0 0 0 3 3M16 5.5h2.5V7a3 3 0 0 1-3 3',
    'M10 17.5h4M12 13.5v4M9 20.5h6',
  ],
  orangBanyak: [
    'M16 19v-1.5A3.5 3.5 0 0 0 12.5 14h-5A3.5 3.5 0 0 0 4 17.5V19',
    'M13 7.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
    'M17.2 14.2A3.5 3.5 0 0 1 20 17.6V19',
    'M16 5.4a3 3 0 0 1 0 5.4',
  ],
  kalender: [
    'M4 6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5v12A1.5 1.5 0 0 1 18.5 20h-13A1.5 1.5 0 0 1 4 18.5v-12Z',
    'M4 10h16',
    'M8 3v4M16 3v4',
  ],
  berkas: ['M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z', 'M14 3v5h5', 'M9 13.5h6M9 17h4'],
  orang: ['M20 20v-1a5 5 0 0 0-5-5H9a5 5 0 0 0-5 5v1', 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0'],
  bantuan: [
    'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0',
    'M9.7 9.4a2.4 2.4 0 1 1 3.3 2.3c-.8.3-1.1.9-1.1 1.6v.3',
    'M12 17h.01',
  ],
  titik: ['M12 5.5h.01', 'M12 12h.01', 'M12 18.5h.01'],
  gear: [
    'M12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z',
    'M19.5 12c0-.6-.1-1.1-.2-1.6l2-1.5-2-3.4-2.3 1a7.6 7.6 0 0 0-2.8-1.6L13.8 2h-3.6l-.4 2.9c-1 .3-2 .9-2.8 1.6l-2.3-1-2 3.4 2 1.5a7.6 7.6 0 0 0 0 3.2l-2 1.5 2 3.4 2.3-1c.8.7 1.8 1.3 2.8 1.6l.4 2.9h3.6l.4-2.9c1-.3 2-.9 2.8-1.6l2.3 1 2-3.4-2-1.5c.1-.5.2-1 .2-1.6Z',
  ],
  piagam: ['M6 3h9l4 4v14H6z', 'M15 3v4h4', 'M9 12h6M9 16h4'],
  jam: ['M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0', 'M12 7.5V12l2.8 1.8'],
  centang: ['M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0', 'm8.4 12.4 2.5 2.5 4.6-5.1'],
  seru: [
    'M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z',
    'M12 9.5v4',
    'M12 17h.01',
  ],
  silang: ['M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0', 'M15 9l-6 6M9 9l6 6'],
  ulang: ['M3 12a9 9 0 0 1 15.5-6.2L21 8', 'M21 4v4h-4'],
  amplop: ['M3.5 6.5A1.5 1.5 0 0 1 5 5h14a1.5 1.5 0 0 1 1.5 1.5v11A1.5 1.5 0 0 1 19 19H5a1.5 1.5 0 0 1-1.5-1.5v-11Z', 'm4 7 8 5.5L20 7'],
  qr: ['M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4z', 'M14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z'],
  telepon: [
    'M6.5 3.5h3l1.5 4-2 1.3a12 12 0 0 0 5.2 5.2l1.3-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2Z',
    'M13 3.5h.01',
  ],
  chat: ['M20.5 12a7.5 7.5 0 0 1-10.9 6.7L4.5 20l1.3-5.1A7.5 7.5 0 1 1 20.5 12Z', 'M9 12h6'],
  lonceng: ['M18 8.5a6 6 0 1 0-12 0c0 6-2 7.5-2 7.5h16s-2-1.5-2-7.5Z', 'M13.7 19.5a2 2 0 0 1-3.4 0'],
  panah: ['m9 6 6 6-6 6'],
  lokasi: ['M20 10.5c0 5.2-8 11-8 11s-8-5.8-8-11a8 8 0 1 1 16 0Z', 'M12 13a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z'],
  unduh: ['M12 4v10', 'm8 11 4 4 4-4', 'M5 19h14'],
};

interface IkonProps {
  readonly nama: NamaIkon;
  readonly ukuran?: number;
  readonly tebal?: number;
  readonly className?: string;
}

export function Ikon({ nama, ukuran = 20, tebal = 1.8, className }: IkonProps) {
  return (
    <svg
      width={ukuran}
      height={ukuran}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={tebal}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {JALUR[nama].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
