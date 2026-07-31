'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Ikon } from '@/components/app/Ikon';
import { FILTER, type KunciFilter } from '@/lib/admin/filter-url';
import type { CakupanWidget, DefinisiMetrik as Definisi } from '@/types/panitia';
import styles from './DefinisiMetrik.module.css';

/**
 * Popover definisi metrik — wajib ada di setiap widget (FE-ADASH-002).
 *
 * Isinya menjawab empat pertanyaan yang membuat angka bisa dipercaya: apa yang
 * dihitung, apa yang sengaja tidak, filter mana yang berlaku, dan dari mana
 * datanya. Tanpa itu dua panitia bisa membaca angka yang sama dengan arti berbeda.
 *
 * Popover, bukan blok yang menyisip: kalau definisi ikut mendorong isi kartu,
 * angka utama pindah tempat tiap kali ikon ditekan.
 *
 * Keyboard: tombol native menangani Enter dan Spasi; Escape menutup DAN
 * mengembalikan fokus ke ikon, bukan melempar fokus ke awal halaman (agents.md §7).
 */
export function DefinisiMetrik({
  judul,
  definisi,
  cakupan,
}: {
  readonly judul: string;
  readonly definisi: Definisi;
  readonly cakupan: CakupanWidget;
}) {
  const [terbuka, setTerbuka] = useState(false);
  const tombolRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const popoverId = useId();

  useEffect(() => {
    if (!terbuka) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setTerbuka(false);
      tombolRef.current?.focus();
    };

    const onPointer = (e: PointerEvent) => {
      const target = e.target as Node;
      if (panelRef.current?.contains(target) || tombolRef.current?.contains(target)) return;
      setTerbuka(false);
    };

    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [terbuka]);

  const berlaku = namaFilter(cakupan.filterBerlaku);
  const diabaikan = namaFilter(cakupan.filterDiabaikan);
  const detik = definisi.intervalHitungUlangDetik;
  const interval = detik >= 60 ? `${Math.round(detik / 60)} menit` : `${detik} detik`;

  return (
    <div className={styles.bungkus}>
      <button
        ref={tombolRef}
        type="button"
        aria-expanded={terbuka}
        aria-controls={popoverId}
        aria-label={`Definisi metrik ${judul}`}
        onClick={() => setTerbuka((v) => !v)}
        className={styles.tombol}
      >
        <Ikon nama="bantuan" ukuran={16} />
      </button>

      {terbuka ? (
        <div ref={panelRef} id={popoverId} role="dialog" aria-label={`Definisi metrik ${judul}`} className={styles.panel}>
          <p className={styles.judul}>Definisi metrik</p>

          <dl className={styles.daftar}>
            <dt>Yang dihitung</dt>
            <dd>{definisi.dihitung}</dd>

            <dt>Yang tidak dihitung</dt>
            <dd>{definisi.tidakDihitung}</dd>

            <dt>Filter yang berlaku</dt>
            <dd>{berlaku || 'Tidak ada — angka ini selalu utuh.'}</dd>

            {diabaikan ? (
              <>
                <dt>Filter yang diabaikan</dt>
                <dd>{diabaikan}</dd>
              </>
            ) : null}
          </dl>

          <p className={styles.sumber}>
            {definisi.sumber} · dihitung ulang tiap {interval}.
          </p>
        </div>
      ) : null}
    </div>
  );
}

function namaFilter(kunci: readonly string[]): string {
  return kunci
    .map((k) => FILTER[k as KunciFilter]?.judul ?? k)
    .join(', ');
}
