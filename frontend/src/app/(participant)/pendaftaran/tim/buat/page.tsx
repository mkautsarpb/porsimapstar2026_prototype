import type { Metadata } from 'next';
import Link from 'next/link';
import { Ikon } from '@/components/app/Ikon';
import { KepalaHalaman } from '@/components/app/KepalaHalaman';
import { FormBuatTim } from '@/components/tim/FormBuatTim';
import { detailLomba } from '@/data/lomba-detail';
import { cariLomba } from '@/data/peserta';
import ui from '@/components/app/ui.module.css';

export const metadata: Metadata = {
  title: 'Buat tim',
  robots: { index: false, follow: false },
};

type Query = Record<string, string | readonly string[] | undefined>;

function satu(nilai: string | readonly string[] | undefined): string | undefined {
  return Array.isArray(nilai) ? nilai[0] : (nilai as string | undefined);
}

/**
 * /pendaftaran/tim/buat — pembuatan tim, selalu dari konteks satu cabang lomba.
 *
 * Tanpa `?lomba=`, halaman tidak menebak cabang mana yang dimaksud: ia meminta
 * peserta memilih cabang dulu. Menebak berarti tim bisa lahir di cabang yang
 * salah, dan cabang tidak bisa diubah setelah tim dibuat.
 */
export default async function BuatTimPage({
  searchParams,
}: {
  readonly searchParams: Promise<Query>;
}) {
  const query = await searchParams;
  const id = satu(query.lomba);
  const lomba = id ? cariLomba(id) : undefined;
  const tim = id ? detailLomba(id).tim : undefined;

  if (!lomba || lomba.tipe !== 'Tim') {
    return (
      <div className={ui.halaman}>
        <KepalaHalaman
          judul="Buat tim"
          ringkasan="Tim selalu dibuat dari halaman cabang lombanya."
          kembali={{ href: '/tim', label: 'Kembali ke Tim saya' }}
        />

        <div className={`${ui.kartu} ${ui.kosong}`}>
          <span aria-hidden="true" className={ui.kosongIkon}>
            <Ikon nama="piala" ukuran={26} />
          </span>
          <h2 className={ui.kosongJudul}>Pilih cabang lombanya dulu</h2>
          <p className={ui.kosongTeks}>
            Cabang lomba menentukan jumlah anggota minimum, batas maksimum, dan tenggat penguncian
            roster — dan tidak bisa diubah setelah tim dibuat. Buka cabang bertipe tim yang ingin
            kamu ikuti, lalu tekan “Buat tim” dari sana.
          </p>
          <Link href="/lomba-saya?jenis=Tim" className={`${ui.tombol} ${ui.tombolUtama}`}>
            Lihat lomba bertipe tim
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={ui.halaman}>
      <KepalaHalaman
        judul="Buat tim"
        ringkasan="Kamu akan menjadi ketua sekaligus anggota pertama tim ini."
        kembali={{ href: `/lomba-saya/${lomba.id}`, label: `Kembali ke ${lomba.nama}` }}
      />

      <div className={ui.kartu}>
        <FormBuatTim
          lomba={lomba.nama}
          roster={tim ? `tim ${tim.minimal}–${tim.maksimal} orang` : 'lomba beregu'}
          institusi={tim?.institusi ?? 'Politeknik Negeri Semarang'}
          tenggat="5 Agustus 2026"
        />
      </div>

      <div className={ui.panel}>
        <span aria-hidden="true" className={ui.panelIkon}>
          <Ikon nama="orangBanyak" ukuran={18} />
        </span>
        <span>
          Kalau temanmu sudah membuat tim untuk cabang ini, kamu tidak perlu membuat lagi — minta ia
          mengirim undangan, lalu jawab dari <Link href="/undangan-tim">kotak undangan</Link>. Satu
          peserta hanya boleh berada di satu tim pada lomba yang sama.
        </span>
      </div>
    </div>
  );
}
