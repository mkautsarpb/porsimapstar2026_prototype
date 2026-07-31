import { NextResponse } from 'next/server';
import { susunDashboard } from '@/lib/admin/dashboard-service';
import { bacaFilter, bacaTab } from '@/lib/admin/filter-url';
import { bolehLihatTabSistem, punyaIzin } from '@/lib/admin/izin';
import { bacaSesiPanitia } from '@/lib/admin/sesi';
import type { TabDashboard } from '@/types/api/admin-dashboard';

/**
 * Route Handler dashboard panitia — pintu tunggal client ke data.
 *
 * TODO(api-contract): sekarang menyajikan fixture lewat `susunDashboard`. Nanti
 * mem-proxy `GET /api/v1/admin/dashboard` di Laravel sambil meneruskan cookie
 * sesi HttpOnly. Client TIDAK PERNAH memanggil Laravel langsung — dengan begitu
 * token tidak perlu ada di JavaScript sama sekali (agents.md §6).
 *
 * Otorisasi di sini BUKAN sekadar cermin UI: kalau tab tidak boleh dilihat,
 * datanya tidak dikirim. Menyembunyikan tab saja bukan kontrol keamanan
 * (FE-ADMIN-002).
 */
export async function GET(request: Request) {
  const sesi = await bacaSesiPanitia();

  if (!punyaIzin(sesi, 'dashboard.view')) {
    return NextResponse.json(
      { error: { code: 'FORBIDDEN', message: 'Tidak berwenang membuka dashboard panitia.' } },
      { status: 403 },
    );
  }

  const url = new URL(request.url);
  const query = Object.fromEntries(url.searchParams.entries());

  const tersedia: readonly TabDashboard[] = bolehLihatTabSistem(sesi)
    ? ['lomba', 'operasional', 'sistem']
    : ['lomba', 'operasional'];

  const tabDiminta = query.tab;
  if (tabDiminta === 'sistem' && !bolehLihatTabSistem(sesi)) {
    return NextResponse.json(
      { error: { code: 'FORBIDDEN', message: 'Tidak berwenang membuka tab Sistem.' } },
      { status: 403 },
    );
  }

  const filter = bacaFilter(query);
  const tab = bacaTab(query, tersedia);

  // Dashboard terautentikasi tidak boleh masuk cache publik (agents.md §8).
  return NextResponse.json(susunDashboard(filter, tab, sesi), {
    headers: { 'Cache-Control': 'no-store, private' },
  });
}
