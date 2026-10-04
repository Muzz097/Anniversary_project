/* ==========================================
   DM INTRO — KONFIGURASI
   Semua yang sering kamu ganti ada di sini.
   Tidak perlu menyentuh dm-intro.js.
========================================== */

window.DM_INTRO_CONFIG = {

    /* Header chat */
    contact: {
        name: "Ailsa",
        status: "active now",
        typingLabel: "typing...",

        /* Foto avatar lokal. Kalau file tidak ada,
           otomatis tampil lingkaran dengan inisial. */
        avatar: "assets/images/game/ailsa.jpeg",
        fallbackInitial: "A"
    },

    /*
       Pesan ditampilkan berurutan.
       side      : "right" | "left"  (bubble masuk dari sisi ini)
       important : true -> sparkle kecil saat muncul
       Pesan TERAKHIR otomatis jadi pesan final
       (glow -> bubble berubah jadi partikel hati -> Secret Code).
       time      : opsional, mis. "21.24". Kosong = jam saat ini.
    */
    messages: [
        { text: "Hey, Ailsa...",                                side: "right", important: false },
        { text: "Aku punya sesuatu untuk kamu.",                side: "left",  important: true  },
        { text: "Sesuatu yang berisi cerita tentang kita.",     side: "right", important: true  },
        { text: "Masukkan secret code kita untuk memulainya.",  side: "left",  important: true  }
    ],

    /* Placeholder di bar input palsu (tidak bisa diketik) */
    inputPlaceholder: "Pesan sementara...",

    /* Durasi dalam milidetik */
    timing: {
        startDelay: 900,      /* jeda sebelum pesan pertama */
        typingMin: 800,       /* lama indikator typing... */
        typingMax: 1200,
        pauseMin: 600,        /* jeda setelah bubble muncul */
        pauseMax: 1000,
        finalGlow: 1000,      /* bubble terakhir glow + membesar */
        finalBurst: 1300,     /* bubble berubah jadi partikel hati */
        fadeOut: 1000         /* chat fade-out / Secret Code scale-in */
    },

    /* Teks panel Secret Code (menggantikan teks lama di halaman itu).
       Set `enabled: false` kalau mau teks asli Secret Code dibiarkan.
       submitLabel: null = label tombol asli ("Enter") tidak diubah. */
    secretPanel: {
        enabled: true,
        eyebrow: "OUR LITTLE SECRET",
        description: "Enter the code to begin our story.",
        submitLabel: null
    },

    /* Jumlah partikel latar (kurangi kalau terasa berat) */
    particles: {
        glowHearts: 4,
        loveHearts: 12,
        sparkles: 14,
        bokeh: 5
    }
};