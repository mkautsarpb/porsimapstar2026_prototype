'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { langgananScroll, type KeadaanScroll } from '@/lib/scroll-driver';
import styles from './FlyingMascot.module.css';

/** Lebar minimum supaya lintasan maskot tidak menabrak konten. */
const LEBAR_MIN = 1280;

/**
 * Satu ruas lintasan zigzag.
 * [dari%, sampai%, xAwal vw, yAwal vh, xAkhir vw, yAkhir vh, hadap, sudut, bankAt]
 * `bankAt` = titik progres saat pose berganti ke `6_bank`; nilai negatif berarti
 * pose bank tampil lebih dulu, lalu kembali ke `5_fly`.
 */
type Ruas = readonly [number, number, number, number, number, number, number, number, number];

const OPACITY_DASAR = 0.22;
/** Di area terang maskot ditipiskan supaya tidak mengganggu keterbacaan teks. */
const FAKTOR_TERANG = 0.16 / OPACITY_DASAR;

export function FlyingMascot() {
  const [aktif, setAktif] = useState(false);
  const reduced = useReducedMotion();

  const flightRef = useRef<HTMLDivElement>(null);
  const rotRef = useRef<HTMLDivElement>(null);
  const faceRef = useRef<HTMLDivElement>(null);
  const navyRef = useRef<HTMLDivElement>(null);
  const colorRef = useRef<HTMLDivElement>(null);
  const fillsRef = useRef<HTMLDivElement>(null);
  const poseRefs = useRef<HTMLElement[]>([]);

  const poseSaatIni = useRef(-1);
  const diAreaGelap = useRef<boolean | null>(null);
  const faktorTerang = useRef(1);

  useEffect(() => {
    const cek = (): void => setAktif(window.innerWidth >= LEBAR_MIN && !reduced);
    cek();
    window.addEventListener('resize', cek, { passive: true });
    return () => window.removeEventListener('resize', cek);
  }, [reduced]);

  /**
   * Pindahkan latar section terang ke lapisan `fills`.
   *
   * useLayoutEffect, bukan useEffect: lapisan harus sudah terlukis sebelum latar
   * asli section dilepas, kalau tidak akan ada satu frame navy yang berkedip.
   * Selama maskot tidak aktif (layar sempit / reduced motion), section memakai
   * latarnya sendiri dari CSS — tanpa JS, tanpa kedip.
   */
  useLayoutEffect(() => {
    const fills = fillsRef.current;
    if (!aktif || !fills) return;

    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-fill]'));
    if (sections.length === 0) return;

    const tataLetak = (): void => {
      fills.style.height = `${document.documentElement.scrollHeight}px`;
      sections.forEach((sec, i) => {
        let el = fills.children[i] as HTMLElement | undefined;
        if (!el) {
          el = document.createElement('div');
          el.style.cssText = 'position:absolute;left:0;right:0';
          fills.appendChild(el);
        }
        el.style.top = `${sec.offsetTop}px`;
        el.style.height = `${sec.offsetHeight}px`;
        el.style.background = sec.dataset.fill ?? '';
      });
      sections.forEach((sec) => {
        sec.style.background = 'transparent';
      });
    };

    tataLetak();
    const raf = requestAnimationFrame(tataLetak);
    window.addEventListener('resize', tataLetak, { passive: true });

    const ro = new ResizeObserver(tataLetak);
    ro.observe(document.body);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', tataLetak);
      ro.disconnect();
      // Kembalikan latar CSS section saat maskot dimatikan.
      sections.forEach((sec) => {
        sec.style.background = '';
      });
      fills.replaceChildren();
      fills.style.height = '0px';
    };
  }, [aktif]);

  useEffect(() => {
    const f = flightRef.current;
    if (!aktif || !f) return;

    const gantiPose = (i: number): void => {
      if (poseSaatIni.current === i) return;
      poseSaatIni.current = i;
      poseRefs.current.forEach((el, k) => {
        el.style.opacity = k % 2 === i ? '1' : '0';
      });
    };

    const darkEls = Array.from(document.querySelectorAll<HTMLElement>('[data-dark]'));
    const hero = document.getElementById('atas');

    /*
     * Posisi section di-cache dalam koordinat dokumen. Dulu bagian ini memanggil
     * getBoundingClientRect() tiap frame — pembacaan layout tepat setelah menulis
     * transform, yang memaksa browser menghitung ulang layout di tengah frame.
     * Sekarang batas viewport dihitung aritmetika: offsetTop dikurangi scrollY.
     */
    let batasGelap: ReadonlyArray<{ atas: number; bawah: number }> = [];
    let heroBawah = 0;

    const ukurSection = (): void => {
      batasGelap = darkEls.map((el) => ({ atas: el.offsetTop, bawah: el.offsetTop + el.offsetHeight }));
      heroBawah = hero ? hero.offsetTop + hero.offsetHeight : 0;
    };
    ukurSection();
    window.addEventListener('resize', ukurSection, { passive: true });

    const gambar = ({ y, max, vw, vh }: KeadaanScroll): void => {
      const pct = Math.min(y / max, 1) * 100;

      // Ruas A dan B harus selesai selagi hero masih di layar, jadi batasnya
      // diambil dari tinggi hero yang sebenarnya, bukan persentase tetap.
      const heroEnd = heroBawah > 0 ? (heroBawah / max) * 100 : 16;
      const half = heroEnd / 2;
      const sisa = 100 - heroEnd;
      const c = heroEnd + sisa * 0.4;
      const d = heroEnd + sisa * 0.78;

      const ruas: readonly Ruas[] = [
        [0, half, -16, 8, 116, 34, 1, 12, 0.85],
        [half, heroEnd, 116, 52, -16, 82, -1, -14, -0.25],
        [heroEnd, c, -16, 14, 116, 42, 1, 14, 0.85],
        [c, d, 116, 30, -16, 58, -1, -12, -0.25],
        [d, 100, -16, 24, 116, 50, 1, 13, 0.85],
      ];

      const s = ruas.find((v) => pct < v[1]) ?? ruas[ruas.length - 1];
      if (!s) return;

      const t = Math.min(Math.max((pct - s[0]) / (s[1] - s[0]), 0), 1);
      const lerp = (a: number, b: number, k: number): number => a + (b - a) * k;

      // Ease-out lembut: meluncur, bukan menjatuhkan diri.
      const ty = 1 - Math.pow(1 - t, 1.35);
      // Koordinat maskot relatif viewport; `y` di atas adalah posisi scroll.
      const mx = (lerp(s[2], s[4], t) * vw) / 100;
      const my = (lerp(s[3], s[5], ty) * vh) / 100;
      const bob = Math.sin((performance.now() / 3000) * Math.PI * 2) * 8;

      // Muncul di 10% awal ruas, menghilang di 10% akhir.
      const tepi = t < 0.1 ? t / 0.1 : t > 0.9 ? (1 - t) / 0.1 : 1;
      f.style.transform = `translate3d(${mx.toFixed(1)}px,${(my + bob).toFixed(1)}px,0)`;
      f.style.opacity = (tepi * OPACITY_DASAR * faktorTerang.current).toFixed(3);

      if (rotRef.current) rotRef.current.style.transform = `rotate(${s[7]}deg)`;
      if (faceRef.current) faceRef.current.style.transform = `scaleX(${s[6]})`;

      const bankAt = s[8];
      gantiPose(bankAt < 0 ? (t < -bankAt ? 1 : 0) : t > bankAt ? 1 : 0);

      // Titik tengah maskot sedang di atas pita gelap atau terang?
      // Semua section membentang selebar layar, jadi cukup sumbu Y yang dicek.
      const tengahDokumen = my + bob + vh * 0.09 + y;
      const gelap = batasGelap.some((b) => tengahDokumen >= b.atas && tengahDokumen <= b.bawah);

      if (gelap !== diAreaGelap.current) {
        diAreaGelap.current = gelap;
        if (colorRef.current) colorRef.current.style.opacity = gelap ? '1' : '0';
        if (navyRef.current) navyRef.current.style.opacity = gelap ? '0' : '1';
      }
      faktorTerang.current = gelap ? 1 : FAKTOR_TERANG;
    };

    const berhenti = langgananScroll(gambar);

    return () => {
      window.removeEventListener('resize', ukurSection);
      berhenti();
      f.style.opacity = '0';
    };
  }, [aktif]);

  const simpanPose = (i: number) => (el: HTMLElement | null) => {
    if (el) poseRefs.current[i] = el;
  };

  return (
    <>
      <div aria-hidden="true" ref={fillsRef} className={styles.fills} />

      {aktif ? (
        <div aria-hidden="true" ref={flightRef} className={styles.flight}>
          <div className={styles.bob}>
            <div ref={rotRef} className={styles.rot}>
              <div ref={faceRef} className={styles.face}>
                <div ref={navyRef} className={styles.skinNavy}>
                  <div ref={simpanPose(0)} className={styles.shadeFly} />
                  <div ref={simpanPose(1)} className={styles.shadeBank} />
                </div>
                <div ref={colorRef} className={styles.skinColor}>
                  {/* next/image dilewati di sini: kedua frame di-cross-fade lewat
                      opacity dan perlu kontrol style langsung. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    ref={simpanPose(2)}
                    src="/uploads/maskot/5_fly.webp"
                    alt=""
                    width={503}
                    height={503}
                    decoding="async"
                    className={styles.frameFly}
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    ref={simpanPose(3)}
                    src="/uploads/maskot/6_bank.webp"
                    alt=""
                    width={503}
                    height={503}
                    decoding="async"
                    className={styles.frameBank}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
