import type { Metadata } from 'next';
import { AppShell } from '@/components/app/AppShell';

/** Halaman terautentikasi tidak boleh terindeks (agents.md §8). */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/**
 * Layout area peserta.
 *
 * TODO(api-contract): saat sesi nyata tersedia, layout ini harus memeriksa cookie
 * sesi di server dan me-redirect ke `/masuk?sesi=habis` bila tidak valid.
 * Menyembunyikan menu bukan kontrol keamanan — penegakan tetap di backend
 * (agents.md §0 prinsip 2).
 */
export default function ParticipantLayout({ children }: { readonly children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
