/* ==========================================
   MESSAGE — TAHAP 3: 29 REASONS
   ("There's something else I want you to know")
   ==========================================
   Overlay di dalam halaman Message yang sama (tanpa route baru).
   Dibuka oleh tombol "Open 29 Reasons" lewat
   window.enterMessageReasons({ onClose, onFinish }) — dipanggil
   message.js. Markup dibuat otomatis oleh file ini; CSS-nya
   css/message-reasons.css (dimuat otomatis bila belum di-link).

   Audio global (music.js) dan progress menu (app.js) tidak disentuh.
*/

/* ==========================================
   >>> EDIT DI SINI: 29 ALASAN <<<
   number : nomor kartu (1-29)
   text   : isi alasan (boleh pakai \n untuk baris baru)
   photo  : (opsional) foto mini, mis. "/assets/message/reason-05.jpg"
   decor  : (opsional) "default" | "peony" | "leaf" | "none"
========================================== */

const reasons = [
    { number: 1,  text: "The way you smile even when you don’t realize how beautiful you are." },
    { number: 2,  text: "[Alasan kedua]" },
    { number: 3,  text: "[Alasan ketiga]" },
    { number: 4,  text: "[Alasan keempat]" },
    { number: 5,  text: "[Alasan kelima]", photo: "" },
    { number: 6,  text: "[Alasan keenam]" },
    { number: 7,  text: "[Alasan ketujuh]" },
    { number: 8,  text: "[Alasan kedelapan]" },
    { number: 9,  text: "[Alasan kesembilan]" },
    { number: 10, text: "[Alasan kesepuluh]", photo: "" },
    { number: 11, text: "[Alasan ke-11]" },
    { number: 12, text: "[Alasan ke-12]" },
    { number: 13, text: "[Alasan ke-13]" },
    { number: 14, text: "[Alasan ke-14]" },
    { number: 15, text: "[Alasan ke-15]", photo: "" },
    { number: 16, text: "[Alasan ke-16]" },
    { number: 17, text: "[Alasan ke-17]" },
    { number: 18, text: "[Alasan ke-18]" },
    { number: 19, text: "[Alasan ke-19]" },
    { number: 20, text: "[Alasan ke-20]", photo: "" },
    { number: 21, text: "[Alasan ke-21]" },
    { number: 22, text: "[Alasan ke-22]" },
    { number: 23, text: "[Alasan ke-23]" },
    { number: 24, text: "[Alasan ke-24]" },
    { number: 25, text: "[Alasan ke-25]", photo: "" },
    { number: 26, text: "[Alasan ke-26]" },
    { number: 27, text: "[Alasan ke-27]" },
    { number: 28, text: "[Alasan ke-28]" },
    { number: 29, text: "Because you’re you." }
];

/* Teks lain di Tahap 3 */

const reasonsSettings = {
    titleLines: ["There’s something else", "I want you to know"],
    subtitle: "Do you know what I love about you?",
    hint: "Tap the card to continue",
    finalSubtext: "And that will always be enough.",
    finaleText: "I could write a hundred more reasons,\nand I would still choose you.",
    finaleButton: "Back to Our Little World",
    closeLabel: "Close",

    /* durasi animasi (ms) */
    liftMs: 140,        /* kartu naik sedikit */
    moveMs: 640,        /* kartu pindah ke belakang tumpukan */
    introMs: 1500,      /* animasi pembuka overlay */
    finalMs: 1900       /* klimaks kartu 29 sebelum penutup muncul */
};


