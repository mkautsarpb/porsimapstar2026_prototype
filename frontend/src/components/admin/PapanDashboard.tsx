'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { Ikon } from '@/components/app/Ikon';
import { ambilDashboard } from '@/lib/admin/dashboard-api';
import { FILTER_BAWAAN, urlDashboard, type NilaiFilter } from '@/lib/admin/filter-url';
import type { TabDashboard } from '@/types/api/admin-dashboard';
import type { DataDashboard } from '@/types/panitia';
import { DashboardTabs, KETERANGAN_TAB, idPanel } from './DashboardTabs';
import { FilterGlobal } from './FilterGlobal';
import { TabLomba } from './tabs/TabLomba';
import { TabOperasional } from './tabs/TabOperasional';
import { TabSistem } from './tabs/TabSistem';
import styles from './PapanDashboard.module.css';

const INTERVAL_POLLING_MS = 60_000;
const INTERVAL_TICK_MS = 15_000;

/**
 * Akar client dashboard panitia: filter, tab, dan pembaruan data dalam satu
 * tempat supaya ketiganya tidak pernah saling mendahului.
 *
 * Aturan pembaruan:
 *  - Hanya tab yang sedang terlihat yang di-poll. Tab lain tidak dirender, jadi
 *    tidak ada permintaan latar untuknya.
 *  - Polling berhenti saat tab peramban tidak terlihat, dan bisa dijeda manual.
 *  - Permintaan yang masih terbang dibatalkan lewat `AbortController` begitu
 *    filter atau tab berubah — respons lama yang datang belakangan tidak boleh
 *    menimpa hasil filter yang baru.
 *  - Penyegaran yang gagal TIDAK menghapus angka lama, tapi juga tidak
 *    membiarkannya tampil seolah baru: seluruh widget masuk kondisi stale
 *    lengkap dengan umurnya (AC-FE-09).
 *
 * Perubahan filter memakai `router.replace` supaya riwayat peramban tidak penuh
 * oleh langkah antara; tab memakai `push` karena berpindah tab memang perpindahan
 * yang wajar untuk dibatalkan dengan tombol kembali. Keduanya menulis ke URL,
 * jadi kembali dari drill-down memulihkan filter DAN tab yang sama (AC-FE-13).
 */
