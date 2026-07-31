'use client';

import { useId, useState, type ReactNode } from 'react';
import { Ikon } from '@/components/app/Ikon';
import { jalankanAksi, type HasilAksi } from '@/lib/admin/aksi-mock';
import { formatWaktu } from '@/lib/admin/format';
import { Dialog } from './Dialog';
import { KartuKeadaan } from './KartuKeadaan';
import adm from './adm.module.css';
import styles from './DialogAksiKritis.module.css';

export interface BarisDampak {
  readonly label: string;
  readonly nilai: string;
}

export interface KonfigurasiAlasan {
  readonly label: string;
  readonly bantuan: string;
  readonly minimal: number;
  readonly maksimal: number;
  /** Alasan baku — satu wajib dipilih sebelum keterangan bebas dianggap sah. */
  readonly baku: readonly string[];
  readonly contoh?: string;
}

/**
 * Dialog aksi kritis: ubah kuota · publikasi jadwal · keputusan dokumen ·
 * catat & koreksi hasil · sinkronisasi manual.
 *
 * Satu komponen untuk semuanya karena FE-ADMIN-003 mensyaratkan anatomi yang
 * sama pada semuanya: ringkasan dampak sebelum tombol, alasan wajib yang masuk
 * audit log, pernyataan yang harus dicentang, lalu nomor referensi. Menyalin
 * anatomi itu ke lima modul berarti lima kesempatan menghilangkan salah satu
 * bagiannya — dan bagian yang hilang selalu ringkasan dampaknya.
 *
 * Yang dijaga di sini:
 * - Tombol kirim mati sampai SELURUH syarat terpenuhi, dan syarat yang belum
 *   terpenuhi ditulis sebagai teks, bukan hanya tombol abu-abu.
 * - Satu klik = satu efek. Selama `proses`, tombol terkunci (AC-FE-06).
 * - Gagal tidak menghapus isian: alasan yang sudah ditulis tetap di formulir,
 *   karena menulis ulangnya adalah pekerjaan yang hilang.
 * - Berhasil menampilkan nomor referensi, bukan sekadar tanda centang.
 */
