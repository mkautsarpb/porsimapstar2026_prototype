import type { PesanNada } from '@/lib/auth-errors';
import styles from './auth.module.css';

const KELAS_NADA: Record<PesanNada, string | undefined> = {
  danger: styles.alertDanger,
  warn: styles.alertWarn,
  info: styles.alertInfo,
};

const GLIF: Record<PesanNada, string> = {
  danger: '!',
  warn: '!',
  info: 'i',
};

interface AlertBannerProps {
  readonly nada: PesanNada;
  readonly judul?: string;
  readonly teks: string;
  /** Hitungan mundur atau info tambahan, mis. "Coba lagi dalam 30 detik". */
  readonly meta?: string;
  /** ID korelasi untuk keperluan support (agents.md §4). */
  readonly correlationId?: string;
  readonly aksi?: { readonly label: string; readonly onClick: () => void };
  /** `alert` untuk kegagalan aksi, `status` untuk info pasif. */
  readonly peran?: 'alert' | 'status';
  /** Banner di dalam kartu formulir butuh jarak atas. */
  readonly diForm?: boolean;
}

/**
 * Banner status/error. Nada tidak pernah disampaikan hanya lewat warna — selalu
 * ada glif dan teks (agents.md §7).
 */
export function AlertBanner({
  nada,
  judul,
  teks,
  meta,
  correlationId,
  aksi,
  peran = 'alert',
  diForm = false,
}: AlertBannerProps) {
  return (
    <div
      role={peran}
      className={`${styles.alert} ${KELAS_NADA[nada]} ${diForm ? styles.alertDiForm : ''}`}
    >
      <span aria-hidden="true" className={styles.alertIkon}>
        {GLIF[nada]}
      </span>

      <div className={styles.alertIsi}>
        {judul ? <p className={styles.alertJudul}>{judul}</p> : null}
        <p className={judul ? styles.alertTeks : styles.alertTeksSolo}>{teks}</p>
        {meta ? <p className={styles.alertMeta}>{meta}</p> : null}
        {correlationId ? <p className={styles.alertKorelasi}>Kode rujukan: {correlationId}</p> : null}

        {aksi ? (
          <button
            type="button"
            onClick={aksi.onClick}
            className={`${styles.tombolSekunder} ${styles.alertAksi}`}
          >
            {aksi.label}
          </button>
        ) : null}
      </div>
    </div>
  );
}
