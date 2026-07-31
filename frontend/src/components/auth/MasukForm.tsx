'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AUTH_MOCK, kirimMasuk, type SimulasiRespons } from '@/lib/api/auth';
import { pesanError } from '@/lib/auth-errors';
import { errorEmail, errorPasswordMasuk } from '@/lib/validasi-auth';
import { useHitungMundur } from '@/hooks/useHitungMundur';
import { useOnline } from '@/hooks/useOnline';
import type { ApiError } from '@/types/api/auth';
import { AkunDemo } from './AkunDemo';
import { AlertBanner } from './AlertBanner';
import { PesanSalah, RingkasanError } from './FieldFeedback';
import { TombolMata } from './TombolMata';
import { VerifikasiEmailPanel } from './VerifikasiEmailPanel';
import styles from './auth.module.css';

type Layar = 'form' | 'verifikasi' | 'sukses';

/**
 * Formulir masuk peserta.
 *
 * Semua 8 state UI (agents.md §4) ditangani: loading (tombol terkunci + spinner),
 * validation (inline + ringkasan + fokus ke error pertama), unauthorized
 * (INVALID_CREDENTIALS tanpa membocorkan field mana), conflict/suspended,
 * rate limited (hitung mundur), offline (banner + submit dicegah), dan success.
 */
export function MasukForm({
  sesiHabis = false,
  simulasi = 'sukses',
}: {
  /** Ditandai saat pengguna sampai di sini karena sesinya kedaluwarsa. */
  readonly sesiHabis?: boolean;
  /** Skenario respons mock selama endpoint auth belum ada. */
  readonly simulasi?: SimulasiRespons;
}) {
  const router = useRouter();
  const online = useOnline();

  const idAwal = useId();
  const emailId = `${idAwal}-email`;
  const passId = `${idAwal}-pass`;
  const ringkasanId = `${idAwal}-ringkasan`;

  const refEmail = useRef<HTMLInputElement>(null);
  const refPass = useRef<HTMLInputElement>(null);

  const [layar, setLayar] = useState<Layar>('form');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tampilPass, setTampilPass] = useState(false);
  const [ingatSaya, setIngatSaya] = useState(true);
  const [disentuh, setDisentuh] = useState<{ email?: boolean; pass?: boolean }>({});
  const [terkirim, setTerkirim] = useState(false);
  const [memproses, setMemproses] = useState(false);
  const [gagal, setGagal] = useState<ApiError | null>(null);
  const [live, setLive] = useState('');
  const [tujuan, setTujuan] = useState<{ href: string; label: string } | null>(null);
  const [sisaRetry, mulaiRetry] = useHitungMundur();

  const salahEmail = errorEmail(email);
  const salahPass = errorPasswordMasuk(password);
  const tampilkanEmail = (terkirim || disentuh.email) && salahEmail;
  const tampilkanPass = (terkirim || disentuh.pass) && salahPass;

  const ringkasan = terkirim
    ? [
        salahEmail ? `Email: ${salahEmail}` : null,
        salahPass ? `Password: ${salahPass}` : null,
      ].filter((t): t is string => t !== null)
    : [];

  const terkunci = memproses || sisaRetry > 0;
  const labelTombol = memproses
    ? 'Memproses…'
    : sisaRetry > 0
      ? `Tunggu ${sisaRetry} detik`
      : 'Masuk';

  async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (terkunci) return;

    if (salahEmail || salahPass) {
      setTerkirim(true);
      setGagal(null);
      setLive('Formulir belum lengkap. Periksa bagian yang ditandai.');
      // Fokus ke error pertama sesuai urutan field (agents.md §4).
      (salahEmail ? refEmail : refPass).current?.focus({ preventScroll: true });
      return;
    }

    setMemproses(true);
    setGagal(null);
    setLive('Memeriksa kredensial…');

    const hasil = await kirimMasuk({ email: email.trim(), password, remember: ingatSaya }, simulasi);
    setMemproses(false);

    if (!hasil.ok) {
      setGagal(hasil.error);
      mulaiRetry(hasil.error.retryAfter ?? 0);
      setLive('Permintaan gagal. Baca keterangan di atas formulir.');
      return;
    }

    // Sukses hanya diklaim setelah respons server (agents.md §1). Tujuan setelah
    // masuk ditentukan `role` dari server, bukan ditebak dari isi formulir.
    // TODO(api-contract): area super admin (/super) belum ada; sementara ikut ke
    // panel panitia.
    const berikutnya =
      hasil.data.role === 'peserta'
        ? { href: '/dashboard', label: 'dashboard peserta' }
        : { href: '/admin/dashboard', label: 'Panel Panitia' };

    setTujuan(berikutnya);
    setLayar('sukses');
    setLive(`Masuk berhasil. Mengalihkan ke ${berikutnya.label}.`);
    router.prefetch(berikutnya.href);
  }

  if (layar === 'verifikasi') {
    return (
      <section className={styles.card}>
        <VerifikasiEmailPanel
          email={email}
          simulasi={simulasi}
          onKembali={() => {
            setLayar('form');
            setGagal(null);
            setLive('');
          }}
        />
      </section>
    );
  }

  if (layar === 'sukses' && tujuan) {
    return (
      <section className={styles.card}>
        <MasukSukses tujuan={tujuan} onLanjut={() => router.replace(tujuan.href)} />
      </section>
    );
  }

  const pesan = gagal ? pesanError(gagal) : null;

  return (
    <>
      {!online ? (
        <AlertBanner
          peran="status"
          nada="warn"
          teks="Kamu sedang offline. Formulir tetap bisa diisi, tapi belum bisa dikirim sampai koneksi kembali."
        />
      ) : null}

      {sesiHabis && !pesan ? (
        <AlertBanner
          peran="status"
          nada="info"
          teks="Sesi kamu sudah berakhir karena tidak ada aktivitas. Masuk lagi untuk melanjutkan."
        />
      ) : null}

      <section className={styles.card}>
        <p className={styles.eyebrow}>Masuk peserta</p>
        <h1 className={styles.judul}>Selamat datang kembali</h1>
        <p className={styles.deskripsi}>
          Pakai email yang kamu daftarkan. Data lomba dan tim tersimpan di dashboard kamu.
        </p>

        {pesan ? (
          <AlertBanner
            diForm
            nada={pesan.nada}
            judul={pesan.judul}
            teks={pesan.detail}
            {...(sisaRetry > 0 ? { meta: `Coba lagi dalam ${sisaRetry} detik` } : {})}
            {...(gagal?.correlationId ? { correlationId: gagal.correlationId } : {})}
            {...(pesan.aksi
              ? {
                  aksi: {
                    label: pesan.aksi,
                    onClick: () => {
                      setLayar('verifikasi');
                      setGagal(null);
                      setLive('');
                    },
                  },
                }
              : {})}
          />
        ) : null}

        <RingkasanError id={ringkasanId} item={ringkasan} />

        <form noValidate onSubmit={onSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor={emailId} className={styles.label}>
              Email
            </label>
            <input
              ref={refEmail}
              id={emailId}
              type="email"
              name="email"
              autoComplete="email"
              inputMode="email"
              spellCheck={false}
              placeholder="nama@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setDisentuh((d) => ({ ...d, email: true }))}
              aria-invalid={tampilkanEmail ? true : undefined}
              aria-describedby={tampilkanEmail ? `${emailId}-err` : undefined}
              className={`${styles.input} ${tampilkanEmail ? styles.inputSalah : ''}`}
            />
            {tampilkanEmail && salahEmail ? (
              <PesanSalah id={`${emailId}-err`}>{salahEmail}</PesanSalah>
            ) : null}
          </div>

          <div className={styles.field}>
            <div className={styles.labelBaris}>
              <label htmlFor={passId} className={styles.label}>
                Password
              </label>
              {/* TODO(route): /lupa-password menyusul di task reset password. */}
              <Link href="/lupa-password" className={styles.tautanKecil}>
                Lupa password?
              </Link>
            </div>

            <div className={styles.inputBungkus}>
              <input
                ref={refPass}
                id={passId}
                type={tampilPass ? 'text' : 'password'}
                name="password"
                autoComplete="current-password"
                placeholder="Password kamu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setDisentuh((d) => ({ ...d, pass: true }))}
                aria-invalid={tampilkanPass ? true : undefined}
                aria-describedby={tampilkanPass ? `${passId}-err` : undefined}
                className={`${styles.input} ${styles.inputRuangTombol} ${tampilkanPass ? styles.inputSalah : ''}`}
              />
              <TombolMata tampil={tampilPass} onToggle={() => setTampilPass((v) => !v)} />
            </div>

            {tampilkanPass && salahPass ? (
              <PesanSalah id={`${passId}-err`}>{salahPass}</PesanSalah>
            ) : null}
          </div>

          <label className={styles.centangBaris}>
            <input
              type="checkbox"
              checked={ingatSaya}
              onChange={(e) => setIngatSaya(e.target.checked)}
              className={styles.centang}
            />
            <span className={styles.centangTeks}>Ingat saya di perangkat ini</span>
          </label>

          <button type="submit" disabled={terkunci} className={styles.tombolUtama}>
            {memproses ? <span aria-hidden="true" className={styles.spinner} /> : null}
            {labelTombol}
          </button>

          <p aria-live="polite" className={styles.live}>
            {live}
          </p>
        </form>

        <p className={styles.kaki}>
          Belum punya akun? <Link href="/daftar">Daftar sekarang</Link>
        </p>
      </section>

      {AUTH_MOCK ? (
        <AkunDemo
          onPakai={(emailDemo, passwordDemo) => {
            setEmail(emailDemo);
            setPassword(passwordDemo);
            setDisentuh({});
            setTerkirim(false);
            setGagal(null);
            setLive('Akun demo dimasukkan ke formulir. Tekan Masuk untuk mencoba.');
          }}
        />
      ) : null}
    </>
  );
}

