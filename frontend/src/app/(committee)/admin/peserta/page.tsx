import type { Metadata } from 'next';
import { Ikon } from '@/components/app/Ikon';
import { BilahFilter } from '@/components/admin/BilahFilter';
import { PanelPeserta } from '@/components/admin/peserta/PanelPeserta';
import { DAFTAR_PESERTA, KOLOM_EKSPOR_PESERTA, TOTAL_DALAM_CAKUPAN } from '@/data/admin/peserta';
import { WAKTU_SERVER_ISO } from '@/data/panitia';
import { bacaHalaman, bacaKunci, susunHref, type Query } from '@/lib/admin/query';
import { bacaSesiPanitia } from '@/lib/admin/sesi';
import adm from '@/components/admin/adm.module.css';

export const metadata: Metadata = {
  title: 'Peserta · Panitia',
  robots: { index: false, follow: false },
};

const PER_HALAMAN = 25;

const OPSI_STATUS = [
  { nilai: 'semua', label: 'Semua status akun' },
  { nilai: 'aktif', label: 'Aktif' },
  { nilai: 'belum-verifikasi-email', label: 'Belum verifikasi email' },
  { nilai: 'nonaktif', label: 'Nonaktif atas permintaan' },
];

const OPSI_KATEGORI = [
  { nilai: 'semua', label: 'Semua kategori' },
  { nilai: 'Mahasiswa', label: 'Mahasiswa' },
  { nilai: 'Taruna', label: 'Taruna' },
  { nilai: 'Pelajar SMA', label: 'Pelajar SMA' },
];

/**
 * `/admin/peserta` — daftar seluruh akun peserta dalam cakupan peran (E1.1a).
 *
 * Penyaringan dan penghalaman dikerjakan DI SINI, di server. Yang dikirim ke
 * client hanya halaman yang sedang dilihat: mengirim 1.284 baris lalu menyaring
 * di browser berarti data seluruh cakupan ada di perangkat panitia meski hanya
 * 25 baris yang terlihat (agents.md §8).
 */
export default async function DaftarPesertaPage({
  searchParams,
}: {
  readonly searchParams: Promise<Query>;
}) {
  const query = await searchParams;
  const sesi = await bacaSesiPanitia();

  const lomba = bacaKunci(query, 'lomba', 'semua');
  const status = bacaKunci(query, 'status', 'semua');
  const kategori = bacaKunci(query, 'kategori', 'semua');

  const cocok = DAFTAR_PESERTA.filter(
    (p) =>
      (lomba === 'semua' || p.lomba.includes(lomba)) &&
      (status === 'semua' || p.statusAkun === status) &&
      (kategori === 'semua' || p.kategori === kategori),
  );

  const totalHalaman = Math.max(1, Math.ceil(cocok.length / PER_HALAMAN));
  const halaman = bacaHalaman(query, totalHalaman);
  const baris = cocok.slice((halaman - 1) * PER_HALAMAN, halaman * PER_HALAMAN);

  const lombaLain = DAFTAR_PESERTA.flatMap((p) => p.lomba).filter(
    (l, i, arr) => arr.indexOf(l) === i && !sesi.cakupanLomba.includes(l),
  );

  const opsiLomba = [
    { nilai: 'semua', label: 'Semua lomba dalam cakupan' },
    ...sesi.cakupanLomba.map((l) => ({ nilai: l, label: l })),
    ...lombaLain.map((l) => ({ nilai: l, label: l })),
  ];

  const labelStatus = OPSI_STATUS.find((o) => o.nilai === status)?.label ?? 'Semua status akun';

  return (
    <div className={adm.halaman}>
      <BilahFilter
        aksi="/admin/peserta"
        hrefReset="/admin/peserta"
        kolom={[
          { nama: 'lomba', judul: 'Lomba', nilai: lomba, bawaan: 'semua', opsi: opsiLomba },
          {
            nama: 'status',
            judul: 'Status akun',
            nilai: status,
            bawaan: 'semua',
            opsi: OPSI_STATUS,
          },
          {
            nama: 'kategori',
            judul: 'Kategori peserta',
            nilai: kategori,
            bawaan: 'semua',
            opsi: OPSI_KATEGORI,
          },
        ]}
        catatan={`Cakupan peranmu: ${sesi.cakupanPenuh ? 'seluruh event' : `${sesi.cakupanLomba.length} lomba`}. Peserta di luar cakupan tidak pernah masuk daftar ini, termasuk lewat filter.`}
      />

      <PanelPeserta
        baris={baris}
        jumlahHasil={cocok.length}
        totalCakupan={TOTAL_DALAM_CAKUPAN}
        kolomEkspor={KOLOM_EKSPOR_PESERTA}
        waktuServerIso={WAKTU_SERVER_ISO}
        ringkasFilter={[
          {
            label: 'Filter yang ikut',
            nilai: `Lomba: ${lomba === 'semua' ? 'seluruh cakupan' : lomba} · Status akun: ${labelStatus.toLowerCase()}`,
          },
          {
            label: 'Cakupan peran',
            nilai: sesi.cakupanPenuh
              ? 'Seluruh event'
              : `${sesi.cakupanLomba.length} lomba yang kamu pegang`,
          },
          { label: 'Format', nilai: 'CSV (UTF-8)' },
        ]}
        paginasi={{
          halaman,
          totalHalaman,
          hrefSebelumnya:
            halaman > 1
              ? susunHref('/admin/peserta', query, { halaman: String(halaman - 1) })
              : null,
          hrefBerikutnya:
            halaman < totalHalaman
              ? susunHref('/admin/peserta', query, { halaman: String(halaman + 1) })
              : null,
        }}
      />

      <div className={`${adm.panel} ${adm.panelNetral}`}>
        <span aria-hidden="true" className={adm.panelIkon}>
          <Ikon nama="bantuan" ukuran={16} tebal={2.2} />
        </span>
        <p className={adm.panelTeks}>
          Modul ini sengaja tidak punya aksi massal yang mengubah data. Keputusan atas dokumen
          ditulis satu per satu di modul Verifikasi karena alasannya dibaca peserta; aksi massal
          hanya untuk hal yang tidak mengubah keputusan (AC-FE-12).
        </p>
      </div>
    </div>
  );
}
