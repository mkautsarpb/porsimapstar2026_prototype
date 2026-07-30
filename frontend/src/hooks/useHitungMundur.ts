'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Hitungan mundur dalam detik untuk kunci tombol saat rate limit atau jeda kirim
 * ulang (agents.md §4: tampilkan retry time, jangan retry agresif).
 *
 * Mengembalikan sisa detik dan fungsi untuk memulai ulang hitungan.
 */
export function useHitungMundur(): readonly [number, (detik: number) => void] {
  const [sisa, setSisa] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const bersihkan = useCallback(() => {
    if (timer.current !== null) {
      clearInterval(timer.current);
      timer.current = null;
    }
  }, []);

  const mulai = useCallback(
    (detik: number) => {
      bersihkan();
      setSisa(Math.max(0, Math.ceil(detik)));

      if (detik <= 0) return;

      timer.current = setInterval(() => {
        setSisa((v) => {
          if (v <= 1) {
            bersihkan();
            return 0;
          }
          return v - 1;
        });
      }, 1000);
    },
    [bersihkan],
  );

  useEffect(() => bersihkan, [bersihkan]);

  return [sisa, mulai];
}
