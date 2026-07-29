'use client';

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent, TouchEvent } from 'react';
import { DETAIL_LOMBA, DOKUMEN_UMUM, MASKOT_LOMBA, PIC_DEFAULT, SYARAT_UMUM } from '@/data/lomba';
import { BATAS_PENDAFTARAN } from '@/data/jadwal';
import { angkaDepan, grupDari } from '@/lib/kuota';
import type { Lomba, RingkasanKuota } from '@/types/landing';
import styles from './CompetitionModal.module.css';

type PanelStyle = CSSProperties &
  Record<'--left-bg' | '--icon-url' | '--maskot-url' | '--fill-width' | '--drag-y', string>;

const LATAR_KIRI: Readonly<Record<string, string>> = {
  Olahraga: 'var(--gradient-modal-olahraga)',
  Seni: 'var(--gradient-modal-seni)',
  Akademik: 'var(--gradient-modal-akademik)',
};

const FOKUS_SELECTOR =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

interface Props {
  readonly lomba: Lomba;
  readonly kuota: RingkasanKuota;
  readonly onClose: () => void;
}

export function CompetitionModal({ lomba, kuota, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const judulRef = useRef<HTMLHeadingElement>(null);
  const [accTerbuka, setAccTerbuka] = useState(-1);
  const [dragY, setDragY] = useState(0);
  const dragFrom = useRef<number | null>(null);

  const detail = DETAIL_LOMBA[lomba.kode];
  const isTim = lomba.tim === 'Tim';
  const grup = grupDari(lomba.kategori);
  const maskot = MASKOT_LOMBA[lomba.kode];

  // Fokus pindah ke judul saat modal terbuka (agents.md §7).
  useEffect(() => {
    const id = requestAnimationFrame(() => judulRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, []);

  // Kunci scroll halaman di belakang modal.
  useEffect(() => {
    const asli = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = asli;
    };
  }, []);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
      return;
    }
    if (e.key !== 'Tab') return;

    // Focus trap: Tab tidak boleh keluar dari dialog.
    const panel = panelRef.current;
    if (!panel) return;
    const fokusable = Array.from(panel.querySelectorAll<HTMLElement>(FOKUS_SELECTOR)).filter(
      (el) => el.offsetParent !== null,
    );
    if (fokusable.length === 0) return;

    const pertama = fokusable[0];
    const terakhir = fokusable[fokusable.length - 1];
    if (!pertama || !terakhir) return;

    if (e.shiftKey && document.activeElement === pertama) {
      e.preventDefault();
      terakhir.focus();
    } else if (!e.shiftKey && document.activeElement === terakhir) {
      e.preventDefault();
      pertama.focus();
    }
  };

  const barisFormat = isTim
    ? [
        { label: 'Pemain inti', nilai: angkaDepan(detail?.inti) },
        { label: 'Cadangan', nilai: angkaDepan(detail?.cadangan) },
        { label: 'Official', nilai: angkaDepan(detail?.official) },
      ]
    : [{ label: 'Peserta', nilai: '1' }];

  const akordeon: ReadonlyArray<{ label: string; lines: readonly string[] }> = [
    { label: 'Syarat peserta', lines: SYARAT_UMUM },
    { label: 'Jadwal & venue', lines: [detail?.jadwal ?? '—', detail?.venue ?? '—'] },
    { label: 'Sistem pertandingan', lines: [detail?.sistem ?? '—'] },
    { label: 'Dokumen yang perlu disiapkan', lines: DOKUMEN_UMUM },
    { label: 'PIC cabang', lines: [PIC_DEFAULT.nama, PIC_DEFAULT.kontak] },
  ];

  const panelStyle: PanelStyle = {
    '--left-bg': LATAR_KIRI[grup] ?? LATAR_KIRI.Olahraga ?? '',
    '--icon-url': `url("/uploads/icon_cabor/${lomba.icon}.svg")`,
    '--maskot-url': `url("/uploads/maskot/${maskot}.webp")`,
    '--fill-width': `${kuota.persen}%`,
    '--drag-y': `${dragY}px`,
  };

  const kelasStatus =
    kuota.status === 'penuh'
      ? styles.leftStatusPenuh
      : kuota.status === 'hampir'
        ? styles.leftStatusHampir
        : styles.leftStatus;

  const kelasSisa =
    kuota.status === 'penuh'
      ? styles.kuotaSisaPenuh
      : kuota.status === 'hampir'
        ? styles.kuotaSisaHampir
        : styles.kuotaSisa;

  const kelasFill =
    kuota.status === 'penuh' ? styles.fillPenuh : kuota.status === 'hampir' ? styles.fillHampir : styles.fill;

  return (
    <div onClick={onClose} className={styles.overlay}>
      <div className={styles.shell}>
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-lomba-judul"
          ref={panelRef}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={onKeyDown}
          className={styles.panel}
          style={panelStyle}
        >
          {/* Tarik ke bawah untuk menutup, khusus mode bottom sheet. */}
          <div
            className={styles.handle}
            onTouchStart={(e: TouchEvent<HTMLDivElement>) => {
              dragFrom.current = e.touches[0]?.clientY ?? null;
            }}
            onTouchMove={(e: TouchEvent<HTMLDivElement>) => {
              const mulai = dragFrom.current;
              const kini = e.touches[0]?.clientY;
              if (mulai == null || kini == null) return;
              const dy = kini - mulai;
              if (dy > 0) setDragY(dy);
            }}
            onTouchEnd={() => {
              dragFrom.current = null;
              if (dragY > 80) onClose();
              else setDragY(0);
            }}
          >
            <span aria-hidden="true" className={styles.handleBar} />
          </div>

          <div className={styles.left}>
            <span aria-hidden="true" className={styles.leftIconGhost} />
            <span aria-hidden="true" className={styles.leftHalo} />

            <div className={styles.leftHead}>
              <div className={styles.leftMeta}>
                <span className={styles.leftKode}>{lomba.kode}</span>
                <span className={kelasStatus}>
                  <span aria-hidden="true" className={styles.leftDot} />
                  {kuota.labelStatus}
                </span>
              </div>
              <p aria-hidden="true" className={styles.leftSpaced}>
                {lomba.nama.toUpperCase().split('').join(' ')}
              </p>
              <span aria-hidden="true" className={styles.leftRule} />
            </div>

            <span aria-hidden="true" className={styles.maskot} />
          </div>

          <div className={styles.right}>
            <button type="button" onClick={onClose} aria-label="Tutup detail lomba" className={styles.close}>
              ×
            </button>

            <div className={styles.scroll}>
              <h2 id="modal-lomba-judul" tabIndex={-1} ref={judulRef} className={styles.title}>
                {lomba.nama}
              </h2>

              <div className={styles.subMeta}>
                <span className={styles.kategori}>{lomba.kategori}</span>
                <span className={styles.tipe}>{lomba.tim}</span>
              </div>

              <p className={styles.ringkasan}>{detail?.ringkasan ?? ''}</p>

              {/* DATA SEMENTARA: format & komposisi menunggu juknis resmi. */}
              <div className={styles.blokFormat}>
                <p className={styles.blokLabel}>Format &amp; komposisi</p>
                <dl className={styles.formatRows}>
                  {barisFormat.map((r, i) => (
                    <div key={r.label} className={i === 0 ? styles.formatCellFirst : styles.formatCell}>
                      <dd className={styles.formatNilai}>{r.nilai}</dd>
                      <dt className={styles.formatLabel}>{r.label}</dt>
                    </div>
                  ))}
                </dl>
              </div>

              <p className={styles.perInstitusi}>
                Maksimal <strong>{angkaDepan(detail?.perInstitusi)}</strong> {isTim ? 'tim' : 'peserta'} per institusi
              </p>

              <div className={styles.blokKuota}>
                <p className={styles.blokLabel}>Kuota</p>
                <div className={styles.kuotaHead}>
                  <span className={styles.kuotaTeks}>{kuota.labelKuota}</span>
                  <span className={kelasSisa}>{kuota.labelSisa}</span>
                </div>
                <div className={styles.meterRow}>
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
                  <span aria-hidden="true" className={styles.pct}>
                    {kuota.persen}%
                  </span>
                </div>
              </div>

              {/* DATA SEMENTARA: syarat, jadwal, sistem, dokumen, PIC. */}
              <div className={styles.accordions}>
                {akordeon.map((ac, i) => {
                  const open = accTerbuka === i;
                  return (
                    <div key={ac.label} className={i === 0 ? styles.accItemFirst : styles.accItem}>
                      <button
                        type="button"
                        onClick={() => setAccTerbuka(open ? -1 : i)}
                        aria-expanded={open}
                        className={styles.accTrigger}
                      >
                        {ac.label}
                        <span aria-hidden="true" className={open ? styles.accChevronOpen : styles.accChevron} />
                      </button>
                      {open ? (
                        <ul className={styles.accList}>
                          {ac.lines.map((ln) => (
                            <li key={ln} className={styles.accLine}>
                              <span aria-hidden="true" className={styles.accBullet}>
                                ·
                              </span>
                              {ln}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  );
                })}
              </div>

              <p className={styles.catatan}>
                <span aria-hidden="true" className={styles.catatanTanda}>
                  !
                </span>
                Detail teknis masih menunggu konfirmasi panitia.
              </p>
            </div>

            <span aria-hidden="true" className={styles.fade} />

            <div className={styles.footer}>
              <a href="#cara" onClick={onClose} className={styles.footerCta}>
                {kuota.labelCta}
              </a>
              <button type="button" disabled aria-describedby="juknis-note" className={styles.footerGhost}>
                Unduh juknis
              </button>
              <span id="juknis-note" className={styles.footerNote}>
                Juknis menyusul
              </span>
              <span className={styles.footerDeadline}>{BATAS_PENDAFTARAN}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
