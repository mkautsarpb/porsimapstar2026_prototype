import styles from './TabelNilai.module.css';

/**
 * Kembaran tabel untuk setiap grafik.
 *
 * Wajib ada, bukan pelengkap: tooltip tidak boleh menjadi satu-satunya cara
 * membaca sebuah nilai. Tabel ini juga yang membuat pasangan warna berkontras
 * rendah tetap sah dipakai — nilainya selalu bisa dibaca tanpa membedakan warna
 * sama sekali.
 *
 * Memakai `<details>` supaya tidak menambah tinggi kartu saat tertutup, tapi
 * tetap bisa dicapai keyboard tanpa JavaScript apa pun.
 */
export function TabelNilai({
  ringkasan,
  kolom,
  baris,
}: {
  readonly ringkasan: string;
  readonly kolom: readonly string[];
  readonly baris: readonly (readonly string[])[];
}) {
  return (
    <details className={styles.detail}>
      <summary className={styles.ringkasan}>Tabel nilai — {ringkasan}</summary>

      <div className={styles.bungkus}>
        <table className={styles.tabel}>
          <thead>
            <tr>
              {kolom.map((k) => (
                <th key={k} scope="col">
                  {k}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {baris.map((r) => (
              <tr key={r[0]}>
                {r.map((sel, i) =>
                  i === 0 ? (
                    <th key={sel} scope="row">
                      {sel}
                    </th>
                  ) : (
                    <td key={`${r[0]}-${kolom[i] ?? i}`}>{sel}</td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}