/**
 * Konfirmasi singkat sebelum masuk ke dashboard. Peralihan diberi jeda pendek
 * supaya statusnya sempat terbaca dan sempat diumumkan screen reader; tombolnya
 * tetap ada sebagai jalan keluar kalau peralihan otomatis gagal.
 */
function MasukSukses({
  tujuan,
  onLanjut,
}: {
  readonly tujuan: { readonly href: string; readonly label: string };
  readonly onLanjut: () => void;
}) {
  const refJudul = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    refJudul.current?.focus({ preventScroll: true });
    const timer = setTimeout(onLanjut, 1200);
    return () => clearTimeout(timer);
  }, [onLanjut]);

  return (
    <div>
      <span aria-hidden="true" className={`${styles.lencana} ${styles.lencanaSukses}`}>
        ✓
      </span>
      <h1 ref={refJudul} tabIndex={-1} className={styles.judulHasil}>
        Masuk berhasil
      </h1>
      <p className={styles.deskripsiHasil}>
        Sesi kamu aktif. Kami sedang mengalihkan ke {tujuan.label}.
      </p>
      <button
        type="button"
        onClick={onLanjut}
        className={`${styles.tombolSekunder} ${styles.aksiTunggal}`}
      >
        Buka {tujuan.label} sekarang
      </button>
    </div>
  );
}
