import type { Metadata } from 'next';
import { PapanDashboard } from '@/components/admin/PapanDashboard';
import { keModelUi } from '@/lib/admin/dashboard-api';
import { susunDashboard } from '@/lib/admin/dashboard-service';
import { bacaFilter, bacaTab } from '@/lib/admin/filter-url';
import { bolehLihatTabSistem } from '@/lib/admin/izin';
import { bacaSesiPanitia } from '@/lib/admin/sesi';
import type { TabDashboard } from '@/types/api/admin-dashboard';

export const metadata: Metadata = {
  title: 'Dashboard panitia',
  robots: { index: false, follow: false },
};

type Query = Readonly<Record<string, string | readonly string[] | undefined>>;

/**
 * `/admin/dashboard` — dashboard panitia bertab.
 *
 * Server Component: membaca `searchParams`, menurunkan kewenangan dari sesi
 * server, lalu mengambil data awal. Render pertama sudah berisi angka — polling
 * di client hanya memperbaruinya, bukan mengisinya dari kosong.
 *
 * Daftar tab dihitung DI SINI, bukan di client dan bukan dari payload polling.
 * Tab yang tidak boleh dilihat tidak pernah masuk DOM — bukan dirender lalu
 * dimatikan, karena tab yang dimatikan tetap membocorkan keberadaannya
 * (FE-ADMIN-002, AC #6).
 */
export default async function DashboardPanitiaPage({
  searchParams,
}: {
  readonly searchParams: Promise<Query>;
}) {
  const query = await searchParams;
  const sesi = await bacaSesiPanitia();

  const tersedia: readonly TabDashboard[] = bolehLihatTabSistem(sesi)
    ? ['lomba', 'operasional', 'sistem']
    : ['lomba', 'operasional'];

  const filter = bacaFilter(query);
  const tab = bacaTab(query, tersedia);

  const data = keModelUi(susunDashboard(filter, tab, sesi), filter);

  return (
    <PapanDashboard awal={data} filter={filter} tab={tab} tersedia={tersedia} />
  );
}
