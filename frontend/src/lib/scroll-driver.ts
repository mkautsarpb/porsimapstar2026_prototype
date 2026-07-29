/**
 * Satu sumber posisi scroll untuk seluruh halaman.
 *
 * Kenapa terpusat: tiap pembaca scroll yang punya loop sendiri akan
 * menyelang-nyeling baca dan tulis DOM ("layout thrashing") — browser terpaksa
 * menghitung ulang layout di tengah frame, dan gulir terasa tersendat. Di sini
 * seluruh **pembacaan** dilakukan sekali di awal frame, lalu hasilnya dibagikan;
 * pelanggan cukup menulis, tidak boleh membaca layout lagi.
 *
 * Nilai yang mahal dibaca (`scrollHeight`, ukuran viewport) di-cache dan hanya
 * dihitung ulang saat ukuran berubah, bukan tiap frame.
 */

export interface KeadaanScroll {
  /** Posisi scroll vertikal dalam piksel. */
  readonly y: number;
  /** Jarak scroll maksimum, minimal 1 supaya aman dibagi. */
  readonly max: number;
  /** Kemajuan 0..1. */
  readonly progress: number;
  readonly vw: number;
  readonly vh: number;
}

type Pelanggan = (keadaan: KeadaanScroll) => void;

const pelanggan = new Set<Pelanggan>();

let terpasang = false;
let menunggu = false;
let tinggiDokumen = 0;
let vw = 0;
let vh = 0;

/** Satu-satunya tempat layout dibaca. Mahal, jadi hanya saat ukuran berubah. */
function ukurDokumen(): void {
  vw = window.innerWidth;
  vh = window.innerHeight;
  tinggiDokumen = document.documentElement.scrollHeight;
}

function frame(): void {
  menunggu = false;
  const max = Math.max(tinggiDokumen - vh, 1);
  const y = window.scrollY;
  const keadaan: KeadaanScroll = { y, max, progress: Math.min(y / max, 1), vw, vh };
  pelanggan.forEach((fn) => fn(keadaan));
}

function jadwalkan(): void {
  if (menunggu) return;
  menunggu = true;
  requestAnimationFrame(frame);
}

function onResize(): void {
  ukurDokumen();
  jadwalkan();
}

let ro: ResizeObserver | undefined;

function pasang(): void {
  if (terpasang) return;
  terpasang = true;
  ukurDokumen();
  window.addEventListener('scroll', jadwalkan, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });
  // Tinggi dokumen bisa berubah tanpa resize window — mis. akordeon FAQ dibuka.
  ro = new ResizeObserver(onResize);
  ro.observe(document.body);
}

function lepas(): void {
  if (!terpasang) return;
  terpasang = false;
  window.removeEventListener('scroll', jadwalkan);
  window.removeEventListener('resize', onResize);
  ro?.disconnect();
  ro = undefined;
}

/**
 * Daftarkan callback yang dipanggil tiap frame saat halaman digulir.
 * Callback **hanya boleh menulis** ke DOM, jangan membaca layout di dalamnya.
 * Mengembalikan fungsi untuk berhenti berlangganan.
 */
export function langgananScroll(fn: Pelanggan): () => void {
  pelanggan.add(fn);
  pasang();
  jadwalkan();

  return () => {
    pelanggan.delete(fn);
    if (pelanggan.size === 0) lepas();
  };
}

/** Paksa pengukuran ulang setelah perubahan tata letak yang kita picu sendiri. */
export function ukurUlangScroll(): void {
  if (!terpasang) return;
  ukurDokumen();
  jadwalkan();
}
