/* ==========================================
   PHASE 14 — OUR FUTURE (halaman terakhir)
   Self-contained: membangun section-nya sendiri,
   tidak mengubah menu / audio / progress yang ada.
   Entry point: window.goToOurFuture()
========================================== */

/* ---------- KONFIGURASI (ganti di sini) ---------- */

const FUTURE_IMG = "assets/images/future/";      // wish-01.jpg ... wish-31.jpg (opsional)
const FUTURE_BOT = "assets/images/botanical/";

const futureSettings = {
    typeDelay: 18,        // ms per huruf (deskripsi wish)
    letterDelay: 24,      // ms per huruf (surat)
    paragraphPause: 600,  // jeda antar paragraf
    gardenEvery: 4,       // tambah tanaman baru tiap N wish
    cardLock: 750         // ms kartu terkunci saat animasi
};

// w(kategori, judul, deskripsi) -> nomor, gambar, dekorasi dibuat otomatis.
// SEMUA ISI DI BAWAH ADALAH CONTOH — ganti dengan impian kalian.
// Gambar opsional: wish-01.jpg dst. Kalau tidak ada, kartu tampil tanpa foto.
const w = (category, title, description, decoration) => ({
    category, title, description, decoration
});

const wishList = [
    w("PLACE", "Lihat aurora bareng", "Berdiri berdampingan, kedinginan, tapi tidak mau pulang."),
    w("PLACE", "Jalan-jalan di Jepang", "Musim bunga sakura, tangan kita tetap saling menggenggam."),
    w("PLACE", "Sunrise di gunung", "Menunggu matahari naik sambil berbagi satu selimut."),
    w("PLACE", "Piknik di tepi danau", "Tanpa jadwal, hanya kita dan bekal sederhana."),
    w("PLACE", "Keliling Eropa", "Satu kota, satu polaroid, satu cerita."),
    w("PLACE", "Kembali ke tempat pertama kita", "Melihat seberapa jauh kita sudah tumbuh."),
    w("EXPERIENCE", "Nonton konser favorit", "Menyanyi sampai suara habis, bersebelahan."),
    w("EXPERIENCE", "Naik balon udara", "Melihat dunia kecil dari atas, berdua."),
    w("EXPERIENCE", "Masak bareng sampai berantakan", "Dapur kacau, tawa keras, perut kenyang."),
    w("EXPERIENCE", "Camping di bawah bintang", "Menghitung bintang sampai salah satu dari kita tertidur."),
    w("EXPERIENCE", "Road trip tanpa tujuan", "Playlist kita, jendela terbuka, jalan panjang."),
    w("EXPERIENCE", "Belajar hal baru berdua", "Entah menari, melukis, atau berenang."),
    w("ACHIEVEMENT", "Merayakan wisudamu", "Aku di barisan depan, bangga sampai menangis."),
    w("ACHIEVEMENT", "Karier besar pertamamu", "Pesta kecil hanya untuk kita berdua."),
    w("ACHIEVEMENT", "Tabungan bersama untuk mimpi kita", "Sedikit demi sedikit, sampai penuh."),
    w("ACHIEVEMENT", "Melewati tantangan terbesar", "Lalu menoleh dan tersenyum: kita bisa."),
    w("SMALL THING", "Sarapan santai tiap Minggu", "Tanpa terburu-buru, kopi dan cerita."),
    w("SMALL THING", "Satu polaroid tiap bulan", "Supaya waktu tidak berlalu tanpa jejak."),
    w("SMALL THING", "Surat kecil di tempat tak terduga", "Di tas, di saku jaket, di cermin."),
    w("SMALL THING", "Nonton film sambil selimutan", "Film boleh apa saja, asal denganmu."),
    w("SMALL THING", "Jalan sore tanpa HP", "Hanya langit, jalanan, dan kamu."),
    w("HOME", "Rumah dengan taman kecil", "Tempat peony dan daun tumbuh bersama."),
    w("HOME", "Dapur yang selalu hangat", "Wangi masakan dan lampu kuning."),
    w("HOME", "Rak buku dan sudut baca", "Dua kursi, satu meja kecil."),
    w("HOME", "Peony di jendela", "Supaya setiap pagi terasa seperti kamu."),
    w("PROMISE", "Selalu mendengarkan sampai selesai", "Bahkan di hari ketika kata-kata berantakan."),
    w("PROMISE", "Saling mendukung di hari berat", "Kamu tidak pernah berjalan sendirian."),
    w("PROMISE", "Tidak tidur dalam keadaan marah", "Selesaikan dulu, peluk setelahnya."),
    w("PROMISE", "Terus belajar jadi lebih baik", "Untuk diriku, untukmu, untuk kita."),
    w("PROMISE", "Tetap jadi daun di sampingmu", "Di setiap musim yang akan datang."),
    w("PLACE", "Anniversary ke-10 di tempat spesial", "Dan masih saling jatuh cinta.")
].map((item, i) => ({
    number: i + 1,
    image: `${FUTURE_IMG}wish-${String(i + 1).padStart(2, "0")}.jpg`,
    ...item,
    decoration: item.decoration || (i % 2 === 0 ? "flower" : "leaf")
}));

const futureLetter = {
    dateStamp: "31.08.2026",
    photo: "assets/images/couple/photo-02.jpeg",
    greeting: "Dear future us,",
    paragraphs: [
        "[Tulis harapan untuk masa depan kami.]",
        "[Tulis hal yang ingin kami jaga.]",
        "[Tulis janji yang ingin saya tepati.]"
    ],
    signature: "— Always your leaf"
};

