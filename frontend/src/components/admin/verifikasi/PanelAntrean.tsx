'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Ikon } from '@/components/app/Ikon';
import { Lencana } from '@/components/app/Lencana';
import { KakiTabel, type Paginasi } from '@/components/admin/KakiTabel';
import { SelBertingkat, TabelAdmin } from '@/components/admin/TabelAdmin';
import { formatWaktu } from '@/lib/admin/format';
import type { BarisAntreanVerifikasi } from '@/types/admin';
import adm from '@/components/admin/adm.module.css';
import styles from './PanelAntrean.module.css';

/**
 * Antrean verifikasi (E1.2a).
 *
 * Pemilihan baris ada, tapi aksi massalnya SENGAJA terbatas pada hal yang tidak
 * mengubah keputusan: tandai sudah dilihat dan tugaskan ke verifikator lain.
 * Setujui, minta perbaikan, dan tolak tidak pernah menjadi aksi massal — setiap
 * keputusan dokumen ditulis satu per satu karena alasannya dibaca peserta dan
 * bisa menjadi dasar diskualifikasi (AC-FE-12).
 *
 * Aturan itu ditulis sebagai kalimat di layar, bukan hanya diterapkan diam-diam:
 * panitia yang mencari tombol "setujui semua" harus menemukan alasannya, bukan
 * ketiadaan tombol.
 */
export function PanelAntrean({
  baris,
  jumlahHasil,
  paginasi,
  waktuServerIso,
}: {
  readonly baris: readonly BarisAntreanVerifikasi[];
  readonly jumlahHasil: number;
  readonly paginasi: Paginasi;
  readonly waktuServerIso: string;
}) {
  const [dipilih, setDipilih] = useState<readonly string[]>([]);

  const semuaDipilih = baris.length > 0 && dipilih.length === baris.length;

  const alihkan = (id: string) =>
    setDipilih((lama) => (lama.includes(id) ? lama.filter((x) => x !== id) : [...lama, id]));

  return (
    <>
      <div className={styles.bilahPilihan} data-aktif={dipilih.length > 0}>
        <div className={styles.pilihanTeks}>
          <p className={styles.pilihanAngka}>
            {dipilih.length > 0 ? `${dipilih.length} dipilih` : 'Belum ada baris dipilih'}
          </p>
          <p className={adm.catatan}>
            Aksi massal yang tersedia: tandai sudah dilihat · tugaskan ke verifikator lain. Setujui,
            minta perbaikan, dan tolak tidak tersedia sebagai aksi massal.
          </p>
        </div>

        <div className={adm.barisAksi}>
          <button
            type="button"
            disabled={dipilih.length === 0}
            className={`${adm.tombol} ${adm.tombolKecil}`}
          >
            Tandai sudah dilihat
          </button>
          <button
            type="button"
            disabled={dipilih.length === 0}
            className={`${adm.tombol} ${adm.tombolKecil}`}
          >
            Tugaskan…
          </button>
        </div>
      </div>

      {baris.length === 0 ? (
        <div className={adm.kosong}>
          <span aria-hidden="true" className={adm.kosongIkon}>
            <Ikon nama="centang" ukuran={18} />
          </span>
          <p className={adm.kosongJudul}>Tidak ada dokumen menunggu keputusan</p>
          <p className={adm.kosongTeks}>
            Seluruh lomba dalam cakupanmu bersih pada filter saat ini. Ada dokumen berstatus
            “menunggu unggahan baru” yang bukan tugasmu sampai peserta mengunggah versi berikutnya —
            longgarkan filter status untuk melihatnya.
          </p>
          <Link href="/admin/verifikasi" className={adm.tombol}>
            Longgarkan filter
          </Link>
        </div>
      ) : (
        <TabelAdmin
          caption="Dokumen menunggu keputusan, diurutkan dari umur antrean tertua"
          minLebar={1080}
          kolom={[
            { label: 'Pilih baris', sembunyi: true },
            { label: 'Umur antrean', urut: 'turun' },
            { label: 'Peserta' },
            { label: 'Lomba' },
            { label: 'Jenis dokumen' },
            { label: 'Versi' },
            { label: 'Pemeriksaan otomatis' },
            { label: 'Ditugaskan' },
            { label: 'Aksi' },
          ]}
        >
          {baris.map((b) => {
            const lolosSemua = b.otomatis.lolos === b.otomatis.total;

            return (
              <tr key={b.id}>
                <td>
                  <label className={styles.kotak}>
                    <input
                      type="checkbox"
                      checked={dipilih.includes(b.id)}
                      onChange={() => alihkan(b.id)}
                    />
                    <span className="sr-only">
                      Pilih {b.jenisDokumen} milik {b.namaPeserta}
                    </span>
                  </label>
                </td>
                <td>
                  <SelBertingkat
                    utama={`${b.umurJam} jam`}
                    meta={`masuk ${formatWaktu(b.masukIso)}`}
                  />
                </td>
                <td>
                  <SelBertingkat
                    utama={b.namaPeserta}
                    meta={<span className={adm.mono}>{b.idTermasking}</span>}
                  />
                </td>
                <td>{b.lomba}</td>
                <td>{b.jenisDokumen}</td>
                <td>{b.versi}</td>
                <td>
                  <Lencana
                    label={`${b.otomatis.lolos} dari ${b.otomatis.total} butir lolos`}
                    nada={lolosSemua ? 'ok' : 'warn'}
                    ikon={lolosSemua ? 'centang' : 'seru'}
                  />
                </td>
                <td>{b.ditugaskan ?? <span className={adm.catatan}>Belum ditugaskan</span>}</td>
                <td>
                  <Link href={`/admin/verifikasi/${b.id}`} className={adm.tautan}>
                    Periksa
                    <Ikon nama="panah" ukuran={12} tebal={2.4} />
                  </Link>
                </td>
              </tr>
            );
          })}
        </TabelAdmin>
      )}

      <KakiTabel
        ringkasan={`Menampilkan ${baris.length} dari ${jumlahHasil} dokumen menunggu · diurutkan dari umur antrean tertua`}
        catatan={`Antrean diperbarui otomatis setiap 60 detik — terakhir pada waktu server ${formatWaktu(waktuServerIso)}. ${semuaDipilih ? 'Seluruh baris di halaman ini terpilih.' : 'Pemilihan baris tidak ikut berpindah halaman.'}`}
        paginasi={paginasi}
      />
    </>
  );
}
