'use client';

import Link from 'next/link';
import { Ikon } from '@/components/app/Ikon';
import type { RingkasKesehatan } from '@/types/panitia';
import styles from './PilKesehatan.module.css';

/**
 * Pil kesehatan sistem di topbar — SELALU terlihat, di semua tab dan semua
 * halaman Panel Panitia.
 *
 * Kenapa tidak ikut disembunyikan ke dalam tab Sistem: kalau sinkronisasi gagal
 * berjam-jam pada hari pelaksanaan, angka di tab Lomba dan Operasional ikut
 * salah. Harus ada yang menyadarinya tanpa perlu membuka tab teknis. Ini
 * satu-satunya jejak sistem yang boleh muncul di luar tab Sistem, dan itu
 * disengaja — bukan kelalaian minimalis.
 *
 * Untuk akun tanpa izin integrasi, pil tetap tampil tapi TIDAK menjadi tautan:
 * mengarahkan orang ke tab yang tidak boleh ia buka hanya memindahkan
 * kebingungan (FE-ADMIN-002).
 */
export function PilKesehatan({
  kesehatan,
  bolehBukaSistem,
}: {
  readonly kesehatan: RingkasKesehatan;
  readonly bolehBukaSistem: boolean;
}) {
  const bermasalah = kesehatan.keadaan !== 'normal';

  const teks = bermasalah
    ? `${kesehatan.jumlahBermasalah} dari ${kesehatan.jumlahLayanan} layanan bermasalah`
    : `${kesehatan.jumlahLayanan} layanan normal`;

  const rincian = bermasalah ? kesehatan.namaBermasalah.join(', ') : '';

  const isi = (
    <>
      {bermasalah ? (
        <Ikon nama="seru" ukuran={12} tebal={2.4} />
      ) : (
        <span aria-hidden="true" className={styles.titik} />
      )}
      {teks}
    </>
  );

  if (bermasalah && bolehBukaSistem) {
    return (
      <Link
        href="/admin/dashboard?tab=sistem"
        data-keadaan={kesehatan.keadaan}
        className={styles.pil}
      >
        {isi}
        <span className="sr-only">— {rincian}. Buka tab Sistem.</span>
      </Link>
    );
  }

  return (
    <span data-keadaan={kesehatan.keadaan} className={styles.pil}>
      {isi}
      {bermasalah ? (
        <span className="sr-only">
          — {rincian}. Rincian hanya bisa dibuka Super Admin.
        </span>
      ) : null}
    </span>
  );
}