// Scrapbook collage di hero. Ganti src / caption / date sesuai foto kalian.
// slot: "tl" kiri-atas, "tr" kanan-atas, "br" kanan-bawah. Foto yang tidak ditemukan
// otomatis diganti kartu placeholder, jadi layout tidak pernah rusak.
const futureCollage = {
    tapeLabel: "FROM THEN<br>TO WHAT COMES NEXT",
    main:  { src: "assets/images/couple/photo-01.jpeg", caption: "still growing", date: "31.08.2025" },
    small: [
        { src: "assets/images/couple/photo-02.jpeg", caption: "where we began",    slot: "tl" },
        { src: "assets/images/couple/photo-03.jpeg", caption: "the little things", slot: "tr" },
        { src: "assets/images/couple/photo-04.jpeg", caption: "today, with you",   slot: "br", date: "31.08.2026" }
    ],
    notes: ["we started here", "and somehow, we’re still growing", "more memories to come"],
    miniNote: "to be continued,<br>always."
};

const futureFinale = {
    dreams: ["31 dreams.", "One future.", "Still us."],
    title: "THE FUTURE IS OURS TO WRITE",
    lines: [
        "I may not know exactly what the future<br>will look like, but I know who I want<br>beside me when we find out."
    ],
    photo: "assets/images/couple/photo-04.jpeg",   // foto kecil simbol masa depan
    photoCaption: "the next chapter"
};

// Bunga interaktif di finale. Ganti src / caption sesuai foto kalian.
// Contoh di bawah memakai foto couple yang sudah ada; taruh foto baru di
// assets/images/future/ (mis. dream-01.jpg) lalu ubah path-nya di sini.
// Maksimal 5 foto per bunga. Foto yang tidak ditemukan diganti kartu placeholder.
const flowerMemories = {
    biggestDreams: {
        label: "Our Biggest Dreams",
        photos: [
            { src: "assets/images/couple/photo-01.jpeg", caption: "one day, here" },
            { src: "assets/images/couple/photo-02.jpeg", caption: "our little adventure" },
            { src: "assets/images/couple/photo-03.jpeg", caption: "still choosing you" },
            { src: "assets/images/couple/photo-04.jpeg", caption: "more mornings together" }
        ]
    },
    littleThings: {
        label: "Little Things Together",
        photos: [
            { src: "assets/images/couple/photo-02.jpeg", caption: "more mornings together" },
            { src: "assets/images/couple/photo-03.jpeg", caption: "the small things" },
            { src: "assets/images/couple/photo-04.jpeg", caption: "just us, always" }
        ]
    },
    placesToGo: {
        label: "Places We’ll Go",
        photos: [
            { src: "assets/images/couple/photo-03.jpeg", caption: "our little adventure" },
            { src: "assets/images/couple/photo-01.jpeg", caption: "one day, here" },
            { src: "assets/images/couple/photo-04.jpeg", caption: "next stop: anywhere" }
        ]
    }
};

// Daun interaktif (hanya dua): daun 1 -> teks, daun 2 -> foto kecil + caption
const leafInteraction = {
    leafText: "Still growing together.",
    leafPhoto: { src: "assets/images/couple/photo-02.jpeg", caption: "A little dream for us." }
};

const futureHint = "Tap a flower to discover a little memory.";
const futureAllOpened = "Every dream has a memory.<br>And every memory leads us back to you. ♡";

