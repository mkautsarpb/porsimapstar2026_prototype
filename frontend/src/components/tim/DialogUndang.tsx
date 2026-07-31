'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import { Ikon } from '@/components/app/Ikon';
import { cariCalonAnggota, type HasilCari } from '@/data/tim';
import type { Tim } from '@/types/tim';
import ui from '@/components/app/ui.module.css';
import styles from './DialogUndang.module.css';

/**
 * Dialog "Undang anggota" (desain B3).
 *
 * Kebukaan dialog ada di query URL (`?undang=1`) supaya tautan dari halaman
 * Review & submit bisa membukanya langsung dan tombol Kembali browser
 * menutupnya. Pencarian anggota BUKAN direktori publik: hanya kecocokan persis
 * participant code atau email terdaftar, dan hasilnya ditentukan server
 * (agents.md §9).
 *
 * Empat kegagalan punya satu pesan dan satu jalan keluar masing-masing —
 * tidak ada tombol mati yang dibiarkan menggantung.
 */
export function DialogUndang({ tim, terbuka }: { readonly tim: Tim; readonly terbuka: boolean }) {
  const router = useRouter();
  const dialogId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [kueri, setKueri] = useState('');
  const [hasil, setHasil] = useState<HasilCari | null>(null);
  const [kirim, setKirim] = useState(false);
  const [selesai, setSelesai] = useState<string | null>(null);

  const sisaSlot = Math.max(0, tim.maksimal - tim.bergabung - tim.menunggu);

  const tutup = () => {
    setKueri('');
    setHasil(null);
    setSelesai(null);
    router.push(`/tim/${tim.id}`, { scroll: false });
  };

  useEffect(() => {
    if (!terbuka) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') tutup();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `tutup` stabil untuk kebutuhan ini
  }, [terbuka]);

  if (!terbuka) return null;

  async function kirimUndangan() {
    if (kirim) return;
    setKirim(true);
    // TODO(api-contract): POST /api/v1/me/teams/{teamId}/invitations + idempotency key.
    await new Promise((r) => setTimeout(r, 400));
    setKirim(false);
    setSelesai(`UND-${tim.id.toUpperCase()}-0${tim.bergabung + tim.menunggu + 1}`);
  }

  return (
    <div className={styles.tirai}>
      <div
        id={dialogId}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${dialogId}-judul`}
        className={styles.dialog}
      >
        <div className={styles.kepala}>
          <div>
            <h2 id={`${dialogId}-judul`} className={styles.judul}>
              Undang anggota
            </h2>
            <p className={styles.meta}>
              {tim.nama} · {tim.lomba}
            </p>
          </div>
          <button type="button" aria-label="Tutup dialog" onClick={tutup} className={styles.tutup}>
            <Ikon nama="silang" ukuran={18} tebal={2} />
          </button>
        </div>

        {sisaSlot === 0 ? (
          <Gagal judul="Slot penuh">
            <p className={styles.gagalTeks}>
              Roster {tim.nama} sudah terisi {tim.maksimal} dari {tim.maksimal} slot, termasuk{' '}
              {tim.menunggu} undangan yang masih menunggu. Untuk mengundang orang baru, batalkan
              salah satu undangan yang menunggu atau keluarkan anggota lebih dulu.
            </p>
            <button type="button" onClick={tutup} className={ui.tombol}>
              Kelola roster
            </button>
          </Gagal>
        ) : selesai ? (
          <div className={styles.sukses} aria-live="polite">
            <span aria-hidden="true" className={styles.suksesIkon}>
              <Ikon nama="centang" ukuran={22} tebal={2.4} />
            </span>
            <h3 className={styles.suksesJudul}>Undangan terkirim</h3>
            <p className={styles.gagalTeks}>
              Undangan dikirim sebagai notifikasi dalam aplikasi dan email ke alamat terdaftar.
              Orang tersebut belum dihitung sebagai anggota sampai ia menerimanya dari akunnya
              sendiri. Nomor referensi <strong>{selesai}</strong>.
            </p>
            <div className={styles.aksi}>
              <button
                type="button"
                onClick={() => {
                  setKueri('');
                  setHasil(null);
                  setSelesai(null);
                }}
                className={ui.tombol}
              >
                Undang orang lain
              </button>
              <button type="button" onClick={tutup} className={`${ui.tombol} ${ui.tombolUtama}`}>
                Kembali ke roster
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className={styles.kuota}>
              <span>
                {sisaSlot} slot tersisa dari maksimal {tim.maksimal}
              </span>
              <span className={styles.kuotaMeta}>
                Undangan terakhir bisa dikirim {tim.kunciPada}
              </span>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setHasil(cariCalonAnggota(kueri));
              }}
              className={styles.form}
            >
              <label htmlFor={`${dialogId}-kueri`} className={styles.label}>
                Participant code atau email peserta
              </label>
              <input
                id={`${dialogId}-kueri`}
                ref={inputRef}
                type="text"
                value={kueri}
                onChange={(e) => {
                  setKueri(e.target.value);
                  setHasil(null);
                }}
                placeholder="PSM-2026-0000 atau nama@kampus.ac.id"
                aria-describedby={`${dialogId}-bantuan`}
                className={styles.input}
              />
              <p id={`${dialogId}-bantuan`} className={styles.bantuan}>
                Participant code ada di kartu peserta masing-masing orang. Kalau kamu memakai email,
                pastikan email yang dipakai saat mendaftar PORSIMAPTAR. Pencarian hanya menerima
                kecocokan persis — tidak ada daftar nama yang bisa ditelusuri.
              </p>

              <div className={styles.info}>
                <span aria-hidden="true" className={styles.infoIkon}>
                  <Ikon nama="bantuan" ukuran={16} tebal={2} />
                </span>
                <span>
                  Kamu mengirim undangan, bukan menambahkan anggota. Orang tersebut harus menerima
                  dari akunnya sendiri, dan undangan yang menunggu tidak dihitung sebagai anggota.
                </span>
              </div>

              <div className={styles.aksi}>
                <button type="button" onClick={tutup} className={ui.tombol}>
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={kueri.trim().length < 4}
                  className={`${ui.tombol} ${ui.tombolUtama}`}
                >
                  Cari peserta
                </button>
              </div>
            </form>

            {hasil ? (
              <div aria-live="polite" className={styles.hasil}>
                {hasil.jenis === 'ditemukan' ? (
                  <div className={styles.konfirmasi}>
                    <h3 className={styles.suksesJudul}>Kirim undangan ke orang ini?</h3>
                    <div className={styles.orang}>
                      <span aria-hidden="true" className={styles.avatar}>
                        {hasil.inisial}
                      </span>
                      <span className={styles.orangIsi}>
                        <span className={styles.orangNama}>{hasil.nama}</span>
                        <span className={styles.orangMeta}>
                          {hasil.identitas} · {hasil.institusi}
                        </span>
                        <span className={styles.orangMeta}>{hasil.catatan}</span>
                      </span>
                    </div>
                    <div className={styles.berlaku}>
                      <strong>Masa berlaku undangan: 3×24 jam</strong>
                      <span>
                        Setelah kedaluwarsa, slot otomatis kembali terbuka dan kamu bisa mengundang
                        orang lain. Selama masih menunggu jawaban, undangan bisa kamu batalkan.
                      </span>
                    </div>
                    <div className={styles.aksi}>
                      <button
                        type="button"
                        onClick={() => setHasil(null)}
                        className={ui.tombol}
                      >
                        Ganti peserta
                      </button>
                      <button
                        type="button"
                        disabled={kirim}
                        onClick={kirimUndangan}
                        className={`${ui.tombol} ${ui.tombolUtama}`}
                      >
                        {kirim ? 'Mengirim…' : 'Kirim undangan'}
                      </button>
                    </div>
                  </div>
                ) : null}

                {hasil.jenis === 'tidak-ditemukan' ? (
                  <Gagal judul="Tidak ditemukan">
                    <p className={styles.gagalTeks}>
                      Tidak ada peserta dengan kode atau email <strong>{hasil.kueri}</strong>.
                      Periksa kembali penulisannya, atau minta orang tersebut mendaftar akun
                      PORSIMAPTAR lebih dulu — undangan hanya bisa dikirim ke akun yang sudah ada.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setHasil(null);
                        inputRef.current?.focus();
                      }}
                      className={ui.tombol}
                    >
                      Perbaiki pencarian
                    </button>
                  </Gagal>
                ) : null}

                {hasil.jenis === 'sudah-diundang' ? (
                  <Gagal judul="Sudah diundang">
                    <p className={styles.gagalTeks}>
                      {hasil.nama} sudah kamu undang pada {hasil.dikirim} dan undangannya masih
                      menunggu jawaban sampai {hasil.berlaku}. Tidak perlu mengundang dua kali.
                    </p>
                    <div className={styles.aksi}>
                      <button
                        type="button"
                        disabled
                        aria-disabled="true"
                        title="Kirim ulang tersedia 1 jam setelah pengiriman terakhir"
                        className={`${ui.tombol} ${ui.tombolKecil}`}
                      >
                        Kirim ulang · {hasil.cooldown}
                      </button>
                      <button type="button" onClick={tutup} className={ui.tombol}>
                        Lihat di roster
                      </button>
                    </div>
                  </Gagal>
                ) : null}

                {hasil.jenis === 'anggota-tim-lain' ? (
                  <Gagal judul="Sudah menjadi anggota tim lain">
                    <p className={styles.gagalTeks}>
                      {hasil.nama} sudah bergabung di tim <strong>{hasil.tim}</strong> untuk{' '}
                      {hasil.lomba}. Satu peserta hanya boleh berada di satu tim pada lomba yang
                      sama, jadi undangan tidak bisa dikirim. Kalau ia ingin pindah, ia harus keluar
                      dari tim itu lebih dulu sebelum roster dikunci.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setKueri('');
                        setHasil(null);
                        inputRef.current?.focus();
                      }}
                      className={ui.tombol}
                    >
                      Undang orang lain
                    </button>
                  </Gagal>
                ) : null}
              </div>
            ) : null}
          </>
        )}

        <p className={styles.kaki}>
          Butuh menambah anggota setelah roster dikunci?{' '}
          <Link href="/bantuan">Ajukan lewat halaman Bantuan</Link>.
        </p>
      </div>
    </div>
  );
}

function Gagal({ judul, children }: { readonly judul: string; readonly children: React.ReactNode }) {
  return (
    <div className={styles.gagal}>
      <span className={styles.gagalJudul}>
        <Ikon nama="seru" ukuran={14} tebal={2.2} />
        {judul}
      </span>
      {children}
    </div>
  );
}
