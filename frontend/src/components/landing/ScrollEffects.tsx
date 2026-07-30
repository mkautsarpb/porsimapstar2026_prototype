'use client';

import { useReveal } from '@/hooks/useReveal';
import { useScrollTargets } from '@/hooks/useScrollTargets';
import styles from './ScrollEffects.module.css';

/**
 * Satu komponen yang memasang seluruh efek berbasis scroll: penggerak elemen
 * yang terikat scroll, reveal saat elemen terlihat, dan bar progres di paling
 * atas viewport. Tidak merender konten apa pun selain bar itu.
 */
export function ScrollEffects() {
  useScrollTargets('atas');
  useReveal();

  return <div aria-hidden="true" data-scroll-bar="" className={styles.progress} />;
}
