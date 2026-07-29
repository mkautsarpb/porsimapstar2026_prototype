# Frontend PORSIMAPTAR XXVI 2026 — Cakrawala

Portal publik PORSIMAPTAR XXVI. Repo ini **hanya frontend**; aturan kerja dan
batas scope ada di [`agents.md`](./agents.md).

## Jalankan

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
npm run start      # jalankan hasil build (harus `build` dulu)
npm run typecheck  # tsc --noEmit, strict
npm run lint
```

Node 20+ (lihat `engines` di `package.json`).

> Untuk menilai kehalusan animasi dan scroll, pakai `npm run build && npm run start`.
> Mode `dev` membawa React development build dan HMR, jadi selalu terasa lebih berat.

## Yang sudah ada

Landing page publik (`/`), diporting dari desain **PORSIMAPTAR Landing** di
Claude Design. Section: hero + countdown, strip angka, tentang, 17 cabang lomba
dengan tab & modal detail, rangkaian acara, linimasa, cara mendaftar, sponsor,
tanya jawab, footer.

## Struktur

```
src/
  app/
    layout.tsx          font, metadata, Open Graph
    globals.css         reset + import token
    icon.png            favicon — dikenali otomatis oleh Next.js
    apple-icon.png      ikon layar utama iOS
    (public)/page.tsx   landing page + structured data Event/FAQ
  components/landing/   satu komponen per section (+ CSS module)
  data/                 seluruh konten statis
  lib/
    kuota.ts            turunan status & label kuota
    countdown.ts        fase jadwal yang sedang dihitung mundur
    bintang.ts          generator bintang latar (deterministik)
    scroll-driver.ts    satu-satunya loop scroll — lihat "Kinerja scroll"
  hooks/                reduced-motion, scroll metrics, reveal
  styles/
    tokens.css          design token Cakrawala
    animations.css      keyframes
  types/landing.ts      tipe konten
