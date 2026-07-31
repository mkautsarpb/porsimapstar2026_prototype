import type { Metadata } from 'next';
import { Ikon } from '@/components/app/Ikon';
import { Lencana } from '@/components/app/Lencana';
import { KartuKeadaan } from '@/components/admin/KartuKeadaan';
import { AksiSinkronisasi } from '@/components/admin/sinkronisasi/AksiSinkronisasi';
import { StripAngka } from '@/components/admin/StripAngka';
import { TabelAdmin } from '@/components/admin/TabelAdmin';
import {
  ANTREAN_NOTIFIKASI,
  GALAT_AKTIF,
  KESEHATAN_SISTEM,
  LEMBAR_SHEETS,
  RINCIAN_EMAIL_GAGAL,
  RINGKAS_SHEETS,
} from '@/data/admin/sinkronisasi';
import { WAKTU_SERVER_ISO } from '@/data/panitia';
import { bolehLihatTabSistem } from '@/lib/admin/izin';
import { bacaSesiPanitia } from '@/lib/admin/sesi';
import adm from '@/components/admin/adm.module.css';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Sinkronisasi · Panitia',
  robots: { index: false, follow: false },
};

/**
 * `/admin/sinkronisasi` — integrasi Sheets, antrean notifikasi, kesehatan sistem
 * (E4.4).
 *
 * Enam kartu kesehatan sistem hanya dirender untuk peran dengan
 * `integration.manage`. Peran lain melihat pil ringkas di topbar ("Sistem sehat"
 * / "Ada gangguan") dan tidak lebih — angka p95, jumlah koneksi basis data, dan
 * kapasitas disk adalah peta infrastruktur, bukan informasi operasional panitia
 * (SRS §14.2, FE-ADMIN-002).
 *
 * Kalimat pembuka halaman bukan hiasan: tanpa "Sheets adalah salinan
 * operasional", lencana galat merah di menu akan dibaca sebagai kehilangan data
 * pada hari yang paling sibuk.
 */
