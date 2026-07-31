import type { Metadata } from 'next';
import Link from 'next/link';
import { Ikon } from '@/components/app/Ikon';
import { Lencana } from '@/components/app/Lencana';
import { BilahFilter } from '@/components/admin/BilahFilter';
import { EditorKonten } from '@/components/admin/cms/EditorKonten';
import { KakiTabel } from '@/components/admin/KakiTabel';
import { SelBertingkat, TabelAdmin } from '@/components/admin/TabelAdmin';
import {
  DAFTAR_KONTEN,
  ISI_CONTOH,
  JENIS_KONTEN,
  PERKIRAAN_PENERIMA,
  TOTAL_KONTEN,
  VERSI_KONTEN,
} from '@/data/admin/cms';
import { WAKTU_SERVER_ISO } from '@/data/panitia';
import { bacaKunci, type Query } from '@/lib/admin/query';
import type { StatusKonten } from '@/types/admin';
import type { Nada, NamaIkon } from '@/types/peserta';
import adm from '@/components/admin/adm.module.css';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'CMS · Panitia',
  robots: { index: false, follow: false },
};

const STATUS: Readonly<
  Record<StatusKonten, { readonly label: string; readonly nada: Nada; readonly ikon: NamaIkon }>
> = {
  draf: { label: 'Draf', nada: 'netral', ikon: 'berkas' },
  terjadwal: { label: 'Terjadwal', nada: 'info', ikon: 'jam' },
  tayang: { label: 'Tayang', nada: 'ok', ikon: 'centang' },
};

/**
 * `/admin/cms` — konten portal publik (E4.2).
 *
 * Tiga status dibedakan tegas: draf hanya terlihat panitia, terjadwal punya
 * tanggal terbit yang tertulis di kolom status, tayang sudah dilihat pengunjung.
 * Menyamarkan ketiganya jadi "aktif/tidak aktif" adalah cara paling cepat
 * menerbitkan sesuatu yang belum siap.
 */
