import styles from './MeterRoster.module.css';

/**
 * Meter roster tiga segmen: bergabung · undangan menunggu · slot minimum yang
 * belum diundang.
 *
 * Segmen "menunggu" digambar terpisah dan diberi arsir supaya tidak terbaca
 * sebagai anggota — hanya undangan berstatus diterima yang masuk roster
 * (agents.md §9). Angkanya datang jadi dari server; komponen ini hanya
 * mengubahnya menjadi lebar dan legenda teks, dan legenda selalu ada supaya
 * meter tidak menyampaikan makna lewat warna saja (§7).
 */
export function MeterRoster({
  bergabung,
  menunggu,
  minimal,
  catatan,
}: {
  readonly bergabung: number;
  readonly menunggu: number;
  readonly minimal: number;
  readonly catatan?: string;
}) {
  const persen = (n: number) => `${Math.min(100, Math.round((n / Math.max(1, minimal)) * 100))}%`;
  const belum = Math.max(0, minimal - bergabung - menunggu);

  return (
    <div className={styles.blok}>
      <span aria-hidden="true" className={styles.meter}>
        <span style={{ width: persen(bergabung) }} className={styles.isiBergabung} />
        <span style={{ width: persen(Math.min(menunggu, minimal - bergabung)) }} className={styles.isiMenunggu} />
      </span>

      <ul className={styles.legenda}>
        <li className={styles.item}>
          <span aria-hidden="true" className={`${styles.titik} ${styles.titikBergabung}`} />
          {bergabung} bergabung
        </li>
        <li className={styles.item}>
          <span aria-hidden="true" className={`${styles.titik} ${styles.titikMenunggu}`} />
          {menunggu} undangan menunggu
        </li>
        {belum > 0 ? (
          <li className={styles.item}>
            <span aria-hidden="true" className={`${styles.titik} ${styles.titikBelum}`} />
            {belum} slot minimum belum diundang
          </li>
        ) : null}
      </ul>

      {catatan ? <p className={styles.catatan}>{catatan}</p> : null}
    </div>
  );
}
