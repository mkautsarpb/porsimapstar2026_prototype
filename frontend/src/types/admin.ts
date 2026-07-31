// `Nada` diambil dari `types/peserta`, bukan `types/panitia`: skala di sini
// dipakai `Lencana`, yang punya keadaan `netral` untuk status tanpa urgensi
// (draf, nonaktif, kedaluwarsa). Skala dashboard tidak mengenalnya karena setiap
// widget di sana selalu punya arti operasional.
import type { Nada } from './peserta';

/**
 * Model UI modul Panel Panitia — Batch E1 (Peserta & Verifikasi), E2 (Lomba &
 * Jadwal), E3 (Pertandingan & Check-in), E4 (Sponsor, CMS, Laporan, Sinkronisasi).
 *
 * Dipisah dari `types/panitia.ts` yang khusus dashboard bertab: yang di sana
 * membawa definisi metrik, umur data, dan keadaan basi karena angkanya
 * di-polling. Modul di berkas ini menampilkan daftar kerja yang dihalaman ulang
 * di server, jadi bentuk datanya memang berbeda, bukan sekadar dipisah per rute.
 *
 * TODO(api-contract): seluruh bentuk di bawah masih ditentukan frontend. Yang
 * ditunggu dari backend disebut per bagian; penamaan Bahasa Indonesia di sini
 * adalah model UI, dan normalisasinya dilakukan sekali di `lib/admin/`.
 *
 * Aturan yang berlaku untuk SELURUH berkas ini: tidak ada field yang memuat NIK
 * penuh, email penuh, atau nomor telepon penuh. Yang boleh masuk model UI hanya
 * bentuk yang sudah termasking dari server (agents.md §6).
 */

/** Satuan kuota. Cabang tim menghitung TIM, cabang individu menghitung ORANG. */
export type SatuanKuota = 'tim' | 'peserta';

export interface RentangKuota {
  readonly terisi: number;
  readonly kapasitas: number | null;
  readonly satuan: SatuanKuota;
  readonly daftarTunggu: number;
}

// ---------------------------------------------------------------------------
// E1.1 — Peserta
// ---------------------------------------------------------------------------

export type StatusAkunPeserta = 'aktif' | 'belum-verifikasi-email' | 'nonaktif';

export interface BarisPeserta {
  readonly id: string;
  readonly nama: string;
  /** Sudah termasking dari server — bentuk penuh tidak pernah dikirim ke client. */
  readonly idTermasking: string;
  readonly kategori: string;
  readonly institusi: string;
  readonly statusAkun: StatusAkunPeserta;
  readonly kelengkapan: { readonly terisi: number; readonly total: number };
  readonly jumlahLomba: number;
  readonly terakhirAktifIso: string;
  readonly lomba: readonly string[];
}

export type KeadaanBerkas = 'menunggu' | 'disetujui' | 'ditolak' | 'belum-diunggah';

export interface BerkasPeserta {
  readonly id: string;
  readonly jenis: string;
  readonly riwayat: string;
  readonly keadaan: KeadaanBerkas;
  readonly keterangan: string;
  /** Dokumen yang bisa dibuka pratinjaunya — tombolnya tetap butuh izin. */
  readonly hrefPratinjau: string | null;
}

export interface PendaftaranLintasLomba {
  readonly id: string;
  readonly lomba: string;
  readonly tim: string;
  readonly peran: string;
  readonly status: string;
  readonly nada: Nada;
}

export interface JejakAktivitas {
  readonly id: string;
  readonly judul: string;
  readonly meta: string;
}

export interface DetailPeserta {
  readonly id: string;
  readonly nama: string;
  readonly inisial: string;
  readonly idTermasking: string;
  readonly statusAkun: StatusAkunPeserta;
  readonly kategori: string;
  readonly institusi: string;
  readonly terdaftarIso: string;
  readonly identitas: readonly { readonly label: string; readonly nilai: string }[];
  readonly berkas: readonly BerkasPeserta[];
  readonly pendaftaran: readonly PendaftaranLintasLomba[];
  /** Jumlah lomba di LUAR cakupan peran: disebut angkanya, bukan isinya. */
  readonly lombaDiLuarCakupan: number;
  readonly aktivitas: readonly JejakAktivitas[];
}

// ---------------------------------------------------------------------------
// E1.2 — Verifikasi dokumen
// ---------------------------------------------------------------------------

export interface BarisAntreanVerifikasi {
  readonly id: string;
  readonly umurJam: number;
  readonly masukIso: string;
  readonly namaPeserta: string;
  readonly idTermasking: string;
  readonly lomba: string;
  readonly jenisDokumen: string;
  readonly versi: string;
  readonly otomatis: { readonly lolos: number; readonly total: number };
  readonly ditugaskan: string | null;
}

