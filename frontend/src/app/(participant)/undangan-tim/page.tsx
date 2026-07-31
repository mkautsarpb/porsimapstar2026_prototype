import type { Metadata } from 'next';
import Link from 'next/link';
import { Ikon } from '@/components/app/Ikon';
import { KepalaHalaman } from '@/components/app/KepalaHalaman';
import { BadgeUndangan } from '@/components/tim/BadgeUndangan';
import { KartuUndangan } from '@/components/tim/KartuUndangan';
import { LABEL_UNDANGAN, TAB_UNDANGAN, UNDANGAN, type IdTabUndangan } from '@/data/tim';
import type { StatusUndangan } from '@/types/tim';
import ui from '@/components/app/ui.module.css';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Kotak undangan',
  robots: { index: false, follow: false },
};

type Query = Record<string, string | readonly string[] | undefined>;

function satu(nilai: string | readonly string[] | undefined): string | undefined {
  return Array.isArray(nilai) ? nilai[0] : (nilai as string | undefined);
}

const KOSONG: Record<IdTabUndangan, string> = {
  menunggu: 'Tidak ada undangan yang menunggu jawabanmu sekarang.',
  diterima: 'Kamu belum pernah menerima undangan tim.',
  ditolak: 'Kamu belum pernah menolak undangan tim.',
  kedaluwarsa: 'Belum ada undangan yang lewat tenggat tanpa jawaban.',
  dibatalkan: 'Belum ada undangan yang ditarik ketua atau dicabut panitia.',
};

/**
 * /undangan-tim — kotak undangan peserta.
 *
 * Tab disimpan di query URL supaya posisi bertahan saat kembali dari halaman
 * detail undangan (AC-FE-13). Undangan riwayat tidak pernah membawa tombol
 * Terima/Tolak yang mati; yang muncul hanya penjelasan apa yang terjadi.
 */
export default async function KotakUndanganPage({
  searchParams,
}: {
  readonly searchParams: Promise<Query>;
}) {
  const query = await searchParams;
  const diminta = satu(query.tab);
  const tab: IdTabUndangan =
    TAB_UNDANGAN.find((t) => t.id === diminta)?.id ?? 'menunggu';

  const jumlah = (status: readonly StatusUndangan[]) =>
    UNDANGAN.filter((u) => status.includes(u.status)).length;

  const aktif = TAB_UNDANGAN.find((t) => t.id === tab);
  const daftar = UNDANGAN.filter((u) => aktif?.status.includes(u.status));
  const menunggu = jumlah(['menunggu']);

  return (
    <div className={ui.halaman}>
      <KepalaHalaman
        judul="Kotak undangan"
        ringkasan="Undangan tim yang dikirim kepadamu. Menerima undangan tidak otomatis mendaftarkanmu — ketua tetap harus mensubmit tim sebelum roster dikunci."
        kembali={{ href: '/tim', label: 'Kembali ke Tim saya' }}
        aksi={
          menunggu > 0 ? (
            <span className={styles.sorot}>
              <Ikon nama="jam" ukuran={14} tebal={2} />
              {menunggu} menunggu jawabanmu
            </span>
          ) : null
        }
      />

      <div role="tablist" aria-label="Status undangan" className={ui.tabBar}>
        {TAB_UNDANGAN.map((t) => (
          <Link
            key={t.id}
            href={t.id === 'menunggu' ? '/undangan-tim' : `/undangan-tim?tab=${t.id}`}
            role="tab"
            aria-selected={tab === t.id}
            data-aktif={tab === t.id}
            className={ui.tabItem}
          >
            {t.label} <span className={ui.tabAngka}>{jumlah(t.status)}</span>
          </Link>
        ))}
      </div>

      <p aria-live="polite" className={ui.teks}>
        {daftar.length} undangan ditampilkan
      </p>

      {daftar.length > 0 ? (
        <div className={styles.daftar}>
          {daftar.map((u) => (
            <KartuUndangan key={u.id} undangan={u} />
          ))}
        </div>
      ) : (
        <div className={`${ui.kartu} ${ui.kosong}`}>
          <span aria-hidden="true" className={ui.kosongIkon}>
            <Ikon nama="amplop" ukuran={26} />
          </span>
          <h2 className={ui.kosongJudul}>Tidak ada undangan di tab ini</h2>
          <p className={ui.kosongTeks}>{KOSONG[tab]}</p>
          <Link href="/tim" className={ui.tombol}>
            Kembali ke Tim saya
          </Link>
        </div>
      )}

      <div className={ui.panel}>
        <span aria-hidden="true" className={ui.panelIkon}>
          <Ikon nama="bantuan" ukuran={18} />
        </span>
        <span>
          Undangan yang tidak dijawab sampai tenggat berpindah ke tab Kedaluwarsa dan slot tim
          kembali terbuka untuk orang lain. Kalau itu terjadi, minta ketua mengirim undangan baru.
        </span>
      </div>

      <details className={`${ui.kartu} ${styles.arti}`}>
        <summary className={styles.artiRingkas}>Arti tujuh status undangan</summary>
        <ul className={styles.artiDaftar}>
          {(Object.keys(LABEL_UNDANGAN) as StatusUndangan[]).map((s) => (
            <li key={s} className={styles.artiItem}>
              <BadgeUndangan status={s} />
              <span className={styles.artiIsi}>
                <span>
                  <strong>Arti:</strong> {LABEL_UNDANGAN[s].arti}
                </span>
                <span>
                  <strong>Tindakan:</strong> {LABEL_UNDANGAN[s].tindakan}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
