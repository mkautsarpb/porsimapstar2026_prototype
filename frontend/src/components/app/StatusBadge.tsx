import { LABEL_STATUS } from '@/data/peserta';
import type { StatusPendaftaran } from '@/types/peserta';
import { Ikon } from './Ikon';
import ui from './ui.module.css';

/**
 * Badge status pendaftaran. Selalu ikon + teks — status tidak boleh disampaikan
 * lewat warna saja (agents.md §7).
 */
export function StatusBadge({
  status,
  besar = false,
}: {
  readonly status: StatusPendaftaran;
  readonly besar?: boolean;
}) {
  const { label, nada, ikon } = LABEL_STATUS[status];

  return (
    <span data-nada={nada} className={`${ui.badge} ${besar ? ui.badgeBesar : ''}`}>
      <Ikon nama={ikon} ukuran={besar ? 14 : 12} tebal={2.2} />
      {label}
    </span>
  );
}
