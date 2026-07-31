/**
 * Kontrak wire `GET /api/v1/admin/dashboard`.
 *
 * TODO(api-contract): bentuk ini ASUMSI — SRS Backend baru mencantumkan endpoint
 * dan tujuannya, belum bentuk responsnya. Tiga hal yang wajib dicocokkan dengan
 * tim backend sebelum integrasi:
 *
 *   1. `last_updated_at` per widget, bukan satu untuk seluruh halaman. Widget
 *      tanpa nilai ini TIDAK boleh menampilkan angka (lihat `Widget.tsx`).
 *   2. Penanda stale: server boleh mengirim `status: 'stale'`, TAPI client tetap
 *      menghitung sendiri dari `last_updated_at` + `recompute_interval_seconds`.
 *      Yang lebih pesimis menang — jaring pengaman bila jam server melenceng
 *      atau respons tertahan proxy (lihat `lib/admin/kebasian.ts`).
 *   3. Permission dikirim di envelope. Visibilitas tab tetap diputuskan di Server
 *      Component dari sesi, bukan dari payload ini (FE-ADMIN-002, AC #6).
 *
 * Penamaan di berkas ini sengaja snake_case mengikuti wire Laravel. Normalisasi
 * ke model UI ada di `lib/admin/dashboard-api.ts`.
 */

export type IsoDateTime = string;

export type TabDashboard = 'lomba' | 'operasional' | 'sistem';

/** `loading` tidak ada di sini — itu kondisi client, bukan kiriman server. */
export type StatusWidgetDTO = 'ready' | 'stale' | 'error' | 'not_started';

export type NadaDTO = 'ok' | 'warn' | 'danger' | 'info';

export interface WidgetScopeDTO {
  readonly follows_global_filter: boolean;
  /** Wajib diisi bila `follows_global_filter` false. */
  readonly override_label?: string;
  readonly applied_filters: readonly string[];
  readonly ignored_filters: readonly string[];
}

export interface MetricDefinitionDTO {
  readonly counted: string;
  readonly not_counted: string;
  readonly source: string;
  readonly recompute_interval_seconds: number;
}

export interface BreakdownRowDTO {
  readonly label: string;
  readonly value: string | number;
  readonly tone?: NadaDTO;
  /** 0–1. Bila ada, baris ini menggambar bar latar proporsional di belakang teks. */
  readonly share?: number;
}

export interface WidgetDTO {
  readonly id: string;
  readonly title: string;
  readonly status: StatusWidgetDTO;
  /** null bila status bukan `ready`/`stale`. Nol tetap dikirim sebagai 0. */
  readonly value: number | null;
  /** Dipakai bila metriknya bukan angka murni, mis. "1 lomba penuh". */
  readonly display_value?: string;
  readonly denominator_label?: string;
  readonly breakdown?: readonly BreakdownRowDTO[];
  readonly highlight?: { readonly label: string; readonly value: string; readonly meta?: string };
  /** WAJIB ada bila status `ready` atau `stale`. */
  readonly last_updated_at: IsoDateTime | null;
  readonly definition: MetricDefinitionDTO;
  readonly scope: WidgetScopeDTO;
  readonly drill_down: {
    readonly label: string;
    readonly path: string;
    readonly carry_filters: boolean;
  } | null;
  /** Wajib bila widget bisa menjadi stale. */
  readonly stale_decision_warning?: string;
  /** Khusus status `error`. Tidak boleh memuat data pribadi (FE-PRIV-001). */
  readonly error?: {
    readonly ref: string;
    readonly reason_code: string;
    readonly attempted_at: IsoDateTime;
  };
  /** Khusus status `not_started` — mis. check-in sebelum 26 Oktober. */
  readonly not_started?: {
    readonly reason: string;
    readonly meaningful_from: IsoDateTime;
  };
  readonly tone?: NadaDTO;
  readonly emphasis?: boolean;
}

