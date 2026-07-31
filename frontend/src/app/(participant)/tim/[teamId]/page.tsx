import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Ikon } from '@/components/app/Ikon';
import { Lencana } from '@/components/app/Lencana';
import { DialogUndang } from '@/components/tim/DialogUndang';
import { MeterRoster } from '@/components/tim/MeterRoster';
import { RosterTim } from '@/components/tim/RosterTim';
import { LABEL_STATUS_TIM, TIM_SAYA, cariTim } from '@/data/tim';
import ui from '@/components/app/ui.module.css';
import styles from './page.module.css';

type Params = { readonly teamId: string };
type Query = Record<string, string | readonly string[] | undefined>;

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<Params>;
}): Promise<Metadata> {
  const { teamId } = await params;
  const tim = cariTim(teamId);

  return {
    title: tim ? tim.nama : 'Detail tim',
    robots: { index: false, follow: false },
  };
}

export function generateStaticParams() {
  return TIM_SAYA.map((t) => ({ teamId: t.id }));
}

/**
 * /tim/[teamId] — detail satu tim.
 *
 * Satu halaman, dua tampilan: ketua melihat roster yang bisa dikelola, anggota
 * melihat susunan tim tanpa aksi pengelolaan sama sekali. Perbedaannya bukan
 * sekadar menyembunyikan tombol — backend tetap menolak aksi yang bukan
 * wewenangnya (agents.md §0 prinsip 2, FE-ADMIN-002).
 */
