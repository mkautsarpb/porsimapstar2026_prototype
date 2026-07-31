import type { Metadata } from 'next';
import Link from 'next/link';
import { Ikon } from '@/components/app/Ikon';
import { Lencana } from '@/components/app/Lencana';
import { KakiTabel } from '@/components/admin/KakiTabel';
import { PapanWaktu } from '@/components/admin/jadwal/PapanWaktu';
import { TombolPublikasi } from '@/components/admin/jadwal/TombolPublikasi';
import { TabelAdmin } from '@/components/admin/TabelAdmin';
import {
  BENTROK_JADWAL,
  JAM_PAPAN,
  RINGKAS_PUBLIKASI,
  SESI_JADWAL,
  TANGGAL_PAPAN,
  TOTAL_PENERIMA,
  VENUE_PAPAN,
  VERSI_JADWAL,
} from '@/data/admin/jadwal';
import { WAKTU_SERVER_ISO } from '@/data/panitia';
import { formatTanggal } from '@/lib/admin/format';
import { bacaEnum, susunHref, type Query } from '@/lib/admin/query';
import adm from '@/components/admin/adm.module.css';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Jadwal · Panitia',
  robots: { index: false, follow: false },
};

const TAMPILAN = ['papan', 'daftar'] as const;

/**
 * `/admin/jadwal` — penyusunan jadwal per venue (E2.2a–c).
 *
 * Dua tampilan atas data yang sama: papan waktu untuk melihat tabrakan, daftar
 * untuk menyunting banyak sesi sekaligus. Pilihannya hidup di URL supaya bisa
 * dibagikan antar panitia dan tetap sama saat kembali dari halaman lain.
 *
 * Publikasi terkunci selama masih ada bentrok. Itu bukan sekadar UX: jadwal
 * terbit memicu notifikasi ke ratusan orang, dan menariknya kembali membutuhkan
 * versi baru yang memicu gelombang notifikasi lagi.
 */
