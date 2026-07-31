import { Lencana } from '@/components/app/Lencana';
import { LABEL_UNDANGAN } from '@/data/tim';
import type { StatusUndangan } from '@/types/tim';

/** Badge tujuh status undangan. Satu status per undangan, tidak pernah dua. */
export function BadgeUndangan({
  status,
  besar = false,
}: {
  readonly status: StatusUndangan;
  readonly besar?: boolean;
}) {
  const { label, nada, ikon } = LABEL_UNDANGAN[status];

  return <Lencana label={label} nada={nada} ikon={ikon} besar={besar} />;
}
