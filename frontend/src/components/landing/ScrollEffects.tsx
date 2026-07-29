'use client';

import { useReveal } from '@/hooks/useReveal';
import { useScrollMetrics } from '@/hooks/useScrollMetrics';
import styles from './ScrollEffects.module.css';

/**
 * Satu komponen yang memasang seluruh efek berbasis scroll:
 * variabel posisi scroll, reveal saat elemen terlihat, dan bar progres di
 * paling atas viewport. Tidak merender konten apa pun selain bar itu.
 */
export function ScrollEffects() {
  useScrollMetrics('atas');
  useReveal();

  return <div aria-hidden="true" className={styles.progress} />;
}
