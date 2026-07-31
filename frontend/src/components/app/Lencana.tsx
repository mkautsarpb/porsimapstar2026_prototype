import type { Nada, NamaIkon } from '@/types/peserta';
import { Ikon } from './Ikon';
import ui from './ui.module.css';

/**
 * Lencana status: selalu ikon + teks, tidak pernah warna saja (agents.md §7).
 * Primitif bersama untuk seluruh status area peserta — pendaftaran, undangan,
 * dokumen, dan kelengkapan anggota (CLAUDE.md aturan 2).
 */
export function Lencana({
  label,
  nada = 'netral',
  ikon,
  besar = false,
}: {
  readonly label: string;
  readonly nada?: Nada;
  readonly ikon?: NamaIkon;
  readonly besar?: boolean;
}) {
  return (
    <span data-nada={nada} className={`${ui.badge} ${besar ? ui.badgeBesar : ''}`}>
      {ikon ? <Ikon nama={ikon} ukuran={besar ? 14 : 12} tebal={2.2} /> : null}
      {label}
    </span>
  );
}
