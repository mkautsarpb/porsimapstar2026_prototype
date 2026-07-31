import type { Metadata } from 'next';
import { Lencana } from '@/components/app/Lencana';
import { BilahFilter } from '@/components/admin/BilahFilter';
import { DaftarBar } from '@/components/admin/DaftarBar';
import { KakiTabel } from '@/components/admin/KakiTabel';
import { PanelEkspor } from '@/components/admin/laporan/PanelEkspor';
import { TabelAdmin } from '@/components/admin/TabelAdmin';
import {
  JUMLAH_INSTITUSI,
  KOLOM_EKSPOR_LAPORAN,
  MASA_BERLAKU_TAUTAN_MENIT,
  PEKERJAAN_EKSPOR,
  REKAP_CABANG,
  REKAP_INSTITUSI,
  RIWAYAT_EKSPOR,
  TOTAL_CATATAN_EKSPOR,
  TOTAL_PENDAFTARAN,
  TOTAL_TIM,
} from '@/data/admin/laporan';
import { WAKTU_SERVER_ISO } from '@/data/panitia';
import { formatAngka } from '@/lib/admin/format';
import { bacaKunci, type Query } from '@/lib/admin/query';
import { bacaSesiPanitia } from '@/lib/admin/sesi';
import { LABEL_PERAN } from '@/lib/admin/izin';
import adm from '@/components/admin/adm.module.css';

export const metadata: Metadata = {
  title: 'Laporan · Panitia',
  robots: { index: false, follow: false },
};

const OPSI_PERIODE = [
  { nilai: '21-28-sep', label: '21 – 28 September 2026' },
  { nilai: '21-30-sep', label: '21 – 30 September 2026' },
  { nilai: 'seluruh', label: 'Seluruh periode pendaftaran' },
];

const OPSI_STATUS = [
  { nilai: 'semua', label: 'Semua status pendaftaran' },
  { nilai: 'terverifikasi', label: 'Terverifikasi' },
  { nilai: 'menunggu', label: 'Menunggu verifikasi' },
  { nilai: 'ditolak', label: 'Ditolak' },
];

/**
 * `/admin/laporan` — rekapitulasi dan ekspor (E4.3).
 *
 * Rekap per cabang dan per institusi harus berjumlah sama; kalimat totalnya
 * ditulis di bawah keduanya supaya selisih langsung terlihat. Angka rekap per
 * cabang menghitung PESERTA, bukan tim — disebut eksplisit karena modul Lomba di
 * panel yang sama memakai satuan tim.
 */
