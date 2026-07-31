import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Ikon } from '@/components/app/Ikon';
import { Lencana } from '@/components/app/Lencana';
import { TabelAdmin } from '@/components/admin/TabelAdmin';
import { DETAIL_PESERTA } from '@/data/admin/peserta';
import { formatWaktu } from '@/lib/admin/format';
import { punyaIzin } from '@/lib/admin/izin';
import { bacaSesiPanitia } from '@/lib/admin/sesi';
import type { KeadaanBerkas, StatusAkunPeserta } from '@/types/admin';
import type { Nada, NamaIkon } from '@/types/peserta';
import adm from '@/components/admin/adm.module.css';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Detail peserta · Panitia',
  robots: { index: false, follow: false },
};

const STATUS_AKUN: Readonly<Record<StatusAkunPeserta, { readonly label: string; readonly nada: Nada }>> =
  {
    aktif: { label: 'Akun aktif', nada: 'ok' },
    'belum-verifikasi-email': { label: 'Belum verifikasi email', nada: 'warn' },
    nonaktif: { label: 'Nonaktif atas permintaan', nada: 'netral' },
  };

const KEADAAN_BERKAS: Readonly<
  Record<KeadaanBerkas, { readonly nada: Nada; readonly ikon: NamaIkon }>
> = {
  menunggu: { nada: 'warn', ikon: 'jam' },
  disetujui: { nada: 'ok', ikon: 'centang' },
  ditolak: { nada: 'danger', ikon: 'silang' },
  'belum-diunggah': { nada: 'netral', ikon: 'berkas' },
};

/**
 * `/admin/peserta/[pesertaId]` — detail satu peserta (E1.1b).
 *
 * Dua hal yang menentukan bentuk halaman ini:
 *
 * 1. Tombol pratinjau dokumen TIDAK DIRENDER untuk peran tanpa
 *    `verification.decide` — bukan dirender lalu dinonaktifkan. Tombol mati
 *    tetap mengumumkan bahwa jalur itu ada dan mengundang percobaan; yang hilang
 *    juga kolom aksinya, bukan kolom kosong (FE-ADMIN-002).
 *
 * 2. Lomba di luar cakupan peran disebut JUMLAHNYA, bukan isinya. Menyembunyikan
 *    sepenuhnya membuat panitia mengira daftar ini lengkap; menampilkan isinya
 *    membocorkan keikutsertaan di lomba yang bukan wewenangnya.
 */
