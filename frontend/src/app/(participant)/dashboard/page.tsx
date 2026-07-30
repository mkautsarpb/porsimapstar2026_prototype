import type { Metadata } from 'next';
import Link from 'next/link';
import { AgendaTerdekat } from '@/components/dashboard/AgendaTerdekat';
import { Ikon } from '@/components/app/Ikon';
import { KartuLomba } from '@/components/app/KartuLomba';
import {
  AKSI_PERLU_TINDAKAN,
  AKTIVITAS,
  BANTUAN,
  HASIL,
  KELENGKAPAN,
  LOMBA_SAYA,
  PROFIL,
  RINGKASAN_SAPAAN,
  STATISTIK,
} from '@/data/peserta';
import ui from '@/components/app/ui.module.css';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Dashboard',
  robots: { index: false, follow: false },
};

/** Sapaan mengikuti jam server; tanggal acuan final tetap milik backend. */
function sapaan(): string {
  const jam = new Date().getHours();
  if (jam < 11) return 'pagi';
  if (jam < 15) return 'siang';
  if (jam < 18) return 'sore';
  return 'malam';
}

/**
 * Dashboard peserta — urutan zona mengikuti desain "Dashboard Peserta v3":
 * sapaan → perlu tindakan → kelengkapan → lomba saya → agenda & hasil →
 * statistik → aktivitas & bantuan. Urutan itu bukan selera: yang butuh tindakan
 * selalu di atas lipatan (agents.md §10).
 */
