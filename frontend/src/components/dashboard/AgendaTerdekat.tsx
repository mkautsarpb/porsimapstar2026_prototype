'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Ikon } from '@/components/app/Ikon';
import { AGENDA } from '@/data/peserta';
import ui from '@/components/app/ui.module.css';
import styles from './AgendaTerdekat.module.css';

/**
 * Agenda terdekat. Satu-satunya bagian dashboard yang ber-state: tombol "Saya
 * sudah tahu" pada jadwal yang berubah.
 *
 * TODO(api-contract): acknowledgement harus dikirim ke server
 * (`POST /api/v1/me/schedule-changes/{id}/ack`) dan badge unread baru berkurang
 * setelah tersimpan (agents.md §10). Sekarang baru state lokal.
 */
export function AgendaTerdekat() {
  const [diketahui, setDiketahui] = useState<readonly string[]>([]);
  const [status, setStatus] = useState('');

  return (
    <section aria-labelledby="agenda" className={`${ui.span7} ${ui.zona}`}>
      <h2 id="agenda" className={ui.judulZona}>
        Agenda terdekat
      </h2>

      <div className={styles.daftar}>
        {AGENDA.map((g) => {
          const berubah = g.berubah && !diketahui.includes(g.id);

          return (
            <article key={g.id} className={styles.baris}>
              <span aria-hidden="true" className={styles.tanggal}>
                <span className={styles.tanggalAngka}>{g.tanggal}</span>
                <span className={styles.tanggalBulan}>{g.bulan}</span>
              </span>

              <div className={styles.isi}>
                <div className={styles.judulBaris}>
                  <h3 className={styles.nama}>{g.nama}</h3>
                  {berubah ? (
                    <span data-nada="warn" className={ui.badge}>
                      <Ikon nama="ulang" ukuran={12} tebal={2.2} />
                      Jadwal berubah
                    </span>
                  ) : null}
                </div>

                <p className={styles.detail}>{g.detail}</p>

                <p className={styles.waktu}>
                  {berubah && g.jamLama ? <s className={styles.jamLama}>{g.jamLama}</s> : null}
                  <span className={styles.jam}>{g.jam}</span>
                  <span className={styles.venue}>· {g.venue}</span>
                </p>
              </div>

              {berubah ? (
                <button
                  type="button"
                  onClick={() => {
                    setDiketahui((v) => [...v, g.id]);
                    setStatus(`Perubahan jadwal ${g.nama} ditandai sudah kamu ketahui.`);
                  }}
                  className={`${ui.tombol} ${ui.tombolKecil}`}
                >
                  Saya sudah tahu
                </button>
              ) : null}
            </article>
          );
        })}

        <Link href="/jadwal-saya" className={styles.kaki}>
          Lihat jadwal lengkap
        </Link>
      </div>

      <p aria-live="polite" className="sr-only">
        {status}
      </p>
    </section>
  );
}
