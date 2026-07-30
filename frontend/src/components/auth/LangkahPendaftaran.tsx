'use client';

import { useId, useState } from 'react';
import { LANGKAH_AKUN } from '@/data/konten';
import styles from './LangkahPendaftaran.module.css';

/**
 * Tiga langkah pendaftaran di panel kiri.
 *
 * Daftar selalu ada di DOM supaya terbaca screen reader dan crawler; tombol
 * pelipat hanya muncul di bawah 1024px, tempat panel harus dipendekkan.
 */
export function LangkahPendaftaran() {
  const [terbuka, setTerbuka] = useState(false);
  const daftarId = useId();

  return (
    <div>
      <button
        type="button"
        aria-expanded={terbuka}
        aria-controls={daftarId}
        onClick={() => setTerbuka((v) => !v)}
        className={styles.toggle}
      >
        Tiga langkah pendaftaran
        <span aria-hidden="true" className={terbuka ? styles.caretOpen : styles.caret}>
          ▾
        </span>
      </button>

      <ol id={daftarId} className={terbuka ? styles.listOpen : styles.list}>
        {LANGKAH_AKUN.map((l) => (
          <li key={l.no} className={styles.item}>
            <span aria-hidden="true" className={styles.nomor}>
              {l.no}
            </span>
            <span className={styles.isi}>
              <span className={styles.judul}>{l.judul}</span>
              <span className={styles.detail}>{l.detail}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