(() => {
    "use strict";

    if (wishList.length !== 31) {
        console.warn(`[future] wishList berisi ${wishList.length} item, seharusnya 31.`);
    }

    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => [...r.querySelectorAll(s)];
    const pad = (n) => String(n).padStart(2, "0");
    const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

    let sec = null, io = null, timers = [];
    let raf = 0;
    let wishesDone = false;
    let idx = -1, locked = false, entering = false, leaving = false, letterDone = false;

    const later = (fn, ms) => {
        const t = setTimeout(() => {
            timers = timers.filter((x) => x !== t);
            fn();
        }, ms);
        timers.push(t);
        return t;
    };

    /* ---------- SVG kecil (tanpa aset) ---------- */

    const flowerSVG = `<svg viewBox="0 0 40 40" aria-hidden="true"><g fill="#d98da5">${
        [0, 72, 144, 216, 288].map((a) =>
            `<ellipse cx="20" cy="9" rx="6" ry="9" transform="rotate(${a} 20 20)"/>`).join("")
    }</g><circle cx="20" cy="20" r="4.5" fill="#f3b6a0"/></svg>`;

    const leafSVG = `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M6 34C6 16 18 6 34 6c0 18-10 28-28 28z" fill="#6f8f72"/><path d="M8 32L28 12" stroke="#cfe0cf" stroke-width="1.4" fill="none"/></svg>`;

    const deco = (kind) => (kind === "leaf" ? leafSVG : flowerSVG);
    const say = { flower: "A dream worth growing. ♡", leaf: "Still growing together." };

    const img = (src, cls, fb) =>
        `<img class="${cls}" src="${src}" alt="" data-fb="${fb}">`;

    // Satu tanaman utama untuk finale (bukan grid): 1 batang, 3 cabang, daun, 3 bunga
    function plantSVG() {
        const bloom = (cx, cy, r, fill, d, main, key) => `
            <g transform="translate(${cx} ${cy})"><g class="fut-bsway" data-b="${key}"><g class="fut-pfi${main ? " fut-pfi-main" : ""}" style="--d:${d}s">
              ${main ? [36, 108, 180, 252, 324].map((a) => `<ellipse cy="${-r * .6}" rx="${r * .34}" ry="${r * .55}" transform="rotate(${a})" fill="#f0c4d0" opacity=".9"/>`).join("") : ""}
              ${[0, 72, 144, 216, 288].map((a) => `<ellipse cy="${-r * .55}" rx="${r * .3}" ry="${r * .5}" transform="rotate(${a})" fill="${fill}"/>`).join("")}
              <circle r="${r * .2}" fill="#f3b6a0"/>
            </g></g></g>`;
        const leaf = (x, y, a, d, k = 1) => `<g transform="translate(${x} ${y}) rotate(${a}) scale(${k})"><path class="fut-pl" style="--d:${d}s" d="M0 0C9-11 28-11 38 0 28 11 9 11 0 0z"/></g>`;
        const stem = (dd, cls, d, sd) => `<path class="fut-pstem ${cls}" pathLength="1" style="--d:${d}s;--sd:${sd}s" d="${dd}"/>`;
        return `<svg viewBox="0 0 220 262" aria-hidden="true">
            <ellipse cx="110" cy="254" rx="66" ry="7" fill="#2b1625" opacity=".55"/>
            ${stem("M110 252C107 205 117 150 110 94", "fut-pstem-main", 0, 2)}
            ${stem("M111 196C97 176 75 152 58 124", "fut-pstem-br", 1.1, 1.3)}
            ${stem("M112 164C128 144 148 124 162 98", "fut-pstem-br", 1.4, 1.3)}
            ${stem("M111 222C128 212 143 198 154 180", "fut-pstem-br", 1.0, 1.1)}
            ${leaf(109, 232, 200, 1.5)}${leaf(111, 226, -22, 1.7)}${leaf(110, 190, 214, 2.0)}
            ${leaf(96, 170, 238, 2.3, .9)}${leaf(131, 140, -38, 2.5, .9)}${leaf(146, 190, -8, 2.2, .9)}
            ${leaf(113, 120, -50, 2.7, .8)}
            ${bloom(162, 96, 19, "#e88ba3", 3.0, false, "placesToGo")}
            ${bloom(58, 122, 24, "#d98da5", 3.3, false, "littleThings")}
            ${bloom(110, 74, 38, "#e07a95", 3.7, true, "biggestDreams")}
        </svg>`;
    }

    // area sentuh transparan di atas bunga/daun/batang (posisi dalam % dari SVG)
    const plantHits = [
        { hit: "stem", x: 50, y: 64, w: 13, h: 48, label: "The stem" },
        { hit: "leaf", id: "leaf1", x: 39, y: 59, w: 18, h: 13, label: "A leaf" },
        { hit: "leaf", id: "leaf2", x: 75, y: 71, w: 19, h: 12, label: "A leaf with a little dream" },
        { hit: "flower", id: "biggestDreams", x: 50, y: 28, w: 40, h: 34 },
        { hit: "flower", id: "littleThings", x: 26.5, y: 46.5, w: 28, h: 24 },
        { hit: "flower", id: "placesToGo", x: 73.5, y: 36.5, w: 24, h: 20 }
    ];
    const glowAt = { biggestDreams: [50, 28, 170], littleThings: [26.5, 46.5, 110], placesToGo: [73.5, 36.5, 96] };

    // Batang tanaman penghubung antar section (digambar sekali saat masuk viewport)
    const vine = (h) => `
        <div class="fut-vine fut-reveal" aria-hidden="true" style="--h:${h}px">
          <svg viewBox="0 0 80 ${h}" preserveAspectRatio="xMidYMin meet">
            <path class="fut-vine-path" pathLength="1" d="M40 0C28 ${h * .22} 54 ${h * .45} 40 ${h * .72}"/>
            <path class="fut-vine-leaf" style="--d:.9s" d="M37 ${h * .3}c-16-2-24-10-26-22 16 0 24 8 26 22z"/>
            <path class="fut-vine-leaf fut-vine-leaf-r" style="--d:1.3s" d="M43 ${h * .52}c16-2 24-10 26-22-16 0-24 8-26 22z"/>
          </svg>
          <span class="fut-vine-bloom">${flowerSVG}</span>
        </div>`;

    /* ---------- BANGUN DOM ---------- */

    function build() {
        sec = document.createElement("section");
        sec.id = "ourFuture";
        sec.className = "future-section hidden-section";
        sec.setAttribute("aria-label", "Our Future");

        const sparks = Array.from({ length: 12 }, () =>
            `<span class="fut-spark" style="--x:${Math.random() * 100}%;--y:${Math.random() * 100}%;--d:${(Math.random() * 3).toFixed(1)}s"></span>`).join("");
        const petals = Array.from({ length: 7 }, (_, i) =>
            `<span class="fut-petal" style="--x:${8 + i * 13}%;--d:${i * 2.1}s;--t:${14 + (i % 3) * 3}s"></span>`).join("");

        const letterParas = futureLetter.paragraphs.map(() => `<p class="fut-lp"></p>`).join("");

        const c = futureCollage;
        const pol = (o, cls, extra = "") => `
            <figure class="fut-slot ${cls}">
              <div class="fut-pol" style="${extra}">
                <span class="fut-tape" aria-hidden="true"></span>
                ${img(o.src, "fut-pol-img", "ph")}
                ${o.date ? `<span class="fut-date">${o.date}</span>` : ""}
                <figcaption>${o.caption}</figcaption>
              </div>
            </figure>`;
        const dirs = { tl: "--ex:-44px;--ey:-24px;--r:-9deg;--fy:-5px;--fd:7.4s", tr: "--ex:44px;--ey:-34px;--r:8deg;--fy:-6px;--fd:8.6s", br: "--ex:38px;--ey:44px;--r:6deg;--fy:-4px;--fd:6.8s" };
        const smalls = c.small.map((o) => pol(o, `fut-slot-${o.slot} fut-slot-s`, dirs[o.slot] || dirs.tl)).join("");

        sec.innerHTML = `
        <div class="fut-vignette" aria-hidden="true"></div>
        <div class="fut-ambience" aria-hidden="true">${sparks}${petals}</div>
        <div class="fut-warm" aria-hidden="true"></div>
        <div class="fut-toast" id="futToast" aria-live="polite"></div>
        <div class="fut-lb fut-hidden" id="futLb" role="dialog" aria-modal="true" aria-label="Memory photo">
          <div class="fut-lb-back"></div>
          <figure class="fut-lb-card">
            <button type="button" class="fut-lb-x" id="futLbX" aria-label="Close">×</button>
            <div class="fut-lb-img" id="futLbImg"></div>
            <figcaption id="futLbCap"></figcaption>
          </figure>
        </div>

        <div class="fut-scene" id="futScene">
        <div class="fut-bokehs" aria-hidden="true">${
            [[8, 140, 190], [72, 420, 150], [14, 880, 170], [80, 1200, 190], [10, 1650, 160], [76, 2050, 180], [30, 2500, 200]]
                .map(([x, y, s2], i) => `<span class="fut-bokeh" style="--x:${x}%;--y:${y}px;--s:${s2}px;--d:${i * 1.3}s"></span>`).join("")}</div>
        <div class="fut-grain" aria-hidden="true"></div>
        <div class="fut-deepglow" aria-hidden="true"></div>

        <main class="fut-main">

          <header class="fut-hero">
            <div class="fut-glow" aria-hidden="true"></div>
            <p class="fut-label">OUR FUTURE</p>
            <h2 class="fut-title">The best chapters<br>are still waiting for us.</h2>
            <p class="fut-sub">We’ve seen where we came from.<br>Now let’s imagine where we’re going.</p>

            <div class="fut-collage" id="futCollage">
              ${smalls}
              <figure class="fut-slot fut-slot-bl" aria-hidden="true">
                <div class="fut-pol fut-deco-peony" style="--ex:-34px;--ey:34px;--r:-6deg;--fy:-5px;--fd:9s">${img(FUTURE_BOT + "peony.png", "fut-pol-img", "flower")}</div>
              </figure>
              <figure class="fut-slot fut-slot-main">
                <div class="fut-pol fut-pol-main">
                  <span class="fut-tape fut-tape-label">${c.tapeLabel}</span>
                  ${img(c.main.src, "fut-pol-img", "ph")}
                  <span class="fut-date">${c.main.date}</span>
                  <figcaption>${c.main.caption}</figcaption>
                </div>
              </figure>
              ${img(FUTURE_BOT + "leaves.webp", "fut-hleaf fut-hleaf-l", "leaf")}
              ${img(FUTURE_BOT + "leaves.webp", "fut-hleaf fut-hleaf-r", "leaf")}
            </div>

            <div class="fut-notes">
              ${c.notes.map((n, i) => `<p class="fut-note-line fut-reveal" style="--d:${i * 0.3}s">${n}</p>`).join("")}
              <p class="fut-minote fut-reveal" style="--d:1s"><span class="fut-tape" aria-hidden="true"></span>${c.miniNote}</p>
            </div>

            ${vine(170)}
          </header>

          <section class="fut-wishes">
            <span class="fut-wglow fut-reveal" aria-hidden="true"></span>
            <div class="fut-reveal">
              <h3 class="fut-h">OUR LITTLE WISH LIST</h3>
              <p class="fut-note">Things we hope to do, see, and become together.</p>
            </div>
            <div class="fut-stage" id="futStage">
            <div class="fut-cards fut-reveal" id="futStack" style="--d:.15s"></div>
            <div class="fut-jar fut-reveal" aria-hidden="true" style="--d:.25s"><i></i><i></i><i></i></div>
            <p class="fut-counter" id="futCounter" aria-live="polite">00 / 31</p>
            <button type="button" class="fut-btn" id="futNext">Open the jar</button>
            <div class="fut-strip" id="futStrip"></div>
            </div>
            <div class="fut-dreams fut-hidden" id="futDreams">
              ${futureFinale.dreams.map((l, i) => `<p class="fut-dreams-line fut-reveal" style="--d:${i * 0.6}s">${l}</p>`).join("")}
              <button type="button" class="fut-btn fut-reveal" id="futToLetter" style="--d:2s">Read our letter ↓</button>
            </div>
          </section>

          <section class="fut-letter fut-locked" id="futLetter">
            <p class="fut-h fut-reveal">A LETTER TO OUR FUTURE SELVES</p>
            <article class="fut-paper fut-reveal" data-on="letter" style="--d:.15s">
              <span class="fut-tape" aria-hidden="true"></span>
              <span class="fut-stamp">${futureLetter.dateStamp}</span>
              <div class="fut-paper-photo">${img(futureLetter.photo, "", "rm")}</div>
              <p class="fut-greet"></p>
              ${letterParas}
              <p class="fut-signature">${futureLetter.signature}</p>
              <span class="fut-paper-flower" aria-hidden="true">${flowerSVG}</span>
            </article>
            <p class="fut-cue fut-cue-2" id="futCue2">One last thing for you ↓</p>
          </section>

          <section class="fut-finale fut-locked" id="futFinale">
            ${vine(120)}
            <h3 class="fut-finale-title fut-reveal">${futureFinale.title}</h3>
            ${futureFinale.lines.map((l, i) =>
                `<p class="fut-finale-text fut-reveal" style="--d:${0.2 + i * 0.25}s">${l}</p>`).join("")}
            <p class="fut-signature fut-reveal" style="--d:.6s">${futureLetter.signature}</p>

            <div class="fut-plantx fut-reveal" role="group" aria-label="Our future garden" data-on="plant">
              ${Object.entries(glowAt).map(([k, [x, y, g]]) =>
                  `<span class="fut-fglow" data-g="${k}" style="--x:${x}%;--y:${y}%;--g:${g}px" aria-hidden="true"></span>`).join("")}
              ${plantSVG()}
              <div class="fut-mlayer" id="futMLayer"></div>
              ${plantHits.map((h) => `<button type="button" class="fut-hit" data-hit="${h.hit}" ${h.id ? `data-id="${h.id}"` : ""}
                  aria-label="${h.id && flowerMemories[h.id] ? flowerMemories[h.id].label : h.label}"
                  style="--x:${h.x}%;--y:${h.y}%;--w:${h.w}%;--h:${h.h}%"></button>`).join("")}
              <p class="fut-hint" id="futHint" aria-live="polite">${futureHint}</p>
              <p class="fut-mcap" id="futMCap" aria-live="polite"></p>
              ${[[14, 30], [84, 22], [92, 62], [6, 70], [70, 8], [30, 6]].map(([x, y], i) =>
                  `<span class="fut-spark" style="--x:${x}%;--y:${y}%;--d:${i * .5}s"></span>`).join("")}
              ${[[22, 46], [80, 40], [48, 14]].map(([x, y], i) =>
                  `<span class="fut-pp" style="--x:${x}%;--y:${y}%;--d:${i * 1.4}s"></span>`).join("")}
            </div>

            <figure class="fut-finale-photo fut-reveal" style="--d:.1s">
              <div class="fut-fpol">
                <span class="fut-tape" aria-hidden="true"></span>
                ${img(futureFinale.photo, "fut-pol-img", "ph")}
                <figcaption>${futureFinale.photoCaption}</figcaption>
              </div>
            </figure>

            <p class="fut-allmem fut-reveal fut-hidden" id="futAllMem">${futureAllOpened}</p>

            <button type="button" class="fut-btn fut-reveal" id="futRestart">START OUR STORY AGAIN →</button>
          </section>

        </main>
        </div>`;

        (document.getElementById("app") || document.body).appendChild(sec);

        // fallback gambar
        $$("img[data-fb]", sec).forEach((im) => {
            im.addEventListener("error", () => {
                const fb = im.dataset.fb;
                if (fb === "rm") { im.remove(); return; }
                const holder = document.createElement("span");
                holder.className = im.className + " fut-fb" + (fb === "ph" ? " fut-ph" : "");
                holder.innerHTML = fb === "leaf" ? leafSVG : flowerSVG;
                im.replaceWith(holder);
            }, { once: true });
        });

        $("#futNext", sec).addEventListener("click", nextWish);
        $("#futRestart", sec).addEventListener("click", restart);
        $("#futToLetter", sec).addEventListener("click", unlockLetter);
        sec.addEventListener("click", onDecoClick);

        const stack = $("#futStack", sec);
        let sx = null;
        stack.addEventListener("pointerdown", (e) => { sx = e.clientX; });
        stack.addEventListener("pointerup", (e) => {
            if (sx !== null && sx - e.clientX > 45) nextWish();
            sx = null;
        });

        sec.addEventListener("scroll", onScroll, { passive: true });
        sec.addEventListener("click", onPlantClick);
        $("#futLb", sec).addEventListener("click", (e) => {
            if (e.target.closest(".fut-lb-x") || !e.target.closest(".fut-lb-card")) closeLightbox();
        });
    }

    /* ---------- PARALLAX RINGAN (collage) ---------- */

    function onScroll() {
        if (raf || !sec) return;
        raf = requestAnimationFrame(() => {
            raf = 0;
            const col = $("#futCollage", sec);
            if (!col) return;
            const p = Math.min(Math.max(sec.scrollTop / Math.max(window.innerHeight, 1), 0), 1.3);
            col.style.setProperty("--p", p.toFixed(3));
        });
    }

    /* ---------- OBSERVER (sekali jalan) ---------- */

    const hooks = { letter: runLetter, plant: runPlant };

    function observe() {
        if (!io) {
            io = new IntersectionObserver((entries) => {
                entries.forEach((en) => {
                    if (!en.isIntersecting) return;
                    en.target.classList.add("in");
                    io.unobserve(en.target);
                    const h = hooks[en.target.dataset.on];
                    if (h) h();
                });
            }, { root: sec, threshold: 0.2 });
        }
        $$(".fut-reveal:not(.in)", sec).forEach((el) => {
            if (!el.closest(".fut-locked")) io.observe(el);
        });
    }

    /* ---------- TOAST + EASTER EGG ---------- */

    function toast(msg) {
        const t = $("#futToast", sec);
        if (!t) return;
        t.textContent = msg;
        t.classList.add("show");
        later(() => t.classList.remove("show"), 1900);
    }

    function onDecoClick(e) {
        const el = e.target.closest("[data-kind]");
        if (!el || !sec.contains(el)) return;
        toast(say[el.dataset.kind] || "");
    }

    /* ---------- WISH LIST ---------- */

    function type(el, text, ms, done) {
        clearTimeout(el._t);
        if (reduced()) { el.textContent = text; if (done) done(); return; }
        let i = 0;
        el.textContent = "";
        (function step() {
            el.textContent = text.slice(0, ++i);
            if (i < text.length) el._t = later(step, ms);
            else if (done) done();
        })();
    }

    function makeCard(item) {
        const c = document.createElement("article");
        c.className = "fut-card";
        c.style.setProperty("--r", `${((item.number * 37) % 7) - 3}deg`);
        c.style.setProperty("--ar", `${((item.number * 53) % 15) - 7}deg`);
        c.innerHTML = `
            <button type="button" class="fut-card-deco" data-kind="${item.decoration}" aria-label="${say[item.decoration]}">${deco(item.decoration)}</button>
            <p class="fut-card-num">${pad(item.number)} / ${wishList.length}</p>
            <p class="fut-card-cat">${item.category}</p>
            <img class="fut-card-img" src="${item.image}" alt="" onerror="this.remove()">
            <h4 class="fut-card-title">${item.title}</h4>
            <p class="fut-card-desc"></p>
            <p class="fut-card-foot">A dream we’ll grow together.</p>`;
        return c;
    }

    function nextWish() {
        if (locked || !sec) return;
        if (idx === wishList.length - 1) { completeWishes(); return; }

        locked = true;
        idx++;
        const item = wishList[idx];
        const stack = $("#futStack", sec);

        $$(".fut-card:not(.away)", stack).forEach((p) => p.classList.add("away"));
        $$(".fut-card.away", stack).slice(0, -2).forEach((old) => {
            old.classList.add("gone");
            later(() => old.remove(), 800);
        });

        const card = makeCard(item);
        stack.appendChild(card);
        requestAnimationFrame(() => requestAnimationFrame(() => card.classList.add("in")));

        later(() => type($(".fut-card-desc", card), item.description, futureSettings.typeDelay), 450);

        $("#futCounter", sec).textContent = `${pad(item.number)} / ${wishList.length}`;
        $("#futNext", sec).textContent = idx === wishList.length - 1 ? "Finish our list →" : "Next wish →";

        const strip = $("#futStrip", sec);
        if ((idx + 1) % futureSettings.gardenEvery === 0) addPlant(strip.children.length % 2 ? "leaf" : "flower");
        if (idx === wishList.length - 1) addPlant("flower");

        later(() => { locked = false; }, futureSettings.cardLock);
    }

    // Setelah wish ke-31: kartu & progress memudar, glow hangat, lalu "31 dreams. One future. Still us."
    function completeWishes() {
        if (wishesDone) return;
        wishesDone = true;
        locked = true;

        const stage = $("#futStage", sec);
        const dreams = $("#futDreams", sec);
        dreams.style.minHeight = stage.offsetHeight + "px";

        sec.classList.add("fut-glowing");
        stage.classList.add("fut-fade");

        later(() => {
            stage.style.display = "none";
            dreams.classList.remove("fut-hidden");
            later(() => $$(".fut-reveal", dreams).forEach((el) => el.classList.add("in")), 60);
        }, reduced() ? 50 : 1100);
    }

    function addPlant(kind) {
        const strip = $("#futStrip", sec);
        const p = document.createElement("button");
        p.type = "button";
        p.className = "fut-plant fut-plant-grow";
        p.dataset.kind = kind;
        p.setAttribute("aria-label", say[kind]);
        p.innerHTML = deco(kind);
        strip.appendChild(p);
    }

    /* ---------- LETTER ---------- */

    function unlockLetter() {
        const l = $("#futLetter", sec);
        if (!l.classList.contains("fut-locked")) return;
        l.classList.remove("fut-locked");
        observe();
        later(() => l.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "start" }), 80);
    }

    function runLetter() {
        if (letterDone) return;
        letterDone = true;
        const greet = $(".fut-greet", sec);
        const ps = $$(".fut-lp", sec);
        const sig = $(".fut-signature", $(".fut-paper", sec));
        const d = futureSettings.letterDelay;

        const seq = [[greet, futureLetter.greeting], ...ps.map((p, i) => [p, futureLetter.paragraphs[i]])];
        (function go(i) {
            if (i >= seq.length) {
                later(() => {
                    sig.classList.add("in");
                    later(unlockFinale, 1400);
                }, futureSettings.paragraphPause);
                return;
            }
            type(seq[i][0], seq[i][1], d, () => later(() => go(i + 1), futureSettings.paragraphPause));
        })(0);
    }

    function unlockFinale() {
        const f = $("#futFinale", sec);
        if (!f || !f.classList.contains("fut-locked")) return;
        f.classList.remove("fut-locked");
        $("#futCue2", sec).classList.add("show");
        $("#futScene", sec).classList.add("fut-deep");
        observe();
    }

    /* ---------- FINALE: BUNGA & DAUN INTERAKTIF ---------- */

    const SLOTS = [[-1.15, -.95], [1.1, -.7], [-1.2, .75], [1.15, .95], [0, 1.4]];
    const ROT = [-7, 6, -4, 8, -2];
    const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
    const mem = { key: null, els: [], list: [], hideT: null, pending: null };
    const opened = new Set();
    let hintDone = false, allShown = false, lbFocus = null;

    function runPlant() {
        later(() => $(".fut-plantx", sec).classList.add("fut-live"), 5300);
        later(() => {
            if (hintDone) return;
            $("#futHint", sec).classList.add("show");
            later(hideHint, 9000);
        }, 6200);
    }

    function hideHint() {
        hintDone = true;
        const h = $("#futHint", sec);
        if (h) h.classList.remove("show");
    }

    function retrigger(el, cls, ms) {
        if (!el) return;
        el.classList.remove(cls);
        void el.getBoundingClientRect();
        el.classList.add(cls);
        later(() => el.classList.remove(cls), ms);
    }

    function placeholder() {
        const ph = document.createElement("span");
        ph.className = "fut-ph fut-fb";
        ph.innerHTML = flowerSVG;
        return ph;
    }

    function photoEl(src) {
        const im = new Image();
        im.alt = "";
        im.src = src;
        im.addEventListener("error", () => im.replaceWith(placeholder()), { once: true });
        return im;
    }

    function wind() { retrigger($(".fut-plantx", sec), "wind", 2000); }

    function playBloom(id) {
        retrigger($(`.fut-bsway[data-b="${id}"]`, sec), "play", 1300);
        retrigger($(`.fut-fglow[data-g="${id}"]`, sec), "on", 2300);
    }

    function burst(x, y) {
        const px = $(".fut-plantx", sec);
        for (let i = 0; i < 7; i++) {
            const a = (Math.PI * 2 * i) / 7 + Math.random() * .5;
            const sp = document.createElement("i");
            sp.className = "fut-bspark";
            sp.style.cssText = `--x:${x}%;--y:${y}%;--dx:${Math.cos(a) * 34}px;--dy:${Math.sin(a) * 34}px`;
            px.appendChild(sp);
            later(() => sp.remove(), 1100);
        }
    }

    function onPlantClick(e) {
        const mp = e.target.closest(".fut-mp");
        if (mp && sec.contains(mp)) { openLightbox(+mp.dataset.i); return; }
        const hit = e.target.closest(".fut-hit");
        if (!hit || !sec.contains(hit)) return;
        const px = $(".fut-plantx", sec);
        if (!px.classList.contains("fut-live")) return;
        hideHint();

        const kind = hit.dataset.hit;
        if (kind === "flower") openFlower(hit.dataset.id);
        else if (kind === "leaf") onLeaf(hit.dataset.id);
        else { ["biggestDreams", "littleThings", "placesToGo"].forEach(playBloom); wind(); burst(50, 55); }
    }

    function openFlower(id) {
        const data = flowerMemories[id];
        if (!data || mem.pending || mem.key === id) return;
        opened.add(id);
        playBloom(id);
        wind();
        const [ax, ay] = glowAt[id];
        swapMemory(data.label, data.photos, ax, ay, id);
    }

    function onLeaf(id) {
        wind();
        if (id === "leaf1") { toast(leafInteraction.leafText); return; }
        if (mem.pending || mem.key === "leaf2") return;
        swapMemory("", [leafInteraction.leafPhoto], 75, 71, "leaf2");
    }

    // tutup grup foto yang sedang tampil (jika ada), lalu tampilkan yang baru — tidak pernah menumpuk
    function swapMemory(label, photos, ax, ay, key) {
        const start = () => { mem.pending = null; showMemory(label, photos, ax, ay, key); };
        if (mem.els.length) {
            mem.pending = later(start, 450);
            clearMemory(true);
        } else {
            start();
        }
    }

    function showMemory(label, photos, ax, ay, key) {
        const px = $(".fut-plantx", sec);
        const layer = $("#futMLayer", sec);
        if (!px || !layer) return;
        const W = px.clientWidth, H = px.clientHeight;
        const ps = Math.min(72, W * .29);
        const fx = (ax / 100) * W, fy = (ay / 100) * H;
        const list = photos.slice(0, 5);

        mem.key = key;
        mem.list = list;
        mem.els = list.map((ph, i) => {
            const x = clamp(fx + SLOTS[i][0] * ps - ps / 2, 0, W - ps);
            const y = clamp(fy + SLOTS[i][1] * ps - ps * .6, 0, H - ps * 1.35);
            const b = document.createElement("button");
            b.type = "button";
            b.className = "fut-mp";
            b.dataset.i = i;
            b.setAttribute("aria-label", `Open photo: ${ph.caption}`);
            b.style.cssText = `--x:${x}px;--y:${y}px;--w:${ps}px;--sx:${fx - x - ps / 2}px;--sy:${fy - y - ps / 2}px;--r:${ROT[i]}deg;--dl:${i * (110 + i * 20)}ms;--fy:${i % 2 ? -4 : -5}px;--fd:${6 + i}s`;
            const imgBox = document.createElement("span");
            imgBox.className = "fut-mp-img";
            imgBox.appendChild(photoEl(ph.src));
            const cap = document.createElement("span");
            cap.className = "fut-mp-cap";
            cap.textContent = ph.caption;
            b.append(imgBox, cap);
            layer.appendChild(b);
            requestAnimationFrame(() => requestAnimationFrame(() => b.classList.add("in")));
            return b;
        });

        const capEl = $("#futMCap", sec);
        capEl.textContent = label;
        capEl.classList.toggle("show", !!label);
        mem.hideT = later(() => clearMemory(false), 5200 + list.length * 160);
    }

    function clearMemory(fast) {
        clearTimeout(mem.hideT);
        const els = mem.els;
        mem.els = [];
        mem.key = null;
        els.forEach((el) => el.classList.add(fast ? "out-fast" : "out"));
        later(() => els.forEach((el) => el.remove()), fast ? 420 : 950);
        const capEl = $("#futMCap", sec);
        if (capEl) capEl.classList.remove("show");
        if (!fast) later(checkAllOpened, 900);
    }

    function checkAllOpened() {
        if (allShown || opened.size < 3 || mem.els.length || mem.pending) return;
        allShown = true;
        const m = $("#futAllMem", sec);
        m.classList.remove("fut-hidden");
        later(() => m.classList.add("in"), 80);
    }

    /* lightbox */

    function onKey(e) { if (e.key === "Escape") closeLightbox(); }

    function openLightbox(i) {
        const ph = mem.list[i];
        if (!ph) return;
        clearTimeout(mem.hideT);
        const lb = $("#futLb", sec);
        const box = $("#futLbImg", sec);
        box.replaceChildren(photoEl(ph.src));
        $("#futLbCap", sec).textContent = ph.caption;
        lbFocus = document.activeElement;
        lb.classList.remove("fut-hidden");
        requestAnimationFrame(() => requestAnimationFrame(() => lb.classList.add("show")));
        document.addEventListener("keydown", onKey);
        $("#futLbX", sec).focus({ preventScroll: true });
    }

    function closeLightbox() {
        document.removeEventListener("keydown", onKey);
        if (!sec) return;
        const lb = $("#futLb", sec);
        if (!lb || lb.classList.contains("fut-hidden")) return;
        lb.classList.remove("show");
        later(() => lb.classList.add("fut-hidden"), 320);
        if (lbFocus && lbFocus.focus) lbFocus.focus({ preventScroll: true });
        lbFocus = null;
        if (mem.els.length) mem.hideT = later(() => clearMemory(false), 1400);
    }

    /* ---------- TRANSISI ---------- */

    function showSec(el) { el.classList.remove("hidden-section"); el.classList.add("active-section"); }
    function hideSec(el) { el.classList.remove("active-section", "section-exit"); el.classList.add("hidden-section"); }

    function makeVeil(lines, full) {
        const v = document.createElement("div");
        v.className = "fut-veil" + (full ? " fut-veil-full" : "");
        v.setAttribute("aria-hidden", "true");
        const bits = Array.from({ length: 16 }, (_, i) =>
            `<span class="${i % 3 === 0 ? "fut-vleaf" : i % 2 ? "fut-spark" : "fut-petal"}" style="--x:${Math.random() * 100}%;--y:${Math.random() * 90}%;--d:${(Math.random() * 2).toFixed(1)}s;--t:${8 + Math.random() * 5}s"></span>`).join("");
        v.innerHTML = `<div class="fut-veil-glow"></div>${bits}<div class="fut-veil-text">${
            lines.map((l, i) => `<p class="v${i + 1}">${l}</p>`).join("")}</div>`;
        document.body.appendChild(v);
        requestAnimationFrame(() => requestAnimationFrame(() => v.classList.add("show")));
        return v;
    }

    function goToOurFuture() {
        if (entering || (sec && sec.classList.contains("active-section"))) return;
        entering = true;
        if (!sec) build();

        $$(".tracker-dot").forEach((d) => d.classList.add("completed"));

        const k = reduced() ? 0.3 : 1;
        const hub = $("#surpriseHub") || $(".active-section");
        if (hub) { hub.style.transition = "opacity 1.2s ease"; hub.style.opacity = ".25"; }

        const veil = makeVeil([
            "You’ve seen where we came from...",
            "Now let’s imagine where we’re going."
        ]);
        later(() => veil.classList.add("t1"), 700 * k);
        later(() => veil.classList.add("t2"), 2100 * k);

        later(() => {
            if (hub) { hideSec(hub); hub.style.opacity = ""; hub.style.transition = ""; }
            showSec(sec);
            sec.classList.add("fut-enter");
            sec.scrollTop = 0;
            window.scrollTo({ top: 0, behavior: "instant" });
            veil.classList.remove("show", "t1", "t2");
            observe();
            later(() => sec.classList.add("fut-play"), 300);
        }, 3900 * k);

        later(() => { veil.remove(); entering = false; }, 5300 * k);
    }

    function restart() {
        if (leaving || !sec) return;
        leaving = true;
        const k = reduced() ? 0.3 : 1;
        sec.classList.add("fut-leaving");
        const veil = makeVeil(["Our story continues..."], true);
        later(() => veil.classList.add("t1"), 900 * k);

        later(() => {
            $$(".active-section").forEach(hideSec);
            const first = document.getElementById("secret-entrance");
            if (first) {
                first.classList.remove("section-exit");
                showSec(first);
            }
            try { enteredCode = ""; updateCodeDisplay(); } catch (_) { /* app.js belum siap */ }
            window.scrollTo({ top: 0, behavior: "instant" });
            teardown();
            veil.classList.remove("show", "t1");
            later(() => { veil.remove(); leaving = false; }, 1300 * k);
        }, 2600 * k);
    }

    function teardown() {
        if (io) { io.disconnect(); io = null; }
        if (raf) { cancelAnimationFrame(raf); raf = 0; }
        if (sec) sec.removeEventListener("scroll", onScroll);
        document.removeEventListener("keydown", onKey);
        mem.key = null; mem.els = []; mem.list = []; mem.pending = null;
        opened.clear(); hintDone = false; allShown = false; lbFocus = null;
        // timer restart (veil) dibiarkan selesai sendiri; hapus timer wish/surat
        timers.forEach(clearTimeout);
        timers = [];
        if (sec) { sec.remove(); sec = null; }
        idx = -1; locked = false; entering = false; letterDone = false; wishesDone = false;
    }

    /* ---------- HUBUNGKAN KE TOMBOL PHASE 05 ---------- */

    document.addEventListener("click", (e) => {
        const b = e.target.closest("#surpriseContinue");
        if (!b || b.disabled || b.getAttribute("aria-disabled") === "true") return;
        if (getComputedStyle(b).pointerEvents === "none") return;
        goToOurFuture();
    }, true);

    window.goToOurFuture = goToOurFuture;
})();