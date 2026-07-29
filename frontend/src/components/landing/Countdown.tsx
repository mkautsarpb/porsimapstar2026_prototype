'use client';

import { useEffect, useState } from 'react';
import { KALIMAT_PENUTUP, hitungCountdown } from '@/lib/countdown';
import styles from './Hero.module.css';

const PLACEHOLDER = [
  { value: '--', label: 'Hari' },
  { value: '--', label: 'Jam' },
  { value: '--', label: 'Menit' },
  { value: '--', label: 'Detik' },
] as const;

/**
 * Countdown ke fase jadwal berikutnya.
 *
 * `now` sengaja baru diisi setelah mount: waktu berbeda antara server dan client
 * akan memicu hydration mismatch, jadi render pertama menampilkan placeholder
 * (state Loading, agents.md §4) dengan tinggi yang sama supaya tidak ada CLS.
 */
export function Countdown() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const status = now === null ? null : hitungCountdown(now);
  const units = status?.units ?? PLACEHOLDER;

  return (
    <div className={styles.countdownBlock}>
      <p className={styles.countdownLabel}>{status?.label ?? 'Menghitung jadwal terdekat'}</p>

      {/* Hanya menit ke atas yang diucapkan — detik yang berubah tiap detik akan membanjiri screen reader. */}
      <p aria-live="polite" className="sr-only">
        {status?.spoken ?? ''}
      </p>

      {status?.selesai ? (
        <p className={styles.closing}>{KALIMAT_PENUTUP}</p>
      ) : (
        <div aria-hidden="true" className={styles.countdownGrid}>
          {units.map((u) => (
            <div key={u.label} className={styles.unit}>
              <div className={styles.unitValue}>{u.value}</div>
              <div className={styles.unitLabel}>{u.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
