'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Ikon } from '@/components/app/Ikon';
import { Lencana } from '@/components/app/Lencana';
import { Dialog } from '@/components/admin/Dialog';
import { DialogAksiKritis } from '@/components/admin/DialogAksiKritis';
import { KartuKeadaan } from '@/components/admin/KartuKeadaan';
import { useHitungMundur } from '@/hooks/useHitungMundur';
import { jalankanAksi, type HasilAksi } from '@/lib/admin/aksi-mock';
import { formatWaktu } from '@/lib/admin/format';
import type { DokumenKeputusan } from '@/types/admin';
import adm from '@/components/admin/adm.module.css';
import styles from './LayarKeputusan.module.css';

type Keputusan = 'setuju' | 'perbaikan' | 'tolak' | null;

/**
 * Layar keputusan verifikasi (E1.2b–c) — layar terpenting Panel Panitia.
 *
 * Empat hal yang dijaga di sini:
 *
 * 1. **Hitung mundur tautan pratinjau.** Berkas dibuka lewat tautan bertanda
 *    tangan berumur pendek. Sisa waktunya ditulis SEBELUM tautannya mati, bukan
 *    setelah gambarnya gagal dimuat (E4 aturan lintas modul).
 * 2. **NIK penuh tidak pernah ikut payload.** Tombol "Tampilkan untuk
 *    pencocokan" mengambilnya saat ditekan dan mencatat siapa membukanya. Kalau
 *    nilai penuhnya dikirim lalu disembunyikan dengan CSS, ia tetap ada di DOM
 *    dan di respons — masking yang hanya visual bukan masking (agents.md §6).
 * 3. **Pemeriksaan otomatis bukan keputusan.** Kalimat itu tertulis di layar,
 *    karena tiga centang hijau berturut-turut sangat mudah dibaca sebagai
 *    "aman disetujui" (agents.md §0 prinsip 1).
 * 4. **Pintasan papan tik** N/P pindah dokumen, S/R/T membuka dialog. Pintasan
 *    dimatikan saat fokus ada di isian teks — kalau tidak, mengetik alasan
 *    penolakan akan membuka tiga dialog sekaligus.
 */
