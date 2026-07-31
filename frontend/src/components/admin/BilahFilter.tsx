import Link from 'next/link';
import type { ReactNode } from 'react';
import styles from './BilahFilter.module.css';

export interface OpsiFilter {
  readonly nilai: string;
  readonly label: string;
}

export interface KolomFilter {
  readonly nama: string;
  readonly judul: string;
  readonly nilai: string;
  /** Nilai yang dianggap "tidak menyaring" — menentukan hitungan filter aktif. */
  readonly bawaan: string;
  readonly opsi: readonly OpsiFilter[];
}

/**
 * Bilah filter halaman modul.
 *
 * Bukan `FilterGlobal`: yang itu milik dashboard: satu himpunan filter tetap
 * untuk seluruh papan, dengan debounce dan pembatalan permintaan karena angkanya
 * di-polling. Di halaman modul, filternya berbeda tiap modul dan datanya
 * dihalaman ulang di server, jadi bentuk yang benar adalah `<form method="get">`
 * biasa — tanpa JavaScript pun tetap bekerja.
 *
 * Nilainya tinggal di query URL (AC-FE-13) dan tidak pernah memuat data pribadi:
 * yang masuk hanya enum lomba/status/venue, bukan nama atau ID peserta.
 */
export function BilahFilter({
  aksi,
  kolom,
  hrefReset,
  catatan,
  anak,
}: {
  readonly aksi: string;
  readonly kolom: readonly KolomFilter[];
  readonly hrefReset: string;
  readonly catatan?: string;
  /** Aksi kanan: tombol utama halaman, pengalih tampilan, tautan riwayat. */
  readonly anak?: ReactNode;
}) {
  const aktif = kolom.filter((k) => k.nilai !== k.bawaan).length;

  return (
    <div className={styles.bilah}>
      <form method="get" action={aksi} className={styles.form}>
        <div className={styles.kolomDaftar}>
          {kolom.map((k) => (
            <label key={k.nama} data-diubah={k.nilai !== k.bawaan} className={styles.kolom}>
              <span className={styles.judul}>{k.judul}</span>
              <select name={k.nama} defaultValue={k.nilai} className={styles.select}>
                {k.opsi.map((o) => (
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

          <span className={styles.status}>
            {aktif > 0 ? `${aktif} filter aktif` : 'Tanpa filter'}
          </span>

          {aktif > 0 ? (
            <Link href={hrefReset} className={styles.reset}>
              Reset
            </Link>
          ) : null}
        </div>
      </form>

      {anak ? <div className={styles.anak}>{anak}</div> : null}

      {catatan ? <p className={styles.catatan}>{catatan}</p> : null}
    </div>
  );
}
