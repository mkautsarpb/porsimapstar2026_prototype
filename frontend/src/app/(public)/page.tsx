import type { Metadata } from 'next';
import { AboutSection } from '@/components/landing/AboutSection';
import { AuroraBackground } from '@/components/landing/AuroraBackground';
import { CompetitionSection } from '@/components/landing/CompetitionSection';
import { EventsSection } from '@/components/landing/EventsSection';
import { FaqSection } from '@/components/landing/FaqSection';
import { FlyingMascot } from '@/components/landing/FlyingMascot';
import { Hero } from '@/components/landing/Hero';
import { HowToSection } from '@/components/landing/HowToSection';
import { ScrollEffects } from '@/components/landing/ScrollEffects';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { SiteHeader } from '@/components/landing/SiteHeader';
import { SponsorsSection } from '@/components/landing/SponsorsSection';
import { StatsStrip } from '@/components/landing/StatsStrip';
import { TimelineSection } from '@/components/landing/TimelineSection';
import { FAQS } from '@/data/konten';
import { LOKASI_ACARA } from '@/data/jadwal';
import styles from './page.module.css';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

/**
 * Structured data Event + FAQ (agents.md §8). Ditulis di server supaya ikut
 * terkirim di HTML awal dan bisa dibaca crawler tanpa menjalankan JS.
 */
function StructuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Event',
        name: 'PORSIMAPTAR XXVI 2026 — Cakrawala',
        description:
          'Pekan Olahraga dan Seni Mahasiswa, Pelajar, dan Taruna Akademi Kepolisian ke-XXVI dengan 17 cabang lomba.',
        startDate: '2026-10-26T07:00:00+07:00',
        endDate: '2026-10-30T22:00:00+07:00',
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        location: {
          '@type': 'Place',
          name: 'Akademi Kepolisian',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Jl. Sultan Agung',
            addressLocality: 'Semarang',
            postalCode: '50232',
            addressCountry: 'ID',
          },
        },
        organizer: { '@type': 'Organization', name: 'Panitia PORSIMAPTAR XXVI' },
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQS.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

/**
 * Landing page publik PORSIMAPTAR XXVI 2026.
 *
 * Halaman ini Server Component; hanya bagian yang benar-benar interaktif
 * (countdown, tab + modal lomba, akordeon FAQ, efek scroll, aurora) yang
 * dikirim sebagai client bundle — supaya konten utama tetap terindeks dan LCP
 * tidak menunggu hidrasi (agents.md §1 dan §8).
 */
export default function LandingPage() {
  return (
    <>
      <StructuredData />
      <ScrollEffects />

      <div className={styles.shell} aria-label={`PORSIMAPTAR XXVI 2026 di ${LOKASI_ACARA}`}>
        <AuroraBackground />
        <SiteHeader />
        {/* Urutan DOM menentukan tumpukan: aurora → latar section → maskot → isi section. */}
        <FlyingMascot />

        <main>
          <Hero />
          <StatsStrip />
          <AboutSection />
          <CompetitionSection />
          <EventsSection />
          <TimelineSection />
          <HowToSection />
          <SponsorsSection />
          <FaqSection />
        </main>

        <SiteFooter />
      </div>
    </>
  );
}
