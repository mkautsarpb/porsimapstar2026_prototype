# PORSIMAPTAR XXVI 2026 — Prototype

Portal PORSIMAPTAR XXVI (Pekan Olahraga dan Seni Mahasiswa, Pelajar, dan Taruna
Akademi Kepolisian), 26–30 Oktober 2026 di Akpol Semarang.
Tema: **CAKRAWALA** — "Bersaing dengan Sportivitas, Bersatu dalam Solidaritas."

## Isi repo

```
frontend/    Next.js App Router — satu-satunya kode di repo ini
```

Repo ini **hanya frontend**. Backend (Laravel Octane + PostgreSQL + Redis) ada di
repo terpisah dan tidak boleh disentuh dari sini — batas scope lengkapnya di
[`frontend/agents.md`](./frontend/agents.md).

## Mulai

```bash
cd frontend
npm install
npm run dev     # http://localhost:3000
```

Node 20+. Detail lengkap ada di [`frontend/README.md`](./frontend/README.md).

## Dokumen acuan

Spesifikasi produk tidak disimpan di repo (di-gitignore):

| Dokumen | Isi |
|---|---|
| `SRS_Frontend_NextJS_PORSIMAPTAR_XXVI_2026.docx` v1.0 | sumber kebenaran spesifikasi |
| `User_Flow_dan_User_Journey_PORSIMAPTAR_XXVI_2026.docx` | alur dan perjalanan pengguna |

Desain visual dikerjakan di Claude Design, project **PORSIMAPTAR V2**.

## Status

Landing page publik sudah jadi. Rute lain — pendaftaran, dashboard peserta,
panel panitia, super admin — belum dibuat; daftarnya ada di `agents.md` §2.
