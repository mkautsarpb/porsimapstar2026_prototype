'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Ikon } from '@/components/app/Ikon';
import {
  FILTER,
  FILTER_BAWAAN,
  KUNCI_FILTER,
  jumlahAktif,
  label,
  type KunciFilter,
  type NilaiFilter,
} from '@/lib/admin/filter-url';
import styles from './FilterGlobal.module.css';

const JEDA_DEBOUNCE_MS = 350;

/** Chip yang ditampilkan saat terciut — filter yang paling sering dibaca dulu. */
const CHIP_RINGKASAN: readonly KunciFilter[] = ['event', 'lomba', 'periode'];

/**
 * Baris filter global — satu tempat yang menjelaskan cakupan seluruh angka.
 * Tanpa ini tiap widget mudah dibaca sebagai "seluruh event".
 *
 * Dua keadaan. Bawaannya TERCIUT satu baris, karena filter jarang diubah tapi
 * cakupannya harus selalu terbaca; delapan dropdown permanen memakan bagian atas
 * layar yang seharusnya untuk data. Panel lengkap muncul saat Ubah ditekan.
 *
 * Nilainya hidup di query URL (AC-FE-13): bertahan saat balik dari drill-down,
 * bisa dibagikan antar panitia berizin, dan tidak memuat data pribadi.
 *
 * Perubahan di-debounce ~350 ms sebelum URL ditulis, supaya mengubah tiga filter
 * berturut-turut menghasilkan satu permintaan, bukan tiga. Pembatalan permintaan
 * yang masih terbang ditangani di `PapanDashboard` lewat `AbortController`.
 *
 * Tetap `<form method="get">`: tanpa JavaScript, tombol Terapkan masih bekerja.
 */
export function FilterGlobal({
  nilai,
  memuat,
  onUbah,
  onReset,
}: {
  readonly nilai: NilaiFilter;
  readonly memuat: boolean;
  readonly onUbah: (filter: NilaiFilter) => void;
  readonly onReset: () => void;
}) {
  const [terbuka, setTerbuka] = useState(false);
  // Draf lokal supaya select terasa responsif walau penerapannya ditunda.
  const [draf, setDraf] = useState<NilaiFilter>(nilai);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panelId = useId();

  useEffect(() => {
    setDraf(nilai);
  }, [nilai]);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const ubah = (kunci: KunciFilter, baru: string) => {
    const berikut: NilaiFilter = { ...draf, [kunci]: baru };
    setDraf(berikut);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onUbah(berikut), JEDA_DEBOUNCE_MS);
  };

  const terapkan = (e: React.FormEvent) => {
    e.preventDefault();
    if (timerRef.current) clearTimeout(timerRef.current);
    onUbah(draf);
    setTerbuka(false);
  };

  const batal = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setDraf(nilai);
    setTerbuka(false);
  };

  const aktif = jumlahAktif(nilai);
  const lainBawaan = KUNCI_FILTER.filter(
    (k) => !CHIP_RINGKASAN.includes(k) && nilai[k] === FILTER_BAWAAN[k],
  ).length;
  const lainDiubah = KUNCI_FILTER.filter(
    (k) => !CHIP_RINGKASAN.includes(k) && nilai[k] !== FILTER_BAWAAN[k],
  );

  return (
    <form method="get" action="/admin/dashboard" onSubmit={terapkan} className={styles.baris}>
      <div className={styles.ringkas}>
        <span aria-hidden="true" className={styles.ikon}>
          <Ikon nama="grid" ukuran={14} />
        </span>

        <ul className={styles.chipDaftar}>
          {CHIP_RINGKASAN.map((k) => (
            <li key={k} data-diubah={nilai[k] !== FILTER_BAWAAN[k]} className={styles.chip}>
              <span className={styles.chipJudul}>{FILTER[k].judul}</span>
              {label(k, nilai[k])}
            </li>
          ))}

          {lainDiubah.map((k) => (
            <li key={k} data-diubah="true" className={styles.chip}>
              <span className={styles.chipJudul}>{FILTER[k].judul}</span>
              {label(k, nilai[k])}
            </li>
          ))}

          {lainBawaan > 0 ? (
            <li className={styles.chipBawaan}>{lainBawaan} filter lain bawaan</li>
          ) : null}
        </ul>

        <span aria-live="polite" className={styles.status}>
          {memuat ? 'Memperbarui angka…' : aktif > 0 ? `${aktif} filter aktif` : 'Cakupan bawaan'}
        </span>

        <button
          type="button"
          aria-expanded={terbuka}
          aria-controls={panelId}
          onClick={() => setTerbuka((v) => !v)}
          className={styles.tombolUbah}
        >
          {terbuka ? 'Tutup' : 'Ubah'}
        </button>

        {aktif > 0 ? (
          <button type="button" onClick={onReset} className={styles.reset}>
            Reset
          </button>
        ) : null}
      </div>

      {terbuka ? (
        <div id={panelId} className={styles.panel}>
          <div className={styles.grup}>
            {KUNCI_FILTER.map((kunci) => (
              <label key={kunci} className={styles.kolom}>
                <span className={styles.judul}>{FILTER[kunci].judul}</span>
                <select
                  name={kunci}
                  value={draf[kunci]}
                  onChange={(e) => ubah(kunci, e.target.value)}
                  data-diubah={draf[kunci] !== FILTER_BAWAAN[kunci]}
                  className={styles.select}
                >
                  {FILTER[kunci].opsi.map((o) => (
                    <option key={o.nilai} value={o.nilai}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>

          <div className={styles.aksi}>
            <button type="submit" className={styles.terapkan}>
              Terapkan
            </button>
            <button type="button" onClick={batal} className={styles.batal}>
              Batal
            </button>
          </div>
        </div>
      ) : null}
    </form>
  );
}
