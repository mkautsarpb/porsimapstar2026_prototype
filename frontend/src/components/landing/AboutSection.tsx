import shared from './shared.module.css';
import styles from './AboutSection.module.css';

const CHIPS = ['26–30 Okt 2026', 'Akpol Semarang', '17 cabang'] as const;

export function AboutSection() {
  return (
    <section id="tentang" data-fill="var(--color-surface-2)" className={shared.sectionLight}>
      <div aria-hidden="true" className={shared.hlineWrap}>
        <span data-hline="1" className={shared.hline} />
      </div>
      <div aria-hidden="true" className={`${shared.glow} ${styles.glow}`} />

      <div className={shared.container}>
        <div className={styles.grid}>
          <div data-reveal="1">
            <p className={shared.eyebrow}>Tentang event</p>
            <h2 className={shared.heading}>Lima hari, satu garis start yang sama.</h2>
          </div>

          <div data-reveal="1" className={styles.body}>
            <p className={styles.paragraphLead}>
              PORSIMAPTAR mempertemukan mahasiswa, pelajar SMA/sederajat, dan taruna Akpol dalam rangkaian olahraga dan
              seni 26–30 Oktober 2026. Tahun ini penyelenggaraan ke-26 mengangkat tema Cakrawala: kompetisi yang keras
              di lapangan, tapi selesai dengan tangan berjabat.
            </p>
            <p className={styles.paragraph}>
              Seluruh pendaftaran, verifikasi dokumen, dan pembagian bagan dilakukan lewat portal ini. Setelah
              terverifikasi, kamu menerima QR peserta yang dipakai untuk absensi di setiap venue.
            </p>
            <div className={styles.chips}>
              {CHIPS.map((c) => (
                <span key={c} className={styles.chip}>
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
