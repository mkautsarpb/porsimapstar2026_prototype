'use client';

import { useId, useState } from 'react';
import { FAQS } from '@/data/konten';
import shared from './shared.module.css';
import styles from './FaqSection.module.css';

/** Akordeon FAQ — satu terbuka pada satu waktu, item pertama terbuka sejak awal. */
export function FaqSection() {
  const [terbuka, setTerbuka] = useState<number>(0);
  const idAwal = useId();

  return (
    <section id="tanya" data-fill="var(--color-surface-2)" className={shared.sectionLight}>
      <div aria-hidden="true" className={shared.hlineWrap}>
        <span data-hline="1" className={shared.hline} />
      </div>
      <div aria-hidden="true" className={`${shared.glow} ${styles.glow}`} />

      <div className={shared.containerNarrow}>
        <div data-reveal="1" className={styles.intro}>
          <p className={shared.eyebrow}>Tanya jawab</p>
          <h2 className={shared.heading}>Yang paling sering ditanyakan.</h2>
        </div>

        <div className={styles.list}>
          {FAQS.map((f, i) => {
            const open = terbuka === i;
            const panelId = `${idAwal}-faq-${i}`;
            const triggerId = `${panelId}-trigger`;

            return (
              <div key={f.q} data-reveal="1" className={styles.item}>
                <button
                  type="button"
                  id={triggerId}
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setTerbuka(open ? -1 : i)}
                  className={styles.trigger}
                >
                  <span>{f.q}</span>
                  <span aria-hidden="true" className={open ? styles.iconOpen : styles.icon}>
                    +
                  </span>
                </button>

                {open ? (
                  <div id={panelId} role="region" aria-labelledby={triggerId} className={styles.answer}>
                    {f.a}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
