import type { ReactNode } from 'react';
import { Ikon } from '@/components/app/Ikon';
import type { NamaIkon } from '@/types/peserta';
import styles from './KartuKeadaan.module.css';

export type NadaKeadaan = 'proses' | 'ok' | 'warn' | 'danger' | 'info' | 'netral';

const IKON: Readonly<Record<NadaKeadaan, NamaIkon>> = {
  proses: 'jam',
  ok: 'centang',
  warn: 'seru',
  danger: 'silang',
  info: 'bantuan',
  netral: 'berkas',
};

/**
 * Kartu keadaan: memuat · berhasil · gagal · kosong · konflik.
 *
 * Satu komponen untuk kelimanya karena anatominya identik di seluruh Batch
 * E1–E4 — ikon, satu kalimat keadaan, penjelasan, nomor referensi, lalu jalan
 * keluar. Yang membedakan hanya nada, dan nada tidak pernah sendirian: ikon dan
 * kata keadaannya selalu ikut (agents.md §7).
 *
 * `ref` bukan hiasan. Setiap keadaan berhasil dan gagal operasi kritis harus
 * bisa disebut ke petugas dukungan dengan satu nomor (agents.md §4).
 */
export function KartuKeadaan({
  nada,
  keadaan,
  judul,
  teks,
  nomorRef,
  rincian,
  aksi,
  hidup,
}: {
  readonly nada: NadaKeadaan;
  /** Kata keadaannya, mis. "Berhasil" / "Gagal" — bukan diserahkan ke warna. */
  readonly keadaan: string;
  readonly judul: string;
  readonly teks: ReactNode;
  /** Nomor referensi. Bukan `ref` — nama itu milik React dan tidak pernah
   * sampai ke komponen sebagai prop biasa. */
  readonly nomorRef?: string;
  readonly rincian?: readonly { readonly label: string; readonly nilai: string }[];
  readonly aksi?: ReactNode;
  /** Keadaan yang muncul akibat aksi pengguna diumumkan ke pembaca layar. */
  readonly hidup?: 'polite' | 'assertive';
}) {
  return (
    <div
      role={hidup ? 'status' : undefined}
      aria-live={hidup}
      data-nada={nada}
      className={styles.kartu}
    >
      <p className={styles.keadaan}>
        <span aria-hidden="true" className={styles.ikon}>
          <Ikon nama={IKON[nada]} ukuran={14} tebal={2.2} />
        </span>
        {keadaan}
      </p>

      <p className={styles.judul}>{judul}</p>
      <div className={styles.teks}>{teks}</div>

      {rincian && rincian.length > 0 ? (
        <dl className={styles.rincian}>
          {rincian.map((r) => (
            <div key={r.label} className={styles.rincianBaris}>
              <dt className={styles.rincianLabel}>{r.label}</dt>
              <dd className={styles.rincianNilai}>{r.nilai}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {nomorRef ? <p className={styles.ref}>Nomor referensi {nomorRef}</p> : null}

      {aksi ? <div className={styles.aksi}>{aksi}</div> : null}
    </div>
  );
}