export default async function DetailTimPage({
  params,
  searchParams,
}: {
  readonly params: Promise<Params>;
  readonly searchParams: Promise<Query>;
}) {
  const { teamId } = await params;
  const query = await searchParams;
  const tim = cariTim(teamId);

  if (!tim) notFound();

  const ketua = tim.peranSaya === 'Ketua';
  const status = LABEL_STATUS_TIM[tim.status];
  const bukaUndang = ketua && !tim.terkunci && query.undang === '1';

  return (
    <div className={ui.halaman}>
      <nav aria-label="Remah roti" className={styles.remah}>
        <Link href="/tim">Tim saya</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{tim.nama}</span>
      </nav>

      <header className={`${ui.kartu} ${styles.kepala}`}>
        <span aria-hidden="true" className={styles.lambang}>
          {tim.inisial}
        </span>

        <div className={styles.identitas}>
          <div className={styles.judulBaris}>
            <h1 className={styles.judul}>{tim.nama}</h1>
            <span className={styles.peran}>{tim.peranSaya}</span>
            <Lencana label={status.label} nada={status.nada} ikon="orangBanyak" />
          </div>
          <p className={styles.meta}>
            <Link href={`/lomba-saya/${tim.lombaId}`}>{tim.lomba}</Link> · {tim.institusi} ·{' '}
            {ketua ? `dibuat ${tim.dibuat}` : `ketua ${tim.ketua}`}
          </p>
        </div>

        <div className={styles.aksiKepala}>
          <Link href={`/tim/${tim.id}/riwayat`} className={ui.tombol}>
            Riwayat tim
          </Link>
          {ketua ? (
            <>
              <Link href={`/tim/${tim.id}/review`} className={ui.tombol}>
                Review &amp; submit
              </Link>
              {!tim.terkunci ? (
                <Link href={`/tim/${tim.id}?undang=1`} className={`${ui.tombol} ${ui.tombolUtama}`}>
                  Undang anggota
                </Link>
              ) : null}
            </>
          ) : null}
        </div>
      </header>

      <section className={`${ui.kartu} ${styles.roster}`} aria-labelledby="ringkas-roster">
        <div className={styles.rosterIsi}>
          <h2 id="ringkas-roster" className={ui.judulZona}>
            Keadaan roster
          </h2>
          <p className={styles.ringkasan}>{tim.ringkasan}</p>
          <MeterRoster
            bergabung={tim.bergabung}
            menunggu={tim.menunggu}
            minimal={tim.minimal}
            catatan={`Bar di atas dihitung terhadap minimum ${tim.minimal} orang. Di luar minimum itu masih ada ${Math.max(
              0,
              tim.maksimal - tim.minimal,
            )} slot cadangan sampai batas maksimal ${tim.maksimal} orang.`}
          />
        </div>

        <div className={styles.kunci}>
          <span className={ui.eyebrow}>Roster dikunci</span>
          <strong className={styles.kunciWaktu}>{tim.kunciPada}</strong>
          <span className={styles.kunciSisa}>{tim.sisaKunci}</span>
        </div>
      </section>

      {tim.terkunci ? (
        <div className={`${ui.panel} ${ui.panelPeringatan}`}>
          <span aria-hidden="true" className={ui.panelIkon}>
            <Ikon nama="jam" ukuran={18} />
          </span>
          <div className={styles.kunciTeks}>
            <strong>Daftar anggota dikunci sejak {tim.kunciPada}</strong>
            <p className={styles.kunciParagraf}>
              Undangan, pembatalan, dan pengeluaran anggota sudah ditutup untuk menjaga daftar yang
              dipakai panitia menyusun jadwal. Perbaikan dokumen tetap bisa dilakukan masing-masing
              anggota dari akunnya sendiri.
            </p>
            <p className={styles.kunciParagraf}>
              Perubahan darurat (cedera, anggota mundur) ditangani manual lewat sekretariat —{' '}
              <Link href="/bantuan">ajukan dari halaman Bantuan</Link>, balasan maksimal 1×24 jam.
            </p>
          </div>
        </div>
      ) : null}

      {!ketua && tim.tugasSaya && tim.tugasSaya.length > 0 ? (
        <section className={ui.kartu} aria-labelledby="tugas-saya">
          <h2 id="tugas-saya" className={ui.judulZona}>
            Yang menjadi tanggung jawabmu
          </h2>
          <ul className={styles.tugas}>
            {tim.tugasSaya.map((t) => (
              <li key={t.id} className={styles.tugasItem}>
                <span className={styles.tugasIsi}>
                  <span className={styles.tugasJudul}>{t.judul}</span>
                  <span className={styles.tugasKet}>{t.keterangan}</span>
                </span>
                <Link href={t.href} className={`${ui.tombol} ${ui.tombolKecil}`}>
                  {t.cta}
                </Link>
              </li>
            ))}
          </ul>
          <p className={ui.teks}>
            Hanya kamu yang bisa mengerjakan hal di atas dari akunmu sendiri. Ketua bisa
            mengingatkan, tetapi tidak bisa menggantikan.
          </p>
        </section>
      ) : null}

      <section className={ui.kartu} aria-labelledby="susunan">
        <div className={ui.zonaKepala}>
          <h2 id="susunan" className={ui.judulZona}>
            {ketua ? 'Roster tim' : 'Susunan tim'}
          </h2>
          <span className={ui.metaZona}>
            {ketua
              ? 'Status kelengkapan saja — dokumen anggota tidak pernah terbuka untuk ketua'
              : 'Hanya lihat · pengelolaan roster adalah wewenang ketua'}
          </span>
        </div>

        <RosterTim tim={tim} kelola={ketua && !tim.terkunci} />
      </section>

      {!ketua ? (
        <div className={ui.kisi}>
          <section className={`${ui.kartu} ${ui.span7}`} aria-labelledby="keanggotaan">
            <h2 id="keanggotaan" className={ui.judulZona}>
              Status keanggotaanmu
            </h2>
            <p className={styles.bergabung}>{tim.bergabungSejak}</p>
            <p className={ui.teks}>{tim.ceritaBergabung}</p>
          </section>

          <section className={`${ui.kartu} ${ui.span5}`} aria-labelledby="agenda-tim">
            <h2 id="agenda-tim" className={ui.judulZona}>
              Jadwal tim ini
            </h2>
            <ul className={styles.agenda}>
              {tim.agenda.map((a) => (
                <li key={a.id} className={styles.agendaItem}>
                  <span aria-hidden="true" className={styles.tanggal}>
                    <span className={styles.tanggalAngka}>{a.tanggal}</span>
                    <span className={styles.tanggalBulan}>{a.bulan}</span>
                  </span>
                  <span className={styles.agendaIsi}>
                    <span className={styles.agendaNama}>{a.nama}</span>
                    <span className={styles.agendaDetail}>{a.detail}</span>
                  </span>
                </li>
              ))}
            </ul>
            <Link href="/jadwal-saya" className={ui.tautanZona}>
              Lihat jadwal lengkap
            </Link>
          </section>
        </div>
      ) : null}

      {ketua ? <DialogUndang tim={tim} terbuka={bukaUndang} /> : null}
    </div>
  );
}
