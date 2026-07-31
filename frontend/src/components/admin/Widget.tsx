'use client';

import Link from 'next/link';
import { Ikon } from '@/components/app/Ikon';
import { formatAngka, formatTanggal, formatUmur, formatWaktu, teksDiperbarui } from '@/lib/admin/format';
import { hitungUmurDetik, tentukanKondisi } from '@/lib/admin/kebasian';
import type { WidgetPanitia } from '@/types/panitia';
import { ChipCakupan } from './ChipCakupan';
import { DefinisiMetrik } from './DefinisiMetrik';
import styles from './Widget.module.css';

/**
 * Widget baku dashboard panitia (desain Batch D, papan 1A).
 *
 * Enam bagian wajib: judul metrik · ikon definisi · angka utama + pecahan ·
 * waktu pembaruan · tautan drill-down · penanda cakupan (hanya bila menyimpang
 * dari filter global).
 *
 * Lima kondisi, dan aturan yang dijaga di sini (AC-FE-09, agents.md §10):
 *
 *  - `memuat`  — kerangka mengikuti layout final. Angka TIDAK dirender sebagai
 *                nol, drill-down mati. Hanya untuk pemuatan ulang karena filter
 *                berubah; penyegaran latar tidak mengosongkan angka.
 *  - `normal`  — angka tampil apa adanya. Nol tetap nol.
 *  - `stale`   — angka lama tetap tampil TAPI diredupkan, diberi umur, dan
 *                disertai peringatan keputusan khusus metrik ini.
 *  - `gagal`   — tidak ada angka sama sekali. Em dash, alasan singkat tanpa data
 *                pribadi, waktu percobaan terakhir, dan kode rujukan.
 *  - `belum-mulai` — metrik yang belum punya arti. Bukan nol: nol terbaca
 *                sebagai kegagalan padahal belum ada yang bisa dihitung.
 */
