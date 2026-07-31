# CLAUDE.md — Frontend PORSIMAPTAR XXVI 2026

> Spesifikasi lengkap ada di [`agents.md`](agents.md) — scope, stack, kontrak state UI,
> privasi, aksesibilitas, dan Definition of Done. Baca file itu dulu.
> Berkas ini hanya memuat konvensi yang tidak tercakup di sana.

---

## Konvensi penamaan

**Aturan 1 — nama yang sudah ada di repo menang.** Komponen dan modul baru mengikuti
gaya penamaan tetangganya, bukan gaya dari prompt, dokumen desain, atau kebiasaan
framework. Repo ini memakai Bahasa Indonesia untuk istilah domain (`Widget`,
`FilterGlobal`, `DefinisiMetrik`, `SegeraHadir`, `KekuatanPassword`) dan Inggris hanya
untuk kerangka teknis yang memang tidak punya padanan lazim (`AdminShell`, `AppShell`,
`BottomNav`).

**Aturan 2 — jangan bikin komponen kembar.** Sebelum membuat komponen baru, cari
padanannya lebih dulu. Bila sudah ada yang mengerjakan hal yang sama, **perluas lewat
prop atau varian**, jangan buat berkas kedua dengan nama berbeda. Ini penguat
`agents.md` §3.

Contoh nyata: prompt implementasi Dashboard Panitia meminta berkas bernama Inggris.
Yang dipakai adalah nama repo, bukan nama prompt.

| Diminta di prompt | Dipakai di repo | Alasan |
|---|---|---|
| `MetricWidget.tsx` | `components/admin/Widget.tsx` | sudah ada — kontraknya diperluas |
| `GlobalFilterBar.tsx` | `components/admin/FilterGlobal.tsx` | sudah ada — filternya ditambah |
| `MetricDefinition.tsx` | `components/admin/DefinisiMetrik.tsx` | diekstrak dari `Widget.tsx` |
| `ScopeChip.tsx` | `components/admin/ChipCakupan.tsx` | baru, mengikuti gaya repo |
| `HealthPill.tsx` | `components/admin/PilKesehatan.tsx` | baru, mengikuti gaya repo |
| `AlertTable.tsx` | `components/admin/TabelPeringatan.tsx` | baru, mengikuti gaya repo |
| `lib/admin/filters.ts` | `lib/admin/filter-url.ts` | nama menyebut isinya: serialisasi ke URL |
| `lib/admin/permissions.ts` | `lib/admin/izin.ts` | mengikuti gaya repo |
| `lib/admin/staleness.ts` | `lib/admin/kebasian.ts` | mengikuti gaya repo |
| `app/admin/dashboard/tabs/*` | `components/admin/tabs/*` | komponen tinggal di `src/components/` |

**Aturan 3 — berkas ikut komponennya, primitif boleh bersama.** Satu komponen = satu
`.tsx` + satu `.module.css` bernama sama. Pengecualiannya berkas primitif bersama yang
memang sudah jadi konvensi repo — [`components/app/ui.module.css`](src/components/app/ui.module.css)
dipakai 14 berkas untuk `kartu`, `tombol`, dan sejenisnya. Pola yang lebih disukai untuk
kemiripan struktural antar layar: **bikin komponen bersama**, bukan menyalin CSS-nya.

---

## Design token area admin

Panel Panitia memakai skala beku yang terpisah dari portal publik, didefinisikan di
[`src/styles/tokens.css`](src/styles/tokens.css):

| Kelompok | Token | Nilai |
|---|---|---|
| Tipografi, 8 langkah | `--adm-text-1` … `--adm-text-8` | 44 / 28 / 20 / 16 / 14 / 13 / 12 / 11 px |
| Spasi, grid 4px | `--adm-space-1` … `--adm-space-8` | 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 px |
| Kerapatan `compact` | `--adm-h-control` · `--adm-h-row` · `--adm-h-chip` | 36 / 40 / 28 px |

- `font-size`, `padding`, `margin`, dan `gap` di CSS admin **selalu** lewat token ini.
  Nilai di luar delapan langkah dianggap bug, bukan penyesuaian halus.
- Yang **boleh** tetap literal: lebar border, offset `box-shadow`, dimensi dekoratif
  (avatar, titik status, badge, meter), dan dimensi kerangka layout (lebar sidebar,
  tinggi topbar, lebar kontainer, kolom `grid-template-columns`). Ketiganya ukuran
  satu-satu, bukan anggota skala.
### Radius — keputusan B, 31 Juli 2026

Skala radius **dibekukan ke nilai yang sudah ada di repo**, bukan ke 8/12/16/999 dari
dokumen desain. Beda 1–2px tidak terlihat, tapi menyelaraskannya berarti menggeser 46
pemakaian lintas modul — termasuk landing, auth, dan dashboard peserta yang layarnya
sudah selesai. Aturannya sama dengan warna: beda tipis → pakai token repo.

| Token | Nilai | Untuk |
|---|---|---|
| `--radius-md` | 9px | kontrol kecil, tombol ikon, chip persegi |
| `--radius-lg` | 12px | panel, popover, baris daftar |
| `--radius-xl` | 14px | kartu widget |
| `--radius-pill` | 999px | pil & meter |

- **Jangan menambah lapisan `--adm-radius-*`.** Dua skala radius yang hidup berdampingan
  adalah kondisi yang keputusan ini justru menghindarinya.
- Nilai radius di luar empat token ini dianggap bug di area admin.
- **Utang terbuka:** dokumen desain Claude Design masih menulis 8/12/16/999 dan harus
  menyusul ke angka di atas. Selama belum, 8px dan 16px akan masuk lagi lewat deliverable
  desain berikutnya.
