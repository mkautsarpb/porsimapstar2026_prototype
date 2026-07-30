'use client';

import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import { BINTANG_DEKAT, BINTANG_JAUH, BINTANG_KELIP, BINTANG_TENGAH, type Bintang } from '@/lib/bintang';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import styles from './AuroraBackground.module.css';

/** Nilai per-bintang disalurkan sebagai custom property; keyframe-nya cuma dua. */
type StarStyle = CSSProperties & Record<'--tw-min' | '--tw-max' | '--star-dur' | '--star-delay', string>;

function gayaBintang(s: Bintang): StarStyle {
  return {
    left: s.x,
    top: s.y,
    width: s.size,
    height: s.size,
    opacity: Number(s.mid),
    '--tw-min': s.min,
    '--tw-max': s.max,
    '--star-dur': s.dur,
    '--star-delay': s.delay,
  };
}

function LapisanBintang({
  bintang,
  className,
  geser,
  kelip = false,
}: {
  readonly bintang: readonly Bintang[];
  /** Berasal dari CSS module, yang bertipe index signature — bisa undefined. */
  readonly className: string | undefined;
  /** Jarak geser parallax dalam px pada progres scroll penuh; makin dekat, makin jauh. */
  readonly geser: number;
  readonly kelip?: boolean;
}) {
  return (
    <div data-parallax={geser} className={`${styles.starLayer} ${className}`}>
      {bintang.map((s, i) => (
        <span key={`${s.x}-${s.y}-${i}`} className={kelip ? styles.sparkle : styles.star} style={gayaBintang(s)} />
      ))}
    </div>
  );
}

/**
 * Aurora hanya terlihat saat section bertema gelap ada di viewport — di area
 * terang ia memudar supaya tidak mengotori latar putih.
 */
export function AuroraBackground() {
  const auroraRef = useRef<HTMLDivElement>(null);
  const meteorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const aurora = auroraRef.current;
    if (!aurora) return;

    const gelap = Array.from(document.querySelectorAll('[data-dark]'));
    if (gelap.length === 0) return;

    const terlihat = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) terlihat.add(e.target);
          else terlihat.delete(e.target);
        });
        // Kelas, bukan style.opacity — supaya visibility ikut dimatikan dan
        // blur di dalamnya berhenti dirasterisasi saat berada di area terang.
        aurora.className = (terlihat.size > 0 ? styles.aurora : styles.auroraTersembunyi) ?? '';
      },
      { threshold: [0] },
    );

    gelap.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Bintang jatuh: satu elemen dipakai ulang, jeda acak 8–18 detik, tidak pernah tumpang.
  useEffect(() => {
    const meteor = meteorRef.current;
    const trail = trailRef.current;
    if (!meteor || !trail || reduced) return;
    if (window.innerWidth < 768) return;

    let timer: number | undefined;
    let berjalan = false;
    const rand = (a: number, b: number): number => a + Math.random() * (b - a);

    const antre = (): void => {
      window.clearTimeout(timer);
      timer = window.setTimeout(tembak, rand(8000, 18000));
    };

    const tembak = (): void => {
      if (berjalan || document.visibilityState !== 'visible') return;

      const langka = Math.random() < 0.2;
      const len = langka ? rand(120, 150) : rand(60, 110);
      const deg = rand(28, 34);
      const rad = (deg * Math.PI) / 180;

      // Sepertiga atas, koridor kiri atau kanan — menjauh dari teks hero.
      const kiri = Math.random() < 0.5;
      const x = ((kiri ? rand(1, 14) : rand(60, 92)) / 100) * window.innerWidth;
      const y = (rand(2, 10) / 100) * window.innerHeight;
      const dist = langka ? rand(520, 640) : rand(360, 500);

      meteor.style.left = `${x}px`;
      meteor.style.top = `${y}px`;
      trail.style.width = `${len}px`;
      trail.style.transform = `rotate(${deg}deg)`;
      trail.style.opacity = langka ? '1' : '0.85';
      meteor.style.setProperty('--mt-dx', `${(Math.cos(rad) * dist).toFixed(1)}px`);
      meteor.style.setProperty('--mt-dy', `${(Math.sin(rad) * dist).toFixed(1)}px`);
      meteor.style.animation = 'none';
      void meteor.offsetWidth;
      meteor.style.willChange = 'transform,opacity';
      meteor.style.animation = `cw-meteor ${(langka ? 1200 : rand(700, 1100)).toFixed(0)}ms linear both`;
      berjalan = true;
    };

    const onEnd = (): void => {
      berjalan = false;
      meteor.style.opacity = '0';
      meteor.style.willChange = 'auto';
      antre();
    };

    const onVis = (): void => {
      if (document.visibilityState === 'visible') antre();
      else window.clearTimeout(timer);
    };

    meteor.addEventListener('animationend', onEnd);
    document.addEventListener('visibilitychange', onVis);
    timer = window.setTimeout(tembak, rand(6000, 12000));

    return () => {
      window.clearTimeout(timer);
      meteor.removeEventListener('animationend', onEnd);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [reduced]);

  return (
    <div aria-hidden="true" ref={auroraRef} className={styles.aurora}>
      <div className={styles.blobLayer}>
        <div className={`${styles.blob} ${styles.blobA}`} />
        <div className={`${styles.blob} ${styles.blobB}`} />
        <div className={`${styles.blob} ${styles.blobC}`} />
      </div>

      <LapisanBintang bintang={BINTANG_JAUH} className={styles.starFar} geser={-90} />
      <LapisanBintang bintang={BINTANG_TENGAH} className={styles.starMid} geser={-150} />
      <LapisanBintang bintang={BINTANG_DEKAT} className={styles.starNear} geser={-240} />

      <div ref={meteorRef} className={styles.meteor}>
        <div ref={trailRef} className={styles.meteorTrail}>
          <span aria-hidden="true" className={styles.meteorHead} />
        </div>
      </div>

      <LapisanBintang bintang={BINTANG_KELIP} className={styles.starSparkle} geser={-240} kelip />
    </div>
  );
}
