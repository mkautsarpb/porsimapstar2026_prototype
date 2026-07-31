import Link from 'next/link';
import styles from './KakiTabel.module.css';

/**
 * Href-nya sudah jadi, bukan fungsi pembentuk href.
 *
 * `KakiTabel` dipakai di dalam Client Component, dan fungsi tidak bisa menyeberang
 * batas server→client — Next.js menolaknya saat render. Server yang menyusun
 * kedua tautan (lengkap dengan filter aktif, AC-FE-13) lalu mengirim string.
 */
export interface Paginasi {
  readonly halaman: number;
  readonly totalHalaman: number;
  readonly hrefSebelumnya: string | null;
  readonly hrefBerikutnya: string | null;
}

/**
 * Kaki tabel: kalimat "menampilkan X–Y dari Z" plus paginasi.
 *
 * Jumlah hasil selalu terlihat (aturan yang berlaku di seluruh Batch E1–E4) —
 * tanpa itu tabel terfilter mudah dibaca sebagai seluruh data. Paginasi berupa
 * tautan, bukan tombol: nomor halaman ikut di URL bersama filter, jadi kembali
 * dari halaman detail mengembalikan posisi yang sama (AC-FE-13).
 */
export function KakiTabel({
  ringkasan,
  catatan,
  paginasi,
}: {
  readonly ringkasan: string;
  readonly catatan?: string;
  readonly paginasi?: Paginasi;
}) {
  return (
    <div className={styles.kaki}>
      <div className={styles.kiri}>
        <p className={styles.ringkasan}>{ringkasan}</p>
        {catatan ? <p className={styles.catatan}>{catatan}</p> : null}
      </div>

      {paginasi && paginasi.totalHalaman > 1 ? (
        <nav aria-label="Paginasi tabel" className={styles.paginasi}>
          {paginasi.hrefSebelumnya ? (
            <Link href={paginasi.hrefSebelumnya} className={styles.nav}>
              Sebelumnya
            </Link>
          ) : (
            <span aria-disabled="true" className={`${styles.nav} ${styles.navMati}`}>
              Sebelumnya
            </span>
          )}

          <span className={styles.posisi}>
            Halaman {paginasi.halaman} dari {paginasi.totalHalaman}
          </span>

          {paginasi.hrefBerikutnya ? (
            <Link href={paginasi.hrefBerikutnya} className={styles.nav}>
              Berikutnya
            </Link>
          ) : (
            <span aria-disabled="true" className={`${styles.nav} ${styles.navMati}`}>
              Berikutnya
            </span>
          )}
        </nav>
      ) : null}
    </div>
  );
}
