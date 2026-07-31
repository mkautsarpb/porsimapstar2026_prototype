import type { NamaIkon } from './peserta';
import type { StatusWidgetDTO, TabDashboard } from './api/admin-dashboard';

/**
 * Model UI dashboard panitia — hasil normalisasi dari `types/api/admin-dashboard.ts`.
 *
 * Bedanya dengan DTO: penamaan Bahasa Indonesia, camelCase, dan `drilldown.href`
 * sudah membawa filter aktif. Yang TIDAK dilakukan di sini: memformat angka atau
 * menghitung umur data — keduanya bergantung waktu dan harus dihitung saat render
 * supaya tidak membeku pada nilai lama.
 */

export type { TabDashboard };

export type Nada = 'ok' | 'warn' | 'danger' | 'info';

export interface DefinisiMetrik {
  readonly dihitung: string;
  readonly tidakDihitung: string;
  readonly sumber: string;
  readonly intervalHitungUlangDetik: number;
}

export interface CakupanWidget {
  readonly ikutFilterGlobal: boolean;
  /** Wajib bila `ikutFilterGlobal` false, mis. "Selalu hari ini". */
  readonly labelPenyimpangan?: string;
  readonly filterBerlaku: readonly string[];
  readonly filterDiabaikan: readonly string[];
}

export interface BarisRincian {
  readonly label: string;
  readonly nilai: string;
  readonly nada?: Nada;
  /** 0–1. Bila ada, baris menggambar bar latar proporsional di belakang teks. */
  readonly proporsi?: number;
}

export interface Sorotan {
  readonly label: string;
  readonly nilai: string;
  readonly meta?: string;
}

export interface Drilldown {
  readonly label: string;
  /** Sudah lengkap dengan filter aktif — jangan menambah query lagi di komponen. */
  readonly href: string;
}

export interface WidgetPanitia {
  readonly id: string;
  readonly judul: string;
  readonly statusServer: StatusWidgetDTO;
  /** Nol tetap 0. `null` berarti tidak ada angka yang sah untuk ditampilkan. */
  readonly nilai: number | null;
  /** Dipakai bila metriknya bukan angka murni, mis. "1 lomba penuh". */
  readonly nilaiTeks?: string;
  readonly pecahan?: string;
  readonly rincian?: readonly BarisRincian[];
  readonly sorotan?: Sorotan;
  readonly diperbaruiIso: string | null;
  readonly definisi: DefinisiMetrik;
  readonly cakupan: CakupanWidget;
  readonly drilldown: Drilldown | null;
  /** Kalimat "jangan pakai angka ini untuk…" — wajib bila widget bisa stale. */
  readonly peringatanKeputusan?: string;
  readonly galat?: {
    readonly ref: string;
    readonly alasan: string;
    readonly dicobaIso: string;
  };
  readonly belumMulai?: {
    readonly alasan: string;
    readonly berartiSejakIso: string;
  };
  readonly nada?: Nada;
  /** Widget antrean memakai border berwarna karena menunggu tindakan manusia. */
  readonly sorotUtama?: boolean;
}

export interface KuotaLomba {
  readonly lomba: string;
  readonly terpakai: number;
  readonly kapasitas: number;
  readonly satuan: 'tim' | 'peserta';
  readonly keadaan: 'buka' | 'hampir-penuh' | 'daftar-tunggu';
}

export interface LayananSistem {
  readonly id: string;
  readonly nama: string;
  readonly ikon: NamaIkon;
  readonly keadaan: 'normal' | 'perhatian' | 'gagal';
  readonly ringkas: string;
  readonly rincian: readonly string[];
  readonly diperiksaIso: string;
  readonly aksi: { readonly label: string; readonly href: string } | null;
}

/**
 * Yang dibutuhkan pil kesehatan di topbar, dan tidak lebih.
 *
 * Sengaja dipisah dari `KesehatanSistem`: topbar tampil di seluruh halaman admin
 * untuk semua peran, sedangkan daftar layanan membawa tautan ke `/super/*`.
 * Mengirim objek utuh ke sana berarti menaruh peta halaman Super Admin di
 * payload akun yang tidak berwenang membukanya.
 */
export interface RingkasKesehatan {
  readonly keadaan: 'normal' | 'perhatian' | 'gagal';
  readonly jumlahLayanan: number;
  readonly jumlahBermasalah: number;
  readonly namaBermasalah: readonly string[];
}

export interface KesehatanSistem extends RingkasKesehatan {
  readonly diperiksaIso: string;
  readonly layanan: readonly LayananSistem[];
}

export interface BarisPeringatan {
  readonly id: string;
  readonly tingkat: 'warn' | 'danger';
  readonly perihal: string;
  readonly rincian: string;
  readonly sejakIso: string;
  readonly aksi: { readonly label: string; readonly href: string } | null;
}

/** Tiga seri per hari. `null` = hari itu belum terjadi — bukan nol. */
export interface TitikHarian {
  readonly labelPendek: string;
  readonly labelPenuh: string;
  readonly dikirim: number | null;
  readonly diverifikasi: number | null;
  readonly ditolak: number | null;
}

export interface PenandaHarian {
  /** Posisi 0–1 sepanjang sumbu X. */
  readonly posisi: number;
  readonly label: string;
}

export interface TitikJam {
  readonly label: string;
  readonly nilai: number;
}

export interface TahapFunnel {
  readonly id: string;
  readonly label: string;
  readonly nilai: number | null;
  readonly mulaiIso?: string;
}

export interface BarisKomposisi {
  readonly lomba: string;
  readonly individu: number;
  readonly tim: number;
}

export interface DataGrafik {
  readonly harian: readonly TitikHarian[];
  readonly penandaHarian: readonly PenandaHarian[];
  readonly perJam: readonly TitikJam[];
  readonly funnel: readonly TahapFunnel[];
  readonly komposisi: readonly BarisKomposisi[];
}

export interface DataDashboard {
  readonly waktuServerIso: string;
  readonly tab: TabDashboard;
  readonly correlationId: string;
  readonly cakupan: {
    readonly jumlahLomba: number;
    readonly namaLomba: readonly string[];
    readonly penuh: boolean;
  };
  readonly kesehatan: KesehatanSistem;
  readonly widget: readonly WidgetPanitia[];
  readonly kuota: readonly KuotaLomba[];
  readonly peringatan: readonly BarisPeringatan[];
  readonly grafik: DataGrafik | null;
}

export interface MenuAdmin {
  readonly href: string;
  readonly label: string;
  readonly ikon: NamaIkon;
}
