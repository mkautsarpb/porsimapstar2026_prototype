'use client';

import { useId, useState } from 'react';
import { Ikon } from '@/components/app/Ikon';
import { Dialog } from '@/components/admin/Dialog';
import { KartuKeadaan } from '@/components/admin/KartuKeadaan';
import { jalankanAksi, type HasilAksi } from '@/lib/admin/aksi-mock';
import { formatWaktu } from '@/lib/admin/format';
import type { BarisPertandingan } from '@/types/admin';
import adm from '@/components/admin/adm.module.css';
import styles from './DialogCatatHasil.module.css';

/**
 * Dialog pencatatan hasil pertandingan (E3.1c).
 *
 * Punya dialog sendiri, bukan memakai `DialogAksiKritis`, karena syarat
 * "boleh disimpan" di sini bukan alasan tertulis melainkan **konsistensi antara
 * skor dan pemenang** — logika yang tidak bisa dititipkan ke komponen umum.
 *
 * Aturan yang ditegakkan:
 * - Pemenang hanya bisa salah satu dari dua peserta yang bertanding. Tidak ada
 *   isian bebas (agents.md §5).
 * - Pilihan pemenang TIDAK otomatis mengikuti skor. Kalau keduanya tidak
 *   sejalan, penyimpanan ditahan dan panitia diminta memeriksa lagi — kecuali
 *   ia menandainya sebagai kemenangan khusus (diskualifikasi/WO), yang membuat
 *   alasannya tercatat.
 * - Tujuan lanjut pemenang terlihat SEBELUM simpan. Menyimpan hasil memajukan
 *   tim ke babak berikutnya dan mengirim notifikasi; itu harus terbaca dulu.
 * - Satu klik = satu efek. Tombol terkunci selama penyimpanan berjalan.
 */
