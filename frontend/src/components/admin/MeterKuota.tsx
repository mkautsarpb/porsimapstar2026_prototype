import type { RentangKuota } from '@/types/admin';
import adm from './adm.module.css';
import styles from './MeterKuota.module.css';

/**
 * Meter kuota area admin.
 *
 * Berbeda dari `lib/kuota.ts` yang dipakai portal publik: yang itu selalu
 * menghitung dalam satuan peserta karena kartu lomba publik memang begitu.
 * Di Panel Panitia satuannya ikut data — cabang tim menghitung TIM, cabang
 * individu menghitung ORANG — dan satuannya SELALU dicetak bersama angkanya.
 * Kapasitas 16 pada cabang tim berarti 16 tim, bukan 16 orang, dan itu salah
 * paham yang paling sering terjadi di modul ini.
 *
 * `aria-label` mengulang seluruh kalimatnya karena bar-nya sendiri tidak terbaca
 * pembaca layar, dan status tidak boleh hanya mengandalkan warna (agents.md §7).
 */
export function MeterKuota({ kuota }: { readonly kuota: RentangKuota }) {
  const { terisi, kapasitas, satuan, daftarTunggu } = kuota;

  if (kapasitas === null) {
    return (
      <div className={styles.blok}>
        <p className={styles.angka}>
          {terisi} {satuan} · tanpa batas kapasitas
        </p>
        <p className={adm.catatan}>
          Mode kuota tak terbatas: pendaftaran hanya berhenti pada tenggat.
        </p>
      </div>
    );
  }

  const persen = kapasitas > 0 ? Math.min(100, Math.round((terisi / kapasitas) * 100)) : 0;
  const nada = persen >= 100 ? 'danger' : persen >= 80 ? 'warn' : undefined;

  return (
    <div className={styles.blok}>
      <p className={styles.angka}>
        {terisi} dari {kapasitas} {satuan}
      </p>

      <span
        role="img"
        aria-label={`${terisi} dari ${kapasitas} ${satuan} terisi, ${persen} persen${
          daftarTunggu > 0 ? `, ditambah ${daftarTunggu} di daftar tunggu` : ''
        }`}
        className={adm.meter}
      >
        <span data-nada={nada} style={{ width: `${persen}%` }} className={adm.meterIsi} />
      </span>

      {daftarTunggu > 0 ? (
        <p className={styles.tunggu}>
          +{daftarTunggu} {satuan} menunggu
        </p>
      ) : null}
    </div>
  );
}
