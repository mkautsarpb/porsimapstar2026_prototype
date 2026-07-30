import Image from 'next/image';
import Link from 'next/link';
import { Ikon } from '@/components/app/Ikon';
import { StatusBadge } from '@/components/app/StatusBadge';
import type { LombaSaya } from '@/types/peserta';
import ui from '@/components/app/ui.module.css';
import styles from './KartuLombaLengkap.module.css';

/**
 * Kartu lomba versi daftar "Lomba saya": lebih lebar dari versi dashboard dan
 * menjelaskan status — arti, catatan panitia, dan tenggat — supaya peserta tahu
 * apa yang harus dilakukan tanpa membuka detail.
 */
export function KartuLombaLengkap({ lomba }: { readonly lomba: LombaSaya }) {
  const persen = Math.min(100, Math.round((lomba.kuotaTerpakai / lomba.kuotaTotal) * 100));
  const perluTindakan = lomba.status === 'perlu-perbaikan';

  return (
    <article className={`${ui.kartu} ${styles.kartu}`}>
      <div className={styles.kepala}>
        <Image
          src={`/uploads/icon_cabor/${lomba.ikon}.svg`}
          alt=""
          width={44}
          height={44}
          className={styles.ikon}
        />

        <div className={styles.identitas}>
          <h2 className={styles.nama}>
            <Link href={`/lomba-saya/${lomba.id}`} className={styles.namaTautan}>
              {lomba.nama}
            </Link>
          </h2>
          <span className={styles.chipBaris}>
            <span className={ui.chip}>{lomba.kategori}</span>
            <span className={ui.chip}>{lomba.tipe === 'Tim' ? 'Lomba tim' : 'Perorangan'}</span>
            {lomba.peran ? <span className={ui.chip}>{lomba.peran}</span> : null}
          </span>
          <p className={styles.arti}>{lomba.artiStatus}</p>
        </div>

        <StatusBadge status={lomba.status} />
      </div>

      {lomba.catatanPanitia ? (
        <div className={styles.catatan}>
          <span aria-hidden="true" className={styles.catatanIkon}>
            <Ikon nama="seru" ukuran={16} />
          </span>
          <div>
            <p className={styles.catatanJudul}>Catatan panitia</p>
            <p className={styles.catatanTeks}>{lomba.catatanPanitia}</p>
          </div>
        </div>
      ) : null}

      {lomba.rosterTeks ? (
        <p className={styles.roster}>
          {lomba.roster ? (
            <span aria-hidden="true" className={styles.avatarBaris}>
              {lomba.roster.map((a) => (
                <span key={a.inisial} data-nada={a.nada} className={styles.avatar}>
                  {a.inisial}
                </span>
              ))}
            </span>
          ) : null}
          {lomba.rosterTeks}
        </p>
      ) : null}

      <dl className={styles.meta}>
        <div className={styles.metaItem}>
          <dt className={styles.metaLabel}>Jadwal</dt>
          <dd className={styles.metaNilai}>{lomba.jadwalTeks}</dd>
        </div>
        <div className={styles.metaItem}>
          <dt className={styles.metaLabel}>Kuota</dt>
          <dd className={styles.metaNilai}>
            {lomba.kuotaTerpakai} / {lomba.kuotaTotal} {lomba.kuotaSatuan} ({persen}%)
          </dd>
        </div>
        <div className={styles.metaItem}>
          <dt className={styles.metaLabel}>Nomor referensi</dt>
          <dd className={styles.metaNilai}>{lomba.nomorReferensi}</dd>
        </div>
        <div className={styles.metaItem}>
          <dt className={styles.metaLabel}>Didaftarkan</dt>
          <dd className={styles.metaNilai}>{lomba.didaftarkan}</dd>
        </div>
      </dl>

      <div className={styles.kaki}>
        {lomba.tenggat ? (
          <p data-perlu={perluTindakan} className={styles.tenggat}>
            <Ikon nama="jam" ukuran={16} tebal={2} />
            {lomba.tenggat}
          </p>
        ) : (
          <span />
        )}

        <div className={styles.aksi}>
          <Link href={`/lomba-saya/${lomba.id}`} className={ui.tombol}>
            Lihat detail
          </Link>
          {perluTindakan ? (
            <Link
              href={`/lomba-saya/${lomba.id}?tab=dokumen`}
              className={`${ui.tombol} ${ui.tombolUtama}`}
            >
              Perbaiki dokumen
            </Link>
          ) : null}
          {lomba.status === 'terverifikasi' ? (
            <Link href={`/lomba-saya/${lomba.id}?tab=qr`} className={`${ui.tombol} ${ui.tombolSky}`}>
              Buka QR
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}
