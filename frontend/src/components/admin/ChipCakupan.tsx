import { Ikon } from '@/components/app/Ikon';
import styles from './ChipCakupan.module.css';

/**
 * Penanda cakupan — hanya muncul bila widget MENYIMPANG dari filter global.
 *
 * Bawaannya patuh: widget yang mengikuti seluruh filter tidak memakai chip apa
 * pun. Kalau setiap kartu diberi penanda, penandanya berhenti berarti dan
 * penyimpangan yang sungguhan jadi tidak terlihat.
 */
export function ChipCakupan({ label }: { readonly label: string }) {
  return (
    <span className={styles.chip}>
      <Ikon nama="seru" ukuran={12} tebal={2.2} />
      {label}
    </span>
  );
}
