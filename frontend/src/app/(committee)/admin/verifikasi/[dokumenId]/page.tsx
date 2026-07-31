import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TolakAkses } from '@/components/admin/TolakAkses';
import { LayarKeputusan } from '@/components/admin/verifikasi/LayarKeputusan';
import {
  ALASAN_MINTA_PERBAIKAN,
  ALASAN_TOLAK,
  DOKUMEN_KEPUTUSAN,
} from '@/data/admin/verifikasi';
import { KALENDER, WAKTU_SERVER_ISO } from '@/data/panitia';
import { formatWaktu } from '@/lib/admin/format';
import { punyaIzin } from '@/lib/admin/izin';
import { bacaSesiPanitia } from '@/lib/admin/sesi';

export const metadata: Metadata = {
  title: 'Keputusan dokumen · Panitia',
  robots: { index: false, follow: false },
};

/**
 * `/admin/verifikasi/[dokumenId]` — layar keputusan satu dokumen (E1.2b).
 *
 * Dokumen yang tidak ada dan dokumen di luar cakupan peran keduanya berakhir di
 * `notFound()`, bukan pesan berbeda. Membedakan keduanya ("dokumen ini ada tapi
 * bukan wewenangmu") memberi tahu penebak bahwa ID-nya benar (agents.md §4).
 */
export default async function KeputusanDokumenPage({
  params,
}: {
  readonly params: Promise<{ readonly dokumenId: string }>;
}) {
  const { dokumenId } = await params;
  const sesi = await bacaSesiPanitia();

  if (!punyaIzin(sesi, 'verification.decide')) return <TolakAkses />;

  const dokumen = DOKUMEN_KEPUTUSAN[dokumenId];
  if (!dokumen) notFound();

  return (
    <LayarKeputusan
      dokumen={dokumen}
      alasanPerbaikan={ALASAN_MINTA_PERBAIKAN}
      alasanTolak={ALASAN_TOLAK}
      tenggatPerbaikan={formatWaktu(KALENDER.pendaftaranTutup)}
      waktuServerIso={WAKTU_SERVER_ISO}
    />
  );
}
