/* ==========================================
   MESSAGE — TAHAP 1 (opening) + TAHAP 2 (surat)
   (Phase 06 — "A Letter For You")
   ==========================================
   State: "intro" -> "opening-letter" -> "full-letter"
   Tahap 3 (29 Reasons) BELUM dibangun; tombolnya hanya memanggil
   window.enterMessageReasons bila sudah didefinisikan.

   Progress "Message sudah dikunjungi", tombol Back ke hub, dan audio
   global ditangani app.js / music.js — tidak disentuh di sini.
*/

/* ==========================================
   >>> EDIT DI SINI: ISI SURAT <<<
   paragraphs boleh ditambah/dikurangi.
========================================== */

const letterContent = {
    date: "04/10/2026",

    greeting: "HAPPY ANNIVERSARY   1 Tahun 1 Bulan sayangkuu,",

    paragraphs: [
        `Haiii bunga perasasa kuu.. Jujur yaa, aku masih suka nggak nyangka tau sayang kalo kita bisa sampai di titik ini.
        Dari awal kita kenal kamu follow aku dan akuu kepedean sama kamuu sampai sekarang yang udah saling cintaa, ternyata udah banyak banget hal yang kita lewatin bareng, buktinya coba aja menyelam kayanya ga bakal cukup sehari ay.
        Dan dari semuanya, aku cuma mau bilang kalau aku seneng pake banget...
        seneng karena dari sekian banyak kemungkinan di hidup ini,
        ternyata aku bisa menemukan kamu dan punya cerita banyak banyak sama kamu.`,

        `Maaf ya aku buat website ini telat dan ga sesuai yang di rencanakan tapi tetap Aku bikin website ini karena aku pengen kasih sesuatu yang benar-benar tentang kita berdua.
        Mungkin sederhana, tapi setiap bagian di dalamnya aku buat dengan penuh rasa sayang.
        Ada cerita, kenangan, dan hal-hal kecil yang mungkin kelihatan sepele,
        tapi sebenarnya punya tempat sendiri di hati aku.
        Semoga kamu suka ya, sayang.
        Semoga waktu kamu lihat semuanya, kamu bisa ngerasain sedikit dari rasa sayang yang aku masukin ke sini hihi.`,

        `Aku juga mau minta maaf untuk semua hal yang selama ini mungkin pernah bikin kamu kecewa,
        capek, sedih, atau merasa kurang dimengerti.
        Maaf kalau aku belum selalu jadi pasangan yang baik buat kamu cintaku,
        masih sering salah ngomong, komunikasi kurang, salah bersikap, atau mungkin terlalu egois baik di sengaja maupun tidak disengaja.
        Aku tahu aku masih jauh dari sempurna sayanggku,
        tapi aku benar-benar mau belajar jadi lebih baik buat kamu.
        Bukan cuma supaya hubungan kita tetap berjalan,
        tapi karena kamu memang sepenting itu buat aku my future wife.`,

        `Semakin lama sama kamu, aku semakin sadar kalau aku nggak akan mau menganggap kehadiran kamu sebagai sesuatu yang biasa. Tapi luar biasa yang membuat hidup ku jauh lebih baikk.
        Aku bersyukur banget bisa punya seseorang yang bisa diajak ngobrol, bercanda, berbagi cerita, saling support satu sama lain, saling melengkapi, 
        ada berantem kecil, ngambek, lalu kembali saling sayang lagii. karna aku selalu sayang dan cinta sama kamu ga pernah berkurang sedikit pun my sweety
        Dan di antara banyak hal yang bisa berubah dalam hidup,
        aku berharap kita tetap jadi dua orang yang memilih satu sama lain.`,

        `Aku paling nggak mau kehilangan kamu.
        Aku masih mau punya banyak cerita sama kamu,
        masih mau melihat kita tumbuh,
        masih mau melihat kita meraih mimpi kita masing masing dan bersama bareng bareng,
        masih mau melewati hari-hari baik dan buruk bareng kamu.
        Aku nggak bisa janji semuanya akan selalu mudah sayang pasti ada rintangan yang kita gatau apa kedepannya,
        tapi aku bisa janji kalau aku akan terus berusaha menjaga apa yang sudah kita punya. aku akan terus perjuangin hidden gem yang udah aku punya, yaituu kamuuu ailsa indestianty anindyta`,

        `Kalau suatu hari nanti kita melihat kembali semua yang sudah kita lewati,
        aku berharap kita bisa saling tersenyum dan bilang,
        "Ternyata kita udah sejauh ini yaa sayangg, ga kerasa bett gemess"

        Dan kalau aku diberi kesempatan untuk mengulang semuanya dari awal,
        dengan semua tawa, kesalahan, pertengkaran, dan air mata yang pernah ada,
        aku rasa aku tetap akan memilih jalan yang sama.

        Jalan yang akhirnya membawa aku ke kamu.

        Happy anniversary, sayangkuu, cintakuu, duniakuu, bidadari cantikku manis kuuu, masa depannya akuu..
        Terima kasih banyak sudah tetap di sini bersama kuu,
        Aku kan selalu memilih kamu.
        Dan aku masih mau kita terus bersama.`
    ],

    closing: "With all my love,",

    signature: "- Your Pilar Daun"
};

