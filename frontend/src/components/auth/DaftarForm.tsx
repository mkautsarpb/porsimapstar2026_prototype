'use client';

import Link from 'next/link';
import { useId, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { buatIdempotencyKey, kirimDaftar, type SimulasiRespons } from '@/lib/api/auth';
import { pesanError } from '@/lib/auth-errors';
import { errorEmail, errorKonfirmasi, errorPasswordBaru } from '@/lib/validasi-auth';
import { useOnline } from '@/hooks/useOnline';
import { useHitungMundur } from '@/hooks/useHitungMundur';
import type { ApiError } from '@/types/api/auth';
import { AlertBanner } from './AlertBanner';
import { KekuatanPassword } from './KekuatanPassword';
import { PesanBenar, PesanSalah, RingkasanError } from './FieldFeedback';
import { TombolMata } from './TombolMata';
import { VerifikasiEmailPanel } from './VerifikasiEmailPanel';
import styles from './auth.module.css';

/**
 * Formulir pembuatan akun peserta.
 *
 * Halaman ini sengaja hanya membuat akun — identitas, dokumen, dan pilihan cabang
 * diisi setelah masuk, supaya tidak ada PII yang dikirim sebelum akun terverifikasi
 * (agents.md §6). Idempotency key dibuat sekali per sesi formulir sehingga double
 * submit maksimal menghasilkan satu akun (AC-FE-06).
 */
export function DaftarForm({
  simulasi = 'sukses',
}: {
  /** Skenario respons mock selama endpoint auth belum ada. */
  readonly simulasi?: SimulasiRespons;
}) {
  const router = useRouter();
  const online = useOnline();

  const idAwal = useId();
  const emailId = `${idAwal}-email`;
  const passId = `${idAwal}-pass`;
  const pass2Id = `${idAwal}-pass2`;
  const consentId = `${idAwal}-consent`;
  const kuatId = `${idAwal}-kuat`;
  const ringkasanId = `${idAwal}-ringkasan`;

  const refEmail = useRef<HTMLInputElement>(null);
  const refPass = useRef<HTMLInputElement>(null);
  const refPass2 = useRef<HTMLInputElement>(null);
  const refConsent = useRef<HTMLInputElement>(null);
  // Dibuat sekali per sesi formulir dan dipakai ulang saat retry, supaya percobaan
  // kirim berulang tidak pernah menghasilkan dua akun.
  const idempotency = useRef<string>('');
  if (!idempotency.current) idempotency.current = buatIdempotencyKey();

  const [selesai, setSelesai] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [konfirmasi, setKonfirmasi] = useState('');
  const [tampilPass, setTampilPass] = useState(false);
  const [setuju, setSetuju] = useState(false);
  const [disentuh, setDisentuh] = useState<{ email?: boolean; pass?: boolean; pass2?: boolean }>({});
  const [terkirim, setTerkirim] = useState(false);
  const [memproses, setMemproses] = useState(false);
  const [gagal, setGagal] = useState<ApiError | null>(null);
  const [live, setLive] = useState('');
  const [sisaRetry, mulaiRetry] = useHitungMundur();

  const salahEmail = errorEmail(email);
  const salahPass = errorPasswordBaru(password);
  const salahPass2 = errorKonfirmasi(password, konfirmasi);
  const salahSetuju = setuju ? undefined : 'Persetujuan ini wajib sebelum akun dibuat.';

  const tampilkanEmail = (terkirim || disentuh.email) && salahEmail;
  const tampilkanPass = (terkirim || disentuh.pass) && salahPass;
  const tampilkanPass2 = (terkirim || disentuh.pass2) && salahPass2;
  const tampilkanSetuju = terkirim && salahSetuju;

  const ringkasan = terkirim
    ? [
        salahEmail ? `Email: ${salahEmail}` : null,
        salahPass ? `Password: ${salahPass}` : null,
        salahPass2 ? `Konfirmasi password: ${salahPass2}` : null,
        salahSetuju ? 'Persetujuan syarat & ketentuan belum dicentang.' : null,
      ].filter((t): t is string => t !== null)
    : [];

  const terkunci = memproses || sisaRetry > 0;
  const labelTombol = memproses
    ? 'Memproses…'
    : sisaRetry > 0
      ? `Tunggu ${sisaRetry} detik`
      : 'Buat akun';

  async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (terkunci) return;

    if (salahEmail || salahPass || salahPass2 || salahSetuju) {
      setTerkirim(true);
      setGagal(null);
      setLive('Formulir belum lengkap. Periksa bagian yang ditandai.');

      const pertama = salahEmail
        ? refEmail
        : salahPass
          ? refPass
          : salahPass2
            ? refPass2
            : refConsent;
      pertama.current?.focus({ preventScroll: true });
      return;
    }

    setMemproses(true);
    setGagal(null);
    setLive('Membuat akun…');

    const hasil = await kirimDaftar(
      {
        email: email.trim(),
        password,
        passwordConfirmation: konfirmasi,
        consent: setuju,
        idempotencyKey: idempotency.current,
      },
      simulasi,
    );
    setMemproses(false);

    if (!hasil.ok) {
      setGagal(hasil.error);
      mulaiRetry(hasil.error.retryAfter ?? 0);
      setLive('Permintaan gagal. Baca keterangan di atas formulir.');
      return;
    }

    setSelesai(true);
    setLive('Akun dibuat. Tautan verifikasi terkirim.');
  }

  if (selesai) {
    return (
      <section className={styles.card}>
        <VerifikasiEmailPanel
          email={email}
          simulasi={simulasi}
          onKembali={() => router.push('/masuk')}
        />
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

      <section className={styles.card}>
        <p className={styles.eyebrow}>Registrasi</p>
        <h1 className={styles.judul}>Buat akun peserta</h1>
        <p className={styles.deskripsi}>
          Halaman ini hanya membuat akun. Data diri, dokumen, dan pilihan cabang diisi setelah kamu
          masuk.
        </p>

        {pesan ? (
          <AlertBanner
            diForm
            nada={pesan.nada}
            judul={pesan.judul}
            teks={pesan.detail}
            {...(sisaRetry > 0 ? { meta: `Coba lagi dalam ${sisaRetry} detik` } : {})}
            {...(gagal?.correlationId ? { correlationId: gagal.correlationId } : {})}
          />
        ) : null}

        <RingkasanError id={ringkasanId} item={ringkasan} />

        <form noValidate onSubmit={onSubmit} className={`${styles.form} ${styles.formLonggar}`}>
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
              aria-describedby={
                tampilkanEmail ? `${emailId}-err ${emailId}-hint` : `${emailId}-hint`
              }
              className={`${styles.input} ${tampilkanEmail ? styles.inputSalah : ''}`}
            />
            <p id={`${emailId}-hint`} className={styles.hint}>
              Tautan verifikasi dikirim ke alamat ini, jadi pastikan bisa kamu buka.
            </p>
            {tampilkanEmail && salahEmail ? (
              <PesanSalah id={`${emailId}-err`}>{salahEmail}</PesanSalah>
            ) : null}
          </div>

          <div className={styles.fieldPassword}>
            <label htmlFor={passId} className={styles.label}>
              Password
            </label>

            <div className={styles.inputBungkus}>
              <input
                ref={refPass}
                id={passId}
                type={tampilPass ? 'text' : 'password'}
                name="password"
                autoComplete="new-password"
                placeholder="Minimal 8 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setDisentuh((d) => ({ ...d, pass: true }))}
                aria-invalid={tampilkanPass ? true : undefined}
                aria-describedby={tampilkanPass ? `${passId}-err ${kuatId}` : kuatId}
                className={`${styles.input} ${styles.inputRuangTombol} ${tampilkanPass ? styles.inputSalah : ''}`}
              />
              <TombolMata tampil={tampilPass} onToggle={() => setTampilPass((v) => !v)} />
            </div>

            <KekuatanPassword id={kuatId} password={password} />

            {tampilkanPass && salahPass ? (
              <PesanSalah id={`${passId}-err`}>{salahPass}</PesanSalah>
            ) : null}
          </div>

          <div className={styles.field}>
            <label htmlFor={pass2Id} className={styles.label}>
              Konfirmasi password
            </label>
            <input
              ref={refPass2}
              id={pass2Id}
              type={tampilPass ? 'text' : 'password'}
              name="password_confirmation"
              autoComplete="new-password"
              placeholder="Tulis ulang password"
              value={konfirmasi}
              onChange={(e) => setKonfirmasi(e.target.value)}
              onBlur={() => setDisentuh((d) => ({ ...d, pass2: true }))}
              aria-invalid={tampilkanPass2 ? true : undefined}
              aria-describedby={tampilkanPass2 ? `${pass2Id}-err` : undefined}
              className={`${styles.input} ${tampilkanPass2 ? styles.inputSalah : ''}`}
            />
            {tampilkanPass2 && salahPass2 ? (
              <PesanSalah id={`${pass2Id}-err`}>{salahPass2}</PesanSalah>
            ) : null}
            {!salahPass2 && konfirmasi ? <PesanBenar>Password sudah sama</PesanBenar> : null}
          </div>

          <div className={styles.field}>
            {/* Checkbox dan teksnya sengaja bersaudara, bukan bersarang: teks
                persetujuan memuat tautan, dan tautan di dalam <label> membuat
                area klik jadi ambigu. */}
            <div className={styles.centangBaris}>
              <input
                ref={refConsent}
                id={consentId}
                type="checkbox"
                checked={setuju}
                onChange={(e) => setSetuju(e.target.checked)}
                aria-invalid={tampilkanSetuju ? true : undefined}
                aria-describedby={tampilkanSetuju ? `${consentId}-err` : undefined}
                className={styles.centang}
              />
              {/* TODO(route): /syarat dan /privasi belum dibuat — halaman statiknya
                  menunggu naskah resmi dari panitia. */}
              <label htmlFor={consentId} className={styles.centangTeks}>
                Saya menyetujui <Link href="/syarat">syarat &amp; ketentuan</Link> dan{' '}
                <Link href="/privasi">kebijakan privasi</Link> PORSIMAPTAR XXVI.
              </label>
            </div>
            {tampilkanSetuju && salahSetuju ? (
              <PesanSalah id={`${consentId}-err`}>{salahSetuju}</PesanSalah>
            ) : null}
          </div>

          <button type="submit" disabled={terkunci} className={styles.tombolUtama}>
            {memproses ? <span aria-hidden="true" className={styles.spinner} /> : null}
            {labelTombol}
          </button>

          <p aria-live="polite" className={styles.live}>
            {live}
          </p>
        </form>

        <p className={styles.kaki}>
          Sudah punya akun? <Link href="/masuk">Masuk di sini</Link>
        </p>
      </section>
    </>
  );
}