export default function DashboardPage() {
  const lombaAktif = LOMBA_SAYA.filter((l) => !l.riwayat).slice(0, 2);

  return (
    <div className={ui.kisi}>
      <header className={`${ui.span12} ${styles.sapaan}`}>
        <div>
          <h1 className={styles.judul}>
            Selamat {sapaan()}, {PROFIL.nama.split(' ')[0]}
          </h1>
          <p className={styles.subjudul}>{RINGKASAN_SAPAAN}</p>
        </div>

        {PROFIL.terverifikasi ? (
          <span data-nada="ok" className={`${ui.badge} ${ui.badgeBesar}`}>
            <Ikon nama="centang" ukuran={14} tebal={2.2} />
            Akun terverifikasi
          </span>
        ) : null}
      </header>

      {AKSI_PERLU_TINDAKAN.length > 0 ? (
        <section aria-labelledby="perlu-tindakan" className={`${ui.span12} ${ui.zona}`}>
          <div className={ui.zonaKepala}>
            <h2 id="perlu-tindakan" className={ui.judulZona}>
              Perlu tindakanmu
            </h2>
            <span className={ui.metaZona}>Diurutkan menurut tenggat terdekat</span>
          </div>

          {AKSI_PERLU_TINDAKAN.map((a) => (
            <article key={a.id} data-nada={a.nada} className={styles.aksi}>
              <span aria-hidden="true" className={styles.aksiGaris} />
              <span aria-hidden="true" className={styles.aksiIkon}>
                <Ikon nama={a.ikon} />
              </span>
              <div className={styles.aksiTeks}>
                <h3 className={styles.aksiJudul}>{a.judul}</h3>
                <p className={styles.aksiKonteks}>{a.konteks}</p>
              </div>
              <div className={styles.aksiKanan}>
                <span className={styles.aksiTenggat}>
                  <Ikon nama="jam" ukuran={16} tebal={2} />
                  {a.tenggat}
                </span>
                <Link href={a.href} className={`${ui.tombol} ${ui.tombolUtama}`}>
                  {a.cta}
                </Link>
              </div>
            </article>
          ))}
        </section>
      ) : null}

      <section aria-labelledby="kelengkapan" className={`${ui.span12} ${ui.kartu} ${styles.kelengkapan}`}>
        <div className={styles.kelengkapanRingkas}>
          <h2 id="kelengkapan" className={styles.kelengkapanLabel}>
            Kelengkapan pendaftaran
          </h2>
          <p className={styles.persen}>
            <span className={styles.persenAngka}>{KELENGKAPAN.persen}</span>
            <span className={styles.persenTanda}>%</span>
          </p>
          <span aria-hidden="true" className={ui.meter}>
            <span style={{ width: `${KELENGKAPAN.persen}%` }} className={ui.meterIsi} />
          </span>
          <p className={styles.kelengkapanCatatan}>{KELENGKAPAN.catatan}</p>
        </div>

        <ul className={styles.checklist}>
          {KELENGKAPAN.langkah.map((l) => (
            <li key={l.label} data-keadaan={l.keadaan} className={styles.langkah}>
              <span aria-hidden="true" className={styles.langkahTanda}>
                <Ikon nama={l.keadaan === 'ok' ? 'centang' : 'seru'} ukuran={12} tebal={2.4} />
              </span>
              <span className={styles.langkahLabel}>{l.label}</span>
              <span className={styles.langkahStatus}>{l.status}</span>
              <span className={styles.langkahAksi}>
                {l.href ? (
                  <Link href={l.href} className={`${ui.tombol} ${ui.tombolSky} ${ui.tombolKecil}`}>
                    Lanjutkan
                    <Ikon nama="panah" ukuran={12} tebal={2.4} />
                  </Link>
                ) : null}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="lomba-saya" className={`${ui.span12} ${ui.zona}`}>
        <div className={ui.zonaKepala}>
          <h2 id="lomba-saya" className={ui.judulZona}>
            Lomba saya
          </h2>
          <Link href="/lomba-saya" className={ui.tautanZona}>
            Lihat semua pendaftaran
          </Link>
        </div>

        <div className={styles.duaKolom}>
          {lombaAktif.map((l) => (
            <KartuLomba key={l.id} lomba={l} />
          ))}
        </div>
      </section>

      <AgendaTerdekat />

      <section aria-labelledby="hasil" className={`${ui.span5} ${ui.zona}`}>
        <h2 id="hasil" className={ui.judulZona}>
          Hasil terbaru
        </h2>
        <div className={styles.hasilDaftar}>
          {HASIL.map((h) => (
            <article key={h.id} className={`${ui.kartu} ${styles.hasil}`}>
              <div className={styles.hasilKepala}>
                <h3 className={styles.hasilNama}>{h.nama}</h3>
                <span data-nada={h.nada} className={ui.badge}>
                  <Ikon nama={h.nada === 'ok' ? 'centang' : 'jam'} ukuran={12} tebal={2.2} />
                  {h.status}
                </span>
              </div>
              <p className={styles.skor}>
                <span className={styles.skorAngka}>{h.skor}</span>
                <span className={styles.skorLawan}>vs {h.lawan}</span>
              </p>
              <p className={styles.hasilKaki}>
                <span>{h.babak}</span>
                <Link href="/hasil-saya" className={ui.tautanZona}>
                  Lihat bagan
                </Link>
              </p>
            </article>
          ))}
        </div>
      </section>

      <section aria-label="Ringkasan angka" className={`${ui.span12} ${styles.statistik}`}>
        {STATISTIK.map((s) => (
          <div key={s.label} className={`${ui.kartu} ${styles.stat}`}>
            <span aria-hidden="true" className={styles.statIkon}>
              <Ikon nama={s.ikon} />
            </span>
            <span className={styles.statTeks}>
              <span className={styles.statNilai}>{s.nilai}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </span>
          </div>
        ))}
      </section>

      <section aria-labelledby="aktivitas" className={`${ui.span7} ${ui.zona}`}>
        <h2 id="aktivitas" className={ui.judulZona}>
          Aktivitas terakhir
        </h2>
        <div className={ui.kartu}>
          <ul className={styles.linimasa}>
            {AKTIVITAS.map((v) => (
              <li key={v.id} data-nada={v.nada} className={styles.aktivitas}>
                <span aria-hidden="true" className={styles.aktivitasTanda}>
                  <span className={styles.titik} />
                  <span className={styles.garis} />
                </span>
                <span className={styles.aktivitasTeks}>
                  <span>{v.teks}</span>
                  <span className={styles.aktivitasWaktu}>{v.waktu}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <aside aria-labelledby="bantuan" className={`${ui.span5} ${ui.zona}`}>
        <h2 id="bantuan" className={ui.judulZona}>
          Butuh bantuan?
        </h2>
        <div className={styles.bantuan}>
          <p className={styles.bantuanIntro}>
            Hubungi PIC cabang lombamu bila ada kendala pendaftaran, dokumen, atau jadwal.
          </p>
          <div className={styles.bantuanDaftar}>
            {BANTUAN.map((b) => (
              <div key={b.nama} className={styles.bantuanItem}>
                <span aria-hidden="true" className={styles.bantuanIkon}>
                  <Ikon nama={b.ikon} ukuran={16} />
                </span>
                <span className={styles.bantuanTeks}>
                  <span className={styles.bantuanNama}>{b.nama}</span>
                  <span className={styles.bantuanKet}>{b.keterangan}</span>
                </span>
              </div>
            ))}
          </div>
          <p className={styles.bantuanKaki}>
            <span>Nomor referensi peserta</span>
            <span className={styles.bantuanNomor}>{PROFIL.nomorPeserta}</span>
          </p>
        </div>
      </aside>
    </div>
  );
}
