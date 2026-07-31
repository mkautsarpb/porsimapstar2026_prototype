import { formatAngka, formatPersen, formatTanggal } from '@/lib/admin/format';
import type { TahapFunnel } from '@/types/panitia';
import { TabelNilai } from './TabelNilai';
import styles from './GrafikFunnel.module.css';

/**
 * Funnel pendaftaran — enam tahap, batang horizontal menurun.
 *
 * Batang, bukan corong dekoratif: bentuk corong memiringkan sisi batang sehingga
 * panjangnya tidak lagi sebanding dengan angkanya. Yang perlu dibaca panitia ada
 * tiga — jumlah absolut, porsi terhadap tahap pertama, dan konversi antar tahap.
 * Angka konversi ditaruh DI ANTARA dua batang karena itu memang milik celahnya,
 * bukan milik salah satu tahap.
 *
 * Tahap yang belum waktunya tidak digambar nol. Nol berarti "tidak ada yang
 * lolos", padahal daftar ulang baru dibuka 6 Oktober — dua pernyataan yang
 * sangat berbeda bagi orang yang sedang memutuskan sesuatu.
 */
export function GrafikFunnel({ tahap }: { readonly tahap: readonly TahapFunnel[] }) {
  const dasar = tahap.find((t) => t.nilai !== null)?.nilai ?? 0;
  if (dasar <= 0) return null;

  return (
    <div className={styles.grafik}>
      <ol className={styles.daftar}>
        {tahap.map((t, i) => {
          const sebelum = tahap[i - 1];
          const konversi =
            sebelum && sebelum.nilai !== null && sebelum.nilai > 0 && t.nilai !== null
              ? formatPersen(t.nilai, sebelum.nilai)
              : null;

          return (
            <li key={t.id} className={styles.item}>
              {konversi ? (
                <p className={styles.konversi}>
                  <span aria-hidden="true" className={styles.panah} />
                  {konversi} lanjut ke tahap berikut
                </p>
              ) : null}

              <div className={styles.tahap}>
                <div className={styles.kepala}>
                  <span className={styles.label}>{t.label}</span>
                  {t.nilai !== null ? (
                    <span className={styles.nilai}>
                      {formatAngka(t.nilai)}
                      <span className={styles.porsi}>{formatPersen(t.nilai, dasar)}</span>
                    </span>
                  ) : null}
                </div>

                {t.nilai !== null ? (
                  <span aria-hidden="true" className={styles.rel}>
                    <span style={{ width: `${(t.nilai / dasar) * 100}%` }} className={styles.batang} />
                  </span>
                ) : (
                  <p className={styles.belum}>
                    Belum dimulai — mulai terisi {t.mulaiIso ? formatTanggal(t.mulaiIso) : 'menyusul'}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      <TabelNilai
        ringkasan="funnel pendaftaran"
        kolom={['Tahap', 'Jumlah', 'Porsi dari tahap pertama']}
        baris={tahap.map((t) => [
          t.label,
          t.nilai === null ? 'Belum dimulai' : formatAngka(t.nilai),
          t.nilai === null ? '—' : formatPersen(t.nilai, dasar),
        ])}
      />
    </div>
  );
}
