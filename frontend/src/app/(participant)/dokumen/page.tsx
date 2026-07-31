import type { Metadata } from 'next';
import Link from 'next/link';
import { Ikon } from '@/components/app/Ikon';
import { KepalaHalaman } from '@/components/app/KepalaHalaman';
import { KartuDokumen } from '@/components/dokumen/KartuDokumen';
import { BATAS_PERBAIKAN, DOKUMEN, ringkasanDokumen } from '@/data/dokumen';
import ui from '@/components/app/ui.module.css';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Dokumen',
  robots: { index: false, follow: false },
};

/**
 * /dokumen — satu-satunya tempat mengunggah berkas persyaratan.
 *
 * Urutan kartu sengaja menaruh yang butuh tindakan di atas: perlu diperbaiki,
 * belum diunggah, lalu sisanya. Peserta yang membuka halaman ini hampir selalu
 * datang karena ada yang salah, bukan untuk mengagumi berkas yang sudah lolos.
 *
 * Berkas tidak pernah dirender di sini — hanya nama, ukuran, status, dan catatan
 * panitia. Pratinjau dokumen identitas adalah wewenang verifikator (§6).
 */
export default function DokumenPage() {
  const prioritas = { 'perlu-diperbaiki': 0, 'belum-diunggah': 1, 'sedang-diperiksa': 2, disetujui: 3 };
  const urut = [...DOKUMEN].sort((a, b) => prioritas[a.status] - prioritas[b.status]);
  const perluTindakan = DOKUMEN.filter(
    (d) => d.status === 'perlu-diperbaiki' || d.status === 'belum-diunggah',
  ).length;

  return (
    <div className={ui.halaman}>
      <KepalaHalaman
        judul="Dokumen"
        ringkasan={`${ringkasanDokumen()} · batas perbaikan ${BATAS_PERBAIKAN}`}
        aksi={
          <div className={styles.kategori}>
            <span className={ui.eyebrow}>Kategori peserta</span>
            <strong className={styles.kategoriNilai}>
              Mahasiswa · Politeknik Negeri Semarang
            </strong>
          </div>
        }
      />

      {perluTindakan > 0 ? (
        <div className={`${ui.panel} ${ui.panelPeringatan}`}>
          <span aria-hidden="true" className={ui.panelIkon}>
            <Ikon nama="seru" ukuran={18} />
          </span>
          <span>
            {perluTindakan} dokumen menahan pendaftaranmu. Pendaftaran baru bisa dikirim setelah
            seluruh dokumen diterima panitia — perbaiki yang di atas dulu, urutan kartu sudah
            disusun dari yang paling mendesak.
          </span>
        </div>
      ) : null}

      <div className={`${ui.panel}`}>
        <span aria-hidden="true" className={ui.panelIkon}>
          <Ikon nama="berkas" ukuran={18} />
        </span>
        <span>
          Berkasmu disimpan tertutup dan hanya dibuka panitia verifikasi PORSIMAPTAR. Tidak
          ditampilkan ke peserta lain, ketua tim, maupun publik — ketua tim hanya melihat status
          lengkap atau perlu diperbaiki.
        </span>
      </div>

      <div className={styles.daftar}>
        {urut.map((d) => (
          <KartuDokumen key={d.id} dokumen={d} />
        ))}
      </div>

      <p className={ui.teks}>
        Sudah mengunggah semuanya? Lanjutkan di{' '}
        <Link href="/profil">halaman Profil</Link> untuk meninjau dan mengirim pendaftaran. Kalau
        ada catatan panitia yang tidak kamu mengerti, tanyakan lewat{' '}
        <Link href="/bantuan?jenis=dokumen">halaman Bantuan</Link> dengan menyebut nomor
        referensimu.
      </p>
    </div>
  );
}
