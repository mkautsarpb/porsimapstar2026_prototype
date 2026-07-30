'use client';

import { useEffect } from 'react';
import { langgananScroll } from '@/lib/scroll-driver';
import { useReducedMotion } from './useReducedMotion';

/**
 * Menggerakkan elemen yang terikat scroll — langsung ke elemennya.
 *
 * Versi sebelumnya menyiarkan posisi scroll lewat custom property di `<html>`
 * (`--scroll-progress`, `--scroll-y`, `--hero-fade`) dan membiarkan CSS memakainya
 * lewat `var()`. Itu penyebab utama gulir terasa tersendat: custom property
 * bersifat *inherited*, jadi menulisnya di root membatalkan computed style
 * **seluruh dokumen**, bukan cuma elemen yang memakainya. Di halaman ini
 * perbandingannya 9 rule CSS yang memakai variabel itu melawan ~700 elemen yang
 * ikut dihitung ulang — sekitar 10 ms recalc style tiap frame, dari budget 16,7 ms.
 *
 * Yang menentukan biayanya adalah **tempat** penulisan, bukan variabelnya:
 * menghapus dua dari tiga variabel sama sekali tidak menolong, karena satu
 * penulisan yang tersisa tetap membatalkan seluruh pohon. Maka di sini tidak ada
 * variabel yang ditulis ke root sama sekali; tiap elemen ditulis sendiri-sendiri.
 * Terukur: recalc style 10,2 ms → 0,6 ms per frame, main thread 13,6 ms → 3,4 ms.
 *
 * Elemen mendaftar lewat atribut data, jadi komponen tidak perlu saling oper ref:
 *
 * - `data-parallax="-90"`   geser vertikal, satuan px pada progres scroll penuh
 * - `data-parallax-y="0.14"` geser vertikal, kelipatan dari `scrollY` mentah
 * - `data-scroll-bar`        lebar bar progres baca (scaleX 0..1)
 * - `data-hero-fade`         opacity hero yang meredup saat hero digulir lewat
 */

type Jenis = 'parallax' | 'parallaxY' | 'bar' | 'fade';

interface Sasaran {
  readonly el: HTMLElement;
  readonly jenis: Jenis;
  readonly faktor: number;
  /** Nilai terakhir yang benar-benar ditulis; menahan penulisan yang mubazir. */
  terakhir: string;
}

function kumpulkan(reduced: boolean): readonly Sasaran[] {
  const buat = (sel: string, jenis: Jenis, baca: (el: HTMLElement) => number): Sasaran[] =>
    Array.from(document.querySelectorAll<HTMLElement>(sel)).map((el) => ({
      el,
      jenis,
      faktor: baca(el),
      terakhir: '',
    }));

  // Bar progres tetap hidup saat reduced motion: ia indikator posisi, bukan gerak
  // dekoratif. Parallax dan fade hero sebaliknya — keduanya murni gerak.
  const sasaran = buat('[data-scroll-bar]', 'bar', () => 1);
  if (reduced) return sasaran;

  return [
    ...sasaran,
    ...buat('[data-parallax]', 'parallax', (el) => Number(el.dataset.parallax) || 0),
    ...buat('[data-parallax-y]', 'parallaxY', (el) => Number(el.dataset.parallaxY) || 0),
    ...buat('[data-hero-fade]', 'fade', () => 1),
  ];
}

export function useScrollTargets(heroId: string): void {
  const reduced = useReducedMotion();

  useEffect(() => {
    const sasaran = kumpulkan(reduced);
    if (sasaran.length === 0) return;

    // Dicari sekali, bukan tiap frame.
    const hero = document.getElementById(heroId);
    let tinggiHero = hero?.offsetHeight ?? window.innerHeight;

    const perbaruiTinggiHero = (): void => {
      tinggiHero = hero?.offsetHeight ?? window.innerHeight;
    };
    window.addEventListener('resize', perbaruiTinggiHero, { passive: true });

    /*
     * Callback ini hanya menulis, tidak pernah membaca layout — syarat dari
     * `scroll-driver`. Nilai dibulatkan lalu dibandingkan dengan tulisan
     * sebelumnya supaya frame yang tidak mengubah apa pun tidak menyentuh DOM.
     */
    const berhenti = langgananScroll(({ y, progress }) => {
      const fade = (1 - Math.min(y / tinggiHero, 1) * 0.65).toFixed(3);

      for (const s of sasaran) {
        let nilai: string;
        switch (s.jenis) {
          case 'parallax':
            nilai = `translateY(${(progress * s.faktor).toFixed(2)}px)`;
            break;
          case 'parallaxY':
            nilai = `translateY(${(y * s.faktor).toFixed(2)}px)`;
            break;
          case 'bar':
            nilai = `scaleX(${progress.toFixed(4)})`;
            break;
          case 'fade':
            nilai = fade;
            break;
        }

        if (nilai === s.terakhir) continue;
        s.terakhir = nilai;
        if (s.jenis === 'fade') s.el.style.opacity = nilai;
        else s.el.style.transform = nilai;
      }
    });

    return () => {
      window.removeEventListener('resize', perbaruiTinggiHero);
      berhenti();
    };
  }, [heroId, reduced]);
}
