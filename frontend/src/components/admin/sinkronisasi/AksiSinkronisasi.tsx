'use client';

import { useState } from 'react';
import { DialogAksiKritis } from '@/components/admin/DialogAksiKritis';
import adm from '@/components/admin/adm.module.css';

/**
 * Dua aksi modul Sinkronisasi: sinkron manual dan coba ulang email gagal (E4.4).
 *
 * Keduanya membuat pekerjaan latar belakang, bukan aksi seketika — itu ditulis
 * di sub-judul dialog supaya tidak ada yang menunggui hasilnya.
 *
 * Pada coba ulang email, jumlah yang "layak dicoba" dipisahkan dari yang
 * kemungkinan besar gagal lagi. Mengirim ulang 14 email ke alamat yang tidak
 * ditemukan bukan cuma sia-sia: kegagalan berulang ke domain yang sama menurunkan
 * reputasi pengirim, dan itu memengaruhi email yang seharusnya sampai.
 */
export function AksiSinkronisasi({
  lembarBermasalah,
  barisMenunggu,
  emailGagal,
  emailLayakDicoba,
  rincianGagal,
  waktuServerIso,
}: {
  readonly lembarBermasalah: string;
  readonly barisMenunggu: number;
  readonly emailGagal: number;
  readonly emailLayakDicoba: number;
  readonly rincianGagal: readonly { readonly label: string; readonly nilai: string }[];
  readonly waktuServerIso: string;
}) {
  const [dialog, setDialog] = useState<'sinkron' | 'email' | null>(null);

  return (
    <>
      <div className={adm.barisAksi}>
        <button
          type="button"
          onClick={() => setDialog('sinkron')}
          className={`${adm.tombol} ${adm.tombolUtama}`}
        >
          Sinkronkan manual…
        </button>

        {emailGagal > 0 ? (
          <button type="button" onClick={() => setDialog('email')} className={adm.tombol}>
            Coba ulang {emailGagal} email gagal…
          </button>
        ) : null}
      </div>

      <DialogAksiKritis
        terbuka={dialog === 'sinkron'}
        onTutup={() => setDialog(null)}
        judul="Sinkronkan manual ke Google Sheets"
        sub="Membuat pekerjaan berlatar belakang, bukan aksi seketika"
        awalanRef="SYN"
        waktuServerIso={waktuServerIso}
        ringkasanDampak="Yang akan terjadi"
        dampak={[
          { label: 'Lembar yang disinkronkan', nilai: lembarBermasalah },
          { label: 'Baris menunggu', nilai: `${barisMenunggu} baris` },
          { label: 'Lembar lain', nilai: 'Sudah sinkron — tidak ikut ditulis ulang' },
          { label: 'Penghapusan lembar', nilai: 'Tidak ada' },
        ]}
        catatanDampak={
          <>
            <p>
              Pekerjaan masuk antrean dan diberi nomor referensi. Kemajuannya terlihat di halaman
              ini; kamu tidak perlu menunggu. Sheets hanya ditulis ulang untuk baris yang berubah.
            </p>
            <p>
              Kalau kuota API masih penuh, pekerjaan akan gagal lagi dengan kode 429. Itu tidak
              memengaruhi data check-in di aplikasi.
            </p>
          </>
        }
        labelKirim="Buat pekerjaan sinkronisasi"
        pesanBerhasil="Pekerjaan sinkronisasi dibuat"
      />

      <DialogAksiKritis
        terbuka={dialog === 'email'}
        onTutup={() => setDialog(null)}
        judul={`Coba ulang ${emailGagal} email gagal?`}
        sub="Isi pesannya sama dan tidak digandakan di notifikasi dalam aplikasi"
        awalanRef="NTF"
        waktuServerIso={waktuServerIso}
        ringkasanDampak="Sebab kegagalan"
        dampak={rincianGagal}
        catatanDampak={
          <p>
            Hanya {emailLayakDicoba} dari {emailGagal} yang layak dicoba ulang. Untuk alamat yang
            tidak ditemukan, minta peserta memperbarui email di profilnya lebih dulu — mengirim ulang
            ke alamat mati hanya menurunkan reputasi pengirim. Notifikasi dalam aplikasi untuk orang
            yang sama tetap sampai, jadi tidak ada yang benar-benar kehilangan kabar.
          </p>
        }
        labelKirim={`Coba ulang ${emailLayakDicoba} yang layak`}
        pesanBerhasil={`${emailLayakDicoba} email dimasukkan ke antrean kirim ulang`}
      />
    </>
  );
}
