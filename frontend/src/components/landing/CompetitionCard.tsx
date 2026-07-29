'use client';

import type { CSSProperties, KeyboardEvent, MouseEvent } from 'react';
import type { Lomba, RingkasanKuota } from '@/types/landing';
import styles from './CompetitionCard.module.css';

type CardStyle = CSSProperties & Record<'--icon-url' | '--fill-width', string>;

interface Props {
  readonly lomba: Lomba;
  readonly kuota: RingkasanKuota;
  /** Delay animasi masuk, supaya kartu dalam satu grid muncul beruntun. */
  readonly animationDelay: number;
  readonly onOpen: (kode: string, trigger: HTMLElement) => void;
  readonly onPrefetch: (kode: string) => void;
}

/**
 * Kartu satu cabang lomba. Seluruh kartu adalah target klik menuju modal detail;
 * tombol "Daftar lomba ini" di dalamnya menghentikan propagasi supaya tidak
 * ikut membuka modal.
 */
export function CompetitionCard({ lomba, kuota, animationDelay, onOpen, onPrefetch }: Props) {
  const style: CardStyle = {
    '--icon-url': `url("/uploads/icon_cabor/${lomba.icon}.svg")`,
    '--fill-width': `${kuota.persen}%`,
    animationDelay: `${animationDelay}ms`,
  };

  const buka = (e: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>): void => {
    onOpen(lomba.kode, e.currentTarget);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      buka(e);
    }
  };

  const kelasSisa =
    kuota.status === 'penuh'
      ? styles.meterSisaPenuh
      : kuota.status === 'hampir'
        ? styles.meterSisaHampir
        : styles.meterSisa;

  const kelasFill =
    kuota.status === 'penuh' ? styles.fillPenuh : kuota.status === 'hampir' ? styles.fillHampir : styles.fill;

  const kelasStatus =
    kuota.status === 'penuh'
      ? styles.statusPenuh
      : kuota.status === 'hampir'
        ? styles.statusHampir
        : styles.status;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-haspopup="dialog"
      aria-label={`Lihat detail ${lomba.nama}`}
      onClick={buka}
      onKeyDown={onKeyDown}
      onMouseEnter={() => onPrefetch(lomba.kode)}
      onFocus={() => onPrefetch(lomba.kode)}
      className={styles.card}
      style={style}
    >
      <span aria-hidden="true" className={styles.icon} />

      <div className={styles.meta}>
        <span className={styles.kode}>{lomba.kode}</span>
        <span className={styles.tipe}>{lomba.tim}</span>
      </div>

      <h3 className={styles.nama}>{lomba.nama}</h3>
      <p className={styles.kategori}>{lomba.kategori}</p>

      <div className={styles.meter}>
        <div className={styles.meterHead}>
          <span className={styles.meterKuota}>{kuota.labelKuota}</span>
          <span className={kelasSisa}>{kuota.labelSisa}</span>
        </div>
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={kuota.persen}
          aria-label={kuota.labelMeter}
          className={styles.track}
        >
          <div className={kelasFill} />
        </div>
      </div>

      <div className={styles.foot}>
        {/* Status punya ikon titik + teks, tidak mengandalkan warna saja (agents.md §7). */}
        <span className={kelasStatus}>
          <span aria-hidden="true" className={styles.dot} />
          {kuota.labelStatus}
        </span>
        <a
          href="#cara"
          onClick={(e) => e.stopPropagation()}
          className={kuota.status === 'penuh' ? styles.ctaPenuh : styles.cta}
        >
          {kuota.labelCta}
        </a>
      </div>

      <span aria-hidden="true" className={styles.underline} />
    </div>
  );
}
