/* ==========================================
   MESSAGE — TAHAP 1: OPENING SCENE
   (Phase 06 — "A Letter For You")
   ==========================================
*/

document.addEventListener("DOMContentLoaded", () => {

    const messageSection = document.getElementById("messageSection");
    const envelope = document.getElementById("msgEnvelope");
    const openBtn = document.getElementById("msgOpenBtn");

    if (!messageSection) {
        return;
    }

    /*
    ==========================================
    STATE
    ==========================================
    */

    let messageStage = "intro";
    let isTransitioning = false;


    /*
    ==========================================
    OPEN LETTER
    ==========================================
    */

    function openLetter() {

        if (isTransitioning || messageStage !== "intro") {
            return;
        }

        isTransitioning = true;

        if (envelope) {

            envelope.classList.remove("is-opening");

            void envelope.offsetWidth;

            envelope.classList.add("is-opening");

        }

        messageSection.classList.add("is-transitioning-to-letter");

        setTimeout(() => {

            messageStage = "full-letter";

            /*
            Hook untuk Tahap 2 (Full Letter). Setelah halaman
            surat penuh dibangun, cukup definisikan fungsi ini
            di file itu (mis. window.enterMessageFullLetter =
            function () {...}) — kode Tahap 1 di sini tidak
            perlu diubah sama sekali.
            */

            if (typeof window.enterMessageFullLetter === "function") {

                window.enterMessageFullLetter();

            } else {

                console.log(
                    "Message: Tahap 1 selesai, siap masuk Tahap 2 " +
                    "(full letter) — halaman itu belum dibangun."
                );

                messageSection.classList.remove(
                    "is-transitioning-to-letter"
                );

                messageStage = "intro";

            }

            isTransitioning = false;

        }, 550);

    }


    /*
    ==========================================
    WIRING (amplop + tombol memicu aksi yang sama)
    ==========================================
    */

    if (envelope) {
        envelope.addEventListener("click", openLetter);
    }

    if (openBtn) {
        openBtn.addEventListener("click", openLetter);
    }


    /*
    Diekspos read-only untuk debugging / dipakai Tahap 2 nanti,
    mengikuti pola window.goToSurpriseHub /
    window.initializeMemoryGame yang sudah ada di project ini.
    */

    window.getMessageStage = () => messageStage;

});

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
    date: "[DATE]",                       /* tulisan di date stamp */
    greeting: "Dear Ailsa,",
    paragraphs: [
        "[Tulis paragraf pembuka di sini.]",
        "[Tulis kenangan dan perasaan di sini.]",
        "[Tulis harapan untuk hubungan kami di sini.]"
    ],
    closing: "With all my love,",
    signature: "[YOUR NAME]"
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


document.addEventListener("DOMContentLoaded", () => {

    const page = document.getElementById("messageSection");

    if (!page) {
        return;
    }

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

            if (messageStage !== "full-letter" || nextWrap.hidden) {
                return;
            }

            if (typeof window.enterMessageReasons === "function") {

                window.enterMessageReasons();

            } else {

                console.log(
                    "Message: siap ke Tahap 3 (29 Reasons) — " +
                    "halaman itu belum dibangun."
                );

            }

        });

    }

    window.getMessageStage = () => messageStage;

});