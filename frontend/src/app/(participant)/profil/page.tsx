import type { Metadata } from 'next';
import Link from 'next/link';
import { Ikon } from '@/components/app/Ikon';
import { KepalaHalaman } from '@/components/app/KepalaHalaman';
import { Lencana } from '@/components/app/Lencana';
import { FormProfil } from '@/components/profil/FormProfil';
import { KirimProfil } from '@/components/profil/KirimProfil';
import { StepperProfil } from '@/components/profil/StepperProfil';
import { DOKUMEN, LABEL_DOKUMEN } from '@/data/dokumen';
import {
  ELIGIBILITAS,
  ISIAN_IDENTITAS,
  ISIAN_PENDIDIKAN,
  NIK_TERSIMPAN,
  TAHAP_PROFIL,
  TIDAK_MEMENUHI,
} from '@/data/profil';
import ui from '@/components/app/ui.module.css';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Profil',
  robots: { index: false, follow: false },
};

type Query = Record<string, string | readonly string[] | undefined>;

function satu(nilai: string | readonly string[] | undefined): string | undefined {
  return Array.isArray(nilai) ? nilai[0] : (nilai as string | undefined);
}

/**
 * /profil — stepper empat tahap data peserta.
 *
 * Tahap ada di query URL supaya notifikasi bisa menautkan langsung ke tahap yang
 * bermasalah. Tahap Dokumen sengaja hanya MENAUTKAN ke halaman Dokumen: satu
 * tempat unggah, satu aturan versi (§ pembagian fungsi Batch C).
 */
