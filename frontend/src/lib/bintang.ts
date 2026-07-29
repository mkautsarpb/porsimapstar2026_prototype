/**
 * Generator bintang latar — tiga lapisan kedalaman + bintang berkelip langka.
 *
 * Nilainya deterministik (RNG berbasis sinus dengan seed tetap, disalin dari
 * desain sumber) sehingga hasil render di server dan client persis sama —
 * syarat supaya tidak terjadi hydration mismatch.
 */

export interface Bintang {
  readonly x: string;
  readonly y: string;
  readonly size: string;
  readonly min: string;
  readonly max: string;
  readonly mid: string;
  readonly dur: string;
  readonly delay: string;
}

interface OpsiBintang {
  readonly seed: number;
  readonly size: string;
  readonly maxLo: number;
  readonly maxHi: number;
  readonly durLo: number;
  readonly durHi: number;
}

function buatBintang(count: number, cols: number, opt: OpsiBintang): readonly Bintang[] {
  // Grid dilebihkan karena sel di area headline/countdown dilewati.
  const rows = Math.ceil(count / cols) * 2;
  const out: Bintang[] = [];
  let i = 0;

  for (let ry = 0; ry < rows && out.length < count; ry++) {
    for (let cx = 0; cx < cols && out.length < count; cx++) {
      i++;
      const r = (n: number): number => {
        const v = Math.sin((i * 7.13 + opt.seed) * n) * 10000;
        return v - Math.floor(v);
      };

      const x = ((cx + 0.12 + r(12.9898) * 0.76) / cols) * 100;
      const y = ((ry + 0.12 + r(78.233) * 0.76) / rows) * 100;

      // Kosongkan area headline dan blok countdown supaya teks tetap bersih.
      if (x > 18 && x < 82 && y > 8 && y < 78) continue;

      const max = opt.maxLo + r(43.7) * (opt.maxHi - opt.maxLo);
      const min = max * 0.25;

      out.push({
        x: `${x.toFixed(2)}%`,
        y: `${y.toFixed(2)}%`,
        size: opt.size,
        min: min.toFixed(3),
        max: max.toFixed(3),
        mid: ((min + max) / 2).toFixed(3),
        dur: `${(opt.durLo + r(93.21) * (opt.durHi - opt.durLo)).toFixed(2)}s`,
        delay: `-${(r(27.13) * 7).toFixed(2)}s`,
      });
    }
  }

  return out;
}

export const BINTANG_JAUH = buatBintang(24, 6, {
  seed: 3.1,
  size: '1px',
  maxLo: 0.15,
  maxHi: 0.25,
  durLo: 5.5,
  durHi: 7,
});

export const BINTANG_TENGAH = buatBintang(16, 5, {
  seed: 11.7,
  size: '1.5px',
  maxLo: 0.28,
  maxHi: 0.4,
  durLo: 4,
  durHi: 5.5,
});

export const BINTANG_DEKAT = buatBintang(10, 4, {
  seed: 19.3,
  size: '2px',
  maxLo: 0.4,
  maxHi: 0.55,
  durLo: 2.5,
  durHi: 4,
});

export const BINTANG_KELIP = buatBintang(4, 4, {
  seed: 29.9,
  size: '2px',
  maxLo: 0.3,
  maxHi: 0.4,
  durLo: 12,
  durHi: 20,
});
