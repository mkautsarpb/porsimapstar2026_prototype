import type { Metadata } from 'next';
import Link from 'next/link';
import { Ikon } from '@/components/app/Ikon';
import { BilahFilter } from '@/components/admin/BilahFilter';
import { BaganGugur } from '@/components/admin/pertandingan/BaganGugur';
import { PapanPertandingan } from '@/components/admin/pertandingan/PapanPertandingan';
import { StripAngka } from '@/components/admin/StripAngka';
import { TabelAdmin } from '@/components/admin/TabelAdmin';
import { TolakAkses } from '@/components/admin/TolakAkses';
import {
  BAGAN_BASKET_PUTRA,
  PERTANDINGAN_HARI_INI,
  RIWAYAT_HASIL,
  WAKTU_HARI_H_ISO,
} from '@/data/admin/pertandingan';
import { formatWaktu } from '@/lib/admin/format';
import { punyaIzin } from '@/lib/admin/izin';
import { bacaEnum, bacaKunci, susunHref, type Query } from '@/lib/admin/query';
import { bacaSesiPanitia } from '@/lib/admin/sesi';
import adm from '@/components/admin/adm.module.css';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Pertandingan · Panitia',
  robots: { index: false, follow: false },
};

const TAMPILAN = ['papan', 'bagan'] as const;

const OPSI_STATUS = [
  { nilai: 'semua', label: 'Semua status' },
  { nilai: 'berlangsung', label: 'Berlangsung' },
  { nilai: 'terjadwal', label: 'Terjadwal' },
  { nilai: 'selesai', label: 'Selesai' },
  { nilai: 'ditunda', label: 'Ditunda' },
  { nilai: 'dibatalkan', label: 'Dibatalkan' },
];

/**
 * `/admin/pertandingan` — papan hari-H (E3.1a–d).
 *
 * Halaman ini SELALU hari berjalan. Tidak ada filter rentang tanggal, karena
 * ruang kendali memakainya untuk menjawab satu pertanyaan: mana yang berjalan
 * dan mana yang terlambat, sekarang. Riwayat hari lain ada di modul Laporan.
 *
 * `match.edit` menentukan apakah halaman ini dirender sama sekali; koreksi hasil
 * butuh kewenangan koordinator di atasnya dan tombolnya tidak dirender untuk
 * operator biasa.
 */
