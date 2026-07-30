'use client';

import { useEffect, useState } from 'react';

/**
 * Status koneksi browser. Nilai awal selalu `true` supaya HTML server dan hasil
 * hidrasi pertama identik; status sebenarnya dibaca setelah mount.
 */
export function useOnline(): boolean {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const perbarui = () => setOnline(navigator.onLine);
    perbarui();

    window.addEventListener('online', perbarui);
    window.addEventListener('offline', perbarui);

    return () => {
      window.removeEventListener('online', perbarui);
      window.removeEventListener('offline', perbarui);
    };
  }, []);

  return online;
}