/* ==========================================
   >>> KECEPATAN TYPEWRITER (milidetik) <<<
   characterDelay : jeda antar huruf (makin besar = makin pelan)
   paragraphDelay : jeda antar paragraf
   signatureDelay : jeda sebelum closing & signature
========================================== */

const typewriterSettings = {
    characterDelay: 35,
    paragraphDelay: 700,
    signatureDelay: 900
};



/* Markup Tahap 2. Dipasang otomatis bila belum ada di index.html, jadi
   tidak ada lagi langkah "tempel HTML" yang bisa salah tempat. */

const MSG_LETTER_MARKUP = `
<!-- TAHAP 2: surat -->
<div class="msg-letter" id="msgLetter" hidden>

    <div class="msg-letter-ambience" aria-hidden="true">
        <span class="bokeh" style="--x:6%; --y:12%; --size:150px; --delay:0s; --duration:14s;"></span>
        <span class="bokeh" style="--x:84%; --y:60%; --size:140px; --delay:2s; --duration:13s;"></span>
        <span class="glitter" style="--x:16%; --y:22%; --delay:.3s;"></span>
        <span class="glitter" style="--x:86%; --y:30%; --delay:1.5s;"></span>
        <span class="glitter" style="--x:10%; --y:70%; --delay:.9s;"></span>
        <span class="glitter" style="--x:90%; --y:84%; --delay:2.2s;"></span>
    </div>

    <div class="msg-letter-content">

        <button type="button" class="msg-letter-back" id="msgLetterBack">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
            <span>Back to Our Little World</span>
        </button>

        <div class="msg-paper-wrap">

            <article class="msg-paper" aria-label="Surat untuk kamu">
                <div class="msg-paper-stamp" aria-hidden="true">
                    <span id="msgStampDate">[DATE]</span>
                    <span class="msg-paper-stamp-word">Always ♡</span>
                </div>
                <div class="msg-paper-body" id="msgPaperBody"></div>
            </article>

            <!-- Dekorasi di luar kertas (pointer-events: none).
                 Aset hilang -> otomatis pakai botanical yang sudah ada. -->
            <span class="msg-paper-tape" aria-hidden="true"></span>
            <img class="msg-paper-peony"
                 src="/assets/images/message/peony-decoration.png"
                 data-fb="assets/images/botanical/peony.png" alt="" aria-hidden="true"
                 onerror="if(this.dataset.fb&&!this.dataset.tried){this.dataset.tried='1';this.src=this.dataset.fb}else{this.style.display='none'}">
            <img class="msg-paper-leaf"
                 src="/assets/images/message/leaf-decoration.png"
                 data-fb="assets/images/botanical/leaves.webp" alt="" aria-hidden="true"
                 onerror="if(this.dataset.fb&&!this.dataset.tried){this.dataset.tried='1';this.src=this.dataset.fb}else{this.style.display='none'}">
            <span class="msg-paper-spark msg-paper-spark-a" aria-hidden="true"></span>
            <span class="msg-paper-spark msg-paper-spark-b" aria-hidden="true"></span>

        </div>

        <!-- Tombol Tahap 3: baru tampil setelah signature selesai -->
        <div class="msg-next" id="msgNext" hidden>
            <button type="button" class="msg-next-btn" id="msgNextBtn">
                <span class="msg-next-main">Open 29 Reasons <span aria-hidden="true">→</span></span>
                <span class="msg-next-sub">There is something else I want you to know.</span>
            </button>
        </div>

    </div>

</div>
`;