export default async function DetailPesertaPage({
  params,
}: {
  readonly params: Promise<{ readonly pesertaId: string }>;
}) {
  const { pesertaId } = await params;
  const peserta = DETAIL_PESERTA[pesertaId];
  if (!peserta) notFound();

  const sesi = await bacaSesiPanitia();
  const bolehPratinjau = punyaIzin(sesi, 'verification.decide');
  const status = STATUS_AKUN[peserta.statusAkun];

  return (
    <div className={adm.halaman}>
      <header className={styles.kepala}>
        <div className={styles.identitas}>
          <span aria-hidden="true" className={styles.avatar}>
            {peserta.inisial}
          </span>
          <div className={styles.identitasTeks}>
            <div className={styles.namaBaris}>
              <h1 className={styles.nama}>{peserta.nama}</h1>
              <Lencana label={status.label} nada={status.nada} />
            </div>
            <p className={adm.meta}>
              <span className={adm.mono}>{peserta.idTermasking}</span> · {peserta.kategori} ·{' '}
              {peserta.institusi} · terdaftar {formatWaktu(peserta.terdaftarIso)}
            </p>
          </div>
        </div>

        <div className={adm.barisAksi}>
          <Link href="/admin/peserta" className={adm.tombol}>
            Kembali ke daftar
          </Link>
          {bolehPratinjau ? (
            <Link href="/admin/verifikasi" className={`${adm.tombol} ${adm.tombolUtama}`}>
              Buka di antrean verifikasi
            </Link>
          ) : null}
        </div>
      </header>

      <div className={`${adm.duaLajur} ${adm.duaLajurSeimbang}`}>
        <section className={adm.kartu}>
          <div className={adm.kartuKepala}>
            <h2 className={adm.kartuJudul}>Identitas</h2>
            <span className={adm.eyebrow}>Termasking</span>
          </div>

          <dl className={adm.rincian}>
            {peserta.identitas.map((i) => (
              <div key={i.label} className={adm.rincianBaris}>
                <dt className={adm.rincianLabel}>{i.label}</dt>
                <dd className={`${adm.rincianNilai} ${adm.mono}`}>{i.nilai}</dd>
              </div>
            ))}
          </dl>

          <p className={adm.catatan}>
            NIK penuh hanya terbuka di layar keputusan verifikasi, lewat tombol “Tampilkan NIK untuk
            pencocokan” yang mencatat siapa membukanya dan kapan. Ekspor standar tetap termasking.
          </p>
        </section>

        <section className={adm.kartu}>
          <div className={adm.kartuKepala}>
            <h2 className={adm.kartuJudul}>Status dokumen</h2>
            <span className={adm.eyebrow}>{peserta.berkas.length} berkas</span>
          </div>

          <ul className={styles.berkasDaftar}>
            {peserta.berkas.map((b) => {
              const keadaan = KEADAAN_BERKAS[b.keadaan];

              return (
                <li key={b.id} className={styles.berkas}>
                  <div className={styles.berkasTeks}>
                    <p className={styles.berkasJenis}>{b.jenis}</p>
                    <p className={adm.catatan}>{b.riwayat}</p>
                  </div>

                  <Lencana label={b.keterangan} nada={keadaan.nada} ikon={keadaan.ikon} />

                  {bolehPratinjau && b.hrefPratinjau ? (
                    <Link href={b.hrefPratinjau} className={`${adm.tombol} ${adm.tombolKecil}`}>
                      Pratinjau
                    </Link>
                  ) : null}
                </li>
              );
            })}
          </ul>

          <p className={adm.catatan}>
            {bolehPratinjau
              ? 'Pratinjau memakai tautan bertanda tangan berumur 5 menit dan tidak bisa dibagikan. Setiap pembukaan tercatat di audit log.'
              : `Peranmu (${sesi.peran}) tidak berwenang membuka isi dokumen, jadi tombol pratinjau tidak ada di sini. Yang terlihat hanya status berkasnya.`}
          </p>
        </section>
      </div>

      <section className={adm.bagian}>
        <div className={adm.bagianKepala}>
          <h2 className={adm.judulBagian}>Riwayat pendaftaran lintas lomba</h2>
        </div>

        <TabelAdmin
          caption="Pendaftaran peserta ini pada lomba dalam cakupan peranmu"
          minLebar={560}
          kolom={[
            { label: 'Lomba' },
            { label: 'Tim' },
            { label: 'Peran' },
            { label: 'Status' },
          ]}
        >
          {peserta.pendaftaran.map((p) => (
            <tr key={p.id}>
              <td>{p.lomba}</td>
              <td>{p.tim}</td>
              <td>{p.peran}</td>
              <td>
                <Lencana label={p.status} nada={p.nada} />
              </td>
            </tr>
          ))}
        </TabelAdmin>

        <p className={adm.catatan}>
          {peserta.lombaDiLuarCakupan > 0
            ? `Hanya lomba dalam cakupanmu yang dirender. Peserta ini juga terdaftar di ${peserta.lombaDiLuarCakupan} lomba di luar cakupanmu — jumlahnya disebut, isinya tidak.`
            : 'Seluruh pendaftaran peserta ini berada dalam cakupan peranmu.'}
        </p>
      </section>

      <section className={adm.kartu}>
        <div className={adm.kartuKepala}>
          <h2 className={adm.kartuJudul}>Jejak aktivitas</h2>
          <span className={adm.eyebrow}>Terbaru di atas</span>
        </div>

        <ol className={styles.jejak}>
          {peserta.aktivitas.map((a) => (
            <li key={a.id} className={styles.jejakItem}>
              <span aria-hidden="true" className={styles.jejakTitik}>
                <Ikon nama="titik" ukuran={12} tebal={2.4} />
              </span>
              <div>
                <p className={styles.jejakJudul}>{a.judul}</p>
                <p className={adm.catatan}>{a.meta}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
