'use client';

import { useId, useState } from 'react';
import { Ikon } from '@/components/app/Ikon';
import { JENIS_MASALAH, NOMOR_REFERENSI, PENDAFTARAN_TERKAIT } from '@/data/bantuan';
import ui from '@/components/app/ui.module.css';
import styles from './FormLaporan.module.css';

/** Pola sederhana untuk mencegat NIK/nomor identitas yang tidak sengaja diketik. */
const POLA_ANGKA_PANJANG = /\d[\d\s.-]{13,}/;

/**
 * Formulir laporan masalah.
 *
 * Nomor referensi terisi otomatis dari sesi dan tidak bisa diketik — panitia
 * sudah bisa menemukan data peserta dari nomor itu, jadi kolom keterangan tidak
 * pernah butuh NIK. Kalau peserta tetap mengetik deret angka panjang, formulir
 * memperingatkan sebelum dikirim (agents.md §6).
 *
 * TODO(api-contract): `POST /api/v1/me/support` yang mengembalikan nomor tiket.
 * Pemindaian lampiran dan penyaringan PII final tetap di server.
 */
export function FormLaporan({ jenisAwal }: { readonly jenisAwal?: string }) {
  const id = useId();
  const [pendaftaran, setPendaftaran] = useState<string>(PENDAFTARAN_TERKAIT[0]);
  const [jenis, setJenis] = useState<string>(
    JENIS_MASALAH.some((j) => j.nilai === jenisAwal) ? (jenisAwal as string) : JENIS_MASALAH[0].nilai,
  );
  const [keterangan, setKeterangan] = useState('');
  const [kirim, setKirim] = useState(false);
  const [tiket, setTiket] = useState<string | null>(null);

  const adaAngkaPanjang = POLA_ANGKA_PANJANG.test(keterangan);
  const cukup = keterangan.trim().length >= 20;
  const bisa = cukup && !adaAngkaPanjang && !kirim;

  if (tiket) {
    return (
      <div aria-live="polite" className={`${ui.panel} ${ui.panelSukses}`}>
        <span aria-hidden="true" className={ui.panelIkon}>
          <Ikon nama="centang" ukuran={18} tebal={2.4} />
        </span>
        <span>
          Laporan terkirim dengan nomor tiket <strong>{tiket}</strong>. Nomor yang sama dikirim ke
          emailmu dan muncul di notifikasi. Balasan panitia maksimal 1×24 jam pada hari kerja.
        </span>
      </div>
    );
  }

  async function kirimLaporan() {
    if (!bisa) return;
    setKirim(true);
    await new Promise((r) => setTimeout(r, 500));
    setKirim(false);
    setTiket('TKT-2026-01188');
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void kirimLaporan();
      }}
      className={styles.form}
    >
      <div className={styles.field}>
        <label htmlFor={`${id}-pendaftaran`} className={styles.label}>
          Pendaftaran terkait <span className={styles.wajib}>*</span>
        </label>
        <select
          id={`${id}-pendaftaran`}
          value={pendaftaran}
          onChange={(e) => setPendaftaran(e.target.value)}
          className={styles.select}
        >
          {PENDAFTARAN_TERKAIT.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor={`${id}-jenis`} className={styles.label}>
          Jenis masalah <span className={styles.wajib}>*</span>
        </label>
        <select
          id={`${id}-jenis`}
          value={jenis}
          onChange={(e) => setJenis(e.target.value)}
          className={styles.select}
        >
          {JENIS_MASALAH.map((j) => (
            <option key={j.nilai} value={j.nilai}>
              {j.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor={`${id}-keterangan`} className={styles.label}>
          Keterangan <span className={styles.wajib}>*</span>
        </label>
        <textarea
          id={`${id}-keterangan`}
          rows={5}
          value={keterangan}
          onChange={(e) => setKeterangan(e.target.value)}
          placeholder="Ceritakan apa yang terjadi, kapan, dan di layar mana. Semakin spesifik, semakin cepat panitia bisa menindaklanjuti."
          aria-describedby={`${id}-privasi`}
          aria-invalid={adaAngkaPanjang}
          className={styles.textarea}
        />
        <p id={`${id}-privasi`} className={adaAngkaPanjang ? styles.galat : styles.bantuan}>
          <Ikon nama={adaAngkaPanjang ? 'seru' : 'bantuan'} ukuran={14} tebal={2.2} />
          {adaAngkaPanjang
            ? 'Sepertinya ada deret angka panjang di keteranganmu. Jangan menuliskan NIK atau nomor identitas — hapus dulu sebelum mengirim.'
            : 'Jangan menuliskan NIK, nomor KTP, atau data pribadi lain di kolom ini. Panitia sudah bisa melihat datamu dari nomor referensi.'}
        </p>
      </div>

      <div className={styles.field}>
        <span className={styles.label}>Nomor referensi</span>
        <div className={styles.terisi}>
          <span className={styles.mono}>{NOMOR_REFERENSI}</span>
          <span className={styles.otomatis}>Terisi otomatis</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={!bisa}
        aria-disabled={!bisa}
        className={`${ui.tombol} ${ui.tombolUtama} ${styles.kirim}`}
      >
        {kirim ? 'Mengirim…' : 'Kirim laporan'}
      </button>

      <p aria-live="polite" className={styles.bantuan}>
        {!cukup
          ? 'Tulis keterangan minimal 20 karakter supaya panitia tidak perlu bertanya balik.'
          : adaAngkaPanjang
            ? 'Hapus deret angka panjang di keterangan untuk mengaktifkan tombol kirim.'
            : 'Kamu akan menerima nomor tiket lewat email dan notifikasi.'}
      </p>
    </form>
  );
}
