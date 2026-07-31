import type { Metadata } from 'next';
import { Ikon } from '@/components/app/Ikon';
import { KepalaHalaman } from '@/components/app/KepalaHalaman';
import { DaftarFaq } from '@/components/bantuan/DaftarFaq';
import { FormLaporan } from '@/components/bantuan/FormLaporan';
import { NomorReferensi } from '@/components/bantuan/NomorReferensi';
import { FAQ, JAM_LAYANAN, NOMOR_REFERENSI, PIC_CABANG } from '@/data/bantuan';
import ui from '@/components/app/ui.module.css';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Bantuan',
  robots: { index: false, follow: false },
};

type Query = Record<string, string | readonly string[] | undefined>;

function satu(nilai: string | readonly string[] | undefined): string | undefined {
  return Array.isArray(nilai) ? nilai[0] : (nilai as string | undefined);
}

/**
 * /bantuan — kontak PIC, FAQ, dan laporan masalah.
 *
 * Halaman lain menautkan ke sini dengan `?jenis=` supaya jenis masalah di
 * formulir sudah terisi: peserta yang datang dari konflik jadwal tidak perlu
 * menjelaskan ulang konteks yang sebenarnya sudah diketahui sistem.
 *
 * Hanya kanal resmi yang dipublikasikan di sini — nomor pribadi panitia tidak
 * pernah muncul, termasuk di data tiruan.
 */
export default async function BantuanPage({
  searchParams,
}: {
  readonly searchParams: Promise<Query>;
}) {
  const query = await searchParams;

  return (
    <div className={ui.halaman}>
      <KepalaHalaman
        judul="Bantuan"
        ringkasan={`Kontak PIC per cabang, pertanyaan yang sering muncul, dan jalur lapor masalah. ${JAM_LAYANAN}`}
      />

      <NomorReferensi nomor={NOMOR_REFERENSI} />

      <div className={ui.kisi}>
        <section className={`${ui.kartu} ${ui.span7}`} aria-labelledby="pic">
          <div className={ui.zonaKepala}>
            <h2 id="pic" className={ui.judulZona}>
              Kontak PIC per cabang
            </h2>
            <span className={ui.metaZona}>Hanya kanal resmi</span>
          </div>

          <ul className={styles.pic}>
            {PIC_CABANG.map((p) => (
              <li key={p.id} className={styles.picItem}>
                <span className={styles.picIsi}>
                  <span className={styles.picCabang}>{p.cabang}</span>
                  <span className={styles.picNama}>
                    PIC: {p.nama} · {p.email}
                  </span>
                  {p.catatan ? <span className={styles.picCatatan}>{p.catatan}</span> : null}
                </span>
                <a href={`mailto:${p.email}`} className={`${ui.tombol} ${ui.tombolKecil}`}>
                  Kirim email
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className={`${ui.kartu} ${ui.span5}`} aria-labelledby="lapor">
          <div className={ui.zonaKepala}>
            <h2 id="lapor" className={ui.judulZona}>
              Laporkan masalah
            </h2>
          </div>
          <p className={`${ui.teks} ${styles.jarak}`}>
            Untuk hal yang tidak terjawab FAQ. Panitia melihat nomor referensi dan pendaftaran
            terkait secara otomatis, jadi kamu tidak perlu menyalin data pribadi ke laporan.
          </p>

          <FormLaporan jenisAwal={satu(query.jenis)} />
        </section>
      </div>

      <section className={ui.kartu} aria-labelledby="faq">
        <div className={ui.zonaKepala}>
          <h2 id="faq" className={ui.judulZona}>
            Pertanyaan yang sering diajukan
          </h2>
          <span className={ui.metaZona}>{FAQ.length} pertanyaan</span>
        </div>

        <DaftarFaq faq={FAQ} />
      </section>

      <div className={ui.panel}>
        <span aria-hidden="true" className={ui.panelIkon}>
          <Ikon nama="telepon" ukuran={18} />
        </span>
        <span>
          Panitia tidak pernah meminta kata sandi, kode OTP, atau foto KTP lewat chat atau telepon.
          Kalau ada yang meminta hal itu mengatasnamakan PORSIMAPTAR, laporkan lewat formulir di
          halaman ini dan jangan berikan datanya.
        </span>
      </div>
    </div>
  );
}
