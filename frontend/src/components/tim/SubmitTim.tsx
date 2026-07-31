'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Ikon } from '@/components/app/Ikon';
import type { Tim } from '@/types/tim';
import ui from '@/components/app/ui.module.css';
import styles from './SubmitTim.module.css';

/**
 * Blok submit tim.
 *
 * Alasan tombol nonaktif selalu terlihat — tombol mati tanpa penjelasan adalah
 * jalan buntu. Kelayakan submit ditentukan server lewat daftar syarat; komponen
 * ini tidak menghitung ulang, hanya membaca berapa yang belum terpenuhi.
 *
 * TODO(api-contract): `POST /api/v1/me/teams/{teamId}/submit` dengan idempotency
 * key. Error yang wajib punya penanganan sendiri: TEAM_ROSTER_NOT_READY,
 * TEAM_ROSTER_LOCKED, VERSION_CONFLICT, NETWORK_TIMEOUT (cek status terbaru
 * sebelum menyimpulkan gagal).
 */
export function SubmitTim({ tim }: { readonly tim: Tim }) {
  const [kirim, setKirim] = useState(false);
  const [referensi, setReferensi] = useState<string | null>(null);

  const belum = tim.syarat.filter((s) => s.keadaan !== 'ok');
  const siap = belum.length === 0 && !tim.terkunci;

  if (referensi) {
    return <BuktiSubmit tim={tim} referensi={referensi} waktu="baru saja" jumlah={tim.bergabung} />;
  }

  if (tim.bukti) {
    return (
      <BuktiSubmit
        tim={tim}
        referensi={tim.bukti.nomorReferensi}
        waktu={tim.bukti.waktu}
        jumlah={tim.bukti.jumlahAnggota}
      />
    );
  }

  async function submit() {
    if (kirim) return;
    setKirim(true);
    // TODO(api-contract): mutasi sebenarnya; sukses tidak diklaim sebelum respons server.
    await new Promise((r) => setTimeout(r, 500));
    setKirim(false);
    setReferensi(`TIM-${tim.id.toUpperCase().slice(0, 6)}-00418`);
  }

  return (
    <div className={siap ? styles.blokSiap : styles.blok}>
      <div className={styles.alasan}>
        <strong className={styles.alasanJudul}>
          {siap
            ? 'Semua syarat terpenuhi — tim siap disubmit'
            : `Belum bisa disubmit: ${belum.length} syarat belum terpenuhi`}
        </strong>
        <p className={styles.alasanTeks}>
          {siap
            ? 'Setelah disubmit, daftar anggota dikunci. Kamu tidak bisa lagi mengundang, membatalkan undangan, atau mengeluarkan anggota.'
            : belum.map((s) => s.judul).join(' · ')}
          {!siap ? '. Perbaikannya ada di tangan anggota masing-masing — kamu bisa mengingatkan, tidak bisa menggantikan.' : ''}
        </p>
      </div>

      <button
        type="button"
        disabled={!siap || kirim}
        aria-disabled={!siap || kirim}
        onClick={submit}
        className={`${ui.tombol} ${ui.tombolUtama}`}
      >
        {kirim ? 'Mengirim…' : 'Submit tim'}
      </button>
    </div>
  );
}

function BuktiSubmit({
  tim,
  referensi,
  waktu,
  jumlah,
}: {
  readonly tim: Tim;
  readonly referensi: string;
  readonly waktu: string;
  readonly jumlah: number;
}) {
  return (
    <div aria-live="polite" className={styles.sukses}>
      <span aria-hidden="true" className={styles.suksesIkon}>
        <Ikon nama="centang" ukuran={24} tebal={2.6} />
      </span>
      <h3 className={styles.suksesJudul}>Tim {tim.nama} sudah disubmit</h3>

      <dl className={styles.rincian}>
        <div>
          <dt>Nomor referensi</dt>
          <dd>{referensi}</dd>
        </div>
        <div>
          <dt>Waktu submit</dt>
          <dd>{waktu}</dd>
        </div>
        <div>
          <dt>Anggota terdaftar</dt>
          <dd>{jumlah} orang</dd>
        </div>
      </dl>

      <p className={styles.suksesTeks}>
        Daftar anggota kini <strong>terkunci</strong>: tidak bisa lagi mengundang, membatalkan
        undangan, atau mengeluarkan anggota. Panitia memakai daftar ini untuk verifikasi akhir dan
        penyusunan jadwal; perubahan darurat hanya lewat sekretariat.
      </p>
      <p className={styles.suksesTeks}>
        Simpan nomor referensi untuk komunikasi dengan panitia. Bukti submit juga dikirim ke emailmu.
      </p>

      <div className={styles.suksesAksi}>
        <Link href={`/tim/${tim.id}`} className={ui.tombol}>
          Kembali ke tim
        </Link>
        <Link href={`/tim/${tim.id}/riwayat`} className={ui.tombol}>
          Lihat riwayat tim
        </Link>
      </div>
    </div>
  );
}
