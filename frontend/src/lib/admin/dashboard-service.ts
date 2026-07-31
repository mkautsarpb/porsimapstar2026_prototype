import { GRAFIK, KUOTA, PERINGATAN, WAKTU_SERVER_ISO, kesehatanDemo, widgetUntukTab } from '@/data/panitia';
import type { DashboardResponse, TabDashboard } from '@/types/api/admin-dashboard';
import { KUNCI_FILTER, type NilaiFilter } from './filter-url';
import { bolehLihatTabSistem, type SesiPanitia } from './izin';

/**
 * Penyusun respons `GET /api/v1/admin/dashboard` — MOCK.
 *
 * Dipakai dua pemanggil sekaligus: Route Handler `/api/admin/dashboard` untuk
 * polling client, dan Server Component halaman dashboard untuk render pertama.
 * Satu sumber, dua pintu — supaya render awal dan hasil polling tidak pernah
 * berbeda bentuk.
 *
 * TODO(api-contract): begitu Laravel siap, isi fungsi ini diganti proxy ke
 * `GET /api/v1/admin/dashboard` dengan meneruskan cookie sesi. Pemanggilnya
 * tidak perlu berubah.
 *
 * Server yang menentukan cakupan dan izin, bukan client (agents.md §0 prinsip 1).
 */
export function susunDashboard(
  filter: NilaiFilter,
  tab: TabDashboard,
  sesi: SesiPanitia,
): DashboardResponse {
  const echo: Record<string, string> = {};
  for (const kunci of KUNCI_FILTER) echo[kunci] = filter[kunci];

  // Daftar layanan hanya untuk yang boleh membukanya — disaring di server, bukan
  // dikirim lalu disembunyikan di UI (FE-ADMIN-002).
  const { services, ...ringkasKesehatan } = kesehatanDemo();
  const health = bolehLihatTabSistem(sesi) ? { ...ringkasKesehatan, services } : ringkasKesehatan;

  return {
    server_time: WAKTU_SERVER_ISO,
    tab,
    correlation_id: buatCorrelationId(),
    filters_echo: echo,
    scope: {
      competition_count: sesi.cakupanLomba.length,
      competition_names: sesi.cakupanLomba,
      full_scope: sesi.cakupanPenuh,
    },
    permissions: sesi.izin,
    health,
    widgets: Object.fromEntries(widgetUntukTab(tab).map((w) => [w.id, w])),
    quota: tab === 'lomba' ? KUOTA : undefined,
    charts: tab === 'lomba' ? GRAFIK : undefined,
    alerts: tab === 'operasional' ? PERINGATAN : undefined,
  };
}

function buatCorrelationId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `dash-${Date.now().toString(16)}`;
}
