'use client';

import { useState } from 'react';
import { Ikon } from '@/components/app/Ikon';
import ui from '@/components/app/ui.module.css';
import styles from './KirimProfil.module.css';

/**
 * Persetujuan dan tombol kirim profil.
 *
 * Alasan tombol nonaktif selalu terlihat dan menyebut jumlahnya, bukan sekadar
 * "lengkapi data dulu". Kelayakan kirim ditentukan server; komponen ini hanya
 * menerima daftar penghalang yang sudah dihitung di sana.
 *
 * TODO(api-contract): `POST /api/v1/me/profile/submit` dengan idempotency key.
 */
export function KirimProfil({ penghalang }: { readonly penghalang: readonly string[] }) {
  const [setuju, setSetuju] = useState(false);
  const [kirim, setKirim] = useState(false);
  const [referensi, setReferensi] = useState<string | null>(null);

  const bisa = setuju && penghalang.length === 0 && !kirim;

  if (referensi) {
    return (
      <div aria-live="polite" className={`${ui.panel} ${ui.panelSukses}`}>
        <span aria-hidden="true" className={ui.panelIkon}>
          <Ikon nama="centang" ukuran={18} tebal={2.4} />
        </span>
        <span>
          Profil terkirim dan masuk antrean verifikasi panitia. Nomor referensi{' '}
          <strong>{referensi}</strong> — sebutkan nomor ini saat menghubungi panitia.
        </span>
      </div>
    );
  }

  async function kirimProfil() {
    if (!bisa) return;
    setKirim(true);
    await new Promise((r) => setTimeout(r, 500));
    setKirim(false);
    setReferensi('PRF-2026-4821');
  }

  return (
    <div className={styles.blok}>
      <label className={styles.persetujuan}>
        <input
          type="checkbox"
          checked={setuju}
          onChange={(e) => setSetuju(e.target.checked)}
          className={styles.centang}
        />
        <span>
          Saya menyatakan seluruh data di atas benar dan bersedia didiskualifikasi bila ditemukan
          data palsu. Saya juga menyetujui pemakaian datanya untuk verifikasi peserta PORSIMAPTAR
          2026.
        </span>
      </label>

      <div className={penghalang.length === 0 ? styles.siap : styles.tertahan}>
        <div className={styles.alasan}>
          <strong>
            {penghalang.length === 0
              ? setuju
                ? 'Semua syarat terpenuhi — profil siap dikirim'
                : 'Tinggal centang persetujuan di atas'
              : `Belum bisa dikirim: ${penghalang.length} hal masih tertahan`}
          </strong>
          {penghalang.length > 0 ? (
            <ul className={styles.daftar}>
              {penghalang.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          ) : null}
        </div>

        <button
          type="button"
          disabled={!bisa}
          aria-disabled={!bisa}
          onClick={kirimProfil}
          className={`${ui.tombol} ${ui.tombolUtama}`}
        >
          {kirim ? 'Mengirim…' : 'Kirim profil'}
        </button>
      </div>
    </div>
  );
}
