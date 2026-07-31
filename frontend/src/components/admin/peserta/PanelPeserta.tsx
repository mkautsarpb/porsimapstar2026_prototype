'use client';

import Link from 'next/link';
import { useId, useMemo, useState } from 'react';
import { Ikon } from '@/components/app/Ikon';
import { Lencana } from '@/components/app/Lencana';
import { DialogEkspor } from '@/components/admin/DialogEkspor';
import { KakiTabel, type Paginasi } from '@/components/admin/KakiTabel';
import { SelBertingkat, TabelAdmin } from '@/components/admin/TabelAdmin';
import { formatAngka, formatUmur, formatWaktu } from '@/lib/admin/format';
import { hitungUmurDetik } from '@/lib/admin/kebasian';
import type { BarisPeserta, StatusAkunPeserta } from '@/types/admin';
import type { Nada, NamaIkon } from '@/types/peserta';
import adm from '@/components/admin/adm.module.css';
import styles from './PanelPeserta.module.css';

const STATUS_AKUN: Readonly<
  Record<StatusAkunPeserta, { readonly label: string; readonly nada: Nada; readonly ikon: NamaIkon }>
> = {
  aktif: { label: 'Aktif', nada: 'ok', ikon: 'centang' },
  'belum-verifikasi-email': { label: 'Belum verifikasi email', nada: 'warn', ikon: 'seru' },
  nonaktif: { label: 'Nonaktif atas permintaan', nada: 'netral', ikon: 'silang' },
};

/**
 * Daftar peserta — tabel, pencarian, dan ekspor.
 *
 * PENCARIAN TIDAK MASUK URL. Kata kunci yang diketik panitia hampir selalu nama
 * atau potongan email peserta, dan itu data pribadi: begitu masuk query string
 * ia ikut ke riwayat peramban, header `Referer`, dan access log server —
 * pelanggaran agents.md §6 yang paling mudah terjadi tanpa disadari. Karena itu
 * filter enum (lomba, status) hidup di URL, sedangkan kata kunci hanya di state.
 *
 * TODO(api-contract): pencarian sungguhan harus
 *   POST /api/v1/admin/participants/search  body { q, filters, page }
 * bukan GET dengan `?q=`, dengan alasan yang sama. Backend juga yang membatasi
 * lajunya — daftar peserta bukan direktori terbuka, jadi hasilnya hanya identitas
 * minimum dan tidak boleh bisa dipanen dengan permintaan berulang.
 *
 * Prototipe ini menyaring baris yang SUDAH ada di halaman, dan mengatakannya —
 * bukan berpura-pura mencari ke seluruh 1.284 peserta.
 */
