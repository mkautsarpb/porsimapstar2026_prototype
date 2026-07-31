import type {
  AlertRowDTO,
  ChartsDTO,
  DashboardResponse,
  HealthDTO,
  QuotaRowDTO,
  TabDashboard,
  WidgetDTO,
} from '@/types/api/admin-dashboard';
import type {
  BarisPeringatan,
  DataDashboard,
  DataGrafik,
  KesehatanSistem,
  KuotaLomba,
  LayananSistem,
  RingkasKesehatan,
  WidgetPanitia,
} from '@/types/panitia';
import type { NamaIkon } from '@/types/peserta';
import { keParamsApi, urlDrilldown, type NilaiFilter } from './filter-url';

/** Alasan galat dalam bahasa manusia. Tidak boleh memuat data pribadi (FE-PRIV-001). */
const ALASAN_TAK_DIKENAL = 'Angka tidak dapat dihitung saat ini.';

const ALASAN_GALAT: Readonly<Record<string, string>> = {
  UPSTREAM_TIMEOUT: 'Sumber data tidak merespons tepat waktu.',
  UPSTREAM_ERROR: 'Sumber data menolak permintaan.',
  PERMISSION_DENIED: 'Akun ini tidak berwenang atas angka tersebut.',
};

const IKON_LAYANAN: Readonly<Record<string, NamaIkon>> = {
  sheets: 'ulang',
  notifikasi: 'amplop',
  api: 'grid',
  database: 'berkas',
  redis: 'jam',
  penyimpanan: 'gear',
};

function keWidget(dto: WidgetDTO, filter: NilaiFilter): WidgetPanitia {
  return {
    id: dto.id,
    judul: dto.title,
    statusServer: dto.status,
    nilai: dto.value,
    nilaiTeks: dto.display_value,
    pecahan: dto.denominator_label,
    rincian: dto.breakdown?.map((b) => ({
      label: b.label,
      nilai: String(b.value),
      nada: b.tone,
      proporsi: b.share,
    })),
    sorotan: dto.highlight
      ? { label: dto.highlight.label, nilai: dto.highlight.value, meta: dto.highlight.meta }
      : undefined,
    diperbaruiIso: dto.last_updated_at,
    definisi: {
      dihitung: dto.definition.counted,
      tidakDihitung: dto.definition.not_counted,
      sumber: dto.definition.source,
      intervalHitungUlangDetik: dto.definition.recompute_interval_seconds,
    },
    cakupan: {
      ikutFilterGlobal: dto.scope.follows_global_filter,
      labelPenyimpangan: dto.scope.override_label,
      filterBerlaku: dto.scope.applied_filters,
      filterDiabaikan: dto.scope.ignored_filters,
    },
    drilldown: dto.drill_down
      ? {
          label: dto.drill_down.label,
          href: urlDrilldown(dto.drill_down.path, filter, dto.drill_down.carry_filters),
        }
      : null,
    peringatanKeputusan: dto.stale_decision_warning,
    galat: dto.error
      ? {
          ref: dto.error.ref,
          alasan: ALASAN_GALAT[dto.error.reason_code] ?? ALASAN_TAK_DIKENAL,
          dicobaIso: dto.error.attempted_at,
        }
      : undefined,
    belumMulai: dto.not_started
      ? { alasan: dto.not_started.reason, berartiSejakIso: dto.not_started.meaningful_from }
      : undefined,
    nada: dto.tone,
    sorotUtama: dto.emphasis,
  };
}

function keKuota(dto: QuotaRowDTO): KuotaLomba {
  const keadaan = dto.state === 'waitlist' ? 'daftar-tunggu' : dto.state === 'tight' ? 'hampir-penuh' : 'buka';
  return {
    lomba: dto.competition,
    terpakai: dto.used,
    kapasitas: dto.capacity,
    satuan: dto.unit,
    keadaan,
  };
}

function keKeadaan(state: 'ok' | 'degraded' | 'down'): LayananSistem['keadaan'] {
  if (state === 'ok') return 'normal';
  return state === 'degraded' ? 'perhatian' : 'gagal';
}

/** Hanya angka dan nama layanan — tanpa tautan tindakan. Untuk topbar. */
export function keRingkasKesehatan(dto: HealthDTO): RingkasKesehatan {
  return {
    keadaan: keKeadaan(dto.state),
    jumlahLayanan: dto.services_total,
    jumlahBermasalah: dto.services_unhealthy,
    namaBermasalah: dto.unhealthy_names,
  };
}