export default async function JadwalPage({
  searchParams,
}: {
  readonly searchParams: Promise<Query>;
}) {
  const query = await searchParams;
  const tampilan = bacaEnum(query, 'tampilan', TAMPILAN, 'papan');

  const jumlahBentrok = BENTROK_JADWAL.length;
  const sesiBentrok = SESI_JADWAL.filter((s) => s.jumlahBentrok > 0).length;
  const draf = VERSI_JADWAL.find((v) => v.draf);

  return (
    <div className={adm.halaman}>
      <header className={styles.kepala}>
        <div className={styles.kepalaTeks}>
          <h1 className={styles.judul}>Jadwal · AKPOL</h1>
          <p className={adm.meta}>
            {draf ? `Draf ${draf.label.replace(' · draf', '')} · ada perubahan belum dipublikasikan` : 'Seluruh perubahan sudah terbit'}{' '}
            · papan menampilkan {formatTanggal(TANGGAL_PAPAN)}
          </p>
        </div>

        <div className={styles.kepalaAksi}>
          <Lencana
            label={`${jumlahBentrok} bentrok harus diselesaikan`}
            nada={jumlahBentrok > 0 ? 'danger' : 'ok'}
            ikon={jumlahBentrok > 0 ? 'seru' : 'centang'}
          />

          <TombolPublikasi
            jumlahBentrok={jumlahBentrok}
            versiBaru={RINGKAS_PUBLIKASI.versiBaru}
            rentangTanggal="AKPOL · 26–29 Oktober 2026"
            dariVersi={`${RINGKAS_PUBLIKASI.versiLama} (${RINGKAS_PUBLIKASI.terbitLama})`}
            totalPenerima={TOTAL_PENERIMA}
            waktuServerIso={WAKTU_SERVER_ISO}
            dampak={[
              {
                label: 'Jumlah sesi',
                nilai: `${RINGKAS_PUBLIKASI.sesiSebelum} → ${RINGKAS_PUBLIKASI.sesiSesudah} sesi`,
              },
              { label: 'Sesi berubah waktu', nilai: `${RINGKAS_PUBLIKASI.waktuBerubah} sesi` },
              { label: 'Sesi berubah venue', nilai: `${RINGKAS_PUBLIKASI.venueBerubah} sesi` },
              { label: 'Sesi baru', nilai: `${RINGKAS_PUBLIKASI.sesiBaru} sesi` },
              {
                label: 'Peserta pada sesi terdampak',
                nilai: `${RINGKAS_PUBLIKASI.penerima.peserta} orang`,
              },
              {
                label: 'Wasit & juri bertugas',
                nilai: `${RINGKAS_PUBLIKASI.penerima.ofisial} orang`,
              },
              { label: 'PIC cabang terdampak', nilai: `${RINGKAS_PUBLIKASI.penerima.pic} orang` },
              { label: 'Bentrok tersisa', nilai: `${jumlahBentrok}` },
            ]}
          />
        </div>
      </header>

      <div className={styles.bilah}>
        <nav aria-label="Pengalih tampilan jadwal" className={styles.pengalih}>
          <Link
            href={susunHref('/admin/jadwal', query, { tampilan: 'papan' })}
            aria-current={tampilan === 'papan' ? 'page' : undefined}
            data-aktif={tampilan === 'papan'}
            className={styles.pengalihItem}
          >
            Papan waktu
          </Link>
          <Link
            href={susunHref('/admin/jadwal', query, { tampilan: 'daftar' })}
            aria-current={tampilan === 'daftar' ? 'page' : undefined}
            data-aktif={tampilan === 'daftar'}
            className={styles.pengalihItem}
          >
            Daftar
          </Link>
        </nav>

        <p className={adm.catatan}>
          {SESI_JADWAL.length} sesi · {formatTanggal(TANGGAL_PAPAN)} · {VENUE_PAPAN.length} venue ·{' '}
          {sesiBentrok} sesi terlibat dalam {jumlahBentrok} bentrok
        </p>
      </div>

      <div className={adm.duaLajur}>
        {tampilan === 'papan' ? (
          <PapanWaktu
            sesi={SESI_JADWAL}
            venue={VENUE_PAPAN}
            jamMulai={JAM_PAPAN.mulai}
            jamSelesai={JAM_PAPAN.selesai}
          />
        ) : (
          <div className={adm.bagian}>
            <TabelAdmin
              caption="Seluruh sesi pada hari yang dipilih, diurutkan dari jam mulai"
              minLebar={900}
              kolom={[
                { label: 'Mulai', urut: 'naik' },
                { label: 'Selesai' },
                { label: 'Cabang & sesi' },
                { label: 'Venue' },
                { label: 'Wasit / juri' },
                { label: 'Status' },
                { label: 'Aksi' },
              ]}
            >
              {SESI_JADWAL.map((s) => (
                <tr key={s.id} data-tanda={s.jumlahBentrok > 0 ? 'terlambat' : undefined}>
                  <td>{s.mulai}</td>
                  <td>{s.selesai}</td>
                  <td>
                    {s.cabang} · {s.babak}
                  </td>
                  <td>{s.venue}</td>
                  <td>{s.ofisial ?? <span className={adm.catatan}>Belum ditugaskan</span>}</td>
                  <td>
                    <Lencana
                      label={s.jumlahBentrok > 0 ? `${s.jumlahBentrok} bentrok` : 'Tanpa bentrok'}
                      nada={s.jumlahBentrok > 0 ? 'danger' : 'ok'}
                      ikon={s.jumlahBentrok > 0 ? 'seru' : 'centang'}
                    />
                  </td>
                  <td>
                    <span className={adm.catatan}>Sunting</span>
                  </td>
                </tr>
              ))}
            </TabelAdmin>

            <KakiTabel
              ringkasan={`${SESI_JADWAL.length} sesi · ${sesiBentrok} sesi terlibat dalam ${jumlahBentrok} bentrok`}
              catatan="Kolom status menyebut jumlah bentrok per sesi, bukan tanda merah tanpa keterangan. Sesi di luar rentang papan waktu hanya terlihat di tampilan daftar ini."
            />
          </div>
        )}

        <aside className={styles.panelBentrok}>
          <div className={styles.bentrokKepala}>
            <h2 className={adm.kartuJudul}>Panel bentrok</h2>
            <Lencana
              label={`${jumlahBentrok} bentrok`}
              nada={jumlahBentrok > 0 ? 'danger' : 'ok'}
              ikon={jumlahBentrok > 0 ? 'seru' : 'centang'}
            />
          </div>

          {jumlahBentrok === 0 ? (
            <div className={adm.kosong}>
              <span aria-hidden="true" className={adm.kosongIkon}>
                <Ikon nama="centang" ukuran={18} />
              </span>
              <p className={adm.kosongJudul}>Tidak ada bentrok tersisa</p>
              <p className={adm.kosongTeks}>
                Susunan hari ini bisa dijalankan: tidak ada venue yang dipakai bersamaan, tidak ada
                peserta di dua tempat, dan tidak ada wasit bertugas ganda.
              </p>
            </div>
          ) : (
            <>
              <p className={adm.catatan}>
                Publikasi terkunci sampai ketiganya selesai. Setiap bentrok menyebut siapa dan
                kapan, supaya bisa langsung ditindak.
              </p>

              <ul className={styles.bentrokDaftar}>
                {BENTROK_JADWAL.map((b) => (
                  <li key={b.id} className={styles.bentrok}>
                    <div className={styles.bentrokBaris}>
                      <p className={adm.eyebrow}>{b.judul}</p>
                      <span className={styles.tumpang}>{b.tumpangTindih}</span>
                    </div>
                    <p className={styles.bentrokSubjek}>{b.subjek}</p>
                    <p className={adm.catatan}>{b.rincian}</p>
                    <div className={adm.barisAksi}>
                      {b.saran.map((s) => (
                        <button key={s} type="button" className={`${adm.tombol} ${adm.tombolKecil}`}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>

              <p className={adm.catatan}>
                Pemeriksaan bentrok dijalankan ulang di server setiap kali sesi digeser. Bentrok yang
                sudah selesai hilang dari panel, bukan ditandai hijau — daftar ini selalu berisi
                pekerjaan yang tersisa.
              </p>
            </>
          )}
        </aside>
      </div>

      <section className={adm.bagian}>
        <div className={adm.bagianKepala}>
          <h2 className={adm.judulBagian}>Riwayat versi jadwal</h2>
          <p className={adm.catatan}>
            {VERSI_JADWAL.filter((v) => !v.draf).length} versi terbit, {VERSI_JADWAL.filter((v) => v.draf).length}{' '}
            draf berjalan
          </p>
        </div>

        <TabelAdmin
          caption="Riwayat versi jadwal yang pernah diterbitkan, terbaru di atas"
          minLebar={720}
          kolom={[
            { label: 'Versi' },
            { label: 'Diterbitkan' },
            { label: 'Perubahan' },
            { label: 'Notifikasi' },
          ]}
        >
          {VERSI_JADWAL.map((v) => (
            <tr key={v.id} data-tanda={v.draf ? 'terjadwal' : undefined}>
              <td>
                <strong>{v.label}</strong>
              </td>
              <td>{v.diterbitkan}</td>
              <td>{v.perubahan}</td>
              <td>{v.notifikasi}</td>
            </tr>
          ))}
        </TabelAdmin>

        <p className={adm.catatan}>
          Setiap versi bisa dibandingkan dengan versi sebelumnya. Versi terbit tidak bisa dihapus
          atau diubah. Draf {RINGKAS_PUBLIKASI.versiBaru} tersimpan sejak {RINGKAS_PUBLIKASI.drafSejak}{' '}
          dan belum memicu notifikasi apa pun — peserta masih melihat versi{' '}
          {RINGKAS_PUBLIKASI.versiLama}.
        </p>
      </section>
    </div>
  );
}