export function PapanDashboard({
  awal,
  filter,
  tab,
  tersedia,
}: {
  readonly awal: DataDashboard;
  readonly filter: NilaiFilter;
  readonly tab: TabDashboard;
  readonly tersedia: readonly TabDashboard[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [data, setData] = useState(awal);
  const [awalTerakhir, setAwalTerakhir] = useState(awal);
  const [diterimaPada, setDiterimaPada] = useState<number | null>(null);
  const [hanyutDetik, setHanyutDetik] = useState(0);
  const [penyegaranGagal, setPenyegaranGagal] = useState(false);
  const [jeda, setJeda] = useState(false);
  const [terlihat, setTerlihat] = useState(true);

  const abortRef = useRef<AbortController | null>(null);
  const filterRef = useRef(filter);
  const tabRef = useRef(tab);
  filterRef.current = filter;
  tabRef.current = tab;

  const kunci = `${tab}|${Object.values(filter).join('|')}`;

  /*
   * Payload baru dari server (navigasi filter/tab) menggantikan state client.
   * Disamakan SAAT RENDER, bukan di effect: kalau lewat effect, satu frame
   * sempat menampilkan tab baru dengan data tab lama. Preferensi jeda sengaja
   * tidak ikut direset — mengganti filter bukan alasan menyalakan lagi
   * pembaruan otomatis yang sudah sengaja dimatikan panitia.
   */
  if (awalTerakhir !== awal) {
    setAwalTerakhir(awal);
    setData(awal);
    setPenyegaranGagal(false);
  }

  useEffect(() => {
    setDiterimaPada(Date.now());
    setHanyutDetik(0);
  }, [awal]);

  // Filter atau tab berubah: batalkan permintaan yang masih terbang.
  useEffect(() => {
    abortRef.current?.abort();
  }, [kunci]);

  useEffect(() => () => abortRef.current?.abort(), []);

  /*
   * Umur data dihitung dari `server_time`, lalu ditambah waktu yang berlalu di
   * client. Tick ini yang membuat "2 menit lalu" tidak membeku di layar. Nilai
   * awalnya 0 dan baru bergerak setelah mount, supaya markup server dan client
   * identik saat hydration.
   */
  useEffect(() => {
    if (diterimaPada === null) return;

    const id = setInterval(() => {
      setHanyutDetik(Math.max(0, Math.round((Date.now() - diterimaPada) / 1000)));
    }, INTERVAL_TICK_MS);

    return () => clearInterval(id);
  }, [diterimaPada]);

  useEffect(() => {
    const onVisibilitas = () => setTerlihat(document.visibilityState === 'visible');
    onVisibilitas();
    document.addEventListener('visibilitychange', onVisibilitas);
    return () => document.removeEventListener('visibilitychange', onVisibilitas);
  }, []);

  const segarkan = useCallback(async () => {
    abortRef.current?.abort();
    const kendali = new AbortController();
    abortRef.current = kendali;

    try {
      const baru = await ambilDashboard(filterRef.current, tabRef.current, kendali.signal);
      setData(baru);
      setDiterimaPada(Date.now());
      setHanyutDetik(0);
      setPenyegaranGagal(false);
    } catch (galat) {
      if (galat instanceof DOMException && galat.name === 'AbortError') return;
      // Angka lama tetap di layar, tapi seluruh widget ditandai stale.
      setPenyegaranGagal(true);
    }
  }, []);

  useEffect(() => {
    if (jeda || !terlihat) return;

    const id = setInterval(() => {
      void segarkan();
    }, INTERVAL_POLLING_MS);

    return () => clearInterval(id);
  }, [jeda, terlihat, segarkan]);

  const pindahTab = (tujuan: TabDashboard) => {
    startTransition(() => router.push(urlDashboard(filter, tujuan), { scroll: false }));
  };

  const ubahFilter = (baru: NilaiFilter) => {
    startTransition(() => router.replace(urlDashboard(baru, tab), { scroll: false }));
  };

  const reset = () => {
    startTransition(() => router.replace(urlDashboard(FILTER_BAWAAN, tab), { scroll: false }));
  };

  const propsTab = {
    data,
    hanyutDetik,
    memuat: pending,
    penyegaranGagal,
    onMuatUlang: () => void segarkan(),
  };

  return (
    <div className={styles.papan}>
      <FilterGlobal nilai={filter} memuat={pending} onUbah={ubahFilter} onReset={reset} />

      <div className={styles.kepala}>
        <DashboardTabs tersedia={tersedia} aktif={tab} filter={filter} onPindah={pindahTab} />

        <div className={styles.kontrol}>
          <span className={styles.kontrolStatus}>
            {jeda
              ? 'Pembaruan dijeda'
              : terlihat
                ? 'Perbarui otomatis 60 detik'
                : 'Dijeda — tab tidak terlihat'}
          </span>

          <button
            type="button"
            aria-pressed={jeda}
            onClick={() => setJeda((v) => !v)}
            className={styles.tombol}
          >
            {jeda ? 'Lanjutkan' : 'Jeda'}
          </button>

          <button
            type="button"
            onClick={() => void segarkan()}
            aria-label="Perbarui sekarang"
            className={styles.tombol}
          >
            <Ikon nama="ulang" ukuran={12} tebal={2.2} />
            Perbarui
          </button>
        </div>
      </div>

      {/* Deskripsi tab hidup di sini, bukan di dalam tab — supaya tinggi baris
          tab tidak bergantung pada panjang teksnya. */}
      <p className={styles.keteranganTab}>{KETERANGAN_TAB[tab]}</p>

      {penyegaranGagal ? (
        <p role="status" className={styles.gagalSegar}>
          <Ikon nama="seru" ukuran={14} />
          Penyegaran terakhir gagal. Angka di bawah adalah data terakhir yang berhasil diambil —
          semuanya ditandai basi beserta umurnya, jangan dibaca sebagai kondisi saat ini.
        </p>
      ) : null}

      <div
        role="tabpanel"
        id={idPanel(tab)}
        aria-labelledby={`tab-${tab}`}
        aria-busy={pending}
        tabIndex={0}
        className={styles.panel}
      >
        {tab === 'lomba' ? <TabLomba {...propsTab} /> : null}
        {tab === 'operasional' ? <TabOperasional {...propsTab} /> : null}
        {tab === 'sistem' ? <TabSistem {...propsTab} /> : null}
      </div>
    </div>
  );
}
