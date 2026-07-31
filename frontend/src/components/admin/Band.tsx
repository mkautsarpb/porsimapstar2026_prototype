import { Ikon } from '@/components/app/Ikon';
import type { NamaIkon } from '@/types/peserta';
import styles from './Band.module.css';

/**
 * Kelompok widget dengan satu kepala.
 *
 * Jangkar visualnya tiga hal, semuanya tanpa warna dekoratif: ikon kecil di kiri
 * judul, garis tipis penuh lebar di bawahnya, dan keterangan cakupan rata kanan
 * pada baris yang sama. Band TIDAK diberi latar berwarna — latar berwarna akan
 * bersaing dengan warna status kartu di dalamnya, dan di dashboard operasional
 * warna adalah sinyal, bukan hiasan.
 *
 * Keterangan cakupan ditulis SEKALI di sini bila seluruh kartu di dalamnya punya
 * cakupan yang sama; mengulanginya di tiap kartu membuat penandanya jadi hiasan
 * dan penyimpangan sungguhan tidak lagi terlihat.
 */
export function Band({
  id,
  ikon,
  judul,
  meta,
  cakupan,
  kolom = 'tiga',
  rataAtas = false,
  children,
}: {
  readonly id: string;
  readonly ikon: NamaIkon;
  readonly judul: string;
  readonly meta?: string;
  readonly cakupan?: string;
  readonly kolom?: 'dua' | 'tiga' | 'empat' | 'penuh';
  /** Kartu sekunder mengikuti tinggi isinya sendiri, tidak diregangkan. */
  readonly rataAtas?: boolean;
  readonly children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className={styles.band}>
      <div className={styles.kepala}>
        <h2 id={id} className={styles.judul}>
          <span aria-hidden="true" className={styles.ikon}>
            <Ikon nama={ikon} ukuran={13} tebal={2.2} />
          </span>
          {judul}
        </h2>
        {meta ? <p className={styles.meta}>{meta}</p> : null}
      </div>

      {cakupan ? <p className={styles.cakupan}>{cakupan}</p> : null}

      <div data-kolom={kolom} data-rata-atas={rataAtas} className={styles.kisi}>
        {children}
      </div>
    </section>
  );
}
