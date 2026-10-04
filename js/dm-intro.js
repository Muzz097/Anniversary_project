/* ==========================================
   DM INTRO (sebelum Secret Code)
   Simulasi chat bergaya DM. Tidak terhubung ke
   Instagram, tidak mengirim apa pun.

   - Konten & durasi: js/dm-intro-config.js
   - Tidak membuat audio apa pun
   - Tidak membuat logic validasi kode baru:
     setelah selesai, section #secret-entrance
     yang lama hanya ditampilkan (app.js tetap
     yang menangani keypad & validasi).
========================================== */

(function () {

    "use strict";

    /* Cegah dobel inisialisasi */
    if (window.__dmIntroStarted) {
        return;
    }
    window.__dmIntroStarted = true;


    const CFG = window.DM_INTRO_CONFIG;

    const root = document.getElementById("dmIntro");
    const secret = document.getElementById("secret-entrance");

    /* Kalau config / elemen tidak ada, jangan
       sampai user terjebak: langsung buka Secret Code. */
    if (!CFG || !root || !Array.isArray(CFG.messages) || !CFG.messages.length) {

        if (root) {
            root.classList.remove("active-section");
            root.classList.add("hidden-section");
        }

        if (secret) {
            secret.classList.remove("hidden-section");
            secret.classList.add("active-section");
        }

        return;
    }


    const reducedMotion =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const T = CFG.timing;

    const timers = new Set();
    let destroyed = false;

    const refs = {};


    /* ---------- util ---------- */

    function wait(ms) {

        return new Promise((resolve) => {

            const id = setTimeout(() => {
                timers.delete(id);
                resolve();
            }, ms);

            timers.add(id);

        });

    }

    function rand(min, max) {
        return min + Math.random() * (max - min);
    }

    function el(tag, className, text) {

        const node = document.createElement(tag);

        if (className) node.className = className;
        if (text != null) node.textContent = text;

        return node;
    }

    function nowTime() {

        try {
            return new Date().toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit"
            });
        } catch (e) {
            return "";
        }

    }


    /* ---------- build DOM ---------- */

    function buildBackground() {

        const bg = el("div", "dm-bg");
        bg.setAttribute("aria-hidden", "true");

        const P = CFG.particles || {};
        const count = reducedMotion ? 0 : 1;

        for (let i = 0; i < (P.glowHearts || 0); i++) {
            const n = el("span", "dm-glow-heart");
            n.style.setProperty("--x", rand(5, 85).toFixed(0) + "%");
            n.style.setProperty("--y", rand(8, 80).toFixed(0) + "%");
            n.style.setProperty("--size", rand(130, 230).toFixed(0) + "px");
            n.style.setProperty("--dur", rand(11, 17).toFixed(1) + "s");
            n.style.setProperty("--delay", (-rand(0, 10)).toFixed(1) + "s");
            bg.appendChild(n);
        }

        for (let i = 0; i < (P.bokeh || 0); i++) {
            const n = el("span", "dm-bokeh");
            n.style.setProperty("--x", rand(0, 90).toFixed(0) + "%");
            n.style.setProperty("--y", rand(0, 90).toFixed(0) + "%");
            n.style.setProperty("--size", rand(70, 150).toFixed(0) + "px");
            n.style.setProperty("--dur", rand(9, 15).toFixed(1) + "s");
            n.style.setProperty("--delay", (-rand(0, 8)).toFixed(1) + "s");
            bg.appendChild(n);
        }

        if (count) {

            for (let i = 0; i < (P.loveHearts || 0); i++) {
                const n = el("span", "dm-love");
                n.style.setProperty("--x", rand(2, 96).toFixed(0) + "%");
                n.style.setProperty("--size", rand(10, 20).toFixed(0) + "px");
                n.style.setProperty("--dur", rand(14, 24).toFixed(1) + "s");
                n.style.setProperty("--delay", (-rand(0, 20)).toFixed(1) + "s");
                bg.appendChild(n);
            }

            for (let i = 0; i < (P.sparkles || 0); i++) {
                const n = el("span", "dm-sparkle");
                n.style.setProperty("--x", rand(4, 96).toFixed(0) + "%");
                n.style.setProperty("--y", rand(4, 96).toFixed(0) + "%");
                n.style.setProperty("--dur", rand(3, 5.5).toFixed(1) + "s");
                n.style.setProperty("--delay", (-rand(0, 5)).toFixed(1) + "s");
                bg.appendChild(n);
            }

        }

        return bg;
    }

    function buildAvatar() {

        const c = CFG.contact || {};

        const wrap = el("div", "dm-avatar");

        const fallback = el("span", "dm-avatar-fallback", c.fallbackInitial || "A");
        wrap.appendChild(fallback);

        if (c.avatar) {

            const img = new Image();
            img.alt = c.name || "";
            img.className = "dm-avatar-img";

            img.addEventListener("load", () => {
                fallback.style.display = "none";
                wrap.appendChild(img);
            });

            /* error: biarkan fallback inisial */
            img.src = c.avatar;

        }

        return wrap;
    }

    function build() {

        const c = CFG.contact || {};

        root.innerHTML = "";

        root.appendChild(buildBackground());

        const chat = el("div", "dm-chat");

        /* Header */
        const header = el("header", "dm-header");

        const back = el("span", "dm-back");
        back.setAttribute("aria-hidden", "true");
        back.textContent = "‹";

        const who = el("div", "dm-who");
        const name = el("p", "dm-name", c.name || "");
        const status = el("p", "dm-status");
        const dot = el("span", "dm-status-dot");
        const statusText = el("span", "dm-status-text", c.status || "");
        status.append(dot, statusText);
        status.setAttribute("aria-live", "polite");
        who.append(name, status);

        header.append(back, buildAvatar(), who);

        /* Pesan */
        const messages = el("div", "dm-messages");
        messages.setAttribute("role", "log");
        messages.setAttribute("aria-live", "polite");

        /* Bar input palsu (dekoratif) */
        const bar = el("div", "dm-inputbar");
        bar.setAttribute("aria-hidden", "true");
        bar.appendChild(el("span", "dm-input-text", CFG.inputPlaceholder || ""));
        bar.appendChild(el("span", "dm-input-heart"));

        chat.append(header, messages, bar);

        root.appendChild(chat);

        /* Layer untuk partikel pecahan bubble */
        const burst = el("div", "dm-burst");
        burst.setAttribute("aria-hidden", "true");
        root.appendChild(burst);

        refs.chat = chat;
        refs.messages = messages;
        refs.statusText = statusText;
        refs.burst = burst;
    }


    /* ---------- status header ---------- */

    function setStatus(typing) {

        const c = CFG.contact || {};

        refs.statusText.textContent =
            typing ? (c.typingLabel || "typing...") : (c.status || "");

        root.classList.toggle("is-typing", typing);

    }

    function scrollDown() {
        refs.messages.scrollTop = refs.messages.scrollHeight;
    }


    /* ---------- komponen chat ---------- */

    function createTyping(side) {

        const row = el("div", "dm-row dm-row-" + side + " dm-row-typing");

        const bubble = el("div", "dm-bubble dm-bubble-typing");
        bubble.setAttribute("aria-label", "typing");

        for (let i = 0; i < 3; i++) {
            bubble.appendChild(el("span", "dm-typing-dot"));
        }

        row.appendChild(bubble);

        return row;
    }

    function createBubble(msg) {

        const row = el("div", "dm-row dm-row-" + msg.side);

        const bubble = el("div", "dm-bubble", msg.text);

        const time = el("span", "dm-time", msg.time || nowTime());

        row.append(bubble, time);

        return { row, bubble };
    }

    function sparkleAround(bubble) {

        if (reducedMotion) return;

        const rect = bubble.getBoundingClientRect();
        const host = root.getBoundingClientRect();

        for (let i = 0; i < 6; i++) {

            const s = el("span", "dm-pop-sparkle");

            s.style.left =
                (rect.left - host.left + rand(0.1, 0.9) * rect.width) + "px";
            s.style.top =
                (rect.top - host.top + rand(-0.15, 1.1) * rect.height) + "px";
            s.style.setProperty("--delay", (i * 70) + "ms");

            refs.burst.appendChild(s);

            const id = setTimeout(() => {
                timers.delete(id);
                s.remove();
            }, 1400 + i * 70);

            timers.add(id);

        }

    }


    /* ---------- satu pesan ---------- */

    async function playMessage(msg) {

        /* typing... */
        const typing = createTyping(msg.side);
        refs.messages.appendChild(typing);
        setStatus(true);
        scrollDown();

        await wait(rand(T.typingMin, T.typingMax));
        if (destroyed) return null;

        typing.remove();
        setStatus(false);

        /* bubble */
        const made = createBubble(msg);
        refs.messages.appendChild(made.row);
        scrollDown();

        if (msg.important) {
            sparkleAround(made.bubble);
        }

        await wait(rand(T.pauseMin, T.pauseMax));
        if (destroyed) return null;

        return made.bubble;
    }


    /* ---------- transisi akhir ---------- */

    function heartBurstFrom(bubble) {

        const rect = bubble.getBoundingClientRect();
        const host = root.getBoundingClientRect();

        const cx = rect.left - host.left + rect.width / 2;
        const cy = rect.top - host.top + rect.height / 2;

        const total = reducedMotion ? 0 : 18;

        for (let i = 0; i < total; i++) {

            const h = el("span", i % 3 === 0 ? "dm-burst-spark" : "dm-burst-heart");

            const angle = rand(0, Math.PI * 2);
            const dist = rand(50, 150);

            h.style.left = (cx + rand(-rect.width / 3, rect.width / 3)) + "px";
            h.style.top = cy + "px";
            h.style.setProperty("--dx", Math.cos(angle) * dist + "px");
            h.style.setProperty("--dy", (Math.sin(angle) * dist - 30) + "px");
            h.style.setProperty("--size", rand(10, 20).toFixed(0) + "px");
            h.style.setProperty("--delay", rand(0, 250).toFixed(0) + "ms");
            h.style.setProperty("--dur", T.finalBurst + "ms");

            refs.burst.appendChild(h);

        }

    }

    function applySecretPanelText() {

        const P = CFG.secretPanel;

        if (!P || !P.enabled || !secret) return;

        const eyebrow = secret.querySelector(".eyebrow");
        const desc = secret.querySelector(".secret-description");
        const submit = document.getElementById("submit-code");

        if (eyebrow && P.eyebrow) eyebrow.textContent = P.eyebrow;
        if (desc && P.description) desc.textContent = P.description;
        if (submit && P.submitLabel) submit.textContent = P.submitLabel;

    }

    function revealSecret() {

        if (!secret) return;

        applySecretPanelText();

        secret.classList.remove("hidden-section");
        secret.classList.add("active-section", "dm-secret-enter");

        window.scrollTo({ top: 0, behavior: "instant" });

    }

    async function finish(finalBubble) {

        /* 1-2. glow + membesar */
        finalBubble.classList.add("dm-final-glow");
        await wait(T.finalGlow);
        if (destroyed) return;

        /* 3. berubah jadi partikel hati */
        heartBurstFrom(finalBubble);
        finalBubble.classList.add("dm-final-dissolve");
        await wait(T.finalBurst * 0.55);
        if (destroyed) return;

        /* 4-5. chat fade-out, Secret Code scale-in (crossfade) */
        root.style.setProperty("--dm-fade", T.fadeOut + "ms");
        root.classList.add("dm-leaving");
        revealSecret();

        await wait(T.fadeOut + 50);
        if (destroyed) return;

        root.classList.remove("active-section");
        root.classList.add("hidden-section");

        destroy();
    }


    /* ---------- lifecycle ---------- */

    function destroy() {

        destroyed = true;

        timers.forEach((id) => clearTimeout(id));
        timers.clear();

        window.removeEventListener("pagehide", destroy);

        /* bersihkan DOM berat (partikel) */
        root.innerHTML = "";

    }

    window.addEventListener("pagehide", destroy);

    window.dmIntro = { destroy };


    async function run() {

        build();

        await wait(T.startDelay);
        if (destroyed) return;

        let last = null;

        for (const msg of CFG.messages) {

            last = await playMessage(msg);

            if (destroyed || !last) return;

        }

        await finish(last);
    }

    function start() {

        run().catch((err) => {

            /* Kalau ada error apa pun, jangan jebak user */
            console.error("[dmIntro]", err);

            if (!destroyed) {
                revealSecret();
                root.classList.remove("active-section");
                root.classList.add("hidden-section");
                destroy();
            }

        });

    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start, { once: true });
    } else {
        start();
    }

})();