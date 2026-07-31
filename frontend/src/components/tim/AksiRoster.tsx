'use client';

import { useId, useState } from 'react';
import { Ikon } from '@/components/app/Ikon';
import type { AnggotaTim } from '@/types/tim';
import ui from '@/components/app/ui.module.css';
import styles from './AksiRoster.module.css';

type Aksi = 'keluarkan' | 'batalkan';

/**
 * Aksi ketua pada satu baris roster.
 *
 * Dua aturan yang dijaga di sini:
 *  - Aksi destruktif (keluarkan anggota, batalkan undangan) selalu lewat dialog
 *    konfirmasi berisi ringkasan dampak + alasan, dan menghasilkan nomor
 *    referensi (agents.md §11 Definition of Done, FE-ADMIN-003).
 *  - Tombol dikunci selama pengiriman supaya klik ganda hanya menghasilkan satu
 *    efek (AC-TEAM-04). Sukses tidak pernah diklaim sebelum respons server —
 *    di prototipe ini responsnya masih ditiru.
 *
 * TODO(api-contract): `POST /api/v1/me/teams/{teamId}/members/{id}/remind`,
 * `DELETE .../invitations/{id}`, `DELETE .../members/{id}` — semuanya butuh
 * idempotency key dan mengembalikan nomor referensi.
 */
export function AksiRoster({
  anggota,
  timNama,
  terkunci,
}: {
  readonly anggota: AnggotaTim;
  readonly timNama: string;
  readonly terkunci: boolean;
}) {
  const dialogId = useId();
  const [aksi, setAksi] = useState<Aksi | null>(null);
  const [alasan, setAlasan] = useState('');
  const [kirim, setKirim] = useState(false);
  const [hasil, setHasil] = useState<string | null>(null);
  const [diingatkan, setDiingatkan] = useState(false);

  const menunggu = anggota.keanggotaan === 'menunggu';
  const cooldown = Boolean(anggota.cooldown);

  if (terkunci) {
    return (
      <div className={styles.terkunci}>
        <span aria-hidden="true">
          <Ikon nama="jam" ukuran={14} tebal={2} />
        </span>
        Nonaktif karena roster terkunci
      </div>
    );
  }

  if (anggota.ketua) {
    return <p className={styles.catatan}>Ketua tidak bisa dikeluarkan</p>;
  }

  if (hasil) {
    return (
      <p className={styles.hasil}>
        <Ikon nama="centang" ukuran={14} tebal={2.2} />
        Tersimpan · ref {hasil}
      </p>
    );
  }

  async function jalankan() {
    if (kirim) return;
    setKirim(true);
    // TODO(api-contract): ganti dengan mutasi sebenarnya + idempotency key.
    await new Promise((r) => setTimeout(r, 400));
    setHasil(`TIM-${anggota.id.toUpperCase()}-0${alasan.length % 9}`);
    setKirim(false);
    setAksi(null);
  }

  return (
    <div className={styles.aksi}>
      {menunggu ? (
        <>
          <button
            type="button"
            disabled={cooldown}
            aria-disabled={cooldown}
            title={
              cooldown ? 'Kirim ulang tersedia 1 jam setelah pengiriman terakhir' : undefined
            }
            className={`${ui.tombol} ${ui.tombolKecil}`}
          >
            {cooldown ? `Kirim ulang · ${anggota.cooldown}` : 'Kirim ulang'}
          </button>
          <button
            type="button"
            onClick={() => setAksi('batalkan')}
            className={`${ui.tombol} ${ui.tombolKecil} ${styles.bahaya}`}
          >
            Batalkan
          </button>
        </>
      ) : (
        <>
          {anggota.syarat?.nada !== 'ok' ? (
            <button
              type="button"
              disabled={diingatkan}
              onClick={() => setDiingatkan(true)}
              className={`${ui.tombol} ${ui.tombolKecil}`}
            >
              {diingatkan ? 'Pengingat terkirim' : 'Ingatkan anggota'}
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => setAksi('keluarkan')}
            className={`${ui.tombol} ${ui.tombolKecil} ${styles.bahaya}`}
          >
            Keluarkan
          </button>
        </>
      )}

      {aksi ? (
        <div className={styles.tirai}>
          <div
            id={dialogId}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${dialogId}-judul`}
            className={styles.dialog}
          >
            <h2 id={`${dialogId}-judul`} className={styles.dialogJudul}>
              {aksi === 'keluarkan'
                ? `Keluarkan ${anggota.nama} dari ${timNama}?`
                : `Batalkan undangan untuk ${anggota.nama}?`}
            </h2>

            <p className={styles.dampak}>
              {aksi === 'keluarkan'
                ? 'Jumlah anggota bergabung berkurang satu dan slotnya kembali terbuka. Yang bersangkutan menerima notifikasi, dan tindakan ini tercatat permanen di riwayat tim yang juga dilihat panitia.'
                : 'Undangan langsung hilang dari kotak undangan penerima dan slotnya kembali terbuka. Kamu tetap bisa mengundang orang yang sama lagi selama roster belum dikunci.'}
            </p>

            <label className={styles.label}>
              Alasan (tercatat di riwayat tim)
              <textarea
                rows={3}
                value={alasan}
                onChange={(e) => setAlasan(e.target.value)}
                placeholder="Contoh: salah kirim, yang bersangkutan mundur karena cedera"
                className={styles.textarea}
              />
            </label>

            <div className={styles.dialogAksi}>
              <button
                type="button"
                onClick={() => setAksi(null)}
                className={ui.tombol}
              >
                Batal
              </button>
              <button
                type="button"
                disabled={kirim || alasan.trim().length < 3}
                onClick={jalankan}
                className={`${ui.tombol} ${styles.bahayaUtama}`}
              >
                {kirim ? 'Memproses…' : aksi === 'keluarkan' ? 'Keluarkan anggota' : 'Batalkan undangan'}
              </button>
            </div>

            <p className={styles.bantuan} aria-live="polite">
              {alasan.trim().length < 3
                ? 'Tulis alasan singkat dulu — minimal tiga karakter.'
                : 'Nomor referensi muncul setelah panitia mencatat perubahan ini.'}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
