import Link from 'next/link';
import { Ikon } from '@/components/app/Ikon';
import type { Undangan } from '@/types/tim';
import ui from '@/components/app/ui.module.css';
import { BadgeUndangan } from './BadgeUndangan';
import { KeputusanUndangan } from './KeputusanUndangan';
import styles from './KartuUndangan.module.css';

/**
 * Satu undangan di kotak undangan. Undangan yang masih bisa dijawab menampilkan
 * tenggat dan tombol keputusan; undangan riwayat hanya menampilkan apa yang
 * terjadi dan kapan — tanpa tombol mati (desain B5 & panel status).
 */
export function KartuUndangan({ undangan }: { readonly undangan: Undangan }) {
  const aktif = undangan.status === 'menunggu' || undangan.status === 'konflik';

  return (
    <article className={`${ui.kartu} ${styles.kartu}`}>
      <span aria-hidden="true" className={styles.lambang}>
        {undangan.inisial}
      </span>

      <div className={styles.isi}>
        <div className={styles.judulBaris}>
          <h3 className={styles.nama}>{undangan.tim}</h3>
          <BadgeUndangan status={undangan.status} />
        </div>

        <p className={styles.meta}>
          {undangan.lomba} · {undangan.institusi}
        </p>
        <p className={styles.meta}>
          Diundang oleh <strong>{undangan.ketua}</strong> (ketua) pada {undangan.dikirim}
        </p>

        {undangan.status === 'menunggu' ? (
          <p className={styles.tenggat}>
            <Ikon nama="jam" ukuran={14} tebal={2} />
            Jawab sebelum {undangan.batasJawab} · {undangan.sisa}
          </p>
        ) : null}

        {undangan.status === 'konflik' && undangan.timKonflik ? (
          <p className={styles.konflik}>
            <Ikon nama="seru" ukuran={14} tebal={2.2} />
            Kamu sudah bergabung di {undangan.timKonflik} pada cabang yang sama, jadi undangan ini
            tidak bisa diterima.
          </p>
        ) : null}

        {undangan.penutup ? <p className={styles.penutup}>{undangan.penutup}</p> : null}
      </div>

      <div className={styles.aksi}>
        {aktif ? <KeputusanUndangan undangan={undangan} ringkas /> : null}
        <Link href={`/undangan-tim/${undangan.token}`} className={styles.tautan}>
          Lihat detail undangan
        </Link>
      </div>
    </article>
  );
}