export default async function PertandinganPage({
  searchParams,
}: {
  readonly searchParams: Promise<Query>;
}) {
  const query = await searchParams;
  const sesi = await bacaSesiPanitia();

  if (!punyaIzin(sesi, 'match.edit')) return <TolakAkses />;

  // Koreksi hasil menghitung ulang babak lanjutan dan mencabut kemenangan yang
  // sudah diumumkan — di SRS §14.2 itu wewenang koordinator, bukan operator.
  const bolehKoreksi = punyaIzin(sesi, 'user.manage');

  const tampilan = bacaEnum(query, 'tampilan', TAMPILAN, 'papan');
  const cabang = bacaKunci(query, 'cabang', 'semua');
  const venue = bacaKunci(query, 'venue', 'semua');
  const status = bacaKunci(query, 'status', 'semua');

  const cocok = PERTANDINGAN_HARI_INI.filter(
    (m) =>
      (cabang === 'semua' || m.cabang === cabang) &&
      (venue === 'semua' || m.venue === venue) &&
      (status === 'semua' || m.status === status),
  );

  const hitung = (s: string) => PERTANDINGAN_HARI_INI.filter((m) => m.status === s).length;
  const terlambat = PERTANDINGAN_HARI_INI.filter(
    (m) => m.terlambatMenit !== null && m.terlambatMenit > 0,
  );

  const daftarCabang = PERTANDINGAN_HARI_INI.map((m) => m.cabang).filter(
    (c, i, arr) => arr.indexOf(c) === i,
  );
  const daftarVenue = PERTANDINGAN_HARI_INI.map((m) => m.venue).filter(
    (v, i, arr) => arr.indexOf(v) === i,
  );

  return (
    <div className={adm.halaman}>
      <StripAngka
        angka={[
          {
            id: 'total',
            nilai: String(PERTANDINGAN_HARI_INI.length),
            label: 'pertandingan hari ini',
          },
          { id: 'berlangsung', nilai: String(hitung('berlangsung')), label: 'berlangsung', nada: 'info' },
          { id: 'selesai', nilai: String(hitung('selesai')), label: 'selesai · hasil tercatat', nada: 'ok' },
          {
            id: 'terlambat',
            nilai: String(terlambat.length),
            label:
              terlambat.length > 0
                ? `terlambat · ${terlambat.map((m) => `+${m.terlambatMenit}`).join(' dan ')} menit`
                : 'terlambat',
            nada: terlambat.length > 0 ? 'danger' : undefined,
          },
          {
            id: 'lain',
            nilai: `${hitung('ditunda')} ditunda · ${hitung('dibatalkan')} dibatalkan`,
            label: `sisanya ${hitung('terjadwal')} belum dimulai sesuai jadwal`,
            nada: 'warn',
          },
        ]}
      />

      <BilahFilter
        aksi="/admin/pertandingan"
        hrefReset="/admin/pertandingan"
        kolom={[
          {
            nama: 'cabang',
            judul: 'Cabang',
            nilai: cabang,
            bawaan: 'semua',
            opsi: [
              { nilai: 'semua', label: 'Semua cabang' },
              ...daftarCabang.map((c) => ({ nilai: c, label: c })),
            ],
          },
          {
            nama: 'venue',
            judul: 'Venue',
            nilai: venue,
            bawaan: 'semua',
            opsi: [
              { nilai: 'semua', label: 'Semua venue' },
              ...daftarVenue.map((v) => ({ nilai: v, label: v })),
            ],
          },
          { nama: 'status', judul: 'Status', nilai: status, bawaan: 'semua', opsi: OPSI_STATUS },
        ]}
        catatan={`Halaman ini selalu menampilkan hari berjalan (${formatWaktu(WAKTU_HARI_H_ISO)}) dan mengabaikan filter rentang tanggal. Rekap hari lain ada di modul Laporan.`}
        anak={
          <nav aria-label="Pengalih tampilan pertandingan" className={styles.pengalih}>
            <Link
              href={susunHref('/admin/pertandingan', query, { tampilan: 'papan' })}
              aria-current={tampilan === 'papan' ? 'page' : undefined}
              data-aktif={tampilan === 'papan'}
              className={styles.pengalihItem}
            >
              Papan hari ini
            </Link>
            <Link
              href={susunHref('/admin/pertandingan', query, { tampilan: 'bagan' })}
              aria-current={tampilan === 'bagan' ? 'page' : undefined}
              data-aktif={tampilan === 'bagan'}
              className={styles.pengalihItem}
            >
              Bagan gugur
            </Link>
          </nav>
        }
      />

      {tampilan === 'bagan' ? (
        <BaganGugur
          babak={BAGAN_BASKET_PUTRA}
          judul="Basket Putra · bagan gugur 16 tim"
          meta="15 pertandingan · 9 selesai · bagan diterbitkan ke peserta setelah seluruh penyisihan selesai"
        />
      ) : cocok.length === 0 ? (
        <div className={adm.kosong}>
          <span aria-hidden="true" className={adm.kosongIkon}>
            <Ikon nama="piala" ukuran={18} />
          </span>
          <p className={adm.kosongJudul}>Tidak ada pertandingan yang cocok</p>
          <p className={adm.kosongTeks}>
            Filter cabang, venue, dan status di atas tidak menghasilkan pertandingan apa pun pada
            hari berjalan. Longgarkan salah satunya — jadwal hari lain tidak ikut halaman ini.
          </p>
          <Link href="/admin/pertandingan" className={adm.tombol}>
            Reset filter
          </Link>
        </div>
      ) : (
        <PapanPertandingan
          baris={cocok}
          bolehKoreksi={bolehKoreksi}
          waktuServerIso={WAKTU_HARI_H_ISO}
        />
      )}

      <section className={adm.bagian}>
        <div className={adm.bagianKepala}>
          <h2 className={adm.judulBagian}>Riwayat perubahan hasil</h2>
          <p className={adm.catatan}>{RIWAYAT_HASIL.length} catatan</p>
        </div>

        <TabelAdmin
          caption="Riwayat pencatatan dan koreksi hasil, terbaru di atas"
          minLebar={840}
          kolom={[
            { label: 'Waktu' },
            { label: 'Oleh' },
            { label: 'Dari → ke' },
            { label: 'Alasan' },
            { label: 'Ref' },
          ]}
        >
          {RIWAYAT_HASIL.map((r) => (
            <tr key={r.id}>
              <td>{formatWaktu(r.waktuIso)}</td>
              <td>
                <span className={styles.oleh}>{r.oleh}</span>
                <span className={adm.catatan}>{r.peran}</span>
              </td>
              <td>{r.perubahan}</td>
              <td>{r.alasan}</td>
              <td>
                <span className={adm.mono}>{r.ref}</span>
              </td>
            </tr>
          ))}
        </TabelAdmin>

        <p className={adm.catatan}>
          Riwayat ini juga terlihat oleh kedua tim pada halaman peserta, beserta alasannya. Koreksi
          masih mungkin dilakukan koordinator sampai berita acara akhir ditandatangani.
        </p>
      </section>
    </div>
  );
}
