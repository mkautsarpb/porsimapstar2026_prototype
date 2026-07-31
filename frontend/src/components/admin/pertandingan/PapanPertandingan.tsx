'use client';

import { useState } from 'react';
import { Lencana } from '@/components/app/Lencana';
import { DialogAksiKritis } from '@/components/admin/DialogAksiKritis';
import { KakiTabel } from '@/components/admin/KakiTabel';
import { SelBertingkat, TabelAdmin } from '@/components/admin/TabelAdmin';
import { DialogCatatHasil } from './DialogCatatHasil';
import type { BarisPertandingan, StatusPertandingan } from '@/types/admin';
import type { Nada, NamaIkon } from '@/types/peserta';
import adm from '@/components/admin/adm.module.css';
import styles from './PapanPertandingan.module.css';

const STATUS: Readonly<
  Record<StatusPertandingan, { readonly label: string; readonly nada: Nada; readonly ikon: NamaIkon }>
> = {
  berlangsung: { label: 'Berlangsung', nada: 'info', ikon: 'jam' },
  terjadwal: { label: 'Terjadwal', nada: 'netral', ikon: 'kalender' },
  selesai: { label: 'Selesai', nada: 'ok', ikon: 'centang' },
  ditunda: { label: 'Ditunda', nada: 'warn', ikon: 'seru' },
  dibatalkan: { label: 'Dibatalkan', nada: 'danger', ikon: 'silang' },
};

/**
 * Papan pertandingan hari berjalan (E3.1a).
 *
 * Dua aksi baris yang berbeda kewenangan:
 * - **Catat hasil** untuk laga yang berjalan atau selesai tanpa hasil — milik
 *   operator pertandingan.
 * - **Koreksi hasil** untuk laga yang hasilnya sudah tercatat — hanya dirender
 *   bila `bolehKoreksi`, karena koreksi menghitung ulang babak lanjutan dan
 *   memberi tahu tim yang kemenangannya dicabut (FE-ADMIN-002).
 *
 * Keterlambatan ditandai latar baris DAN selisih menit yang tertulis di kolom
 * jadwal — "+35 menit" adalah angka yang dipakai mengambil keputusan, sedangkan
 * warna baris hanya membantu menemukannya.
 */
