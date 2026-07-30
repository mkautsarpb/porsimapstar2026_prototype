import { Ikon } from '@/components/app/Ikon';
import type { AnggotaTim, TimLomba } from '@/data/lomba-detail';
import ui from '@/components/app/ui.module.css';
import tab from './tab.module.css';
import styles from './TabTim.module.css';

const KELENGKAPAN: Record<AnggotaTim['kelengkapan'], { label: string; nada: string }> = {
  lengkap: { label: 'Lengkap', nada: 'ok' },
  'perlu-revisi': { label: 'Perlu revisi', nada: 'warn' },
  menunggu: { label: 'Menunggu jawaban', nada: 'info' },
};

/**
 * Tab Tim: komposisi roster dan status kelengkapan tiap anggota.
 *
 * Yang tampil HANYA status ("lengkap" / "perlu revisi"), tidak pernah dokumen
 * atau data pribadi anggota lain — ketua pun tidak boleh melihatnya
 * (agents.md §9, FE-TEAM-207). Perbaikan diminta ke anggota yang bersangkutan,
 * bukan dikerjakan ketua.
 */
export function TabTim({ tim }: { readonly tim: TimLomba }) {
  const siap = tim.diterima >= tim.minimal;
  const kurang = Math.max(0, tim.minimal - tim.diterima);

  return (
    <div className={tab.kolom}>
      <div className={ui.kartu}>
        <div className={styles.kepala}>
          <span aria-hidden="true" className={styles.lambang}>
            {tim.nama
              .split(' ')
              .map((k) => k[0])
              .join('')
              .slice(0, 2)}
          </span>
          <div className={styles.identitas}>
            <h2 className={styles.nama}>{tim.nama}</h2>
            <p className={tab.teks}>
              {tim.institusi} · Ketua: {tim.ketua}
            </p>
          </div>
          <span data-nada={siap ? 'ok' : 'warn'} className={ui.badge}>
            <Ikon nama={siap ? 'centang' : 'seru'} ukuran={12} tebal={2.2} />
            {siap ? 'Roster siap' : `Butuh ${kurang} anggota lagi`}
          </span>
        </div>

        <p className={`${tab.teks} ${tab.jarakAtas}`}>
          {tim.diterima} dari minimal {tim.minimal} anggota diterima
          {tim.menunggu > 0 ? ` · ${tim.menunggu} undangan masih menunggu` : ''} · maksimal{' '}
          {tim.maksimal} anggota.
        </p>

        <span aria-hidden="true" className={`${ui.meter} ${tab.jarakAtas}`}>
          <span
            style={{ width: `${Math.min(100, Math.round((tim.diterima / tim.minimal) * 100))}%` }}
            className={ui.meterIsi}
          />
        </span>

        <div className={`${tab.info} ${tab.jarakAtas}`}>
          <span aria-hidden="true" className={tab.infoIkon}>
            <Ikon nama="orangBanyak" ukuran={16} />
          </span>
          <span>
            Hanya undangan berstatus diterima yang dihitung sebagai roster. Undangan yang menunggu,
            ditolak, atau kedaluwarsa tidak menambah jumlah anggota.
          </span>
        </div>
      </div>

      <div className={ui.kartu}>
        <h2 className={tab.judul}>Anggota</h2>

        <ul className={tab.daftar}>
          {tim.anggota.map((a) => {
            const k = KELENGKAPAN[a.kelengkapan];

            return (
              <li key={a.id} className={tab.baris}>
                <span aria-hidden="true" className={styles.avatar}>
                  {a.inisial}
                </span>
                <span className={tab.barisIsi}>
                  <span className={tab.barisJudul}>
                    {a.nama}
                    <span className={styles.peran}>{a.peran}</span>
                  </span>
                  <span className={tab.barisKet}>{a.keterangan}</span>
                </span>
                <span data-nada={k.nada} className={ui.badge}>
                  {k.label}
                </span>
              </li>
            );
          })}
        </ul>

        <p className={`${tab.teks} ${tab.jarakAtas}`}>
          Butuh anggota baru? Undang lewat kode peserta atau email dari halaman Tim saya. Pencarian
          anggota bukan direktori publik, jadi hanya kecocokan persis yang muncul.
        </p>
      </div>
    </div>
  );
}
