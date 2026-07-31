import type { Metadata } from 'next';
import { Ikon } from '@/components/app/Ikon';
import { BilahFilter } from '@/components/admin/BilahFilter';
import { StripAngka } from '@/components/admin/StripAngka';
import { TolakAkses } from '@/components/admin/TolakAkses';
import { PanelAntrean } from '@/components/admin/verifikasi/PanelAntrean';
import {
  ANTREAN_VERIFIKASI,
  SUDAH_DIPUTUSKAN_HARI_INI,
  TOTAL_MENUNGGU,
} from '@/data/admin/verifikasi';
import { WAKTU_SERVER_ISO } from '@/data/panitia';
import { punyaIzin } from '@/lib/admin/izin';
import { bacaHalaman, bacaKunci, susunHref, type Query } from '@/lib/admin/query';
import { bacaSesiPanitia } from '@/lib/admin/sesi';
import adm from '@/components/admin/adm.module.css';

export const metadata: Metadata = {
  title: 'Verifikasi · Panitia',
  robots: { index: false, follow: false },
};

const PER_HALAMAN = 25;

const OPSI_STATUS = [
  { nilai: 'menunggu', label: 'Menunggu keputusan' },
  { nilai: 'semua', label: 'Semua status dokumen' },
];

const OPSI_UMUR = [
  { nilai: 'semua', label: 'Semua umur antrean' },
  { nilai: '12', label: 'Lebih dari 12 jam' },
  { nilai: '18', label: 'Lebih dari 18 jam' },
];

/**
 * `/admin/verifikasi` — antrean keputusan dokumen (E1.2a).
 *
 * Seluruh modul ini dijaga `verification.decide`. Tanpa izin itu halaman tidak
 * dirender sama sekali, bukan dirender dalam mode baca: daftar siapa mengunggah
 * dokumen apa sudah merupakan informasi yang tidak boleh dilihat peran lain.
 */
export default async function AntreanVerifikasiPage({
  searchParams,
}: {
  readonly searchParams: Promise<Query>;
}) {
  const query = await searchParams;
  const sesi = await bacaSesiPanitia();

  if (!punyaIzin(sesi, 'verification.decide')) return <TolakAkses />;

  const lomba = bacaKunci(query, 'lomba', 'semua');
  const jenis = bacaKunci(query, 'jenis', 'semua');
  const umur = bacaKunci(query, 'umur', 'semua');

  const batasUmur = Number.parseInt(umur, 10);

  const cocok = ANTREAN_VERIFIKASI.filter(
    (a) =>
      (lomba === 'semua' || a.lomba === lomba) &&
      (jenis === 'semua' || a.jenisDokumen === jenis) &&
      (!Number.isFinite(batasUmur) || a.umurJam > batasUmur),
  );

  const totalHalaman = Math.max(1, Math.ceil(cocok.length / PER_HALAMAN));
  const halaman = bacaHalaman(query, totalHalaman);
  const baris = cocok.slice((halaman - 1) * PER_HALAMAN, halaman * PER_HALAMAN);

  const tertua = ANTREAN_VERIFIKASI.reduce((maks, a) => Math.max(maks, a.umurJam), 0);
  const daftarLomba = ANTREAN_VERIFIKASI.map((a) => a.lomba).filter(
    (l, i, arr) => arr.indexOf(l) === i,
  );
  const daftarJenis = ANTREAN_VERIFIKASI.map((a) => a.jenisDokumen).filter(
    (j, i, arr) => arr.indexOf(j) === i,
  );

  return (
    <div className={adm.halaman}>
      <StripAngka
        angka={[
          {
            id: 'menunggu',
            nilai: String(TOTAL_MENUNGGU),
            label: 'dokumen menunggu keputusan',
            nada: 'warn',
          },
          {
            id: 'tertua',
            nilai: `${tertua} jam`,
            label: 'umur antrean tertua · masuk 27 Sep, 14.30',
            nada: tertua >= 18 ? 'danger' : 'warn',
          },
          {
            id: 'diputuskan',
            nilai: String(SUDAH_DIPUTUSKAN_HARI_INI),
            label: 'sudah kamu putuskan hari ini',
            nada: 'ok',
          },
        ]}
      />

      <BilahFilter
        aksi="/admin/verifikasi"
        hrefReset="/admin/verifikasi"
        kolom={[
          {
            nama: 'status',
            judul: 'Status',
            nilai: bacaKunci(query, 'status', 'menunggu'),
            bawaan: 'menunggu',
            opsi: OPSI_STATUS,
          },
          {
            nama: 'lomba',
            judul: 'Lomba',
            nilai: lomba,
            bawaan: 'semua',
            opsi: [
              { nilai: 'semua', label: 'Semua lomba dalam cakupan' },
              ...daftarLomba.map((l) => ({ nilai: l, label: l })),
            ],
          },
          {
            nama: 'jenis',
            judul: 'Jenis dokumen',
            nilai: jenis,
            bawaan: 'semua',
            opsi: [
              { nilai: 'semua', label: 'Semua jenis dokumen' },
              ...daftarJenis.map((j) => ({ nilai: j, label: j })),
            ],
          },
          { nama: 'umur', judul: 'Umur antrean', nilai: umur, bawaan: 'semua', opsi: OPSI_UMUR },
        ]}
        catatan="Urutan tetap dari umur antrean tertua. Yang paling lama menunggu adalah yang paling dekat dengan tenggat perbaikan peserta, jadi urutan itu bukan preferensi tampilan."
      />

      <div className={`${adm.panel} ${adm.panelPeringatan}`}>
        <span aria-hidden="true" className={adm.panelIkon}>
          <Ikon nama="seru" ukuran={16} tebal={2.2} />
        </span>
        <p className={adm.panelTeks}>
          Setujui, minta perbaikan, dan tolak{' '}
          <strong>sengaja tidak tersedia sebagai aksi massal</strong>. Setiap keputusan dokumen
          ditulis satu per satu karena alasannya dibaca peserta dan menjadi dasar diskualifikasi.
        </p>
      </div>

      <PanelAntrean
        baris={baris}
        jumlahHasil={cocok.length}
        waktuServerIso={WAKTU_SERVER_ISO}
        paginasi={{
          halaman,
          totalHalaman,
          hrefSebelumnya:
            halaman > 1
              ? susunHref('/admin/verifikasi', query, { halaman: String(halaman - 1) })
              : null,
          hrefBerikutnya:
            halaman < totalHalaman
              ? susunHref('/admin/verifikasi', query, { halaman: String(halaman + 1) })
              : null,
        }}
      />
    </div>
  );
}
