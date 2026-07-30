'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { CSSProperties, KeyboardEvent } from 'react';
import { DAFTAR_LOMBA, MASKOT_LOMBA } from '@/data/lomba';
import { grupDari, ringkasKuota } from '@/lib/kuota';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { CompetitionCard } from './CompetitionCard';
import { CompetitionModal } from './CompetitionModal';
import shared from './shared.module.css';
import styles from './CompetitionSection.module.css';

const TABS = [
  { key: 'semua', label: 'Semua' },
  { key: 'Olahraga', label: 'Olahraga' },
  { key: 'Seni', label: 'Seni' },
  { key: 'Akademik', label: 'Akademik' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

const URUTAN_GRUP = ['Olahraga', 'Seni', 'Akademik'] as const;

/** Cache maskot yang sudah dihangatkan supaya modal tidak menunggu unduhan. */
const maskotHangat = new Set<string>();

export function CompetitionSection() {
  const [tab, setTab] = useState<TabKey>('Olahraga');
  const [memudar, setMemudar] = useState(false);
  const [modalKode, setModalKode] = useState<string | null>(null);
  const tabRefs = useRef<Map<TabKey, HTMLButtonElement>>(new Map());
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const pemicuRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  const denganKuota = useMemo(
    () => DAFTAR_LOMBA.map((l) => ({ lomba: l, kuota: ringkasKuota(l), grup: grupDari(l.kategori) })),
    [],
  );

  const jumlah = useMemo(() => {
    const out: Record<string, number> = { semua: denganKuota.length };
    URUTAN_GRUP.forEach((g) => {
      out[g] = denganKuota.filter((x) => x.grup === g).length;
    });
    return out;
  }, [denganKuota]);

  const kelompok = useMemo(() => {
    const grupAktif = tab === 'semua' ? URUTAN_GRUP : [tab];
    return grupAktif.map((g) => ({
      grup: g,
      tampilkanLabel: tab === 'semua',
      label: `${g} · ${jumlah[g] ?? 0} cabang`,
      items: denganKuota.filter((x) => x.grup === g),
    }));
  }, [tab, denganKuota, jumlah]);

  // Indikator gradien mengikuti lebar & posisi tab aktif.
  useEffect(() => {
    const el = tabRefs.current.get(tab);
    const indicator = indicatorRef.current;
    if (!el || !indicator) return;

    indicator.style.width = `${el.offsetWidth}px`;
    indicator.style.transform = `translateX(${el.offsetLeft}px)`;
  }, [tab]);

  const pilihTab = useCallback(
    (key: TabKey) => {
      if (key === tab) return;
      if (reduced) {
        setTab(key);
        return;
      }
      // Panel dipudarkan sebentar supaya pergantian daftar tidak terasa melompat.
      setMemudar(true);
      window.setTimeout(() => {
        setTab(key);
        setMemudar(false);
      }, 150);
    },
    [tab, reduced],
  );

  const onTabKey = (e: KeyboardEvent<HTMLDivElement>): void => {
    const arah = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (arah === 0) return;
    e.preventDefault();

    const i = TABS.findIndex((t) => t.key === tab);
    const berikut = TABS[(i + arah + TABS.length) % TABS.length];
    if (!berikut) return;

    pilihTab(berikut.key);
    tabRefs.current.get(berikut.key)?.focus();
  };

  const prefetchMaskot = useCallback((kode: string) => {
    const slug = MASKOT_LOMBA[kode];
    if (!slug || maskotHangat.has(slug)) return;
    maskotHangat.add(slug);
    const im = new Image();
    im.decoding = 'async';
    im.src = `/uploads/maskot/${slug}.webp`;
  }, []);

  const bukaModal = useCallback((kode: string, trigger: HTMLElement) => {
    pemicuRef.current = trigger;
    setModalKode(kode);
    window.history.pushState(null, '', `#lomba/${kode}`);
  }, []);

  const tutupModal = useCallback(() => {
    setModalKode(null);
    // Fokus kembali ke kartu yang membuka modal (agents.md §7).
    pemicuRef.current?.focus();
    pemicuRef.current = null;
    if (window.location.hash.startsWith('#lomba/')) window.history.back();
  }, []);

  // Deep link: #lomba/<KODE> membuka modal langsung, tombol back menutupnya.
  useEffect(() => {
    const terapkan = (): void => {
      const cocok = window.location.hash.match(/^#lomba\/(.+)$/);
      setModalKode(cocok?.[1] ?? null);
    };
    terapkan();
    window.addEventListener('popstate', terapkan);
    return () => window.removeEventListener('popstate', terapkan);
  }, []);

  const aktif = modalKode === null ? null : (denganKuota.find((x) => x.lomba.kode === modalKode) ?? null);

  const panelStyle: CSSProperties = { opacity: memudar ? 0 : 1 };

  return (
    <section id="lomba" data-fill="var(--color-surface-1)" className={shared.sectionWhite}>
      <div aria-hidden="true" className={shared.hlineWrap}>
        <span data-hline="1" className={shared.hline} />
      </div>
      <div aria-hidden="true" className={`${shared.glow} ${styles.glow}`} />

      <div className={shared.container}>
        <div data-reveal="1" className={styles.head}>
          <div className={styles.headText}>
            <p className={shared.eyebrow}>Cabang unggulan</p>
            <h2 className={shared.heading}>17 cabang, cek sisa kuota.</h2>
            {/* Angka kuota per kartu masih DATA SEMENTARA sampai panitia mengonfirmasi. */}
            <p className={styles.disclaimer}>Angka kuota bersifat sementara, menunggu konfirmasi panitia.</p>
          </div>
        </div>

        <div className={styles.tabsWrap}>
          <div role="tablist" aria-label="Filter kategori cabang" onKeyDown={onTabKey} className={styles.tablist}>
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                role="tab"
                id={`tab-${t.key.toLowerCase()}`}
                aria-selected={t.key === tab}
                aria-controls="panel-lomba"
                tabIndex={t.key === tab ? 0 : -1}
                onClick={() => pilihTab(t.key)}
                ref={(el) => {
                  if (el) tabRefs.current.set(t.key, el);
                }}
                className={t.key === tab ? styles.tabActive : styles.tab}
              >
                {t.label}
                <span className={styles.tabCount}>({jumlah[t.key] ?? 0})</span>
              </button>
            ))}
            <span aria-hidden="true" ref={indicatorRef} className={styles.indicator} />
          </div>

          <p aria-live="polite" className="sr-only">
            {tab === 'semua'
              ? `Menampilkan seluruh ${jumlah.semua ?? 0} cabang`
              : `Menampilkan ${jumlah[tab] ?? 0} cabang ${tab.toLowerCase()}`}
          </p>
        </div>

        <div
          id="panel-lomba"
          role="tabpanel"
          aria-labelledby={`tab-${tab.toLowerCase()}`}
          className={styles.panel}
          style={panelStyle}
        >
          {kelompok.map((g) => (
            <div key={g.grup}>
              {g.tampilkanLabel ? <p className={styles.groupLabel}>{g.label}</p> : null}
              <div className={styles.grid}>
                {g.items.map((x, i) => (
                  <CompetitionCard
                    key={x.lomba.kode}
                    lomba={x.lomba}
                    kuota={x.kuota}
                    animationDelay={reduced ? 0 : i * 45}
                    onOpen={bukaModal}
                    onPrefetch={prefetchMaskot}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/*
        Modal dipasang lewat portal ke <body>, bukan dirender di sini.

        Section ini punya `z-index: 1`, yang membuat stacking context baru —
        akibatnya `z-index: 60` milik modal hanya berlaku di dalam section ini.
        Section berikutnya (acara, linimasa, sponsor, dst.) juga `z-index: 1` dan
        digambar belakangan, jadi konten mereka menimpa modal. Portal
        mengeluarkan modal dari stacking context tersebut.

        Aman dari SSR: `aktif` hanya bisa terisi lewat effect atau event handler,
        yang keduanya berjalan setelah mount.
      */}
      {aktif
        ? createPortal(
            <CompetitionModal lomba={aktif.lomba} kuota={aktif.kuota} onClose={tutupModal} />,
            document.body,
          )
        : null}
    </section>
  );
}
