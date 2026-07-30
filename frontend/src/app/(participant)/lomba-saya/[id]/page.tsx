import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Ikon } from '@/components/app/Ikon';
import { StatusBadge } from '@/components/app/StatusBadge';
import { TabDokumen } from '@/components/lomba/TabDokumen';
import { TabJadwal } from '@/components/lomba/TabJadwal';
import { TabQr } from '@/components/lomba/TabQr';
import { TabRingkasan } from '@/components/lomba/TabRingkasan';
import { TabRiwayat } from '@/components/lomba/TabRiwayat';
import { TabTim } from '@/components/lomba/TabTim';
import { detailLomba } from '@/data/lomba-detail';
import { cariLomba } from '@/data/peserta';
import ui from '@/components/app/ui.module.css';
import styles from './page.module.css';

type Query = Record<string, string | readonly string[] | undefined>;
type Params = { readonly id: string };

function satu(nilai: string | readonly string[] | undefined): string | undefined {
  return Array.isArray(nilai) ? nilai[0] : (nilai as string | undefined);
}

export async function generateMetadata({ params }: { readonly params: Promise<Params> }): Promise<Metadata> {
  const { id } = await params;
  const lomba = cariLomba(id);

  return {
    title: lomba ? lomba.nama : 'Detail lomba',
    robots: { index: false, follow: false },
  };
}

const TAB = [
  { id: 'ringkasan', label: 'Ringkasan' },
  { id: 'jadwal', label: 'Jadwal' },
  { id: 'tim', label: 'Tim' },
  { id: 'qr', label: 'QR & check-in' },
  { id: 'dokumen', label: 'Dokumen' },
  { id: 'riwayat', label: 'Riwayat' },
] as const;

type IdTab = (typeof TAB)[number]['id'];

/**
 * /lomba-saya/[id] — detail satu pendaftaran.
 *
 * Tab aktif ada di query URL (`?tab=jadwal`) supaya bisa ditautkan langsung dari
 * dashboard dan notifikasi, dan tetap utuh saat halaman dimuat ulang. Karena itu
 * halaman ini Server Component; tabnya tautan biasa, bukan state komponen.
 */
export default async function DetailLombaPage({
  params,
  searchParams,
}: {
  readonly params: Promise<Params>;
  readonly searchParams: Promise<Query>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const lomba = cariLomba(id);

  if (!lomba) notFound();

  const detail = detailLomba(id);
  const daftarTab = TAB.filter((t) => t.id !== 'tim' || lomba.tipe === 'Tim');
  const diminta = satu(query.tab) as IdTab | undefined;
  const tab: IdTab = daftarTab.some((t) => t.id === diminta) && diminta ? diminta : 'ringkasan';

  return (
    <div className={styles.halaman}>
      <nav aria-label="Remah roti" className={styles.remah}>
        <Link href="/lomba-saya">Lomba saya</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{lomba.nama}</span>
      </nav>

      <header className={`${ui.kartu} ${styles.kepala}`}>
        <Image
          src={`/uploads/icon_cabor/${lomba.ikon}.svg`}
          alt=""
          width={56}
          height={56}
          className={styles.ikon}
        />

        <div className={styles.identitas}>
          <h1 className={styles.judul}>{lomba.nama}</h1>
          <p className={styles.meta}>
            {lomba.kategori} · {lomba.tipe === 'Tim' ? 'Lomba tim' : 'Perorangan'}
            {lomba.peran ? ` · ${lomba.peran}` : ''} · Ref {lomba.nomorReferensi}
          </p>
          <p className={styles.arti}>{lomba.artiStatus}</p>
        </div>

        <div className={styles.kepalaKanan}>
          <StatusBadge status={lomba.status} besar />
          {lomba.tenggat ? (
            <p className={styles.tenggat}>
              <Ikon nama="jam" ukuran={16} tebal={2} />
              {lomba.tenggat}
            </p>
          ) : null}
        </div>
      </header>

      <div role="tablist" aria-label="Bagian detail lomba" className={styles.tab}>
        {daftarTab.map((t) => (
          <Link
            key={t.id}
            href={t.id === 'ringkasan' ? `/lomba-saya/${id}` : `/lomba-saya/${id}?tab=${t.id}`}
            role="tab"
            aria-selected={tab === t.id}
            data-aktif={tab === t.id}
            className={styles.tabItem}
          >
            {t.label}
          </Link>
        ))}
      </div>

      <div className={styles.isi}>
        {tab === 'ringkasan' ? <TabRingkasan lomba={lomba} detail={detail} /> : null}
        {tab === 'jadwal' ? <TabJadwal jadwal={detail.jadwal} /> : null}
        {tab === 'tim' && detail.tim ? <TabTim tim={detail.tim} /> : null}
        {tab === 'tim' && !detail.tim ? (
          <p className={styles.kosong}>Data tim untuk pendaftaran ini belum tersedia.</p>
        ) : null}
        {tab === 'qr' ? <TabQr lomba={lomba} qr={detail.qr} /> : null}
        {tab === 'dokumen' ? <TabDokumen berkas={detail.berkas} lombaId={id} /> : null}
        {tab === 'riwayat' ? <TabRiwayat jejak={detail.jejak} /> : null}
      </div>
    </div>
  );
}
