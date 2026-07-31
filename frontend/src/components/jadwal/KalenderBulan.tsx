import Link from 'next/link';
import { Ikon } from '@/components/app/Ikon';
import { NAMA_HARI, bangunBulan, geserBulan, labelBulan } from '@/lib/kalender';
import type { AgendaSaya } from '@/types/peserta';
import styles from './KalenderBulan.module.css';

const PENANDA: Record<AgendaSaya['keadaan'], string> = {
  konflik: 'Konflik waktu',
  berubah: 'Jadwal berubah',
  selesai: 'Selesai',
  normal: 'Terjadwal',
};

/**
 * Kalender bulanan Jadwal Saya.
 *
 * Bulan yang ditampilkan ada di query URL, dan navigasinya berupa tautan biasa
 * — kalender tetap bisa dipakai sebelum JS termuat dan posisinya bisa
 * ditautkan. Tiap penanda membawa teks keadaan, bukan hanya warna (§7).
 */
export function KalenderBulan({
  bulan,
  agenda,
  tautan,
}: {
  readonly bulan: string;
  readonly agenda: readonly AgendaSaya[];
  /** Pembangun URL halaman ini untuk bulan lain. */
  readonly tautan: (bulan: string) => string;
}) {
  const hari = bangunBulan(bulan, agenda);

  return (
    <div className={styles.kalender}>
      <div className={styles.kepala}>
        <h3 className={styles.judul}>{labelBulan(bulan)}</h3>
        <div className={styles.navigasi}>
          <Link
            href={tautan(geserBulan(bulan, -1))}
            aria-label={`Lihat ${labelBulan(geserBulan(bulan, -1))}`}
            className={styles.tombolNav}
          >
            <span className={styles.putarKiri}>
              <Ikon nama="panah" ukuran={16} tebal={2.2} />
            </span>
          </Link>
          <Link
            href={tautan(geserBulan(bulan, 1))}
            aria-label={`Lihat ${labelBulan(geserBulan(bulan, 1))}`}
            className={styles.tombolNav}
          >
            <Ikon nama="panah" ukuran={16} tebal={2.2} />
          </Link>
        </div>
      </div>

      <div className={styles.kisi}>
        {NAMA_HARI.map((h) => (
          <span key={h} className={styles.namaHari}>
            {h}
          </span>
        ))}

        {hari.map((h) => (
          <div key={h.iso} data-luar={h.luarBulan} className={styles.sel}>
            <span className={styles.angka}>{h.angka}</span>
            {h.agenda.map((a) => (
              <span key={a.id} data-keadaan={a.keadaan} className={styles.penanda}>
                {a.nama.split(' · ')[0]} · {PENANDA[a.keadaan]}
              </span>
            ))}
          </div>
        ))}
      </div>

      <ul className={styles.legenda}>
        <li>
          <span aria-hidden="true" className={`${styles.titik} ${styles.titikKonflik}`} /> Konflik
          waktu
        </li>
        <li>
          <span aria-hidden="true" className={`${styles.titik} ${styles.titikBerubah}`} /> Berubah /
          tenggat
        </li>
        <li>
          <span aria-hidden="true" className={`${styles.titik} ${styles.titikSelesai}`} /> Selesai
        </li>
      </ul>
    </div>
  );
}
