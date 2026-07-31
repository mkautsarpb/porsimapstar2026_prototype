import type { Metadata } from 'next';
import Link from 'next/link';
import { Ikon } from '@/components/app/Ikon';
import { Lencana } from '@/components/app/Lencana';
import { BilahFilter } from '@/components/admin/BilahFilter';
import { KakiTabel } from '@/components/admin/KakiTabel';
import { MeterKuota } from '@/components/admin/MeterKuota';
import { StripAngka } from '@/components/admin/StripAngka';
import { SelBertingkat, TabelAdmin } from '@/components/admin/TabelAdmin';
import { DAFTAR_CABANG, TENGGAT_PENDAFTARAN_ISO } from '@/data/admin/lomba';
import { WAKTU_SERVER_ISO } from '@/data/panitia';
import { formatTanggal, formatUmur } from '@/lib/admin/format';
import { hitungUmurDetik } from '@/lib/admin/kebasian';
import { bacaKunci, type Query } from '@/lib/admin/query';
import type { StatusPendaftaranCabang } from '@/types/admin';
import type { Nada, NamaIkon } from '@/types/peserta';
import adm from '@/components/admin/adm.module.css';

export const metadata: Metadata = {
  title: 'Lomba · Panitia',
  robots: { index: false, follow: false },
};

const STATUS: Readonly<
  Record<
    StatusPendaftaranCabang,
    { readonly label: string; readonly nada: Nada; readonly ikon: NamaIkon }
  >
> = {
  buka: { label: 'Buka', nada: 'ok', ikon: 'centang' },
  penuh: { label: 'Tutup otomatis · penuh', nada: 'netral', ikon: 'silang' },
  'daftar-tunggu': { label: 'Daftar tunggu', nada: 'warn', ikon: 'jam' },
  tutup: { label: 'Tutup', nada: 'netral', ikon: 'silang' },
};

const OPSI_KATEGORI = [
  { nilai: 'semua', label: 'Semua kategori' },
  { nilai: 'Olahraga', label: 'Olahraga' },
  { nilai: 'Non-olahraga', label: 'Non-olahraga' },
];

const OPSI_TIPE = [
  { nilai: 'semua', label: 'Semua tipe' },
  { nilai: 'Tim', label: 'Tim' },
  { nilai: 'Individu', label: 'Individu' },
];

const OPSI_STATUS = [
  { nilai: 'semua', label: 'Semua status kuota' },
  { nilai: 'buka', label: 'Buka' },
  { nilai: 'penuh', label: 'Penuh' },
  { nilai: 'daftar-tunggu', label: 'Daftar tunggu' },
];

/**
 * `/admin/lomba` — daftar cabang dan keadaan kuotanya (E2.1a).
 *
 * Kolom kuota menyebut satuannya di setiap baris, bukan sekali di kepala tabel.
 * Tabel ini dibaca dengan mata melompat antar baris, dan cabang tim berjajar
 * dengan cabang individu — tanpa satuan per baris, "120 dari 120" pada Esai
 * Kebangsaan mudah dibaca sebagai 120 tim.
 */
