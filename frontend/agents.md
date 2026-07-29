  # AGENTS.md — Frontend PORSIMAPTAR XXVI 2026

> Repo ini **HANYA frontend**. Sumber kebenaran spesifikasi: `SRS_Frontend_NextJS_PORSIMAPTAR_XXVI_2026.docx` v1.0.
> Tema: CAKRAWALA — "Bersaing dengan Sportivitas, Bersatu dalam Solidaritas."

---

## 0. Aturan Scope (BACA DULU, TIDAK BOLEH DILANGGAR)

Agent bekerja **eksklusif di layer presentasi + data-fetching client**. Kalau sebuah task menyentuh hal di kolom kanan, **berhenti dan lapor**, jangan dikerjakan diam-diam.

| ✅ BOLEH dikerjakan | ❌ DI LUAR SCOPE — STOP |
|---|---|
| Next.js App Router, React Server/Client Components | Kode Laravel/PHP, controller, service, job, queue worker |
| TypeScript types & schema validasi (Zod) untuk UI | Migration, model Eloquent, SQL, index DB |
| Styling, design token, layout, animasi | Konfigurasi PostgreSQL, Redis, Octane |
| Fetch layer, cache/query key, error mapping | Desain endpoint baru atas inisiatif sendiri |
| Mock/MSW handler untuk dev & test | Business rule authoritative (eligibility, kuota, roster, hasil match) |
| Test unit/komponen/e2e frontend | Deploy VPS, Nginx, CI runner, DNS, sertifikat |
| Copy/microcopy UI Bahasa Indonesia | Integrasi Google Sheets, cron sync, ClamAV, SMTP |
| Aksesibilitas, SEO metadata, Web Vitals | Skema tabel audit, retensi data, kebijakan backup |

**Tiga prinsip yang tidak bisa dinegosiasikan:**

1. **Backend selalu authoritative.** Validasi client hanya untuk UX. Jangan pernah mengklaim sukses sebelum respons server. Jangan menghitung ulang eligibility/kuota/roster di client sebagai kebenaran — tampilkan apa kata server.
2. **Menyembunyikan tombol bukan kontrol keamanan** (FE-ADMIN-002). UI hide + backend deny. Kalau permission belum jelas, UI tetap hide, tapi catat sebagai OPEN QUESTION.
3. **Kontrak API belum ada ≠ boleh mengarang.** Kalau endpoint/field belum terdefinisi: bikin tipe di `src/types/api/`, bikin MSW handler, tulis `// TODO(api-contract): ...`, lalu laporkan di akhir jawaban. Jangan bikin file backend.

---

## 1. Stack & Batasan Teknis

- Next.js App Router + **TypeScript strict** (`strict: true`, no `any`, no `@ts-ignore` tanpa alasan tertulis).
- Portal publik: Server Components / SSR / ISR untuk SEO. Dashboard: fetching terautentikasi, **tidak diindex**.
- Design system berbasis token: warna Cakrawala (navy → sky → gold), typography, spacing, radius, elevation, status color. **Tidak ada hex hardcode** di komponen.
- Validasi schema di client untuk UX; error message tetap dipetakan dari backend error code.
- Backend context (read-only, jangan disentuh): Laravel Octane + PostgreSQL + Redis, Hostinger VPS, HTTPS.

## 2. Struktur Route

```
src/app/
  (public)/      /  /tentang  /lomba  /lomba/[slug]  /jadwal  /hasil  /sponsor  /faq  /kontak
  (auth)/        /daftar  /verifikasi-email  /masuk  /lupa-password  /reset-password
  (participant)/ /dashboard  /profil  /dokumen  /pendaftaran  /tim  /jadwal-saya
                 /hasil-saya  /qr  /check-in  /notifikasi  /undangan-tim
  (committee)/   /admin/dashboard  /admin/peserta  /admin/verifikasi  /admin/lomba
                 /admin/jadwal  /admin/pertandingan  /admin/check-in  /admin/sponsor
                 /admin/cms  /admin/laporan  /admin/sinkronisasi
  (super-admin)/ /super/users  /super/roles  /super/settings  /super/audit
                 /super/integrations  /super/system-health
```

Route baru di luar daftar ini butuh konfirmasi manusia dulu.

## 3. Komponen Bersama (pakai ulang, jangan bikin duplikat)

