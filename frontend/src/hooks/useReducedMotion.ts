'use client';

import { useEffect, useState } from 'react';

/**
 * Melaporkan preferensi `prefers-reduced-motion` (agents.md §7).
 * Default `false` di render pertama supaya markup server dan client cocok;
 * nilai sebenarnya masuk setelah mount.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);

    const onChange = (e: MediaQueryListEvent): void => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
