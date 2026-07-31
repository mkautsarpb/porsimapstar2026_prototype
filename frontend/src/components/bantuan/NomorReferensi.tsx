'use client';

import { useState } from 'react';
import { Ikon } from '@/components/app/Ikon';
import ui from '@/components/app/ui.module.css';
import styles from './NomorReferensi.module.css';

/**
 * Kartu nomor referensi peserta.
 *
 * Nomor ini menggantikan NIK sebagai cara panitia menemukan data peserta — itu
 * sebabnya ia diletakkan paling atas di halaman Bantuan, sebelum kontak apa pun.
 */
export function NomorReferensi({ nomor }: { readonly nomor: string }) {
  const [disalin, setDisalin] = useState(false);

  async function salin() {
    try {
      await navigator.clipboard.writeText(nomor);
      setDisalin(true);
      setTimeout(() => setDisalin(false), 2500);
    } catch {
      // Clipboard bisa ditolak browser. Nomornya tetap terlihat dan bisa disalin manual.
      setDisalin(false);
    }
  }

  return (
    <div className={`${ui.kartu} ${styles.kartu}`}>
      <div className={styles.isi}>
        <span className={ui.eyebrow}>Nomor referensi peserta</span>
        <strong className={styles.nomor}>{nomor}</strong>
        <p className={styles.keterangan}>
          Sebutkan nomor ini saat menghubungi panitia — mereka bisa menemukan datamu tanpa
          menanyakan NIK atau data pribadi lain.
        </p>
      </div>

      <button type="button" onClick={salin} className={ui.tombol}>
        <Ikon nama={disalin ? 'centang' : 'berkas'} ukuran={16} tebal={2} />
        {disalin ? 'Tersalin' : 'Salin'}
      </button>
      <span aria-live="polite" className={styles.sr}>
        {disalin ? `Nomor referensi ${nomor} tersalin` : ''}
      </span>
    </div>
  );
}
