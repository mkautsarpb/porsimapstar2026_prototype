'use client';

import { useEffect } from 'react';
import { langgananScroll } from '@/lib/scroll-driver';
import { useReducedMotion } from './useReducedMotion';

/**
 * Menyiarkan posisi scroll ke CSS custom property di `<html>`:
 *
 * - `--scroll-progress` 0..1 untuk progress bar dan parallax lambat
 * - `--scroll-y` piksel mentah untuk parallax hero
 * - `--hero-fade` opacity hero yang meredup saat digulir
 *
 * Semua nilai datang dari `scroll-driver`, yang sudah membaca layout sekali di
 * awal frame — hook ini murni menulis (target INP ≤ 200 ms, agents.md §8).
 */
export function useScrollMetrics(heroId: string): void {
  const reduced = useReducedMotion();

  useEffect(() => {
    const root = document.documentElement;
    // Dicari sekali, bukan tiap frame.
    const hero = document.getElementById(heroId);
    let tinggiHero = hero?.offsetHeight ?? window.innerHeight;

    const perbaruiTinggiHero = (): void => {
      tinggiHero = hero?.offsetHeight ?? window.innerHeight;
    };
    window.addEventListener('resize', perbaruiTinggiHero, { passive: true });

    const berhenti = langgananScroll(({ y, progress }) => {
      root.style.setProperty('--scroll-progress', progress.toFixed(4));
      if (reduced) return;
      root.style.setProperty('--scroll-y', `${y}px`);
      root.style.setProperty('--hero-fade', (1 - Math.min(y / tinggiHero, 1) * 0.65).toFixed(3));
    });

    return () => {
      window.removeEventListener('resize', perbaruiTinggiHero);
      berhenti();
    };
  }, [heroId, reduced]);
}
