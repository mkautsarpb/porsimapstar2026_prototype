/**
 * Tipe untuk konten landing page publik.
 *
 * TODO(api-contract): seluruh data di `src/data/` masih statis. Saat backend siap,
 * bentuk response harus dipetakan ke tipe di file ini — komponen tidak perlu berubah.
 * Kuota (`terisi`) khususnya wajib datang dari server, bukan dihitung ulang di client
 * (agents.md §0 prinsip 1).
 */

export type KategoriLomba = 'Olahraga' | 'Seni' | 'Akademik';

export type TipePeserta = 'Tim' | 'Individu';

/** Kode cabang, mis. "VOL-01". Dipakai sebagai id stabil di URL hash. */
export type KodeLomba = string;

export interface Lomba {
  readonly kode: KodeLomba;
  readonly nama: string;
  /** Label lengkap, mis. "Olahraga · beregu". */
  readonly kategori: string;
  readonly tim: TipePeserta;
  /** Slot terisi — DATA SEMENTARA sampai panitia konfirmasi. */
  readonly terisi: number;
  readonly kapasitas: number;
  /** Nama berkas ikon di `/uploads/icons/<icon>.svg`. */
  readonly icon: string;
}

/** Detail teknis yang tampil di modal. Semua field opsional karena juknis belum final. */
export interface DetailLomba {
  readonly ringkasan: string;
  readonly inti?: string;
  readonly cadangan?: string;
  readonly official?: string;
  readonly perInstitusi?: string;
  readonly sistem?: string;
  readonly jadwal?: string;
  readonly venue?: string;
}

export type StatusKuota = 'dibuka' | 'hampir' | 'penuh';

/** Hasil turunan kuota — dihitung di `lib/kuota.ts`, bukan di komponen. */
export interface RingkasanKuota {
  readonly status: StatusKuota;
  readonly persen: number;
  readonly sisa: number;
  readonly labelKuota: string;
  readonly labelSisa: string;
  readonly labelStatus: string;
  readonly labelMeter: string;
  readonly labelCta: string;
}

export interface Acara {
  readonly nama: string;
  readonly tanggal: string;
  readonly tempat: string;
  readonly detail: string;
}

export interface TahapLinimasa {
  readonly no: string;
  readonly tanggal: string;
  readonly judul: string;
  readonly detail: string;
  /** Ukuran & warna "matahari terbit" yang membesar tiap tahap. */
  readonly sunTop: string;
  readonly sunSize: string;
  readonly sunColor: string;
  readonly sunGlow: string;
}

export interface LangkahDaftar {
  readonly no: string;
  readonly judul: string;
  readonly detail: string;
}

/** Level sponsor, urut dari kontribusi tertinggi. Menentukan ukuran logo di rail. */
export type LevelSponsor = 'gold' | 'silver' | 'bronze';

export interface Sponsor {
  readonly nama: string;
  readonly level: LevelSponsor;
}

export interface Faq {
  readonly q: string;
  readonly a: string;
}

export interface KontakPanitia {
  readonly peran: string;
  readonly nama: string;
  readonly telp: string;
  readonly email: string;
}

export interface Statistik {
  readonly nilai: number | string;
  readonly label: string;
}