export function PanelPeserta({
  baris,
  jumlahHasil,
  totalCakupan,
  ringkasFilter,
  kolomEkspor,
  paginasi,
  waktuServerIso,
}: {
  readonly baris: readonly BarisPeserta[];
  readonly jumlahHasil: number;
  readonly totalCakupan: number;
  readonly ringkasFilter: readonly { readonly label: string; readonly nilai: string }[];
  readonly kolomEkspor: readonly string[];
  readonly paginasi: Paginasi;
  readonly waktuServerIso: string;
}) {
  const [kunci, setKunci] = useState('');
  const [eksporTerbuka, setEksporTerbuka] = useState(false);
  const idCari = useId();

  const terlihat = useMemo(() => {
    const q = kunci.trim().toLowerCase();
    if (q === '') return baris;
    return baris.filter(
      (b) =>
        b.nama.toLowerCase().includes(q) ||
        b.institusi.toLowerCase().includes(q) ||
        b.idTermasking.toLowerCase().includes(q),
    );
  }, [baris, kunci]);

  return (
    <>
      <div className={styles.bilahCari}>
        <div className={styles.cari}>
          <label htmlFor={idCari} className={adm.ladangLabel}>
            Cari di halaman ini
          </label>
          <div className={styles.isianCari}>
            <span aria-hidden="true" className={styles.ikonCari}>
              <Ikon nama="bantuan" ukuran={14} tebal={2.2} />
            </span>
            <input
              id={idCari}
              type="search"
              value={kunci}
              autoComplete="off"
              placeholder="Nama, institusi, atau ID termasking"
              aria-describedby={`${idCari}-bantuan`}
              onChange={(e) => setKunci(e.target.value)}
              className={adm.isian}
            />
          </div>
          <p id={`${idCari}-bantuan`} className={adm.ladangBantuan}>
            Menyaring {baris.length} baris di halaman ini saja. Pencarian ke seluruh cakupan
            dikirim ke server sebagai permintaan POST, supaya nama peserta tidak pernah masuk
            alamat halaman.
          </p>
        </div>

        <div className={styles.hitung}>
          <p className={styles.hitungAngka}>{formatAngka(jumlahHasil)} peserta</p>
          <p className={adm.catatan}>dari {formatAngka(totalCakupan)} dalam cakupanmu</p>
          <button
            type="button"
            onClick={() => setEksporTerbuka(true)}
            className={`${adm.tombol} ${adm.tombolKecil}`}
          >
            <Ikon nama="unduh" ukuran={13} tebal={2.2} />
            Ekspor
          </button>
        </div>
      </div>

      {terlihat.length === 0 ? (
        <div className={adm.kosong}>
          <span aria-hidden="true" className={adm.kosongIkon}>
            <Ikon nama="orangBanyak" ukuran={18} />
          </span>
          <p className={adm.kosongJudul}>Tidak ada peserta yang cocok</p>
          <p className={adm.kosongTeks}>
            {kunci.trim() !== ''
              ? `Kata kunci “${kunci.trim()}” tidak cocok dengan baris di halaman ini. Kosongkan pencarian untuk melihat kembali seluruh ${baris.length} baris, atau longgarkan filter di atas.`
              : 'Kombinasi filter yang aktif tidak menghasilkan baris apa pun dalam cakupan lombamu. Longgarkan salah satu filter di atas.'}
          </p>
        </div>
      ) : (
        <TabelAdmin
          caption="Daftar peserta dalam cakupan lomba, diurutkan dari yang terakhir aktif"
          minLebar={1040}
          kolom={[
            { label: 'Nama', urut: 'naik' },
            { label: 'ID peserta' },
            { label: 'Kategori' },
            { label: 'Institusi' },
            { label: 'Status akun' },
            { label: 'Kelengkapan profil' },
            { label: 'Lomba', angka: true },
            { label: 'Terakhir aktif' },
            { label: 'Aksi' },
          ]}
        >
          {terlihat.map((b) => {
            const status = STATUS_AKUN[b.statusAkun];
            const umur = hitungUmurDetik(waktuServerIso, b.terakhirAktifIso);

            return (
              <tr key={b.id}>
                <td>
                  <span className={styles.nama}>{b.nama}</span>
                </td>
                <td>
                  <span className={adm.mono}>{b.idTermasking}</span>
                </td>
                <td>{b.kategori}</td>
                <td>{b.institusi}</td>
                <td>
                  <Lencana label={status.label} nada={status.nada} ikon={status.ikon} />
                </td>
                <td>
                  <SelBertingkat
                    utama={`${b.kelengkapan.terisi} dari ${b.kelengkapan.total} data`}
                    meta={
                      b.kelengkapan.terisi < b.kelengkapan.total
                        ? `${b.kelengkapan.total - b.kelengkapan.terisi} isian belum lengkap`
                        : 'Lengkap'
                    }
                  />
                </td>
                <td data-angka="true">{b.jumlahLomba}</td>
                <td>
                  <SelBertingkat
                    utama={formatWaktu(b.terakhirAktifIso)}
                    meta={umur !== null ? `${formatUmur(umur)} lalu` : undefined}
                  />
                </td>
                <td>
                  <Link href={`/admin/peserta/${b.id}`} className={adm.tautan}>
                    Lihat detail
                    <Ikon nama="panah" ukuran={12} tebal={2.4} />
                  </Link>
                </td>
              </tr>
            );
          })}
        </TabelAdmin>
      )}

      <KakiTabel
        ringkasan={`Menampilkan ${terlihat.length} dari ${formatAngka(jumlahHasil)} hasil · 25 baris per halaman`}
        catatan="Penyaringan dan penghalaman dikerjakan server, bukan browser. Tidak ada aksi massal yang mengubah data di modul ini — satu-satunya aksi baris adalah membuka detail. NIK tidak pernah menjadi kolom tabel, dan ID peserta termasking juga di atribut DOM."
        paginasi={paginasi}
      />

      <DialogEkspor
        terbuka={eksporTerbuka}
        onTutup={() => setEksporTerbuka(false)}
        judul="Ekspor daftar peserta"
        sub="Mengikuti filter dan cakupan peranmu saat ini"
        jumlahBaris={jumlahHasil}
        ringkas={ringkasFilter}
        kolom={kolomEkspor}
        masaBerlakuMenit={10}
        waktuServerIso={waktuServerIso}
        catatanMasking="NIK tidak ikut diekspor, dan ID peserta tetap termasking di dalam berkas (PSM-2026-••••-4471). Email dan telepon juga tidak termasuk. Berkas ini boleh dipakai untuk rekap, bukan untuk verifikasi identitas."
      />
    </>
  );
}