- Shell: `AppShell`, `PublicHeader`, `AdminSidebar`, `Breadcrumb`, `CommandSearch`
- Lomba: `CompetitionCard`, `QuotaMeter`, `StatusBadge`, `EligibilityPanel`, `DocumentViewer`
- Data: `DataTable` (server-side), `FilterBar`, `Pagination`, `ExportButton`, `AuditReasonDialog`
- QR: `QRDisplay`, `QRScanner`, `ScanResultPanel`, `CameraPermissionGuide`
- Match: `BracketCanvas`, `MatchCard`, `ResultDialog`, `ScheduleEditor`
- Feedback: `NotificationCenter`, `ConfirmDialog`, `ErrorBoundary`, `EmptyState`, `Skeleton`, `Toast`

Sebelum membuat komponen baru: cek dulu apakah bisa dicapai lewat prop/variant komponen di atas.

## 4. Kontrak State UI (wajib di setiap layar)

Setiap halaman/kartu harus menangani **8 state** ini. PR tanpa salah satunya dianggap belum selesai.

| State | Perilaku wajib |
|---|---|
| Loading | Skeleton mengikuti layout final; tombol mutasi progress + terkunci dari double submit |
| Empty | Jelaskan penyebab + CTA relevan. Bukan layar kosong |
| Validation | Inline per field **plus** summary untuk screen reader; fokus ke error pertama saat submit |
| Unauthorized | Session habis → redirect login. Forbidden → 403 tanpa membocorkan keberadaan resource |
| Conflict | Tampilkan "data sudah berubah", refresh version, minta review ulang. **Jangan overwrite diam-diam** |
| Rate limited | Tampilkan retry time. Jangan retry agresif |
| Offline | Lindungi draft lokal non-sensitif. Mutasi penting **tidak** dianggap sukses sebelum respons server |
| Success | Toast ringkas + state halaman diperbarui; operasi kritis menampilkan nomor referensi |

Semua error support menampilkan **correlation ID**. Error mapping terpusat di satu modul, bukan tersebar di komponen.

## 5. Aturan Validasi Frontend

| Field | Aturan UX |
|---|---|
| Nama | Trim/collapse whitespace; panjang mengikuti API contract |
| NIK | Tepat 16 digit; **dimasking setelah tersimpan**; tidak pernah masuk analytics/console/error tracker |
| Tanggal lahir | Tidak boleh masa depan; hasil eligibility pakai tanggal acuan **dari server** |
| Telepon | Normalisasi +62 + contoh format; canonical ditentukan backend |
| Pendidikan | Enum terkontrol |
| File | Tampilkan ekstensi & ukuran; MIME/checksum/scan final oleh server |
| Tim | Min/max anggota, duplikasi, status invitation tampil **sebelum** submit |
| Hasil match | Pemenang harus salah satu participant; konfirmasi eksplisit sebelum simpan |

## 6. Privasi & Keamanan Browser (FE-PRIV-001)

- Session pakai cookie **HttpOnly + Secure + SameSite**. **Dilarang** menyimpan token di `localStorage`/`sessionStorage`.
- PII **tidak boleh** masuk: URL/query, analytics, `console.log`, error tracker, cache publik, notification preview.
- NIK penuh & dokumen identitas **tidak pernah** dirender di dashboard peserta maupun roster tim.
- Download pakai signed URL berumur pendek; preview dokumen hanya untuk role berwenang.
- CSRF token untuk mutasi session-based; **idempotency key** untuk aksi kritis (create tim, accept invitation, submit pendaftaran, record result).
- Header: CSP, `frame-ancestors`, referrer policy, `nosniff`. Sanitasi semua rich text & file link.
- Export admin: hormati filter, permission, masking, expiry, dan **proteksi formula injection**.

## 7. Aksesibilitas & Responsive

- Semua fungsi keyboard-operable; fokus terlihat; dialog focus-trap + return focus.
- Label eksplisit, error association, `aria-live` untuk hasil scan QR, alt text bermakna, heading berurutan.
- Kontras minimal WCAG AA. **Status tidak boleh hanya mengandalkan warna** — selalu ada ikon/teks.
- Tabel → card/list di mobile bila lebih terbaca; bracket scrollable + overview.
- Scanner: target mobile portrait. Dashboard admin: desktop-first, tetap usable di tablet.
- Hormati `prefers-reduced-motion`. Countdown punya label teks, tidak mengganggu screen reader.

## 8. Kinerja & SEO

- Target p75: **LCP ≤ 2,5 s · INP ≤ 200 ms · CLS ≤ 0,1**.
- Optimasi gambar sponsor, preload terbatas, font strategy, route-level code splitting.
- Publik: metadata, Open Graph, sitemap, robots, canonical, structured data Event/FAQ bila valid.
- Dashboard `noindex`; halaman terautentikasi tidak boleh masuk cache publik.
- Data besar → server pagination atau virtualization. Jangan fetch-all lalu filter di client.

