import type { Metadata } from 'next';
import Link from 'next/link';
import { Ikon } from '@/components/app/Ikon';
import { Lencana } from '@/components/app/Lencana';
import { Pemindai } from '@/components/admin/check-in/Pemindai';
import { DaftarBar } from '@/components/admin/DaftarBar';
import { StripAngka } from '@/components/admin/StripAngka';
import { TabelAdmin } from '@/components/admin/TabelAdmin';
import {
  ALASAN_MANUAL,
  KODE_ALASAN,
  LAJU_PETUGAS,
  LAJU_VENUE,
  PINDAI_TERAKHIR,
  RINGKAS_HARI_INI,
  TOTAL_PINDAI,
} from '@/data/admin/check-in';
import { punyaIzin } from '@/lib/admin/izin';
import { bacaEnum, susunHref, type Query } from '@/lib/admin/query';
import { bacaSesiPanitia } from '@/lib/admin/sesi';
import type { HasilPindai } from '@/types/admin';
import type { Nada, NamaIkon } from '@/types/peserta';
import adm from '@/components/admin/adm.module.css';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Check-in · Panitia',
  robots: { index: false, follow: false },
};

const TAMPILAN = ['monitoring', 'pindai'] as const;

const HASIL: Readonly<
  Record<HasilPindai, { readonly label: string; readonly nada: Nada; readonly ikon: NamaIkon }>
> = {
  berhasil: { label: 'Berhasil', nada: 'ok', ikon: 'centang' },
  duplikat: { label: 'Duplikat', nada: 'warn', ikon: 'ulang' },
  ditolak: { label: 'Ditolak', nada: 'danger', ikon: 'silang' },
  manual: { label: 'Berhasil · manual', nada: 'info', ikon: 'orang' },
};

/**
 * `/admin/check-in` — monitoring hari-H dan pemindai petugas (E3.2a–c).
 *
 * Seluruh angka di halaman ini SELALU hari berjalan dan mengabaikan filter
 * rentang tanggal. Itu disebut di layar, bukan disimpan sebagai asumsi: halaman
 * lain di panel yang sama menghormati filter periode, jadi tanpa kalimat itu
 * "412 berhasil" mudah dibaca sebagai total sepanjang event.
 *
 * Kolom alasan pada tabel hanya kode, tanpa data pribadi — sama seperti pada
 * layar petugas, karena layar monitoring dipasang di ruang kendali yang dilewati
 * banyak orang (agents.md §6).
 */
