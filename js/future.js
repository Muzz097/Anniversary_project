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

const futureFinale = {
    title: "THE FUTURE IS OURS TO WRITE",
    lines: [
        "I may not know exactly what the future will look like,<br>but I know who I want beside me when we find out.",
        "Happy Anniversary, Ailsa.<br>Here’s to every chapter still waiting for us."
    ]
};

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

        sec.innerHTML = `
        <div class="fut-bg"></div>
        <div class="fut-ambience" aria-hidden="true">${sparks}${petals}</div>
        <div class="fut-toast" id="futToast" aria-live="polite"></div>

        <main class="fut-main">

          <header class="fut-hero">
            <div class="fut-glow" aria-hidden="true"></div>
            <div class="fut-plant-art" aria-hidden="true">
              <svg class="fut-stem" viewBox="0 0 120 210"><path d="M60 210C54 160 72 120 60 44"/><path class="fut-stem-leaf" d="M60 130c-22-2-34-14-38-30 22 0 36 10 38 30z"/><path class="fut-stem-leaf fut-stem-leaf-r" d="M62 100c20 0 32-12 36-28-20 0-34 10-36 28z"/></svg>
              ${img(FUTURE_BOT + "leaves.webp", "fut-leaf fut-leaf-l", "leaf")}
              ${img(FUTURE_BOT + "leaves.webp", "fut-leaf fut-leaf-r", "leaf")}
              ${img(FUTURE_BOT + "peony.png", "fut-bloom", "flower")}
            </div>
            <p class="fut-label">OUR FUTURE</p>
            <h2 class="fut-title">The best chapters<br>are still waiting for us.</h2>
            <p class="fut-sub">We’ve seen where we came from.<br>Now let’s imagine where we’re going.</p>
            <figure class="fut-polaroid">${img("assets/images/couple/photo-01.jpeg", "", "rm")}</figure>
            <p class="fut-cue">scroll</p>
          </header>

          <section class="fut-wishes">
            <div class="fut-reveal">
              <h3 class="fut-h">OUR LITTLE WISH LIST</h3>
              <p class="fut-note">Things we hope to do, see, and become together.</p>
            </div>
            <div class="fut-cards fut-reveal" id="futStack" style="--d:.15s"></div>
            <div class="fut-jar fut-reveal" aria-hidden="true" style="--d:.25s"><i></i><i></i><i></i></div>
            <p class="fut-counter" id="futCounter" aria-live="polite">00 / 31</p>
            <button type="button" class="fut-btn" id="futNext">Open the jar</button>
            <div class="fut-strip" id="futStrip"></div>
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
            <p class="fut-cue fut-cue-2" id="futCue2">keep scrolling</p>
          </section>

          <section class="fut-finale fut-locked" id="futFinale">
            <div class="fut-garden" id="futGarden" aria-hidden="true"></div>
            <h3 class="fut-finale-title fut-reveal">${futureFinale.title}</h3>
            ${futureFinale.lines.map((l, i) =>
                `<p class="fut-finale-text fut-reveal" style="--d:${0.2 + i * 0.25}s">${l}</p>`).join("")}
            <p class="fut-signature fut-reveal" style="--d:.8s">${futureLetter.signature}</p>
            <button type="button" class="fut-btn fut-reveal" id="futRestart" style="--d:1s">START OUR STORY AGAIN →</button>
          </section>

        </main>`;

        (document.getElementById("app") || document.body).appendChild(sec);

        // fallback gambar
        $$("img[data-fb]", sec).forEach((im) => {
            im.addEventListener("error", () => {
                const fb = im.dataset.fb;
                if (fb === "rm") { im.remove(); return; }
                const holder = document.createElement("span");
                holder.className = im.className + " fut-fb";
                holder.innerHTML = fb === "flower" ? flowerSVG : leafSVG;
                im.replaceWith(holder);
            }, { once: true });
        });

        // taman akhir: 31 tanaman kecil
        $("#futGarden", sec).innerHTML = wishList.map((item, i) =>
            `<span class="fut-plant fut-reveal" style="--d:${(i * 0.07).toFixed(2)}s">${deco(item.decoration)}</span>`).join("");

        $("#futNext", sec).addEventListener("click", nextWish);
        $("#futRestart", sec).addEventListener("click", restart);
        sec.addEventListener("click", onDecoClick);

        const stack = $("#futStack", sec);
        let sx = null;
        stack.addEventListener("pointerdown", (e) => { sx = e.clientX; });
        stack.addEventListener("pointerup", (e) => {
            if (sx !== null && sx - e.clientX > 45) nextWish();
            sx = null;
        });
    }

    /* ---------- OBSERVER (sekali jalan) ---------- */

    const hooks = { letter: runLetter };

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
        if (idx === wishList.length - 1) { unlockLetter(); return; }

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
        $("#futNext", sec).textContent = idx === wishList.length - 1 ? "Read our letter ↓" : "Next wish →";

        if ((idx + 1) % futureSettings.gardenEvery === 0) addPlant(item.decoration);
        if (idx === wishList.length - 1) addPlant("flower");

        later(() => { locked = false; }, futureSettings.cardLock);
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
        observe();
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
        // timer restart (veil) dibiarkan selesai sendiri; hapus timer wish/surat
        timers.forEach(clearTimeout);
        timers = [];
        if (sec) { sec.remove(); sec = null; }
        idx = -1; locked = false; entering = false; letterDone = false;
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