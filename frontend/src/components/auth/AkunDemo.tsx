'use client';

import { useId, useState } from 'react';
import { AKUN_DEMO } from '@/lib/api/mock-auth-db';
import styles from './AkunDemo.module.css';

/**
 * Panel bantu khusus prototype: daftar akun tiruan beserta hasil yang akan muncul.
 * Hanya dirender selama `AUTH_MOCK` masih true — hapus pemanggilnya bersamaan
 * dengan `mock-auth-db.ts` saat endpoint asli menyala.
 */
export function AkunDemo({
  onPakai,
}: {
  readonly onPakai: (email: string, password: string) => void;
}) {
  const [terbuka, setTerbuka] = useState(false);
  const daftarId = useId();

  return (
    <aside className={styles.panel}>
      <button
        type="button"
        aria-expanded={terbuka}
        aria-controls={daftarId}
        onClick={() => setTerbuka((v) => !v)}
        className={styles.toggle}
      >
        <span className={styles.eyebrow}>Mode prototype</span>
        <span className={styles.judul}>Akun demo untuk mencoba alur</span>
        <span aria-hidden="true" className={terbuka ? styles.caretOpen : styles.caret}>
          ▾
        </span>
      </button>

      {terbuka ? (
        <div id={daftarId}>
          <p className={styles.catatan}>
            Belum ada backend, jadi akun disimpan di memori halaman: akun yang kamu buat sendiri
            hilang kalau halaman dimuat ulang.
          </p>

          <ul className={styles.daftar}>
            {AKUN_DEMO.map((a) => (
              <li key={a.email} className={styles.item}>
                <div className={styles.isi}>
                  <p className={styles.label}>{a.label}</p>
                  <p className={styles.kredensial}>
                    {a.email} · {a.password}
                  </p>
                  <p className={styles.hasil}>{a.hasil}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onPakai(a.email, a.password)}
                  className={styles.pakai}
                >
                  Isi form
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </aside>
  );
}
