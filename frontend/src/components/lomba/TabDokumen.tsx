import Link from 'next/link';
import { Ikon } from '@/components/app/Ikon';
import type { BerkasLomba } from '@/data/lomba-detail';
import ui from '@/components/app/ui.module.css';
import tab from './tab.module.css';
import styles from './TabDokumen.module.css';

const KEADAAN: Record<BerkasLomba['keadaan'], { label: string; nada: string }> = {
  diterima: { label: 'Diterima', nada: 'ok' },
  'perlu-revisi': { label: 'Perlu revisi', nada: 'warn' },
  menunggu: { label: 'Sedang diperiksa', nada: 'info' },
};

/**
 * Tab Dokumen: berkas dari panitia dan berkas yang kamu unggah.
 *
 * Dokumen identitas tidak pernah dipratinjau di sini — hanya nama, ukuran, dan
 * status. Unduhan aslinya nanti memakai signed URL berumur pendek dari server
 * (agents.md §6).
 */
export function TabDokumen({
  berkas,
  lombaId,
}: {
  readonly berkas: readonly BerkasLomba[];
  readonly lombaId: string;
}) {
  const dariPanitia = berkas.filter((b) => b.sumber === 'panitia');
  const dariPeserta = berkas.filter((b) => b.sumber === 'peserta');
  const perluRevisi = dariPeserta.filter((b) => b.keadaan === 'perlu-revisi');

  if (berkas.length === 0) {
    return (
      <div className={ui.kartu}>
        <p className={tab.kosong}>Belum ada berkas untuk pendaftaran ini.</p>
      </div>
    );
  }

  return (
    <div className={tab.kolom}>
      {perluRevisi.length > 0 ? (
        <div className={`${tab.info} ${tab.peringatan}`}>
          <span aria-hidden="true" className={tab.infoIkon}>
            <Ikon nama="seru" ukuran={16} />
          </span>
          <span>
            {perluRevisi.length} berkas perlu kamu unggah ulang sebelum pendaftaran bisa diproses lagi.
            Panitia menuliskan alasannya di tiap berkas.
          </span>
        </div>
      ) : null}

      {dariPanitia.length > 0 ? (
        <div className={ui.kartu}>
          <h2 className={tab.judul}>Berkas dari panitia</h2>
          <ul className={tab.daftar}>
            {dariPanitia.map((b) => (
              <li key={b.id} className={tab.baris}>
                <span aria-hidden="true" className={styles.ikon}>
                  <Ikon nama="berkas" ukuran={18} />
                </span>
                <span className={tab.barisIsi}>
                  <span className={tab.barisJudul}>{b.nama}</span>
                  <span className={tab.barisKet}>{b.keterangan}</span>
                  <span className={styles.meta}>{b.meta}</span>
                </span>
                {/* TODO(api-contract): ganti dengan signed URL berumur pendek dari server. */}
                <span className={`${ui.tombol} ${ui.tombolKecil} ${styles.tombolMati}`}>
                  <Ikon nama="unduh" ukuran={14} tebal={2.2} />
                  Unduh
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {dariPeserta.length > 0 ? (
        <div className={ui.kartu}>
          <h2 className={tab.judul}>Berkas yang kamu unggah</h2>
          <ul className={tab.daftar}>
            {dariPeserta.map((b) => {
              const k = KEADAAN[b.keadaan];

              return (
                <li key={b.id} data-keadaan={b.keadaan} className={tab.baris}>
                  <span aria-hidden="true" className={styles.ikon}>
                    <Ikon nama="berkas" ukuran={18} />
                  </span>
                  <span className={tab.barisIsi}>
                    <span className={tab.barisJudul}>{b.nama}</span>
                    <span className={tab.barisKet}>{b.keterangan}</span>
                    <span className={styles.meta}>{b.meta}</span>
                  </span>
                  <span data-nada={k.nada} className={ui.badge}>
                    {k.label}
                  </span>
                  {b.keadaan === 'perlu-revisi' ? (
                    <Link
                      href={`/dokumen?lomba=${lombaId}&berkas=${b.id}`}
                      className={`${ui.tombol} ${ui.tombolUtama} ${ui.tombolKecil}`}
                    >
                      Unggah ulang
                    </Link>
                  ) : null}
                </li>
              );
            })}
          </ul>

          <p className={`${tab.teks} ${tab.jarakAtas}`}>
            Format yang diterima: JPG atau PDF, maksimal 2 MB per berkas. Panitia memeriksa ulang setiap
            unggahan baru, jadi status akan kembali ke &quot;sedang diperiksa&quot;.
          </p>
        </div>
      ) : null}
    </div>
  );
}
