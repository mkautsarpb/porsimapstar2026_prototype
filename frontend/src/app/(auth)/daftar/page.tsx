import type { Metadata } from 'next';
import { DaftarForm } from '@/components/auth/DaftarForm';
import { bacaSimulasi } from '@/lib/api/auth';

export const metadata: Metadata = {
  title: 'Daftar akun',
  description: 'Buat akun peserta PORSIMAPTAR XXVI 2026.',
  robots: { index: false, follow: false },
};

type Query = Record<string, string | readonly string[] | undefined>;

function satu(nilai: string | readonly string[] | undefined): string | undefined {
  return Array.isArray(nilai) ? nilai[0] : (nilai as string | undefined);
}

/** /daftar — pembuatan akun peserta (email + password saja). */
export default async function DaftarPage({ searchParams }: { readonly searchParams: Promise<Query> }) {
  const query = await searchParams;

  return <DaftarForm simulasi={bacaSimulasi(satu(query.simulasi))} />;
}
