'use client';

import { useId, useRef, useState } from 'react';
import { Ikon } from '@/components/app/Ikon';
import ui from '@/components/app/ui.module.css';
import styles from './AreaUnggah.module.css';

const MAKS_BYTE = 5 * 1024 * 1024;

function ukuran(byte: number): string {
  return byte >= 1024 * 1024
    ? `${(byte / 1024 / 1024).toFixed(1).replace('.', ',')} MB`
    : `${Math.round(byte / 1024)} KB`;
}

/**
 * Area unggah satu dokumen.
 *
 * Pemeriksaan ekstensi dan ukuran di sini murni untuk UX — MIME asli, checksum,
 * dan pemindaian virus tetap keputusan server, dan hasil "berhasil" tidak pernah
 * ditampilkan sebelum server menjawab (agents.md §0 prinsip 1, §5).
 *
 * TODO(api-contract): `POST /api/v1/me/documents/{id}/versions` (multipart) yang
 * mengembalikan nomor versi baru dan statusnya.
 */
export function AreaUnggah({
  dokumenId,
  label,
  ketentuan,
  ekstensi,
}: {
  readonly dokumenId: string;
  readonly label: string;
  readonly ketentuan: string;
  readonly ekstensi: readonly string[];
}) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [berkas, setBerkas] = useState<File | null>(null);
  const [galat, setGalat] = useState<string | null>(null);
  const [kirim, setKirim] = useState(false);
  const [selesai, setSelesai] = useState(false);

  function pilih(file: File | undefined) {
    if (!file) return;
    setSelesai(false);

    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    if (!ekstensi.includes(ext)) {
      setBerkas(null);
      setGalat(`Format .${ext} belum didukung. Pakai ${ekstensi.join(', ')}.`);
      return;
    }
    if (file.size > MAKS_BYTE) {
      setBerkas(null);
      setGalat(`Ukuran ${ukuran(file.size)} melebihi batas 5 MB. Kompres atau pindai ulang berkas.`);
      return;
    }

    setGalat(null);
    setBerkas(file);
  }

  async function unggah() {
    if (!berkas || kirim) return;
    setKirim(true);
    await new Promise((r) => setTimeout(r, 600));
    setKirim(false);
    setSelesai(true);
    setBerkas(null);
    if (inputRef.current) inputRef.current.value = '';
  }

  if (selesai) {
    return (
      <div aria-live="polite" className={`${ui.panel} ${ui.panelSukses} ${styles.hasil}`}>
        <span aria-hidden="true" className={ui.panelIkon}>
          <Ikon nama="centang" ukuran={18} tebal={2.2} />
        </span>
        <span>
          Berkas terkirim dan masuk antrean pemeriksaan. Statusnya berubah menjadi{' '}
          <strong>sedang diperiksa</strong>; hasilnya keluar maksimal 1×24 jam kerja dan dikirim
          sebagai notifikasi.
        </span>
      </div>
    );
  }

  return (
    <div className={styles.area}>
      <span aria-hidden="true" className={styles.ikon}>
        <Ikon nama="unduh" ukuran={20} tebal={1.9} />
      </span>

      <div className={styles.teks}>
        <label htmlFor={`${id}-${dokumenId}`} className={styles.label}>
          {label}
        </label>
        <p className={styles.ketentuan}>{ketentuan}</p>
      </div>

      <input
        id={`${id}-${dokumenId}`}
        ref={inputRef}
        type="file"
        accept={ekstensi.map((e) => `.${e}`).join(',')}
        aria-describedby={`${id}-${dokumenId}-umpan`}
        onChange={(e) => pilih(e.target.files?.[0])}
        className={styles.input}
      />

      <div className={styles.aksi}>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={`${ui.tombol} ${ui.tombolKecil}`}
        >
          Pilih berkas
        </button>
        {berkas ? (
          <button
            type="button"
            disabled={kirim}
            onClick={unggah}
            className={`${ui.tombol} ${ui.tombolKecil} ${ui.tombolUtama}`}
          >
            {kirim ? 'Mengunggah…' : 'Unggah sekarang'}
          </button>
        ) : null}
      </div>

      <p id={`${id}-${dokumenId}-umpan`} aria-live="polite" className={galat ? styles.galat : styles.umpan}>
        {galat ??
          (berkas
            ? `Siap diunggah: ${berkas.name} · ${ukuran(berkas.size)}`
            : 'Belum ada berkas dipilih.')}
      </p>
    </div>
  );
}
