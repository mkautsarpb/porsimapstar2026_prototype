import Image from 'next/image';
import Link from 'next/link';
import { Countdown } from './Countdown';
import styles from './Hero.module.css';

/**
 * Hero: logo, headline tema Cakrawala, garis cakrawala dengan cahaya fajar,
 * countdown, lalu dua aksi utama. `data-dark` menandai section ini bertema gelap
 * sehingga aurora latar ikut menyala saat ia terlihat.
 */
export function Hero() {
  return (
    <section id="atas" data-dark="1" className={styles.hero}>
      <div aria-hidden="true" className={styles.vignette} />
      <div aria-hidden="true" className={styles.curveWrap}>
        <div data-parallax-y="0.14" className={styles.curve} />
      </div>

      <div data-hero-fade="" className={styles.top}>
        <Image
          src="/uploads/porsimaptar-trim.png"
          alt="Logo resmi PORSIMAPTAR 2026 — Pekan Olahraga dan Seni Mahasiswa, Pelajar, dan Taruna Akademi Kepolisian"
          width={120}
          height={64}
          priority
          className={styles.logo}
        />

        <div className={styles.headlineBlock}>
          <p className={styles.kicker}>Pekan olahraga &amp; seni ke-XXVI</p>
          <h1 className={styles.headline}>
            <span className={styles.headlineMain}>Cakrawala</span>
            <span className={styles.tagline}>Bersaing dengan sportivitas,</span>
            <span className={styles.taglineSecond}>bersatu dalam solidaritas.</span>
          </h1>
          <p className={styles.intro}>
            17 cabang lomba di Akademi Kepolisian Semarang, 26–30 Oktober 2026. Pendaftaran dibuka untuk mahasiswa,
            pelajar SMA/sederajat, dan taruna.
          </p>
        </div>
      </div>

      <div className={styles.lower}>
        {/*
         * Garis cakrawala dan cahaya fajarnya WAJIB memakai faktor parallax yang
         * sama. Kalau salah satu statis, cahayanya turun sendiri saat digulir dan
         * terlihat terlepas dari garisnya — keduanya satu objek visual.
         */}
        <div aria-hidden="true" data-parallax-y="0.08" className={styles.horizonLine}>
          <span />
        </div>

        <div aria-hidden="true" className={styles.dawn}>
          <div data-parallax-y="0.08" className={styles.dawnInner}>
            <div className={styles.dawnGlow} />
            <div className={styles.grain} />
          </div>
        </div>

        <div data-hero-fade="" className={styles.actionsWrap}>
          <Countdown />

          <div id="daftar" className={styles.buttons}>
            <Link href="/daftar" className={styles.ctaPrimary}>
              Buat akun
            </Link>
            <a href="#lomba" className={styles.ctaGhost}>
              Lihat daftar lomba
            </a>
          </div>

          <p className={styles.note}>Gratis · Verifikasi dokumen 1×24 jam · Kuota per lomba terbatas</p>
        </div>
      </div>
    </section>
  );
}
