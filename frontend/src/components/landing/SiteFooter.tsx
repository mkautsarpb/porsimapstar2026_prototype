import Image from 'next/image';
import { ALAMAT_PANITIA, KONTAK } from '@/data/konten';
import shared from './shared.module.css';
import styles from './SiteFooter.module.css';

const TAUTAN = [
  { href: '#tanya', label: 'Tanya jawab' },
  { href: '#jadwal', label: 'Jadwal' },
  // Menunjuk ke blok kontak yang di mobile pindah ke HeaderMenu, jadi ikut disembunyikan.
  { href: '#kontak', label: 'Kontak panitia', hanyaDesktop: true },
] as const;

export function SiteFooter() {
  return (
    <footer data-dark="1" className={styles.footer}>
      <div aria-hidden="true" className={styles.dawn}>
        <div className={styles.dawnLine}>
          <span data-hline="1" className={shared.hline} />
        </div>
        <div className={styles.dawnGlow} />
      </div>

      <div id="kontak" className={styles.top}>
        <Image
          src="/uploads/maskot-sm.webp"
          alt=""
          aria-hidden="true"
          width={503}
          height={520}
          loading="lazy"
          className={styles.mascot}
        />

        <div className={styles.brand}>
          <Image
            src="/uploads/porsimaptar-trim.png"
            alt="Logo PORSIMAPTAR 2026"
            width={101}
            height={54}
            loading="lazy"
            className={styles.logo}
          />
          <p className={styles.address}>
            Panitia PORSIMAPTAR XXVI
            <br />
            {ALAMAT_PANITIA}
          </p>
        </div>

        {/*
          Di mobile blok ini disembunyikan (lihat SiteFooter.module.css) karena
          isinya sudah tersedia di dropdown hamburger — footer mobile jadi ringkas.
        */}
        {KONTAK.map((k) => (
          <div key={k.email} className={styles.contact}>
            <p className={styles.role}>{k.peran}</p>
            <p className={styles.name}>{k.nama}</p>
            <p className={styles.phone}>{k.telp}</p>
            <a href={`mailto:${k.email}`} className={styles.email}>
              {k.email}
            </a>
          </div>
        ))}
      </div>

      <div className={styles.bottom}>
        <p className={styles.copy}>© 2026 Panitia PORSIMAPTAR XXVI · Cakrawala</p>
        <div className={styles.links}>
          {TAUTAN.map((t) => (
            <a
              key={t.href}
              href={t.href}
              className={'hanyaDesktop' in t ? `${styles.link} ${styles.linkDesktop}` : styles.link}
            >
              {t.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
