import { formatAngka, formatPersen } from '@/lib/admin/format';
import type { WidgetPanitia } from '@/types/panitia';
import { Band } from '../Band';
import { Widget } from '../Widget';
import { BarProporsi } from '../grafik/BarProporsi';
import { GrafikFunnel } from '../grafik/GrafikFunnel';
import { GrafikKomposisi } from '../grafik/GrafikKomposisi';
import { GrafikTrenHarian } from '../grafik/GrafikTrenHarian';
import { GrafikTrenJam } from '../grafik/GrafikTrenJam';
import { Sparkline } from '../grafik/Sparkline';
import { cari, type PropsTab } from './props';
import styles from './TabLomba.module.css';

const LABEL_KEADAAN = {
  buka: 'Buka',
  'hampir-penuh': 'Hampir penuh',
  'daftar-tunggu': 'Daftar tunggu',
} as const;

/**
 * Tab Lomba — tab bawaan.
 *
 * Panitia membuka dashboard untuk melihat kondisi lomba, bukan kondisi server;
 * karena itu analisis kepesertaan yang pertama terlihat, bukan integrasi.
 *
 * Baris KPI memakai kartu sama tinggi (kerapian barisnya penting) dan ruang
 * sisanya diisi visual mikro, bukan dibiarkan kosong. Band grafik memakai kartu
 * rata atas karena tinggi tiap grafik memang berbeda dan meregangkannya hanya
 * menghasilkan ruang kosong baru.
 */
export function TabLomba({ data, hanyutDetik, memuat, penyegaranGagal, onMuatUlang }: PropsTab) {
  const bersama = {
    waktuServerIso: data.waktuServerIso,
    hanyutDetik,
    memuat,
    penyegaranGagal,
    onMuatUlang,
  };

  const grafik = data.grafik;

  /* Visual mikro per kartu KPI. Yang tidak punya pasangan datanya tidak dipaksa
     ada — kartu tanpa visual mikro lebih baik daripada visual mikro kosong. */
  const mikro: Readonly<Record<string, React.ReactNode>> = {
    'total-pendaftaran': grafik ? <Sparkline titik={grafik.harian} /> : null,
    'total-akun': (
      <BarProporsi
        segmen={[
          { label: 'Email terverifikasi', nilai: 1388, nada: 'ok' },
          { label: 'Belum verifikasi email', nilai: 124, nada: 'warn' },
        ]}
      />
    ),
  };

  const kepesertaan = ['total-pendaftaran', 'total-akun', 'peserta-per-lomba']
    .map((id) => cari(data, id))
    .filter((w): w is WidgetPanitia => w !== undefined);

  const kuota = cari(data, 'kuota-lomba');

  const isiGrafik: Readonly<Record<string, React.ReactNode>> = grafik
    ? {
        'grafik-harian': (
          <GrafikTrenHarian titik={grafik.harian} penanda={grafik.penandaHarian} />
        ),
        'grafik-per-jam': <GrafikTrenJam titik={grafik.perJam} />,
        'grafik-funnel': <GrafikFunnel tahap={grafik.funnel} />,
        'grafik-komposisi': <GrafikKomposisi baris={grafik.komposisi} />,
      }
    : {};

  const widgetGrafik = ['grafik-harian', 'grafik-per-jam', 'grafik-funnel', 'grafik-komposisi']
    .map((id) => cari(data, id))
    .filter((w): w is WidgetPanitia => w !== undefined);

  return (
    <div className={styles.tab}>
      <Band
        id="band-kepesertaan"
        ikon="orangBanyak"
        judul="Kepesertaan"
        meta={
          data.cakupan.penuh
            ? `Seluruh event · ${data.cakupan.jumlahLomba} lomba`
            : `Cakupan ${data.cakupan.jumlahLomba} lomba`
        }
        kolom="tiga"
      >
        {kepesertaan.map((w) => (
          <Widget
            key={w.id}
            w={w}
            {...bersama}
            /* Kartu yang sudah punya visual mikro tidak perlu daftar angka ganda. */
            sembunyikanRincian={w.id === 'total-akun'}
            anak={mikro[w.id]}
          />
        ))}
      </Band>

      {kuota ? (
        <Band id="band-kuota" ikon="piala" judul="Pemanfaatan kuota" kolom="penuh">
          <Widget
            w={kuota}
            {...bersama}
            anak={
              data.kuota.length > 0 ? (
                <ul className={styles.kuota}>
                  {data.kuota.map((k) => {
                    const persen = Math.min(100, Math.round((k.terpakai / k.kapasitas) * 100));

                    return (
                      <li key={k.lomba} className={styles.kuotaBaris}>
                        <span className={styles.kuotaNama}>{k.lomba}</span>
                        <span className={styles.kuotaIsi}>
                          {formatAngka(k.terpakai)} dari {formatAngka(k.kapasitas)} {k.satuan}
                        </span>
                        <span aria-hidden="true" className={styles.kuotaMeter}>
                          <span
                            data-keadaan={k.keadaan}
                            style={{ width: `${persen}%` }}
                            className={styles.kuotaMeterIsi}
                          />
                        </span>
                        <span className={styles.kuotaPersen}>
                          {formatPersen(k.terpakai, k.kapasitas)}
                        </span>
                        <span data-keadaan={k.keadaan} className={styles.kuotaStatus}>
                          {LABEL_KEADAAN[k.keadaan]}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              ) : null
            }
          />
        </Band>
      ) : null}

      {widgetGrafik.length > 0 ? (
        <Band
          id="band-grafik"
          ikon="grid"
          judul="Tren dan komposisi"
          meta="Sumbu tunggal · tanpa pie dan gauge"
          kolom="dua"
          rataAtas
        >
          {widgetGrafik.map((w) => (
            <Widget key={w.id} w={w} {...bersama} anak={isiGrafik[w.id]} />
          ))}
        </Band>
      ) : null}
    </div>
  );
}
