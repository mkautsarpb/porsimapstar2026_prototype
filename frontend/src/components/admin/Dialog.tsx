'use client';

import { useCallback, useEffect, useId, useRef, type ReactNode } from 'react';
import { Ikon } from '@/components/app/Ikon';
import styles from './Dialog.module.css';

const TERFOKUS =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Dialog modal Panel Panitia.
 *
 * Tiga hal yang wajib ada dan gampang dilupakan (agents.md §7): fokus terkunci
 * di dalam dialog selama terbuka, Esc menutup, dan fokus kembali ke elemen yang
 * membukanya. Yang ketiga paling sering hilang — tanpa itu pengguna keyboard
 * terlempar ke awal halaman setiap kali menutup dialog, dan pada layar keputusan
 * verifikasi itu berarti kehilangan posisi di antrean 64 dokumen.
 *
 * Tidak memakai `<dialog showModal>` bawaan: `::backdrop` belum bisa memakai
 * token warna yang sama di seluruh peramban target, dan perilaku Esc-nya
 * melewati state React sehingga tombol pemicu tidak tahu dialognya sudah tutup.
 */
export function Dialog({
  terbuka,
  onTutup,
  judul,
  sub,
  lebar = 'sedang',
  children,
}: {
  readonly terbuka: boolean;
  readonly onTutup: () => void;
  readonly judul: string;
  readonly sub?: string;
  readonly lebar?: 'sedang' | 'lebar';
  readonly children: ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const pemicuRef = useRef<HTMLElement | null>(null);
  const judulId = useId();

  const tutup = useCallback(() => {
    onTutup();
  }, [onTutup]);

  useEffect(() => {
    if (!terbuka) return;

    pemicuRef.current = document.activeElement as HTMLElement | null;

    const panel = panelRef.current;
    const pertama = panel?.querySelector<HTMLElement>(TERFOKUS);
    pertama?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        tutup();
        return;
      }

      if (e.key !== 'Tab' || !panel) return;

      const dapatDifokus = Array.from(panel.querySelectorAll<HTMLElement>(TERFOKUS)).filter(
        (el) => el.offsetParent !== null,
      );
      if (dapatDifokus.length === 0) return;

      const awal = dapatDifokus[0]!;
      const akhir = dapatDifokus[dapatDifokus.length - 1]!;

      if (e.shiftKey && document.activeElement === awal) {
        e.preventDefault();
        akhir.focus();
      } else if (!e.shiftKey && document.activeElement === akhir) {
        e.preventDefault();
        awal.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    const gulirAsli = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = gulirAsli;
      pemicuRef.current?.focus();
    };
  }, [terbuka, tutup]);

  if (!terbuka) return null;

  return (
    <div className={styles.lapis}>
      <button
        type="button"
        aria-label="Tutup dialog"
        tabIndex={-1}
        onClick={tutup}
        className={styles.tirai}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={judulId}
        data-lebar={lebar}
        className={styles.panel}
      >
        <header className={styles.kepala}>
          <div className={styles.kepalaTeks}>
            <h2 id={judulId} className={styles.judul}>
              {judul}
            </h2>
            {sub ? <p className={styles.sub}>{sub}</p> : null}
          </div>

          <button type="button" onClick={tutup} className={styles.tutup}>
            <Ikon nama="silang" ukuran={16} tebal={2.2} />
            <span className="sr-only">Tutup</span>
          </button>
        </header>

        <div className={styles.isi}>{children}</div>
      </div>
    </div>
  );
}
