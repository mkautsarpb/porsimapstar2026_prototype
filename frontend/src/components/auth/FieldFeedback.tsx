import styles from './auth.module.css';

/** Pesan error satu field: ikon + teks, terasosiasi lewat `aria-describedby`. */
export function PesanSalah({ id, children }: { readonly id: string; readonly children: string }) {
  return (
    <p id={id} className={styles.pesanSalah}>
      <span aria-hidden="true" className={styles.tandaSalah}>
        !
      </span>
      {children}
    </p>
  );
}

/** Konfirmasi positif, mis. "Password sudah sama". */
export function PesanBenar({ children }: { readonly children: string }) {
  return (
    <p className={styles.pesanBenar}>
      <span aria-hidden="true" className={styles.tandaBenar}>
        ✓
      </span>
      {children}
    </p>
  );
}

/**
 * Ringkasan error di atas formulir. Dibutuhkan agar pengguna screen reader tahu
 * semua yang harus diperbaiki tanpa menyusuri field satu per satu (agents.md §4).
 */
export function RingkasanError({ id, item }: { readonly id: string; readonly item: readonly string[] }) {
  if (item.length === 0) return null;

  return (
    <div role="alert" id={id} className={styles.ringkasan}>
      <p className={styles.ringkasanJudul}>
        {item.length} bagian perlu diperbaiki sebelum lanjut
      </p>
      <ul className={styles.ringkasanList}>
        {item.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </div>
  );
}
