import { formatAngka } from '@/lib/admin/format';
import type { TitikJam } from '@/types/panitia';
import { TabelNilai } from './TabelNilai';
import styles from './GrafikTrenJam.module.css';

/**
 * Tren pendaftaran per jam — batang, 24 jam terakhir.
 *
 * Tujuannya satu: menentukan jam siaga verifikator. Karena itu jam tersibuk
 * dipertegas dan kesimpulannya ditulis sebagai kalimat di bawah grafik — panitia
 * tidak perlu memindai 24 batang untuk menemukan yang tertinggi.
 *
 * Penegasannya memakai hue yang SAMA satu langkah lebih pekat, bukan warna baru.
 * Warna baru di dashboard operasional berarti status baru; di sini tidak ada
 * status baru, hanya satu batang yang perlu ditemukan lebih cepat.
 */
export function GrafikTrenJam({ titik }: { readonly titik: readonly TitikJam[] }) {
  if (titik.length === 0) return null;

  const maks = Math.max(1, ...titik.map((t) => t.nilai));
  const total = titik.reduce((n, t) => n + t.nilai, 0);
  const tersibuk = titik.reduce((a, b) => (b.nilai > a.nilai ? b : a));

  return (
    <div className={styles.grafik}>
      <div
        className={styles.plot}
        role="img"
        aria-label={`Pendaftaran per jam selama 24 jam terakhir. Tersibuk pukul ${tersibuk.label} dengan ${tersibuk.nilai} pendaftaran. Nilai lengkapnya ada di tabel di bawah grafik.`}
      >
        {titik.map((t) => (
          <span key={t.label} className={styles.kolom} title={`${t.label} · ${t.nilai} pendaftaran`}>
            <span
              data-sorot={t.label === tersibuk.label}
              style={{ height: `${(t.nilai / maks) * 100}%` }}
              className={styles.batang}
            />
          </span>
        ))}
      </div>

      <div className={styles.sumbuX}>
        {titik
          .filter((_, i) => i % 4 === 0)
          .map((t) => (
            <span key={t.label} className={styles.tickX}>
              {t.label}
            </span>
          ))}
      </div>

      <p className={styles.kesimpulan}>
        Tersibuk pukul <strong>{tersibuk.label}</strong> dengan {formatAngka(tersibuk.nilai)} pendaftaran
        · total {formatAngka(total)} dalam 24 jam terakhir.
      </p>

      <TabelNilai
        ringkasan="pendaftaran per jam"
        kolom={['Jam', 'Pendaftaran']}
        baris={titik.map((t) => [t.label, formatAngka(t.nilai)])}
      />
    </div>
  );
}
