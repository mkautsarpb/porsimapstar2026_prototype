import Image from 'next/image';
import Link from 'next/link';
import { Ikon } from '@/components/app/Ikon';
import type { KodeQr } from '@/data/lomba-detail';
import { qrPlaceholder } from '@/lib/qr-placeholder';
import { PROFIL } from '@/data/peserta';
import type { LombaSaya } from '@/types/peserta';
import ui from '@/components/app/ui.module.css';
import tab from './tab.module.css';
import styles from './TabQr.module.css';

/**
 * Tab QR & check-in. Kode hanya ada untuk pendaftaran yang sudah terverifikasi —
 * draft, ditolak, atau ditarik tidak pernah menampilkan QR (agents.md §10).
 */
export function TabQr({ lomba, qr }: { readonly lomba: LombaSaya; readonly qr: KodeQr }) {
  if (!qr.aktif) {
    return (
      <div className={ui.kartu}>
        <h2 className={tab.judul}>Kode check-in belum terbit</h2>
        <p className={tab.teks}>{qr.catatan}</p>
        <div className={`${tab.info} ${tab.jarakAtas}`}>
          <span aria-hidden="true" className={tab.infoIkon}>
            <Ikon nama="jam" ukuran={16} />
          </span>
          <span>{qr.berlaku}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`${tab.grid} ${tab.gridDua}`}>
      <div className={`${ui.kartu} ${styles.kartuQr}`}>
        <h2 className={tab.judul}>Kode check-in {lomba.nama}</h2>

        <Image
          src={qrPlaceholder(`${lomba.id}-${qr.referensi}`)}
          alt={`Kode QR check-in ${lomba.nama} atas nama ${PROFIL.nama}`}
          width={232}
          height={232}
          unoptimized
          className={styles.qr}
        />

        <p className={styles.atasNama}>Atas nama {PROFIL.nama}</p>

        <dl className={tab.rincian}>
          <div className={tab.rincianItem}>
            <dt className={tab.label}>Nomor referensi</dt>
            <dd className={tab.rincianNilai}>{qr.referensi}</dd>
          </div>
          <div className={tab.rincianItem}>
            <dt className={tab.label}>Berlaku</dt>
            <dd className={tab.rincianNilai}>{qr.berlaku}</dd>
          </div>
        </dl>
      </div>

      <div className={tab.kolom}>
        <div className={ui.kartu}>
          <h2 className={tab.judul}>Cara memakai</h2>
          <ol className={styles.langkah}>
            <li>Datang ke meja registrasi venue paling lambat 30 menit sebelum jadwal.</li>
            <li>Tunjukkan kode ini beserta kartu identitas aslimu.</li>
            <li>Petugas memindai, lalu status check-in muncul di aktivitas dashboard.</li>
          </ol>
          <p className={`${tab.teks} ${tab.jarakAtas}`}>{qr.catatan}</p>
        </div>

        <div className={ui.kartu}>
          <h2 className={tab.judul}>Kode tidak bisa dipindai?</h2>
          <p className={tab.teks}>
            Petugas bisa mencari pendaftaranmu memakai nomor referensi{' '}
            <strong>{lomba.nomorReferensi}</strong>. Kalau tetap gagal, laporkan ke panitia cabang agar
            check-in dicatat manual.
          </p>
          <Link href="/bantuan" className={`${ui.tombol} ${tab.tombolBlok}`}>
            Laporkan masalah
          </Link>
        </div>
      </div>
    </div>
  );
}
