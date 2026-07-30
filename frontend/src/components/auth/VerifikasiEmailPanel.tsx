'use client';

import { useEffect, useRef, useState } from 'react';
import {
  AUTH_MOCK,
  kirimUlangVerifikasi,
  verifikasiDemo,
  type SimulasiRespons,
} from '@/lib/api/auth';
import { pesanError } from '@/lib/auth-errors';
import { samarkanEmail } from '@/lib/validasi-auth';
import { useHitungMundur } from '@/hooks/useHitungMundur';
import type { ApiError } from '@/types/api/auth';
import { AlertBanner } from './AlertBanner';
import styles from './auth.module.css';

interface VerifikasiEmailPanelProps {
  readonly email: string;
  readonly simulasi?: SimulasiRespons;
  /** Jeda awal sebelum tautan boleh dikirim ulang, dalam detik. */
  readonly jedaAwal?: number;
  readonly onKembali: () => void;
}

/**
 * Layar "cek email kamu" setelah akun dibuat atau saat login menemui akun yang
 * belum terverifikasi.
 *
 * Email hanya ditampilkan tersamarkan dan tidak pernah dimasukkan ke URL
 * (agents.md §6). Tombol kirim ulang punya jeda supaya tidak jadi alat spam.
 */
export function VerifikasiEmailPanel({
  email,
  simulasi = 'sukses',
  jedaAwal = 60,
  onKembali,
}: VerifikasiEmailPanelProps) {
  const refJudul = useRef<HTMLHeadingElement>(null);
  const [sisa, mulai] = useHitungMundur();
  const [memproses, setMemproses] = useState(false);
  const [gagal, setGagal] = useState<ApiError | null>(null);
  const [live, setLive] = useState('');

  useEffect(() => {
    refJudul.current?.focus({ preventScroll: true });
    mulai(jedaAwal);
  }, [jedaAwal, mulai]);

  const terkunci = memproses || sisa > 0;
  const pesan = gagal ? pesanError(gagal) : null;

  async function onKirimUlang() {
    if (terkunci) return;

    setMemproses(true);
    setGagal(null);
    setLive('Mengirim ulang tautan verifikasi…');

    const hasil = await kirimUlangVerifikasi(email, simulasi);
    setMemproses(false);

    if (!hasil.ok) {
      setGagal(hasil.error);
      mulai(hasil.error.retryAfter ?? 0);
      setLive('Tautan gagal dikirim. Baca keterangan di atas.');
      return;
    }

    mulai(hasil.data.resendAfter);
    setLive(`Tautan verifikasi dikirim ulang ke ${samarkanEmail(email)}.`);
  }

  return (
    <div>
      <span aria-hidden="true" className={`${styles.lencana} ${styles.lencanaInfo}`}>
        ✉
      </span>
      <h1 ref={refJudul} tabIndex={-1} className={styles.judulHasil}>
        Cek email kamu
      </h1>
      <p className={styles.deskripsiHasil}>
        Kami mengirim tautan verifikasi ke <strong>{samarkanEmail(email)}</strong>. Tautannya berlaku
        60 menit. Kalau tidak ada di inbox, periksa folder spam.
      </p>

      {pesan ? (
        <AlertBanner
          diForm
          nada={pesan.nada}
          judul={pesan.judul}
          teks={pesan.detail}
          {...(gagal?.correlationId ? { correlationId: gagal.correlationId } : {})}
        />
      ) : null}

      <div className={styles.aksiBaris}>
        <button
          type="button"
          onClick={onKirimUlang}
          disabled={terkunci}
          className={styles.tombolKirimUlang}
        >
          {memproses ? <span aria-hidden="true" className={styles.spinner} /> : null}
          {memproses
            ? 'Mengirim…'
            : sisa > 0
              ? `Kirim ulang dalam ${sisa} detik`
              : 'Kirim ulang tautan'}
        </button>

        <button type="button" onClick={onKembali} className={styles.tombolSekunder}>
          Kembali ke halaman masuk
        </button>
      </div>

      <p aria-live="polite" className={styles.liveHasil}>
        {live}
      </p>

      {AUTH_MOCK ? (
        <div className={styles.demoBaris}>
          <p className={styles.demoTeks}>
            Mode prototype: tidak ada email yang benar-benar terkirim.
          </p>
          <button
            type="button"
            onClick={async () => {
              const berhasil = await verifikasiDemo(email);
              setLive(
                berhasil
                  ? 'Email ditandai terverifikasi. Sekarang akun ini bisa dipakai masuk.'
                  : 'Akun ini sudah terverifikasi atau tidak ada di data tiruan.',
              );
            }}
            className={styles.demoTombol}
          >
            Tandai email terverifikasi
          </button>
        </div>
      ) : null}
    </div>
  );
}
