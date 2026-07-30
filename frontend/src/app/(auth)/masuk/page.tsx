import type { Metadata } from 'next';
import { MasukForm } from '@/components/auth/MasukForm';
import { bacaSimulasi } from '@/lib/api/auth';

export const metadata: Metadata = {
  title: 'Masuk',
  description: 'Masuk ke akun peserta PORSIMAPTAR XXVI 2026.',
  robots: { index: false, follow: false },
};

type Query = Record<string, string | readonly string[] | undefined>;

function satu(nilai: string | readonly string[] | undefined): string | undefined {
  return Array.isArray(nilai) ? nilai[0] : (nilai as string | undefined);
}

/**
 * /masuk — halaman login peserta.
 *
 * Query dibaca di server lalu diturunkan sebagai prop, supaya kartu formulir
 * sudah ada di HTML pertama dan tidak menunggu hidrasi (agents.md §8).
 * `?sesi=habis` dipakai middleware/redirect sesi kedaluwarsa; `?simulasi=` hanya
 * untuk pratinjau selama endpoint auth masih mock. Keduanya bukan PII (§6).
 */
export default async function MasukPage({ searchParams }: { readonly searchParams: Promise<Query> }) {
  const query = await searchParams;

  return (
    <MasukForm sesiHabis={satu(query.sesi) === 'habis'} simulasi={bacaSimulasi(satu(query.simulasi))} />
  );
}