export interface HealthServiceDTO {
  readonly id: string;
  readonly name: string;
  readonly state: 'ok' | 'degraded' | 'down';
  readonly summary: string;
  readonly details: readonly string[];
  readonly checked_at: IsoDateTime;
}

/** Dikirim di SEMUA tab — pil kesehatan topbar terlihat di luar tab Sistem. */
export interface HealthDTO {
  readonly state: 'ok' | 'degraded' | 'down';
  readonly services_total: number;
  readonly services_unhealthy: number;
  readonly unhealthy_names: readonly string[];
  readonly last_checked_at: IsoDateTime;
  /*
   * Hanya dikirim kepada akun yang boleh membuka tab Sistem. Untuk akun lain,
   * yang dikirim cukup keadaan dan jumlahnya — itu yang dibutuhkan pil topbar.
   * Daftar layanan membawa tautan ke halaman Super Admin, dan mengirimkannya ke
   * akun yang tidak berwenang sama saja menaruh peta halaman itu di payload.
   */
  readonly services?: readonly HealthServiceDTO[];
}

export interface AlertRowDTO {
  readonly id: string;
  readonly severity: 'warn' | 'danger';
  readonly subject: string;
  readonly detail: string;
  readonly since: IsoDateTime;
  readonly action: { readonly label: string; readonly path: string } | null;
}

export interface QuotaRowDTO {
  readonly competition: string;
  readonly used: number;
  readonly capacity: number;
  readonly unit: 'tim' | 'peserta';
  readonly state: 'open' | 'tight' | 'waitlist';
}

/**
 * Tiga seri per hari. `null` = hari itu belum terjadi — bukan nol, karena nol
 * berarti "tidak ada yang mendaftar" dan itu pernyataan yang berbeda.
 */
export interface TitikHarianDTO {
  readonly date: IsoDateTime;
  readonly submitted: number | null;
  readonly verified: number | null;
  readonly rejected: number | null;
}

export interface TitikJamDTO {
  readonly hour: number;
  readonly value: number;
}

export interface TahapFunnelDTO {
  readonly id: string;
  readonly label: string;
  readonly value: number | null;
  /** Diisi bila tahapnya belum dimulai — dirender sebagai keterangan, bukan nol. */
  readonly not_started_from?: IsoDateTime;
}

export interface BarisKomposisiDTO {
  readonly competition: string;
  readonly individual: number;
  readonly team: number;
}

export interface ChartsDTO {
  readonly daily_registrations: readonly TitikHarianDTO[];
  /** Penanda vertikal pada grafik harian: hari ini dan tenggat pendaftaran. */
  readonly daily_markers: readonly { readonly date: IsoDateTime; readonly label: string }[];
  readonly hourly_registrations: readonly TitikJamDTO[];
  readonly funnel: readonly TahapFunnelDTO[];
  readonly composition: readonly BarisKomposisiDTO[];
}

export interface DashboardResponse {
  readonly server_time: IsoDateTime;
  readonly tab: TabDashboard;
  readonly correlation_id: string;
  /** Filter yang ternormalisasi di server — dasar rekonsiliasi drill-down (AC-FE-08). */
  readonly filters_echo: Readonly<Record<string, string>>;
  readonly scope: {
    readonly competition_count: number;
    readonly competition_names: readonly string[];
    /** True bila akun memegang seluruh event — mengubah bunyi salinan cakupan. */
    readonly full_scope: boolean;
  };
  readonly permissions: readonly string[];
  readonly health: HealthDTO;
  /** Kunci = id widget. Widget yang gagal TETAP hadir dengan status `error`. */
  readonly widgets: Readonly<Record<string, WidgetDTO>>;
  readonly quota?: readonly QuotaRowDTO[];
  readonly alerts?: readonly AlertRowDTO[];
  /** Hanya dikirim untuk tab Lomba. */
  readonly charts?: ChartsDTO;
}
