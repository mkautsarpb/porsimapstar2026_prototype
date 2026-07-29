'use client';

import { useEffect, useRef, useState } from 'react';
import { STATISTIK } from '@/data/konten';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import styles from './StatsStrip.module.css';

const DURASI_HITUNG = 900;

/**
 * Strip angka utama. Angka numerik dihitung naik sekali saat strip masuk
 * viewport; nilai non-numerik ("Terbatas") tampil apa adanya.
 *
 * Kuota total peserta belum diumumkan resmi — strip ini sengaja tanpa angka kuota.
 */
export function StatsStrip() {
  const ref = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reduced) {
      setProgress(1);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();

        const mulai = performance.now();
        const tick = (t: number): void => {
          const p = Math.min((t - mulai) / DURASI_HITUNG, 1);
          // easeOutCubic — cepat di awal lalu melambat mendekati angka akhir.
          setProgress(1 - Math.pow(1 - p, 3));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: [0.3] },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <section ref={ref} aria-label="Angka utama" className={styles.strip}>
      <div className={styles.inner}>
        {STATISTIK.map((s) => (
          <div key={s.label} data-reveal="1" className={styles.item}>
            <div className={styles.value}>
              {typeof s.nilai === 'number' ? Math.round(s.nilai * progress).toLocaleString('id-ID') : s.nilai}
            </div>
            <div className={styles.label}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