document.addEventListener("DOMContentLoaded", () => {

    const page = document.getElementById("messageSection");

    if (!page || window.__msgStage2Ready) {
        return;
    }

    window.__msgStage2Ready = true;      /* cegah inisialisasi ganda */

    /* ---------- pastikan elemen Tahap 2 ada DI DALAM #messageSection ---------- */

    function ensureStage2Dom() {

        if (!page.querySelector(".msg-bg-letter")) {

            const bg = document.createElement("div");

            bg.className = "msg-bg-letter";
            bg.setAttribute("aria-hidden", "true");

            const base = page.querySelector(".msg-bg");

            if (base) { base.after(bg); } else { page.prepend(bg); }

        }

        const existing = document.getElementById("msgLetter");

        /* Surat HARUS anak langsung #messageSection. Kalau tertempel di luar
           section ATAU di dalam .msg-content / .msg-scene, ia ikut
           tersembunyi saat Tahap 1 disembunyikan -> layar kosong. */

        if (existing) {

            if (existing.parentElement !== page) {
                page.appendChild(existing);
            }

        } else {
            page.insertAdjacentHTML("beforeend", MSG_LETTER_MARKUP);
        }

        /* Tahap 2 tanpa judul/subtitle dekoratif di atas kertas */

        const oldHeader = document.querySelector("#msgLetter .msg-letter-header");

        if (oldHeader) {
            oldHeader.remove();
        }

        const existingReveal = page.querySelector(".msg-reveal");

        if (existingReveal) {

            if (existingReveal.parentElement !== page) {
                page.appendChild(existingReveal);   /* harus menutupi seluruh halaman */
            }

        } else {

            const reveal = document.createElement("div");

            reveal.className = "msg-reveal";
            reveal.setAttribute("aria-hidden", "true");

            page.appendChild(reveal);

        }

        /* CSS Tahap 2: dimuat otomatis bila belum ter-link */

        const hasCss =
            document.querySelector('link[href*="message-letter.css"]') ||
            (window.getComputedStyle &&
                getComputedStyle(page).getPropertyValue("--msg-paper-texture").trim());

        if (!hasCss) {

            const link = document.createElement("link");

            link.rel = "stylesheet";
            link.href = "css/message-letter.css";

            document.head.appendChild(link);

        }

    }

    ensureStage2Dom();

    console.info("[Message] Tahap 2 (surat) aktif");

    const $ = (id) => document.getElementById(id);

    const envelope = $("msgEnvelope");
    const openBtn = $("msgOpenBtn");
    const content = page.querySelector(".msg-content");
    const introBack = page.querySelector(".msg-back[data-back]");

    const letter = $("msgLetter");
    const body = $("msgPaperBody");
    const stampDate = $("msgStampDate");
    const letterBack = $("msgLetterBack");
    const nextWrap = $("msgNext");
    const nextBtn = $("msgNextBtn");

    const REVEAL_SWAP_MS = 950;     /* kapan halaman surat menggantikan scene */
    const PAPER_IN_MS = 850;        /* animasi kertas sebelum mengetik */
    const SIGNATURE_MS = 1700;      /* durasi tulisan tangan signature */

    let messageStage = "intro";
    let typingStarted = false;
    let blocks = [];
    let cursor = null;
    let signatureEl = null;
    let resetTimer = 0;

    const pending = new Set();


    /* ---------- timers (semua lewat sini, jadi bisa dibersihkan) ---------- */

    function later(fn, ms) {

        const id = setTimeout(() => {
            pending.delete(id);
            fn();
        }, ms);

        pending.add(id);

        return id;

    }

    function clearAll() {

        pending.forEach((id) => clearTimeout(id));
        pending.clear();

    }

    function reduceMotion() {

        return !!(
            window.matchMedia &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
        );

    }


    /* ---------- bangun isi surat ---------- */

    function buildLetter() {

        body.textContent = "";
        blocks = [];

        cursor = document.createElement("span");
        cursor.className = "msg-cursor";
        cursor.setAttribute("aria-hidden", "true");

        /* teks yang belum diketik tetap ada (disembunyikan) supaya
           tinggi kertas stabil dan baris tidak melompat */

        function add(className, text) {

            const p = document.createElement("p");
            const typed = document.createElement("span");
            const rest = document.createElement("span");

            p.className = className;
            typed.className = "msg-typed";
            rest.className = "msg-rest";
            rest.textContent = text;

            p.append(typed, rest);
            body.appendChild(p);

            const block = { p, typed, rest, text };

            blocks.push(block);

            return block;

        }

        add("msg-l-greeting", letterContent.greeting);

        letterContent.paragraphs.forEach((text) => add("msg-l-para", text));

        add("msg-l-closing", letterContent.closing);

        signatureEl = document.createElement("p");
        signatureEl.className = "msg-l-signature";
        signatureEl.textContent = letterContent.signature;
        body.appendChild(signatureEl);

        if (stampDate) {
            stampDate.textContent = letterContent.date || "[DATE]";
        }

        nextWrap.hidden = true;
        nextWrap.classList.remove("is-shown");

    }


    /* ---------- typewriter ---------- */

    function ensureCursorVisible() {

        if (!cursor || !cursor.getBoundingClientRect) {
            return;
        }

        const rect = cursor.getBoundingClientRect();

        if (rect.bottom > window.innerHeight - 110) {

            window.scrollBy({
                top: rect.bottom - window.innerHeight + 220,
                behavior: "smooth"
            });

        }

    }

    function typeBlock(block, done) {

        block.p.insertBefore(cursor, block.rest);

        ensureCursorVisible();

        let i = 0;

        function tick() {

            if (i >= block.text.length) {
                done();
                return;
            }

            i += 1;

            block.typed.textContent = block.text.slice(0, i);
            block.rest.textContent = block.text.slice(i);

            if (i % 40 === 0) {
                ensureCursorVisible();
            }

            later(tick, typewriterSettings.characterDelay);

        }

        tick();

    }

    function showNextButton() {

        if (cursor) {
            cursor.remove();
        }

        nextWrap.hidden = false;

        void nextWrap.offsetWidth;

        nextWrap.classList.add("is-shown");

        if (typeof nextWrap.scrollIntoView === "function") {
            nextWrap.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }

    }

    function writeSignature() {

        if (cursor) {
            cursor.remove();
        }

        signatureEl.classList.add("is-written");

        later(showNextButton, SIGNATURE_MS);

    }

    function finishInstantly() {

        blocks.forEach((b) => {
            b.typed.textContent = b.text;
            b.rest.textContent = "";
        });

        signatureEl.classList.add("is-written");

        later(showNextButton, 300);

    }

    function startTyping() {

        if (typingStarted || messageStage !== "full-letter") {
            return;
        }

        typingStarted = true;

        if (reduceMotion()) {
            finishInstantly();
            return;
        }

        const lines = blocks.slice(0, -1);        /* greeting + paragraf */
        const closing = blocks[blocks.length - 1];

        let index = 0;

        function nextLine() {

            if (index >= lines.length) {

                later(() => {
                    typeBlock(closing, () => later(writeSignature, 500));
                }, typewriterSettings.signatureDelay);

                return;

            }

            const block = lines[index];

            index += 1;

            typeBlock(block, () => later(nextLine, typewriterSettings.paragraphDelay));

        }

        later(nextLine, 400);

    }


    /* ---------- transisi Tahap 1 -> Tahap 2 ---------- */

    function showLetterStage() {

        buildLetter();

        typingStarted = false;
        messageStage = "full-letter";

        content.hidden = true;
        letter.hidden = false;

        page.classList.add("is-letter-stage");

        window.scrollTo({ top: 0, behavior: "instant" });

        later(startTyping, reduceMotion() ? 200 : PAPER_IN_MS);

    }

    function openLetter() {

        /* satu-satunya pintu masuk: klik ganda / klik saat transisi diabaikan */

        if (messageStage !== "intro") {
            return;
        }

        messageStage = "opening-letter";

        if (envelope) {

            envelope.classList.remove("is-opening");

            void envelope.offsetWidth;

            envelope.classList.add("is-opening");

        }

        page.classList.add("is-opening-letter");

        later(showLetterStage, reduceMotion() ? 150 : REVEAL_SWAP_MS);

    }


    /* ---------- kembali ke Tahap 1 (dipanggil setelah Back ke hub) ---------- */

    function resetToIntro() {

        clearAll();

        if (typeof window.exitMessageReasons === "function") {
            window.exitMessageReasons();
        }

        typingStarted = false;
        messageStage = "intro";

        page.classList.remove("is-opening-letter", "is-letter-stage");

        if (envelope) {
            envelope.classList.remove("is-opening");
        }

        content.hidden = false;
        letter.hidden = true;

        body.textContent = "";
        nextWrap.hidden = true;
        nextWrap.classList.remove("is-shown");

    }


    /* ---------- wiring (semua dipasang SEKALI) ---------- */

    if (envelope) { envelope.addEventListener("click", openLetter); }
    if (openBtn) { openBtn.addEventListener("click", openLetter); }

    /* Back di Tahap 1 sudah dihubungkan ke hub oleh app.js; di sini hanya
       mengembalikan halaman ke "intro" setelah transisi keluar selesai. */

    if (introBack) {

        introBack.addEventListener("click", () => {

            clearTimeout(resetTimer);

            resetTimer = setTimeout(resetToIntro, 1100);

        });

    }

    /* Back di Tahap 2 meneruskan klik ke tombol Back Tahap 1 (satu jalur) */

    if (letterBack && introBack) {
        letterBack.addEventListener("click", () => introBack.click());
    }

    if (nextBtn) {

        nextBtn.addEventListener("click", () => {

            /* hanya dari "full-letter": klik berulang saat Tahap 3 terbuka diabaikan */

            if (messageStage !== "full-letter" || nextWrap.hidden) {
                return;
            }

            if (typeof window.enterMessageReasons !== "function") {

                console.log(
                    "Message: Tahap 3 (reasons.js) belum dimuat."
                );

                return;

            }

            messageStage = "reasons";

            window.enterMessageReasons({

                /* tombol Close: kembali ke surat */
                onClose: () => {
                    messageStage = "full-letter";
                    nextBtn.focus({ preventScroll: true });
                },

                /* tombol penutup: kembali ke hub lewat jalur Back yang sama */
                onFinish: () => {
                    messageStage = "full-letter";
                    if (introBack) { introBack.click(); }
                }

            });

        });

    }

    window.getMessageStage = () => messageStage;

});