export function LayarKeputusan({
  dokumen,
  alasanPerbaikan,
  alasanTolak,
  tenggatPerbaikan,
  waktuServerIso,
}: {
  readonly dokumen: DokumenKeputusan;
  readonly alasanPerbaikan: readonly string[];
  readonly alasanTolak: readonly string[];
  readonly tenggatPerbaikan: string;
  readonly waktuServerIso: string;
}) {
  const [keputusan, setKeputusan] = useState<Keputusan>(null);
  const [nikTerbuka, setNikTerbuka] = useState(false);
  const [hasilSetuju, setHasilSetuju] = useState<HasilAksi | null>(null);
  const [prosesSetuju, setProsesSetuju] = useState(false);
  const [sisa, mulaiHitung] = useHitungMundur();

  useEffect(() => {
    mulaiHitung(dokumen.tautanKedaluwarsaDetik);
  }, [dokumen.tautanKedaluwarsaDetik, mulaiHitung]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const mengetik =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        target?.isContentEditable === true;
      if (mengetik || e.metaKey || e.ctrlKey || e.altKey) return;

      const tombol = e.key.toLowerCase();
      if (tombol === 's') setKeputusan('setuju');
      else if (tombol === 'r') setKeputusan('perbaikan');
      else if (tombol === 't') setKeputusan('tolak');
    };

    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const setujui = async () => {
    if (prosesSetuju) return;
    setProsesSetuju(true);
    const jawaban = await jalankanAksi({ awalan: 'VRF', waktuServerIso });
    setProsesSetuju(false);
    setHasilSetuju(jawaban);
  };

  const menit = Math.floor(sisa / 60);
  const detik = sisa % 60;
  const lolos = dokumen.pemeriksaan.filter((p) => p.lolos).length;

  return (
    <div className={styles.layar}>
      <header className={styles.kepala}>
        <div className={styles.kepalaKiri}>
          <Link href="/admin/verifikasi" className={adm.tautan}>
            <Ikon nama="panah" ukuran={12} tebal={2.4} className={styles.panahBalik} />
            Antrean
          </Link>
          <h1 className={styles.judul}>
            {dokumen.jenisDokumen} · {dokumen.namaPeserta}
          </h1>
          <Lencana label={`Umur antrean ${dokumen.umurJam} jam`} nada="warn" ikon="jam" />
        </div>

        <nav aria-label="Navigasi antrean" className={styles.kepalaKanan}>
          <span className={adm.catatan}>
            Dokumen {dokumen.posisi.indeks} dari {dokumen.posisi.total}
          </span>

          {dokumen.hrefSebelumnya ? (
            <Link href={dokumen.hrefSebelumnya} className={`${adm.tombol} ${adm.tombolKecil}`}>
              Sebelumnya <kbd className={styles.kbd}>P</kbd>
            </Link>
          ) : (
            <span
              aria-disabled="true"
              title="Ini dokumen pertama pada antrean"
              className={`${adm.tombol} ${adm.tombolKecil}`}
            >
              Sebelumnya <kbd className={styles.kbd}>P</kbd>
            </span>
          )}

          {dokumen.hrefBerikutnya ? (
            <Link href={dokumen.hrefBerikutnya} className={`${adm.tombol} ${adm.tombolKecil}`}>
              Berikutnya <kbd className={styles.kbd}>N</kbd>
            </Link>
          ) : (
            <span aria-disabled="true" className={`${adm.tombol} ${adm.tombolKecil}`}>
              Berikutnya <kbd className={styles.kbd}>N</kbd>
            </span>
          )}
        </nav>
      </header>

      <div className={styles.duaPanel}>
        <section className={styles.penampil}>
          <div className={styles.penampilKepala}>
            <div>
              <p className={adm.eyebrow}>{dokumen.jenisDokumen}</p>
              <p className={adm.catatan}>
                {dokumen.versi} · {dokumen.namaBerkas} · {dokumen.ukuran} · diunggah{' '}
                {formatWaktu(dokumen.unggahIso)}
              </p>
            </div>

            <div className={adm.barisAksi}>
              <button type="button" className={`${adm.tombol} ${adm.tombolKecil}`}>
                Perkecil
              </button>
              <span className={adm.catatan}>120%</span>
              <button type="button" className={`${adm.tombol} ${adm.tombolKecil}`}>
                Perbesar
              </button>
              <button type="button" className={`${adm.tombol} ${adm.tombolKecil}`}>
                Putar 90°
              </button>
            </div>
          </div>

          <div className={styles.bidang}>
            <span aria-hidden="true" className={styles.bidangIkon}>
              <Ikon nama="berkas" ukuran={28} />
            </span>
            <p className={styles.bidangJudul}>Area penampil dokumen</p>
            <p className={adm.kosongTeks}>
              Berkas dimuat lewat tautan bertanda tangan berumur pendek dan tidak pernah disematkan
              sebagai URL permanen. Panning dengan drag, zoom dengan tombol atau roda mouse, rotasi
              90° per klik.
            </p>
          </div>

          <div
            className={`${adm.panel} ${sisa <= 60 ? adm.panelPeringatan : adm.panelNetral}`}
            aria-live="polite"
          >
            <span aria-hidden="true" className={adm.panelIkon}>
              <Ikon nama="jam" ukuran={16} tebal={2.2} />
            </span>
            <p className={adm.panelTeks}>
              Tautan pratinjau kedaluwarsa dalam{' '}
              <strong>
                {menit} menit {detik} detik
              </strong>{' '}
              · pembukaan tercatat sebagai {dokumen.refLog}. Setelah habis, muat ulang halaman untuk
              meminta tautan baru — berkasnya tidak hilang.
            </p>
          </div>
        </section>

        <section className={styles.sisi}>
          <div className={adm.kartu}>
            <div className={adm.kartuKepala}>
              <h2 className={adm.kartuJudul}>Peserta</h2>
              <Link href="/admin/peserta" className={adm.tautan}>
                Buka detail peserta
              </Link>
            </div>

            <p className={styles.namaPeserta}>{dokumen.namaPeserta}</p>
            <p className={adm.catatan}>
              <span className={adm.mono}>{dokumen.idTermasking}</span> · {dokumen.kategori} ·{' '}
              {dokumen.institusi} · {dokumen.lomba}
            </p>

            <div className={styles.nik}>
              <p className={adm.meta}>
                NIK <strong className={adm.mono}>{dokumen.nikTermasking}</strong>
              </p>
              {nikTerbuka ? (
                <p className={adm.ladangGalat}>
                  Permintaan NIK penuh dikirim ke server dan tercatat atas namamu. Pada prototipe ini
                  nilai penuhnya tidak pernah dikirim ke browser.
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => setNikTerbuka(true)}
                  className={`${adm.tombol} ${adm.tombolKecil}`}
                >
                  Tampilkan untuk pencocokan
                </button>
              )}
            </div>
          </div>

          <div className={adm.kartu}>
            <div className={adm.kartuKepala}>
              <h2 className={adm.kartuJudul}>Hasil pemeriksaan otomatis</h2>
              <Lencana
                label={`${lolos} dari ${dokumen.pemeriksaan.length} butir lolos`}
                nada={lolos === dokumen.pemeriksaan.length ? 'ok' : 'warn'}
                ikon={lolos === dokumen.pemeriksaan.length ? 'centang' : 'seru'}
              />
            </div>

            <ul className={styles.butirDaftar}>
              {dokumen.pemeriksaan.map((p) => (
                <li key={p.id} data-lolos={p.lolos} className={styles.butir}>
                  <span aria-hidden="true" className={styles.butirIkon}>
                    <Ikon nama={p.lolos ? 'centang' : 'seru'} ukuran={14} tebal={2.2} />
                  </span>
                  <div>
                    <p className={styles.butirJudul}>
                      {p.judul} · {p.lolos ? 'lolos' : 'tidak lolos'}
                    </p>
                    <p className={adm.catatan}>{p.rincian}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className={`${adm.panel} ${adm.panelPeringatan}`}>
              <span aria-hidden="true" className={adm.panelIkon}>
                <Ikon nama="seru" ukuran={16} tebal={2.2} />
              </span>
              <p className={adm.panelTeks}>
                Pemeriksaan otomatis hanya membaca teks dan tanggal —{' '}
                <strong>bukan jaminan keaslian dokumen</strong>. Keputusan akhir tetap di tangan
                panitia, dan alasan yang kamu tulis yang dibaca peserta.
              </p>
            </div>
          </div>

          {hasilSetuju ? (
            <KartuKeadaan
              hidup="assertive"
              nada={hasilSetuju.ok ? 'ok' : 'danger'}
              keadaan={hasilSetuju.ok ? 'Berhasil' : 'Gagal'}
              judul={
                hasilSetuju.ok
                  ? 'Dokumen disetujui'
                  : 'Keputusan tidak tersimpan · status masih menunggu'
              }
              teks={
                <p>
                  {hasilSetuju.ok
                    ? 'Dokumen keluar dari antrean menunggu. Notifikasi dalam aplikasi dan email sudah dikirim ke peserta.'
                    : hasilSetuju.alasan}
                </p>
              }
              nomorRef={hasilSetuju.ref}
              aksi={
                dokumen.hrefBerikutnya && hasilSetuju.ok ? (
                  <Link
                    href={dokumen.hrefBerikutnya}
                    className={`${adm.tombol} ${adm.tombolUtama}`}
                  >
                    Lanjut ke dokumen berikutnya (N)
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => void setujui()}
                    className={`${adm.tombol} ${adm.tombolUtama}`}
                  >
                    Kirim ulang keputusan
                  </button>
                )
              }
            />
          ) : (
            <div className={styles.keputusan}>
              <button
                type="button"
                onClick={() => setKeputusan('setuju')}
                className={`${adm.tombol} ${adm.tombolUtama} ${styles.tombolLebar}`}
              >
                Setujui dokumen <kbd className={styles.kbd}>S</kbd>
              </button>

              <div className={adm.barisAksi}>
                <button
                  type="button"
                  onClick={() => setKeputusan('perbaikan')}
                  className={adm.tombol}
                >
                  Minta perbaikan <kbd className={styles.kbd}>R</kbd>
                </button>
                <button
                  type="button"
                  onClick={() => setKeputusan('tolak')}
                  className={`${adm.tombol} ${adm.tombolBahaya}`}
                >
                  Tolak <kbd className={styles.kbd}>T</kbd>
                </button>
              </div>

              <p className={adm.catatan}>
                Pintasan: <strong>N</strong>/<strong>P</strong> pindah dokumen ·{' '}
                <strong>S</strong>/<strong>R</strong>/<strong>T</strong> membuka dialog keputusan ·{' '}
                <strong>Esc</strong> menutup dialog dan mengembalikan fokus ke tombol asal.
              </p>
            </div>
          )}
        </section>
      </div>

      <Dialog
        terbuka={keputusan === 'setuju'}
        onTutup={() => setKeputusan(null)}
        judul="Setujui dokumen"
        sub={`${dokumen.jenisDokumen} · ${dokumen.namaPeserta} · ${dokumen.idTermasking}`}
      >
        <dl className={adm.rincian}>
          <div className={adm.rincianBaris}>
            <dt className={adm.rincianLabel}>Status dokumen setelah ini</dt>
            <dd className={adm.rincianNilai}>Disetujui</dd>
          </div>
          <div className={adm.rincianBaris}>
            <dt className={adm.rincianLabel}>Pemeriksaan otomatis</dt>
            <dd className={adm.rincianNilai}>
              {lolos} dari {dokumen.pemeriksaan.length} butir lolos
            </dd>
          </div>
          <div className={adm.rincianBaris}>
            <dt className={adm.rincianLabel}>Notifikasi terkirim</dt>
            <dd className={adm.rincianNilai}>Peserta · dalam aplikasi &amp; email</dd>
          </div>
        </dl>

        <p className={adm.teks}>
          Persetujuan tidak butuh alasan tertulis, tapi tetap tercatat atas namamu dengan nomor
          referensi. Bila ada butir yang tidak lolos, pertimbangkan “minta perbaikan” dulu.
        </p>

        <div className={`${adm.barisAksi} ${adm.barisAksiKanan}`}>
          <button type="button" onClick={() => setKeputusan(null)} className={adm.tombol}>
            Batal
          </button>
          <button
            type="button"
            disabled={prosesSetuju}
            onClick={() => {
              setKeputusan(null);
              void setujui();
            }}
            className={`${adm.tombol} ${adm.tombolUtama}`}
          >
            {prosesSetuju ? 'Menyimpan…' : 'Setujui dokumen'}
          </button>
        </div>
      </Dialog>

      <DialogAksiKritis
        terbuka={keputusan === 'perbaikan'}
        onTutup={() => setKeputusan(null)}
        judul="Minta perbaikan"
        sub={`${dokumen.jenisDokumen} · ${dokumen.namaPeserta} · ${dokumen.idTermasking}`}
        awalanRef="VRF"
        waktuServerIso={waktuServerIso}
        ringkasanDampak="Dampak keputusan ini"
        dampak={[
          { label: 'Status dokumen', nilai: 'Perlu diperbaiki' },
          { label: 'Batas unggah versi berikutnya', nilai: tenggatPerbaikan },
          { label: 'Pendaftaran peserta', nilai: 'Tetap berjalan, tidak dibatalkan' },
          { label: 'Notifikasi', nilai: 'Dalam aplikasi + email' },
        ]}
        catatanDampak={
          <p>
            Alasan yang kamu tulis dikirim apa adanya ke peserta. Tulis apa yang harus diperbaiki,
            bukan penilaian atas orangnya.
          </p>
        }
        alasan={{
          label: 'Keterangan untuk peserta',
          bantuan:
            'Sebut bagian yang bermasalah dan langkah konkretnya. Kalimat ini yang dibaca peserta di notifikasi.',
          minimal: 30,
          maksimal: 500,
          baku: alasanPerbaikan,
        }}
        labelKirim="Kirim permintaan perbaikan"
        pesanBerhasil="Permintaan perbaikan terkirim"
      />

      <DialogAksiKritis
        terbuka={keputusan === 'tolak'}
        onTutup={() => setKeputusan(null)}
        judul="Tolak dokumen"
        sub={`${dokumen.jenisDokumen} · ${dokumen.namaPeserta} · ${dokumen.idTermasking}`}
        awalanRef="VRF"
        waktuServerIso={waktuServerIso}
        nadaKirim="bahaya"
        ringkasanDampak="Dampak keputusan ini"
        dampak={[
          { label: 'Status dokumen', nilai: 'Ditolak permanen untuk periode ini' },
          { label: 'Pendaftaran di ' + dokumen.lomba, nilai: 'Menjadi tidak memenuhi syarat' },
          { label: 'Roster tim', nilai: 'Berkurang satu orang' },
          { label: 'Sanggahan ke sekretariat', nilai: `Terbuka sampai ${tenggatPerbaikan}` },
        ]}
        catatanDampak={
          <p>
            Jelaskan dasar penolakan dan jalan keluar yang tersedia. Hindari menuduh; sebut fakta
            yang kamu lihat pada berkas.
          </p>
        }
        alasan={{
          label: 'Keterangan untuk peserta',
          bantuan: 'Alasan ini masuk audit log dan dibaca peserta beserta jalur sanggahannya.',
          minimal: 30,
          maksimal: 500,
          baku: alasanTolak,
        }}
        pernyataan={[
          'Saya sudah membaca berkas ini sendiri dan memahami bahwa penolakan membatalkan kepesertaannya pada lomba tersebut.',
        ]}
        labelKirim="Tolak dokumen"
        pesanBerhasil="Dokumen ditolak"
      />
    </div>
  );
}
