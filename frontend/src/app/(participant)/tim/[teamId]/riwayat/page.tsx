import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Ikon } from '@/components/app/Ikon';
import { KepalaHalaman } from '@/components/app/KepalaHalaman';
import { RiwayatTim } from '@/components/tim/RiwayatTim';
import { TIM_SAYA, cariTim } from '@/data/tim';
import ui from '@/components/app/ui.module.css';

type Params = { readonly teamId: string };

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<Params>;
}): Promise<Metadata> {
  const { teamId } = await params;
  const tim = cariTim(teamId);

  return {
    title: tim ? `Riwayat ${tim.nama}` : 'Riwayat tim',
    robots: { index: false, follow: false },
  };
}

export function generateStaticParams() {
  return TIM_SAYA.map((t) => ({ teamId: t.id }));
}

/**
 * /tim/[teamId]/riwayat — siapa mengubah apa dan kapan.
 *
 * Riwayat sengaja tidak punya aksi hapus: panitia melihat daftar yang sama, dan
 * copy di halaman ini mengatakannya terang-terangan supaya tidak ada peserta
 * yang mengira jejaknya bisa dibersihkan.
 */
export default async function RiwayatTimPage({ params }: { readonly params: Promise<Params> }) {
  const { teamId } = await params;
  const tim = cariTim(teamId);

  if (!tim) notFound();

  return (
    <div className={ui.halaman}>
      <KepalaHalaman
        judul={`Riwayat ${tim.nama}`}
        ringkasan="Semua perubahan tercatat dan tidak bisa dihapus. Panitia melihat riwayat yang sama."
        kembali={{ href: `/tim/${tim.id}`, label: 'Kembali ke tim' }}
      />

      <section className={ui.kartu} aria-labelledby="linimasa">
        <div className={ui.zonaKepala}>
          <h2 id="linimasa" className={ui.judulZona}>
            Linimasa perubahan
          </h2>
          <span className={ui.metaZona}>{tim.riwayat.length} kejadian tercatat</span>
        </div>

        <RiwayatTim jejak={tim.riwayat} />
      </section>

      <div className={ui.panel}>
        <span aria-hidden="true" className={ui.panelIkon}>
          <Ikon nama="berkas" ukuran={18} />
        </span>
        <span>
          Butuh salinan riwayat untuk keperluan administrasi? Ajukan lewat halaman Bantuan dengan
          menyebut nama tim — panitia mengirimkan berkasnya, karena unduhan langsung memuat data
          anggota yang tidak boleh tersebar dari sisi peserta.
        </span>
      </div>
    </div>
  );
}
