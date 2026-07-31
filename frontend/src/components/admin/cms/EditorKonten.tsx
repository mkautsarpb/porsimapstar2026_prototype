'use client';

import { useId, useState } from 'react';
import { Ikon } from '@/components/app/Ikon';
import { DialogAksiKritis } from '@/components/admin/DialogAksiKritis';
import { formatAngka } from '@/lib/admin/format';
import adm from '@/components/admin/adm.module.css';
import styles from './EditorKonten.module.css';

/**
 * Editor konten portal + pratinjau terbit (E4.2).
 *
 * Pratinjau di sebelah kanan memakai lebar kolom portal (680px), bukan lebar
 * panel admin. Pratinjau selebar layar admin memberi kesan panjang paragraf yang
 * salah, dan pengumuman yang enak dibaca di panel bisa jadi enam baris rapat di
 * portal.
 *
 * Aturan sanitasi ditulis di editor, bukan hanya diterapkan diam-diam di server:
 * orang yang menempelkan embed lalu melihatnya hilang tanpa penjelasan akan
 * mengira editornya rusak.
 *
 * Menerbitkan mengirim notifikasi ke ribuan penerima, jadi ia aksi kritis dengan
 * ringkasan dampak dan pernyataan — sama seperti publikasi jadwal.
 */
export function EditorKonten({
  judul,
  jenis,
  versi,
  statusTeks,
  isiAwal,
  jadwalTerbit,
  perkiraanPenerima,
  waktuServerIso,
}: {
  readonly judul: string;
  readonly jenis: string;
  readonly versi: string;
  readonly statusTeks: string;
  readonly isiAwal: string;
  readonly jadwalTerbit: string | null;
  readonly perkiraanPenerima: number;
  readonly waktuServerIso: string;
}) {
  const [isi, setIsi] = useState(isiAwal);
  const [terbitkan, setTerbitkan] = useState(false);
  const idIsi = useId();

  const paragraf = isi
    .split('\n')
    .map((p) => p.trim())
    .filter((p) => p !== '');

  return (
    <section className={adm.kartu}>
      <div className={adm.kartuKepala}>
        <div>
          <h2 className={adm.kartuJudul}>{judul}</h2>
          <p className={adm.catatan}>
            {jenis} · {versi} · {statusTeks}
          </p>
        </div>
        {jadwalTerbit ? (
          <span className={styles.jadwal}>Terjadwal · {jadwalTerbit}</span>
        ) : null}
      </div>

      <div className={styles.duaKolom}>
        <div className={styles.editor}>
          <div aria-hidden="true" className={styles.bilahAlat}>
            <span>B</span>
            <span>I</span>
            <span>H2</span>
            <span>Daftar</span>
            <span>Tautan</span>
          </div>

          <label htmlFor={idIsi} className="sr-only">
            Isi konten
          </label>
          <textarea
            id={idIsi}
            rows={10}
            value={isi}
            onChange={(e) => setIsi(e.target.value)}
            className={adm.areaTeks}
          />

          <div className={`${adm.panel} ${adm.panelNetral}`}>
            <span aria-hidden="true" className={adm.panelIkon}>
              <Ikon nama="bantuan" ukuran={16} tebal={2.2} />
            </span>
            <p className={adm.panelTeks}>
              Isi disanitasi di server sebelum disimpan: hanya tag teks dasar, daftar, dan tautan
              http/https yang diizinkan. Skrip, iframe, dan atribut event dihapus tanpa mengubah
              teksnya. Tempelan dari Word dibersihkan otomatis.
            </p>
          </div>

          <dl className={adm.rincian}>
            <div className={adm.rincianBaris}>
              <dt className={adm.rincianLabel}>Waktu terbit</dt>
              <dd className={adm.rincianNilai}>
                {jadwalTerbit ?? 'Kosong — terbit langsung saat tombol ditekan'}
              </dd>
            </div>
            <div className={adm.rincianBaris}>
              <dt className={adm.rincianLabel}>Notifikasi saat terbit</dt>
              <dd className={adm.rincianNilai}>Email + dalam aplikasi</dd>
            </div>
            <div className={adm.rincianBaris}>
              <dt className={adm.rincianLabel}>Perkiraan penerima</dt>
              <dd className={adm.rincianNilai}>{formatAngka(perkiraanPenerima)} orang</dd>
            </div>
          </dl>
        </div>

        <div className={styles.pratinjau}>
          <div className={styles.pratinjauKepala}>
            <p className={adm.eyebrow}>Pratinjau sebelum terbit · tampilan portal</p>
            <span className={adm.catatan}>Lebar 680px</span>
          </div>

          <article className={styles.artikel}>
            <p className={styles.artikelEyebrow}>
              {jenis.toUpperCase()} · {jadwalTerbit ?? 'TERBIT SEKARANG'}
            </p>
            <h3 className={styles.artikelJudul}>{judul}</h3>
            {paragraf.length > 0 ? (
              paragraf.map((p) => (
                <p key={p.slice(0, 24)} className={styles.artikelTeks}>
                  {p}
                </p>
              ))
            ) : (
              <p className={styles.artikelKosong}>
                Isi masih kosong. Pengunjung tidak akan melihat apa pun selain judul — tulis
                setidaknya satu paragraf sebelum menerbitkan.
              </p>
            )}
          </article>
        </div>
      </div>

      <footer className={styles.kaki}>
        <p className={adm.catatan}>
          Pengunjung masih melihat versi yang sedang tayang sampai jadwal terbit tercapai atau tombol
          terbit ditekan.
        </p>

        <div className={adm.barisAksi}>
          <button type="button" className={adm.tombol}>
            Simpan draf
          </button>
          {jadwalTerbit ? (
            <button type="button" className={adm.tombol}>
              Batalkan jadwal
            </button>
          ) : null}
          <button
            type="button"
            disabled={paragraf.length === 0}
            onClick={() => setTerbitkan(true)}
            className={`${adm.tombol} ${adm.tombolUtama}`}
          >
            Terbitkan sekarang
          </button>
        </div>
      </footer>

      <DialogAksiKritis
        terbuka={terbitkan}
        onTutup={() => setTerbitkan(false)}
        judul="Terbitkan konten sekarang"
        sub={`${judul} · ${jenis} · ${versi}`}
        awalanRef="CMS"
        waktuServerIso={waktuServerIso}
        ringkasanDampak="Yang akan terjadi"
        dampak={[
          { label: 'Terlihat pengunjung', nilai: 'Segera setelah tersimpan' },
          { label: 'Versi tayang', nilai: `${versi} menggantikan versi sebelumnya` },
          { label: 'Notifikasi', nilai: `${formatAngka(perkiraanPenerima)} penerima` },
          { label: 'Kanal', nilai: 'Email + dalam aplikasi' },
        ]}
        catatanDampak={
          <p>
            Menerbitkan sekarang membatalkan jadwal terbit yang sudah disetel. Notifikasi yang sudah
            terkirim tidak bisa ditarik; koreksi dilakukan dengan menerbitkan versi berikutnya.
          </p>
        }
        alasan={{
          label: 'Catatan versi',
          bantuan: 'Dibaca penerima notifikasi. Sebut apa yang berubah, bukan “pembaruan konten”.',
          minimal: 20,
          maksimal: 300,
          baku: [],
        }}
        pernyataan={[
          `Saya paham ${formatAngka(perkiraanPenerima)} notifikasi akan terkirim dan tidak bisa ditarik kembali.`,
        ]}
        labelKirim="Terbitkan & kirim notifikasi"
        pesanBerhasil="Konten diterbitkan"
      />
    </section>
  );
}