## 9. Modul Tim — Aturan Paling Rawan Bug

**Aturan inti:** pembuat tim otomatis jadi **Ketua**. Ketua **tidak bisa** menjadikan orang anggota aktif secara langsung. Hanya invitation berstatus `accepted` yang dihitung sebagai roster.

Route: `/pendaftaran/tim/buat`, `/tim/[teamId]`, `/tim/[teamId]/review`, `/tim/[teamId]/riwayat`, `/undangan-tim`, `/undangan-tim/[token]`.

State invitation: `pending · accepted · declined · expired · cancelled · conflicted · revoked`.

Perhitungan roster:
- `accepted_count = ketua + membership accepted aktif`
- `pending/declined/expired/cancelled` **tidak dihitung**
- Team ready ⟺ `roster_min ≤ accepted_count ≤ roster_max` **dan** semua accepted member lengkap **dan** tidak ada konflik **dan** deadline aktif
- Copy contoh: "4 dari minimal 5 anggota diterima; 2 undangan masih menunggu; butuh 1 anggota accepted lagi"

Hal yang gampang salah dan harus dijaga:
- Pencarian anggota **bukan direktori publik** — hanya exact match participant code/email, dengan rate limit.
- Ketua **tidak pernah** melihat KTP/dokumen privat anggota. Hanya status lengkap/revisi/verified (FE-TEAM-207).
- CTA perbaikan profil dikirim ke **anggota**, bukan ketua mengedit data anggota.
- Setelah roster lock: nonaktifkan aksi, arahkan ke flow bantuan/override admin (FE-TEAM-208).
- Error khusus yang harus punya handler: `INVITATION_NOT_FOUND` (jangan bocorkan pernah valid atau tidak), `INVITATION_EXPIRED/CANCELLED`, `ALREADY_TEAM_MEMBER`, `TEAM_ROSTER_FULL`, `TEAM_ROSTER_NOT_READY`, `TEAM_ROSTER_LOCKED`, `INVITATION_EMAIL_MISMATCH`, `VERSION_CONFLICT`, `NETWORK_TIMEOUT` (retry pakai idempotency key + cek status terbaru sebelum bilang gagal).

## 10. Dashboard — Aturan Khusus

**Peserta:** urutan Action Required = deadline terdekat → perubahan jadwal → revisi dokumen → kelengkapan umum. QR **tidak** ditampilkan untuk registration draft/rejected/withdrawn/revoked. Peserta multi-lomba → kartu terpisah, status/QR/jadwal/hasil **tidak boleh tertukar** (AC-FE-07). Unread badge berkurang hanya setelah acknowledgement tersimpan.

**Admin:** setiap widget wajib punya **definisi metrik (tooltip)**, `last_updated_at`, **stale state**, filter, dan drill-down (FE-ADASH-002). Widget yang gagal refresh **tidak boleh** menampilkan angka lama seolah realtime (AC-FE-09). Filter disimpan di query URL tanpa data sensitif; filter + pagination tetap terjaga saat balik dari halaman detail (AC-FE-13). Bulk action **tidak** boleh untuk keputusan dokumen massal — bulk assign/filter/export tetap boleh (AC-FE-12).

## 11. Definition of Done

Sebuah task frontend selesai kalau:

- [ ] 8 state UI (§4) ditangani
- [ ] Keyboard smoke test lolos, tidak ada pelanggaran a11y kritis otomatis (AC-FE-05)
- [ ] Tidak ada PII di URL/log/analytics (§6)
- [ ] Double submit → maksimal satu efek (AC-FE-06, AC-TEAM-04)
- [ ] Aksi destruktif punya confirm + impact summary + reason + reference ID (FE-ADMIN-003)
- [ ] TypeScript bersih, tidak ada `any` baru
- [ ] Requirement ID terkait dicantumkan di deskripsi PR
- [ ] Tidak ada file di luar folder frontend yang berubah

## 12. Cara Agent Melapor

Setiap akhir task, tulis ringkas:

```
Selesai: <ringkasan> (ref: FE-XXX-000, AC-FE-00)
File: <daftar file>
Asumsi API: <field/endpoint yang di-mock, kalau ada>
Di luar scope / butuh backend: <daftar, kalau ada>
```

Kalau permintaan user mengharuskan menyentuh backend, jawabannya bukan "tidak bisa" — jawabannya: kerjakan bagian frontend-nya sampai batas mock, lalu tulis dengan jelas kontrak apa yang dibutuhkan dari backend.