export function DialogAksiKritis({
  terbuka,
  onTutup,
  judul,
  sub,
  awalanRef,
  waktuServerIso,
  ringkasanDampak,
  dampak,
  catatanDampak,
  alasan,
  pernyataan,
  kataKunci,
  labelKirim,
  nadaKirim = 'utama',
  pesanBerhasil,
  gagalkan = false,
  alasanGagal,
  onSelesai,
  anak,
}: {
  readonly terbuka: boolean;
  readonly onTutup: () => void;
  readonly judul: string;
  readonly sub?: string;
  readonly awalanRef: string;
  readonly waktuServerIso: string;
  readonly ringkasanDampak: string;
  readonly dampak: readonly BarisDampak[];
  readonly catatanDampak?: ReactNode;
  readonly alasan?: KonfigurasiAlasan;
  /** Pernyataan yang harus dicentang. Kosong = tidak ada syarat centang. */
  readonly pernyataan?: readonly string[];
  /** Kata yang harus diketik ulang, mis. "KOREKSI". Untuk aksi paling berat. */
  readonly kataKunci?: string;
  readonly labelKirim: string;
  readonly nadaKirim?: 'utama' | 'bahaya';
  readonly pesanBerhasil: string;
  /** Menampilkan jalur gagal alih-alih berhasil — dipakai layar demo keadaan. */
  readonly gagalkan?: boolean;
  readonly alasanGagal?: string;
  readonly onSelesai?: (hasil: HasilAksi) => void;
  /** Isian khusus modul, mis. kotak skor atau pemilih pemenang. */
  readonly anak?: ReactNode;
}) {
  const [pilihanBaku, setPilihanBaku] = useState('');
  const [keterangan, setKeterangan] = useState(alasan?.contoh ?? '');
  const [dicentang, setDicentang] = useState<readonly boolean[]>(
    (pernyataan ?? []).map(() => false),
  );
  const [ketikan, setKetikan] = useState('');
  const [proses, setProses] = useState(false);
  const [hasil, setHasil] = useState<HasilAksi | null>(null);

  const idAlasan = useId();
  const idKata = useId();

  const kurang = alasan ? Math.max(0, alasan.minimal - keterangan.trim().length) : 0;
  const bakuTerpilih = !alasan || alasan.baku.length === 0 || pilihanBaku !== '';
  const semuaDicentang = dicentang.every(Boolean);
  const kataCocok = !kataKunci || ketikan.trim().toUpperCase() === kataKunci.toUpperCase();
  const siap = kurang === 0 && bakuTerpilih && semuaDicentang && kataCocok;

  const belum: string[] = [];
  if (!bakuTerpilih) belum.push('pilih satu alasan baku');
  if (kurang > 0) belum.push(`tulis keterangan minimal ${alasan?.minimal} karakter`);
  if (!semuaDicentang) belum.push('centang pernyataan di atas');
  if (!kataCocok) belum.push(`tulis ${kataKunci}`);

  const kirim = async () => {
    if (!siap || proses) return;
    setProses(true);
    const jawaban = await jalankanAksi({
      awalan: awalanRef,
      waktuServerIso,
      gagalkan,
      alasanGagal,
    });
    setProses(false);
    setHasil(jawaban);
    onSelesai?.(jawaban);
  };

  const tutupDanBereskan = () => {
    // Hasil dibuang saat dialog ditutup supaya pembukaan berikutnya mulai bersih.
    // Isian alasan sengaja TIDAK direset di sini: kalau gagal, teksnya dipakai lagi.
    if (hasil?.ok) {
      setHasil(null);
      setKeterangan(alasan?.contoh ?? '');
      setPilihanBaku('');
      setDicentang((pernyataan ?? []).map(() => false));
      setKetikan('');
    } else {
      setHasil(null);
    }
    onTutup();
  };

  return (
    <Dialog terbuka={terbuka} onTutup={tutupDanBereskan} judul={judul} sub={sub} lebar="lebar">
      {hasil ? (
        <KartuKeadaan
          hidup="assertive"
          nada={hasil.ok ? 'ok' : 'danger'}
          keadaan={hasil.ok ? 'Berhasil' : 'Gagal'}
          judul={hasil.ok ? pesanBerhasil : 'Perubahan tidak tersimpan'}
          teks={
            <p>
              {hasil.ok
                ? `Tercatat ${formatWaktu(hasil.waktuIso)} atas namamu dan masuk audit log.`
                : hasil.alasan}
            </p>
          }
          nomorRef={hasil.ref}
          aksi={
            <>
              <button type="button" onClick={tutupDanBereskan} className={`${adm.tombol} ${adm.tombolUtama}`}>
                {hasil.ok ? 'Selesai' : 'Kembali ke formulir'}
              </button>
              {!hasil.ok ? (
                <button type="button" onClick={() => void kirim()} className={adm.tombol}>
                  Kirim ulang
                </button>
              ) : null}
            </>
          }
        />
      ) : (
        <>
          <section className={styles.dampak}>
            <h3 className={styles.dampakJudul}>{ringkasanDampak}</h3>
            <dl className={adm.rincian}>
              {dampak.map((d) => (
                <div key={d.label} className={adm.rincianBaris}>
                  <dt className={adm.rincianLabel}>{d.label}</dt>
                  <dd className={adm.rincianNilai}>{d.nilai}</dd>
                </div>
              ))}
            </dl>
            {catatanDampak ? <div className={styles.catatanDampak}>{catatanDampak}</div> : null}
          </section>

          {anak}

          {alasan ? (
            <section className={styles.alasan}>
              {alasan.baku.length > 0 ? (
                <fieldset className={styles.grup}>
                  <legend className={adm.ladangLabel}>
                    Alasan baku <span className={adm.ladangWajib}>· wajib pilih satu</span>
                  </legend>
                  <div className={adm.opsiDaftar}>
                    {alasan.baku.map((b) => (
                      <label key={b} className={adm.opsi}>
                        <input
                          type="radio"
                          name={`${idAlasan}-baku`}
                          value={b}
                          checked={pilihanBaku === b}
                          onChange={() => setPilihanBaku(b)}
                        />
                        {b}
                      </label>
                    ))}
                  </div>
                </fieldset>
              ) : null}

              <div className={adm.ladang}>
                <label htmlFor={idAlasan} className={adm.ladangLabel}>
                  {alasan.label}{' '}
                  <span className={adm.ladangWajib}>
                    · wajib, minimal {alasan.minimal} karakter
                  </span>
                </label>
                <textarea
                  id={idAlasan}
                  rows={4}
                  maxLength={alasan.maksimal}
                  value={keterangan}
                  aria-describedby={`${idAlasan}-bantuan`}
                  onChange={(e) => setKeterangan(e.target.value)}
                  className={adm.areaTeks}
                />
                <div className={styles.kakiIsian}>
                  <span id={`${idAlasan}-bantuan`} className={adm.ladangBantuan}>
                    {alasan.bantuan}
                  </span>
                  <span className={kurang > 0 ? adm.ladangGalat : adm.ladangBantuan}>
                    {keterangan.trim().length}/{alasan.maksimal}
                    {kurang > 0 ? ` · kurang ${kurang}` : ''}
                  </span>
                </div>
              </div>
            </section>
          ) : null}

          {pernyataan && pernyataan.length > 0 ? (
            <ul className={styles.pernyataan}>
              {pernyataan.map((p, i) => (
                <li key={p}>
                  <label className={adm.opsi}>
                    <input
                      type="checkbox"
                      checked={dicentang[i] ?? false}
                      onChange={(e) =>
                        setDicentang((lama) => lama.map((v, j) => (j === i ? e.target.checked : v)))
                      }
                    />
                    {p}
                  </label>
                </li>
              ))}
            </ul>
          ) : null}

          {kataKunci ? (
            <div className={adm.ladang}>
              <label htmlFor={idKata} className={adm.ladangLabel}>
                Tulis <strong>{kataKunci}</strong> untuk melanjutkan
              </label>
              <input
                id={idKata}
                type="text"
                value={ketikan}
                placeholder={kataKunci}
                autoComplete="off"
                onChange={(e) => setKetikan(e.target.value)}
                className={adm.isian}
              />
            </div>
          ) : null}

          <footer className={styles.kaki}>
            <p className={adm.catatan}>
              Aksi ini menghasilkan nomor referensi dan tercatat atas namamu di audit log.
            </p>

            <div className={styles.tombolBaris}>
              <button type="button" onClick={tutupDanBereskan} className={adm.tombol}>
                Batal
              </button>
              <button
                type="button"
                disabled={!siap || proses}
                onClick={() => void kirim()}
                className={`${adm.tombol} ${nadaKirim === 'bahaya' ? adm.tombolBahaya : adm.tombolUtama}`}
              >
                {proses ? (
                  <>
                    <Ikon nama="ulang" ukuran={14} tebal={2.2} />
                    Menyimpan…
                  </>
                ) : (
                  labelKirim
                )}
              </button>
            </div>

            <p aria-live="polite" className={styles.syarat}>
              {proses
                ? 'Menyimpan keputusan… jangan tutup jendela.'
                : belum.length > 0
                  ? `Tombol aktif setelah: ${belum.join(' · ')}.`
                  : 'Semua syarat terpenuhi.'}
            </p>
          </footer>
        </>
      )}
    </Dialog>
  );
}
