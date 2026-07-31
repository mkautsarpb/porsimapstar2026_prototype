import { LABEL_STATUS } from '@/data/peserta';
import type { StatusPendaftaran } from '@/types/peserta';
import { Lencana } from './Lencana';

/**
 * Badge status pendaftaran. Pembungkus tipis di atas `Lencana` yang memetakan
 * status pendaftaran ke label, nada, dan ikonnya.
 */
export function StatusBadge({
  status,
  besar = false,
}: {
  readonly status: StatusPendaftaran;
  readonly besar?: boolean;
}) {
  const { label, nada, ikon } = LABEL_STATUS[status];

  return <Lencana label={label} nada={nada} ikon={ikon} besar={besar} />;
}
