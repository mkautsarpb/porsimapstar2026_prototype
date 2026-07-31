import { Ikon } from '@/components/app/Ikon';
import { Lencana } from '@/components/app/Lencana';
import type { Tim } from '@/types/tim';
import { AksiRoster } from './AksiRoster';
import styles from './RosterTim.module.css';

/**
 * Roster tim sebagai tabel di desktop dan tumpukan kartu di mobile — satu
 * markup, dua tampilan (agents.md §7).
 *
 * Yang TIDAK pernah muncul di sini: dokumen, NIK, atau data identitas anggota
 * lain. Ketua hanya melihat status "lengkap / perlu revisi / ditolak", dan
 * ajakan perbaikan selalu dikirim ke anggotanya, bukan diberikan ke ketua untuk
 * dikerjakan (agents.md §9, FE-TEAM-207).
 */
export function RosterTim({ tim, kelola }: { readonly tim: Tim; readonly kelola: boolean }) {
  return (
    <div className={styles.bingkai}>
      <table className={styles.tabel}>
        <caption className={styles.caption}>
          Roster {tim.nama} — {tim.bergabung} bergabung, {tim.menunggu} undangan menunggu, minimal{' '}
          {tim.minimal} dan maksimal {tim.maksimal} anggota.
        </caption>
        <thead>
          <tr>
            <th scope="col">Anggota</th>
            <th scope="col">Status undangan</th>
            <th scope="col">Profil</th>
            <th scope="col">Dokumen</th>
            <th scope="col">Syarat</th>
            {kelola ? <th scope="col">Aksi</th> : null}
          </tr>
        </thead>
        <tbody>
          {tim.anggota.map((a) => {
            const menunggu = a.keanggotaan === 'menunggu';

            return (
              <tr key={a.id} className={styles.baris}>
                <td data-label="Anggota">
                  <span className={styles.orang}>
                    <span aria-hidden="true" className={styles.avatar}>
                      {a.inisial}
                    </span>
                    <span className={styles.identitas}>
                      <span className={styles.nama}>
                        {a.nama}
                        {a.ketua ? <span className={styles.peran}>Ketua</span> : null}
                      </span>
                      <span className={styles.kode}>{a.identitas}</span>
                    </span>
                  </span>
                </td>

                <td data-label="Status undangan">
                  <Lencana
                    label={menunggu ? 'Menunggu jawaban' : 'Bergabung'}
                    nada={menunggu ? 'warn' : 'ok'}
                    ikon={menunggu ? 'jam' : 'centang'}
                  />
                  {a.berlakuSampai ? <span className={styles.subteks}>{a.berlakuSampai}</span> : null}
                </td>

                {menunggu ? (
                  <td data-label="Kelengkapan" colSpan={3} className={styles.belum}>
                    Belum dihitung sebagai anggota. Kelengkapan baru terlihat setelah undangan
                    diterima.
                  </td>
                ) : (
                  <>
                    <td data-label="Profil">
                      {a.profil ? <Lencana label={a.profil.label} nada={a.profil.nada} /> : '—'}
                    </td>
                    <td data-label="Dokumen">
                      {a.dokumen ? <Lencana label={a.dokumen.label} nada={a.dokumen.nada} /> : '—'}
                    </td>
                    <td data-label="Syarat">
                      {a.syarat ? <Lencana label={a.syarat.label} nada={a.syarat.nada} /> : '—'}
                    </td>
                  </>
                )}

                {kelola ? (
                  <td data-label="Aksi">
                    <AksiRoster anggota={a} timNama={tim.nama} terkunci={tim.terkunci} />
                  </td>
                ) : null}
              </tr>
            );
          })}
        </tbody>
      </table>

      {tim.anggota
        .filter((a) => a.catatan)
        .map((a) => (
          <p key={`catatan-${a.id}`} className={styles.catatan}>
            <span aria-hidden="true" className={styles.catatanIkon}>
              <Ikon nama="seru" ukuran={16} tebal={2} />
            </span>
            {a.catatan}
          </p>
        ))}

      {tim.catatanRoster ? <p className={styles.penutup}>{tim.catatanRoster}</p> : null}
    </div>
  );
}
