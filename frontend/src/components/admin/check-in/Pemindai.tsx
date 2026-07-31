'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Ikon } from '@/components/app/Ikon';
import { useOnline } from '@/hooks/useOnline';
import type { KodeAlasanPindai } from '@/types/admin';
import adm from '@/components/admin/adm.module.css';
import styles from './Pemindai.module.css';

type Keadaan = 'siap' | 'menunggu' | 'berhasil' | 'duplikat' | 'ditolak' | 'gagal';

/**
 * Pemindai QR check-in (E3.2a) — mobile portrait lebih dulu.
 *
 * Aturan yang paling menentukan bentuk layar ini: **jangan pernah menampilkan
 * "berhasil" sebelum server menjawab.** Selama menunggu, layar tidak memakai
 * warna apa pun dan bingkai pindai dikunci supaya kartu berikutnya tidak terbaca
 * lebih dulu. Kalau server tidak menjawab, hasilnya bukan gagal dan bukan
 * berhasil — statusnya *belum diketahui*, dan itu yang ditulis, karena petugas
 * di lapangan akan memutuskan mengizinkan masuk atau tidak dari layar ini
 * (agents.md §0 prinsip 1 dan §4 "Offline").
 *
 * Keadaan ditolak tidak menampilkan nama atau ID — hanya kode alasan, karena
 * layar ini terlihat orang lain di antrean (agents.md §6).
 *
 * Hasil diumumkan lewat `aria-live` assertive: petugas sering tidak melihat
 * layar saat memindai, dan pembaca layar harus menyebut hasilnya sendiri
 * (agents.md §7).
 *
 * TODO(api-contract): akses kamera dan pembacaan QR belum tersambung. Yang
 * ditunggu bukan komponennya melainkan endpoint `POST /checkins/scan`; tombol
 * simulasi di bawah menggantikan pemicu kamera supaya seluruh keadaan bisa
 * ditinjau tanpa perangkat.
 */