export interface ButirPemeriksaan {
  readonly id: string;
  readonly judul: string;
  readonly lolos: boolean;
  readonly rincian: string;
}

export interface DokumenKeputusan {
  readonly id: string;
  readonly jenisDokumen: string;
  readonly namaBerkas: string;
  readonly ukuran: string;
  readonly unggahIso: string;
  readonly versi: string;
  readonly umurJam: number;
  readonly namaPeserta: string;
  readonly idTermasking: string;
  readonly kategori: string;
  readonly institusi: string;
  readonly lomba: string;
  readonly nikTermasking: string;
  readonly pemeriksaan: readonly ButirPemeriksaan[];
  readonly tautanKedaluwarsaDetik: number;
  readonly refLog: string;
  readonly posisi: { readonly indeks: number; readonly total: number };
  readonly hrefSebelumnya: string | null;
  readonly hrefBerikutnya: string | null;
}

// ---------------------------------------------------------------------------
// E2.1 — Lomba & kuota
// ---------------------------------------------------------------------------

export type StatusPendaftaranCabang = 'buka' | 'penuh' | 'daftar-tunggu' | 'tutup';

export interface BarisCabang {
  readonly id: string;
  readonly nama: string;
  readonly kategori: 'Olahraga' | 'Non-olahraga';
  readonly tipe: 'Tim' | 'Individu';
  readonly kuota: RentangKuota;
  readonly status: StatusPendaftaranCabang;
  readonly tenggatIso: string;
  readonly pic: string;
}

export interface RiwayatKuota {
  readonly id: string;
  readonly waktuIso: string;
  readonly oleh: string;
  readonly perubahan: string;
  readonly alasan: string;
  readonly ref: string;
}

export interface AntreDaftarTunggu {
  readonly posisi: number;
  readonly tim: string;
  readonly daftarIso: string;
  readonly jumlahPeserta: number;
}

export interface OfisialCabang {
  readonly id: string;
  readonly nama: string;
  readonly peran: string;
  readonly jumlahSesi: number;
}

export interface DetailCabang extends BarisCabang {
  readonly roster: { readonly minimum: number; readonly maksimum: number } | null;
  readonly ketentuan: string;
  readonly juknis: {
    readonly nama: string;
    readonly versi: number;
    readonly tanggalIso: string;
    readonly ukuran: string;
    readonly dilihat: number;
  };
  readonly picEmail: string;
  readonly venue: readonly string[];
  readonly ofisial: readonly OfisialCabang[];
  readonly kebijakanDaftarTunggu: string;
  readonly keadaanSekarang: string;
  readonly riwayatKuota: readonly RiwayatKuota[];
  readonly daftarTunggu: readonly AntreDaftarTunggu[];
}

// ---------------------------------------------------------------------------
// E2.2 — Jadwal
// ---------------------------------------------------------------------------

export interface SesiJadwal {
  readonly id: string;
  /** Jam lokal "08.00" — papan waktu memakai jam venue, bukan zona perangkat. */
  readonly mulai: string;
  readonly selesai: string;
  readonly cabang: string;
  readonly babak: string;
  readonly venue: string;
  readonly ofisial: string | null;
  readonly jumlahBentrok: number;
}

export type JenisBentrok = 'venue' | 'peserta' | 'ofisial';

export interface BentrokJadwal {
  readonly id: string;
  readonly jenis: JenisBentrok;
  readonly judul: string;
  readonly subjek: string;
  readonly rincian: string;
  readonly tumpangTindih: string;
  readonly saran: readonly string[];
}

export interface VersiJadwal {
  readonly id: string;
  readonly label: string;
  readonly diterbitkan: string;
  readonly perubahan: string;
  readonly notifikasi: string;
  readonly draf: boolean;
}

// ---------------------------------------------------------------------------
// E3.1 — Pertandingan
// ---------------------------------------------------------------------------

export type StatusPertandingan =
  | 'berlangsung'
  | 'terjadwal'
  | 'selesai'
  | 'ditunda'
  | 'dibatalkan';

export interface BarisPertandingan {
  readonly id: string;
  readonly jamJadwal: string;
  /** Diisi hanya bila laga dimulai terlambat — angka menit ikut ditulis. */
  readonly terlambatMenit: number | null;
  readonly jamMulaiAktual: string | null;
  readonly cabang: string;
  readonly babak: string;
  readonly pesertaA: string;
  readonly pesertaB: string;
  readonly venue: string;
  readonly status: StatusPertandingan;
  readonly skor: string | null;
  readonly skorMeta: string | null;
  readonly catatanStatus: string | null;
  readonly bolehCatat: boolean;
}