public/uploads/         logo, ikon cabang, maskot — lihat README di dalamnya
```

## Aturan yang dijaga di kode ini

- **Tidak ada hex hardcode di komponen.** Semua warna lewat `var(--color-*)` di
  `src/styles/tokens.css` (agents.md §1). Satu pengecualian yang diberi catatan:
  `themeColor` di `layout.tsx`, karena dibaca browser sebelum CSS dimuat.
- **Server Component sebagai default.** Yang jadi client hanya yang benar-benar
  interaktif: countdown, tab + modal lomba, akordeon FAQ, efek scroll, aurora,
  maskot terbang.
- **Status tidak mengandalkan warna saja** — tiap badge kuota punya titik + teks,
  dan meter "penuh" pakai pola garis, bukan cuma abu-abu (agents.md §7).
- **`prefers-reduced-motion` dihormati** di seluruh animasi.
- **Fokus dikelola di modal**: fokus pindah ke judul saat terbuka, di-trap selama
  terbuka, dan kembali ke kartu pemicu saat ditutup.

## Kinerja scroll

Halaman ini punya banyak efek berbasis scroll, jadi ada satu aturan yang tidak
boleh dilanggar.

**Semua pembacaan layout terjadi sekali per frame di [`lib/scroll-driver.ts`](./src/lib/scroll-driver.ts).**
Kalau butuh posisi scroll, berlangganan ke situ — jangan bikin listener `scroll`
sendiri:

```ts
const berhenti = langgananScroll(({ y, progress, vw, vh }) => {
  el.style.transform = `translateY(${y * 0.1}px)`; // hanya menulis
});
```

Di dalam callback **dilarang membaca layout** (`getBoundingClientRect`,
`offsetTop`, `scrollHeight`, `getComputedStyle`). Membaca setelah menulis memaksa
browser menghitung ulang layout di tengah frame, dan gulir langsung tersendat.
Kalau butuh posisi elemen, cache di luar callback dan perbarui saat `resize`.

Hal lain yang sengaja diatur demi kinerja:

- Aurora ikut `visibility: hidden` saat berada di area terang, bukan cuma
  `opacity: 0`. Tiga blob di dalamnya memakai `filter: blur(100–120px)` yang
  tetap dirasterisasi ulang tiap frame kalau hanya dibuat transparan.
- Lapisan yang bergerak parallax diberi `will-change: transform` supaya
  dikompositkan terpisah.
- Efek terberat dimatikan di layar sempit: dua dari tiga blob, tiga lapis
  bintang, meteor, dan maskot terbang.

Kalau scroll masih terasa berat di perangkat tertentu, tersangka pertama adalah
`backdrop-filter: blur(14px)` pada header sticky dan radius blur blob aurora —
keduanya bisa diturunkan tanpa mengubah komposisi desain.

## Favicon

`src/app/icon.png` dan `src/app/apple-icon.png` dikenali Next.js otomatis — tidak
perlu tag `<link>` manual di `layout.tsx`.

Keduanya diturunkan dari emblem logo (obor, padi, burung), **bukan** logo utuh:
tulisan "PORSIMAPTAR" jadi bubur di bawah 32px. Emblem ditaruh di atas kotak
navy membulat supaya batasnya tetap jelas di tab browser bertema gelap maupun
terang — versi tanpa latar kehilangan bagian burung navy-nya di tema gelap.

`apple-icon.png` sengaja bersudut siku dan berlatar penuh: iOS memberi
pembulatan sendiri, dan area transparan akan dijadikan hitam olehnya.

Kalau logo diganti, keduanya perlu dibuat ulang. Yang gampang terlewat: emblem
harus **diperbesar** mengisi kanvas — `Image.thumbnail()` di PIL hanya
mengecilkan, tidak pernah memperbesar, sehingga hasilnya akan tampak mungil di
tengah kanvas.

## Maskot terbang

`FlyingMascot.tsx` menerbangkan maskot zigzag di latar mengikuti scroll. Aktif
hanya di layar ≥1280px dan saat `prefers-reduced-motion` tidak menyala.

Cara kerjanya perlu diketahui sebelum mengubah latar section:

- Maskot ada di **z-index 0**, artinya di belakang section (`z-index: 1`). Supaya
  ia terlihat melintasi section terang, latar section itu harus transparan dan
  warnanya dilukis lapisan terpisah (`.fills`) yang berada di belakang maskot.
- Selama maskot **tidak** aktif, section memakai latarnya sendiri dari CSS —
  tanpa JS dan tanpa kedip. Saat maskot aktif, `useLayoutEffect` melukis lapisan
  `.fills` lebih dulu, baru melepas latar asli section.
- Karena itu tiap section terang wajib punya atribut `data-fill` berisi warnanya,
  selain class latar biasa. Menghapus salah satunya akan merusak yang lain.
- Maskot berganti "kulit" otomatis: gambar berwarna saat titik tengahnya berada
  di atas section `data-dark`, siluet navy (via CSS mask) saat di atas area
  terang, sekalian ditipiskan supaya teks tetap terbaca.

## Yang belum & catatan

- **Seluruh data masih statis** di `src/data/`. Angka kuota, detail teknis, syarat,
  dokumen, dan PIC ditandai `DATA SEMENTARA` karena juknis panitia belum turun.
  Titik integrasi backend ditandai `TODO(api-contract)`.
- **Countdown memakai jam perangkat.** Untuk produksi, waktu acuan harus dari
  server supaya tidak bisa digeser lewat jam lokal.
- **Hanya tab aktif yang dirender.** Ini mengikuti desain sumber, tapi berarti di
  HTML awal cuma 8 cabang Olahraga yang terlihat crawler. Kalau semua 17 cabang
  perlu terindeks, render semua grup lalu sembunyikan yang non-aktif via CSS.
- **`porsimaptar-trim.png` 218KB** — kebesaran untuk sebuah logo, hasil konversi
  dari webp ke PNG. Layak dikompres ulang atau dijadikan webp bertransparansi.
- **Sponsor masih kotak warna**, bukan logo asli.
- Rute lain di agents.md §2 (auth, dashboard peserta, admin) belum dibuat.