export function Widget({
  w,
  waktuServerIso,
  hanyutDetik = 0,
  memuat = false,
  penyegaranGagal = false,
  sembunyikanCakupan = false,
  sembunyikanRincian = false,
  onMuatUlang,
  anak,
}: {
  readonly w: WidgetPanitia;
  readonly waktuServerIso: string;
  /** Detik yang berlalu di client sejak payload diterima. */
  readonly hanyutDetik?: number;
  readonly memuat?: boolean;
  readonly penyegaranGagal?: boolean;
  /** Dipakai bila keterangan cakupan sudah ditulis di header band. */
  readonly sembunyikanCakupan?: boolean;
  /** Dipakai bila visual mikro sudah membawa angka yang sama — hindari ganda. */
  readonly sembunyikanRincian?: boolean;
  readonly onMuatUlang?: () => void;
  readonly anak?: React.ReactNode;
}) {
  /*
   * INVARIANT: widget tidak boleh dirender tanpa `last_updated_at`. Angka yang
   * umurnya tidak bisa dinilai tidak boleh dipakai untuk keputusan apa pun, jadi
   * ketiadaan waktu pembaruan diperlakukan sebagai kegagalan sumber data —
   * bukan sebagai angka tanpa keterangan.
   */
  const invariantDilanggar =
    (w.statusServer === 'ready' || w.statusServer === 'stale') && !w.diperbaruiIso;

  const umurDetik = hitungUmurDetik(waktuServerIso, w.diperbaruiIso, hanyutDetik);

  const kondisi = memuat
    ? 'memuat'
    : tentukanKondisi({
        statusServer: w.statusServer,
        diperbaruiIso: w.diperbaruiIso,
        umurDetik,
        intervalHitungUlangDetik: w.definisi.intervalHitungUlangDetik,
        penyegaranGagal,
      });

  const galat = w.galat ?? {
    ref: `INV-${w.id.toUpperCase()}`,
    alasan: 'Server tidak mengirim waktu pembaruan untuk angka ini.',
    dicobaIso: waktuServerIso,
  };

  const angka = w.nilaiTeks ?? (w.nilai !== null ? formatAngka(w.nilai) : null);
  const tampilkanAngka = (kondisi === 'normal' || kondisi === 'stale') && angka !== null;
  const tampilkanIsiSekunder = kondisi === 'normal' || kondisi === 'stale';

  return (
    <article
      data-nada={w.nada}
      data-sorot={w.sorotUtama && kondisi !== 'gagal'}
      data-kondisi={kondisi}
      className={styles.widget}
    >
      <header className={styles.kepala}>
        <h3 className={styles.judul}>{w.judul}</h3>
        <DefinisiMetrik judul={w.judul} definisi={w.definisi} cakupan={w.cakupan} />
      </header>

      {!sembunyikanCakupan && !w.cakupan.ikutFilterGlobal && w.cakupan.labelPenyimpangan ? (
        <ChipCakupan label={w.cakupan.labelPenyimpangan} />
      ) : null}

      <div className={styles.isi}>
        {kondisi === 'memuat' ? (
          <div className={styles.kerangka} role="status">
            <span className="sr-only">Memuat {w.judul}</span>
            <span aria-hidden="true" className={styles.kerangkaAngka} />
            <span aria-hidden="true" className={styles.kerangkaBaris} />
            <span aria-hidden="true" className={styles.kerangkaBarisPendek} />
          </div>
        ) : null}

        {kondisi === 'gagal' || invariantDilanggar ? (
          <div className={styles.gagal}>
            <p className={styles.gagalAngka} aria-hidden="true">
              —
            </p>
            <p className={styles.gagalJudul}>Angka tidak dapat dimuat</p>
            <p className={styles.gagalTeks}>
              {galat.alasan} Percobaan terakhir {formatWaktu(galat.dicobaIso)}.
            </p>
            <p className={styles.gagalRef}>Ref {galat.ref}</p>
          </div>
        ) : null}

        {kondisi === 'belum-mulai' && w.belumMulai ? (
          <div className={styles.belumMulai}>
            <p className={styles.belumMulaiJudul}>Belum dimulai</p>
            <p className={styles.belumMulaiTeks}>{w.belumMulai.alasan}</p>
            <p className={styles.belumMulaiTanggal}>
              Angkanya mulai berarti {formatTanggal(w.belumMulai.berartiSejakIso)}.
            </p>
          </div>
        ) : null}

        {tampilkanAngka ? (
          <div data-stale={kondisi === 'stale'} className={styles.angkaBlok}>
            <p className={styles.angka}>{angka}</p>
            {w.pecahan ? <p className={styles.pecahan}>{w.pecahan}</p> : null}
          </div>
        ) : null}

        {tampilkanIsiSekunder && w.sorotan ? (
          <div className={styles.sorotan}>
            <span className={styles.sorotanLabel}>{w.sorotan.label}</span>
            <span className={styles.sorotanNilai}>{w.sorotan.nilai}</span>
            {w.sorotan.meta ? <span className={styles.sorotanMeta}>{w.sorotan.meta}</span> : null}
          </div>
        ) : null}

        {tampilkanIsiSekunder && w.rincian && !sembunyikanRincian ? (
          <ul className={styles.rincian}>
            {w.rincian.map((r) => (
              <li key={r.label} data-nada={r.nada} className={styles.rincianBaris}>
                {/* Bar proporsi duduk di lapisan belakang; teks tetap di depan
                    dan tetap terbaca penuh. Latar, bukan sorotan. */}
                {r.proporsi !== undefined ? (
                  <span
                    aria-hidden="true"
                    style={{ width: `${Math.min(100, Math.max(0, r.proporsi * 100))}%` }}
                    className={styles.rincianLatar}
                  />
                ) : null}
                <span className={styles.rincianLabel}>{r.label}</span>
                <span className={styles.rincianNilai}>{r.nilai}</span>
              </li>
            ))}
          </ul>
        ) : null}

        {tampilkanIsiSekunder ? anak : null}

        {kondisi === 'stale' && w.diperbaruiIso && umurDetik !== null ? (
          <div className={styles.stale}>
            <p className={styles.staleBaris}>
              Data belum diperbarui sejak {formatWaktu(w.diperbaruiIso)} · {formatUmur(umurDetik)} lalu.
            </p>
            <p className={styles.staleBaris}>Angka di atas kemungkinan sudah berubah.</p>

            {w.peringatanKeputusan ? (
              <p className={styles.stalePeringatan}>
                <span className={styles.stalePeringatanLabel}>Peringatan keputusan</span>
                {w.peringatanKeputusan}
              </p>
            ) : null}

            {onMuatUlang ? (
              <button type="button" onClick={onMuatUlang} className={styles.tombolMuatUlang}>
                <Ikon nama="ulang" ukuran={12} tebal={2.2} />
                Muat ulang
              </button>
            ) : null}
          </div>
        ) : null}
      </div>

      <footer className={styles.kaki}>
        <div className={styles.kakiTeks}>
          {kondisi !== 'gagal' && w.diperbaruiIso && umurDetik !== null ? (
            <p className={styles.diperbarui}>{teksDiperbarui(w.diperbaruiIso, umurDetik)}</p>
          ) : null}
        </div>

        {w.drilldown ? (
          kondisi === 'memuat' ? (
            <span aria-disabled="true" className={styles.drilldownMati}>
              {w.drilldown.label}
            </span>
          ) : (
            <Link href={w.drilldown.href} className={styles.drilldown}>
              {w.drilldown.label}
              <Ikon nama="panah" ukuran={12} tebal={2.4} />
            </Link>
          )
        ) : null}
      </footer>
    </article>
  );
}
