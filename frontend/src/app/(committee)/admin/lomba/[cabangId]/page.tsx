import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Ikon } from '@/components/app/Ikon';
import { Lencana } from '@/components/app/Lencana';
import { PengaturanKuota } from '@/components/admin/lomba/PengaturanKuota';
import { MeterKuota } from '@/components/admin/MeterKuota';
import { TabelAdmin } from '@/components/admin/TabelAdmin';
import { DAMPAK_KUOTA_FUTSAL, DETAIL_CABANG } from '@/data/admin/lomba';
import { WAKTU_SERVER_ISO } from '@/data/panitia';
import { formatTanggal, formatWaktu } from '@/lib/admin/format';
import type { BarisDampak } from '@/components/admin/DialogAksiKritis';
import adm from '@/components/admin/adm.module.css';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Pengaturan cabang · Panitia',
  robots: { index: false, follow: false },
};

/**
 * `/admin/lomba/[cabangId]` — pengaturan satu cabang (E2.1b–d).
 *
 * Identitas, ketentuan, dan penyelenggaraan tersimpan langsung karena tidak
 * mengubah keadaan pendaftaran siapa pun. Kuota punya blok sendiri dengan dialog
 * dampak, karena satu angka di sana menggeser tim yang sudah mendaftar.
 *
 * Riwayat kuota tidak bisa dihapus dan perubahan yang gagal tersimpan tidak
 * muncul di sana — kalau muncul, riwayat berhenti bisa dipakai auditor.
 */
