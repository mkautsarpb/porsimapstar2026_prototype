'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { KONTAK } from '@/data/konten';
import styles from './HeaderMenu.module.css';

export interface MenuItem {
  readonly href: string;
  readonly label: string;
}

interface Props {
  readonly menu: readonly MenuItem[];
}

/**
 * Tombol garis tiga (hamburger) untuk mobile: navigasi utama disembunyikan ke dalam dropdown
 * supaya baris header tidak membungkus jadi tiga baris di layar sempit.
 * Pola disclosure (bukan `role="menu"`) karena isinya tautan biasa — Tab, Enter,
 * dan Escape bekerja tanpa keyboard handler tambahan (agents.md §7).
 *
 * Kontak panitia ikut di sini dan disembunyikan dari footer versi mobile
 * (`SiteFooter.module.css`): tiga blok kontak yang menumpuk membuat footer mobile
 * hampir dua layar penuh, sementara di dropdown cukup satu tap. Kontaknya sendiri
 * dilipat lagi jadi disclosure kedua supaya panel tetap sependek daftar navigasi.
 */
export function HeaderMenu({ menu }: Props) {
  const [buka, setBuka] = useState(false);
  const [kontakBuka, setKontakBuka] = useState(false);
  const uid = useId();
  const panelId = `${uid}-menu-mobile`;
  const kontakId = `${uid}-kontak-mobile`;
  const wrapRef = useRef<HTMLDivElement>(null);
  const tombolRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const kontakRef = useRef<HTMLDivElement>(null);

  // Panel ditutup lewat banyak jalur (tautan, klik luar, Escape, viewport melebar);
  // reset di sini supaya kontak selalu mulai terlipat saat menu dibuka lagi.
  useEffect(() => {
    if (!buka) setKontakBuka(false);
  }, [buka]);

  // Tinggi panel dibatasi, jadi kontak yang baru terbuka bisa jatuh di luar area
  // yang terlihat — geser sedikit supaya isinya langsung kelihatan setelah ditekan.
  useEffect(() => {
    if (!kontakBuka) return;
    const id = requestAnimationFrame(() =>
      kontakRef.current?.scrollIntoView({ block: 'nearest' }),
    );
    return () => cancelAnimationFrame(id);
  }, [kontakBuka]);

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
        <span aria-hidden="true" className={styles.bars}>
          <span className={styles.bar} />
          <span className={styles.bar} />
          <span className={styles.bar} />
        </span>
      </button>

      {buka ? (
        <div id={panelId} ref={panelRef} className={styles.panel}>
          <nav aria-label="Navigasi utama" className={styles.nav}>
            {menu.map((m) => (
              <a key={m.href} href={m.href} onClick={() => setBuka(false)} className={styles.link}>
                {m.label}
              </a>
            ))}
            <Link href="/masuk" onClick={() => setBuka(false)} className={styles.link}>
              Masuk
            </Link>
          </nav>

          {/* CTA sengaja sebelum blok kontak supaya tidak perlu men-scroll panel. */}
          <Link href="/daftar" onClick={() => setBuka(false)} className={styles.cta}>
            Buat akun
          </Link>

          {/* Disclosure kedua: daftar kontak baru turun setelah barisnya ditekan. */}
          <div ref={kontakRef} className={styles.kontak}>
            <button
              type="button"
              aria-expanded={kontakBuka}
              aria-controls={kontakId}
              onClick={() => setKontakBuka((v) => !v)}
              className={styles.kontakTrigger}
            >
              Kontak panitia
              <span aria-hidden="true" className={styles.chevron} />
            </button>

            {kontakBuka ? (
              <div id={kontakId} className={styles.kontakList}>
                {KONTAK.map((k) => (
                  <div key={k.email} className={styles.kontakItem}>
                    <p className={styles.peran}>{k.peran}</p>
                    <p className={styles.nama}>{k.nama}</p>
                    {/* Teks biasa selama nomornya masih bertopeng — `tel:` butuh digit utuh. */}
                    <p className={styles.telp}>{k.telp}</p>
                    <a href={`mailto:${k.email}`} className={styles.email}>
                      {k.email}
                    </a>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