export default async function SinkronisasiPage() {
  const sesi = await bacaSesiPanitia();
  const bolehLihatSistem = bolehLihatTabSistem(sesi);

  const emailGagal = ANTREAN_NOTIFIKASI.find((a) => a.kanal === 'Email')?.gagal ?? 0;
  const layakDicoba = RINCIAN_EMAIL_GAGAL.filter((r) => r.layakDicoba).reduce(
    (n, r) => n + r.jumlah,
    0,
  );
  const lembarBermasalah = LEMBAR_SHEETS.filter((l) => l.galat !== null);
  const semuaSinkron = lembarBermasalah.length === 0;

  return (
    <div className={adm.halaman}>
      <div className={`${adm.panel} ${adm.panelNetral}`}>
        <span aria-hidden="true" className={adm.panelIkon}>
          <Ikon nama="bantuan" ukuran={16} tebal={2.2} />
        </span>
        <p className={adm.panelTeks}>
          Google Sheets adalah <strong>salinan operasional</strong>, bukan sumber kebenaran. Kalau
          sinkronisasi gagal, pendaftaran, verifikasi, dan check-in tetap tersimpan utuh di basis
          data — tidak ada transaksi yang dibatalkan. Perbaiki sync tanpa panik: data di aplikasi
          tetap yang dipakai panitia.
        </p>
      </div>

      <StripAngka
        angka={[
          {
            id: 'sukses',
            nilai: RINGKAS_SHEETS.suksesTerakhir,
            label: `sukses terakhir · ${RINGKAS_SHEETS.suksesTerakhirRelatif}`,
          },
          {
            id: 'lambat',
            nilai: `${RINGKAS_SHEETS.keterlambatanMenit} menit`,
            label: `keterlambatan · di atas target ${RINGKAS_SHEETS.targetMenit} menit`,
            nada: RINGKAS_SHEETS.keterlambatanMenit > RINGKAS_SHEETS.targetMenit ? 'warn' : 'ok',
          },
          {
            id: 'berjalan',
            nilai: String(RINGKAS_SHEETS.pekerjaanBerjalan),
            label: `pekerjaan berjalan · ${RINGKAS_SHEETS.pekerjaanRef}`,
            nada: 'info',
          },
          {
            id: 'bermasalah',
            nilai: String(lembarBermasalah.length),
            label: 'lembar kerja bermasalah',
            nada: lembarBermasalah.length > 0 ? 'danger' : 'ok',
          },
        ]}
      />

      <section className={adm.bagian}>
        <div className={adm.bagianKepala}>
          <h2 className={adm.judulBagian}>Integrasi Google Sheets</h2>
          <AksiSinkronisasi
            lembarBermasalah={
              semuaSinkron ? 'Seluruh lembar' : lembarBermasalah.map((l) => l.nama).join(', ')
            }
            barisMenunggu={GALAT_AKTIF.barisMenunggu}
            emailGagal={emailGagal}
            emailLayakDicoba={layakDicoba}
            waktuServerIso={WAKTU_SERVER_ISO}
            rincianGagal={RINCIAN_EMAIL_GAGAL.map((r) => ({
              label: r.sebab,
              nilai: `${r.jumlah} · ${r.layakDicoba ? 'layak dicoba' : 'kemungkinan gagal lagi'}`,
            }))}
          />
        </div>

        <TabelAdmin
          caption="Status sinkronisasi tiap lembar kerja Google Sheets"
          minLebar={640}
          kolom={[
            { label: 'Lembar kerja' },
            { label: 'Sukses terakhir' },
            { label: 'Baris' },
            { label: 'Galat' },
          ]}
        >
          {LEMBAR_SHEETS.map((l) => (
            <tr key={l.id}>
              <td>
                <strong>{l.nama}</strong>
              </td>
              <td>{l.suksesTerakhir}</td>
              <td>{l.baris}</td>
              <td>
                {l.galat ? (
                  <Lencana label={l.galat.kode} nada="danger" ikon="seru" />
                ) : (
                  <Lencana label="Tidak ada" nada="ok" ikon="centang" />
                )}
              </td>
            </tr>
          ))}
        </TabelAdmin>

        {semuaSinkron ? (
          <KartuKeadaan
            nada="ok"
            keadaan="Kosong"
            judul="Semua lembar kerja sinkron"
            teks={
              <p>
                {LEMBAR_SHEETS.length} dari {LEMBAR_SHEETS.length} lembar tersalin dan tidak ada
                pekerjaan yang menunggu. Tidak ada yang perlu kamu lakukan di halaman ini —
                sinkronisasi otomatis berjalan setiap {RINGKAS_SHEETS.intervalOtomatisMenit} menit.
              </p>
            }
          />
        ) : (
          <KartuKeadaan
            nada="danger"
            keadaan="Galat"
            judul={GALAT_AKTIF.judul}
            teks={<p>{GALAT_AKTIF.teks}</p>}
            nomorRef={GALAT_AKTIF.ref}
          />
        )}
      </section>

      <section className={adm.bagian}>
        <div className={adm.bagianKepala}>
          <h2 className={adm.judulBagian}>Antrean notifikasi</h2>
          <p className={adm.catatan}>hari ini · hanya dua kanal yang dipakai proyek ini</p>
        </div>

        <TabelAdmin
          caption="Antrean dan hasil pengiriman notifikasi per kanal pada hari ini"
          minLebar={560}
          kolom={[
            { label: 'Kanal' },
            { label: 'Antre', angka: true },
            { label: 'Terkirim', angka: true },
            { label: 'Sampai', angka: true },
            { label: 'Gagal', angka: true },
          ]}
        >
          {ANTREAN_NOTIFIKASI.map((a) => (
            <tr key={a.kanal}>
              <td>
                <strong>{a.kanal}</strong>
              </td>
              <td data-angka="true">{a.antre}</td>
              <td data-angka="true">{a.terkirim}</td>
              <td data-angka="true">{a.sampai}</td>
              <td data-angka="true">
                {a.gagal > 0 ? (
                  <Lencana label={String(a.gagal)} nada="danger" ikon="seru" />
                ) : (
                  <span>0</span>
                )}
              </td>
            </tr>
          ))}
        </TabelAdmin>

        {emailGagal > 0 ? (
          <div className={`${adm.panel} ${adm.panelPeringatan}`}>
            <span aria-hidden="true" className={adm.panelIkon}>
              <Ikon nama="amplop" ukuran={16} tebal={2.2} />
            </span>
            <p className={adm.panelTeks}>
              <strong>{emailGagal} email gagal.</strong>{' '}
              {RINCIAN_EMAIL_GAGAL.map((r) => `${r.jumlah} ${r.sebab.toLowerCase()}`).join(', ')}.
              Notifikasi dalam aplikasi untuk {emailGagal} orang yang sama tetap sampai, jadi tidak
              ada yang benar-benar kehilangan kabar.
            </p>
          </div>
        ) : null}
      </section>

      {bolehLihatSistem ? (
        <section className={adm.bagian}>
          <div className={adm.bagianKepala}>
            <h2 className={adm.judulBagian}>Kesehatan sistem · detail penuh</h2>
            <span className={adm.eyebrow}>Super Admin</span>
          </div>

          <ul className={styles.kesehatan}>
            {KESEHATAN_SISTEM.map((k) => (
              <li key={k.id} data-keadaan={k.keadaan} className={styles.kartuSistem}>
                <p className={styles.sistemNama}>
                  <span aria-hidden="true" className={styles.titik} />
                  {k.nama}
                </p>
                <p className={styles.sistemNilai}>{k.nilai}</p>
                <p className={adm.catatan}>{k.rincian}</p>
              </li>
            ))}
          </ul>

          <p className={adm.catatan}>
            Peran lain hanya melihat satu pil ringkas di topbar (“Sistem sehat” atau “Ada
            gangguan”) — enam kartu di atas tidak dirender untuk mereka, bukan disamarkan.
          </p>
        </section>
      ) : (
        <div className={`${adm.panel} ${adm.panelNetral}`}>
          <span aria-hidden="true" className={adm.panelIkon}>
            <Ikon nama="gear" ukuran={16} tebal={2.2} />
          </span>
          <p className={adm.panelTeks}>
            Detail kesehatan sistem — API, basis data, Redis, antrean, disk, cadangan — hanya
            dirender untuk peran dengan kewenangan integrasi. Ringkasannya tetap terlihat sebagai pil
            di topbar.
          </p>
        </div>
      )}
    </div>
  );
}
