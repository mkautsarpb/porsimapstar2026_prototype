import Link from 'next/link';
import { Ikon } from '@/components/app/Ikon';
import { formatUmur, formatWaktu } from '@/lib/admin/format';
import { hitungUmurDetik } from '@/lib/admin/kebasian';
import type { BarisPeringatan } from '@/types/panitia';
import styles from './TabelPeringatan.module.css';

/**
 * Tabel peringatan tab Operasional.
 *
 * Tabel, bukan kartu: baris-baris ini dibaca berurutan untuk memutuskan apa yang
 * dikerjakan lebih dulu, dan urutan itu hilang begitu diubah jadi kisi kartu.
 *
 * Tingkat kegentingan tidak pernah hanya warna — selalu ada ikon dan kata
 * ("Genting" / "Perhatian"), sesuai agents.md §7.
 */
export function TabelPeringatan({
  baris,
  waktuServerIso,
}: {
  readonly baris: readonly BarisPeringatan[];
  readonly waktuServerIso: string;
}) {
  if (baris.length === 0) {
    return (
      <div className={styles.kosong}>
        <p className={styles.kosongJudul}>Tidak ada peringatan aktif</p>
        <p className={styles.kosongTeks}>
          Antrean, kuota, dan notifikasi semuanya dalam batas wajar untuk cakupan lombamu.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.bungkus}>
      <table className={styles.tabel}>
        <caption className="sr-only">
          Peringatan operasional, diurutkan dari yang paling genting
        </caption>
        <thead>
          <tr>
            <th scope="col">Tingkat</th>
            <th scope="col">Perihal</th>
            <th scope="col">Sejak</th>
            <th scope="col">Tindakan</th>
          </tr>
        </thead>
        <tbody>
          {baris.map((b) => {
            const umur = hitungUmurDetik(waktuServerIso, b.sejakIso);

            return (
              <tr key={b.id} data-tingkat={b.tingkat}>
                <td>
                  <span className={styles.tingkat}>
                    <Ikon nama="seru" ukuran={12} tebal={2.4} />
                    {b.tingkat === 'danger' ? 'Genting' : 'Perhatian'}
                  </span>
                </td>
                <td>
                  <span className={styles.perihal}>{b.perihal}</span>
                  <span className={styles.rincian}>{b.rincian}</span>
                </td>
                <td className={styles.sejak}>
                  {umur !== null ? `${formatUmur(umur)} lalu` : '—'}
                  <span className={styles.sejakTepat}>{formatWaktu(b.sejakIso)}</span>
                </td>
                <td>
                  {b.aksi ? (
                    <Link href={b.aksi.href} className={styles.aksi}>
                      {b.aksi.label}
                      <Ikon nama="panah" ukuran={12} tebal={2.4} />
                    </Link>
                  ) : (
                    <span className={styles.tanpaAksi}>—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
