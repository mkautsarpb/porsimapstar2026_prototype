import { Band } from '../Band';
import { TabelPeringatan } from '../TabelPeringatan';
import { Widget } from '../Widget';
import { cari, type PropsTab } from './props';
import styles from './TabOperasional.module.css';

/**
 * Tab Operasional — antrean yang menunggu tindakan orang.
 *
 * Urutan bandnya bukan selera: yang menunggu keputusan manusia lebih dulu, lalu
 * metrik hari pelaksanaan yang belum berjalan, baru daftar peringatan. Sebelas
 * angka tidak berbobot sama.
 */
export function TabOperasional({
  data,
  hanyutDetik,
  memuat,
  penyegaranGagal,
  onMuatUlang,
}: PropsTab) {
  const antrean = ['menunggu-verifikasi', 'perlu-perbaikan', 'peserta-terverifikasi']
    .map((id) => cari(data, id))
    .filter((w) => w !== undefined);

  const pelaksanaan = ['check-in', 'pertandingan']
    .map((id) => cari(data, id))
    .filter((w) => w !== undefined);

  const bersama = {
    waktuServerIso: data.waktuServerIso,
    hanyutDetik,
    memuat,
    penyegaranGagal,
    onMuatUlang,
  };

  return (
    <div className={styles.tab}>
      <Band
        id="band-antrean"
        ikon="jam"
        judul="Antrean yang menunggu orang"
        meta="Pendaftaran ditutup 5 Oktober 2026"
        cakupan={`${
          data.cakupan.penuh
            ? `Semua angka pada kelompok ini mencakup seluruh event — ${data.cakupan.jumlahLomba} lomba.`
            : `Semua angka pada kelompok ini mencakup ${data.cakupan.jumlahLomba} lomba yang kamu pegang, bukan seluruh event.`
        } Filter status pendaftaran tidak berlaku di sini — tiap metrik menentukan statusnya sendiri.`}
        kolom="tiga"
      >
        {antrean.map((w) => (
          <Widget key={w.id} w={w} {...bersama} sembunyikanCakupan />
        ))}
      </Band>

      {pelaksanaan.length > 0 ? (
        <Band
          id="band-pelaksanaan"
          ikon="kalender"
          judul="Hari pelaksanaan"
          meta="Perlombaan 26–29 Oktober 2026 di AKPOL"
          kolom="dua"
          rataAtas
        >
          {pelaksanaan.map((w) => (
            <Widget key={w.id} w={w} {...bersama} />
          ))}
        </Band>
      ) : null}

      <Band
        id="band-peringatan"
        ikon="seru"
        judul="Peringatan"
        meta="Diurutkan dari yang paling genting"
        kolom="penuh"
      >
        <TabelPeringatan baris={data.peringatan} waktuServerIso={data.waktuServerIso} />
      </Band>
    </div>
  );
}
