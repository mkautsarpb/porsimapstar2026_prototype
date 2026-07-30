'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import styles from './HeaderMenu.module.css';

export interface MenuItem {
  readonly href: string;
  readonly label: string;
}

interface Props {
  readonly menu: readonly MenuItem[];
}

/**
 * Tombol titik tiga untuk mobile: navigasi utama disembunyikan ke dalam dropdown
 * supaya baris header tidak membungkus jadi tiga baris di layar sempit.
 * Pola disclosure (bukan `role="menu"`) karena isinya tautan biasa — Tab, Enter,
 * dan Escape bekerja tanpa keyboard handler tambahan (agents.md §7).
 */
export function HeaderMenu({ menu }: Props) {
  const [buka, setBuka] = useState(false);
  const panelId = `${useId()}-menu-mobile`;
  const wrapRef = useRef<HTMLDivElement>(null);
  const tombolRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  // Fokus masuk ke tautan pertama saat dibuka supaya urutan Tab langsung nyambung.
  useEffect(() => {
    if (!buka) return;
    const id = requestAnimationFrame(() => panelRef.current?.querySelector('a')?.focus());
    return () => cancelAnimationFrame(id);
  }, [buka]);

  // Klik di luar menutup panel.
  useEffect(() => {
    if (!buka) return;
    const onPointerDown = (e: PointerEvent): void => {
      const target = e.target;
      if (target instanceof Node && wrapRef.current?.contains(target)) return;
      setBuka(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [buka]);

  // Panel hanya ada di mobile: kalau viewport melebar ke desktop, state ikut ditutup
  // supaya nav inline tidak tumpang tindih dengan dropdown yang masih terbuka.
  useEffect(() => {
    if (!buka) return;
    const mq = window.matchMedia('(min-width: 768px)');
    const onChange = (e: MediaQueryListEvent): void => {
      if (e.matches) setBuka(false);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [buka]);

  const tutupDanKembalikanFokus = (): void => {
    setBuka(false);
    tombolRef.current?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>): void => {
    if (e.key !== 'Escape' || !buka) return;
    e.preventDefault();
    tutupDanKembalikanFokus();
  };

  return (
    <div ref={wrapRef} onKeyDown={onKeyDown} className={styles.wrap}>
      <button
        type="button"
        ref={tombolRef}
        aria-expanded={buka}
        aria-controls={panelId}
        aria-label={buka ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
        onClick={() => setBuka((v) => !v)}
        className={styles.trigger}
      >
        <span aria-hidden="true" className={styles.dots}>
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </span>
      </button>

      {buka ? (
        <nav
          id={panelId}
          ref={panelRef}
          aria-label="Navigasi utama"
          className={styles.panel}
        >
          {menu.map((m) => (
            <a key={m.href} href={m.href} onClick={() => setBuka(false)} className={styles.link}>
              {m.label}
            </a>
          ))}
          <a href="#daftar" onClick={() => setBuka(false)} className={styles.cta}>
            Buat akun
          </a>
        </nav>
      ) : null}
    </div>
  );
}