export function PapanPertandingan({
  baris,
  bolehKoreksi,
  waktuServerIso,
}: {
  readonly baris: readonly BarisPertandingan[];
  readonly bolehKoreksi: boolean;
  readonly waktuServerIso: string;
}) {
  const [catat, setCatat] = useState<BarisPertandingan | null>(null);
  const [koreksi, setKoreksi] = useState<BarisPertandingan | null>(null);

  return (
    <>
      <TabelAdmin
        caption="Pertandingan hari berjalan, dengan status dan selisih keterlambatan"
        minLebar={1080}
        kolom={[
          { label: 'Jadwal', urut: 'turun' },
          { label: 'Cabang & babak' },
          { label: 'Peserta' },
          { label: 'Venue' },
          { label: 'Status' },
          { label: 'Skor' },
          { label: 'Aksi' },
        ]}
      >
        {baris.map((m) => {
          const s = STATUS[m.status];
          const terlambat = m.terlambatMenit !== null && m.terlambatMenit > 0;
          const sudahAdaHasil = m.status === 'selesai' || m.status === 'dibatalkan';

          return (
            <tr key={m.id} data-tanda={terlambat ? 'terlambat' : undefined}>
              <td>
                <SelBertingkat
                  utama={m.jamJadwal}
                  meta={
                    terlambat
                      ? `mulai ${m.jamMulaiAktual} · +${m.terlambatMenit} menit`
                      : (m.catatanStatus ?? undefined)
                  }
                />
              </td>
              <td>
                {m.cabang} · {m.babak}
              </td>
              <td>
                <span className={styles.peserta}>
                  {m.pesertaA} <span className={adm.catatan}>vs</span> {m.pesertaB}
                </span>
              </td>
              <td>{m.venue}</td>
              <td>
                <Lencana label={s.label} nada={s.nada} ikon={s.ikon} />
              </td>
              <td>
                {m.skor ? (
                  <SelBertingkat utama={m.skor} meta={m.skorMeta ?? undefined} />
                ) : (
                  <span className={adm.catatan}>{m.skorMeta ?? '—'}</span>
                )}
              </td>
              <td>
                {!m.bolehCatat ? (
                  <span className={adm.catatan}>
                    {m.status === 'terjadwal' ? 'Belum bisa dicatat' : 'Jadwal baru terbit'}
                  </span>
                ) : sudahAdaHasil ? (
                  bolehKoreksi ? (
                    <button
                      type="button"
                      onClick={() => setKoreksi(m)}
                      className={`${adm.tombol} ${adm.tombolKecil}`}
                    >
                      Koreksi hasil
                    </button>
                  ) : (
                    <span className={adm.catatan}>Hasil tercatat</span>
                  )
                ) : (
                  <button
                    type="button"
                    onClick={() => setCatat(m)}
                    className={`${adm.tombol} ${adm.tombolKecil} ${adm.tombolUtama}`}
                  >
                    Catat hasil
                  </button>
                )}
              </td>
            </tr>
          );
        })}
      </TabelAdmin>

      <KakiTabel
        ringkasan={`${baris.length} pertandingan pada hari berjalan · satu halaman`}
        catatan="Diperbarui otomatis setiap 30 detik. Baris berlatar merah muda dan bergaris kiri merah = terlambat dari jadwal, dengan selisih menit tertulis di kolom jadwal."
      />

      {catat ? (
        <DialogCatatHasil
          terbuka
          onTutup={() => setCatat(null)}
          laga={catat}
          waktuServerIso={waktuServerIso}
          lanjutKe={[
            { label: 'Babak berikutnya', nilai: 'Semifinal 1 · slot A' },
            { label: 'Jadwal slot itu', nilai: '28 Okt 2026, 09.00 · Lap 1' },
            { label: 'Lawan di slot B', nilai: 'Bahari Muda' },
          ]}
        />
      ) : null}

      {koreksi ? (
        <DialogAksiKritis
          terbuka
          onTutup={() => setKoreksi(null)}
          judul={`Koreksi hasil · ${koreksi.cabang} ${koreksi.babak}`}
          sub={`${koreksi.pesertaA} vs ${koreksi.pesertaB} · hasil tercatat ${koreksi.skor}`}
          awalanRef="KOR"
          waktuServerIso={waktuServerIso}
          nadaKirim="bahaya"
          ringkasanDampak="Dampak koreksi ini"
          dampak={[
            { label: 'Hasil tercatat sekarang', nilai: `${koreksi.skor} · ${koreksi.skorMeta ?? '—'}` },
            { label: 'Pertandingan lanjutan dihitung ulang', nilai: '3 laga' },
            { label: 'Peserta slot A perempat final', nilai: 'Diganti' },
            { label: 'Notifikasi terkirim', nilai: '36 peserta · 2 PIC · 1 wasit' },
          ]}
          catatanDampak={
            <p>
              Tim yang kemenangannya dicabut akan menerima pemberitahuan bahwa hasilnya dikoreksi.
              Notifikasi tidak bisa ditarik, dan riwayat koreksi terlihat oleh kedua tim beserta
              alasannya.
            </p>
          }
          alasan={{
            label: 'Alasan koreksi',
            bantuan:
              'Masuk audit log dan terlihat oleh kedua tim. Sebut dasar tertulisnya, bukan kesimpulan.',
            minimal: 30,
            maksimal: 500,
            baku: [],
          }}
          pernyataan={[
            'Saya memegang berita acara tertulis yang mendasari koreksi ini.',
            'Saya paham pertandingan lanjutan akan dihitung ulang dan seluruh penerima akan diberi tahu.',
          ]}
          kataKunci="KOREKSI"
          labelKirim="Koreksi hasil & hitung ulang"
          pesanBerhasil="Hasil dikoreksi dan babak lanjutan dihitung ulang"
        />
      ) : null}
    </>
  );
}
