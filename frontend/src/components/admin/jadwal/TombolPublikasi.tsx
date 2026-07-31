'use client';

import { useState } from 'react';
import { DialogAksiKritis, type BarisDampak } from '@/components/admin/DialogAksiKritis';
import adm from '@/components/admin/adm.module.css';

/**
 * Tombol publikasi jadwal (E2.2c).
 *
 * Terkunci selama masih ada bentrok, dan alasannya ditulis di `title` DAN
 * sebagai kalimat di sebelahnya — tombol abu-abu tanpa keterangan membuat orang
 * mengklik berkali-kali lalu melapor "tombolnya rusak".
 *
 * Publikasi mengirim notifikasi yang tidak bisa ditarik, jadi anatominya sama
 * dengan aksi kritis lain: jumlah penerima disebut sebelum tombol, catatan versi
 * wajib karena ikut terbaca penerima, dan pernyataan harus dicentang.
 */
export function TombolPublikasi({
  jumlahBentrok,
  versiBaru,
  rentangTanggal,
  dariVersi,
  dampak,
  totalPenerima,
  waktuServerIso,
}: {
  readonly jumlahBentrok: number;
  readonly versiBaru: number;
  readonly rentangTanggal: string;
  readonly dariVersi: string;
  readonly dampak: readonly BarisDampak[];
  readonly totalPenerima: number;
  readonly waktuServerIso: string;
}) {
  const [terbuka, setTerbuka] = useState(false);
  const terkunci = jumlahBentrok > 0;

  return (
    <>
      <div className={adm.barisAksi}>
        <button
          type="button"
          disabled={terkunci}
          title={
            terkunci
              ? `Selesaikan ${jumlahBentrok} bentrok sebelum publikasi`
              : undefined
          }
          onClick={() => setTerbuka(true)}
          className={`${adm.tombol} ${adm.tombolUtama}`}
        >
          Publikasikan versi {versiBaru}
        </button>

        {terkunci ? (
          <span className={adm.catatan}>
            Terkunci sampai {jumlahBentrok} bentrok selesai — panel bentrok di bawah menyebut siapa
            dan kapan.
          </span>
        ) : null}
      </div>

      <DialogAksiKritis
        terbuka={terbuka}
        onTutup={() => setTerbuka(false)}
        judul={`Publikasikan jadwal versi ${versiBaru}`}
        sub={`${rentangTanggal} · dari versi ${dariVersi}`}
        awalanRef="JDW"
        waktuServerIso={waktuServerIso}
        ringkasanDampak="Ringkasan sebelum dan sesudah"
        dampak={dampak}
        catatanDampak={
          <>
            <p>
              Dikirim sebagai notifikasi dalam aplikasi dan email ke {totalPenerima} penerima.{' '}
              <strong>Sekali terkirim tidak bisa ditarik</strong> — pembatalan hanya bisa dilakukan
              dengan menerbitkan versi berikutnya yang berisi koreksi, dan itu memicu gelombang
              notifikasi baru.
            </p>
            <p>Hanya dua kanal yang dipakai proyek ini: email dan dalam aplikasi.</p>
          </>
        }
        alasan={{
          label: 'Catatan versi',
          bantuan:
            'Dibaca penerima notifikasi apa adanya. Sebut sesi mana yang berubah dan kenapa, bukan “perbaikan jadwal”.',
          minimal: 30,
          maksimal: 500,
          baku: [],
        }}
        pernyataan={[
          `Saya paham ${totalPenerima} notifikasi akan terkirim sekarang dan tidak bisa ditarik kembali.`,
        ]}
        labelKirim={`Publikasikan & kirim ${totalPenerima} notifikasi`}
        pesanBerhasil={`Jadwal versi ${versiBaru} diterbitkan`}
      />
    </>
  );
}
