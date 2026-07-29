# Aset gambar

Semua aset yang dibutuhkan landing page sudah lengkap.

## Struktur

| Path | Isi | Dipakai di |
|---|---|---|
| `porsimaptar-trim.png` | logo, sudah dipangkas + transparan | header, hero, footer |
| `maskot-sm.webp` | maskot berdiri (salinan `maskot/1_stand.webp`) | pojok kanan footer |
| `icon_cabor/*.svg` | 17 piktogram cabang | latar kartu lomba, siluet panel kiri modal |
| `maskot/*.webp` | 17 maskot per cabang | panel kiri modal detail |
| `icons/logo.webp` | logo asli 1092×1092 (sumber) | tidak dirujuk kode — arsip |

## Soal `porsimaptar-trim.png`

Diturunkan dari `icons/logo.webp`. Logo asli bujur sangkar dengan latar putih
solid tanpa alpha; kalau dipakai langsung, filter `brightness(0) invert(1)`
yang membuat logo jadi siluet putih akan mengubah seluruh kotak putih itu jadi
blok putih. Jadi versi ini: latar putih dibuat transparan, lalu dipangkas ke
bounding box logo → 842×464 (rasio 1,815; desain aslinya 1,875).

Kalau logo diganti, ulangi dua langkah itu — atau ekspor langsung dari sumber
vektor dengan latar transparan dan tanpa padding.

## Nama file yang tidak seragam

Dua hal yang gampang bikin bingung, keduanya memang begitu:

- Kartu **Sepak Bola** memakai ikon `icon_cabor/futsal.svg`, tapi maskotnya
  `maskot/sepakbola.webp`.
- `icon_cabor/silat.svg` ada tapi tidak dipakai — belum ada cabang silat di
  daftar 17 cabang.
- Dari pose `maskot/1_stand.webp` … `6_bank.webp`, yang terpakai hanya tiga:
  `1_stand` sebagai maskot footer, lalu `5_fly` dan `6_bank` sebagai dua frame
  maskot terbang di latar. `5_fly` dan `6_bank` dipakai dua kali — sebagai
  gambar berwarna, dan sebagai `mask-image` untuk versi siluet navy-nya.

Pemetaan kode cabang → nama file ada di `src/data/lomba.ts`: field `icon` untuk
piktogram, konstanta `MASKOT_LOMBA` untuk maskot.