export default async function PengaturanCabangPage({
  params,
}: {
  readonly params: Promise<{ readonly cabangId: string }>;
}) {
  const { cabangId } = await params;
  const cabang = DETAIL_CABANG[cabangId];
  if (!cabang) notFound();

  const pakaiDampakFutsal = cabangId === 'futsal-putra';

  const dampak: readonly BarisDampak[] = pakaiDampakFutsal
    ? [
        {
          label: 'Pendaftaran terdampak',
          nilai: `${DAMPAK_KUOTA_FUTSAL.timTerdampak} tim · ${DAMPAK_KUOTA_FUTSAL.pesertaTerdampak} peserta`,
        },
        {
          label: 'Dipindahkan ke daftar tunggu',
          nilai: `${DAMPAK_KUOTA_FUTSAL.timTerdampak} tim terakhir mendaftar`,
        },
        {
          label: 'Daftar tunggu setelah perubahan',
          nilai: `${DAMPAK_KUOTA_FUTSAL.daftarTungguSetelah} tim`,
        },
        {
          label: 'Cabang tertutup otomatis',
          nilai: DAMPAK_KUOTA_FUTSAL.tertutupOtomatis
            ? `Ya · ${DAMPAK_KUOTA_FUTSAL.ke} dari ${DAMPAK_KUOTA_FUTSAL.ke} tim terisi`
            : 'Tidak',
        },
      ]
    : [
        { label: 'Pendaftaran terdampak', nilai: 'Tidak ada — kapasitas dinaikkan' },
        { label: 'Daftar tunggu setelah perubahan', nilai: 'Tidak berubah' },
        { label: 'Cabang tertutup otomatis', nilai: 'Tidak' },
      ];

  const catatanDampak = pakaiDampakFutsal
    ? `Dua tim yang dipindahkan: ${DAMPAK_KUOTA_FUTSAL.timDipindahkan.map((t) => `${t.tim} (${t.meta})`).join(' · ')}. Keduanya menerima notifikasi dalam aplikasi dan email berisi posisi baru di daftar tunggu. Data tim dan dokumen anggota tidak dihapus.`
    : 'Menaikkan kapasitas membuka pendaftaran lagi sampai tenggat. Tidak ada tim yang berpindah dan tidak ada notifikasi pembatalan yang terkirim.';

  return (
    <div className={adm.halaman}>
      <header className={styles.kepala}>
        <div className={styles.kepalaTeks}>
          <Link href="/admin/lomba" className={adm.tautan}>
            <Ikon nama="panah" ukuran={12} tebal={2.4} className={styles.panahBalik} />
            Kembali ke daftar cabang
          </Link>
          <h1 className={styles.judul}>{cabang.nama}</h1>
          <p className={adm.meta}>
            {cabang.kategori} · cabang {cabang.tipe.toLowerCase()} · PIC {cabang.pic} · tenggat{' '}
            {formatTanggal(cabang.tenggatIso)}
          </p>
        </div>

        <MeterKuota kuota={cabang.kuota} />
      </header>

      <div className={`${adm.duaLajur} ${adm.duaLajurSeimbang}`}>
        <section className={adm.kartu}>
          <h2 className={adm.kartuJudul}>Identitas cabang</h2>

          <div className={adm.ladang}>
            <span className={adm.ladangLabel}>Nama cabang</span>
            <input type="text" defaultValue={cabang.nama} className={adm.isian} />
          </div>

          <dl className={adm.rincian}>
            <div className={adm.rincianBaris}>
              <dt className={adm.rincianLabel}>Kategori</dt>
              <dd className={adm.rincianNilai}>{cabang.kategori}</dd>
            </div>
            <div className={adm.rincianBaris}>
              <dt className={adm.rincianLabel}>Tipe</dt>
              <dd className={adm.rincianNilai}>{cabang.tipe}</dd>
            </div>
            {cabang.roster ? (
              <div className={adm.rincianBaris}>
                <dt className={adm.rincianLabel}>Ukuran roster</dt>
                <dd className={adm.rincianNilai}>
                  {cabang.roster.minimum}–{cabang.roster.maksimum} anggota
                </dd>
              </div>
            ) : null}
          </dl>

          <p className={adm.catatan}>
            Tipe tidak bisa diubah setelah ada pendaftaran masuk: cabang ini sudah punya{' '}
            {cabang.kuota.terisi} {cabang.kuota.satuan} terdaftar. Untuk mengubah tipe, cabang harus
            ditutup dan dibuat ulang — <strong>asumsi, perlu konfirmasi panitia</strong>.
          </p>

          <div className={adm.ladang}>
            <span className={adm.ladangLabel}>Ketentuan singkat</span>
            <textarea rows={3} defaultValue={cabang.ketentuan} className={adm.areaTeks} />
          </div>

          <div className={styles.juknis}>
            <div>
              <p className={styles.juknisNama}>{cabang.juknis.nama}</p>
              <p className={adm.catatan}>
                Versi {cabang.juknis.versi} · {formatTanggal(cabang.juknis.tanggalIso)} ·{' '}
                {cabang.juknis.ukuran} · dilihat {cabang.juknis.dilihat} kali
              </p>
            </div>
            <button type="button" className={`${adm.tombol} ${adm.tombolKecil}`}>
              Unggah versi {cabang.juknis.versi + 1}
            </button>
          </div>

          <p className={adm.catatan}>
            Versi lama tetap bisa diunduh peserta agar mereka bisa membandingkan. Mengunggah versi
            baru memicu notifikasi ke {cabang.kuota.terisi} pendaftar cabang ini.
          </p>
        </section>

        <section className={adm.kartu}>
          <h2 className={adm.kartuJudul}>Penyelenggaraan</h2>

          <dl className={adm.rincian}>
            <div className={adm.rincianBaris}>
              <dt className={adm.rincianLabel}>PIC cabang</dt>
              <dd className={adm.rincianNilai}>
                {cabang.pic} · {cabang.picEmail}
              </dd>
            </div>
            <div className={adm.rincianBaris}>
              <dt className={adm.rincianLabel}>Status pendaftaran</dt>
              <dd className={adm.rincianNilai}>
                {cabang.status === 'buka'
                  ? 'Buka'
                  : cabang.status === 'daftar-tunggu'
                    ? 'Daftar tunggu'
                    : 'Tutup'}
              </dd>
            </div>
          </dl>

          <p className={adm.catatan}>
            Hanya kanal resmi yang dipublikasikan ke peserta: email cabang. Nomor pribadi tidak
            pernah ditampilkan.
          </p>

          <div>
            <p className={adm.eyebrow}>Venue</p>
            <ul className={styles.chipDaftar}>
              {cabang.venue.map((v) => (
                <li key={v} className={styles.chip}>
                  {v}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className={adm.eyebrow}>Wasit &amp; juri bertugas</p>
            <ul className={styles.ofisialDaftar}>
              {cabang.ofisial.map((o) => (
                <li key={o.id} className={styles.ofisial}>
                  <span>
                    <strong>{o.nama}</strong> · {o.peran}
                  </span>
                  <span className={adm.catatan}>{o.jumlahSesi} sesi ditugaskan</span>
                </li>
              ))}
            </ul>
            <p className={adm.catatan}>
              Penugasan per sesi diatur di modul Jadwal; di sini hanya daftar orang yang boleh
              ditugaskan pada cabang ini.
            </p>
          </div>
        </section>
      </div>

      <PengaturanKuota
        namaCabang={cabang.nama}
        kuota={cabang.kuota}
        kapasitasBaru={pakaiDampakFutsal ? DAMPAK_KUOTA_FUTSAL.ke : (cabang.kuota.kapasitas ?? 0) + 2}
        kebijakanDaftarTunggu={cabang.kebijakanDaftarTunggu}
        keadaanSekarang={cabang.keadaanSekarang}
        dampak={dampak}
        catatanDampak={catatanDampak}
        waktuServerIso={WAKTU_SERVER_ISO}
      />

      <section className={adm.bagian}>
        <div className={adm.bagianKepala}>
          <h2 className={adm.judulBagian}>Riwayat perubahan kuota</h2>
          <p className={adm.catatan}>{cabang.riwayatKuota.length} catatan</p>
        </div>

        <TabelAdmin
          caption="Riwayat perubahan kuota cabang, terbaru di atas"
          minLebar={760}
          kolom={[
            { label: 'Waktu' },
            { label: 'Oleh' },
            { label: 'Perubahan' },
            { label: 'Alasan' },
            { label: 'Ref' },
          ]}
        >
          {cabang.riwayatKuota.map((r) => (
            <tr key={r.id}>
              <td>{formatWaktu(r.waktuIso)}</td>
              <td>{r.oleh}</td>
              <td>
                <strong>{r.perubahan}</strong>
              </td>
              <td>{r.alasan}</td>
              <td>
                <span className={adm.mono}>{r.ref}</span>
              </td>
            </tr>
          ))}
        </TabelAdmin>

        <p className={adm.catatan}>
          Riwayat tidak bisa dihapus, dan perubahan yang gagal tersimpan tidak muncul di sini.
          Alasan yang tercatat sama persis dengan yang dibaca auditor.
        </p>
      </section>

      {cabang.daftarTunggu.length > 0 ? (
        <section className={adm.kartu}>
          <div className={adm.kartuKepala}>
            <h2 className={adm.kartuJudul}>Daftar tunggu</h2>
            <Lencana
              label={`${cabang.daftarTunggu.length} ${cabang.kuota.satuan} menunggu`}
              nada="warn"
              ikon="jam"
            />
          </div>

          <ol className={styles.tunggu}>
            {cabang.daftarTunggu.map((t) => (
              <li key={t.posisi} className={styles.tungguItem}>
                <span aria-hidden="true" className={styles.tungguPosisi}>
                  {t.posisi}
                </span>
                <div>
                  <p className={styles.tungguNama}>{t.tim}</p>
                  <p className={adm.catatan}>
                    {formatWaktu(t.daftarIso)} · {t.jumlahPeserta} peserta
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <p className={adm.catatan}>
            Urutan mengikuti waktu pendaftaran. Tim di daftar tunggu naik otomatis bila ada tim yang
            mundur, dan menerima notifikasi saat posisinya berubah. Menaikkan tim secara manual di
            luar urutan <strong>belum dirancang sebagai fitur</strong>.
          </p>
        </section>
      ) : null}
    </div>
  );
}
