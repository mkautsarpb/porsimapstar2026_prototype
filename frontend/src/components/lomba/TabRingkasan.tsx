import Link from 'next/link';
import { Ikon } from '@/components/app/Ikon';
import type { DetailLomba } from '@/data/lomba-detail';
import type { LombaSaya } from '@/types/peserta';
import ui from '@/components/app/ui.module.css';
import tab from './tab.module.css';

/**
 * Tab Ringkasan: apa status pendaftaran ini, apa yang harus dilakukan, dan
 * rincian pokoknya. Urutannya sengaja "yang perlu tindakan dulu".
 */
export function TabRingkasan({
  lomba,
  detail,
}: {
  readonly lomba: LombaSaya;
  readonly detail: DetailLomba;
}) {
  const persen = Math.min(100, Math.round((lomba.kuotaTerpakai / lomba.kuotaTotal) * 100));
  const berikutnya = detail.jadwal.find((j) => j.status !== 'selesai');

  return (
    <div className={`${tab.grid} ${tab.gridDua}`}>
      <div className={ui.kartu}>
        <h2 className={tab.judul}>Status pendaftaran</h2>
        <p className={tab.teks}>{lomba.artiStatus}</p>

        {lomba.catatanPanitia ? (
          <div className={`${tab.info} ${tab.peringatan} ${tab.jarakAtas}`}>
            <span aria-hidden="true" className={tab.infoIkon}>
              <Ikon nama="seru" ukuran={16} />
            </span>
            <span>
              <strong>Catatan panitia.</strong> {lomba.catatanPanitia}
            </span>
          </div>
        ) : null}

        <div className={`${tab.rincian} ${tab.jarakAtasBesar}`}>
          <div className={tab.rincianItem}>
            <span className={tab.label}>Nomor referensi</span>
            <p className={tab.rincianNilai}>{lomba.nomorReferensi}</p>
          </div>
          <div className={tab.rincianItem}>
            <span className={tab.label}>Didaftarkan</span>
            <p className={tab.rincianNilai}>{lomba.didaftarkan}</p>
          </div>
          <div className={tab.rincianItem}>
            <span className={tab.label}>Kuota cabang</span>
            <p className={tab.rincianNilai}>
              {lomba.kuotaTerpakai} / {lomba.kuotaTotal} {lomba.kuotaSatuan} ({persen}%)
            </p>
          </div>
          <div className={tab.rincianItem}>
            <span className={tab.label}>Peranmu</span>
            <p className={tab.rincianNilai}>{lomba.peran ?? 'Peserta perorangan'}</p>
          </div>
        </div>

        <div className={tab.jarakAtasBesar}>
          <span className={tab.label}>Yang bisa kamu lakukan</span>
          <div className={tab.aksiBaris}>
            {lomba.status === 'perlu-perbaikan' ? (
              <Link
                href={`/lomba-saya/${lomba.id}?tab=dokumen`}
                className={`${ui.tombol} ${ui.tombolUtama}`}
              >
                Perbaiki dokumen
              </Link>
            ) : null}
            {lomba.status === 'terverifikasi' ? (
              <Link href={`/lomba-saya/${lomba.id}?tab=qr`} className={`${ui.tombol} ${ui.tombolUtama}`}>
                Buka QR check-in
              </Link>
            ) : null}
            <Link href={`/lomba-saya/${lomba.id}?tab=jadwal`} className={ui.tombol}>
              Lihat jadwal
            </Link>
            {lomba.tipe === 'Tim' ? (
              <Link href={`/lomba-saya/${lomba.id}?tab=tim`} className={ui.tombol}>
                Lihat tim
              </Link>
            ) : null}
          </div>
        </div>
      </div>

      <div className={tab.kolom}>
        <div className={ui.kartu}>
          <h2 className={tab.judul}>Agenda berikutnya</h2>
          {berikutnya ? (
            <div className={`${tab.baris} ${tab.barisPertama}`}>
              <span aria-hidden="true" className={tab.tanggal}>
                <span className={tab.tanggalAngka}>{berikutnya.tanggal}</span>
                <span className={tab.tanggalBulan}>{berikutnya.bulan}</span>
              </span>
              <span className={tab.barisIsi}>
                <span className={tab.barisJudul}>{berikutnya.judul}</span>
                <span className={tab.barisKet}>{berikutnya.keterangan}</span>
                <span className={tab.waktu}>
                  <span className={tab.jam}>{berikutnya.jam}</span>
                  <span className={tab.venue}>· {berikutnya.venue}</span>
                </span>
              </span>
            </div>
          ) : (
            <p className={tab.teks}>Belum ada agenda terjadwal untuk pendaftaran ini.</p>
          )}
        </div>

        <div className={ui.kartu}>
          <h2 className={tab.judul}>Butuh bantuan?</h2>
          <p className={tab.teks}>
            Hubungi PIC cabang lewat menu Bantuan bila ada kendala dokumen, tim, atau jadwal. Sertakan
            nomor referensi <strong>{lomba.nomorReferensi}</strong> agar panitia bisa menelusuri
            pendaftaranmu.
          </p>
          <Link href="/bantuan" className={`${ui.tombol} ${tab.tombolBlok}`}>
            Buka halaman bantuan
          </Link>
        </div>
      </div>
    </div>
  );
}
