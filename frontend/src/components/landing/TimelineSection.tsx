import type { CSSProperties } from 'react';
import { LINIMASA } from '@/data/konten';
import shared from './shared.module.css';
import styles from './TimelineSection.module.css';

type SunStyle = CSSProperties & Record<'--sun-top' | '--sun-size' | '--sun-color' | '--sun-glow', string>;

export function TimelineSection() {
  return (
    <section id="jadwal" data-dark="1" className={shared.sectionDark}>
      <div aria-hidden="true" className={shared.hlineWrap}>
        <span data-hline="1" className={shared.hline} />
      </div>

      <div className={shared.container}>
        <div data-reveal="1" className={styles.intro}>
          <p className={shared.eyebrowGold}>Linimasa</p>
          <h2 className={shared.headingLight}>Empat tahap sampai kamu bertanding.</h2>
        </div>

        <div className={styles.track}>
          <div aria-hidden="true" className={styles.rail} />

          {LINIMASA.map((t) => {
            const sunStyle: SunStyle = {
              '--sun-top': t.sunTop,
              '--sun-size': t.sunSize,
              '--sun-color': t.sunColor,
              '--sun-glow': t.sunGlow,
            };

            return (
              <div key={t.no} data-reveal="1" className={styles.step}>
                <span aria-hidden="true" className={styles.sun} style={sunStyle} />
                <p className={styles.meta}>
                  {t.no} · {t.tanggal}
                </p>
                <h3 className={styles.title}>{t.judul}</h3>
                <p className={styles.detail}>{t.detail}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
