import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { KepalaHalaman } from '@/components/app/KepalaHalaman';
import { SubmitTim } from '@/components/tim/SubmitTim';
import { SyaratTim } from '@/components/tim/SyaratTim';
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
    title: tim ? `Review & submit ${tim.nama}` : 'Review & submit tim',
    robots: { index: false, follow: false },
  };
}

export function generateStaticParams() {
  return TIM_SAYA.filter((t) => t.peranSaya === 'Ketua').map((t) => ({ teamId: t.id }));
}

/**
 * /tim/[teamId]/review — daftar syarat submit dan tombolnya.
 *
 * Submit adalah wewenang ketua, jadi anggota yang membuka URL ini mendapat 404
 * dan bukan halaman kosong: 404 tidak membocorkan apakah sumber daya itu ada
 * (agents.md §4 baris Unauthorized).
 */
export default async function ReviewTimPage({ params }: { readonly params: Promise<Params> }) {
  const { teamId } = await params;
  const tim = cariTim(teamId);

  if (!tim || tim.peranSaya !== 'Ketua') notFound();

  const terpenuhi = tim.syarat.filter((s) => s.keadaan === 'ok').length;

  return (
    <div className={ui.halaman}>
      <KepalaHalaman
        judul={`Review & submit — ${tim.nama}`}
        ringkasan={`${tim.lomba} · ${terpenuhi} dari ${tim.syarat.length} syarat terpenuhi · batas submit ${tim.kunciPada}`}
        kembali={{ href: `/tim/${tim.id}`, label: 'Kembali ke tim' }}
      />

      <section className={ui.kartu} aria-labelledby="syarat">
        <div className={ui.zonaKepala}>
          <h2 id="syarat" className={ui.judulZona}>
            Syarat submit
          </h2>
          <span className={ui.metaZona}>Diperiksa ulang panitia setelah tim disubmit</span>
        </div>

        <SyaratTim syarat={tim.syarat} />
      </section>

      <SubmitTim tim={tim} />

      <p className={ui.teks}>
        Undangan yang masih menunggu jawaban tidak pernah ikut dihitung sebagai anggota, termasuk
        saat menghitung syarat di atas. Kalau tenggat sudah dekat, undang lebih banyak orang daripada
        kebutuhan minimum supaya satu penolakan tidak membatalkan seluruh tim.
      </p>
    </div>
  );
}
