/* ==========================================
   JOURNEY — "OUR JOURNEY · WATCH YOU BLOOM"
   (Phase 08)
   ==========================================
   Pasangan = bunga, kamu = daun yang selalu menemani.
   File ini membangun seluruh isi #journeySection sendiri (tanpa tempel
   HTML) dan memuat css/journey.css otomatis bila belum di-link.

   Navigasi hub, progress "visited" Phase 05, dan audio global
   (music.js) tidak disentuh — hanya video Journey yang dijeda saat keluar.
*/

/* ==========================================
   >>> EDIT DI SINI: DATA <<<
========================================== */

/* ---------- Opening ---------- */

const journeyOpening = {
    label: "Watch you bloom",
    title: "Our Journey",
    subtitle: "Look how far you’ve come.",
    tagline: "A year of courage, growth, and beautiful moments.",
    photo: "/assets/journey/opening-photo.jpg",     /* foto kecil di opening */
    photoCaption: "where it all grew"
};

/* ---------- Milestone ----------
   type     : "competition" (badge + easter egg LKS)
              "ranking"     (report card, angka ranking, bintang)
              "performance" (tiket pertunjukan, spotlight, video)
              "generic"     (tanpa elemen khusus)
   layout   : "left" | "right" | "center" | "collage"
   decoration: "peony" | "leaf" | "none"
   pride    : 1-5 (jumlah hati terisi) atau "infinite"
   bloom    : "normal" | "full"  (kepenuhan bunga di batang)
   media    : banyak item. type "image" atau "video".
              Video: pakai poster; tidak autoplay.
   Tambah milestone = salin satu blok objek. */

const journeyMilestones = [
    {
        id: "lks-pharmacy",
        type: "competition",
        date: "[DATE]",
        category: "COMPETITION",
        title: "LKS FARMASI",
        kicker: "SECOND PLACE",
        tagline: "The courage to compete",
        achievement: "Juara 2",
        badge: { number: "2", text: "2ND PLACE" },
        description: "[Tulis cerita di sini — proses, latihan, rasa lelah, dan kerja kerasnya.]",
        location: "[Lokasi]",
        myNote: "[Tulis pesan pribadi di sini]",
        media: [
            { type: "image", src: "/assets/journey/lks-photo.jpg", caption: "[Caption]" },
            { type: "video", src: "/assets/journey/lks-video.mp4", poster: "/assets/journey/lks-poster.jpg", caption: "[Caption]" }
        ],
        layout: "left",
        decoration: "peony",
        pride: 5,
        bloom: "normal"
    },
    {
        id: "class-ranking",
        type: "ranking",
        date: "[DATE]",
        category: "ACADEMIC",
        title: "ALWAYS AMONG THE BEST",
        tagline: "Consistency looks beautiful on you.",
        achievement: "Ranking kelas",
        rank: "#1",                                   /* TODO: ganti ranking asli */
        rankLabel: "Class rank",
        stars: 5,
        stickyText: "Top of the class,\ntop of my heart. ♡",
        description: "[Tulis cerita di sini]",
        location: "",
        myNote: "[Tulis pesan pribadi di sini]",
        media: [
            { type: "image", src: "/assets/journey/rank-photo.jpg", caption: "[Caption]" }
        ],
        layout: "right",
        decoration: "leaf",
        pride: 5,
        bloom: "normal"
    },
    {
        id: "dance-performance",
        type: "performance",
        date: "[DATE]",
        category: "PERFORMANCE",
        title: "WHEN YOU DANCE, YOU SHINE",
        tagline: "The stage was made for you.",
        achievement: "Penampilan tari",
        description: "[Tulis cerita di sini]",
        location: "[Lokasi]",
        myNote: "[Tulis pesan pribadi di sini]",
        media: [
            { type: "video", src: "/assets/journey/dance-video.mp4", poster: "/assets/journey/dance-poster.jpg", caption: "[Caption penampilan]" },
            { type: "image", src: "/assets/journey/dance-backstage.jpg", caption: "[Caption backstage / kostum]" }
        ],
        layout: "center",
        decoration: "peony",
        pride: "infinite",
        bloom: "full"
    }
];

/* ---------- Finale ---------- */

