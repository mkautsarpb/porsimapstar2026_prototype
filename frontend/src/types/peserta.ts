/**
 * Tipe data area peserta.
 *
 * TODO(api-contract): semua bentuk di bawah masih asumsi frontend. Endpoint yang
 * dibutuhkan (agents.md §1 prinsip 3):
 *   GET /api/v1/me                      -> profil ringkas + status verifikasi
 *   GET /api/v1/me/dashboard            -> aksi, kelengkapan, agenda, hasil, statistik, aktivitas
 *   GET /api/v1/me/registrations        -> daftar lomba (filter status, tab aktif/riwayat)
 *   GET /api/v1/me/registrations/{id}   -> detail satu pendaftaran
 *   GET /api/v1/me/notifications        -> daftar notifikasi
 * Nilai turunan (kelengkapan, eligibility, roster) dihitung SERVER, bukan client.
 */

export type StatusPendaftaran =
  | 'terverifikasi'
  | 'menunggu-review'
  | 'perlu-perbaikan'
  | 'ditolak'
  | 'ditarik'
  | 'selesai';

/** Nada visual yang dipakai badge, banner, dan garis kiri kartu. */
export type Nada = 'ok' | 'warn' | 'danger' | 'info' | 'netral';

export interface ProfilPeserta {
  readonly nama: string;
  readonly inisial: string;
  /** Sudah tersamarkan dari server — nomor penuh tidak pernah dikirim ke client (§6). */
  readonly nomorPeserta: string;
  readonly terverifikasi: boolean;
}

export interface AksiPerluTindakan {
  readonly id: string;
  readonly judul: string;
  readonly konteks: string;
  readonly tenggat: string;
  readonly cta: string;
  readonly href: string;
  readonly nada: Nada;
  readonly ikon: NamaIkon;
}

export interface LangkahKelengkapan {
  readonly label: string;
  readonly status: string;
  readonly keadaan: 'ok' | 'warn' | 'belum';
  readonly href?: string;
}

export interface Kelengkapan {
  readonly persen: number;
  readonly catatan: string;
  readonly langkah: readonly LangkahKelengkapan[];
}

export interface AnggotaRingkas {
  readonly inisial: string;
  readonly nada: 'navy' | 'sky' | 'gold' | 'netral';
}

export interface LombaSaya {
  readonly id: string;
  readonly nama: string;
  readonly kategori: string;
  readonly tipe: 'Tim' | 'Individual';
  /** Slug ikon cabang di `/uploads/icon_cabor/<slug>.svg`. */
  readonly ikon: string;
  readonly status: StatusPendaftaran;
  readonly peran?: 'Ketua' | 'Anggota';
  readonly roster?: readonly AnggotaRingkas[];
  readonly rosterTeks?: string;
  readonly kuotaTerpakai: number;
  readonly kuotaTotal: number;
  readonly kuotaSatuan: string;
  readonly jadwalTeks: string;
  readonly nomorReferensi: string;
  readonly didaftarkan: string;
  /** Riwayat = pendaftaran yang sudah tidak aktif (selesai, ditarik, ditolak). */
  readonly riwayat: boolean;
  /** Satu kalimat: apa arti status ini bagi peserta. */
  readonly artiStatus: string;
  /** Alasan dari panitia, hanya untuk status yang butuh perbaikan/ditolak. */
  readonly catatanPanitia?: string;
  /** Tenggat tindak lanjut, kalau ada. */
  readonly tenggat?: string;
}

export interface AgendaPeserta {
  readonly id: string;
  readonly tanggal: string;
  readonly bulan: string;
  readonly nama: string;
  readonly detail: string;
  readonly jam: string;
  readonly jamLama?: string;
  readonly venue: string;
  readonly berubah: boolean;
}

export interface HasilPertandingan {
  readonly id: string;
  readonly nama: string;
  readonly skor: string;
  readonly lawan: string;
  readonly babak: string;
  readonly status: string;
  readonly nada: Nada;
}

export interface StatistikPeserta {
  readonly nilai: string;
  readonly label: string;
  readonly ikon: NamaIkon;
}

export interface AktivitasPeserta {
  readonly id: string;
  readonly teks: string;
  readonly waktu: string;
  readonly nada: Nada;
}

export interface KontakBantuan {
  readonly nama: string;
  readonly keterangan: string;
  readonly ikon: NamaIkon;
}

export interface NotifikasiPeserta {
  readonly id: string;
  readonly judul: string;
  readonly konteks: string;
  readonly waktu: string;
  readonly baru: boolean;
  readonly nada: Nada;
  readonly ikon: NamaIkon;
}

/** Nama ikon yang tersedia di `components/app/Ikon.tsx`. */
export type NamaIkon =
  | 'grid'
  | 'piala'
  | 'orangBanyak'
  | 'kalender'
  | 'berkas'
  | 'orang'
  | 'bantuan'
  | 'titik'
  | 'gear'
  | 'piagam'
  | 'jam'
  | 'centang'
  | 'seru'
  | 'silang'
  | 'ulang'
  | 'amplop'
  | 'qr'
  | 'telepon'
  | 'chat'
  | 'lonceng'
  | 'panah'
  | 'lokasi'
  | 'unduh';