export function Pemindai({
  cabang,
  venue,
  jam,
  bolehKodeManual,
  kodeAlasan,
  ringkas,
}: {
  readonly cabang: string;
  readonly venue: string;
  readonly jam: string;
  readonly bolehKodeManual: boolean;
  readonly kodeAlasan: readonly KodeAlasanPindai[];
  readonly ringkas: { readonly berhasil: number; readonly duplikat: number; readonly ditolak: number };
}) {
  const [keadaan, setKeadaan] = useState<Keadaan>('siap');
  const [putaran, setPutaran] = useState(0);
  const online = useOnline();

  const urutanDemo: readonly Keadaan[] = ['berhasil', 'duplikat', 'ditolak', 'gagal'];

  const pindai = () => {
    if (keadaan === 'menunggu') return;
    setKeadaan('menunggu');
    const berikut = urutanDemo[putaran % urutanDemo.length]!;
    setPutaran((p) => p + 1);
    setTimeout(() => setKeadaan(berikut), 1200);
  };

  const pengumuman =
    keadaan === 'menunggu'
      ? 'Menunggu jawaban server. Jangan izinkan masuk sebelum hasil muncul.'
      : keadaan === 'berhasil'
        ? 'Berhasil. Peserta tercatat check-in.'
        : keadaan === 'duplikat'
          ? 'Duplikat. Peserta ini sudah check-in sebelumnya hari ini.'
          : keadaan === 'ditolak'
            ? 'Ditolak. Kode alasan CHK-04, bukan cabang ini.'
            : keadaan === 'gagal'
              ? 'Tidak ada jawaban dari server. Status peserta ini belum diketahui.'
              : 'Siap memindai. Hasil akan diumumkan di sini dan dibacakan pembaca layar.';

  return (
    <div className={styles.perangkat}>
      <header className={styles.kepala}>
        <div className={styles.kepalaBaris}>
          <span className={styles.kepalaJudul}>Check-in</span>
          <span className={styles.kepalaJam}>
            <span aria-hidden="true" data-daring={online} className={styles.titik} />
            {online ? 'Daring' : 'Luring'} · {jam}
          </span>
        </div>

        <div className={styles.kepalaBaris}>
          <span className={styles.kepalaCabang}>
            <span className={adm.eyebrow}>Cabang</span>
            <strong>
              {cabang} · {venue}
            </strong>
          </span>
          <button type="button" className={`${adm.tombol} ${adm.tombolKecil}`}>
            Ganti
          </button>
        </div>
      </header>

      <div data-keadaan={keadaan} className={styles.layar}>
        {keadaan === 'siap' || keadaan === 'menunggu' ? (
          <div className={styles.bingkai}>
            <span aria-hidden="true" className={styles.sudutKiriAtas} />
            <span aria-hidden="true" className={styles.sudutKananAtas} />
            <span aria-hidden="true" className={styles.sudutKiriBawah} />
            <span aria-hidden="true" className={styles.sudutKananBawah} />
            <p className={styles.bingkaiTeks}>
              {keadaan === 'menunggu'
                ? 'Memverifikasi ke server… bingkai dikunci'
                : 'Arahkan bingkai ke QR kartu peserta'}
            </p>
          </div>
        ) : (
          <div className={styles.hasil}>
            <span aria-hidden="true" className={styles.hasilIkon}>
              <Ikon
                nama={
                  keadaan === 'berhasil'
                    ? 'centang'
                    : keadaan === 'duplikat'
                      ? 'ulang'
                      : keadaan === 'ditolak'
                        ? 'silang'
                        : 'seru'
                }
                ukuran={32}
                tebal={2.2}
              />
            </span>

            <p className={styles.hasilKata}>
              {keadaan === 'berhasil'
                ? 'BERHASIL'
                : keadaan === 'duplikat'
                  ? 'DUPLIKAT'
                  : keadaan === 'ditolak'
                    ? 'DITOLAK'
                    : 'BELUM DIKETAHUI'}
            </p>

            {keadaan === 'berhasil' ? (
              <>
                <p className={styles.hasilJudul}>Rafi Ardiansyah · Garuda Biru</p>
                <dl className={styles.hasilRincian}>
                  <div>
                    <dt>ID peserta</dt>
                    <dd className={adm.mono}>PSM-2026-••••-4471</dd>
                  </div>
                  <div>
                    <dt>Check-in tercatat</dt>
                    <dd>13.42.08 WIB</dd>
                  </div>
                  <div>
                    <dt>Laga berikutnya</dt>
                    <dd>14.00 · Lap 1</dd>
                  </div>
                </dl>
              </>
            ) : null}

            {keadaan === 'duplikat' ? (
              <>
                <p className={styles.hasilJudul}>Sudah pernah check-in hari ini</p>
                <dl className={styles.hasilRincian}>
                  <div>
                    <dt>ID peserta</dt>
                    <dd className={adm.mono}>PSM-2026-••••-2210</dd>
                  </div>
                  <div>
                    <dt>Check-in pertama</dt>
                    <dd>11.18.42 WIB</dd>
                  </div>
                  <div>
                    <dt>Dicatat oleh</dt>
                    <dd>Petugas meja 2</dd>
                  </div>
                </dl>
                <p className={styles.hasilCatatan}>
                  Tidak ada catatan baru dibuat. Peserta tetap sah masuk — cukup arahkan ke lapangan.
                </p>
              </>
            ) : null}

            {keadaan === 'ditolak' ? (
              <>
                <p className={styles.hasilJudul}>Jangan izinkan masuk lapangan</p>
                <dl className={styles.hasilRincian}>
                  <div>
                    <dt>Kode alasan</dt>
                    <dd className={adm.mono}>CHK-04</dd>
                  </div>
                  <div>
                    <dt>Arti</dt>
                    <dd>Bukan cabang ini</dd>
                  </div>
                </dl>
                <p className={styles.hasilCatatan}>
                  Tidak ada nama, ID, atau data pribadi yang ditampilkan pada keadaan ditolak.
                  Arahkan peserta ke meja informasi dengan menyebut kode ini.
                </p>
                <ul className={styles.kodeDaftar}>
                  {kodeAlasan.map((k) => (
                    <li key={k.kode}>
                      <span className={adm.mono}>{k.kode}</span> {k.arti}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}

            {keadaan === 'gagal' ? (
              <>
                <p className={styles.hasilJudul}>Tidak ada jawaban dari server</p>
                <p className={styles.hasilCatatan}>
                  Pindaian tidak sampai ke server dalam 10 detik, jadi{' '}
                  <strong>status peserta ini belum diketahui</strong> — bukan berhasil dan bukan
                  ditolak. Catat manual di lembar cadangan, lalu pindai ulang begitu sinyal kembali.
                </p>
                <p className={styles.hasilRef}>Ref CHK-GAL-118</p>
              </>
            ) : null}
          </div>
        )}
      </div>

      <footer className={styles.kaki}>
        <p aria-live="assertive" className={styles.pengumuman}>
          {pengumuman}
        </p>

        <div className={styles.hitungan}>
          <span className={styles.hitunganItem} data-nada="ok">
            {ringkas.berhasil} berhasil
          </span>
          <span className={styles.hitunganItem} data-nada="warn">
            {ringkas.duplikat} duplikat
          </span>
          <span className={styles.hitunganItem} data-nada="danger">
            {ringkas.ditolak} ditolak
          </span>
        </div>

        <button
          type="button"
          disabled={keadaan === 'menunggu'}
          onClick={pindai}
          className={`${adm.tombol} ${adm.tombolUtama} ${styles.tombolPindai}`}
        >
          {keadaan === 'menunggu'
            ? 'Memverifikasi…'
            : keadaan === 'siap'
              ? 'Pindai kartu peserta'
              : 'Pindai peserta berikutnya'}
        </button>

        {bolehKodeManual ? (
          <Link href="/admin/check-in/manual" className={adm.tautan}>
            Pakai kode manual
          </Link>
        ) : (
          <p className={adm.catatan}>
            Bila QR tidak terbaca, arahkan peserta ke petugas senior di meja 1. Jalur kode manual
            tidak dirender untuk peranmu, jadi tidak ada tombol mati yang menggantung.
          </p>
        )}
      </footer>
    </div>
  );
}