const journeyFinale = {
    photo: "/assets/journey/finale-photo.jpg",        /* foto terbaik di tengah taman */
    kicker: "Look how far you’ve come",
    lines: ["You kept growing,", "and I was lucky enough", "to be there watching you bloom."],
    signature: "— Your forever leaf",
    button: "Back to Our Little World"
};

/* ---------- Teks kecil & easter egg ---------- */

const journeyText = {
    noteLabel: "A note from me:",
    noteDefault: "I noticed every effort behind this achievement.",
    prideLabel: "How proud I am of you",
    prideInfinite: "Pride level: infinite",
    missing: "foto / video akan segera hadir ♡"
};

const journeyEggs = {
    flower: "You made me proud again. ♡",
    leaf: "Still here, cheering for you.",
    lks: "Second place in the competition,\nfirst place in my heart. ♡",
    dance: "Warning: she may steal the spotlight again. ♡"
};


document.addEventListener("DOMContentLoaded", () => {

    const section = document.getElementById("journeySection");

    if (!section || window.__jnReady) {
        return;
    }

    window.__jnReady = true;

    /* CSS dimuat otomatis bila belum ter-link */

    if (
        !document.querySelector('link[href*="journey.css"]') &&
        !(window.getComputedStyle && getComputedStyle(section).getPropertyValue("--jn-ease").trim())
    ) {

        const link = document.createElement("link");

        link.rel = "stylesheet";
        link.href = "css/journey.css";

        document.head.appendChild(link);

    }


    /* ---------- helpers ---------- */

    const NS = "http://www.w3.org/2000/svg";

    function el(tag, className, text) {

        const node = document.createElement(tag);

        if (className) { node.className = className; }
        if (text) { node.textContent = text; }

        return node;

    }

    function step(node, n) {

        node.classList.add("jn-r");
        node.style.setProperty("--s", String(n));

        return node;

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

    function photo(className, src, alt) {

        const image = document.createElement("img");

        image.className = className;
        image.alt = alt || "";
        image.loading = "lazy";
        image.decoding = "async";
        image.draggable = false;

        image.addEventListener("error", () => {
            image.style.visibility = "hidden";
        });

        image.src = src;

        return image;

    }

    function deco(className, src) {

        const image = document.createElement("img");

        image.className = "jn-deco " + className;
        image.alt = "";
        image.setAttribute("aria-hidden", "true");
        image.draggable = false;
        image.addEventListener("error", () => { image.style.display = "none"; });
        image.src = src;

        return image;

    }

    function svg(html, className, viewBox) {

        const node = document.createElementNS(NS, "svg");

        node.setAttribute("viewBox", viewBox);
        node.setAttribute("class", className);
        node.setAttribute("aria-hidden", "true");
        node.innerHTML = html;

        return node;

    }

    /* bunga SVG: kelopak tumbuh dari tengah saat .is-bloom aktif */

    function flower(petals, className) {

        let html = "";

        for (let i = 0; i < petals; i++) {

            html +=
                '<g transform="rotate(' + (i * 360 / petals) + ')">' +
                '<ellipse class="jn-petal" style="--i:' + i + '" cx="0" cy="-21" rx="' + (petals > 8 ? 8 : 10) + '" ry="21"/></g>';

        }

        html += '<circle class="jn-flower-core" r="8"/>';

        return svg(html, "jn-flower " + (className || ""), "-50 -50 100 100");

    }

    function leaf(className) {

        return svg(
            '<path class="jn-leaf-body" d="M20 58C2 40 4 14 20 2c16 12 18 38 0 56z"/>' +
            '<path class="jn-leaf-vein" d="M20 56V10"/>',
            "jn-leaf " + (className || ""),
            "0 0 40 60"
        );

    }


    /* ---------- state ---------- */

    const pending = new Set();
    const videos = [];
    let toastTimer = 0;
    let busyBack = false;

    function later(fn, delay) {

        const id = setTimeout(() => { pending.delete(id); fn(); }, delay);

        pending.add(id);

        return id;

    }


    /* ---------- build: shell ---------- */

    /* PENTING: app.js sudah memasang aksi "kembali ke hub" pada tombol
       [data-back] yang ada SEKARANG. Tombol itu dipakai ulang (bukan dibuat
       baru) supaya aksi tersebut tidak hilang saat isi halaman dibangun ulang. */

    const originalBack = section.querySelector("[data-back]");

    section.classList.add("jn-page");
    section.textContent = "";

    const bg = el("div", "jn-bg");
    const glow = el("div", "jn-hero-glow");
    const ambience = el("div", "jn-ambience");

    [[6, 10, 170, 0, 13], [84, 36, 140, 2, 12], [8, 66, 160, 1, 14], [80, 88, 150, 3, 13]].forEach((b) => {

        const span = el("span", "bokeh");

        span.style.cssText = "--x:" + b[0] + "%; --y:" + b[1] + "%; --size:" + b[2] + "px; --delay:" + b[3] + "s; --duration:" + b[4] + "s;";

        ambience.appendChild(span);

    });

    [[18, 18, 0.2], [82, 24, 1.3], [12, 52, 0.8], [90, 62, 2.1], [50, 90, 1.6]].forEach((g) => {

        const span = el("span", "glitter");

        span.style.cssText = "--x:" + g[0] + "%; --y:" + g[1] + "%; --delay:" + g[2] + "s;";

        ambience.appendChild(span);

    });

    [[12, 12, 0, 24], [40, 10, 8, 28], [66, 13, 3, 26], [90, 11, 14, 27]].forEach((p) => {

        const span = el("span", "jn-petal-fall");

        span.style.cssText = "--x:" + p[0] + "%; --size:" + p[1] + "px; --delay:" + p[2] + "s; --duration:" + p[3] + "s;";

        ambience.appendChild(span);

    });

    const content = el("div", "jn-content");

    const backTop = originalBack || el("button");

    backTop.className = "jn-back";
    backTop.type = "button";
    backTop.setAttribute("data-back", "");
    backTop.innerHTML =
        '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg><span>Back to Our Little World</span>';

    content.appendChild(backTop);


    /* ---------- build: opening ---------- */

    const hero = el("header", "jn-hero");

    const plant = svg(
        '<path class="jn-hero-stem" pathLength="1" d="M60 214C60 170 56 130 60 84"/>' +
        '<g class="jn-hero-leaf"><path d="M60 150C84 146 98 130 100 110C78 112 62 128 60 150z"/><path class="jn-leaf-vein" d="M62 146C74 136 86 124 96 114"/></g>' +
        '<g class="jn-hero-bud">' +
        '<path class="jn-bud-sepal" d="M48 86C50 96 70 96 72 86C66 90 54 90 48 86z"/>' +
        '<ellipse class="jn-bud-petal-b" cx="60" cy="68" rx="15" ry="22"/>' +
        '<ellipse class="jn-bud-petal-l" cx="52" cy="70" rx="9" ry="19" transform="rotate(-12 52 70)"/>' +
        '<ellipse class="jn-bud-petal-r" cx="68" cy="70" rx="9" ry="19" transform="rotate(12 68 70)"/>' +
        "</g>",
        "jn-hero-plant",
        "0 0 120 220"
    );

    hero.append(
        plant,
        step(el("p", "jn-hero-label", journeyOpening.label), 0),
        el("h2", "jn-hero-title", journeyOpening.title),
        el("p", "jn-hero-subtitle", journeyOpening.subtitle),
        el("p", "jn-hero-tagline", journeyOpening.tagline)
    );

    const heroPhoto = el("figure", "jn-hero-photo");
    const heroFrame = el("span", "jn-hero-photo-frame");

    heroFrame.appendChild(photo("", journeyOpening.photo, journeyOpening.photoCaption));
    heroPhoto.append(heroFrame, el("span", "jn-tape"));

    if (journeyOpening.photoCaption) {
        heroPhoto.appendChild(el("figcaption", "", journeyOpening.photoCaption));
    }

    hero.appendChild(heroPhoto);
    hero.append(el("span", "jn-hero-spark jn-hero-spark-a"), el("span", "jn-hero-spark jn-hero-spark-b"));

    content.appendChild(hero);


    /* ---------- build: media viewer ---------- */

    function mediaLayer(item) {

        const layer = el("div", "jn-layer");
        const missing = el("span", "jn-missing", journeyText.missing);

        layer.appendChild(missing);

        if (item.type === "video") {

            const video = document.createElement("video");

            video.controls = true;               /* play/pause + fullscreen */
            video.playsInline = true;
            video.preload = "metadata";
            video.autoplay = false;              /* tanpa autoplay bersuara */
            video.setAttribute("controlslist", "nodownload");

            if (item.poster) { video.poster = item.poster; }

            video.addEventListener("error", () => {
                layer.classList.add("is-missing");
                video.controls = false;
            });

            video.src = item.src;

            videos.push(video);
            layer.appendChild(video);

        } else {

            const image = document.createElement("img");

            image.alt = item.caption || "";
            image.draggable = false;
            image.addEventListener("error", () => layer.classList.add("is-missing"));
            image.src = item.src;

            layer.appendChild(image);

        }

        return layer;

    }

    function buildMedia(m) {

        const items = (m.media && m.media.length) ? m.media : [{ type: "image", src: "", caption: "" }];

        const figure = el("figure", "jn-media jn-frame-" + m.type);
        const stage = el("div", "jn-media-stage");
        const caption = el("figcaption", "jn-caption");

        let current = 0;
        let busy = false;

        stage.appendChild(mediaLayer(items[0]));
        stage.firstChild.classList.add("is-in");
        caption.textContent = items[0].caption || "";

        figure.append(stage, caption);

        if (m.type === "performance") {
            figure.appendChild(el("span", "jn-ticket-stub"));
        } else {
            figure.appendChild(el("span", "jn-tape"));
        }

        if (items.length > 1) {

            const thumbs = el("div", "jn-thumbs");

            items.forEach((item, i) => {

                const btn = el("button", "jn-thumb");

                btn.type = "button";
                btn.setAttribute("aria-label", "Lihat " + (item.type === "video" ? "video" : "foto") + " " + (i + 1));

                if (i === 0) { btn.classList.add("is-active"); }

                const src = item.type === "video" ? item.poster : item.src;

                if (src) { btn.appendChild(photo("", src, "")); }

                if (item.type === "video") { btn.appendChild(el("span", "jn-thumb-play", "▶")); }

                btn.addEventListener("click", () => {

                    if (busy || i === current) {
                        return;
                    }

                    busy = true;

                    const old = stage.querySelector(".jn-layer.is-in");
                    const next = mediaLayer(item);

                    stage.appendChild(next);

                    void next.offsetWidth;

                    next.classList.add("is-in");                 /* crossfade */

                    if (old) {

                        old.classList.remove("is-in");

                        const v = old.querySelector("video");

                        if (v) { v.pause(); }

                    }

                    caption.classList.add("is-swap");

                    later(() => {

                        caption.textContent = item.caption || "";
                        caption.classList.remove("is-swap");

                    }, 220);

                    later(() => {

                        if (old) { old.remove(); }

                        busy = false;

                    }, 520);

                    thumbs.querySelectorAll(".jn-thumb").forEach((t, k) => t.classList.toggle("is-active", k === i));

                    current = i;

                });

                thumbs.appendChild(btn);

            });

            figure.appendChild(thumbs);

        }

        return figure;

    }


    /* ---------- build: milestone ---------- */

    function prideMeter(m) {

        const wrap = el("div", "jn-pride");
        const infinite = m.pride === "infinite";
        const count = infinite ? 5 : Math.max(0, Math.min(5, Number(m.pride) || 0));
        const hearts = el("span", "jn-pride-hearts");

        for (let i = 0; i < 5; i++) {

            const heart = el("span", "jn-heart", "♥");

            heart.style.setProperty("--i", String(i));

            if (i < count) { heart.classList.add("is-on"); }

            hearts.appendChild(heart);

        }

        wrap.append(el("p", "jn-pride-label", journeyText.prideLabel), hearts);

        if (infinite) {
            wrap.classList.add("is-infinite");
            wrap.appendChild(el("p", "jn-pride-infinite", journeyText.prideInfinite));
        }

        return wrap;

    }

    function eggButton(className, egg, label, child) {

        const btn = el("button", "jn-egg " + className);

        btn.type = "button";
        btn.dataset.egg = egg;
        btn.setAttribute("aria-label", label);

        btn.appendChild(child);

        return btn;

    }

    function buildMilestone(m, index) {

        const layout = m.layout || "left";
        const item = el("article", "jn-item jn-layout-" + layout + " jn-type-" + (m.type || "generic"));

        item.dataset.index = String(index);
        item.style.setProperty("--rot", (index % 2 ? 2 : -2) + "deg");

        if (m.bloom === "full") { item.classList.add("jn-bloom-full"); }

        /* titik di batang: daun + bunga */

        const node = el("div", "jn-node");

        node.append(
            eggButton("jn-egg-leaf", "leaf", "Daun", leaf("")),
            el("span", "jn-node-dot"),
            eggButton("jn-egg-bloom", "flower", "Bunga", flower(m.bloom === "full" ? 12 : 8, ""))
        );

        item.appendChild(node);

        const card = el("div", "jn-card");

        /* --- media column --- */

        const mediaCol = el("div", "jn-media-col");

        step(mediaCol, 1).dataset.anim = layout === "right" ? "from-right" : layout === "center" || layout === "collage" ? "up" : "from-left";

        if (m.type === "performance") {

            mediaCol.appendChild(el("div", "jn-spotlight"));

            mediaCol.appendChild(svg(
                '<path class="jn-trail" pathLength="1" d="M4 80C40 10 90 110 140 40S220 20 296 60"/>' +
                '<path class="jn-trail jn-trail-2" pathLength="1" d="M4 96C50 30 100 120 150 58S230 40 296 78"/>',
                "jn-motion-trail",
                "0 0 300 120"
            ));

            for (let i = 0; i < 4; i++) {

                const p = el("span", "jn-diag-petal");

                p.style.setProperty("--i", String(i));

                mediaCol.appendChild(p);

            }

        }

        mediaCol.appendChild(buildMedia(m));

        if (m.type === "competition" && m.badge) {

            const badge = el("div", "jn-badge");

            badge.append(
                el("span", "jn-badge-num", m.badge.number),
                el("span", "jn-badge-text", m.badge.text)
            );

            mediaCol.appendChild(eggButton("jn-egg-badge", "lks", m.badge.text, badge));

        }

        if (m.type === "performance") {

            mediaCol.appendChild(eggButton("jn-egg-dance", "dance", "Kejutan penampilan", el("span", "jn-dance-star", "✦")));

        }

        if (m.type === "ranking") {

            const report = el("div", "jn-report");

            const rankNum = el("p", "jn-rank-num");

            rankNum.dataset.text = m.rank || "";
            rankNum.setAttribute("aria-label", m.rank || "");

            const stars = el("p", "jn-stars");

            stars.setAttribute("aria-hidden", "true");

            for (let i = 0; i < (m.stars || 5); i++) {

                const star = el("span", "jn-star", "★");

                star.style.setProperty("--i", String(i));
                stars.appendChild(star);

            }

            const sticky = el("p", "jn-sticky");

            lines(sticky, m.stickyText || "");

            report.append(
                el("span", "jn-clip"),
                el("p", "jn-report-title", "Report card"),
                el("p", "jn-rank-label", m.rankLabel || "Rank"),
                rankNum,
                el("span", "jn-underline"),
                stars,
                sticky
            );

            mediaCol.appendChild(report);

        }

        /* --- text column --- */

        const textCol = el("div", "jn-text-col");

        const meta = el("p", "jn-meta");

        meta.append(el("span", "jn-date", m.date), el("span", "jn-cat", m.category));

        textCol.appendChild(step(meta, 1));
        textCol.appendChild(step(el("h3", "jn-title", m.title), 2));

        if (m.kicker) { textCol.appendChild(step(el("p", "jn-kicker", m.kicker), 3)); }

        if (m.tagline) { textCol.appendChild(step(el("p", "jn-tagline", m.tagline), 3)); }

        const desc = el("p", "jn-desc", m.description);

        textCol.appendChild(step(desc, 4));

        if (m.location) {
            textCol.appendChild(step(el("p", "jn-loc", "♡ " + m.location), 5));
        }

        textCol.appendChild(step(prideMeter(m), 5));

        const note = el("div", "jn-note");

        note.append(
            el("span", "jn-tape jn-tape-sm"),
            el("p", "jn-note-label", journeyText.noteLabel),
            el("p", "jn-note-text", m.myNote && !/^\[/.test(m.myNote) ? m.myNote : (m.myNote || journeyText.noteDefault))
        );

        textCol.appendChild(step(note, 7));          /* My Note muncul terakhir */

        card.append(mediaCol, textCol);
        item.appendChild(card);

        if (m.decoration === "peony") {
            item.appendChild(deco("jn-deco-peony", "/assets/images/botanical/peony.png"));
        } else if (m.decoration === "leaf") {
            item.appendChild(deco("jn-deco-leaf", "/assets/images/botanical/leaves.webp"));
        }

        /* kelopak & sparkle lembut sekali saat muncul */

        item.append(el("span", "jn-burst jn-burst-a"), el("span", "jn-burst jn-burst-b"));

        return item;

    }


    /* ---------- build: path (batang tanaman) ---------- */

    const path = el("section", "jn-path");

    path.setAttribute("aria-label", "The Growing Path");

    const pathHead = el("div", "jn-path-head");

    pathHead.append(
        el("p", "jn-path-label", "The growing path"),
        el("span", "jn-path-rule")
    );

    const stem = el("div", "jn-stem");
    const stemFill = el("span", "jn-stem-fill");

    stem.appendChild(stemFill);

    path.append(pathHead, stem);

    journeyMilestones.forEach((m, i) => path.appendChild(buildMilestone(m, i)));

    content.appendChild(path);


    /* ---------- build: finale ---------- */

    const finale = el("section", "jn-finale");

    const garden = el("div", "jn-garden");

    garden.appendChild(el("div", "jn-garden-glow"));
    garden.appendChild(svg('<path class="jn-garden-stem" pathLength="1" d="M60 220C60 150 62 90 60 20"/>', "jn-garden-plant", "0 0 120 220"));

    [
        ["jn-g-f1", 12], ["jn-g-f2", 8], ["jn-g-f3", 12], ["jn-g-f4", 8], ["jn-g-f5", 8]
    ].forEach((f, i) => {

        const fl = flower(f[1], "jn-garden-flower " + f[0]);

        fl.style.setProperty("--g", String(i));

        garden.appendChild(fl);

    });

    ["jn-g-l1", "jn-g-l2", "jn-g-l3", "jn-g-l4", "jn-g-l5", "jn-g-l6"].forEach((c, i) => {

        const lf = leaf("jn-garden-leaf " + c);

        lf.style.setProperty("--g", String(i));

        garden.appendChild(lf);

    });

    const gPhoto = el("figure", "jn-garden-photo");
    const gFrame = el("span", "jn-garden-photo-frame");

    gFrame.appendChild(photo("", journeyFinale.photo, "Foto terbaik"));
    gPhoto.append(gFrame, el("span", "jn-tape"));
    garden.appendChild(gPhoto);

    for (let i = 0; i < 5; i++) {

        const p = el("span", "jn-garden-petal");

        p.style.setProperty("--i", String(i));
        garden.appendChild(p);

    }

    finale.appendChild(garden);

    const finaleKicker = step(el("h2", "jn-finale-kicker", journeyFinale.kicker), 6);

    finale.appendChild(finaleKicker);

    const finaleLines = step(el("p", "jn-finale-lines"), 7);

    journeyFinale.lines.forEach((line, i) => {

        const span = el("span", "jn-finale-line", line);

        span.style.setProperty("--l", String(i));
        finaleLines.appendChild(span);

    });

    finale.appendChild(finaleLines);
    finale.appendChild(step(el("p", "jn-finale-signature", journeyFinale.signature), 10));

    const finaleBtn = step(el("button", "jn-finale-btn"), 11);

    finaleBtn.type = "button";
    finaleBtn.append(document.createTextNode(journeyFinale.button + " "), el("span", "", "→"));

    finale.appendChild(finaleBtn);

    content.appendChild(finale);

    const toast = el("p", "jn-toast");

    toast.setAttribute("aria-live", "polite");

    section.append(bg, glow, ambience, content, toast);


    /* ---------- typewriter angka ranking ---------- */

    function typeRank(node) {

        const text = node.dataset.text || "";

        if (!text || node.dataset.typed) {
            return;
        }

        node.dataset.typed = "1";

        if (reduceMotion()) {
            node.textContent = text;
            return;
        }

        let i = 0;

        (function tick() {

            i += 1;

            node.textContent = text.slice(0, i);

            if (i < text.length) {
                later(tick, 160);
            }

        })();

    }


    /* ---------- reveal sekali (IntersectionObserver) ---------- */

    const targets = Array.from(section.querySelectorAll(".jn-path-head, .jn-item, .jn-finale"));

    let revealed = 0;
    let observer = null;

    function onReveal(target) {

        target.classList.add("is-visible");

        revealed += 1;

        const rank = target.querySelector(".jn-rank-num");

        if (rank) {
            later(() => typeRank(rank), reduceMotion() ? 0 : 900);
        }

        updateStem();

        if (revealed >= targets.length && observer) {
            observer.disconnect();                 /* semua sudah tampil -> bersihkan */
            observer = null;
        }

    }

    if ("IntersectionObserver" in window) {

        observer = new IntersectionObserver((entries) => {

            entries.forEach((entry) => {

                if (!entry.isIntersecting || entry.target.classList.contains("is-visible")) {
                    return;
                }

                observer.unobserve(entry.target);

                onReveal(entry.target);

            });

        }, { threshold: 0.18, rootMargin: "0px 0px -6% 0px" });

        targets.forEach((t) => observer.observe(t));

    } else {

        targets.forEach(onReveal);

    }

    /* Keadaan awal "tersembunyi" + semua animasi hanya aktif lewat .jn-motion.
       Tanpa kelas ini (reduced motion / JS gagal) semua konten langsung tampil. */

    if (!reduceMotion()) {
        section.classList.add("jn-motion");
    }


    /* ---------- batang memanjang saat scroll (hanya bertambah) ---------- */

    let maxProgress = 0;
    let ticking = false;

    function updateStem() {

        ticking = false;

        if (section.classList.contains("hidden-section")) {
            return;
        }

        let progress;

        if (reduceMotion()) {

            progress = 1;

        } else {

            const rect = path.getBoundingClientRect();

            progress = Math.min(1, Math.max(0, (window.innerHeight * 0.78 - rect.top) / Math.max(1, rect.height)));

        }

        if (progress > maxProgress) {

            maxProgress = progress;

            stemFill.style.height = (progress * 100) + "%";

        }

        if (maxProgress >= 1) {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        }

    }

    function onScroll() {

        if (!ticking) {
            ticking = true;
            window.requestAnimationFrame(updateStem);
        }

    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });


    /* ---------- easter egg (satu listener, delegasi) ---------- */

    function showToast(text) {

        clearTimeout(toastTimer);

        lines(toast, text);

        toast.classList.remove("is-shown");

        void toast.offsetWidth;

        toast.classList.add("is-shown");

        toastTimer = setTimeout(() => toast.classList.remove("is-shown"), 2800);

    }

    path.addEventListener("click", (event) => {

        const btn = event.target.closest("[data-egg]");

        if (btn && journeyEggs[btn.dataset.egg]) {

            btn.classList.remove("is-poked");

            void btn.offsetWidth;

            btn.classList.add("is-poked");

            showToast(journeyEggs[btn.dataset.egg]);

        }

    });


    /* ---------- navigasi ---------- */

    function pauseVideos() {

        videos.forEach((v) => { if (!v.paused) { v.pause(); } });

    }

    /* tombol Back atas sudah dihubungkan ke hub oleh app.js ([data-back]
       pertama di section); di sini hanya menjeda video */

    backTop.addEventListener("click", pauseVideos);

    /* Cadangan: bila tombol Back asli tidak ditemukan (sehingga app.js tidak
       punya aksi untuknya), navigasi ke hub ditangani di sini. */

    if (!originalBack) {

        backTop.addEventListener("click", () => {

            const hub = document.getElementById("surpriseHub");

            if (!hub) {
                return;
            }

            section.classList.add("section-exit");

            setTimeout(() => {

                section.classList.remove("active-section", "section-exit");
                section.classList.add("hidden-section");

                hub.classList.remove("hidden-section");
                hub.classList.add("active-section");

                window.scrollTo({ top: 0, behavior: "instant" });

            }, 1000);

        });

    }

    finaleBtn.addEventListener("click", () => {

        if (busyBack) {
            return;
        }

        busyBack = true;

        later(() => { busyBack = false; }, 1500);

        backTop.click();                       /* satu jalur ke hub */

    });


    /* ---------- init ---------- */

    updateStem();

    window.getJourneyState = () => ({ revealed: revealed, progress: maxProgress });

});