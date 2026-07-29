import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, JetBrains_Mono, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

/**
 * Font strategy (agents.md §8): tiga keluarga font dimuat lewat next/font supaya
 * self-hosted, `display: swap`, dan tidak menambah request ke domain pihak ketiga
 * — sekaligus menghindari CLS dari font yang datang terlambat.
 */
const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-bricolage',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-jetbrains',
  display: 'swap',
});

const JUDUL = 'PORSIMAPTAR XXVI 2026 — Cakrawala';
const DESKRIPSI =
  '17 cabang lomba di Akademi Kepolisian Semarang, 26–30 Oktober 2026. Pendaftaran dibuka untuk mahasiswa, pelajar SMA/sederajat, dan taruna.';

export const metadata: Metadata = {
  title: {
    default: JUDUL,
    template: '%s · PORSIMAPTAR XXVI 2026',
  },
  description: DESKRIPSI,
  applicationName: 'PORSIMAPTAR XXVI 2026',
  keywords: ['PORSIMAPTAR', 'Akpol', 'Cakrawala', 'lomba', 'olahraga', 'seni', '2026', 'Semarang'],
  authors: [{ name: 'Panitia PORSIMAPTAR XXVI' }],
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    siteName: 'PORSIMAPTAR XXVI 2026',
    title: JUDUL,
    description: DESKRIPSI,
  },
  twitter: {
    card: 'summary_large_image',
    title: JUDUL,
    description: DESKRIPSI,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  // Satu-satunya hex literal di luar tokens.css: nilai ini jadi <meta name="theme-color">
  // yang dibaca browser sebelum CSS dimuat, jadi tidak bisa memakai var(--color-navy-900).
  // Kalau navy utama berubah di tokens.css, ubah juga di sini.
  themeColor: '#0C1F45',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <html lang="id" className={`${bricolage.variable} ${jakarta.variable} ${jetbrains.variable}`}>
      <body>{children}</body>
    </html>
  );
}