export default async function DaftarLombaPage({
  searchParams,
}: {
  readonly searchParams: Promise<Query>;
}) {
  const query = await searchParams;

  const kategori = bacaKunci(query, 'kategori', 'semua');
  const tipe = bacaKunci(query, 'tipe', 'semua');
  const status = bacaKunci(query, 'status', 'semua');

  const cocok = DAFTAR_CABANG.filter(
    (c) =>
      (kategori === 'semua' || c.kategori === kategori) &&
      (tipe === 'semua' || c.tipe === tipe) &&
      (status === 'semua' || c.status === status),
  );

  const penuh = DAFTAR_CABANG.filter((c) => c.kuota.terisi >= (c.kuota.kapasitas ?? Infinity));
  const denganTunggu = DAFTAR_CABANG.filter((c) => c.kuota.daftarTunggu > 0);
  const totalMenunggu = denganTunggu.reduce((n, c) => n + c.kuota.daftarTunggu, 0);
  const sisaTenggat = hitungUmurDetik(TENGGAT_PENDAFTARAN_ISO, WAKTU_SERVER_ISO);

  return (
    <div className={adm.halaman}>
      <StripAngka
        angka={[
          {
            id: 'cabang',
            nilai: String(DAFTAR_CABANG.length),
            label: 'cabang dalam cakupanmu',
          },
          {
            id: 'penuh',
            nilai: String(penuh.length),
            label: `kapasitas penuh · ${DAFTAR_CABANG.filter((c) => c.status === 'penuh').length} tertutup otomatis`,
            nada: penuh.length > 0 ? 'warn' : undefined,
          },
          {
            id: 'tunggu',
            nilai: String(denganTunggu.length),
            label: `daftar tunggu aktif · ${totalMenunggu} pendaftaran menunggu`,
            nada: denganTunggu.length > 0 ? 'info' : undefined,
          },
          {
            id: 'tenggat',
            nilai: formatTanggal(TENGGAT_PENDAFTARAN_ISO),
            label: `tenggat pendaftaran seluruh cabang · ${sisaTenggat !== null ? formatUmur(sisaTenggat) : '—'} lagi`,
          },
        ]}
      />

      <BilahFilter
        aksi="/admin/lomba"
        hrefReset="/admin/lomba"
        kolom={[
          {
            nama: 'kategori',
            judul: 'Kategori',
            nilai: kategori,
            bawaan: 'semua',
            opsi: OPSI_KATEGORI,
          },
          { nama: 'tipe', judul: 'Tipe', nilai: tipe, bawaan: 'semua', opsi: OPSI_TIPE },
          {
            nama: 'status',
            judul: 'Status kuota',
            nilai: status,
            bawaan: 'semua',
            opsi: OPSI_STATUS,
          },
        ]}
        catatan="Kolom “kuota terisi” menyebut satuannya: tim untuk cabang tim, peserta untuk cabang individu."
      />

      {cocok.length === 0 ? (
        <div className={adm.kosong}>
          <span aria-hidden="true" className={adm.kosongIkon}>
            <Ikon nama="piala" ukuran={18} />
          </span>
          <p className={adm.kosongJudul}>Tidak ada cabang yang cocok</p>
          <p className={adm.kosongTeks}>
            Kombinasi kategori, tipe, dan status kuota di atas tidak menghasilkan cabang apa pun
            dalam cakupanmu. Longgarkan salah satu filter.
          </p>
          <Link href="/admin/lomba" className={adm.tombol}>
            Reset filter
          </Link>
        </div>
      ) : (
        <>
          <TabelAdmin
            caption="Cabang lomba dalam cakupan peran, beserta keterisian kuotanya"
            minLebar={980}
            kolom={[
              { label: 'Cabang', urut: 'naik' },
              { label: 'Kategori' },
              { label: 'Tipe' },
              { label: 'Kuota terisi' },
              { label: 'Status' },
              { label: 'Tenggat' },
              { label: 'PIC' },
              { label: 'Aksi' },
            ]}
          >
            {cocok.map((c) => {
              const s = STATUS[c.status];
              const sisa = hitungUmurDetik(c.tenggatIso, WAKTU_SERVER_ISO);

              return (
                <tr key={c.id}>
                  <td>
                    <strong>{c.nama}</strong>
                  </td>
                  <td>{c.kategori}</td>
                  <td>{c.tipe}</td>
                  <td>
                    <MeterKuota kuota={c.kuota} />
                  </td>
                  <td>
                    <Lencana label={s.label} nada={s.nada} ikon={s.ikon} />
                  </td>
                  <td>
                    <SelBertingkat
                      utama={formatTanggal(c.tenggatIso)}
                      meta={sisa !== null ? `${formatUmur(sisa)} lagi` : undefined}
                    />
                  </td>
                  <td>{c.pic}</td>
                  <td>
                    <Link href={`/admin/lomba/${c.id}`} className={adm.tautan}>
                      Atur
                      <Ikon nama="panah" ukuran={12} tebal={2.4} />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </TabelAdmin>

          <KakiTabel
            ringkasan={`Menampilkan ${cocok.length} dari ${DAFTAR_CABANG.length} cabang dalam cakupanmu · satu halaman`}
            catatan="Cabang tertutup otomatis begitu kapasitas terisi penuh, meski status pendaftarannya masih “Buka”. Menambah kapasitas membuka pendaftaran lagi sampai tenggat."
          />
        </>
      )}
    </div>
  );
}
