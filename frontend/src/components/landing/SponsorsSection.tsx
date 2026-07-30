import { SPONSORS } from '@/data/konten';
import type { LevelSponsor, Sponsor } from '@/types/landing';
import shared from './shared.module.css';
import styles from './SponsorsSection.module.css';

/**
 * Jumlah salinan daftar sponsor di dalam rail. Terikat ke keyframe `cw-rail-ltr`
 * di SponsorsSection.module.css yang menggeser track tepat 100 / RAIL_SETS persen
 * — ubah keduanya bersamaan.
 */
const RAIL_SETS = 4;

const LABEL_LEVEL: Record<LevelSponsor, string> = {
  gold: 'Gold',
  silver: 'Silver',
  bronze: 'Bronze',
};

/**
 * Ukuran kartu dan logo diatur lewat `data-level`; makin tinggi levelnya makin
 * besar (lihat `.card[data-level=...]` di CSS).
 *
 * TODO(api-contract): kotak warna masih placeholder logo. Saat CMS sponsor siap,
 * ganti `mark` dengan <Image> logo resmi.
 */
function Kartu({ nama, level }: Sponsor) {
  return (
    <div title={`${nama} — sponsor ${LABEL_LEVEL[level]}`} data-level={level} className={styles.card}>
      <span aria-hidden="true" className={styles.mark} />
      <span className={styles.name}>{nama}</span>
      <span className={styles.tier}>{LABEL_LEVEL[level]}</span>
    </div>
  );
}

export function SponsorsSection() {
  return (
    <section aria-label="Sponsor dan mitra" data-fill="var(--color-surface-1)" className={styles.section}>
      <div aria-hidden="true" className={shared.hlineWrap}>
        <span data-hline="1" className={shared.hline} />
      </div>

      <div className={shared.container}>
        <p data-reveal="1" className={styles.label}>
          Didukung oleh
        </p>
      </div>

      {/*
        Rail berjalan terus dari kiri ke kanan. `data-reveal` dipasang di viewport
        rail, bukan di tiap kartu: useReveal menulis inline `transform`, yang akan
        menimpa animasi geser kalau kena elemen yang sama.

        Daftar sponsor dirender RAIL_SETS kali supaya rail tetap penuh di layar
        lebar; hanya set pertama yang dibacakan screen reader, sisanya
        `aria-hidden` agar nama sponsor tidak diulang.
      */}
      <div data-reveal="1" className={styles.rail}>
        <div className={styles.track}>
          {Array.from({ length: RAIL_SETS }, (_, i) => (
            <div key={i} aria-hidden={i > 0 || undefined} className={styles.set}>
              {SPONSORS.map((sp) => (
                <Kartu key={sp.nama} nama={sp.nama} level={sp.level} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
