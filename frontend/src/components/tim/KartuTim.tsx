import Link from 'next/link';
import { Ikon } from '@/components/app/Ikon';
import { Lencana } from '@/components/app/Lencana';
import { LABEL_STATUS_TIM } from '@/data/tim';
import type { Tim } from '@/types/tim';
import ui from '@/components/app/ui.module.css';
import { MeterRoster } from './MeterRoster';
import styles from './KartuTim.module.css';

/**
 * Kartu satu tim di halaman Tim Saya.
 *
 * Aksi yang muncul mengikuti peran dan keadaan roster: ketua pada tim yang
 * belum dikunci melihat kelola + undang, anggota hanya melihat detail. Tombol
 * yang tidak boleh dipakai dihilangkan, bukan ditampilkan dalam keadaan mati
 * (agents.md §9 FE-TEAM-208) — dan penyembunyian ini tetap dibarengi penolakan
 * di backend, bukan menggantikannya (§0 prinsip 2).
 */
export function KartuTim({ tim }: { readonly tim: Tim }) {
  const ketua = tim.peranSaya === 'Ketua';
  const status = LABEL_STATUS_TIM[tim.status];

  return (
    <article className={`${ui.kartu} ${styles.kartu}`}>
      <span aria-hidden="true" className={styles.lambang}>
        {tim.inisial}
      </span>

      <div className={styles.isi}>
        <div className={styles.judulBaris}>
          <h3 className={styles.nama}>
            <Link href={`/tim/${tim.id}`}>{tim.nama}</Link>
          </h3>
          <span className={styles.peran}>{tim.peranSaya}</span>
          <Lencana label={status.label} nada={status.nada} ikon={ketua ? 'orangBanyak' : 'centang'} />
        </div>

        <p className={styles.meta}>
          {tim.lomba} · {ketua ? tim.institusi : `Ketua: ${tim.ketua}`}
        </p>

        <p className={styles.ringkasan}>{tim.ringkasan}</p>

        <MeterRoster
          bergabung={tim.bergabung}
          menunggu={tim.menunggu}
          minimal={tim.minimal}
        />
      </div>

      <div className={styles.aksi}>
        {ketua && !tim.terkunci ? (
          <>
            <Link href={`/tim/${tim.id}`} className={`${ui.tombol} ${ui.tombolUtama}`}>
              Kelola tim
            </Link>
            <Link href={`/tim/${tim.id}?undang=1`} className={ui.tombol}>
              Undang anggota
            </Link>
          </>
        ) : (
          <Link href={`/tim/${tim.id}`} className={ui.tombol}>
            Lihat detail tim
          </Link>
        )}

        <p className={styles.tenggat}>
          <Ikon nama="jam" ukuran={14} tebal={2} />
          {tim.terkunci
            ? `Roster dikunci ${tim.kunciPada}`
            : `Roster dikunci ${tim.kunciPada} · ${tim.sisaKunci}`}
        </p>
      </div>
    </article>
  );
}
