'use client';

import { useEffect } from 'react';
import { useReducedMotion } from './useReducedMotion';

/**
 * Reveal saat elemen masuk viewport.
 *
 * Elemen ditandai `data-reveal`; delay bertahap dihitung dari urutan elemen
 * dalam induk yang sama supaya kartu dalam satu grid muncul beruntun.
 * Saat `prefers-reduced-motion` aktif, semua langsung terlihat tanpa animasi.
 */
export function useReveal(): void {
  const reduced = useReducedMotion();

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (els.length === 0) return;

    if (reduced) {
      els.forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    const urutanDalamInduk = new Map<Element | null, number>();
    els.forEach((el) => {
      const induk = el.parentElement;
      const i = urutanDalamInduk.get(induk) ?? 0;
      urutanDalamInduk.set(induk, i + 1);

      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition =
        'opacity 450ms cubic-bezier(0.22,1,0.36,1), transform 450ms cubic-bezier(0.22,1,0.36,1)';
      el.style.transitionDelay = `${Math.min(i * 70, 490)}ms`;
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.intersectionRatio >= 0.14 || e.isIntersecting) {
            const el = e.target as HTMLElement;
            el.style.opacity = '1';
            el.style.transform = 'none';
            io.unobserve(el);
          }
        });
      },
      { threshold: [0.15] },
    );

    els.forEach((el) => io.observe(el));

    // Garis gradien pemisah section: tumbuh dari tengah saat terlihat.
    const lines = Array.from(document.querySelectorAll<HTMLElement>('[data-hline]'));
    const lineIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).style.transform = 'scaleX(1)';
            lineIo.unobserve(e.target);
          }
        });
      },
      { threshold: [0.01], rootMargin: '0px 0px -10% 0px' },
    );
    lines.forEach((el) => lineIo.observe(el));

    return () => {
      io.disconnect();
      lineIo.disconnect();
    };
  }, [reduced]);
}
