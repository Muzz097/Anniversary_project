# Our Little Story — Anniversary Website

Website interaktif untuk anniversary, dengan konsep:
🌿 kamu (daun) & 🌸 Ailsa (peony).

## Struktur folder

```
anniversary-website/
│
├── index.html
│
├── css/
│   ├── style.css          # semua styling utama (design tokens + tiap section)
│   ├── responsive.css     # breakpoint tablet & mobile (Android jadi prioritas)
│   └── animations.css     # semua @keyframes & animasi reveal per section
│
├── js/
│   ├── app.js              # secret code, transisi antar-section, Phase 05 hub
│   ├── music.js             # placeholder — global audio player (Phase 12)
│   ├── memory-game.js        # Phase 03 (memory match) + transisi ke Phase 04 & 05
│   ├── quiz.js               # placeholder — memory quiz (Phase 08)
│   ├── reasons.js            # placeholder — 29 Reasons (Phase 07)
│   └── journey.js            # placeholder — Our Journey (Phase 11)
│
├── assets/
│   ├── images/
│   │   ├── game/         # gambar kartu memory match (peony, leaf, rose, chocolate, you, ailsa)
│   │   ├── botanical/    # peony.png, leaves.webp, leaf-left.png, leaf-right.png, rose.png
│   │   ├── couple/       # foto kalian (secret_background1, background_shailsa, photo-01..04)
│   │   └── memories/     # untuk Phase 10 nanti (timeline foto)
│   ├── music/            # 3 lagu untuk Phase 12
│   └── fonts/            # font custom kalau mau override Georgia/Arial
│
└── README.md
```

Semua nama file gambar sudah dipakai persis di kode (lihat `<img src="...">` di
`index.html` dan `cardData` di `js/memory-game.js`) — tinggal ditaruh di folder
yang sesuai dengan nama yang sama.

## Progress saat ini

| # | Phase | Status |
|---|-------|--------|
| 01 | Secret Entrance | ✅ selesai |
| 02 | Happy Anniversary | ✅ selesai |
| 03 | Memory Match Game | ✅ selesai |
| 04 | Ketemu Kamu | ✅ selesai |
| 05 | Choose Your Surprise | ✅ selesai (hub + 4 kartu + tracker) |
| 06 | Message (surat) | ⏳ belum — `reasons.js` sudah disiapkan untuk 29 Reasons di dalamnya |
| 07 | 29 Reasons | ⏳ belum |
| 08 | Memory Quiz | ⏳ belum — `quiz.js` sudah disiapkan |
| 09 | 100% Jodoh | ⏳ belum |
| 10 | Our Memories | ⏳ belum |
| 11 | Our Journey | ⏳ belum — `journey.js` sudah disiapkan |
| 12 | Our Playlist | ⏳ belum — `music.js` sudah disiapkan untuk global player |
| 13–16 | Future, Dreams, Ending | ⏳ belum |

## Tentang Phase 05 (baru ditambahkan)

Section `#surpriseHub` di `index.html` menampilkan grid 2×2:
💌 Message · 📸 Memories · 🌱 Journey · 🎵 Playlist.

- Setiap kartu diklik → ditandai "visited" (centang kecil + animasi pulse),
  dan menampilkan catatan singkat di `.surprise-hint`.
- Titik tracker di bawah grid terisi satu per satu.
- Tombol **"But our story doesn't end here →"** baru muncul (fade in) setelah
  keempat kartu pernah dibuka minimal sekali.
- Transisi masuk dari Phase 04 (`ketemuSection`) sudah disambungkan lewat
  `window.goToSurpriseHub()` — dipanggil dari tombol
  *"There's more to our story →"* di `memory-game.js`, mengikuti pola yang
  sama seperti `window.initializeMemoryGame`.
- Tombol continue di Phase 05 saat ini baru `console.log(...)` — sengaja
  dibiarkan sebagai stub, persis seperti pola yang kamu pakai sendiri di
  `ketemuContinue`, supaya gampang disambungkan ke Phase 06 (Message) begitu
  halaman itu dibangun.

Tampilan sudah dioptimasi mobile-first (Android): grid tetap 2×2 di layar
kecil (bukan 1 kolom) supaya masih terasa seperti "4 pintu kecil", teks
`.surprise-sub` otomatis disembunyikan di layar sangat sempit (≤360px), dan
ada penyesuaian khusus untuk viewport pendek (landscape / notch).

## Cara lanjut

Untuk fase berikutnya (Message / 29 Reasons), pola yang paling konsisten
dengan kode yang sudah ada:

1. Tambah `<section id="messageSection" class="hidden-section">` baru di
   `index.html`, setelah `#surpriseHub`.
2. Isi `js/reasons.js` mengikuti struktur yang sudah dikomentari di sana.
3. Di dalam `app.js`, ganti isi `previewNotes.message` handler / tombol kartu
   Message supaya memanggil transisi ke `messageSection` alih-alih hanya
   menampilkan hint teks.
4. Style barunya taruh di `style.css` (dengan komentar section seperti yang
   sudah ada), animasi masuk di `animations.css`, dan aturan mobile di
   `responsive.css` — sama seperti Phase 05 dibangun.

Tidak ada kode lama yang diubah selain satu baris stub di
`ketemuContinue` (dulu `console.log`, sekarang memanggil
`window.goToSurpriseHub()`).
