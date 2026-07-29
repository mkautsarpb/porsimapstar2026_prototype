import { RANGKAIAN_ACARA } from '@/data/konten';
import shared from './shared.module.css';
import styles from './EventsSection.module.css';

export function EventsSection() {
  return (
    <section id="acara" data-fill="var(--color-surface-2)" className={shared.sectionLight}>
      <div aria-hidden="true" className={shared.hlineWrap}>
        <span data-hline="1" className={shared.hline} />
      </div>

      <div className={shared.container}>
        <div data-reveal="1" className={styles.intro}>
          <p className={shared.eyebrow}>Rangkaian acara</p>
          <h2 className={shared.heading}>Bukan cuma pertandingan.</h2>
          <p className={shared.lead}>
            Empat agenda terbuka di luar lomba — tidak perlu mendaftar cabang untuk ikut menikmatinya.
          </p>
        </div>

        <div className={styles.grid}>
          {RANGKAIAN_ACARA.map((a) => (
            <div key={a.nama} data-reveal="1" className={styles.card}>
              <span className={styles.date}>{a.tanggal}</span>
              <h3 className={styles.name}>{a.nama}</h3>
              <p className={styles.place}>{a.tempat}</p>
              <p className={styles.detail}>{a.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
