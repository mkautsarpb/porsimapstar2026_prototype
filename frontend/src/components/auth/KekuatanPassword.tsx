import { kekuatanPassword } from '@/lib/validasi-auth';
import styles from './KekuatanPassword.module.css';

const SEGMEN = [0, 1, 2] as const;

/**
 * Meter kekuatan password + checklist syarat. Murni bantuan UX; aturan final
 * tetap milik backend (agents.md §1). Level dibaca screen reader lewat
 * `aria-live` pada labelnya, jadi tidak bergantung warna saja.
 */
export function KekuatanPassword({ id, password }: { readonly id: string; readonly password: string }) {
  const { level, label, segmen, syarat } = kekuatanPassword(password);

  return (
    <div id={id} data-level={level} className={styles.kotak}>
      <div className={styles.baris}>
        <span className={styles.label}>Kekuatan password</span>
        <span aria-live="polite" className={styles.nilai}>
          {label}
        </span>
      </div>

      <div aria-hidden="true" className={styles.meter}>
        {SEGMEN.map((i) => (
          <span key={i} className={i < segmen ? styles.segmenIsi : styles.segmen} />
        ))}
      </div>

      <ul className={styles.syarat}>
        {syarat.map((s) => (
          <li key={s.label} data-ok={s.ok} className={styles.item}>
            <span aria-hidden="true" className={styles.tanda}>
              {s.ok ? '✓' : ''}
            </span>
            <span>{s.label}</span>
            <span className="sr-only">{s.ok ? ' terpenuhi' : ' belum terpenuhi'}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
