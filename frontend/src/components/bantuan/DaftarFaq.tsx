'use client';

import { useId, useMemo, useState } from 'react';
import { Ikon } from '@/components/app/Ikon';
import { KATEGORI_FAQ, type Faq } from '@/data/bantuan';
import styles from './DaftarFaq.module.css';

/**
 * FAQ dengan pencarian dan filter kategori.
 *
 * Pencarian berjalan di client karena seluruh FAQ memang sudah ada di halaman —
 * tidak ada pemanggilan jaringan dan tidak ada kata kunci peserta yang dikirim
 * ke mana pun. Jawaban memakai `<details>` supaya tetap bisa dibuka dengan
 * keyboard dan terbaca screen reader tanpa JavaScript tambahan.
 */
export function DaftarFaq({ faq }: { readonly faq: readonly Faq[] }) {
  const id = useId();
  const [kueri, setKueri] = useState('');
  const [kategori, setKategori] = useState<(typeof KATEGORI_FAQ)[number]>('Semua');

  const hasil = useMemo(() => {
    const k = kueri.trim().toLowerCase();

    return faq.filter((f) => {
      const cocokKategori = kategori === 'Semua' || f.kategori === kategori;
      const cocokKueri =
        k.length === 0 ||
        f.tanya.toLowerCase().includes(k) ||
        f.jawab.toLowerCase().includes(k);

      return cocokKategori && cocokKueri;
    });
  }, [faq, kueri, kategori]);

  return (
    <div className={styles.blok}>
      <div className={styles.cari}>
        <span aria-hidden="true" className={styles.cariIkon}>
          <Ikon nama="bantuan" ukuran={16} tebal={2} />
        </span>
        <label htmlFor={`${id}-cari`} className={styles.sr}>
          Cari pertanyaan
        </label>
        <input
          id={`${id}-cari`}
          type="search"
          value={kueri}
          onChange={(e) => setKueri(e.target.value)}
          placeholder="Cari pertanyaan, misal “dokumen ditolak”"
          className={styles.cariInput}
        />
      </div>

      <div role="group" aria-label="Kategori pertanyaan" className={styles.kategori}>
        {KATEGORI_FAQ.map((k) => (
          <button
            key={k}
            type="button"
            aria-pressed={kategori === k}
            data-terpilih={kategori === k}
            onClick={() => setKategori(k)}
            className={styles.chip}
          >
            {k}
          </button>
        ))}
      </div>

      <p aria-live="polite" className={styles.jumlah}>
        {hasil.length} pertanyaan ditampilkan
      </p>

      {hasil.length > 0 ? (
        <ul className={styles.daftar}>
          {hasil.map((f) => (
            <li key={f.id}>
              <details className={styles.item}>
                <summary className={styles.tanya}>
                  <span className={styles.kategoriTanda}>{f.kategori}</span>
                  {f.tanya}
                </summary>
                <p className={styles.jawab}>{f.jawab}</p>
              </details>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.kosong}>
          Tidak ada pertanyaan yang cocok dengan “{kueri.trim()}”. Coba kata kunci lain, atau
          kirimkan pertanyaanmu lewat formulir di bawah — panitia menjawab maksimal 1×24 jam pada
          hari kerja.
        </p>
      )}
    </div>
  );
}
