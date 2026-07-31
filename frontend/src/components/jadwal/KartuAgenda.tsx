import Link from 'next/link';
import { Ikon } from '@/components/app/Ikon';
import { Lencana } from '@/components/app/Lencana';
import type { AgendaSaya } from '@/types/peserta';
import ui from '@/components/app/ui.module.css';
import styles from './KartuAgenda.module.css';

/**
 * Satu agenda di linimasa Jadwal Saya.
 *
 * Jadwal yang berubah menampilkan jam lama dicoret di samping jam baru, plus
 * siapa mengubahnya dan kapan — perubahan tidak pernah menggantikan angka lama
 * secara diam-diam. Konflik waktu ditampilkan pada KEDUA agenda yang bertabrakan
 * dan tidak ada yang disembunyikan, karena hanya panitia yang boleh memindahkan.
 */
export function KartuAgenda({ agenda }: { readonly agenda: AgendaSaya }) {
  const selesai = agenda.keadaan === 'selesai';

  return (
    <article data-keadaan={agenda.keadaan} className={`${ui.kartu} ${styles.kartu}`}>
      <span aria-hidden="true" className={`${styles.tanggal} ${selesai ? styles.tanggalSelesai : ''}`}>
        <span className={styles.tanggalAngka}>{agenda.tanggal}</span>
        <span className={styles.tanggalBulan}>{agenda.bulan}</span>
      </span>

      <div className={styles.isi}>
        <div className={styles.judulBaris}>
          <h3 className={styles.nama}>{agenda.nama}</h3>
          {agenda.keadaan === 'berubah' ? (
            <Lencana label="Jadwal berubah" nada="warn" ikon="ulang" />
          ) : null}
          {agenda.keadaan === 'konflik' ? (
            <Lencana label="Konflik waktu" nada="danger" ikon="seru" />
          ) : null}
          {selesai ? <Lencana label="Selesai" nada="ok" ikon="centang" /> : null}
        </div>

        {agenda.subjudul ? <p className={styles.subjudul}>{agenda.subjudul}</p> : null}

        <p className={styles.waktu}>
          {agenda.jamLama ? <s className={styles.jamLama}>{agenda.jamLama}</s> : null}
          <strong className={styles.jam}>{agenda.jam}</strong>
          <span className={styles.venue}>· {agenda.venue}</span>
        </p>

        {agenda.catatan ? <p className={styles.catatan}>{agenda.catatan}</p> : null}

        {agenda.perubahan ? (
          <div className={`${ui.panel} ${ui.panelPeringatan} ${styles.blok}`}>
            <span aria-hidden="true" className={ui.panelIkon}>
              <Ikon nama="ulang" ukuran={16} />
            </span>
            <span>{agenda.perubahan}</span>
          </div>
        ) : null}

        {agenda.konflik ? (
          <div className={`${ui.panel} ${ui.panelBahaya} ${styles.blok}`}>
            <span aria-hidden="true" className={ui.panelIkon}>
              <Ikon nama="seru" ukuran={16} />
            </span>
            <span>
              {agenda.konflik}{' '}
              <Link href="/bantuan?jenis=jadwal">Laporkan ke panitia</Link>.
            </span>
          </div>
        ) : null}

        {agenda.lombaId ? (
          <Link href={`/lomba-saya/${agenda.lombaId}?tab=jadwal`} className={styles.tautan}>
            Buka detail cabang
          </Link>
        ) : null}
      </div>
    </article>
  );
}