export function DialogCatatHasil({
  terbuka,
  onTutup,
  laga,
  lanjutKe,
  waktuServerIso,
}: {
  readonly terbuka: boolean;
  readonly onTutup: () => void;
  readonly laga: BarisPertandingan;
  readonly lanjutKe: readonly { readonly label: string; readonly nilai: string }[];
  readonly waktuServerIso: string;
}) {
  const [skorA, setSkorA] = useState('');
  const [skorB, setSkorB] = useState('');
  const [pemenang, setPemenang] = useState<'a' | 'b' | ''>('');
  const [khusus, setKhusus] = useState(false);
  const [dikonfirmasi, setDikonfirmasi] = useState(false);
  const [proses, setProses] = useState(false);
  const [hasil, setHasil] = useState<HasilAksi | null>(null);

  const idA = useId();
  const idB = useId();

  const angkaA = Number.parseInt(skorA, 10);
  const angkaB = Number.parseInt(skorB, 10);
  const skorSah = Number.isFinite(angkaA) && Number.isFinite(angkaB);

  const pemenangSkor = !skorSah ? '' : angkaA > angkaB ? 'a' : angkaB > angkaA ? 'b' : 'seri';
  const tidakSejalan =
    skorSah && pemenang !== '' && pemenangSkor !== 'seri' && pemenang !== pemenangSkor && !khusus;

  const siap = skorSah && pemenang !== '' && !tidakSejalan && dikonfirmasi;
  const namaPemenang = pemenang === 'a' ? laga.pesertaA : pemenang === 'b' ? laga.pesertaB : '—';

  const simpan = async () => {
    if (!siap || proses) return;
    setProses(true);
    const jawaban = await jalankanAksi({ awalan: 'HSL', waktuServerIso });
    setProses(false);
    setHasil(jawaban);
  };

  const tutup = () => {
    setHasil(null);
    onTutup();
  };

  return (
    <Dialog
      terbuka={terbuka}
      onTutup={tutup}
      judul={`Catat hasil · ${laga.babak}`}
      sub={`${laga.cabang} · ${laga.jamJadwal}${laga.jamMulaiAktual ? ` (mulai ${laga.jamMulaiAktual})` : ''} · ${laga.venue}`}
      lebar="lebar"
    >
      {hasil ? (
        <KartuKeadaan
          hidup="assertive"
          nada={hasil.ok ? 'ok' : 'danger'}
          keadaan={hasil.ok ? 'Berhasil' : 'Gagal'}
          judul={hasil.ok ? 'Hasil tersimpan' : 'Hasil tidak tersimpan'}
          teks={
            <p>
              {hasil.ok
                ? `${formatWaktu(hasil.waktuIso)} · ${namaPemenang} maju ke babak berikutnya. Notifikasi terkirim ke peserta dan PIC cabang.`
                : `${hasil.alasan} Pertandingan masih berstatus ${laga.status}, pemenang belum dimajukan, dan skor yang kamu isi tetap ada di formulir.`}
            </p>
          }
          nomorRef={hasil.ref}
          aksi={
            hasil.ok ? (
              <button type="button" onClick={tutup} className={`${adm.tombol} ${adm.tombolUtama}`}>
                Kembali ke papan
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => void simpan()}
                  className={`${adm.tombol} ${adm.tombolUtama}`}
                >
                  Simpan ulang
                </button>
                <button type="button" onClick={() => setHasil(null)} className={adm.tombol}>
                  Kembali ke formulir
                </button>
              </>
            )
          }
        />
      ) : (
        <>
          <fieldset className={styles.skor}>
            <legend className={adm.eyebrow}>Skor akhir</legend>

            <div className={styles.skorBaris}>
              <label htmlFor={idA} className={styles.skorNama}>
                {laga.pesertaA}
              </label>
              <input
                id={idA}
                type="number"
                min={0}
                inputMode="numeric"
                value={skorA}
                onChange={(e) => setSkorA(e.target.value)}
                className={`${adm.isian} ${styles.skorIsian}`}
              />
            </div>

            <div className={styles.skorBaris}>
              <label htmlFor={idB} className={styles.skorNama}>
                {laga.pesertaB}
              </label>
              <input
                id={idB}
                type="number"
                min={0}
                inputMode="numeric"
                value={skorB}
                onChange={(e) => setSkorB(e.target.value)}
                className={`${adm.isian} ${styles.skorIsian}`}
              />
            </div>
          </fieldset>

          <fieldset className={styles.grup}>
            <legend className={adm.ladangLabel}>
              Pemenang <span className={adm.ladangWajib}>· wajib</span>
            </legend>

            <div className={adm.opsiDaftar}>
              <label className={adm.opsi}>
                <input
                  type="radio"
                  name="pemenang"
                  checked={pemenang === 'a'}
                  onChange={() => setPemenang('a')}
                />
                {laga.pesertaA}
              </label>
              <label className={adm.opsi}>
                <input
                  type="radio"
                  name="pemenang"
                  checked={pemenang === 'b'}
                  onChange={() => setPemenang('b')}
                />
                {laga.pesertaB}
              </label>
            </div>

            <p className={adm.ladangBantuan}>
              Pemenang hanya bisa dipilih dari dua peserta yang bertanding — tidak ada isian bebas.
              Pilihan tidak otomatis mengikuti skor.
            </p>
          </fieldset>

          {tidakSejalan ? (
            <div className={`${adm.panel} ${adm.panelPeringatan}`} role="alert">
              <span aria-hidden="true" className={adm.panelIkon}>
                <Ikon nama="seru" ukuran={16} tebal={2.2} />
              </span>
              <div>
                <p className={adm.panelTeks}>
                  <strong>
                    Skor {angkaA}–{angkaB} untuk {pemenangSkor === 'a' ? laga.pesertaA : laga.pesertaB}
                    , tetapi pemenang dipilih {namaPemenang}.
                  </strong>{' '}
                  Kalau ini memang benar — misalnya kemenangan diskualifikasi atau WO — tandai
                  sebagai kemenangan khusus supaya alasannya tercatat. Selama belum, penyimpanan
                  ditahan.
                </p>
                <label className={styles.khusus}>
                  <input
                    type="checkbox"
                    checked={khusus}
                    onChange={(e) => setKhusus(e.target.checked)}
                  />
                  Tandai kemenangan khusus (diskualifikasi / WO)
                </label>
              </div>
            </div>
          ) : null}

          <section className={styles.lanjut}>
            <p className={adm.eyebrow}>Setelah disimpan, pemenang maju ke</p>
            <dl className={adm.rincian}>
              {lanjutKe.map((l) => (
                <div key={l.label} className={adm.rincianBaris}>
                  <dt className={adm.rincianLabel}>{l.label}</dt>
                  <dd className={adm.rincianNilai}>{l.nilai}</dd>
                </div>
              ))}
              <div className={adm.rincianBaris}>
                <dt className={adm.rincianLabel}>Pemenang yang dimajukan</dt>
                <dd className={adm.rincianNilai}>{namaPemenang}</dd>
              </div>
            </dl>
            <p className={adm.catatan}>
              Notifikasi jadwal babak berikutnya dikirim ke kedua tim setelah hasil ini tersimpan.
              Tim yang kalah menerima pemberitahuan tersisih.
            </p>
          </section>

          <label className={adm.opsi}>
            <input
              type="checkbox"
              checked={dikonfirmasi}
              onChange={(e) => setDikonfirmasi(e.target.checked)}
            />
            Saya memastikan skor {skorSah ? `${angkaA}–${angkaB}` : '(belum diisi)'} dan pemenang{' '}
            {namaPemenang} sudah sesuai dengan berita acara pertandingan.
          </label>

          <div className={`${adm.barisAksi} ${adm.barisAksiKanan}`}>
            <button type="button" onClick={tutup} className={adm.tombol}>
              Batal
            </button>
            <button
              type="button"
              disabled={!siap || proses}
              onClick={() => void simpan()}
              className={`${adm.tombol} ${adm.tombolUtama}`}
            >
              {proses ? 'Menyimpan…' : 'Simpan hasil & majukan pemenang'}
            </button>
          </div>

          <p aria-live="polite" className={adm.catatan}>
            {proses
              ? 'Menyimpan hasil… jangan tutup jendela.'
              : siap
                ? 'Semua syarat terpenuhi. Hasil tersimpan bersama nomor referensi dan namamu.'
                : `Tombol aktif setelah: ${[
                    !skorSah ? 'isi kedua skor' : null,
                    pemenang === '' ? 'pilih pemenang' : null,
                    tidakSejalan ? 'selesaikan ketidaksesuaian skor dan pemenang' : null,
                    !dikonfirmasi ? 'centang pernyataan berita acara' : null,
                  ]
                    .filter(Boolean)
                    .join(' · ')}.`}
          </p>
        </>
      )}
    </Dialog>
  );
}
