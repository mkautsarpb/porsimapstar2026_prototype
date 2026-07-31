'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Ikon } from '@/components/app/Ikon';
import type { Undangan } from '@/types/tim';
import ui from '@/components/app/ui.module.css';
import styles from './KeputusanUndangan.module.css';

type Keputusan = 'terima' | 'tolak';

/**
 * Tombol keputusan undangan: terima atau tolak.
 *
 * Status yang mengunci keputusan (kedaluwarsa, dibatalkan, dicabut) tidak
 * mendapat tombol mati — komponen ini memang tidak merender apa pun untuk
 * status itu, dan halamanlah yang menjelaskan apa yang terjadi. Konflik hanya
 * boleh ditolak.
 *
 * Sukses tidak diklaim sebelum respons server, dan tombol terkunci selama
 * pengiriman supaya klik ganda hanya menghasilkan satu efek (AC-TEAM-04).
 *
 * TODO(api-contract): `POST /api/v1/me/invitations/{token}/accept` dan
 * `/decline`, keduanya dengan idempotency key. Error yang wajib punya penanganan
 * sendiri: INVITATION_NOT_FOUND, INVITATION_EXPIRED/CANCELLED,
 * ALREADY_TEAM_MEMBER, TEAM_ROSTER_FULL, TEAM_ROSTER_LOCKED, VERSION_CONFLICT.
 */
export function KeputusanUndangan({
  undangan,
  ringkas = false,
}: {
  readonly undangan: Undangan;
  readonly ringkas?: boolean;
}) {
  const [konfirmasi, setKonfirmasi] = useState<Keputusan | null>(null);
  const [kirim, setKirim] = useState(false);
  const [hasil, setHasil] = useState<{ keputusan: Keputusan; referensi: string } | null>(null);

  const bisaTerima = undangan.status === 'menunggu';
  const bisaTolak = undangan.status === 'menunggu' || undangan.status === 'konflik';

  if (!bisaTolak && !bisaTerima) return null;

  if (hasil) {
    return (
      <div aria-live="polite" data-keputusan={hasil.keputusan} className={styles.hasil}>
        <Ikon nama={hasil.keputusan === 'terima' ? 'centang' : 'silang'} ukuran={16} tebal={2.2} />
        <span>
          {hasil.keputusan === 'terima'
            ? `Kamu bergabung di ${undangan.tim}. Ketua tetap harus mensubmit tim sebelum roster dikunci.`
            : `Undangan ${undangan.tim} ditolak dan slotnya kembali terbuka.`}{' '}
          Nomor referensi <strong>{hasil.referensi}</strong>.
        </span>
      </div>
    );
  }

  async function putuskan(keputusan: Keputusan) {
    if (kirim) return;
    setKirim(true);
    // TODO(api-contract): mutasi sebenarnya + idempotency key + cek status terbaru
    // sebelum menyimpulkan gagal saat timeout jaringan.
    await new Promise((r) => setTimeout(r, 400));
    setKirim(false);
    setKonfirmasi(null);
    setHasil({ keputusan, referensi: `UND-${undangan.token.toUpperCase()}-01` });
  }

  return (
    <div className={styles.blok}>
      <div className={styles.tombol}>
        {bisaTerima ? (
          ringkas ? (
            <Link
              href={`/undangan-tim/${undangan.token}`}
              className={`${ui.tombol} ${ui.tombolUtama}`}
            >
              Lihat &amp; jawab
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setKonfirmasi('terima')}
              className={`${ui.tombol} ${ui.tombolUtama}`}
            >
              Terima &amp; gabung tim
            </button>
          )
        ) : null}

        <button
          type="button"
          onClick={() => setKonfirmasi('tolak')}
          className={`${ui.tombol} ${styles.tolak}`}
        >
          Tolak undangan
        </button>
      </div>

      {konfirmasi ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={
            konfirmasi === 'terima' ? 'Konfirmasi bergabung' : 'Konfirmasi menolak undangan'
          }
          className={styles.tirai}
        >
          <div className={styles.dialog}>
            <h2 className={styles.judul}>
              {konfirmasi === 'terima'
                ? `Gabung ke ${undangan.tim}?`
                : `Tolak undangan ${undangan.tim}?`}
            </h2>

            <p className={styles.dampak}>
              {konfirmasi === 'terima' ? (
                <>
                  Kamu langsung terhitung sebagai anggota {undangan.tim} untuk {undangan.lomba}.
                  Satu peserta hanya boleh bergabung di satu tim pada lomba yang sama, jadi undangan{' '}
                  {undangan.lomba} dari tim lain akan ditandai konflik.
                </>
              ) : (
                <>
                  Slot kamu di {undangan.tim} kembali terbuka untuk orang lain. Menolak tidak
                  menutup kemungkinan diundang lagi oleh tim yang sama selama slot masih ada.
                </>
              )}
            </p>

            <div className={styles.aksiDialog}>
              <button type="button" onClick={() => setKonfirmasi(null)} className={ui.tombol}>
                Kembali
              </button>
              <button
                type="button"
                disabled={kirim}
                onClick={() => putuskan(konfirmasi)}
                className={`${ui.tombol} ${konfirmasi === 'terima' ? ui.tombolUtama : styles.tolakUtama}`}
              >
                {kirim
                  ? 'Memproses…'
                  : konfirmasi === 'terima'
                    ? 'Ya, gabung tim'
                    : 'Ya, tolak undangan'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