function keKesehatan(dto: HealthDTO): KesehatanSistem {
  return {
    keadaan: keKeadaan(dto.state),
    jumlahLayanan: dto.services_total,
    jumlahBermasalah: dto.services_unhealthy,
    namaBermasalah: dto.unhealthy_names,
    diperiksaIso: dto.last_checked_at,
    // Kosong bila server memang tidak mengirimkannya untuk akun ini.
    layanan: (dto.services ?? []).map((l) => ({
      id: l.id,
      nama: l.name,
      ikon: IKON_LAYANAN[l.id] ?? 'gear',
      keadaan: keKeadaan(l.state),
      ringkas: l.summary,
      rincian: l.details,
      diperiksaIso: l.checked_at,
      aksi: aksiLayanan(l.id),
    })),
  };
}

/** Tab Sistem meringkas, bukan menyalin — tindakannya ada di halaman aslinya. */
function aksiLayanan(id: string): LayananSistem['aksi'] {
  if (id === 'sheets') return { label: 'Sync manual dan galat', href: '/admin/sinkronisasi' };
  if (id === 'notifikasi') {
    return { label: 'Coba ulang yang gagal', href: '/admin/sinkronisasi?tab=notifikasi' };
  }
  return { label: 'Detail di Super Admin', href: '/super/system-health' };
}

const fTanggalPendek = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'short',
  timeZone: 'Asia/Jakarta',
});

const fTanggalPenuh = new Intl.DateTimeFormat('id-ID', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Asia/Jakarta',
});

function keGrafik(dto: ChartsDTO): DataGrafik {
  const harian = dto.daily_registrations;
  const awal = Date.parse(harian[0]?.date ?? '');
  const akhir = Date.parse(harian[harian.length - 1]?.date ?? '');
  const rentang = akhir - awal;

  return {
    harian: harian.map((t) => ({
      labelPendek: fTanggalPendek.format(new Date(t.date)),
      labelPenuh: fTanggalPenuh.format(new Date(t.date)),
      dikirim: t.submitted,
      diverifikasi: t.verified,
      ditolak: t.rejected,
    })),
    /*
     * Penanda dipetakan ke posisi 0–1 supaya komponen tidak perlu tahu soal
     * tanggal. Dijepit ke rentang, bukan disaring: tenggat yang jatuh beberapa
     * jam setelah titik data terakhir tetap harus terlihat di tepi kanan —
     * membuangnya menghilangkan justru penanda yang paling penting.
     */
    penandaHarian: dto.daily_markers.map((m) => ({
      posisi: rentang > 0 ? Math.min(1, Math.max(0, (Date.parse(m.date) - awal) / rentang)) : 0,
      label: m.label,
    })),
    perJam: dto.hourly_registrations.map((t) => ({
      label: `${String(t.hour).padStart(2, '0')}.00`,
      nilai: t.value,
    })),
    funnel: dto.funnel.map((t) => ({
      id: t.id,
      label: t.label,
      nilai: t.value,
      mulaiIso: t.not_started_from,
    })),
    komposisi: dto.composition.map((k) => ({
      lomba: k.competition,
      individu: k.individual,
      tim: k.team,
    })),
  };
}

function kePeringatan(dto: AlertRowDTO): BarisPeringatan {
  return {
    id: dto.id,
    tingkat: dto.severity,
    perihal: dto.subject,
    rincian: dto.detail,
    sejakIso: dto.since,
    aksi: dto.action ? { label: dto.action.label, href: dto.action.path } : null,
  };
}

export function keModelUi(dto: DashboardResponse, filter: NilaiFilter): DataDashboard {
  return {
    waktuServerIso: dto.server_time,
    tab: dto.tab,
    correlationId: dto.correlation_id,
    cakupan: {
      jumlahLomba: dto.scope.competition_count,
      namaLomba: dto.scope.competition_names,
      penuh: dto.scope.full_scope,
    },
    kesehatan: keKesehatan(dto.health),
    widget: Object.values(dto.widgets).map((w) => keWidget(w, filter)),
    kuota: (dto.quota ?? []).map(keKuota),
    peringatan: (dto.alerts ?? []).map(kePeringatan),
    grafik: dto.charts ? keGrafik(dto.charts) : null,
  };
}

export class GalatDashboard extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'GalatDashboard';
    this.status = status;
  }
}

/**
 * Pengambilan data untuk polling client.
 *
 * `signal` wajib diisi pemanggil: setiap perubahan filter membatalkan permintaan
 * sebelumnya, kalau tidak respons lama bisa datang belakangan dan menimpa hasil
 * filter yang baru.
 */
export async function ambilDashboard(
  filter: NilaiFilter,
  tab: TabDashboard,
  signal: AbortSignal,
): Promise<DataDashboard> {
  const respons = await fetch(`/api/admin/dashboard?${keParamsApi(filter, tab).toString()}`, {
    signal,
    cache: 'no-store',
    headers: { Accept: 'application/json' },
  });

  if (!respons.ok) {
    throw new GalatDashboard(`Permintaan dashboard gagal (${respons.status})`, respons.status);
  }

  const dto = (await respons.json()) as DashboardResponse;
  return keModelUi(dto, filter);
}