export default async function CheckInPage({
  searchParams,
}: {
  readonly searchParams: Promise<Query>;
}) {
  const query = await searchParams;
  const sesi = await bacaSesiPanitia();
  const tampilan = bacaEnum(query, 'tampilan', TAMPILAN, 'monitoring');

  // Kode manual melewati pemindaian QR, jadi ia jalur yang harus dibatasi —
  // di SRS §14.2 hanya petugas senior. Peran lain tidak melihat tombolnya sama
  // sekali, bukan melihat tombol yang dimatikan (FE-ADMIN-002).
  const bolehKodeManual = punyaIzin(sesi, 'user.manage');

  return (
    <div className={adm.halaman}>
      <header className={styles.kepala}>
        <div className={styles.kepalaTeks}>
          <h1 className={styles.judul}>Monitoring check-in</h1>
          <p className={adm.meta}>
            Selasa, 27 Oktober 2026 · 13.42 WIB · diperbarui 20 detik lalu
          </p>
        </div>

        <div className={styles.kepalaAksi}>
          <Lencana
            label={`${RINGKAS_HARI_INI.perangkatDaring} dari ${RINGKAS_HARI_INI.perangkatTotal} perangkat petugas daring`}
            nada={
              RINGKAS_HARI_INI.perangkatDaring === RINGKAS_HARI_INI.perangkatTotal ? 'ok' : 'warn'
            }
            ikon="centang"
          />

          <nav aria-label="Pengalih tampilan check-in" className={styles.pengalih}>
            <Link
              href={susunHref('/admin/check-in', query, { tampilan: 'monitoring' })}
              aria-current={tampilan === 'monitoring' ? 'page' : undefined}
              data-aktif={tampilan === 'monitoring'}
              className={styles.pengalihItem}
            >
              Monitoring
            </Link>
            <Link
              href={susunHref('/admin/check-in', query, { tampilan: 'pindai' })}
              aria-current={tampilan === 'pindai' ? 'page' : undefined}
              data-aktif={tampilan === 'pindai'}
              className={styles.pengalihItem}
            >
              Pemindai petugas
            </Link>
          </nav>
        </div>
      </header>

      <div className={`${adm.panel} ${adm.panelNetral}`}>
        <span aria-hidden="true" className={adm.panelIkon}>
          <Ikon nama="bantuan" ukuran={16} tebal={2.2} />
        </span>
        <p className={adm.panelTeks}>
          Seluruh widget di halaman ini mengabaikan filter rentang tanggal dan selalu menampilkan
          hari berjalan.
        </p>
      </div>

      {tampilan === 'pindai' ? (
        <section className={styles.pindaiBagian}>
          <Pemindai
            cabang="Basket Putra"
            venue="GOR AKPOL"
            jam="13.42"
            bolehKodeManual={bolehKodeManual}
            kodeAlasan={KODE_ALASAN}
            ringkas={{
              berhasil: 128,
              duplikat: 6,
              ditolak: 3,
            }}
          />

          <div className={styles.pindaiCatatan}>
            <div className={adm.kartu}>
              <h2 className={adm.kartuJudul}>Jalur kode manual</h2>
              <p className={adm.teks}>
                {bolehKodeManual
                  ? 'Peranmu berwenang memakai kode manual. Setiap pemakaian tercatat dengan namamu, waktu, dan alasannya, dan panitia memantau jumlah check-in manual per petugas di layar monitoring.'
                  : 'Peranmu tidak berwenang memakai kode manual, jadi tombolnya tidak dirender sama sekali — bukan versi nonaktif. Yang tersisa hanya jalur yang memang boleh ditempuh.'}
              </p>

              <p className={adm.eyebrow}>Alasan yang bisa dipilih</p>
              <ul className={styles.alasanDaftar}>
                {ALASAN_MANUAL.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>

              <p className={adm.catatan}>
                Kode peserta pada kartu bukan NIK dan bukan nomor telepon. Konfirmasi tambahan
                mengharuskan petugas menyatakan sudah mencocokkan wajah peserta dengan identitas
                asli.
              </p>
            </div>

            <div className={adm.kartu}>
              <h2 className={adm.kartuJudul}>Kode alasan penolakan</h2>
              <p className={adm.teks}>
                Keadaan ditolak hanya menampilkan kode — tidak ada nama, ID, atau data pribadi.
                Arahkan peserta ke meja informasi dengan menyebut kodenya.
              </p>
              <ul className={styles.kodeDaftar}>
                {KODE_ALASAN.map((k) => (
                  <li key={k.kode} className={styles.kode}>
                    <span className={adm.mono}>{k.kode}</span>
                    <span>{k.arti}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ) : (
        <>
          <StripAngka
            angka={[
              {
                id: 'laju',
                nilai: String(RINGKAS_HARI_INI.lajuLimaMenit),
                label: `pindai / 5 menit · setara ${(RINGKAS_HARI_INI.lajuLimaMenit / 5).toFixed(1)} per menit di ${LAJU_VENUE.length} venue`,
              },
              {
                id: 'antrean',
                nilai: String(RINGKAS_HARI_INI.antreanDiMeja),
                label: `orang menunggu di meja · terpanjang ${RINGKAS_HARI_INI.antreanTerpanjang}`,
                nada: 'warn',
              },
              {
                id: 'hasil',
                nilai: `${RINGKAS_HARI_INI.berhasil} · ${RINGKAS_HARI_INI.duplikat} · ${RINGKAS_HARI_INI.ditolak}`,
                label: `berhasil · duplikat · ditolak · total ${TOTAL_PINDAI} pindaian hari ini`,
              },
              {
                id: 'manual',
                nilai: String(RINGKAS_HARI_INI.manual),
                label: `check-in manual dari ${RINGKAS_HARI_INI.berhasil} berhasil · terbanyak ${RINGKAS_HARI_INI.petugasManualTerbanyak}`,
                nada: 'info',
              },
            ]}
          />

          <div className={`${adm.duaLajur} ${adm.duaLajurSeimbang}`}>
            <section className={adm.kartu}>
              <div className={adm.kartuKepala}>
                <h2 className={adm.kartuJudul}>Laju per venue</h2>
                <span className={adm.eyebrow}>pindai per 5 menit</span>
              </div>
              <DaftarBar baris={LAJU_VENUE} satuan="pindai" />
              <p className={adm.catatan}>
                Total {RINGKAS_HARI_INI.lajuLimaMenit} pindai per 5 menit di {LAJU_VENUE.length}{' '}
                venue. Venue yang laganya ditunda tidak menghitung.
              </p>
            </section>

            <section className={adm.kartu}>
              <div className={adm.kartuKepala}>
                <h2 className={adm.kartuJudul}>Laju per petugas</h2>
                <span className={adm.eyebrow}>pindai per 5 menit</span>
              </div>
              <DaftarBar baris={LAJU_PETUGAS} satuan="pindai" />
              <p className={adm.catatan}>
                Angka ini untuk melihat beban meja, bukan menilai kinerja orang.
              </p>
            </section>
          </div>

          <section className={adm.bagian}>
            <div className={adm.bagianKepala}>
              <h2 className={adm.judulBagian}>Pindaian terakhir</h2>
              <p className={adm.catatan}>
                {PINDAI_TERAKHIR.length} baris terbaru dari {TOTAL_PINDAI} pindaian hari ini · kolom
                alasan hanya kode, tanpa data pribadi
              </p>
            </div>

            <TabelAdmin
              caption="Pindaian check-in terbaru pada hari berjalan"
              minLebar={840}
              kolom={[
                { label: 'Waktu', urut: 'turun' },
                { label: 'Venue' },
                { label: 'Petugas' },
                { label: 'Cabang' },
                { label: 'Hasil' },
                { label: 'Kode alasan' },
              ]}
            >
              {PINDAI_TERAKHIR.map((p) => {
                const h = HASIL[p.hasil];

                return (
                  <tr key={p.id}>
                    <td>
                      <span className={adm.mono}>{p.waktu}</span>
                    </td>
                    <td>{p.venue}</td>
                    <td>{p.petugas}</td>
                    <td>{p.cabang}</td>
                    <td>
                      <Lencana label={h.label} nada={h.nada} ikon={h.ikon} />
                    </td>
                    <td>
                      {p.kode ? <span className={adm.mono}>{p.kode}</span> : <span>—</span>}
                    </td>
                  </tr>
                );
              })}
            </TabelAdmin>
          </section>
        </>
      )}
    </div>
  );
}
