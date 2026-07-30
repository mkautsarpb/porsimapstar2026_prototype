import styles from './auth.module.css';

function IkonMata({ tampil }: { readonly tampil: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {tampil ? (
        <>
          <path d="M3 3l18 18" />
          <path d="M10.6 5.2A9.7 9.7 0 0 1 12 5.1c5 0 9 6.9 9 6.9a17 17 0 0 1-2.3 3.1M6.3 7.3C3.9 9 2.9 12 2.9 12s4 6.9 9 6.9a8.6 8.6 0 0 0 4-1" />
          <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
        </>
      ) : (
        <>
          <path d="M2.9 12S6.9 5.1 12 5.1S21 12 21 12s-4 6.9-9 6.9S2.9 12 2.9 12Z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
    </svg>
  );
}

/** Tombol lihat/sembunyikan password. Status disampaikan lewat `aria-pressed` + label. */
export function TombolMata({
  tampil,
  onToggle,
}: {
  readonly tampil: boolean;
  readonly onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={tampil}
      aria-label={tampil ? 'Sembunyikan password' : 'Tampilkan password'}
      className={styles.tombolMata}
    >
      <IkonMata tampil={tampil} />
    </button>
  );
}
