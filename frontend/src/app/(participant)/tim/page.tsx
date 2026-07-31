import type { Metadata } from 'next';
import Link from 'next/link';
import { Ikon } from '@/components/app/Ikon';
import { KepalaHalaman } from '@/components/app/KepalaHalaman';
import { KartuTim } from '@/components/tim/KartuTim';
import { TIM_SAYA, undanganMenunggu } from '@/data/tim';
import ui from '@/components/app/ui.module.css';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Tim saya',
  robots: { index: false, follow: false },
};

/**
 * /tim — pengelolaan penuh seluruh tim lintas lomba.
 *
 * Halaman ini pemilik tunggal aksi pengelolaan tim. Tab "Tim" di detail lomba
 * hanya ringkasan satu tim dan selalu menautkan ke sini, supaya tidak ada dua
 * tempat yang mengubah roster dengan aturan berbeda.
 */
export default function TimSayaPage() {
  const menunggu = undanganMenunggu();
  const perluTindakan = TIM_SAYA.filter((t) => !t.terkunci && t.bergabung < t.minimal).length;

  return (
    <div className={ui.halaman}>
      <KepalaHalaman
        judul="Tim saya"
        ringkasan={
          TIM_SAYA.length === 0
            ? 'Kamu belum tergabung di tim mana pun.'
            : `${TIM_SAYA.length} tim diikuti${
                menunggu.length > 0 ? ` · ${menunggu.length} undangan menunggu jawabanmu` : ''
              }${
                perluTindakan > 0
                  ? ` · ${perluTindakan} tim masih butuh anggota sebelum roster dikunci`
                  : ''
              }.`
        }
        aksi={
          <Link href="/undangan-tim" className={ui.tombol}>
            <Ikon nama="amplop" ukuran={16} tebal={2} />
            Kotak undangan
            {menunggu.length > 0 ? <span className={styles.lencana}>{menunggu.length}</span> : null}
          </Link>
        }
      />

      {TIM_SAYA.length === 0 ? (
        <div className={`${ui.kartu} ${ui.kosong}`}>
          <span aria-hidden="true" className={ui.kosongIkon}>
            <Ikon nama="orangBanyak" ukuran={26} />
          </span>
          <h2 className={ui.kosongJudul}>Kamu belum tergabung di tim mana pun</h2>
          <p className={ui.kosongTeks}>
            Tim dibuat dari halaman lomba bertipe tim — buka cabang yang ingin kamu ikuti, lalu
            pilih “Buat tim”. Kalau temanmu sudah membuat tim, kamu tidak perlu membuat lagi: minta
            dia mengirim undangan, dan undangan itu muncul di kotak undangan halaman ini.
          </p>
          <div className={styles.kosongAksi}>
            <Link href="/lomba-saya?jenis=Tim" className={`${ui.tombol} ${ui.tombolUtama}`}>
              Lihat lomba bertipe tim
            </Link>
            <Link href="/undangan-tim" className={ui.tombol}>
              Kotak undangan ({menunggu.length})
            </Link>
          </div>
        </div>
      ) : (
        <section className={ui.zona} aria-labelledby="zona-tim">
          <div className={ui.zonaKepala}>
            <h2 id="zona-tim" className={ui.judulZona}>
              Tim yang kamu ikuti
            </h2>
            <span className={ui.metaZona}>
              Hanya undangan yang sudah diterima dihitung sebagai anggota
            </span>
          </div>

          <div className={styles.daftar}>
            {TIM_SAYA.map((t) => (
              <KartuTim key={t.id} tim={t} />
            ))}
          </div>
        </section>
      )}

      {menunggu.length > 0 ? (
        <section className={ui.zona} aria-labelledby="zona-undangan">
          <div className={ui.zonaKepala}>
            <h2 id="zona-undangan" className={ui.judulZona}>
              Undangan untukmu
            </h2>
            <Link href="/undangan-tim" className={ui.tautanZona}>
              Buka kotak undangan
            </Link>
          </div>

          {menunggu.map((u) => (
            <Link key={u.id} href={`/undangan-tim/${u.token}`} className={styles.undangan}>
              <span aria-hidden="true" className={styles.undanganIkon}>
                <Ikon nama="amplop" ukuran={20} />
              </span>
              <span className={styles.undanganIsi}>
                <span className={styles.undanganJudul}>
                  Undangan dari {u.tim} menunggu jawabanmu
                </span>
                <span className={styles.undanganMeta}>
                  {u.lomba} · ketua {u.ketua} · jawab sebelum {u.batasJawab}
                </span>
              </span>
              <span aria-hidden="true" className={styles.undanganPanah}>
                <Ikon nama="panah" ukuran={16} tebal={2.4} />
              </span>
            </Link>
          ))}
        </section>
      ) : null}

      <p className={ui.teks}>
        Butuh tim baru? Tim selalu dibuat dari halaman cabang lombanya —{' '}
        <Link href="/lomba-saya?jenis=Tim">buka daftar lomba bertipe tim</Link>. Pembuat tim
        otomatis menjadi ketua sekaligus anggota pertama.
      </p>
    </div>
  );
}
