'use client';

import { useId, useState } from 'react';
import { Ikon } from '@/components/app/Ikon';
import { DialogAksiKritis, type BarisDampak } from '@/components/admin/DialogAksiKritis';
import type { RentangKuota } from '@/types/admin';
import adm from '@/components/admin/adm.module.css';
import styles from './PengaturanKuota.module.css';

/**
 * Pengaturan kuota satu cabang (E2.1c).
 *
 * Menyimpan kapasitas TIDAK langsung menyimpan — tombolnya membuka dialog
 * dampak. Perubahan kuota memindahkan tim yang sudah mendaftar ke daftar tunggu
 * dan bisa menutup cabang, jadi ia aksi kritis: ringkasan dampak, alasan wajib,
 * pernyataan, lalu nomor referensi (FE-ADMIN-003).
 *
 * Ringkasan dampak datang sebagai prop dari server. Menghitungnya di sini
 * berarti menebak urutan pendaftaran yang otoritatif ada di basis data — dan
 * angka tebakan pada layar yang meminta konfirmasi justru paling berbahaya
 * (agents.md §0 prinsip 1).
 */
export function PengaturanKuota({
  namaCabang,
  kuota,
  kapasitasBaru,
  kebijakanDaftarTunggu,
  keadaanSekarang,
  dampak,
  catatanDampak,
  waktuServerIso,
}: {
  readonly namaCabang: string;
  readonly kuota: RentangKuota;
  /** Nilai contoh yang sudah diisi di formulir agar dampaknya bisa ditinjau. */
  readonly kapasitasBaru: number;
  readonly kebijakanDaftarTunggu: string;
  readonly keadaanSekarang: string;
  readonly dampak: readonly BarisDampak[];
  readonly catatanDampak: string;
  readonly waktuServerIso: string;
}) {
  const [kapasitas, setKapasitas] = useState(String(kapasitasBaru));
  const [terbatas, setTerbatas] = useState(kuota.kapasitas !== null);
  const [dialogTerbuka, setDialogTerbuka] = useState(false);
  const idKapasitas = useId();

  const angka = Number.parseInt(kapasitas, 10);
  const sah = Number.isFinite(angka) && angka > 0;
  const berubah = sah && angka !== kuota.kapasitas;

  return (
    <section className={adm.kartu}>
      <div className={adm.kartuKepala}>
        <h2 className={adm.kartuJudul}>Pengaturan kuota</h2>
        <span className={adm.eyebrow}>Aksi kritis</span>
      </div>

      <div className={`${adm.panel} ${adm.panelNetral}`}>
        <span aria-hidden="true" className={adm.panelIkon}>
          <Ikon nama="bantuan" ukuran={16} tebal={2.2} />
        </span>
        <p className={adm.panelTeks}>
          Cabang ini menghitung kapasitas dalam <strong>{kuota.satuan}</strong>. Kapasitas{' '}
          {kuota.kapasitas ?? '—'} berarti {kuota.kapasitas ?? '—'} {kuota.satuan}, bukan satuan
          lain. Pada cabang individu kapasitas dihitung dalam jumlah peserta.
        </p>
      </div>

      <fieldset className={styles.grup}>
        <legend className={adm.ladangLabel}>Mode kuota</legend>
        <div className={adm.opsiDaftar}>
          <label className={adm.opsi}>
            <input
              type="radio"
              name="mode-kuota"
              checked={terbatas}
              onChange={() => setTerbatas(true)}
            />
            Terbatas
          </label>
          <label className={adm.opsi}>
            <input
              type="radio"
              name="mode-kuota"
              checked={!terbatas}
              onChange={() => setTerbatas(false)}
            />
            Tak terbatas
          </label>
        </div>
        <p className={adm.ladangBantuan}>
          Mode tak terbatas menghilangkan kapasitas dan daftar tunggu; pendaftaran hanya berhenti
          pada tenggat.
        </p>
      </fieldset>

      {terbatas ? (
        <div className={styles.duaIsian}>
          <div className={adm.ladang}>
            <label htmlFor={idKapasitas} className={adm.ladangLabel}>
              Kapasitas ({kuota.satuan}) <span className={adm.ladangWajib}>· wajib</span>
            </label>
            <input
              id={idKapasitas}
              type="number"
              min={1}
              inputMode="numeric"
              value={kapasitas}
              onChange={(e) => setKapasitas(e.target.value)}
              className={adm.isian}
            />
            <p className={adm.ladangBantuan}>
              Sebelumnya {kuota.kapasitas} {kuota.satuan} · sekarang terisi {kuota.terisi}{' '}
              {kuota.satuan}
            </p>
            {sah && angka < kuota.terisi ? (
              <p className={adm.ladangGalat}>
                Kapasitas di bawah jumlah terisi memindahkan {kuota.terisi - angka} {kuota.satuan} ke
                daftar tunggu. Tinjau dampaknya sebelum menyimpan.
              </p>
            ) : null}
          </div>

          <div className={adm.ladang}>
            <span className={adm.ladangLabel}>Kebijakan daftar tunggu</span>
            <p className={styles.nilaiStatis}>{kebijakanDaftarTunggu}</p>
            <p className={adm.ladangBantuan}>
              Pilihan lain: nonaktif — pendaftaran ditolak saat penuh, tanpa antrean.
            </p>
          </div>
        </div>
      ) : null}

      <div className={`${adm.panel} ${adm.panelPeringatan}`}>
        <span aria-hidden="true" className={adm.panelIkon}>
          <Ikon nama="seru" ukuran={16} tebal={2.2} />
        </span>
        <p className={adm.panelTeks}>
          <strong>Keadaan sekarang.</strong> {keadaanSekarang}
        </p>
      </div>

      <div className={styles.kaki}>
        <p className={adm.catatan}>
          Menyimpan perubahan kapasitas membuka dialog dampak — tidak langsung tersimpan.
        </p>
        <div className={adm.barisAksi}>
          <button type="button" onClick={() => setKapasitas(String(kuota.kapasitas ?? ''))} className={adm.tombol}>
            Batal
          </button>
          <button
            type="button"
            disabled={!berubah}
            onClick={() => setDialogTerbuka(true)}
            className={`${adm.tombol} ${adm.tombolUtama}`}
          >
            Tinjau dampak
          </button>
        </div>
      </div>

      <DialogAksiKritis
        terbuka={dialogTerbuka}
        onTutup={() => setDialogTerbuka(false)}
        judul={`Ubah kapasitas ${namaCabang}`}
        sub={`Dari ${kuota.kapasitas} ${kuota.satuan} menjadi ${sah ? angka : '—'} ${kuota.satuan}`}
        awalanRef="KUO"
        waktuServerIso={waktuServerIso}
        ringkasanDampak="Dampak yang akan terjadi"
        dampak={dampak}
        catatanDampak={<p>{catatanDampak}</p>}
        alasan={{
          label: 'Alasan perubahan',
          bantuan: 'Alasan ini masuk audit log dan dibaca auditor apa adanya.',
          minimal: 20,
          maksimal: 400,
          baku: [],
        }}
        pernyataan={[
          `Saya paham perubahan ini memindahkan pendaftaran ke daftar tunggu dan dapat menutup ${namaCabang} secara otomatis.`,
        ]}
        labelKirim="Ubah kapasitas"
        pesanBerhasil="Kapasitas diperbarui"
      />
    </section>
  );
}
