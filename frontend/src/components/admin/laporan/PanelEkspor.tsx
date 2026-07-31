'use client';

import { useState } from 'react';
import { Ikon } from '@/components/app/Ikon';
import { DialogEkspor } from '@/components/admin/DialogEkspor';
import { KartuKeadaan } from '@/components/admin/KartuKeadaan';
import { formatAngka } from '@/lib/admin/format';
import type { PekerjaanEkspor } from '@/types/admin';
import adm from '@/components/admin/adm.module.css';
import styles from './PanelEkspor.module.css';

/**
 * Panel pekerjaan ekspor (E4.3).
 *
 * Ekspor adalah pekerjaan latar belakang, bukan aksi seketika — halaman boleh
 * ditutup dan tautannya menyusul sebagai notifikasi. Itu ditulis di kartu
 * pekerjaan berjalan supaya tidak ada yang menunggui bilah kemajuan.
 *
 * Masa berlaku tautan ditulis di SEBELAH tombol unduh, bukan setelah tautannya
 * mati. Ini aturan lintas modul Batch E4, dan urutan penulisannya yang penting:
 * orang membaca tombol dulu, jadi keterangan masa berlaku harus sudah terbaca
 * sebelum jarinya sampai ke sana.
 */
export function PanelEkspor({
  pekerjaan,
  ringkasFilter,
  kolom,
  jumlahBaris,
  masaBerlakuMenit,
  waktuServerIso,
}: {
  readonly pekerjaan: readonly PekerjaanEkspor[];
  readonly ringkasFilter: readonly { readonly label: string; readonly nilai: string }[];
  readonly kolom: readonly string[];
  readonly jumlahBaris: number;
  readonly masaBerlakuMenit: number;
  readonly waktuServerIso: string;
}) {
  const [dialogTerbuka, setDialogTerbuka] = useState(false);

  return (
    <>
      <div className={adm.bagianKepala}>
        <h2 className={adm.judulBagian}>Pekerjaan ekspor</h2>
        <button
          type="button"
          onClick={() => setDialogTerbuka(true)}
          className={`${adm.tombol} ${adm.tombolUtama}`}
        >
          Buat ekspor
        </button>
      </div>

      <div className={styles.daftar}>
        {pekerjaan.map((p) => {
          if (p.keadaan === 'berjalan') {
            return (
              <div key={p.id} className={adm.kartu}>
                <div className={adm.kartuKepala}>
                  <h3 className={adm.kartuJudul}>Pekerjaan berjalan · {p.judul}</h3>
                  <span className={adm.eyebrow}>Berjalan di latar belakang</span>
                </div>

                <span
                  role="img"
                  aria-label={`Kemajuan ${p.persen ?? 0} persen`}
                  className={adm.meter}
                >
                  <span style={{ width: `${p.persen ?? 0}%` }} className={adm.meterIsi} />
                </span>

                <p className={adm.meta}>
                  {p.persen}% · {formatAngka(p.barisDiproses ?? 0)} dari{' '}
                  {formatAngka(p.totalBaris)} baris diproses
                </p>
                <p className={adm.catatan}>
                  Ref {p.ref} · dimulai {p.mulai} oleh {p.oleh}. Kamu boleh menutup halaman ini —
                  pekerjaan tetap jalan dan tautan unduhan dikirim sebagai notifikasi dalam aplikasi
                  begitu siap.
                </p>
              </div>
            );
          }

          if (p.keadaan === 'siap') {
            return (
              <div key={p.id} className={adm.kartu}>
                <div className={adm.kartuKepala}>
                  <h3 className={adm.kartuJudul}>Siap diunduh · {p.judul}</h3>
                  <span className={adm.eyebrow}>Selesai {p.selesai}</span>
                </div>

                <div className={styles.unduh}>
                  <button type="button" className={`${adm.tombol} ${adm.tombolUtama}`}>
                    <Ikon nama="unduh" ukuran={14} tebal={2.2} />
                    Unduh CSV · {p.ukuran}
                  </button>

                  <div className={styles.masaBerlaku}>
                    <p className={styles.masaJudul}>
                      Tautan berlaku sampai {p.berlakuSampai} · sisa {p.sisaMenit} menit
                    </p>
                    <p className={adm.catatan}>
                      Setelah itu tautan mati dan ekspor harus dibuat ulang — berkas tidak disimpan
                      di server.
                    </p>
                  </div>
                </div>

                <p className={adm.catatan}>
                  Ref {p.ref} · {formatAngka(p.totalBaris)} baris · {p.jumlahKolom} kolom ·{' '}
                  {p.catatanMasking}
                </p>
              </div>
            );
          }

          return (
            <KartuKeadaan
              key={p.id}
              nada="danger"
              keadaan="Gagal"
              judul={`Ekspor berhenti pada ${p.persen}% · ${p.judul}`}
              teks={
                <p>
                  Pekerjaan berhenti setelah {formatAngka(p.barisDiproses ?? 0)} dari{' '}
                  {formatAngka(p.totalBaris)} baris. {p.catatanMasking} Catatan kegagalan tetap masuk
                  riwayat ekspor.
                </p>
              }
              nomorRef={p.ref}
              aksi={
                <>
                  <button
                    type="button"
                    onClick={() => setDialogTerbuka(true)}
                    className={`${adm.tombol} ${adm.tombolUtama}`}
                  >
                    Jalankan ulang dengan filter sama
                  </button>
                  <button type="button" className={adm.tombol}>
                    Salin nomor referensi
                  </button>
                </>
              }
            />
          );
        })}
      </div>

      <DialogEkspor
        terbuka={dialogTerbuka}
        onTutup={() => setDialogTerbuka(false)}
        judul="Buat ekspor · Rekap peserta per cabang"
        sub="Berjalan di latar belakang · kamu tidak perlu menunggu di halaman ini"
        jumlahBaris={jumlahBaris}
        ringkas={ringkasFilter}
        kolom={kolom}
        masaBerlakuMenit={masaBerlakuMenit}
        waktuServerIso={waktuServerIso}
        catatanMasking="Masking mengikuti peranmu: NIK tidak disertakan dan ID peserta tetap termasking di dalam berkas. Peran dengan wewenang lebih luas menghasilkan berkas dengan kolom yang sama — masking tidak pernah dilonggarkan lewat dialog ini."
      />
    </>
  );
}
