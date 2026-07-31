'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { urlDashboard, type NilaiFilter } from '@/lib/admin/filter-url';
import type { TabDashboard } from '@/types/api/admin-dashboard';
import styles from './DashboardTabs.module.css';

export const LABEL_TAB: Readonly<Record<TabDashboard, string>> = {
  lomba: 'Lomba',
  operasional: 'Operasional',
  sistem: 'Sistem',
};

export const KETERANGAN_TAB: Readonly<Record<TabDashboard, string>> = {
  lomba: 'Analisis kepesertaan dan kuota',
  operasional: 'Antrean yang menunggu tindakan orang',
  sistem: 'Integrasi dan kesehatan sistem',
};

export function idPanel(tab: TabDashboard): string {
  return `panel-${tab}`;
}

/**
 * Tablist dashboard panitia.
 *
 * Aktivasi manual, bukan otomatis: panah memindahkan FOKUS, Enter atau Spasi
 * yang berpindah tab. Aktivasi otomatis akan memicu satu permintaan data tiap
 * kali panah ditekan — pola yang dianjurkan APG justru untuk tab yang isinya
 * ringan, bukan yang memuat data.
 *
 * Tab yang tidak boleh dilihat pengguna ini TIDAK dikirim ke komponen ini sama
 * sekali, jadi tidak ada jejaknya di DOM (AC #6). Menonaktifkan tab tetap
 * membocorkan keberadaannya.
 *
 * Tetap `<Link>` supaya bisa dibuka di tab baru, dibagikan, dan tetap jalan
 * tanpa JS. Klik biasa dicegat agar perpindahan lewat transition dan angka lama
 * tidak berkedip.
 */
export function DashboardTabs({
  tersedia,
  aktif,
  filter,
  onPindah,
}: {
  readonly tersedia: readonly TabDashboard[];
  readonly aktif: TabDashboard;
  readonly filter: NilaiFilter;
  readonly onPindah: (tab: TabDashboard) => void;
}) {
  const indeksAktif = Math.max(0, tersedia.indexOf(aktif));
  const [fokus, setFokus] = useState(indeksAktif);
  const refs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    setFokus(indeksAktif);
  }, [indeksAktif]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const akhir = tersedia.length - 1;
    let tujuan = fokus;

    if (e.key === 'ArrowRight') tujuan = fokus >= akhir ? 0 : fokus + 1;
    else if (e.key === 'ArrowLeft') tujuan = fokus <= 0 ? akhir : fokus - 1;
    else if (e.key === 'Home') tujuan = 0;
    else if (e.key === 'End') tujuan = akhir;
    else return;

    e.preventDefault();
    setFokus(tujuan);
    refs.current[tujuan]?.focus();
  };

  return (
    <div role="tablist" aria-label="Bagian dashboard" onKeyDown={onKeyDown} className={styles.tablist}>
      {tersedia.map((tab, i) => {
        const terpilih = tab === aktif;

        return (
          <Link
            key={tab}
            ref={(el) => {
              refs.current[i] = el;
            }}
            href={urlDashboard(filter, tab)}
            role="tab"
            id={`tab-${tab}`}
            aria-selected={terpilih}
            aria-controls={idPanel(tab)}
            tabIndex={fokus === i ? 0 : -1}
            data-terpilih={terpilih}
            className={styles.tab}
            onClick={(e) => {
              // Biarkan buka-di-tab-baru bekerja seperti tautan biasa.
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
              e.preventDefault();
              setFokus(i);
              onPindah(tab);
            }}
          >
            {LABEL_TAB[tab]}
          </Link>
        );
      })}
    </div>
  );
}
