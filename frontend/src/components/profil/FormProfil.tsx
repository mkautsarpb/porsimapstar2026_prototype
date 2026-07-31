'use client';

import Link from 'next/link';
import { useId, useState } from 'react';
import { Ikon } from '@/components/app/Ikon';
import { NIK_TERSIMPAN, type IsianProfil } from '@/data/profil';
import ui from '@/components/app/ui.module.css';
import styles from './FormProfil.module.css';

/**
 * Formulir satu tahap profil.
 *
 * Dua hal yang sengaja tidak biasa di sini:
 *  - NIK tidak pernah ditampilkan penuh setelah tersimpan, termasuk kepada
 *    pemiliknya. Yang dirender adalah versi tersamarkan dari server, dan
 *    penjelasan kenapa NIK diminta ditulis di layar, bukan disembunyikan di
 *    kebijakan privasi (agents.md §5, §6).
 *  - Draf disimpan otomatis dan penandanya terlihat, supaya peserta berani
 *    menutup halaman di tengah pengisian.
 *
 * TODO(api-contract): `PATCH /api/v1/me/profile` per tahap. Panjang nama,
 * kanonikalisasi nomor telepon, dan enum jenjang tetap ditentukan backend.
 */
export function FormProfil({
  isian,
  tahap,
  denganNik = false,
  lanjutHref,
  lanjutLabel,
  kembaliHref,
}: {
  readonly isian: readonly IsianProfil[];
  readonly tahap: string;
  readonly denganNik?: boolean;
  readonly lanjutHref: string;
  readonly lanjutLabel: string;
  readonly kembaliHref?: string;
}) {
  const id = useId();
  const [nilai, setNilai] = useState<Record<string, string>>(
    Object.fromEntries(isian.map((i) => [i.id, i.nilai])),
  );
  const [tersimpan, setTersimpan] = useState('09.42');

  function ubah(kunci: string, baru: string) {
    setNilai((v) => ({ ...v, [kunci]: baru }));
    // TODO(api-contract): debounce 20 detik + PATCH; waktu simpan datang dari server.
    setTersimpan(
      new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace(':', '.'),
    );
  }

  return (
    <div className={styles.form}>
      <p aria-live="polite" className={styles.autosave}>
        <Ikon nama="centang" ukuran={13} tebal={2.6} />
        Tersimpan {tersimpan} · draf disimpan otomatis, kamu bisa menutup halaman dan melanjutkan
        nanti
      </p>

      {isian.map((i) => {
        const kunci = `${id}-${tahap}-${i.id}`;

        return i.tipe === 'pilihan' ? (
          <fieldset key={i.id} className={styles.field}>
            <legend className={styles.label}>
              {i.label} {i.wajib ? <span className={styles.wajib}>*</span> : null}
            </legend>
            <div className={styles.pilihan}>
              {i.opsi?.map((o) => (
                <label key={o} data-terpilih={nilai[i.id] === o} className={styles.opsi}>
                  <input
                    type="radio"
                    name={kunci}
                    value={o}
                    checked={nilai[i.id] === o}
                    onChange={() => ubah(i.id, o)}
                    className={styles.radio}
                  />
                  {o}
                </label>
              ))}
            </div>
            {i.bantuan ? <p className={styles.bantuan}>{i.bantuan}</p> : null}
          </fieldset>
        ) : (
          <div key={i.id} className={styles.field}>
            <label htmlFor={kunci} className={styles.label}>
              {i.label} {i.wajib ? <span className={styles.wajib}>*</span> : null}
            </label>
            <input
              id={kunci}
              type="text"
              value={nilai[i.id]}
              onChange={(e) => ubah(i.id, e.target.value)}
              aria-describedby={i.bantuan ? `${kunci}-bantuan` : undefined}
              className={styles.input}
            />
            {i.bantuan ? (
              <p id={`${kunci}-bantuan`} className={styles.bantuan}>
                {i.bantuan}
              </p>
            ) : null}
          </div>
        );
      })}

      {denganNik ? (
        <div className={styles.nik}>
          <span className={styles.nikJudul}>
            <Ikon nama="berkas" ukuran={16} tebal={2} />
            NIK · 16 digit <span className={styles.wajib}>*</span>
          </span>

          <output className={styles.nikNilai}>{NIK_TERSIMPAN}</output>

          <div className={styles.nikPenjelasan}>
            <strong>Kenapa NIK diminta</strong>
            <p className={styles.bantuan}>
              NIK dipakai sekali untuk memastikan satu orang tidak terdaftar dua kali di cabang yang
              sama, dan untuk mencocokkan identitas saat check-in. NIK tidak dipakai untuk keperluan
              lain dan tidak pernah dibagikan ke peserta lain, ketua tim, atau pihak luar.
            </p>
            <p className={styles.bantuan}>
              Setelah tersimpan, NIK ditampilkan termasking — hanya empat digit terakhir yang
              terlihat, termasuk oleh dirimu sendiri. Verifikator panitia membuka versi penuh hanya
              saat memeriksa dokumenmu, dan setiap pembukaan tercatat. Untuk mengubahnya,{' '}
              <Link href="/bantuan?jenis=akun">ajukan lewat halaman Bantuan</Link>.
            </p>
          </div>
        </div>
      ) : null}

      <div className={styles.aksi}>
        {kembaliHref ? (
          <Link href={kembaliHref} className={ui.tombol}>
            Kembali
          </Link>
        ) : (
          <button type="button" disabled aria-disabled="true" className={ui.tombol}>
            Kembali
          </button>
        )}
        <Link href={lanjutHref} className={`${ui.tombol} ${ui.tombolUtama}`}>
          {lanjutLabel}
        </Link>
      </div>
    </div>
  );
}
