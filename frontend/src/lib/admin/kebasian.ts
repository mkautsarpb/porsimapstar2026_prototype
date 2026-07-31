import type { StatusWidgetDTO } from '@/types/api/admin-dashboard';

/**
 * Ambang batas kebasian per metrik dan penggabungan penilaian server + client.
 *
 * Aturan yang ditegakkan di sini (AC-FE-09, agents.md §10):
 *
 *  - Angka lama TIDAK PERNAH ditampilkan seolah baru. Begitu umurnya melewati
 *    ambang, widget masuk `stale` dan angkanya diredupkan plus diberi umur.
 *  - **Yang lebih pesimis menang.** Server boleh mengirim `stale`; client tetap
 *    menghitung sendiri. Kalau salah satu bilang basi, hasilnya basi. Ini jaring
 *    pengaman untuk jam server yang melenceng dan respons yang tertahan proxy.
 *  - Widget berstatus `ready`/`stale` tanpa `last_updated_at` dipaksa ke `gagal`.
 *    Angka tanpa waktu pembaruan tidak bisa dinilai umurnya, jadi tidak boleh
 *    dipakai untuk keputusan apa pun.
 */

export type KondisiWidget = 'normal' | 'memuat' | 'stale' | 'gagal' | 'belum-mulai';

const AMBANG_MINIMUM_DETIK = 120;
const AMBANG_MAKSIMUM_DETIK = 900;
const KELIPATAN_INTERVAL = 3;

/**
 * Metrik yang dihitung ulang tiap 60 detik dianggap basi setelah 3 kali lewat
 * tanpa kabar — sekali terlewat masih wajar (jitter jaringan), tiga kali berarti
 * ada yang berhenti. Dibatasi 2–15 menit supaya interval yang sangat pendek atau
 * sangat panjang tidak menghasilkan ambang yang tidak masuk akal.
 */
export function ambangStaleDetik(intervalHitungUlangDetik: number): number {
  const dasar = Math.max(0, intervalHitungUlangDetik) * KELIPATAN_INTERVAL;
  return Math.min(Math.max(dasar, AMBANG_MINIMUM_DETIK), AMBANG_MAKSIMUM_DETIK);
}

/**
 * Umur data dalam detik.
 *
 * Dihitung dari selisih waktu SERVER (`server_time` − `last_updated_at`), lalu
 * ditambah waktu yang berlalu di client sejak payload diterima. Cara ini kebal
 * terhadap selisih jam browser–server: yang dipakai cuma durasi, tidak pernah
 * membandingkan jam browser dengan jam server secara langsung.
 */
export function hitungUmurDetik(
  waktuServerIso: string,
  diperbaruiIso: string | null,
  hanyutKlienDetik = 0,
): number | null {
  if (!diperbaruiIso) return null;

  const server = Date.parse(waktuServerIso);
  const diperbarui = Date.parse(diperbaruiIso);
  if (Number.isNaN(server) || Number.isNaN(diperbarui)) return null;

  const umurServer = (server - diperbarui) / 1000;
  return Math.max(0, umurServer + Math.max(0, hanyutKlienDetik));
}

const BOBOT: Readonly<Record<KondisiWidget, number>> = {
  normal: 0,
  memuat: 0,
  'belum-mulai': 0,
  stale: 1,
  gagal: 2,
};

/** Mengambil kondisi terburuk di antara dua penilaian. */
export function palingPesimis(a: KondisiWidget, b: KondisiWidget): KondisiWidget {
  return BOBOT[a] >= BOBOT[b] ? a : b;
}

export interface MasukanKondisi {
  readonly statusServer: StatusWidgetDTO;
  readonly diperbaruiIso: string | null;
  readonly umurDetik: number | null;
  readonly intervalHitungUlangDetik: number;
  /** Permintaan penyegaran terakhir gagal — angka di layar sudah tidak dijamin. */
  readonly penyegaranGagal?: boolean;
}

export function tentukanKondisi(m: MasukanKondisi): KondisiWidget {
  if (m.statusServer === 'error') return 'gagal';
  if (m.statusServer === 'not_started') return 'belum-mulai';

  // Invariant: angka tanpa waktu pembaruan tidak pernah dirender sebagai angka.
  if (!m.diperbaruiIso || m.umurDetik === null) return 'gagal';

  const dariServer: KondisiWidget = m.statusServer === 'stale' ? 'stale' : 'normal';
  const lewatAmbang = m.umurDetik > ambangStaleDetik(m.intervalHitungUlangDetik);
  const dariKlien: KondisiWidget = lewatAmbang || m.penyegaranGagal ? 'stale' : 'normal';

  return palingPesimis(dariServer, dariKlien);
}