export interface LagaBagan {
  readonly id: string;
  readonly a: { readonly nama: string; readonly skor: string | null };
  readonly b: { readonly nama: string; readonly skor: string | null };
  readonly keadaan: 'selesai' | 'berlangsung' | 'menunggu';
  readonly meta: string | null;
}

export interface BabakBagan {
  readonly id: string;
  readonly label: string;
  readonly jumlahLaga: number;
  readonly laga: readonly LagaBagan[];
  readonly catatan: string | null;
}

export interface RiwayatHasil {
  readonly id: string;
  readonly waktuIso: string;
  readonly oleh: string;
  readonly peran: string;
  readonly perubahan: string;
  readonly alasan: string;
  readonly ref: string;
}

// ---------------------------------------------------------------------------
// E3.2 — Check-in
// ---------------------------------------------------------------------------

export type HasilPindai = 'berhasil' | 'duplikat' | 'ditolak' | 'manual';

export interface KodeAlasanPindai {
  readonly kode: string;
  readonly arti: string;
}

export interface BarisPindai {
  readonly id: string;
  readonly waktu: string;
  readonly venue: string;
  readonly petugas: string;
  readonly cabang: string;
  readonly hasil: HasilPindai;
  readonly kode: string | null;
}

export interface LajuPindai {
  readonly id: string;
  readonly nama: string;
  readonly jumlah: number;
  readonly keterangan?: string;
}

// ---------------------------------------------------------------------------
// E4.1 — Sponsor
// ---------------------------------------------------------------------------

export type TingkatSponsor = 'utama' | 'pendukung' | 'media';

export interface BarisSponsor {
  readonly id: string;
  readonly urutan: number;
  readonly nama: string;
  readonly tingkat: TingkatSponsor;
  readonly formatLogo: string;
  readonly dimensiLogo: string;
  readonly memenuhiPanduan: boolean;
  readonly tautan: string;
  readonly tayang: boolean;
  readonly catatan: string | null;
}

// ---------------------------------------------------------------------------
// E4.2 — CMS portal publik
// ---------------------------------------------------------------------------

export type StatusKonten = 'draf' | 'terjadwal' | 'tayang';

export interface BarisKonten {
  readonly id: string;
  readonly judul: string;
  readonly jenis: string;
  readonly status: StatusKonten;
  readonly waktu: string;
  readonly versi: string;
  readonly penulis: string;
  readonly jadwalTerbit: string | null;
}

export interface VersiKonten {
  readonly id: string;
  readonly label: string;
  readonly oleh: string;
  readonly waktu: string;
  readonly notifikasi: string;
  readonly keadaan: 'disunting' | 'tayang' | 'lama';
}

// ---------------------------------------------------------------------------
// E4.3 — Laporan & ekspor
// ---------------------------------------------------------------------------

export type KeadaanEkspor = 'berjalan' | 'siap' | 'gagal' | 'kedaluwarsa';

export interface PekerjaanEkspor {
  readonly id: string;
  readonly ref: string;
  readonly judul: string;
  readonly keadaan: KeadaanEkspor;
  readonly persen: number | null;
  readonly barisDiproses: number | null;
  readonly totalBaris: number;
  readonly jumlahKolom: number;
  readonly oleh: string;
  readonly mulai: string;
  readonly selesai: string | null;
  readonly berlakuSampai: string | null;
  readonly sisaMenit: number | null;
  readonly ukuran: string | null;
  readonly catatanMasking: string;
}

export interface BarisRiwayatEkspor {
  readonly id: string;
  readonly waktu: string;
  readonly oleh: string;
  readonly laporan: string;
  readonly filter: string;
  readonly baris: number;
  readonly statusTautan: string;
  readonly nada: Nada;
}

export interface RekapCabang {
  readonly id: string;
  readonly cabang: string;
  readonly jumlah: number;
}

export interface RekapInstitusi {
  readonly id: string;
  readonly institusi: string;
  readonly peserta: number;
  readonly tim: number;
}

// ---------------------------------------------------------------------------
// E4.4 — Sinkronisasi & kesehatan sistem
// ---------------------------------------------------------------------------

export interface LembarSheets {
  readonly id: string;
  readonly nama: string;
  readonly suksesTerakhir: string;
  readonly baris: string;
  readonly galat: { readonly kode: string; readonly teks: string } | null;
}

export interface AntreanNotifikasi {
  readonly kanal: string;
  readonly antre: number;
  readonly terkirim: number;
  readonly sampai: number;
  readonly gagal: number;
}

export interface KartuKesehatan {
  readonly id: string;
  readonly nama: string;
  readonly keadaan: 'normal' | 'perhatian' | 'gagal';
  readonly nilai: string;
  readonly rincian: string;
}
