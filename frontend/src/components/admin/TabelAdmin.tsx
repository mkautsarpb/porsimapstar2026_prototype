import type { ReactNode } from 'react';
import { Ikon } from '@/components/app/Ikon';
import styles from './TabelAdmin.module.css';

export interface KolomTabel {
  readonly label: string;
  /** Kolom yang bisa diurutkan menampilkan panah — arah aktif ditandai `urut`. */
  readonly urut?: 'naik' | 'turun' | false;
  /** Kolom angka dirapatkan ke kanan supaya digitnya sejajar. */
  readonly angka?: boolean;
  /** Judul yang hanya untuk pembaca layar, mis. kolom kotak centang. */
  readonly sembunyi?: boolean;
}

/**
 * Kerangka tabel Panel Panitia.
 *
 * Seluruh modul admin memakai tabel, bukan kartu (Batch E1–E4): barisnya dibaca
 * berurutan untuk memutuskan mana yang dikerjakan lebih dulu, dan urutan itu
 * hilang begitu diubah jadi kisi kartu. `TabelPeringatan` sudah membuktikan
 * pola ini; berkas ini mengangkatnya jadi kerangka bersama supaya sebelas modul
 * tidak menyalin `overflow-x` + `border-collapse` + gaya `th` yang sama.
 *
 * `caption` wajib: tabel tanpa keterangan membuat pembaca layar hanya mendengar
 * "tabel, 9 kolom". Isinya menyebut apa yang dibariskan DAN urutannya.
 */
export function TabelAdmin({
  caption,
  kolom,
  minLebar = 720,
  children,
}: {
  readonly caption: string;
  readonly kolom: readonly KolomTabel[];
  readonly minLebar?: number;
  readonly children: ReactNode;
}) {
  return (
    <div className={styles.bungkus}>
      <table style={{ minWidth: `${minLebar}px` }} className={styles.tabel}>
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            {kolom.map((k) => (
              <th
                key={k.label}
                scope="col"
                data-angka={k.angka ? 'true' : undefined}
                aria-sort={
                  k.urut === 'naik' ? 'ascending' : k.urut === 'turun' ? 'descending' : undefined
                }
              >
                {k.sembunyi ? (
                  <span className="sr-only">{k.label}</span>
                ) : (
                  <span className={styles.kepalaTeks}>
                    {k.label}
                    {k.urut !== undefined ? (
                      <span data-arah={k.urut === false ? 'tidak' : k.urut} className={styles.urut}>
                        <Ikon nama="panah" ukuran={11} tebal={2.6} />
                      </span>
                    ) : null}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

/** Sel dua baris: nilai utama + keterangan kecil di bawahnya. */
export function SelBertingkat({
  utama,
  meta,
}: {
  readonly utama: ReactNode;
  readonly meta?: ReactNode;
}) {
  return (
    <span className={styles.bertingkat}>
      <span className={styles.bertingkatUtama}>{utama}</span>
      {meta ? <span className={styles.bertingkatMeta}>{meta}</span> : null}
    </span>
  );
}
