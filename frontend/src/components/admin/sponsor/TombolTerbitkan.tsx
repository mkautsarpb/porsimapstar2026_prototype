'use client';

import Link from 'next/link';
import { useState } from 'react';
import { DialogAksiKritis } from '@/components/admin/DialogAksiKritis';
import adm from '@/components/admin/adm.module.css';

/**
 * Tombol terbitkan susunan sponsor (E4.1).
 *
 * Terkunci selama ada logo yang belum memenuhi panduan ukuran, dengan alasannya
 * tertulis — bukan tombol abu-abu tanpa keterangan. Menerbitkan susunan mengubah
 * apa yang dilihat pengunjung portal, jadi tetap lewat dialog berisi ringkasan
 * dan alasan yang masuk audit log.
 */
export function TombolTerbitkan({
  jumlahBermasalah,
  jumlahPerubahan,
  ringkasTingkat,
  waktuServerIso,
}: {
  readonly jumlahBermasalah: number;
  readonly jumlahPerubahan: number;
  readonly ringkasTingkat: readonly { readonly label: string; readonly nilai: string }[];
  readonly waktuServerIso: string;
}) {
  const [terbuka, setTerbuka] = useState(false);
  const terkunci = jumlahBermasalah > 0;

  return (
    <>
      <div className={adm.barisAksi}>
        <button
          type="button"
          disabled={terkunci}
          title={
            terkunci ? `${jumlahBermasalah} logo belum memenuhi panduan ukuran` : undefined
          }
          onClick={() => setTerbuka(true)}
          className={`${adm.tombol} ${adm.tombolUtama}`}
        >
          Terbitkan susunan
        </button>

        <Link href="/" className={adm.tombol}>
          Buka portal
        </Link>

        {terkunci ? (
          <span className={adm.catatan}>
            Terkunci: {jumlahBermasalah} logo belum memenuhi panduan ukuran dan akan tampak pecah di
            portal.
          </span>
        ) : null}
      </div>

      <DialogAksiKritis
        terbuka={terbuka}
        onTutup={() => setTerbuka(false)}
        judul="Terbitkan susunan sponsor"
        sub="Mengubah bagian sponsor di landing page publik"
        awalanRef="SPN"
        waktuServerIso={waktuServerIso}
        ringkasanDampak="Yang akan berubah di portal"
        dampak={[
          { label: 'Perubahan belum terbit', nilai: `${jumlahPerubahan} perubahan` },
          ...ringkasTingkat,
        ]}
        catatanDampak={
          <p>
            Susunan baru langsung terlihat pengunjung setelah diterbitkan. Bagian sponsor tidak
            dirender sama sekali bila daftarnya kosong — pengunjung tidak melihat blok kosong.
          </p>
        }
        alasan={{
          label: 'Catatan penerbitan',
          bantuan: 'Sebut sponsor mana yang berubah dan dasar perubahannya (mis. surat kerja sama).',
          minimal: 20,
          maksimal: 300,
          baku: [],
        }}
        labelKirim="Terbitkan susunan"
        pesanBerhasil="Susunan sponsor diterbitkan"
      />
    </>
  );
}
