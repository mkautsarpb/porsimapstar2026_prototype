import Image from 'next/image';
import Link from 'next/link';
import type { LombaSaya } from '@/types/peserta';
import { Ikon } from './Ikon';
import { StatusBadge } from './StatusBadge';
import ui from './ui.module.css';
import styles from './KartuLomba.module.css';

/**
 * Kartu satu pendaftaran lomba. Dipakai di dashboard dan di halaman Lomba saya,
 * jadi aksinya ditentukan pemanggil lewat prop, bukan dihitung di dalam.
 */
export function KartuLomba({ lomba }: { readonly lomba: LombaSaya }) {
  const persen = Math.min(100, Math.round((lomba.kuotaTerpakai / lomba.kuotaTotal) * 100));
  const hampirPenuh = persen >= 90;

  return (
    <article className={`${ui.kartu} ${styles.kartu}`}>
      <div className={styles.kepala}>
        <Image
          src={`/uploads/icon_cabor/${lomba.ikon}.svg`}
          alt=""
          width={40}
          height={40}
          className={styles.ikonCabang}
        />

        <div className={styles.identitas}>
          <h3 className={styles.nama}>
            <Link href={`/lomba-saya/${lomba.id}`} className={styles.namaTautan}>
              {lomba.nama}
            </Link>
          </h3>
          <span className={styles.chipBaris}>
            <span className={ui.chip}>{lomba.kategori}</span>
            <span className={ui.chip}>{lomba.tipe}</span>
            {lomba.peran ? <span className={ui.chip}>{lomba.peran}</span> : null}
          </span>
        </div>

        <StatusBadge status={lomba.status} />
      </div>

      {lomba.roster && lomba.rosterTeks ? (
        <div className={styles.roster}>
          <span aria-hidden="true" className={styles.avatarBaris}>
            {lomba.roster.map((a) => (
              <span key={a.inisial} data-nada={a.nada} className={styles.avatar}>
                {a.inisial}
              </span>
            ))}
          </span>
          <span className={styles.rosterTeks}>{lomba.rosterTeks}</span>
        </div>
      ) : null}

      <div className={styles.kuota}>
        <span className={styles.kuotaBaris}>
          Kuota peserta
          <span className={styles.kuotaAngka}>
            {lomba.kuotaTerpakai} / {lomba.kuotaTotal} {lomba.kuotaSatuan}
          </span>
        </span>
        <span aria-hidden="true" className={ui.meter}>
          <span
            style={{ width: `${persen}%` }}
            className={`${ui.meterIsi} ${hampirPenuh ? ui.meterPenuh : ''}`}
          />
        </span>
      </div>

      <p className={styles.jadwal}>
        <Ikon nama="kalender" ukuran={16} />
        <span>{lomba.jadwalTeks}</span>
      </p>

      <div className={styles.aksi}>
        <Link href={`/lomba-saya/${lomba.id}`} className={ui.tombol}>
          Lihat detail
        </Link>
        {lomba.tipe === 'Tim' && !lomba.riwayat ? (
          <Link href={`/lomba-saya/${lomba.id}?tab=tim`} className={`${ui.tombol} ${ui.tombolSky}`}>
            Kelola tim
          </Link>
        ) : null}
        {lomba.status === 'terverifikasi' ? (
          <Link href={`/lomba-saya/${lomba.id}?tab=qr`} className={`${ui.tombol} ${ui.tombolUtama}`}>
            Buka QR
          </Link>
        ) : null}
      </div>
    </article>
  );
}
