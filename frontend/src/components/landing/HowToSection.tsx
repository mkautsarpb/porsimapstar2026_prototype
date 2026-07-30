import Link from 'next/link';
import { LANGKAH_DAFTAR } from '@/data/konten';
import shared from './shared.module.css';
import styles from './HowToSection.module.css';

export function HowToSection() {
  return (
    <section id="cara" data-fill="var(--color-surface-2)" className={shared.sectionLight}>
      <div aria-hidden="true" className={shared.hlineWrap}>
        <span data-hline="1" className={shared.hline} />
      </div>
      <div aria-hidden="true" data-parallax="-70" className={`${shared.glow} ${styles.glow}`} />

      <div className={shared.container}>
        <div data-reveal="1" className={styles.intro}>
          <p className={shared.eyebrow}>Cara mendaftar</p>
          <h2 className={shared.heading}>Empat langkah, sekitar 10 menit.</h2>
        </div>

        <div className={styles.grid}>
          {LANGKAH_DAFTAR.map((s) => (
            <div key={s.no} data-reveal="1" className={styles.card}>
              <span className={styles.stepNo}>{s.no}</span>
              <h3 className={styles.title}>{s.judul}</h3>
              <p className={styles.detail}>{s.detail}</p>
            </div>
          ))}
        </div>

        <div data-reveal="1" className={styles.banner}>
          <div className={styles.bannerText}>
            <p className={styles.bannerTitle}>Siap mengunci tempatmu?</p>
            <p className={styles.bannerNote}>Akun bisa dibuat sekarang, dokumen menyusul sebelum 5 Oktober.</p>
          </div>
          <Link href="/daftar" className={styles.bannerCta}>
            Buat akun
          </Link>
        </div>
      </div>
    </section>
  );
}
