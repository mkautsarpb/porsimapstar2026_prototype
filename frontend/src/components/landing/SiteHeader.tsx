import Image from 'next/image';
import styles from './SiteHeader.module.css';

const MENU = [
  { href: '#tentang', label: 'Tentang' },
  { href: '#lomba', label: 'Cabang lomba' },
  { href: '#jadwal', label: 'Jadwal' },
  { href: '#cara', label: 'Cara daftar' },
  { href: '#tanya', label: 'Tanya jawab' },
] as const;

/**
 * Header sticky. Murni Server Component — tidak ada state, jadi tidak perlu
 * dikirim ke bundle client.
 */
export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a href="#atas" className={styles.brand}>
          <Image
            src="/uploads/porsimaptar-trim.png"
            alt="Logo PORSIMAPTAR 2026"
            width={60}
            height={32}
            priority
            className={styles.logo}
          />
          <span className={styles.edition}>XXVI / 2026</span>
        </a>

        <nav aria-label="Navigasi utama" className={styles.nav}>
          {MENU.map((m) => (
            <a key={m.href} href={m.href} className={styles.link}>
              {m.label}
            </a>
          ))}
          <a href="#daftar" className={styles.cta}>
            Buat akun
          </a>
        </nav>
      </div>
    </header>
  );
}
