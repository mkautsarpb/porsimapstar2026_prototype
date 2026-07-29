import type { CSSProperties } from 'react';
import { SPONSORS } from '@/data/konten';
import shared from './shared.module.css';
import styles from './SponsorsSection.module.css';

type MarkStyle = CSSProperties & Record<'--mark-color', string>;

/**
 * TODO(api-contract): sponsor masih hardcoded dengan kotak warna sebagai
 * pengganti logo. Saat CMS sponsor siap, ganti `mark` dengan <Image> logo resmi.
 */
export function SponsorsSection() {
  return (
    <section aria-label="Sponsor dan mitra" data-fill="var(--color-surface-1)" className={styles.section}>
      <div aria-hidden="true" className={shared.hlineWrap}>
        <span data-hline="1" className={shared.hline} />
      </div>

      <div className={shared.container}>
        <p data-reveal="1" className={styles.label}>
          Didukung oleh
        </p>

        <div className={styles.grid}>
          {SPONSORS.map((sp) => {
            const markStyle: MarkStyle = { '--mark-color': sp.warna };
            return (
              <div key={sp.nama} data-reveal="1" title={sp.nama} className={styles.card}>
                <div className={styles.inner}>
                  <span aria-hidden="true" className={styles.mark} style={markStyle} />
                  <span className={styles.name}>{sp.nama}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
