import Link from 'next/link';
import { Ikon } from '@/components/app/Ikon';
import { formatUmur, formatWaktu } from '@/lib/admin/format';
import { hitungUmurDetik } from '@/lib/admin/kebasian';
import { Band } from '../Band';
import type { PropsTab } from './props';
import styles from './TabSistem.module.css';

const LABEL_KEADAAN = {
  normal: 'Normal',
  perhatian: 'Perlu dipantau',
  gagal: 'Ada kegagalan',
} as const;

/**
 * Tab Sistem — hanya untuk akun berizin `integration.manage`.
 *
 * Ringkasan, bukan salinan kedua: tindakan sesungguhnya tetap di
 * `/admin/sinkronisasi` dan `/super/system-health`. Menduplikasi kontrolnya di
 * sini berarti dua tempat yang harus dijaga tetap sama.
 *
 * Baris, bukan kartu — bobotnya paling ringan sampai ada yang gagal.
 */
export function TabSistem({ data }: PropsTab) {
  const { kesehatan } = data;

  return (
    <div className={styles.tab}>
      <Band
        id="band-sistem"
        ikon="gear"
        judul="Integrasi dan kesehatan sistem"
        meta={`Diperiksa ${formatWaktu(kesehatan.diperiksaIso)}`}
        cakupan={
          kesehatan.jumlahBermasalah > 0
            ? `${kesehatan.jumlahBermasalah} dari ${kesehatan.jumlahLayanan} layanan bermasalah: ${kesehatan.namaBermasalah.join(', ')}. Selama ini berlangsung, angka di tab Lomba dan Operasional bisa tertinggal dari keadaan sebenarnya.`
            : undefined
        }
        kolom="penuh"
      >
        <ul className={styles.daftar}>
          {kesehatan.layanan.map((l) => {
            const umur = hitungUmurDetik(data.waktuServerIso, l.diperiksaIso);

            return (
              <li key={l.id} data-keadaan={l.keadaan} className={styles.baris}>
                <span aria-hidden="true" className={styles.ikon}>
                  <Ikon nama={l.ikon} ukuran={16} />
                </span>

                <div className={styles.isi}>
                  <p className={styles.judul}>
                    {l.nama}
                    <span className={styles.keadaan}>{LABEL_KEADAAN[l.keadaan]}</span>
                  </p>
                  <p className={styles.ringkas}>{l.ringkas}</p>
                  <p className={styles.rincian}>{l.rincian.join(' · ')}</p>
                </div>

                <span className={styles.waktu}>
                  {umur !== null ? `${formatUmur(umur)} lalu` : formatWaktu(l.diperiksaIso)}
                </span>

                {l.aksi ? (
                  <Link href={l.aksi.href} className={styles.aksi}>
                    {l.aksi.label}
                    <Ikon nama="panah" ukuran={12} tebal={2.4} />
                  </Link>
                ) : null}
              </li>
            );
          })}
        </ul>
      </Band>

      <p className={styles.catatan}>
        Kanal notifikasi hanya email dan in-app. Pengaturan integrasi, kredensial, dan retensi
        data ada di Super Admin — tab ini sengaja tidak menduplikasinya.
      </p>
    </div>
  );
}