export default async function LaporanPage({
  searchParams,
}: {
  readonly searchParams: Promise<Query>;
}) {
  const query = await searchParams;
  const sesi = await bacaSesiPanitia();

  const periode = bacaKunci(query, 'periode', '21-28-sep');
  const status = bacaKunci(query, 'status', 'semua');
  const institusi = bacaKunci(query, 'institusi', 'semua');

  const labelPeriode = OPSI_PERIODE.find((o) => o.nilai === periode)?.label ?? OPSI_PERIODE[0]!.label;
  const labelStatus = OPSI_STATUS.find((o) => o.nilai === status)?.label ?? 'Semua status';
  const berjalan = PEKERJAAN_EKSPOR.filter((p) => p.keadaan === 'berjalan').length;

  return (
    <div className={adm.halaman}>
      <BilahFilter
        aksi="/admin/laporan"
        hrefReset="/admin/laporan"
        kolom={[
          { nama: 'periode', judul: 'Periode', nilai: periode, bawaan: '21-28-sep', opsi: OPSI_PERIODE },
          {
            nama: 'status',
            judul: 'Status pendaftaran',
            nilai: status,
            bawaan: 'semua',
            opsi: OPSI_STATUS,
          },
          {
            nama: 'institusi',
            judul: 'Institusi',
            nilai: institusi,
            bawaan: 'semua',
            opsi: [
              { nilai: 'semua', label: `Semua institusi (${JUMLAH_INSTITUSI})` },
              ...REKAP_INSTITUSI.filter((r) => r.id !== 'ri-lain').map((r) => ({
                nilai: r.institusi,
                label: r.institusi,
              })),
            ],
          },
        ]}
        catatan={`Ekspor selalu mengikuti filter yang aktif dan cakupan peranmu (${sesi.cakupanPenuh ? 'seluruh event' : `${sesi.cakupanLomba.length} lomba`}). Filter yang berlaku ikut tercatat di riwayat ekspor.`}
        anak={
          berjalan > 0 ? (
            <Lencana label={`${berjalan} pekerjaan ekspor berjalan`} nada="info" ikon="jam" />
          ) : null
        }
      />

      <section className={adm.bagian}>
        <PanelEkspor
          pekerjaan={PEKERJAAN_EKSPOR}
          jumlahBaris={TOTAL_PENDAFTARAN}
          kolom={KOLOM_EKSPOR_LAPORAN}
          masaBerlakuMenit={MASA_BERLAKU_TAUTAN_MENIT}
          waktuServerIso={WAKTU_SERVER_ISO}
          ringkasFilter={[
            { label: 'Periode', nilai: labelPeriode },
            {
              label: 'Cabang',
              nilai: sesi.cakupanPenuh
                ? 'Seluruh cabang'
                : `${sesi.cakupanLomba.length} cabang dalam cakupan peranmu`,
            },
            { label: 'Institusi', nilai: institusi === 'semua' ? `Semua (${JUMLAH_INSTITUSI})` : institusi },
            { label: 'Status pendaftaran', nilai: labelStatus },
            { label: 'Format', nilai: 'CSV (UTF-8)' },
          ]}
        />
      </section>

      <div className={`${adm.duaLajur} ${adm.duaLajurSeimbang}`}>
        <section className={adm.kartu}>
          <div className={adm.kartuKepala}>
            <h2 className={adm.kartuJudul}>Rekap per cabang</h2>
            <span className={adm.eyebrow}>mengikuti filter</span>
          </div>

          <DaftarBar
            satuan="peserta"
            baris={REKAP_CABANG.map((r) => ({ id: r.id, nama: r.cabang, jumlah: r.jumlah }))}
          />

          <p className={adm.catatan}>
            Total {formatAngka(TOTAL_PENDAFTARAN)} pendaftaran peserta di {REKAP_CABANG.length}{' '}
            cabang — angka ini menghitung <strong>peserta</strong>, bukan tim.
          </p>
        </section>

        <section className={adm.kartu}>
          <div className={adm.kartuKepala}>
            <h2 className={adm.kartuJudul}>Rekap per institusi</h2>
            <span className={adm.eyebrow}>{JUMLAH_INSTITUSI} institusi</span>
          </div>

          <TabelAdmin
            caption="Jumlah peserta dan tim per institusi"
            minLebar={360}
            kolom={[{ label: 'Institusi' }, { label: 'Peserta', angka: true }, { label: 'Tim', angka: true }]}
          >
            {REKAP_INSTITUSI.map((r) => (
              <tr key={r.id}>
                <td>{r.institusi}</td>
                <td data-angka="true">{formatAngka(r.peserta)}</td>
                <td data-angka="true">{r.tim}</td>
              </tr>
            ))}
          </TabelAdmin>

          <p className={adm.catatan}>
            Total {formatAngka(TOTAL_PENDAFTARAN)} peserta dan {TOTAL_TIM} tim — sama dengan rekap
            per cabang di samping. Kalau kedua angka ini berbeda, salah satu rekap memakai filter
            yang tidak sama.
          </p>
        </section>
      </div>

      <section className={adm.bagian}>
        <div className={adm.bagianKepala}>
          <h2 className={adm.judulBagian}>Riwayat ekspor</h2>
          <p className={adm.catatan}>
            Bagian dari jejak audit · tidak bisa dihapus · terlihat oleh Super Admin dan auditor
          </p>
        </div>

        <TabelAdmin
          caption="Riwayat ekspor beserta filter, jumlah baris, dan status tautannya"
          minLebar={880}
          kolom={[
            { label: 'Waktu', urut: 'turun' },
            { label: 'Oleh' },
            { label: 'Laporan' },
            { label: 'Filter' },
            { label: 'Baris', angka: true },
            { label: 'Status tautan' },
          ]}
        >
          {RIWAYAT_EKSPOR.map((r) => (
            <tr key={r.id}>
              <td>{r.waktu}</td>
              <td>{r.oleh}</td>
              <td>{r.laporan}</td>
              <td>{r.filter}</td>
              <td data-angka="true">{formatAngka(r.baris)}</td>
              <td>
                <Lencana
                  label={r.statusTautan}
                  nada={r.nada}
                  ikon={r.nada === 'ok' ? 'centang' : r.nada === 'danger' ? 'silang' : 'jam'}
                />
              </td>
            </tr>
          ))}
        </TabelAdmin>

        <KakiTabel
          ringkasan={`${RIWAYAT_EKSPOR.length} ekspor terakhir dari ${TOTAL_CATATAN_EKSPOR} catatan`}
          catatan={`Setiap baris menyimpan filter lengkap, kolom, dan tingkat masking yang berlaku saat itu — masking mengikuti peran pengekspor (${LABEL_PERAN[sesi.peran]}), bukan peran yang membacanya sekarang. Ekspor yang gagal tetap tercatat.`}
        />
      </section>
    </div>
  );
}
