import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Ikon } from '@/components/app/Ikon';
import { BadgeUndangan } from '@/components/tim/BadgeUndangan';
import { KeputusanUndangan } from '@/components/tim/KeputusanUndangan';
import { LABEL_UNDANGAN, UNDANGAN, cariUndangan } from '@/data/tim';
import ui from '@/components/app/ui.module.css';
import styles from './page.module.css';

type Params = { readonly token: string };

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<Params>;
}): Promise<Metadata> {
  const { token } = await params;
  const undangan = cariUndangan(token);

  return {
    title: undangan ? `Undangan ${undangan.tim}` : 'Detail undangan',
    robots: { index: false, follow: false },
  };
}

export function generateStaticParams() {
  return UNDANGAN.map((u) => ({ token: u.token }));
}

const KONSEKUENSI = [
  'Kamu langsung terhitung sebagai anggota tim ini untuk cabang tersebut.',
  'Satu peserta hanya boleh bergabung di satu tim pada lomba yang sama. Setelah menerima, undangan lain di cabang ini otomatis ditandai konflik dan tidak bisa kamu terima.',
  'Kamu bisa keluar dari tim ini sampai roster dikunci. Setelah itu perubahan hanya lewat panitia.',
  'Dokumen dan kelengkapan profilmu tetap tanggung jawabmu sendiri; ketua hanya bisa mengingatkan.',
];

/**
 * /undangan-tim/[token] — layar keputusan satu undangan.
 *
 * Konsekuensi diletakkan di atas tombol, bukan di bawah: keputusan ini mengunci
 * cabang lomba untuk peserta. Untuk status yang tidak bisa lagi diputuskan,
 * tombol dihapus dan diganti penjelasan — tombol mati hanya membuat orang
 * mencoba berulang kali.
 *
 * Token yang tidak dikenal berakhir di 404 tanpa membedakan "tidak pernah ada"
 * dan "sudah dihapus" (INVITATION_NOT_FOUND, agents.md §9).
 */
export default async function DetailUndanganPage({
  params,
}: {
  readonly params: Promise<Params>;
}) {
  const { token } = await params;
  const undangan = cariUndangan(token);

  if (!undangan) notFound();

  const label = LABEL_UNDANGAN[undangan.status];
  const bisaDijawab = undangan.status === 'menunggu';
  const konflik = undangan.status === 'konflik';
  const tertutup = !bisaDijawab && !konflik;

  return (
    <div className={ui.halaman}>
      <nav aria-label="Remah roti" className={styles.remah}>
        <Link href="/undangan-tim">Kotak undangan</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{undangan.tim}</span>
      </nav>

      <header className={`${ui.kartu} ${styles.kepala}`}>
        <span aria-hidden="true" className={styles.lambang}>
          {undangan.inisial}
        </span>
        <div className={styles.identitas}>
          <div className={styles.judulBaris}>
            <h1 className={styles.judul}>Undangan bergabung: {undangan.tim}</h1>
            <BadgeUndangan status={undangan.status} besar />
          </div>
          <p className={styles.meta}>
            {undangan.lomba} · {undangan.institusi} · ketua {undangan.ketua}
          </p>
        </div>
      </header>

      <dl className={`${ui.kartu} ${styles.rincian}`}>
        <div>
          <dt>Dikirim</dt>
          <dd>{undangan.dikirim}</dd>
        </div>
        <div>
          <dt>Batas jawab</dt>
          <dd>
            {undangan.batasJawab}
            {undangan.sisa !== '—' ? ` · ${undangan.sisa}` : ''}
          </dd>
        </div>
        <div>
          <dt>Roster tim saat ini</dt>
          <dd>{undangan.rosterTim}</dd>
        </div>
        <div>
          <dt>Jadwal cabang</dt>
          <dd>{undangan.jadwalCabang}</dd>
        </div>
      </dl>

      {bisaDijawab ? (
        <section className={ui.kartu} aria-labelledby="konsekuensi">
          <h2 id="konsekuensi" className={ui.judulZona}>
            Yang terjadi kalau kamu menerima
          </h2>
          <ul className={styles.konsekuensi}>
            {KONSEKUENSI.map((k) => (
              <li key={k} className={styles.konsekuensiItem}>
                <span aria-hidden="true" className={styles.tanda}>
                  <Ikon nama="centang" ukuran={13} tebal={2.4} />
                </span>
                {k}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {konflik ? (
        <div className={`${ui.panel} ${ui.panelBahaya}`}>
          <span aria-hidden="true" className={ui.panelIkon}>
            <Ikon nama="seru" ukuran={18} />
          </span>
          <div className={styles.penjelasan}>
            <strong>Kamu sudah punya tim di lomba ini</strong>
            <p className={styles.penjelasanTeks}>
              Undangan ini untuk <strong>{undangan.lomba}</strong>, sementara kamu sudah bergabung di
              tim <strong>{undangan.timKonflik}</strong> pada cabang yang sama. Satu peserta hanya
              boleh bergabung di satu tim pada lomba yang sama, jadi undangan ini tidak bisa
              diterima.
            </p>
            <p className={styles.penjelasanTeks}>
              Kalau kamu memang ingin pindah, keluar dari {undangan.timKonflik} lebih dulu selama
              roster tim itu belum dikunci, lalu minta {undangan.tim} mengirim undangan baru.
            </p>
            {undangan.timKonflikId ? (
              <Link href={`/tim/${undangan.timKonflikId}`} className={ui.tombol}>
                Lihat tim {undangan.timKonflik}
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}

      {tertutup ? (
        <div className={ui.panel}>
          <span aria-hidden="true" className={ui.panelIkon}>
            <Ikon nama={label.ikon} ukuran={18} />
          </span>
          <div className={styles.penjelasan}>
            <strong>{undangan.penutup ?? label.label}</strong>
            <p className={styles.penjelasanTeks}>{label.arti}</p>
            <p className={styles.penjelasanTeks}>{label.tindakan}</p>
            <div className={styles.aksiTertutup}>
              <Link href="/undangan-tim" className={ui.tombol}>
                Kembali ke kotak undangan
              </Link>
              <Link href="/bantuan" className={ui.tombol}>
                Hubungi panitia
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      {bisaDijawab || konflik ? (
        <div className={`${ui.kartu} ${styles.keputusan}`}>
          <p className={ui.teks}>
            {bisaDijawab
              ? 'Menolak tidak menutup kemungkinan diundang lagi oleh tim yang sama selama slot masih ada.'
              : 'Undangan yang berkonflik hanya bisa ditolak. Menolak tidak mengubah keanggotaanmu di tim yang sekarang.'}
          </p>
          <KeputusanUndangan undangan={undangan} />
        </div>
      ) : null}
    </div>
  );
}
