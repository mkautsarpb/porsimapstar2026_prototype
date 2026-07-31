'use client';

import Link from 'next/link';
import { useId, useState } from 'react';
import { Ikon } from '@/components/app/Ikon';
import ui from '@/components/app/ui.module.css';
import styles from './FormBuatTim.module.css';

const MAKS_NAMA = 40;

/**
 * Formulir buat tim (desain B1).
 *
 * Cabang lomba dikunci karena diambil dari halaman lomba tempat tombol "Buat
 * tim" ditekan — memindahkan tim ke cabang lain bukan operasi edit, melainkan
 * tim baru. Tombol submit terkunci sampai persetujuan peran ketua dicentang,
 * dan alasannya ditulis di bawah tombol, bukan disembunyikan di tooltip.
 *
 * TODO(api-contract): `POST /api/v1/me/teams` dengan idempotency key.
 * Validasi nama unik per cabang, batas ukuran logo, dan kesamaan institusi
 * anggota tetap keputusan server — yang di sini hanya untuk UX.
 */
export function FormBuatTim({
  lomba,
  roster,
  institusi,
  tenggat,
}: {
  readonly lomba: string;
  readonly roster: string;
  readonly institusi: string;
  readonly tenggat: string;
}) {
  const id = useId();
  const [nama, setNama] = useState('');
  const [setuju, setSetuju] = useState(false);
  const [kirim, setKirim] = useState(false);
  const [hasil, setHasil] = useState<string | null>(null);

  const namaValid = nama.trim().length >= 3;
  const bisa = namaValid && setuju && !kirim;

  if (hasil) {
    return (
      <div className={`${ui.panel} ${ui.panelSukses}`} aria-live="polite">
        <span aria-hidden="true" className={ui.panelIkon}>
          <Ikon nama="centang" ukuran={20} tebal={2.4} />
        </span>
        <div className={styles.suksesIsi}>
          <strong>Tim {nama.trim()} dibuat</strong>
          <p className={styles.suksesTeks}>
            Kamu masuk sebagai anggota pertama dengan status bergabung. Nomor referensi{' '}
            <strong>{hasil}</strong>. Langkah berikutnya adalah mengirim undangan — undangan yang
            menunggu belum dihitung sebagai anggota.
          </p>
          <Link href="/tim" className={`${ui.tombol} ${ui.tombolUtama}`}>
            Buka halaman tim
          </Link>
        </div>
      </div>
    );
  }

  async function buat() {
    if (!bisa) return;
    setKirim(true);
    await new Promise((r) => setTimeout(r, 500));
    setKirim(false);
    setHasil('TIM-BARU-00042');
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void buat();
      }}
      className={styles.form}
    >
      <div className={styles.field}>
        <span className={styles.label}>Cabang lomba</span>
        <div className={styles.terkunci}>
          <span>
            {lomba} · {roster}
          </span>
          <span className={styles.gembok}>
            <Ikon nama="jam" ukuran={13} tebal={2} />
            Tidak bisa diubah
          </span>
        </div>
        <p className={styles.bantuan}>
          Diambil dari halaman lomba tempat kamu menekan “Buat tim”. Untuk cabang lain, buat tim
          baru dari halaman cabang tersebut.
        </p>
      </div>

      <div className={styles.field}>
        <label htmlFor={`${id}-nama`} className={styles.label}>
          Nama tim <span className={styles.wajib}>*</span>
        </label>
        <input
          id={`${id}-nama`}
          type="text"
          value={nama}
          maxLength={MAKS_NAMA}
          onChange={(e) => setNama(e.target.value)}
          aria-describedby={`${id}-nama-bantuan`}
          className={styles.input}
        />
        <p id={`${id}-nama-bantuan`} className={styles.bantuanBaris}>
          <span>Muncul di jadwal dan pengumuman. Bisa diubah sampai tim disubmit.</span>
          <span>
            {nama.length}/{MAKS_NAMA}
          </span>
        </p>
      </div>

      <div className={styles.field}>
        <span className={styles.label}>
          Institusi <span className={styles.wajib}>*</span>
        </span>
        <div className={styles.terkunci}>
          <span>{institusi}</span>
        </div>
        <p className={styles.bantuan}>
          Terisi dari profilmu. Seluruh anggota harus berasal dari institusi yang sama.
        </p>
      </div>

      <label className={styles.persetujuan}>
        <input
          type="checkbox"
          checked={setuju}
          onChange={(e) => setSetuju(e.target.checked)}
          className={styles.centang}
        />
        <span>
          <strong className={styles.persetujuanJudul}>Saya bersedia menjadi ketua tim ini</strong>
          <span className={styles.persetujuanTeks}>
            Sebagai ketua, saya mengirim undangan, memantau kelengkapan anggota, dan mensubmit tim
            sebelum {tenggat}. Saya paham bahwa saya tidak bisa menambahkan anggota secara langsung —
            setiap calon harus menerima undangan dari akunnya sendiri, dan undangan yang menunggu
            tidak dihitung sebagai anggota.
          </span>
        </span>
      </label>

      <div className={styles.aksi}>
        <button
          type="submit"
          disabled={!bisa}
          aria-disabled={!bisa}
          className={`${ui.tombol} ${ui.tombolUtama}`}
        >
          {kirim ? 'Membuat tim…' : 'Buat tim'}
        </button>
        <Link href="/tim" className={ui.tombol}>
          Batal
        </Link>
      </div>

      <p aria-live="polite" className={styles.alasan}>
        <Ikon nama="bantuan" ukuran={15} tebal={2} />
        {!namaValid
          ? 'Isi nama tim minimal tiga karakter untuk mengaktifkan tombol ini.'
          : !setuju
            ? 'Centang persetujuan peran ketua untuk mengaktifkan tombol ini.'
            : 'Setelah tim dibuat, kamu langsung masuk sebagai anggota pertama berstatus bergabung.'}
      </p>
    </form>
  );
}
