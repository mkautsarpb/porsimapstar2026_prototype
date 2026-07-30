import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthPanel } from '@/components/auth/AuthPanel';
import styles from './layout.module.css';

/** Halaman autentikasi tidak boleh terindeks (agents.md §8). */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/**
 * Shell dua kolom untuk semua layar autentikasi: panel brand Cakrawala di kiri,
 * kartu formulir di kanan. Di bawah 900px panel jadi tumpukan atas supaya kartu
 * tetap terbaca di mobile portrait (agents.md §7).
 */
export default function AuthLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <div className={styles.shell}>
      <AuthPanel />

      <main className={styles.main}>
        <div className={styles.column}>
          {children}

          <p className={styles.bantuan}>
            Butuh bantuan? <Link href="/#kontak">Hubungi panitia</Link>.
          </p>
        </div>
      </main>
    </div>
  );
}