export default async function CmsPage({
  searchParams,
}: {
  readonly searchParams: Promise<Query>;
}) {
  const query = await searchParams;

  const jenis = bacaKunci(query, 'jenis', 'semua');
  const status = bacaKunci(query, 'status', 'semua');
  const penulis = bacaKunci(query, 'penulis', 'semua');

  const cocok = DAFTAR_KONTEN.filter(
    (k) =>
      (jenis === 'semua' || k.jenis === jenis) &&
      (status === 'semua' || k.status === status) &&
      (penulis === 'semua' || k.penulis === penulis),
  );

  const hitung = (s: StatusKonten) => DAFTAR_KONTEN.filter((k) => k.status === s).length;
  const daftarPenulis = DAFTAR_KONTEN.map((k) => k.penulis).filter(
    (p, i, arr) => arr.indexOf(p) === i,
  );
  const disunting = DAFTAR_KONTEN.find((k) => k.id === 'cms-tm');

  return (
    <div className={adm.halaman}>
      <header className={styles.kepala}>
        <div className={styles.kepalaTeks}>
          <h1 className={styles.judul}>CMS portal publik</h1>
          <p className={adm.meta}>
            {TOTAL_KONTEN} konten total ·{' '}
            {JENIS_KONTEN.map((j) => `${j.jumlah} ${j.nama.toLowerCase()}`).join(', ')}
          </p>
        </div>

        <div className={styles.kepalaAksi}>
          <Lencana label={`Draf ${hitung('draf')}`} nada="netral" ikon="berkas" />
          <Lencana label={`Terjadwal ${hitung('terjadwal')}`} nada="info" ikon="jam" />
          <Lencana label={`Tayang ${hitung('tayang')}`} nada="ok" ikon="centang" />
          <button type="button" className={`${adm.tombol} ${adm.tombolUtama}`}>
            Tulis pengumuman
          </button>
        </div>
      </header>

      <BilahFilter
        aksi="/admin/cms"
        hrefReset="/admin/cms"
        kolom={[
          {
            nama: 'jenis',
            judul: 'Jenis konten',
            nilai: jenis,
            bawaan: 'semua',
            opsi: [
              { nilai: 'semua', label: 'Semua jenis konten' },
              ...JENIS_KONTEN.map((j) => ({ nilai: j.nama, label: `${j.nama} (${j.jumlah})` })),
            ],
          },
          {
            nama: 'status',
            judul: 'Status',
            nilai: status,
            bawaan: 'semua',
            opsi: [
              { nilai: 'semua', label: 'Semua status' },
              { nilai: 'draf', label: 'Draf' },
              { nilai: 'terjadwal', label: 'Terjadwal' },
              { nilai: 'tayang', label: 'Tayang' },
            ],
          },
          {
            nama: 'penulis',
            judul: 'Penulis',
            nilai: penulis,
            bawaan: 'semua',
            opsi: [
              { nilai: 'semua', label: 'Semua penulis' },
              ...daftarPenulis.map((p) => ({ nilai: p, label: p })),
            ],
          },
        ]}
        catatan="Baris berlatar biru muda dan bergaris kiri biru = terjadwal, dengan tanggal terbit tertulis di kolom status."
      />

      {cocok.length === 0 ? (
        <div className={adm.kosong}>
          <span aria-hidden="true" className={adm.kosongIkon}>
            <Ikon nama="berkas" ukuran={18} />
          </span>
          <p className={adm.kosongJudul}>Belum ada konten pada kombinasi ini</p>
          <p className={adm.kosongTeks}>
            Portal menyembunyikan topik kosong, jadi pengunjung tidak melihat kategori tanpa isi.
            Tulis konten pertama dari keluhan yang paling sering masuk ke sekretariat, atau
            longgarkan filter.
          </p>
          <Link href="/admin/cms" className={adm.tombol}>
            Reset filter
          </Link>
        </div>
      ) : (
        <section className={adm.bagian}>
          <TabelAdmin
            caption="Konten portal publik beserta status penerbitannya"
            minLebar={980}
            kolom={[
              { label: 'Judul' },
              { label: 'Jenis' },
              { label: 'Status', urut: 'naik' },
              { label: 'Versi' },
              { label: 'Penulis' },
              { label: 'Waktu' },
              { label: 'Aksi' },
            ]}
          >
            {cocok.map((k) => {
              const s = STATUS[k.status];

              return (
                <tr key={k.id} data-tanda={k.status === 'terjadwal' ? 'terjadwal' : undefined}>
                  <td>
                    <strong>{k.judul}</strong>
                  </td>
                  <td>{k.jenis}</td>
                  <td>
                    <SelBertingkat
                      utama={<Lencana label={s.label} nada={s.nada} ikon={s.ikon} />}
                      meta={k.jadwalTerbit ?? undefined}
                    />
                  </td>
                  <td>{k.versi}</td>
                  <td>{k.penulis}</td>
                  <td>{k.waktu}</td>
                  <td>
                    <button type="button" className={`${adm.tombol} ${adm.tombolKecil}`}>
                      Sunting
                    </button>
                  </td>
                </tr>
              );
            })}
          </TabelAdmin>

          <KakiTabel
            ringkasan={`Menampilkan ${cocok.length} dari ${DAFTAR_KONTEN.length} konten yang dimuat · ${TOTAL_KONTEN} konten total di portal`}
            catatan="Konten terjadwal yang gagal terbit kembali berstatus terjadwal — bukan tayang — dan tidak ada notifikasi yang terkirim."
          />
        </section>
      )}

      {disunting ? (
        <EditorKonten
          judul={disunting.judul}
          jenis={disunting.jenis}
          versi={disunting.versi}
          statusTeks="draf di atas versi tayang v2 · disimpan otomatis 09.42"
          isiAwal={ISI_CONTOH}
          jadwalTerbit={disunting.jadwalTerbit}
          perkiraanPenerima={PERKIRAAN_PENERIMA}
          waktuServerIso={WAKTU_SERVER_ISO}
        />
      ) : null}

      <section className={adm.kartu}>
        <div className={adm.kartuKepala}>
          <h2 className={adm.kartuJudul}>Riwayat versi</h2>
          <span className={adm.eyebrow}>{VERSI_KONTEN.length} versi</span>
        </div>

        <ul className={styles.versiDaftar}>
          {VERSI_KONTEN.map((v) => (
            <li key={v.id} data-keadaan={v.keadaan} className={styles.versi}>
              <div>
                <p className={styles.versiLabel}>{v.label}</p>
                <p className={adm.catatan}>
                  {v.oleh} · {v.waktu} · {v.notifikasi}
                </p>
              </div>

              {v.keadaan === 'disunting' ? (
                <span className={adm.catatan}>Sedang disunting</span>
              ) : (
                <button type="button" className={`${adm.tombol} ${adm.tombolKecil}`}>
                  {v.keadaan === 'tayang' ? 'Bandingkan' : 'Pulihkan'}
                </button>
              )}
            </li>
          ))}
        </ul>

        <p className={adm.catatan}>
          Memulihkan versi lama membuat draf baru, tidak menimpa yang sedang tayang. Versi yang
          pernah terbit tidak bisa dihapus.
        </p>
      </section>
    </div>
  );
}
