import { formatAngka } from '@/lib/admin/format';
import type { PenandaHarian, TitikHarian } from '@/types/panitia';
import { TabelNilai } from './TabelNilai';
import styles from './GrafikTrenHarian.module.css';

/**
 * Tren pendaftaran harian — tiga seri status pada satu sumbu.
 *
 * SATU sumbu Y, selalu. Ketiga seri satuannya sama (pendaftaran per hari), jadi
 * boleh berbagi skala. Sumbu ganda akan mengarang korelasi yang tidak ada di data.
 *
 * Tiap seri punya BENTUK penanda sendiri — bulat, persegi, belah ketupat — bukan
 * cuma warna. Ini bukan hiasan: pasangan hijau (diverifikasi) dan merah (ditolak)
 * hanya terpisah ΔE 7,9 di deuteranopia, jadi tanpa bentuk penanda kedua seri itu
 * praktis sama bagi pembaca buta warna merah-hijau. Menghapus penandanya berarti
 * merusak grafik ini, bukan menyederhanakannya.
 *
 * Hari yang belum terjadi bernilai null dan tidak digambar — bukan digambar nol,
 * karena nol berarti "tidak ada yang mendaftar" dan itu pernyataan yang berbeda.
 */

const LEBAR = 320;
const TINGGI = 132;
const PAD_KIRI = 4;
const PAD_KANAN = 4;
const PAD_ATAS = 8;
const PAD_BAWAH = 8;

const SERI = [
  { kunci: 'dikirim', label: 'Dikirim', kelas: styles.dikirim, bentuk: 'bulat' },
  { kunci: 'diverifikasi', label: 'Diverifikasi', kelas: styles.diverifikasi, bentuk: 'persegi' },
  { kunci: 'ditolak', label: 'Ditolak', kelas: styles.ditolak, bentuk: 'belah' },
] as const;

function batasAtas(titik: readonly TitikHarian[]): number {
  const tertinggi = Math.max(
    1,
    ...titik.flatMap((t) => [t.dikirim ?? 0, t.diverifikasi ?? 0, t.ditolak ?? 0]),
  );
  return Math.ceil(tertinggi / 100) * 100;
}

export function GrafikTrenHarian({
  titik,
  penanda,
}: {
  readonly titik: readonly TitikHarian[];
  readonly penanda: readonly PenandaHarian[];
}) {
  if (titik.length === 0) return null;

  const maks = batasAtas(titik);
  const lebarPlot = LEBAR - PAD_KIRI - PAD_KANAN;
  const tinggiPlot = TINGGI - PAD_ATAS - PAD_BAWAH;

  const x = (i: number) => PAD_KIRI + (i / Math.max(1, titik.length - 1)) * lebarPlot;
  const y = (v: number) => PAD_ATAS + (1 - v / maks) * tinggiPlot;

  const garisTick = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div className={styles.grafik}>
      <div className={styles.kanvas}>
        <div className={styles.sumbuY}>
          {[...garisTick].reverse().map((t) => (
            <span key={t} className={styles.tickY}>
              {formatAngka(Math.round(maks * t))}
            </span>
          ))}
        </div>

        <div className={styles.plot}>
          <svg
            viewBox={`0 0 ${LEBAR} ${TINGGI}`}
            className={styles.svg}
            role="img"
            aria-label={`Tren pendaftaran harian ${titik[0]?.labelPendek} sampai ${titik[titik.length - 1]?.labelPendek}. Nilai lengkapnya ada di tabel di bawah grafik.`}
          >
            {garisTick.map((t) => (
              <line
                key={t}
                x1={PAD_KIRI}
                x2={LEBAR - PAD_KANAN}
                y1={PAD_ATAS + t * tinggiPlot}
                y2={PAD_ATAS + t * tinggiPlot}
                className={styles.kisi}
                vectorEffect="non-scaling-stroke"
              />
            ))}

            {penanda.map((p) => (
              <line
                key={p.label}
                x1={PAD_KIRI + p.posisi * lebarPlot}
                x2={PAD_KIRI + p.posisi * lebarPlot}
                y1={PAD_ATAS}
                y2={TINGGI - PAD_BAWAH}
                className={styles.penanda}
                vectorEffect="non-scaling-stroke"
              />
            ))}

            {SERI.map((s) => {
              const nilai = titik.map((t) => t[s.kunci]);
              const jalur = nilai
                .map((v, i) => (v === null ? null : `${x(i)},${y(v)}`))
                .filter((p) => p !== null)
                .join(' ');

              return (
                <polyline
                  key={s.kunci}
                  points={jalur}
                  className={`${styles.garis} ${s.kelas}`}
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}

            {SERI.map((s) =>
              titik.map((t, i) => {
                const v = t[s.kunci];
                if (v === null) return null;
                const cx = x(i);
                const cy = y(v);
                const r = 3;

                if (s.bentuk === 'bulat') {
                  return (
                    <circle key={`${s.kunci}-${t.labelPendek}`} cx={cx} cy={cy} r={r} className={`${styles.marka} ${s.kelas}`} />
                  );
                }
                if (s.bentuk === 'persegi') {
                  return (
                    <rect
                      key={`${s.kunci}-${t.labelPendek}`}
                      x={cx - r}
                      y={cy - r}
                      width={r * 2}
                      height={r * 2}
                      className={`${styles.marka} ${s.kelas}`}
                    />
                  );
                }
                return (
                  <polygon
                    key={`${s.kunci}-${t.labelPendek}`}
                    points={`${cx},${cy - r - 0.6} ${cx + r + 0.6},${cy} ${cx},${cy + r + 0.6} ${cx - r - 0.6},${cy}`}
                    className={`${styles.marka} ${s.kelas}`}
                  />
                );
              }),
            )}
          </svg>

          {penanda.map((p) => (
            <span key={p.label} style={{ left: `${p.posisi * 100}%` }} className={styles.penandaLabel}>
              {p.label}
            </span>
          ))}
        </div>
      </div>

      <p className={styles.satuan}>Sumbu tegak: jumlah pendaftaran per hari</p>

      <div className={styles.sumbuX}>
        {titik
          .filter((_, i) => i % 3 === 0 || i === titik.length - 1)
          .map((t) => (
            <span key={t.labelPendek} className={styles.tickX}>
              {t.labelPendek}
            </span>
          ))}
      </div>

      <ul className={styles.legenda}>
        {SERI.map((s) => (
          <li key={s.kunci} className={styles.legendaItem}>
            <span aria-hidden="true" data-bentuk={s.bentuk} className={`${styles.swatch} ${s.kelas}`} />
            {s.label}
          </li>
        ))}
      </ul>

      <TabelNilai
        ringkasan="pendaftaran harian"
        kolom={['Tanggal', 'Dikirim', 'Diverifikasi', 'Ditolak']}
        baris={titik
          .filter((t) => t.dikirim !== null)
          .map((t) => [
            t.labelPenuh,
            formatAngka(t.dikirim ?? 0),
            formatAngka(t.diverifikasi ?? 0),
            formatAngka(t.ditolak ?? 0),
          ])}
      />
    </div>
  );
}
