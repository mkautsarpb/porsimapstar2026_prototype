import type { Metadata } from 'next';
import Link from 'next/link';
import { Ikon } from '@/components/app/Ikon';
import { KepalaHalaman } from '@/components/app/KepalaHalaman';
import { KalenderBulan } from '@/components/jadwal/KalenderBulan';
import { KartuAgenda } from '@/components/jadwal/KartuAgenda';
import {
  FILTER_CABANG,
  JUDUL_KELOMPOK,
  KONFLIK_JADWAL,
  agendaTersaring,
} from '@/data/jadwal-saya';
import type { KelompokAgenda } from '@/types/peserta';
import ui from '@/components/app/ui.module.css';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Jadwal saya',
  robots: { index: false, follow: false },
};

type Query = Record<string, string | readonly string[] | undefined>;

function satu(nilai: string | readonly string[] | undefined): string | undefined {
  return Array.isArray(nilai) ? nilai[0] : (nilai as string | undefined);
}

const URUTAN: readonly KelompokAgenda[] = ['sebelum', 'check-in', 'pertandingan'];

/**
 * /jadwal-saya — seluruh agenda peserta lintas cabang.
 *
 * Tampilan (daftar/kalender), filter cabang, dan bulan kalender semuanya ada di
 * query URL: posisinya bertahan saat kembali dari detail cabang dan bisa
 * dibagikan tanpa memuat data pribadi (AC-FE-13). Konflik waktu ditampilkan
 * apa adanya di puncak halaman — client tidak menyembunyikan salah satu agenda,
 * karena hanya panitia yang boleh memindahkan jadwal.
 */
export default async function JadwalSayaPage({
  searchParams,
}: {
  readonly searchParams: Promise<Query>;
}) {
  const query = await searchParams;
  const tampilan = satu(query.tampilan) === 'kalender' ? 'kalender' : 'daftar';
  const cabang = FILTER_CABANG.some((c) => c.nilai === satu(query.cabang))
    ? (satu(query.cabang) as string)
    : 'semua';
  const bulan = satu(query.bulan) ?? '2026-08';

  const agenda = agendaTersaring(cabang);
  const berubah = agenda.filter((a) => a.keadaan === 'berubah').length;
  const konflik = agenda.filter((a) => a.keadaan === 'konflik').length;

  const url = (ubah: Record<string, string>) => {
    const q = new URLSearchParams();
    const gabung = { tampilan, cabang, bulan, ...ubah };
    if (gabung.tampilan !== 'daftar') q.set('tampilan', gabung.tampilan);
    if (gabung.cabang !== 'semua') q.set('cabang', gabung.cabang);
    if (gabung.tampilan === 'kalender' && gabung.bulan !== '2026-08') q.set('bulan', gabung.bulan);
    const s = q.toString();
    return s ? `/jadwal-saya?${s}` : '/jadwal-saya';
  };

  return (
    <div className={ui.halaman}>
      <KepalaHalaman
        judul="Jadwal saya"
        ringkasan={
          agenda.length === 0
            ? 'Belum ada agenda untuk filter ini.'
            : `${agenda.length} agenda${berubah > 0 ? ` · ${berubah} jadwal berubah` : ''}${
                konflik > 0 ? ` · ${konflik} agenda bertabrakan dan perlu ditangani panitia` : ''
              }.`
        }
        aksi={
          <>
            <div role="group" aria-label="Pengalih tampilan" className={styles.pengalih}>
              <Link
                href={url({ tampilan: 'daftar' })}
                aria-current={tampilan === 'daftar' ? 'true' : undefined}
                data-aktif={tampilan === 'daftar'}
                className={styles.pengalihItem}
              >
                Daftar
              </Link>
              <Link
                href={url({ tampilan: 'kalender' })}
                aria-current={tampilan === 'kalender' ? 'true' : undefined}
                data-aktif={tampilan === 'kalender'}
                className={styles.pengalihItem}
              >
                Kalender
              </Link>
            </div>
          </>
        }
      />

      <div role="group" aria-label="Filter cabang" className={styles.filter}>
        {FILTER_CABANG.map((c) => (
          <Link
            key={c.nilai}
            href={url({ cabang: c.nilai })}
            aria-pressed={cabang === c.nilai}
            data-terpilih={cabang === c.nilai}
            className={styles.chip}
          >
            {c.label}
          </Link>
        ))}
      </div>

      {konflik > 0
        ? KONFLIK_JADWAL.map((k) => (
            <div key={k.id} className={`${ui.panel} ${ui.panelBahaya}`}>
              <span aria-hidden="true" className={ui.panelIkon}>
                <Ikon nama="seru" ukuran={18} />
              </span>
              <div className={styles.konflikIsi}>
                <strong>{k.ringkas}</strong>
                <p className={styles.konflikTeks}>{k.penjelasan}</p>
                <Link href="/bantuan?jenis=jadwal" className={ui.tombol}>
                  Laporkan ke panitia
                </Link>
              </div>
            </div>
          ))
        : null}

      {agenda.length === 0 ? (
        <div className={`${ui.kartu} ${ui.kosong}`}>
          <span aria-hidden="true" className={ui.kosongIkon}>
            <Ikon nama="kalender" ukuran={26} />
          </span>
          <h2 className={ui.kosongJudul}>Jadwalmu belum terbit</h2>
          <p className={ui.kosongTeks}>
            Jadwal pertandingan disusun setelah pendaftaran ditutup dan seluruh peserta
            terverifikasi. Agenda sebelum lomba — daftar ulang dan technical meeting — muncul di sini
            begitu pendaftaranmu terverifikasi.
          </p>
          <p className={ui.kosongTeks}>
            Kamu tidak perlu memeriksa halaman ini berulang kali: setiap jadwal baru dan setiap
            perubahan dikirim sebagai notifikasi dan email.
          </p>
          <Link href="/dokumen" className={`${ui.tombol} ${ui.tombolUtama}`}>
            Cek kelengkapan dokumen
          </Link>
        </div>
      ) : tampilan === 'kalender' ? (
        <div className={`${ui.kartu} ${styles.kalender}`}>
          <KalenderBulan
            bulan={bulan}
            agenda={agenda}
            tautan={(b) => url({ tampilan: 'kalender', bulan: b })}
          />
        </div>
      ) : (
        URUTAN.map((kelompok) => {
          const isi = agenda.filter((a) => a.kelompok === kelompok);
          if (isi.length === 0) return null;

          return (
            <section key={kelompok} className={ui.zona} aria-labelledby={`zona-${kelompok}`}>
              <div className={ui.zonaKepala}>
                <h2 id={`zona-${kelompok}`} className={ui.judulZona}>
                  {JUDUL_KELOMPOK[kelompok].judul}
                </h2>
                <span className={ui.metaZona}>{JUDUL_KELOMPOK[kelompok].keterangan}</span>
              </div>

              <div className={styles.daftar}>
                {isi.map((a) => (
                  <KartuAgenda key={a.id} agenda={a} />
                ))}
              </div>
            </section>
          );
        })
      )}

      <p className={ui.teks}>
        Jadwal bisa berubah sampai H-1. Setiap perubahan dikirim sebagai notifikasi dan email, dan
        jam lama tetap ditampilkan dicoret di halaman ini supaya kamu bisa memastikan yang kamu
        ingat memang sudah tidak berlaku.
      </p>
    </div>
  );
}
