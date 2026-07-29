import type { Lomba, RingkasanKuota, StatusKuota } from '@/types/landing';

/**
 * Turunan tampilan dari angka kuota.
 *
 * Ini murni presentasi: server tetap satu-satunya yang menentukan apakah sebuah
 * pendaftaran diterima (agents.md §0 prinsip 1). Fungsi ini hanya memformat apa
 * yang sudah dikirim server supaya kartu dan modal tidak menghitung sendiri.
 */
export function ringkasKuota(lomba: Pick<Lomba, 'terisi' | 'kapasitas'>): RingkasanKuota {
  const { terisi, kapasitas } = lomba;
  const persen = kapasitas > 0 ? Math.round((terisi / kapasitas) * 100) : 0;
  const sisa = Math.max(0, kapasitas - terisi);
  const penuh = persen >= 100;
  const hampir = !penuh && persen >= 70;
  const status: StatusKuota = penuh ? 'penuh' : hampir ? 'hampir' : 'dibuka';

  return {
    status,
    persen,
    sisa,
    labelKuota: `${terisi}/${kapasitas} peserta`,
    labelSisa: penuh ? 'kuota penuh' : `sisa ${sisa}`,
    labelStatus: penuh ? 'Penuh' : hampir ? `Sisa sedikit · ${sisa} slot` : 'Dibuka',
    labelMeter: `${terisi} dari ${kapasitas} peserta terisi, ${penuh ? 'kuota penuh' : `sisa ${sisa} slot`}`,
    labelCta: penuh ? 'Lihat hasil undian' : 'Daftar lomba ini',
  };
}

/** Kelompok kategori dari label "Olahraga · beregu" → "Olahraga". */
export function grupDari(kategori: string): string {
  const [grup] = kategori.split(' · ');
  return grup ?? kategori;
}

/**
 * Ambil angka depan dari string seperti "4–6 personel" → "4–6".
 * Satuan dipindah ke label kecil di bawah angka besar pada modal.
 */
export function angkaDepan(nilai: string | undefined): string {
  if (!nilai) return '—';
  const cocok = nilai.match(/^\d+(?:[–-]\d+)?/);
  return cocok?.[0] ?? nilai;
}
