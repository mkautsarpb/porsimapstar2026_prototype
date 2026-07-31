import type { SesiJadwal } from '@/types/admin';
import adm from '@/components/admin/adm.module.css';
import styles from './PapanWaktu.module.css';

const MENIT_PER_BARIS = 30;

/** "13.30" → 810 menit. Format jam venue, bukan ISO: papan ini milik satu hari. */
function keMenit(jam: string): number {
  const [j, m] = jam.split('.');
  return Number.parseInt(j ?? '0', 10) * 60 + Number.parseInt(m ?? '0', 10);
}

/**
 * Papan waktu jadwal per venue (E2.2a).
 *
 * Rentang papan dibatasi jam kerja venue, dan sesi di luar rentang itu TIDAK
 * dipotong diam-diam — jumlahnya disebut di kaki papan beserta arahan ke
 * tampilan daftar. Papan yang memotong tanpa memberi tahu adalah cara paling
 * mudah kehilangan satu sesi menjelang hari-H.
 *
 * Sesi yang terlibat bentrok ditandai pola garis DAN kata "bentrok" pada
 * bloknya, bukan warna merah saja (agents.md §7).
 *
 * Menggeser blok dengan drag dan panah papan tik ada di dokumen desain dan
 * belum diimplementasikan di sini; yang menahan bukan tampilannya melainkan
 * endpoint pemindahan sesi plus pemeriksaan bentrok ulang di server.
 */
export function PapanWaktu({
  sesi,
  venue,
  jamMulai,
  jamSelesai,
}: {
  readonly sesi: readonly SesiJadwal[];
  readonly venue: readonly string[];
  readonly jamMulai: number;
  readonly jamSelesai: number;
}) {
  const awal = jamMulai * 60;
  const akhir = jamSelesai * 60;
  const jumlahBaris = (akhir - awal) / MENIT_PER_BARIS;

  const jamLabel = Array.from({ length: jamSelesai - jamMulai }, (_, i) => `${jamMulai + i}.00`);

  const diPapan = sesi.filter((s) => keMenit(s.mulai) >= awal && keMenit(s.mulai) < akhir);
  const diLuar = sesi.filter((s) => !diPapan.includes(s));

  const terbentrok = diPapan.filter((s) => s.jumlahBentrok > 0).length;

  return (
    <div className={styles.bungkus}>
      <div
        style={{
          gridTemplateColumns: `72px repeat(${venue.length}, minmax(180px, 1fr))`,
          gridTemplateRows: `auto repeat(${jumlahBaris}, 28px)`,
        }}
        className={styles.papan}
      >
        <span className={styles.sudut}>Waktu</span>

        {venue.map((v) => (
          <span key={v} className={styles.kepalaVenue}>
            {v}
          </span>
        ))}

        {jamLabel.map((j, i) => (
          <span
            key={j}
            style={{ gridColumn: 1, gridRow: i * 2 + 2 }}
            className={styles.jam}
          >
            {j}
          </span>
        ))}

        {Array.from({ length: jumlahBaris }, (_, i) => (
          <span
            key={`garis-${i}`}
            aria-hidden="true"
            style={{ gridColumn: `2 / span ${venue.length}`, gridRow: i + 2 }}
            data-tebal={i % 2 === 0}
            className={styles.garis}
          />
        ))}

        {diPapan.map((s) => {
          const kolom = venue.indexOf(s.venue);
          if (kolom < 0) return null;

          const barisMulai = (keMenit(s.mulai) - awal) / MENIT_PER_BARIS + 2;
          const rentang = Math.max(
            1,
            (Math.min(keMenit(s.selesai), akhir) - keMenit(s.mulai)) / MENIT_PER_BARIS,
          );

          return (
            <article
              key={s.id}
              data-bentrok={s.jumlahBentrok > 0}
              style={{ gridColumn: kolom + 2, gridRow: `${barisMulai} / span ${rentang}` }}
              className={styles.blok}
            >
              <p className={styles.blokJudul}>
                {s.cabang} · {s.babak}
              </p>
              <p className={styles.blokMeta}>
                {s.mulai}–{s.selesai}
                {s.ofisial ? ` · ${s.ofisial}` : ' · wasit belum ditugaskan'}
              </p>
              {s.jumlahBentrok > 0 ? (
                <p className={styles.blokBentrok}>
                  {s.jumlahBentrok} bentrok — lihat panel di samping
                </p>
              ) : null}
            </article>
          );
        })}
      </div>

      <div className={styles.legenda}>
        <span className={styles.legendaItem}>
          <span aria-hidden="true" className={styles.contohAman} />
          Sesi tanpa bentrok · {diPapan.length - terbentrok} sesi
        </span>
        <span className={styles.legendaItem}>
          <span aria-hidden="true" className={styles.contohBentrok} />
          Sesi terlibat bentrok · {terbentrok} sesi
        </span>
      </div>

      <p className={adm.catatan}>
        {diPapan.length} dari {sesi.length} sesi tergambar di papan ini.{' '}
        {diLuar.length > 0
          ? `${diLuar.length} sesi berada di luar rentang ${jamMulai}.00–${jamSelesai}.00 (${diLuar
              .map((s) => `${s.cabang} ${s.mulai}`)
              .join(', ')}) dan hanya terlihat di tampilan daftar.`
          : 'Seluruh sesi hari ini masuk rentang papan.'}
      </p>
    </div>
  );
}
