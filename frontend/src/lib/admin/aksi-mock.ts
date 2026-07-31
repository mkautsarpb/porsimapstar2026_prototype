/**
 * Simulasi mutasi Panel Panitia untuk prototipe.
 *
 * TODO(api-contract): seluruh berkas ini diganti pemanggilan sungguhan. Kontrak
 * minimal yang dibutuhkan dari backend untuk setiap aksi kritis:
 *
 *   POST /api/v1/admin/<aksi>
 *   headers: X-Idempotency-Key: <uuid>   // agents.md §6, aksi kritis
 *   body:    { ...muatan, version: <rev yang dibaca UI>, reason: string }
 *   200:     { reference_id: string, occurred_at: string }
 *   409:     { code: 'VERSION_CONFLICT', current_version, decided_by, decided_at }
 *   429:     { code: 'RATE_LIMITED', retry_after_seconds }
 *   5xx:     { code, correlation_id }
 *
 * Yang TIDAK boleh berubah saat penggantian: pemanggil tetap menunggu jawaban
 * sebelum menampilkan keadaan berhasil. Prototipe pun tidak boleh mengklaim
 * sukses lebih dulu lalu memperbaikinya belakangan (agents.md §0 prinsip 1).
 */

export interface HasilAksi {
  readonly ok: boolean;
  /** Nomor referensi yang bisa disebut ke petugas dukungan (agents.md §4). */
  readonly ref: string;
  readonly waktuIso: string;
  /** Diisi hanya saat gagal — kalimat yang menyebut apa yang TIDAK terjadi. */
  readonly alasan?: string;
}

const JEDA_MS = 900;

let urutan = 4100;

function nomorRef(awalan: string): string {
  urutan += 1;
  return `${awalan}-${urutan}`;
}

/**
 * Menjalankan aksi kritis tiruan.
 *
 * `gagalkan` ada supaya jalur gagal bisa dilihat tanpa mematikan jaringan —
 * halaman demo memakainya untuk menggambarkan keadaan gagal di samping keadaan
 * berhasil, persis seperti dokumen desain menggambarkan keduanya berdampingan.
 */
export function jalankanAksi({
  awalan,
  waktuServerIso,
  gagalkan = false,
  alasanGagal,
}: {
  readonly awalan: string;
  readonly waktuServerIso: string;
  readonly gagalkan?: boolean;
  readonly alasanGagal?: string;
}): Promise<HasilAksi> {
  return new Promise((selesai) => {
    setTimeout(() => {
      selesai({
        ok: !gagalkan,
        ref: nomorRef(awalan),
        waktuIso: waktuServerIso,
        alasan: gagalkan
          ? (alasanGagal ??
            'Layanan menolak permintaan setelah 30 detik. Tidak ada perubahan yang tersimpan dan tidak ada notifikasi yang terkirim.')
          : undefined,
      });
    }, JEDA_MS);
  });
}
