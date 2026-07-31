import type { DokumenPeserta, StatusDokumen } from '@/types/peserta';

/**
 * Dokumen persyaratan peserta (desain "Batch C — Dokumen").
 *
 * Halaman Dokumen adalah SATU-SATUNYA tempat mengunggah berkas. Tahap Dokumen di
 * stepper Profil hanya menautkan ke sini; menduplikasi area unggah berarti dua
 * tempat dengan aturan versi yang bisa berbeda.
 *
 * TODO(api-contract):
 *   GET  /api/v1/me/documents                 -> daftar + status + riwayat versi
 *   POST /api/v1/me/documents/{id}/versions   -> unggah versi baru (multipart)
 * MIME, checksum, dan pemindaian virus adalah keputusan server. Yang di client
 * hanya pemeriksaan ekstensi dan ukuran untuk UX (agents.md §5).
 */

export const BATAS_PERBAIKAN = '5 Agustus 2026, 23.59';

export const DOKUMEN: readonly DokumenPeserta[] = [
  {
    id: 'surat-aktif',
    nama: 'Surat keterangan aktif kuliah',
    keterangan: 'Diterbitkan bagian akademik, memuat tanda tangan dan stempel',
    status: 'perlu-diperbaiki',
    berkas: 'surat-aktif-v2.pdf · 1,2 MB · diunggah 28 Jul 2026, 21.30 · versi 2',
    arti: `Panitia menolak versi terakhir. Unggah ulang sebelum ${BATAS_PERBAIKAN}.`,
    catatanPanitia:
      'Scan terpotong di bagian tanda tangan dan stempel, sehingga keabsahan surat tidak bisa dipastikan saat verifikasi. Unggah ulang halaman penuh tanpa bagian yang terpotong.',
    catatanWaktu: 'Catatan panitia · 29 Juli 2026, 10.05',
    contoh:
      'Contoh yang diterima: satu halaman penuh, seluruh tepi kertas terlihat, tanda tangan dan stempel tidak tertutup, teks terbaca tanpa perlu diperbesar.',
    ketentuan: 'PDF, JPG, atau PNG · maksimal 5 MB · seluruh halaman harus terbaca',
    riwayat: [
      {
        versi: 'v2',
        berkas: 'surat-aktif-v2.pdf · 1,2 MB',
        diunggah: '28 Jul 2026, 21.30',
        hasil: 'Ditolak · tanda tangan dan stempel terpotong',
        nada: 'danger',
      },
      {
        versi: 'v1',
        berkas: 'IMG_2291.jpg · 3,4 MB',
        diunggah: '26 Jul 2026, 08.11',
        hasil: 'Ditolak · resolusi terlalu kecil',
        nada: 'danger',
      },
    ],
  },
  {
    id: 'ktp',
    nama: 'KTP',
    keterangan: 'Dipakai mencocokkan identitas saat check-in',
    status: 'disetujui',
    berkas: 'ktp-bagas.pdf · 820 KB · diunggah 24 Jul 2026, 08.20 · versi 1',
    arti: 'Disetujui panitia 25 Juli 2026, 09.02. Tidak ada yang perlu kamu lakukan.',
    ketentuan: 'PDF, JPG, atau PNG · maksimal 5 MB',
    riwayat: [
      {
        versi: 'v1',
        berkas: 'ktp-bagas.pdf · 820 KB',
        diunggah: '24 Jul 2026, 08.20',
        hasil: 'Disetujui 25 Jul 2026, 09.02',
        nada: 'ok',
      },
    ],
  },
  {
    id: 'kartu-mahasiswa',
    nama: 'Kartu mahasiswa',
    keterangan:
      'Sesuai kategori pesertamu. Peserta pelajar mengunggah kartu pelajar, taruna mengunggah kartu taruna.',
    status: 'belum-diunggah',
    arti: 'Belum ada berkas yang diunggah. Pendaftaran belum bisa dikirim tanpa dokumen ini.',
    ketentuan:
      'PDF, JPG, atau PNG · maksimal 5 MB · pastikan nama, NIM, dan masa berlaku terbaca',
    riwayat: [],
  },
  {
    id: 'foto-diri',
    nama: 'Foto diri',
    keterangan: 'Latar polos, tampak wajah penuh, tanpa penutup wajah',
    status: 'sedang-diperiksa',
    berkas: 'foto-diri-bagas.jpg · 640 KB · diunggah 30 Jul 2026, 07.45 · versi 2',
    arti:
      'Masuk antrean pemeriksaan. Hasil biasanya keluar dalam 1×24 jam kerja; kamu tidak perlu mengunggah ulang selama status ini — unggahan baru justru menggeser posisimu ke belakang antrean.',
    ketentuan: 'JPG atau PNG · maksimal 5 MB · sisi terpendek minimal 600 px',
    riwayat: [
      {
        versi: 'v2',
        berkas: 'foto-diri-bagas.jpg · 640 KB',
        diunggah: '30 Jul 2026, 07.45',
        hasil: 'Sedang diperiksa',
        nada: 'info',
      },
      {
        versi: 'v1',
        berkas: 'IMG_1180.jpg · 2,1 MB',
        diunggah: '24 Jul 2026, 08.05',
        hasil: 'Ditolak · wajah tertutup bayangan',
        nada: 'danger',
      },
    ],
  },
];

export const LABEL_DOKUMEN: Record<
  StatusDokumen,
  { label: string; nada: 'ok' | 'warn' | 'danger' | 'info' | 'netral'; ikon: 'centang' | 'jam' | 'seru' | 'unduh' }
> = {
  disetujui: { label: 'Disetujui', nada: 'ok', ikon: 'centang' },
  'sedang-diperiksa': { label: 'Sedang diperiksa', nada: 'info', ikon: 'jam' },
  'perlu-diperbaiki': { label: 'Perlu diperbaiki', nada: 'danger', ikon: 'seru' },
  'belum-diunggah': { label: 'Belum diunggah', nada: 'netral', ikon: 'unduh' },
};

export function ringkasanDokumen(): string {
  const hitung = (s: StatusDokumen) => DOKUMEN.filter((d) => d.status === s).length;

  return [
    `${hitung('disetujui')} dari ${DOKUMEN.length} dokumen disetujui`,
    `${hitung('sedang-diperiksa')} sedang diperiksa`,
    `${hitung('perlu-diperbaiki')} perlu diperbaiki`,
    `${hitung('belum-diunggah')} belum diunggah`,
  ].join(' · ');
}
