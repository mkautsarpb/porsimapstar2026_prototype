import type { DataDashboard, WidgetPanitia } from '@/types/panitia';

/** Kontrak yang sama untuk ketiga tab — dilewatkan apa adanya dari `PapanDashboard`. */
export interface PropsTab {
  readonly data: DataDashboard;
  /** Detik yang berlalu di client sejak payload diterima. */
  readonly hanyutDetik: number;
  readonly memuat: boolean;
  readonly penyegaranGagal: boolean;
  readonly onMuatUlang: () => void;
}

/**
 * Widget yang tidak dikirim server tidak dirender — bukan ditampilkan kosong.
 * Bisa karena di luar kewenangan akun ini, bisa karena memang tidak berlaku
 * untuk tab tersebut. Keduanya bukan kondisi galat.
 */
export function cari(data: DataDashboard, id: string): WidgetPanitia | undefined {
  return data.widget.find((w) => w.id === id);
}