document.addEventListener("DOMContentLoaded", () => {

    const page = document.getElementById("messageSection");

    if (!page || window.__rsReady) {
        return;
    }

    window.__rsReady = true;

    const S = reasonsSettings;
    const total = reasons.length;
    const root = document.documentElement;

    /* CSS dimuat otomatis bila belum ter-link */

    if (
        !document.querySelector('link[href*="message-reasons.css"]') &&
        !(window.getComputedStyle && getComputedStyle(page).getPropertyValue("--rs-ease").trim())
    ) {

        const link = document.createElement("link");

        link.rel = "stylesheet";
        link.href = "css/message-reasons.css";

        document.head.appendChild(link);

    }


    /* ---------- helpers ---------- */

    function el(tag, className, text) {

        const node = document.createElement(tag);

        if (className) { node.className = className; }
        if (text) { node.textContent = text; }

        return node;

    }

    function img(className, src, fallback) {

        const node = document.createElement("img");

        node.className = className;
        node.alt = "";
        node.setAttribute("aria-hidden", "true");
        node.draggable = false;

        let tried = false;

        node.addEventListener("error", () => {

            if (fallback && !tried) {
                tried = true;
                node.src = fallback;
            } else {
                node.style.display = "none";
            }

        });

        node.src = src;

        return node;

    }

    function pad(n) {

        return String(n).padStart(2, "0");

    }

    function lines(target, text) {

        target.textContent = "";

        String(text).split("\n").forEach((part, i) => {

            if (i) { target.appendChild(document.createElement("br")); }

            target.appendChild(document.createTextNode(part));

        });

    }

    function reduceMotion() {

        return !!(
            window.matchMedia &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
        );

    }

    function ms(value) {

        return reduceMotion() ? 40 : value;

    }


    /* ---------- state ---------- */

    let isOpen = false;
    let isTransitioning = false;
    let finished = false;
    let currentReason = 0;          /* 0-based */
    let callbacks = {};
    let hideTimer = 0;
    let suppressClick = false;

    const pending = new Set();

    function later(fn, delay) {

        const id = setTimeout(() => {
            pending.delete(id);
            fn();
        }, delay);

        pending.add(id);

        return id;

    }

    function clearAll() {

        pending.forEach((id) => clearTimeout(id));
        pending.clear();

    }


    /* ---------- build overlay (sekali) ---------- */

    const overlay = el("div", "rs-overlay");

    overlay.id = "rsOverlay";
    overlay.hidden = true;
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "29 alasan aku sayang kamu");

    const ambience = el("div", "rs-ambience");

    ambience.setAttribute("aria-hidden", "true");

    [
        { x: 6, y: 12, s: 170, d: 0, t: 13 },
        { x: 84, y: 40, s: 140, d: 2, t: 12 },
        { x: 10, y: 78, s: 160, d: 1, t: 14 }
    ].forEach((b) => {

        const span = el("span", "bokeh");

        span.style.cssText =
            "--x:" + b.x + "%; --y:" + b.y + "%; --size:" + b.s + "px; --delay:" + b.d + "s; --duration:" + b.t + "s;";

        ambience.appendChild(span);

    });

    [[18, 20, 0.2], [82, 28, 1.3], [12, 56, 0.8], [90, 66, 2.1], [50, 92, 1.6]].forEach((g) => {

        const span = el("span", "glitter");

        span.style.cssText = "--x:" + g[0] + "%; --y:" + g[1] + "%; --delay:" + g[2] + "s;";

        ambience.appendChild(span);

    });

    [[10, 12, 0, 24], [36, 10, 8, 28], [62, 13, 3, 26], [88, 11, 14, 27]].forEach((p) => {

        const span = el("span", "rs-petal");

        span.style.cssText = "--x:" + p[0] + "%; --size:" + p[1] + "px; --delay:" + p[2] + "s; --duration:" + p[3] + "s;";

        ambience.appendChild(span);

    });

    const scroll = el("div", "rs-scroll");

    /* close */

    const closeBtn = el("button", "rs-close");

    closeBtn.type = "button";
    closeBtn.innerHTML =
        '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg>';

    closeBtn.appendChild(el("span", "", S.closeLabel));

    /* head */

    const head = el("header", "rs-head");
    const title = el("h2", "rs-title");

    S.titleLines.forEach((line, i) => {

        if (i) { title.appendChild(document.createElement("br")); }

        title.appendChild(document.createTextNode(line));

    });

    const divider = el("div", "rs-divider");

    divider.setAttribute("aria-hidden", "true");
    divider.append(el("i"), el("span", "", "♥"), el("i"));

    head.append(title, divider, el("p", "rs-sub", S.subtitle));

    /* stage + stack */

    const stage = el("div", "rs-stage");

    stage.setAttribute("role", "button");
    stage.tabIndex = 0;
    stage.setAttribute("aria-label", S.hint);

    const stack = el("div", "rs-stack");

    function buildCard() {

        const card = el("div", "rs-card");

        const paper = el("div", "rs-paper");
        const body = el("div", "rs-body");

        const label = el("p", "rs-label");
        const num = el("p", "rs-num");
        const rule = el("span", "rs-rule");
        const text = el("p", "rs-text");
        const sub = el("p", "rs-subtext");
        const heart = el("span", "rs-heart", "♡");

        body.append(label, num, rule, text, sub, heart);
        paper.appendChild(body);

        const ghost = el("span", "rs-ghost");

        const photoWrap = el("span", "rs-photo");
        const photoImg = document.createElement("img");

        photoImg.alt = "";
        photoImg.addEventListener("error", () => { photoWrap.hidden = true; });
        photoWrap.appendChild(photoImg);

        card.append(
            paper,
            ghost,
            el("span", "rs-tape"),
            img("rs-peony", "/assets/images/message/reason-peony.png", "assets/images/botanical/peony.png"),
            img("rs-leafs", "/assets/images/message/reason-leaf.png", "assets/images/botanical/leaves.webp"),
            photoWrap
        );

        return { card, label, num, text, sub, ghost, photoWrap, photoImg };

    }

    const cards = [buildCard(), buildCard(), buildCard()];     /* urutan = slot 0,1,2 */

    cards.forEach((c) => stack.appendChild(c.card));

    function renderCard(c, index) {

        if (index >= total) {
            c.card.dataset.empty = "1";
            return;
        }

        delete c.card.dataset.empty;

        const r = reasons[index];

        c.label.textContent = "Reason " + pad(r.number) + " of " + total;
        c.num.textContent = pad(r.number);
        lines(c.text, r.text);
        c.ghost.textContent = pad(r.number);

        c.sub.textContent = r.number === total ? S.finalSubtext : "";

        c.card.dataset.decor = r.decor || "default";

        if (r.photo) {
            c.photoWrap.hidden = false;
            c.photoImg.src = r.photo;
        } else {
            c.photoWrap.hidden = true;
        }

    }

    /* hiasan klimaks kartu 29 */

    stack.append(
        img("rs-bouquet", "/assets/images/message/reason-bouquet.png", "assets/images/botanical/buket.png"),
        img("rs-final-leaf rs-final-leaf-l", "/assets/images/message/reason-leaf.png", "assets/images/botanical/leaves.webp"),
        img("rs-final-leaf rs-final-leaf-r", "/assets/images/message/reason-leaf.png", "assets/images/botanical/leaves.webp")
    );

    ["a", "b", "c", "d"].forEach((k) => {

        const spark = el("span", "rs-spark rs-spark-" + k);

        spark.setAttribute("aria-hidden", "true");

        stack.appendChild(spark);

    });

    const live = el("p", "rs-sr");

    live.setAttribute("aria-live", "polite");

    stage.append(stack, live);

    /* meta */

    const meta = el("div", "rs-meta");
    const count = el("p", "rs-count");
    const countText = el("span");
    const hint = el("p", "rs-hint", S.hint);

    count.append(el("i"), countText, el("i"));
    meta.append(count, hint);

    /* finale */

    const finale = el("div", "rs-finale");

    finale.hidden = true;

    const finaleText = el("p", "rs-finale-text");

    lines(finaleText, S.finaleText);

    const finaleBtn = el("button", "rs-finale-btn");

    finaleBtn.type = "button";
    finaleBtn.append(document.createTextNode(S.finaleButton + " "), el("span", "", "→"));

    finale.append(finaleText, finaleBtn);

    scroll.append(closeBtn, head, stage, meta, finale);
    overlay.append(ambience, scroll);
    page.appendChild(overlay);


    /* ---------- UI updates ---------- */

    function assignSlots() {

        cards.forEach((c, slot) => {
            c.card.dataset.slot = String(slot);
        });

    }

    function updateCount() {

        countText.textContent = pad(currentReason + 1) + " / " + total;

        const r = reasons[currentReason];

        live.textContent = "Reason " + r.number + " of " + total + ": " + r.text;

    }


    /* ---------- advance ---------- */

    function startFinal() {

        stack.dataset.final = "1";

        hint.classList.add("is-hidden");

        const extra = ambience.querySelectorAll(".rs-petal-extra").length;

        if (!extra && !reduceMotion()) {

            for (let i = 0; i < 7; i++) {

                const petal = el("span", "rs-petal rs-petal-extra");

                petal.style.cssText =
                    "--x:" + Math.round(Math.random() * 92 + 4) + "%; --size:" + (10 + Math.round(Math.random() * 5)) +
                    "px; --delay:" + (Math.random() * 3).toFixed(1) + "s; --duration:" + (18 + Math.round(Math.random() * 8)) + "s;";

                ambience.appendChild(petal);

            }

        }

        later(() => {

            finished = true;

            finale.hidden = false;

            void finale.offsetWidth;

            finale.classList.add("is-shown");

            if (typeof finale.scrollIntoView === "function") {
                finale.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }

            finaleBtn.focus({ preventScroll: true });

            isTransitioning = false;

        }, ms(S.finalMs));

    }

    function advance() {

        if (!isOpen || isTransitioning || finished || currentReason >= total - 1) {
            return;
        }

        isTransitioning = true;

        const front = cards[0];

        front.card.classList.add("is-lift");              /* 1. naik sedikit */

        later(() => {

            front.card.classList.remove("is-lift");
            front.card.classList.add("is-leaving");

            currentReason += 1;

            cards.push(cards.shift());                    /* 2-4. geser ke belakang, kartu berikut maju */
            assignSlots();

            updateCount();                                /* 5. nomor berubah */

            const refillIndex = currentReason + 2;

            later(() => {
                renderCard(front, refillIndex);           /* isi ulang saat sudah tak terlihat */
            }, ms(350));

            later(() => front.card.classList.remove("is-leaving"), ms(300));

            if (currentReason === total - 1) {

                startFinal();

            } else {

                later(() => { isTransitioning = false; }, ms(S.moveMs));

            }

        }, ms(S.liftMs));

    }


    /* ---------- open / close ---------- */

    function openOverlay(options) {

        if (isOpen) {
            return;
        }

        callbacks = options || {};

        clearTimeout(hideTimer);
        clearAll();

        isOpen = true;
        isTransitioning = true;
        finished = false;
        currentReason = 0;

        delete stack.dataset.final;

        hint.classList.remove("is-hidden");
        finale.hidden = true;
        finale.classList.remove("is-shown");

        ambience.querySelectorAll(".rs-petal-extra").forEach((n) => n.remove());

        [0, 1, 2].forEach((i) => {
            cards[i].card.classList.remove("is-lift", "is-leaving");
            renderCard(cards[i], i);
        });

        assignSlots();
        updateCount();

        overlay.hidden = false;
        overlay.classList.add("is-intro");

        void overlay.offsetWidth;

        overlay.classList.add("is-open");
        page.classList.add("is-reasons");
        root.classList.add("rs-lock");

        later(() => overlay.classList.remove("is-intro"), ms(S.introMs) + 300);
        later(() => { isTransitioning = false; }, ms(S.introMs));
        later(() => stage.focus({ preventScroll: true }), 120);

    }

    function closeOverlay(kind) {

        if (!isOpen) {
            return;
        }

        isOpen = false;

        clearAll();

        overlay.classList.remove("is-open", "is-intro");
        page.classList.remove("is-reasons");
        root.classList.remove("rs-lock");

        hideTimer = setTimeout(() => { overlay.hidden = true; }, reduceMotion() ? 20 : 520);

        const cb = callbacks;

        callbacks = {};

        if (kind === "finish") {

            if (typeof cb.onFinish === "function") { cb.onFinish(); }

        } else if (typeof cb.onClose === "function") {

            cb.onClose();

        }

    }


    /* ---------- events (dipasang SEKALI) ---------- */

    stage.addEventListener("click", () => {

        if (suppressClick) {
            return;
        }

        advance();

    });

    let touchStart = null;

    stage.addEventListener("touchstart", (event) => {

        const t = event.changedTouches[0];

        touchStart = { x: t.clientX, y: t.clientY };

    }, { passive: true });

    stage.addEventListener("touchend", (event) => {

        if (!touchStart) {
            return;
        }

        const t = event.changedTouches[0];
        const dx = t.clientX - touchStart.x;
        const dy = t.clientY - touchStart.y;

        touchStart = null;

        if (Math.abs(dx) > 50 && Math.abs(dy) < 60) {

            suppressClick = true;

            setTimeout(() => { suppressClick = false; }, 400);

            advance();

        }

    }, { passive: true });

    stage.addEventListener("keydown", (event) => {

        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            advance();
        }

    });

    overlay.addEventListener("keydown", (event) => {

        if (event.key === "Escape") {
            closeOverlay("close");
        }

    });

    closeBtn.addEventListener("click", () => closeOverlay("close"));
    finaleBtn.addEventListener("click", () => closeOverlay("finish"));


    /* ---------- API untuk message.js ---------- */

    window.enterMessageReasons = openOverlay;
    window.exitMessageReasons = () => closeOverlay("close");
    window.getReasonsState = () => ({
        isOpen: isOpen,
        currentReason: currentReason,
        isTransitioning: isTransitioning,
        finished: finished
    });

});