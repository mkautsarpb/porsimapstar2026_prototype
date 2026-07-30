/**
 * QR tiruan untuk prototype: pola deterministik dari satu seed, dirender sebagai
 * data URI SVG.
 *
 * TODO(api-contract): kode asli HARUS datang dari server (`GET /api/v1/me/
 * registrations/{id}/qr`) dengan masa berlaku pendek. Jangan pernah membangun
 * kode check-in di client — yang di sini murni gambar penghias agar tata letak
 * tab QR bisa dinilai.
 */
export function qrPlaceholder(seedTeks: string): string {
  const n = 25;
  const sel = 8;
  const pad = 2;
  const ukuran = (n + pad * 2) * sel;

  let seed = 0;
  for (let i = 0; i < seedTeks.length; i += 1) seed = (seed * 31 + seedTeks.charCodeAt(i)) % 2147483647;
  seed = seed || 20260902;

  const acak = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };

  const diPenanda = (x: number, y: number) =>
    (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9);

  let kotak = '';
  const rect = (x: number, y: number, w: number, h: number) => {
    kotak += `<rect x="${(x + pad) * sel}" y="${(y + pad) * sel}" width="${w * sel}" height="${h * sel}"/>`;
  };

  for (let y = 0; y < n; y += 1) {
    for (let x = 0; x < n; x += 1) {
      if (diPenanda(x, y)) continue;
      if (acak() > 0.52) rect(x, y, 1, 1);
    }
  }

  for (const [x, y] of [
    [0, 0],
    [n - 7, 0],
    [0, n - 7],
  ] as const) {
    rect(x, y, 7, 1);
    rect(x, y + 6, 7, 1);
    rect(x, y + 1, 1, 5);
    rect(x + 6, y + 1, 1, 5);
    rect(x + 2, y + 2, 3, 3);
  }

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${ukuran}" height="${ukuran}" viewBox="0 0 ${ukuran} ${ukuran}">` +
    `<rect width="${ukuran}" height="${ukuran}" fill="#FFFFFF"/><g fill="#0C1F45">${kotak}</g></svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
