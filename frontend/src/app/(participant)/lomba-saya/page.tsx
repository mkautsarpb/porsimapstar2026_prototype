import type { Metadata } from 'next';
import Link from 'next/link';
import { Ikon } from '@/components/app/Ikon';
import { KartuLombaLengkap } from '@/components/lomba/KartuLombaLengkap';
import { LOMBA_SAYA } from '@/data/peserta';
import type { LombaSaya } from '@/types/peserta';
import ui from '@/components/app/ui.module.css';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Lomba saya',
  robots: { index: false, follow: false },
};

type Query = Record<string, string | readonly string[] | undefined>;

function satu(nilai: string | readonly string[] | undefined): string | undefined {
  return Array.isArray(nilai) ? nilai[0] : (nilai as string | undefined);
}

const FILTER_STATUS = [
  { nilai: 'semua', label: 'Semua status' },
  { nilai: 'menunggu-review', label: 'Sedang diperiksa' },
  { nilai: 'perlu-perbaikan', label: 'Perlu diperbaiki' },
  { nilai: 'terverifikasi', label: 'Terverifikasi' },
] as const;

const FILTER_JENIS = [
  { nilai: 'semua', label: 'Semua jenis' },
  { nilai: 'Individual', label: 'Perorangan' },
  { nilai: 'Tim', label: 'Tim' },
] as const;

const FILTER_KATEGORI = [
  { nilai: 'semua', label: 'Semua kategori' },
  { nilai: 'Olahraga', label: 'Olahraga' },
  { nilai: 'Seni', label: 'Seni' },
  { nilai: 'Akademik', label: 'Akademik' },
] as const;

/** Membangun URL halaman ini dengan satu parameter diganti. */
function tautan(sekarang: Record<string, string>, kunci: string, nilai: string): string {
  const q = new URLSearchParams(sekarang);
  if (nilai === 'semua') q.delete(kunci);
  else q.set(kunci, nilai);
  const s = q.toString();
  return s ? `/lomba-saya?${s}` : '/lomba-saya';
}

function cocok(l: LombaSaya, status: string, jenis: string, kategori: string): boolean {
  if (status !== 'semua' && l.status !== status) return false;
  if (jenis !== 'semua' && l.tipe !== jenis) return false;
  if (kategori !== 'semua' && l.kategori !== kategori) return false;
  return true;
}

/**
 * /lomba-saya — daftar seluruh pendaftaran peserta.
 *
 * Tab dan filter disimpan di query URL, bukan state komponen: posisinya bertahan
 * saat kembali dari halaman detail dan bisa dibagikan tanpa memuat data pribadi
 * (agents.md §10, AC-FE-13). Karena itu halaman ini tetap Server Component dan
 * kontrolnya berupa tautan biasa — tetap jalan sebelum JS termuat.
 */
