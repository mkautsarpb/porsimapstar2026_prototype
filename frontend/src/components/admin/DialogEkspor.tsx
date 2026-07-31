'use client';

import { useState } from 'react';
import { Ikon } from '@/components/app/Ikon';
import { jalankanAksi, type HasilAksi } from '@/lib/admin/aksi-mock';
import { formatAngka } from '@/lib/admin/format';
import { Dialog } from './Dialog';
import { KartuKeadaan } from './KartuKeadaan';
import adm from './adm.module.css';
import styles from './DialogEkspor.module.css';

/**
 * Dialog ekspor — dipakai modul Peserta dan Laporan.
 *
 * Dialog ini ada bukan untuk memilih apa pun: filter, kolom, dan tingkat masking
 * sudah ditentukan peran dan filter yang aktif. Gunanya menuliskannya sebelum
 * berkas dibuat, supaya tidak ada yang mengira ekspor "seluruh data" padahal
 * cakupannya enam lomba, atau mengira NIK ikut padahal tidak (E1.1c, E4.3).
 *
 * Yang tidak boleh dilonggarkan lewat dialog ini: masking. Peran dengan wewenang
 * lebih luas menghasilkan berkas dengan kolom yang sama.
 */
export function DialogEkspor({
  terbuka,
  onTutup,
  judul,
  sub,
  jumlahBaris,
  ringkas,
  kolom,
  catatanMasking,
  masaBerlakuMenit,
  waktuServerIso,
}: {
  readonly terbuka: boolean;
  readonly onTutup: () => void;
  readonly judul: string;
  readonly sub: string;
  readonly jumlahBaris: number;
  readonly ringkas: readonly { readonly label: string; readonly nilai: string }[];
  readonly kolom: readonly string[];
  readonly catatanMasking: string;
  readonly masaBerlakuMenit: number;
  readonly waktuServerIso: string;
}) {
  const [proses, setProses] = useState(false);
  const [hasil, setHasil] = useState<HasilAksi | null>(null);

  const kosong = jumlahBaris === 0;

  const jalankan = async () => {
    if (proses || kosong) return;
    setProses(true);
    const jawaban = await jalankanAksi({ awalan: 'EXP', waktuServerIso });
    setProses(false);
    setHasil(jawaban);
  };

  const tutup = () => {
    setHasil(null);
    onTutup();
  };

  return (
    <Dialog terbuka={terbuka} onTutup={tutup} judul={judul} sub={sub} lebar="lebar">
      {hasil ? (
        <KartuKeadaan
          hidup="polite"
          nada="ok"
          keadaan="Berhasil"
          judul={`Ekspor siap · ${formatAngka(jumlahBaris)} baris · ${kolom.length} kolom`}
          teks={
            <p>
              Tautan unduhan berlaku {masaBerlakuMenit} menit sejak sekarang, lalu mati. Berkas tidak
              disimpan di server — setelah masa berlaku habis, ekspor harus dijalankan ulang.
            </p>
          }
          nomorRef={hasil.ref}
          aksi={
            <>
              <button type="button" className={`${adm.tombol} ${adm.tombolUtama}`}>
                <Ikon nama="unduh" ukuran={14} tebal={2.2} />
                Unduh CSV
              </button>
              <button type="button" onClick={tutup} className={adm.tombol}>
                Tutup
              </button>
            </>
          }
        />
      ) : kosong ? (
        <KartuKeadaan
          nada="info"
          keadaan="Kosong"
          judul="Tidak ada baris untuk diekspor"
          teks={
            <p>
              Filter yang aktif menghasilkan 0 baris, jadi pekerjaan ekspor tidak dibuat — lebih baik
              daripada mengirim berkas kosong yang mengesankan datanya hilang. Longgarkan filter lalu
              coba lagi.
            </p>
          }
          aksi={
            <button type="button" onClick={tutup} className={adm.tombol}>
              Kembali ke filter
            </button>
          }
        />
      ) : (
        <>
          <dl className={adm.rincian}>
            {[{ label: 'Jumlah baris', nilai: `${formatAngka(jumlahBaris)} baris` }, ...ringkas].map(
              (r) => (
                <div key={r.label} className={adm.rincianBaris}>
                  <dt className={adm.rincianLabel}>{r.label}</dt>
                  <dd className={adm.rincianNilai}>{r.nilai}</dd>
                </div>
              ),
            )}
          </dl>

          <section className={styles.kolom}>
            <p className={adm.eyebrow}>Kolom yang diekspor · {kolom.length} kolom</p>
            <ul className={styles.daftarKolom}>
              {kolom.map((k) => (
                <li key={k} className={styles.chipKolom}>
                  {k}
                </li>
              ))}
            </ul>
          </section>

          <div className={`${adm.panel} ${adm.panelNetral}`}>
            <span aria-hidden="true" className={adm.panelIkon}>
              <Ikon nama="bantuan" ukuran={16} tebal={2.2} />
            </span>
            <p className={adm.panelTeks}>{catatanMasking}</p>
          </div>

          <p className={adm.catatan}>
            Ekspor tercatat di audit log beserta nomor referensi, jumlah baris, dan filter yang
            berlaku. Tautan unduhan berumur {masaBerlakuMenit} menit dan hanya bisa dibuka oleh
            akunmu.
          </p>

          <div className={`${adm.barisAksi} ${adm.barisAksiKanan}`}>
            <button type="button" onClick={tutup} className={adm.tombol}>
              Batal
            </button>
            <button
              type="button"
              disabled={proses}
              onClick={() => void jalankan()}
              className={`${adm.tombol} ${adm.tombolUtama}`}
            >
              {proses ? 'Menyiapkan…' : `Ekspor ${formatAngka(jumlahBaris)} baris`}
            </button>
          </div>

          <p aria-live="polite" className={adm.catatan}>
            {proses
              ? `Menyiapkan ${formatAngka(jumlahBaris)} baris… biasanya di bawah 20 detik. Kamu boleh menutup dialog ini — tautannya dikirim sebagai notifikasi dalam aplikasi begitu siap.`
              : ''}
          </p>
        </>
      )}
    </Dialog>
  );
}
