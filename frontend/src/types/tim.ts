/**
 * Tipe modul Tim & undangan (desain "Batch B — Tim Saya").
 *
 * TODO(api-contract): seluruh bentuk di bawah masih asumsi frontend. Endpoint yang
 * dibutuhkan (agents.md §1 prinsip 3, §9):
 *   GET    /api/v1/me/teams                        -> daftar tim yang diikuti
 *   GET    /api/v1/me/teams/{teamId}               -> roster, syarat submit, agenda
 *   GET    /api/v1/me/teams/{teamId}/history       -> jejak perubahan (tidak bisa dihapus)
 *   POST   /api/v1/me/teams                        -> buat tim (idempotency key)
 *   POST   /api/v1/me/teams/{teamId}/invitations   -> kirim undangan (idempotency key)
 *   DELETE /api/v1/me/teams/{teamId}/invitations/{id}
 *   POST   /api/v1/me/teams/{teamId}/submit        -> submit tim (idempotency key)
 *   GET    /api/v1/me/invitations                  -> kotak undangan, filter status
 *   POST   /api/v1/me/invitations/{token}/accept | /decline
 *
 * Yang TIDAK dihitung di client: `bergabung`, `menunggu`, kesiapan roster, dan
 * kelayakan submit. Semuanya datang jadi dari server — client hanya merender.
 */

import type { Nada, NamaIkon } from './peserta';

/** Tujuh status resmi undangan (desain panel "Status undangan"). */
export type StatusUndangan =
  | 'menunggu'
  | 'diterima'
  | 'ditolak'
  | 'kedaluwarsa'
  | 'dibatalkan'
  | 'konflik'
  | 'dicabut';

export type PeranTim = 'Ketua' | 'Anggota';

/** Siklus hidup tim dari sisi peserta. */
export type StatusTim = 'belum-disubmit' | 'menunggu-review' | 'terverifikasi';

/** Label + nada satu kolom status, supaya komponen tidak memetakan sendiri. */
export interface StatusRingkas {
  readonly label: string;
  readonly nada: Nada;
}

export interface AnggotaTim {
  readonly id: string;
  readonly nama: string;
  readonly inisial: string;
  /**
   * Participant code yang sudah tersamarkan server, atau email bila undangan
   * dikirim lewat email. Tidak pernah NIK atau dokumen (§6, FE-TEAM-207).
   */
  readonly identitas: string;
  readonly ketua: boolean;
  readonly kamu: boolean;
  /** Hanya `bergabung` yang dihitung sebagai roster (agents.md §9). */
  readonly keanggotaan: 'bergabung' | 'menunggu';
  /** Kolom kelengkapan — hanya untuk anggota yang sudah bergabung. */
  readonly profil?: StatusRingkas;
  readonly dokumen?: StatusRingkas;
  readonly syarat?: StatusRingkas;
  /** Undangan menunggu: batas jawab dan sisa cooldown kirim ulang. */
  readonly berlakuSampai?: string;
  readonly cooldown?: string;
  /** Penjelasan panitia yang boleh dilihat ketua: status saja, tanpa isi berkas. */
  readonly catatan?: string;
}

export interface SyaratSubmit {
  readonly id: string;
  readonly judul: string;
  readonly keterangan: string;
  readonly keadaan: 'ok' | 'warn' | 'belum';
  readonly aksiLabel?: string;
  readonly aksiHref?: string;
}

export interface JejakTim {
  readonly id: string;
  readonly teks: string;
  readonly meta: string;
  readonly nada: Nada;
}

export interface AgendaTim {
  readonly id: string;
  readonly tanggal: string;
  readonly bulan: string;
  readonly nama: string;
  readonly detail: string;
}

export interface TugasAnggota {
  readonly id: string;
  readonly judul: string;
  readonly keterangan: string;
  readonly cta: string;
  readonly href: string;
}

export interface BuktiSubmit {
  readonly nomorReferensi: string;
  readonly waktu: string;
  readonly jumlahAnggota: number;
}

export interface Tim {
  readonly id: string;
  readonly nama: string;
  readonly inisial: string;
  readonly lomba: string;
  readonly lombaId: string;
  readonly institusi: string;
  readonly ketua: string;
  readonly peranSaya: PeranTim;
  readonly status: StatusTim;
  readonly dibuat: string;

  /** Angka roster dari server. `menunggu` tidak pernah ikut dijumlahkan. */
  readonly bergabung: number;
  readonly menunggu: number;
  readonly minimal: number;
  readonly maksimal: number;
  /** Satu paragraf yang menjelaskan ketiga angka di atas dalam bahasa peserta. */
  readonly ringkasan: string;

  readonly terkunci: boolean;
  readonly kunciPada: string;
  readonly sisaKunci: string;

  readonly anggota: readonly AnggotaTim[];
  /** Baris penutup tabel roster: sisa slot dan anggota yang diringkas. */
  readonly catatanRoster?: string;

  readonly syarat: readonly SyaratSubmit[];
  readonly riwayat: readonly JejakTim[];
  readonly agenda: readonly AgendaTim[];

  /** Tampilan anggota: tugas yang hanya bisa dikerjakan pemilik akun. */
  readonly tugasSaya?: readonly TugasAnggota[];
  readonly bergabungSejak?: string;
  readonly ceritaBergabung?: string;

  readonly bukti?: BuktiSubmit;
}

export interface Undangan {
  readonly id: string;
  /** Token undangan — dipakai sebagai segmen URL, bukan data pribadi. */
  readonly token: string;
  readonly status: StatusUndangan;
  readonly tim: string;
  readonly inisial: string;
  readonly lomba: string;
  readonly institusi: string;
  readonly ketua: string;
  readonly dikirim: string;
  readonly batasJawab: string;
  readonly sisa: string;
  readonly rosterTim: string;
  readonly jadwalCabang: string;
  /** Untuk status riwayat: satu kalimat "apa yang terjadi dan kapan". */
  readonly penutup?: string;
  /** Status konflik: tim yang sudah kamu ikuti di cabang yang sama. */
  readonly timKonflik?: string;
  readonly timKonflikId?: string;
}

export interface LabelStatusUndangan {
  readonly label: string;
  readonly nada: Nada;
  readonly ikon: NamaIkon;
  readonly arti: string;
  readonly tindakan: string;
}