export default async function ProfilPage({
  searchParams,
}: {
  readonly searchParams: Promise<Query>;
}) {
  const query = await searchParams;
  const diminta = satu(query.tahap);
  const tahap = TAHAP_PROFIL.find((t) => t.kunci === diminta)?.kunci ?? 'identitas';
  const nomor = TAHAP_PROFIL.find((t) => t.kunci === tahap)?.nomor ?? 1;

  const dokumenTertahan = DOKUMEN.filter(
    (d) => d.status === 'perlu-diperbaiki' || d.status === 'belum-diunggah',
  );
  const penghalang = dokumenTertahan.map(
    (d) => `${d.nama} — ${LABEL_DOKUMEN[d.status].label.toLowerCase()}`,
  );

  return (
    <div className={ui.halaman}>
      <KepalaHalaman
        judul="Profil peserta"
        ringkasan={`Tahap ${nomor} dari ${TAHAP_PROFIL.length} · isian tersimpan otomatis · data ini dipakai panitia untuk verifikasi dan pencocokan identitas saat check-in.`}
      />

      <StepperProfil tahap={TAHAP_PROFIL} aktif={tahap} />

      {tahap === 'identitas' ? (
        <section className={ui.kartu} aria-labelledby="tahap-identitas">
          <h2 id="tahap-identitas" className={ui.judulZona}>
            1 · Identitas
          </h2>
          <FormProfil
            isian={ISIAN_IDENTITAS}
            tahap="identitas"
            denganNik
            lanjutHref="/profil?tahap=pendidikan"
            lanjutLabel="Lanjut ke Pendidikan"
          />
        </section>
      ) : null}

      {tahap === 'pendidikan' ? (
        <section className={ui.kartu} aria-labelledby="tahap-pendidikan">
          <h2 id="tahap-pendidikan" className={ui.judulZona}>
            2 · Pendidikan
          </h2>

          <div className={`${ui.panel} ${styles.jarak}`}>
            <span aria-hidden="true" className={ui.panelIkon}>
              <Ikon nama="bantuan" ukuran={18} />
            </span>
            <span>
              PORSIMAPTAR terbuka untuk peserta jenjang <strong>SMA/sederajat ke atas</strong>. Kami
              menuliskannya di awal supaya kamu tidak mengisi seluruh formulir lalu ditolak di tahap
              akhir. Kalau jenjangmu di bawah itu, drafmu tetap tersimpan dan kamu bisa mendaftar
              tahun depan.
            </span>
          </div>

          <FormProfil
            isian={ISIAN_PENDIDIKAN}
            tahap="pendidikan"
            lanjutHref="/profil?tahap=dokumen"
            lanjutLabel="Lanjut ke Dokumen"
            kembaliHref="/profil?tahap=identitas"
          />
        </section>
      ) : null}

      {tahap === 'dokumen' ? (
        <section className={ui.kartu} aria-labelledby="tahap-dokumen">
          <h2 id="tahap-dokumen" className={ui.judulZona}>
            3 · Dokumen
          </h2>
          <p className={ui.teks}>
            Unggah, unggah ulang, dan riwayat versi semuanya ada di satu tempat: halaman{' '}
            <strong>Dokumen</strong>. Tahap ini hanya menunjukkan posisimu sekarang supaya kamu tahu
            apa yang menahan pendaftaran.
          </p>

          <ul className={styles.dokumen}>
            {DOKUMEN.map((d) => {
              const label = LABEL_DOKUMEN[d.status];

              return (
                <li key={d.id} className={styles.dokumenItem}>
                  <span className={styles.dokumenNama}>{d.nama}</span>
                  <Lencana label={label.label} nada={label.nada} ikon={label.ikon} />
                </li>
              );
            })}
          </ul>

          <div className={styles.aksiTahap}>
            <Link href="/dokumen" className={`${ui.tombol} ${ui.tombolUtama}`}>
              Buka halaman Dokumen
            </Link>
            <Link href="/profil?tahap=pendidikan" className={ui.tombol}>
              Kembali
            </Link>
            <Link href="/profil?tahap=tinjau" className={ui.tombol}>
              Lanjut ke Tinjau
            </Link>
          </div>

          <p className={ui.teks}>
            Kamu boleh lanjut ke Tinjau walau dokumen belum lengkap — tetapi profil baru bisa
            dikirim setelah semua dokumen diterima panitia.
          </p>
        </section>
      ) : null}

      {tahap === 'tinjau' ? (
        <>
          <section className={ui.kartu} aria-labelledby="tinjau-identitas">
            <div className={ui.zonaKepala}>
              <h2 id="tinjau-identitas" className={ui.judulZona}>
                Identitas
              </h2>
              <Link href="/profil?tahap=identitas" className={ui.tautanZona}>
                Ubah
              </Link>
            </div>

            <dl className={styles.rincian}>
              {ISIAN_IDENTITAS.map((i) => (
                <div key={i.id}>
                  <dt>{i.label}</dt>
                  <dd>{i.nilai}</dd>
                </div>
              ))}
              <div>
                <dt>NIK</dt>
                <dd className={styles.mono}>{NIK_TERSIMPAN}</dd>
              </div>
            </dl>
          </section>

          <section className={ui.kartu} aria-labelledby="tinjau-pendidikan">
            <div className={ui.zonaKepala}>
              <h2 id="tinjau-pendidikan" className={ui.judulZona}>
                Pendidikan
              </h2>
              <Link href="/profil?tahap=pendidikan" className={ui.tautanZona}>
                Ubah
              </Link>
            </div>

            <dl className={styles.rincian}>
              {ISIAN_PENDIDIKAN.map((i) => (
                <div key={i.id}>
                  <dt>{i.label}</dt>
                  <dd>{i.nilai}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section
            className={`${ui.panel} ${ELIGIBILITAS.memenuhi ? ui.panelSukses : ui.panelBahaya}`}
            aria-labelledby="syarat-usia"
          >
            <span aria-hidden="true" className={ui.panelIkon}>
              <Ikon nama={ELIGIBILITAS.memenuhi ? 'centang' : 'seru'} ukuran={18} />
            </span>
            <div className={styles.usia}>
              <strong id="syarat-usia">
                {ELIGIBILITAS.memenuhi ? ELIGIBILITAS.judul : TIDAK_MEMENUHI.judul}
              </strong>
              <p className={styles.usiaTeks}>
                {ELIGIBILITAS.memenuhi ? ELIGIBILITAS.penjelasan : TIDAK_MEMENUHI.penjelasan}
              </p>
              {!ELIGIBILITAS.memenuhi ? (
                <ul className={styles.usiaDaftar}>
                  {TIDAK_MEMENUHI.jalanKeluar.map((j) => (
                    <li key={j}>{j}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </section>

          <KirimProfil penghalang={penghalang} />
        </>
      ) : null}
    </div>
  );
}