export default async function LombaSayaPage({
  searchParams,
}: {
  readonly searchParams: Promise<Query>;
}) {
  const query = await searchParams;
  const tab = satu(query.tab) === 'riwayat' ? 'riwayat' : 'aktif';
  const status = satu(query.status) ?? 'semua';
  const jenis = satu(query.jenis) ?? 'semua';
  const kategori = satu(query.kategori) ?? 'semua';

  const dasar: Record<string, string> = {};
  if (tab === 'riwayat') dasar.tab = 'riwayat';
  if (status !== 'semua') dasar.status = status;
  if (jenis !== 'semua') dasar.jenis = jenis;
  if (kategori !== 'semua') dasar.kategori = kategori;

  const semuaTab = LOMBA_SAYA.filter((l) => l.riwayat === (tab === 'riwayat'));
  const daftar = semuaTab.filter((l) => cocok(l, status, jenis, kategori));
  const jumlahFilter = [status, jenis, kategori].filter((f) => f !== 'semua').length;
  const perluPerbaikan = LOMBA_SAYA.filter((l) => !l.riwayat && l.status === 'perlu-perbaikan').length;

  return (
    <div className={styles.halaman}>
      <header className={styles.kepala}>
        <div>
          <h1 className={styles.judul}>Lomba saya</h1>
          <p className={styles.subjudul}>
            {LOMBA_SAYA.filter((l) => !l.riwayat).length} pendaftaran aktif
            {perluPerbaikan > 0
              ? ` · ${perluPerbaikan} di antaranya perlu kamu perbaiki minggu ini.`
              : '.'}
          </p>
        </div>
        <Link href="/#lomba" className={ui.tombol}>
          Jelajahi cabang lomba
        </Link>
      </header>

      <div className={styles.tab} role="tablist" aria-label="Kelompok pendaftaran">
        <Link
          href={tautan({ ...dasar, tab: '' }, 'tab', 'semua')}
          role="tab"
          aria-selected={tab === 'aktif'}
          data-aktif={tab === 'aktif'}
          className={styles.tabItem}
        >
          Aktif <span className={styles.tabAngka}>{LOMBA_SAYA.filter((l) => !l.riwayat).length}</span>
        </Link>
        <Link
          href={tautan(dasar, 'tab', 'riwayat')}
          role="tab"
          aria-selected={tab === 'riwayat'}
          data-aktif={tab === 'riwayat'}
          className={styles.tabItem}
        >
          Riwayat <span className={styles.tabAngka}>{LOMBA_SAYA.filter((l) => l.riwayat).length}</span>
        </Link>
      </div>

      <div className={styles.filter}>
        <FilterBaris
          label="Status"
          opsi={FILTER_STATUS}
          terpilih={status}
          kunci="status"
          dasar={dasar}
        />
        <FilterBaris label="Jenis" opsi={FILTER_JENIS} terpilih={jenis} kunci="jenis" dasar={dasar} />
        <FilterBaris
          label="Kategori"
          opsi={FILTER_KATEGORI}
          terpilih={kategori}
          kunci="kategori"
          dasar={dasar}
        />

        {jumlahFilter > 0 ? (
          <Link
            href={tab === 'riwayat' ? '/lomba-saya?tab=riwayat' : '/lomba-saya'}
            className={styles.hapusFilter}
          >
            Hapus {jumlahFilter} filter
          </Link>
        ) : null}
      </div>

      <p aria-live="polite" className={styles.jumlah}>
        {daftar.length} pendaftaran ditampilkan
      </p>

      {daftar.length > 0 ? (
        <div className={styles.daftar}>
          {daftar.map((l) => (
            <KartuLombaLengkap key={l.id} lomba={l} />
          ))}
        </div>
      ) : (
        <div className={`${ui.kartu} ${styles.kosong}`}>
          <span aria-hidden="true" className={styles.kosongIkon}>
            <Ikon nama="piala" ukuran={24} />
          </span>
          <h2 className={styles.kosongJudul}>
            {semuaTab.length === 0
              ? tab === 'riwayat'
                ? 'Belum ada riwayat pendaftaran'
                : 'Kamu belum mengikuti lomba apa pun'
              : 'Tidak ada yang cocok dengan filter ini'}
          </h2>
          <p className={styles.kosongTeks}>
            {semuaTab.length === 0
              ? 'Ada 17 cabang olahraga, seni, dan akademik yang bisa kamu ikuti. Buka daftarnya, baca ketentuannya, lalu daftar dari sana.'
              : 'Coba longgarkan salah satu filter, atau hapus semuanya untuk melihat seluruh pendaftaran di tab ini.'}
          </p>
          <Link
            href={semuaTab.length === 0 ? '/#lomba' : tab === 'riwayat' ? '/lomba-saya?tab=riwayat' : '/lomba-saya'}
            className={`${ui.tombol} ${ui.tombolUtama}`}
          >
            {semuaTab.length === 0 ? 'Lihat cabang lomba' : 'Hapus semua filter'}
          </Link>
        </div>
      )}
    </div>
  );
}

function FilterBaris({
  label,
  opsi,
  terpilih,
  kunci,
  dasar,
}: {
  readonly label: string;
  readonly opsi: readonly { readonly nilai: string; readonly label: string }[];
  readonly terpilih: string;
  readonly kunci: string;
  readonly dasar: Record<string, string>;
}) {
  return (
    <div role="group" aria-label={label} className={styles.filterGrup}>
      {opsi.map((o) => (
        <Link
          key={o.nilai}
          href={tautan(dasar, kunci, o.nilai)}
          aria-pressed={terpilih === o.nilai}
          data-terpilih={terpilih === o.nilai}
          className={styles.filterChip}
        >
          {o.label}
        </Link>
      ))}
    </div>
  );
}
