import { Ikon } from '@/components/app/Ikon';
import { Lencana } from '@/components/app/Lencana';
import { BATAS_PERBAIKAN, LABEL_DOKUMEN } from '@/data/dokumen';
import type { DokumenPeserta } from '@/types/peserta';
import ui from '@/components/app/ui.module.css';
import { AreaUnggah } from './AreaUnggah';
import styles from './KartuDokumen.module.css';

/** Ekstensi yang diterima, diturunkan dari kalimat ketentuan tiap dokumen. */
function ekstensi(ketentuan: string): readonly string[] {
  const daftar = ['pdf', 'jpg', 'png'].filter((e) => ketentuan.toLowerCase().includes(e));
  return daftar.length > 0 ? daftar : ['pdf', 'jpg', 'png'];
}

/**
 * Kartu satu dokumen persyaratan.
 *
 * Area unggah hanya muncul untuk dokumen yang memang menunggu berkas — dokumen
 * yang sedang diperiksa sengaja TIDAK punya tombol unggah, karena unggahan baru
 * menggeser posisinya ke belakang antrean dan itu merugikan peserta.
 */
export function KartuDokumen({ dokumen }: { readonly dokumen: DokumenPeserta }) {
  const label = LABEL_DOKUMEN[dokumen.status];
  const butuhBerkas =
    dokumen.status === 'belum-diunggah' || dokumen.status === 'perlu-diperbaiki';

  return (
    <article className={`${ui.kartu} ${styles.kartu}`}>
      <div className={styles.kepala}>
        <span aria-hidden="true" data-nada={label.nada} className={styles.ikon}>
          <Ikon nama={label.ikon} ukuran={20} />
        </span>

        <div className={styles.identitas}>
          <h3 className={styles.nama}>{dokumen.nama}</h3>
          <p className={styles.keterangan}>{dokumen.keterangan}</p>
          {dokumen.berkas ? <p className={styles.berkas}>{dokumen.berkas}</p> : null}
        </div>

        <div className={styles.status}>
          <Lencana label={label.label} nada={label.nada} ikon={label.ikon} />
          {dokumen.status === 'perlu-diperbaiki' ? (
            <span className={styles.batas}>Batas perbaikan {BATAS_PERBAIKAN}</span>
          ) : null}
        </div>
      </div>

      <p className={styles.arti}>{dokumen.arti}</p>

      {dokumen.catatanPanitia ? (
        <div className={`${ui.panel} ${ui.panelBahaya} ${styles.catatan}`}>
          <span aria-hidden="true" className={ui.panelIkon}>
            <Ikon nama="seru" ukuran={16} />
          </span>
          <div className={styles.catatanIsi}>
            <span className={ui.eyebrow}>{dokumen.catatanWaktu}</span>
            <p className={styles.catatanTeks}>{dokumen.catatanPanitia}</p>
            {dokumen.contoh ? <p className={styles.catatanTeks}>{dokumen.contoh}</p> : null}
          </div>
        </div>
      ) : null}

      {butuhBerkas ? (
        <AreaUnggah
          dokumenId={dokumen.id}
          label={
            dokumen.status === 'perlu-diperbaiki'
              ? 'Unggah ulang berkas yang sudah diperbaiki'
              : 'Pilih berkas dari perangkatmu'
          }
          ketentuan={dokumen.ketentuan}
          ekstensi={ekstensi(dokumen.ketentuan)}
        />
      ) : null}

      {dokumen.riwayat.length > 0 ? (
        <details className={styles.riwayat}>
          <summary className={styles.riwayatRingkas}>
            Riwayat versi ({dokumen.riwayat.length})
          </summary>
          <table className={styles.tabel}>
            <thead>
              <tr>
                <th scope="col">Versi</th>
                <th scope="col">Nama berkas</th>
                <th scope="col">Diunggah</th>
                <th scope="col">Hasil pemeriksaan</th>
              </tr>
            </thead>
            <tbody>
              {dokumen.riwayat.map((v) => (
                <tr key={v.versi}>
                  <td data-label="Versi">{v.versi}</td>
                  <td data-label="Nama berkas">{v.berkas}</td>
                  <td data-label="Diunggah">{v.diunggah}</td>
                  <td data-label="Hasil">
                    <Lencana label={v.hasil} nada={v.nada} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      ) : null}
    </article>
  );
}
