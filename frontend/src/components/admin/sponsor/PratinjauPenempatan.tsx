import { Ikon } from '@/components/app/Ikon';
import { LABEL_TINGKAT, TINGGI_LOGO } from '@/data/admin/sponsor';
import type { BarisSponsor, TingkatSponsor } from '@/types/admin';
import adm from '@/components/admin/adm.module.css';
import styles from './PratinjauPenempatan.module.css';

const URUTAN_TINGKAT: readonly TingkatSponsor[] = ['utama', 'pendukung', 'media'];

/**
 * Pratinjau penempatan sponsor di landing page (E4.1).
 *
 * Gunanya satu: menjawab "logo ini akan tampak seperti apa" SEBELUM diterbitkan.
 * Karena itu tinggi logo per tingkatan ditulis di label — 56 / 40 / 28 px — dan
 * logo yang tidak memenuhi panduan ditandai di tempat ia akan muncul, bukan
 * hanya di tabel. Sponsor yang logonya pecah baru ketahuan setelah tayang adalah
 * masalah hubungan, bukan masalah teknis.
 *
 * Pratinjau menampilkan susunan DRAF. Kalimat "pengunjung portal masih melihat
 * susunan lama" ikut dirender supaya tidak ada yang mengira perubahannya sudah
 * tayang.
 */
export function PratinjauPenempatan({
  sponsor,
  adaPerubahanBelumTerbit,
}: {
  readonly sponsor: readonly BarisSponsor[];
  readonly adaPerubahanBelumTerbit: boolean;
}) {
  const bermasalah = sponsor.filter((s) => !s.memenuhiPanduan);

  return (
    <section className={adm.kartu}>
      <div className={adm.kartuKepala}>
        <h2 className={adm.kartuJudul}>Pratinjau penempatan di landing page</h2>
        <span className={adm.eyebrow}>
          {adaPerubahanBelumTerbit ? 'Belum diterbitkan' : 'Sama dengan yang tayang'}
        </span>
      </div>

      <p className={adm.catatan}>
        Menampilkan susunan draf. Pengunjung portal masih melihat susunan yang terakhir diterbitkan.
      </p>

      <div className={styles.portal}>
        <div aria-hidden="true" className={styles.bilahPortal}>
          <span>PORSIMAPTAR XXVI</span>
          <span>Beranda · Lomba · Daftar</span>
        </div>

        {URUTAN_TINGKAT.map((tingkat) => {
          const daftar = sponsor.filter((s) => s.tingkat === tingkat);
          if (daftar.length === 0) return null;

          return (
            <div key={tingkat} className={styles.pita}>
              <p className={adm.eyebrow}>
                {LABEL_TINGKAT[tingkat]} · tinggi logo {TINGGI_LOGO[tingkat]}
              </p>

              <ul data-tingkat={tingkat} className={styles.logoDaftar}>
                {daftar.map((s) => (
                  <li
                    key={s.id}
                    data-bermasalah={!s.memenuhiPanduan}
                    title={s.memenuhiPanduan ? undefined : (s.catatan ?? undefined)}
                    className={styles.logo}
                  >
                    {s.nama}
                    {!s.memenuhiPanduan ? (
                      <span className="sr-only"> — logo belum memenuhi panduan ukuran</span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {bermasalah.length > 0 ? (
        <div className={`${adm.panel} ${adm.panelBahaya}`}>
          <span aria-hidden="true" className={adm.panelIkon}>
            <Ikon nama="seru" ukuran={16} tebal={2.2} />
          </span>
          <p className={adm.panelTeks}>
            {bermasalah.map((s) => `${s.nama} (${s.dimensiLogo})`).join(', ')} ditandai:{' '}
            {bermasalah[0]?.catatan} Ganti logo sebelum menerbitkan susunan.
          </p>
        </div>
      ) : null}
    </section>
  );
}
