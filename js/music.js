/* ==========================================
   GLOBAL MUSIC PLAYER
   (Phase 09 — Our Playlist / "The Soundtrack of Us")
   ==========================================

   SATU <audio> untuk seluruh website. Halaman mana pun cukup
   memanggil window.musicPlayer.playTrack(id) — modul ini yang
   menghentikan lagu lama, memuat lagu baru, dan memberi tahu semua
   tampilan (halaman Playlist + mini bar) lewat subscribe().

   Autoplay: browser memblokir audio sebelum ada interaksi pengguna.
   Saat load, "The Beginning" (track isDefault) disiapkan dan dicoba
   diputar; kalau diblokir, tidak ada error — diputar pada klik/tekan
   tombol pertama di mana pun di website.
*/

(function () {

    "use strict";


    /* ==========================================
       >>> EDIT DI SINI: DATA LAGU <<<

       - title / artist  : ganti dengan judul & nama penyanyi asli
       - audioSrc        : file mp3 di /assets/audio/
       - coverSrc        : cover album di /assets/playlist/
       - description     : kalimat kecil di bagian Now Playing
       - order           : urutan putar (dipakai Next / Previous / Repeat All)
       - isDefault       : lagu yang jadi soundtrack awal website
                           (hanya boleh SATU yang true)
    ========================================== */

    const playlistTracks = [
        {
            id: "the-beginning",
            category: "THE BEGINNING",
            title: "Ganti judul lagu",
            artist: "Ganti nama penyanyi",
            audioSrc: "/assets/audio/the-beginning.mp3",
            coverSrc: "/assets/playlist/album-beginning.jpg",
            description: "Lagu yang mengingatkanku pada awal cerita kita.",
            order: 0,
            isDefault: true
        },
        {
            id: "the-moments",
            category: "THE MOMENTS",
            title: "Ganti judul lagu",
            artist: "Ganti nama penyanyi",
            audioSrc: "/assets/audio/the-moments.mp3",
            coverSrc: "/assets/playlist/album-moments.jpg",
            description: "Lagu untuk kenangan kecil kita.",
            order: 1,
            isDefault: false
        },
        {
            id: "the-future",
            category: "THE FUTURE",
            title: "Ganti judul lagu",
            artist: "Ganti nama penyanyi",
            audioSrc: "/assets/audio/the-future.mp3",
            coverSrc: "/assets/playlist/album-future.jpg",
            description: "Lagu untuk perjalanan kita berikutnya.",
            order: 2,
            isDefault: false
        }
    ];

    playlistTracks.sort((a, b) => a.order - b.order);


    /*
    false = setiap kali website dibuka, lagu awal SELALU The Beginning
            (cerita mulai lagi dari awal, soundtrack pun dari awal).
    true  = ingat lagu + posisi terakhir sebelum refresh.
    */

    const RESTORE_LAST_TRACK_ON_LOAD = false;

    const STORAGE_KEY = "ourLittleStory.audioState.v2";


    /*
    ==========================================
    STATE
    ==========================================
    */

    const audio = new Audio();

    audio.preload = "metadata";

    const state = {
        currentTrackId: null,
        isPlaying: false,
        hasStarted: false,
        isLoading: false,
        hasError: false,
        repeatAll: false,
        currentTime: 0,
        duration: 0
    };

    let pendingAutoplay = false;

    const listeners = new Set();


    /*
    ==========================================
    HELPERS
    ==========================================
    */

    function getTrackById(id) {

        return playlistTracks.find((track) => track.id === id) || null;

    }

    function getDefaultTrack() {

        return playlistTracks.find((track) => track.isDefault) || playlistTracks[0];

    }

    function getState() {

        return Object.assign(
            {},
            state,
            { track: getTrackById(state.currentTrackId) }
        );

    }

    function notify() {

        if ("mediaSession" in navigator) {

            try {

                navigator.mediaSession.playbackState =
                    state.isPlaying ? "playing" : "paused";

            } catch (error) { /* tidak didukung */ }

        }

        listeners.forEach((fn) => {

            try {
                fn(getState());
            } catch (error) {
                /* satu subscriber error tidak boleh merusak yang lain */
            }

        });

    }

    function saveState() {

        try {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({
                    repeatAll: state.repeatAll,
                    currentTrackId: state.currentTrackId,
                    currentTime: audio.currentTime || 0
                })
            );

        } catch (error) { /* localStorage tidak tersedia */ }

    }

    function loadStoredState() {

        try {

            const raw = localStorage.getItem(STORAGE_KEY);

            return raw ? JSON.parse(raw) : null;

        } catch (error) {

            return null;

        }

    }

    function guessMimeType(src) {

        const ext = String(src).split("?")[0].split(".").pop().toLowerCase();

        if (ext === "png") return "image/png";
        if (ext === "webp") return "image/webp";

        return "image/jpeg";

    }


    /*
    ==========================================
    MEDIA SESSION (lock screen / notifikasi HP)
    Tidak ada UI tambahan — hanya metadata + tombol dari sistem.
    Kalau browser tidak mendukung, semuanya dilewati tanpa error.
    ==========================================
    */

    function updateMediaSession(track) {

        if (!track || !("mediaSession" in navigator)) {
            return;
        }

        try {

            navigator.mediaSession.metadata = new MediaMetadata({
                title: track.title,
                artist: track.artist,
                album: "Our Playlist",
                artwork: [
                    {
                        src: track.coverSrc,
                        sizes: "512x512",
                        type: guessMimeType(track.coverSrc)
                    }
                ]
            });

        } catch (error) { /* MediaMetadata tidak didukung */ }

    }

    function setupMediaSessionHandlers() {

        if (!("mediaSession" in navigator)) {
            return;
        }

        const handlers = {
            play: () => play(),
            pause: () => pause(),
            previoustrack: () => playPreviousTrack(),
            nexttrack: () => playNextTrack()
        };

        Object.keys(handlers).forEach((action) => {

            try {
                navigator.mediaSession.setActionHandler(action, handlers[action]);
            } catch (error) { /* action ini tidak didukung */ }

        });

    }


    /*
    ==========================================
    PLAYBACK
    ==========================================
    */

    function attemptPlay() {

        let playPromise;

        try {
            playPromise = audio.play();
        } catch (error) {
            return;
        }

        if (!playPromise || typeof playPromise.then !== "function") {
            return;
        }

        playPromise
            .then(() => {

                pendingAutoplay = false;

            })
            .catch((error) => {

                /*
                NotAllowedError = autoplay diblokir (normal sebelum ada
                interaksi) -> coba lagi di interaksi pertama.
                Error lain (mis. file tidak ada / berpindah lagu terlalu
                cepat) tidak perlu dicoba ulang.
                */

                if (error && error.name === "NotAllowedError") {
                    pendingAutoplay = true;
                }

                state.isPlaying = false;

                notify();

            });

    }

    function setTrack(id, options) {

        const track = getTrackById(id);

        if (!track) {
            return;
        }

        const autoplay = !options || options.autoplay !== false;
        const startAt = (options && options.startAt) || 0;

        state.currentTrackId = id;
        state.isLoading = true;
        state.hasError = false;
        state.currentTime = startAt;
        state.duration = 0;

        /*
        Mengganti src pada SATU elemen audio otomatis menghentikan
        lagu sebelumnya — jadi mustahil ada dua lagu berjalan bersamaan.
        */

        audio.src = track.audioSrc;

        if (startAt) {
            audio.currentTime = startAt;
        }

        updateMediaSession(track);

        notify();

        if (autoplay) {
            attemptPlay();
        }

        saveState();

    }

    function play() {

        if (!state.currentTrackId) {

            setTrack(getDefaultTrack().id, { autoplay: true });

            return;

        }

        if (state.hasError) {
            return;
        }

        attemptPlay();

    }

    function pause() {

        pendingAutoplay = false;

        audio.pause();

        state.isPlaying = false;

        notify();

    }

    function togglePlay() {

        if (state.isPlaying) {

            pause();

        } else {

            play();

        }

    }

    /*
    playTrack(trackId)
    - lagu lain  -> lagu lama berhenti, lagu ini jadi aktif & diputar
    - lagu yang sama -> toggle play / pause
    */

    function playTrack(trackId) {

        if (!getTrackById(trackId)) {
            return;
        }

        if (state.currentTrackId === trackId) {

            togglePlay();

            return;

        }

        setTrack(trackId, { autoplay: true });

    }

    function stepTrack(direction) {

        const ids = playlistTracks.map((track) => track.id);

        const currentIndex = Math.max(0, ids.indexOf(state.currentTrackId));

        const nextIndex =
            (currentIndex + direction + ids.length) % ids.length;

        setTrack(ids[nextIndex], { autoplay: true });

    }

    function playNextTrack() {

        stepTrack(1);

    }

    function playPreviousTrack() {

        stepTrack(-1);

    }

    /*
    Lagu selesai:
    - Repeat All aktif  -> lanjut lagu berikutnya
                           (The Beginning -> The Moments -> The Future -> The Beginning)
    - Repeat All mati   -> berhenti; tombol play tetap bisa dipakai
    */

    function handleTrackEnded() {

        if (state.repeatAll) {

            playNextTrack();

            return;

        }

        state.isPlaying = false;

        notify();

    }

    function toggleRepeatAll() {

        state.repeatAll = !state.repeatAll;

        saveState();

        notify();

    }

    function setVolume(value) {

        audio.volume = Math.min(1, Math.max(0, value));

    }

    function seek(time) {

        if (!isFinite(time) || !state.duration) {
            return;
        }

        audio.currentTime = Math.min(
            audio.duration || 0,
            Math.max(0, time)
        );

    }

    function subscribe(fn) {

        listeners.add(fn);

        fn(getState());

        return () => listeners.delete(fn);

    }


    /*
    ==========================================
    AUDIO ELEMENT EVENTS
    ==========================================
    */

    audio.addEventListener("loadedmetadata", () => {

        state.duration = audio.duration || 0;
        state.isLoading = false;

        notify();

    });

    audio.addEventListener("timeupdate", () => {

        state.currentTime = audio.currentTime || 0;

        notify();

    });

    audio.addEventListener("play", () => {

        state.isPlaying = true;
        state.hasStarted = true;
        pendingAutoplay = false;

        notify();

    });

    audio.addEventListener("playing", () => {

        state.isPlaying = true;
        state.isLoading = false;

        notify();

    });

    audio.addEventListener("pause", () => {

        state.isPlaying = false;

        notify();

    });

    audio.addEventListener("waiting", () => {

        state.isLoading = true;

        notify();

    });

    audio.addEventListener("canplay", () => {

        state.isLoading = false;

        notify();

    });

    audio.addEventListener("ended", handleTrackEnded);

    audio.addEventListener("error", () => {

        /* file audio tidak ada / rusak: gagal dengan tenang */

        state.hasError = true;
        state.isLoading = false;
        state.isPlaying = false;

        notify();

    });

    setInterval(() => {

        if (state.isPlaying) {
            saveState();
        }

    }, 5000);


    /*
    ==========================================
    UNLOCK AUTOPLAY PADA INTERAKSI PERTAMA
    Memakai 'click' / 'keydown' (fase bubble) supaya kalau interaksi
    pertamanya adalah menekan tombol play, handler tombol jalan lebih
    dulu — tidak terjadi "play lalu langsung pause".
    ==========================================
    */

    function handleFirstInteraction() {

        if (state.hasStarted) {

            document.removeEventListener("click", handleFirstInteraction);
            document.removeEventListener("keydown", handleFirstInteraction);

            return;

        }

        if (pendingAutoplay && !state.isPlaying && !state.hasError) {
            attemptPlay();
        }

    }

    document.addEventListener("click", handleFirstInteraction);
    document.addEventListener("keydown", handleFirstInteraction);


    /*
    ==========================================
    INIT
    ==========================================
    */

    function init() {

        const stored = loadStoredState();

        state.repeatAll = !!(stored && stored.repeatAll);

        let startTrack = getDefaultTrack();
        let startAt = 0;

        if (
            RESTORE_LAST_TRACK_ON_LOAD &&
            stored &&
            getTrackById(stored.currentTrackId)
        ) {

            startTrack = getTrackById(stored.currentTrackId);
            startAt = stored.currentTime || 0;

        }

        audio.volume = 1;
        audio.muted = false;

        setupMediaSessionHandlers();

        pendingAutoplay = true;

        setTrack(startTrack.id, { autoplay: true, startAt: startAt });

    }

    document.addEventListener("DOMContentLoaded", init);


    /*
    ==========================================
    PUBLIC API
    ==========================================
    */

    window.musicPlayer = {
        tracks: playlistTracks,
        getState,
        subscribe,
        playTrack,
        play,
        pause,
        togglePlay,
        playNextTrack,
        playPreviousTrack,
        handleTrackEnded,
        toggleRepeatAll,
        setVolume,
        seek
    };

})();


/* ==========================================
   PLAYLIST PAGE + MINI BAR — UI WIRING
   ==========================================

   Hanya membaca state dari window.musicPlayer lalu memperbarui
   DOM. Kalau elemen tertentu tidak ada, bagian itu dilewati.
   Semua listener dipasang SEKALI (tidak ada listener ganda).
*/

document.addEventListener("DOMContentLoaded", () => {

    const player = window.musicPlayer;

    if (!player) {
        return;
    }

    /*
    Section yang TIDAK menampilkan mini bar: halaman intro (musik tetap
    jalan, hanya barnya yang disembunyikan) dan halaman Playlist sendiri
    (di sana sudah ada player besar). Section baru di masa depan
    otomatis menampilkan mini bar.
    */

    const MINI_HIDDEN = [
        "secret-entrance",
        "happy-anniversary",
        "memoryGame",
        "ketemuSection",
        "playlistSection"
    ];


    /*
    ==========================================
    ELEMENTS
    ==========================================
    */

    const cluster = document.getElementById("plCluster");
    const vinyl = document.getElementById("playlistVinyl");
    const vinylDisc = document.getElementById("plVinylDisc");
    const cover = document.getElementById("playlistAlbumCover");
    const coverBox = document.getElementById("plCover");

    const nowBox = document.getElementById("plNow");
    const nowCategory = document.getElementById("plNowCategory");
    const nowTitle = document.getElementById("playlistNowPlayingTitle");
    const nowArtist = document.getElementById("plNowArtist");
    const nowDesc = document.getElementById("plNowDesc");
    const errorEl = document.getElementById("playlistError");

    const currentTimeEl = document.getElementById("playlistCurrentTime");
    const durationEl = document.getElementById("playlistDuration");
    const progressRange = document.getElementById("playlistProgressRange");

    const playBtn = document.getElementById("playlistPlayPauseBtn");
    const prevBtn = document.getElementById("playlistPrevBtn");
    const nextBtn = document.getElementById("playlistNextBtn");
    const repeatBtn = document.getElementById("playlistRepeatBtn");

    const trackList = document.getElementById("plTracks");

    const miniBar = document.getElementById("miniPlayer");
    const miniCover = document.getElementById("miniPlayerCover");
    const miniTitle = document.getElementById("miniPlayerTitle");
    const miniPlayBtn = document.getElementById("miniPlayerPlayPauseBtn");
    const miniRepeatBtn = document.getElementById("miniPlayerRepeatBtn");


    /*
    ==========================================
    SMALL HELPERS
    ==========================================
    */

    function esc(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");

    }

    function setText(el, text) {

        if (el && el.textContent !== text) {
            el.textContent = text;
        }

    }

    function setLabel(el, text) {

        if (el && el.getAttribute("aria-label") !== text) {
            el.setAttribute("aria-label", text);
        }

    }

    function formatTime(seconds) {

        if (!isFinite(seconds) || seconds < 0) {
            return "0:00";
        }

        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);

        return minutes + ":" + String(secs).padStart(2, "0");

    }

    function prefersReducedMotion() {

        return !!(
            window.matchMedia &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
        );

    }

    function readSeconds(el, varName, fallback) {

        if (!el || !window.getComputedStyle) {
            return fallback;
        }

        const raw = getComputedStyle(el).getPropertyValue(varName).trim();

        const value = parseFloat(raw);

        if (!isFinite(value) || value <= 0) {
            return fallback;
        }

        return raw.endsWith("ms") ? value / 1000 : value;

    }


    /*
    ==========================================
    TRACK LIST (dibangun dari playlistTracks)
    ==========================================
    */

    const ICON_PLAY =
        '<svg class="pl-ico-play" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>';

    const ICON_PAUSE =
        '<svg class="pl-ico-pause" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><rect x="6.5" y="5" width="4" height="14" rx="1.2"/><rect x="13.5" y="5" width="4" height="14" rx="1.2"/></svg>';

    function buildTrackList() {

        if (!trackList) {
            return;
        }

        trackList.innerHTML = "";

        player.tracks.forEach((track) => {

            const li = document.createElement("li");

            li.innerHTML =
                '<button type="button" class="pl-track" data-track-id="' + esc(track.id) + '">' +
                    '<span class="pl-track-thumb"><img alt=""></span>' +
                    '<span class="pl-track-text">' +
                        '<span class="pl-track-meta">' +
                            '<span class="pl-track-cat">' + esc(track.category) + '</span>' +
                            '<span class="pl-eq" aria-hidden="true"><i></i><i></i><i></i></span>' +
                            '<span class="pl-track-badge">Playing</span>' +
                        '</span>' +
                        '<span class="pl-track-title">' + esc(track.title) + '</span>' +
                        '<span class="pl-track-artist">' + esc(track.artist) + '</span>' +
                    '</span>' +
                    '<span class="pl-track-play" aria-hidden="true">' + ICON_PLAY + ICON_PAUSE + '</span>' +
                '</button>';

            const thumb = li.querySelector("img");

            /* listener dipasang SEBELUM src supaya error tidak terlewat */

            thumb.addEventListener("error", () => {
                thumb.style.visibility = "hidden";
            });

            thumb.src = track.coverSrc;

            trackList.appendChild(li);

        });

        /* satu listener untuk semua item (event delegation) */

        trackList.addEventListener("click", (event) => {

            const item = event.target.closest(".pl-track");

            if (item && item.dataset.trackId) {
                player.playTrack(item.dataset.trackId);
            }

        });

    }


    /*
    ==========================================
    VINYL — berputar stabil saat play, melambat halus saat pause
    Memakai Web Animations API + ramp playbackRate, jadi tidak ada
    "lompat" posisi ketika berhenti / mulai lagi.
    ==========================================
    */

    let spinAnim = null;
    let rampToken = 0;

    function ensureSpinAnim() {

        if (spinAnim) {
            return spinAnim;
        }

        if (!vinylDisc || typeof vinylDisc.animate !== "function") {
            return null;
        }

        const seconds = readSeconds(cluster || vinylDisc, "--pl-spin-duration", 12);

        spinAnim = vinylDisc.animate(
            [
                { transform: "rotate(0deg)" },
                { transform: "rotate(360deg)" }
            ],
            { duration: seconds * 1000, iterations: Infinity, easing: "linear" }
        );

        spinAnim.pause();

        return spinAnim;

    }

    function rampSpin(toRate, ms, onDone) {

        const anim = ensureSpinAnim();

        if (!anim) {
            return;
        }

        const token = ++rampToken;
        const fromRate = anim.playbackRate;
        const startedAt = performance.now();

        function step(now) {

            if (token !== rampToken) {
                return;
            }

            const progress = Math.min(1, (now - startedAt) / ms);
            const eased = 1 - Math.pow(1 - progress, 3);

            anim.playbackRate = fromRate + (toRate - fromRate) * eased;

            if (progress < 1) {
                requestAnimationFrame(step);
            } else if (onDone) {
                onDone();
            }

        }

        requestAnimationFrame(step);

    }

    function setSpinning(on) {

        if (!vinyl) {
            return;
        }

        vinyl.classList.toggle("is-playing", on);

        if (prefersReducedMotion()) {

            if (spinAnim) {
                spinAnim.pause();
            }

            return;

        }

        const anim = ensureSpinAnim();

        if (!anim) {

            /* fallback CSS bila Web Animations API tidak ada */

            vinyl.classList.add("css-spin");

            return;

        }

        if (on) {

            if (anim.playState !== "running") {
                anim.playbackRate = Math.max(anim.playbackRate, 0.05);
                anim.play();
            }

            rampSpin(1, 700);

        } else {

            rampSpin(0, 900, () => anim.pause());

        }

    }


    /*
    ==========================================
    TRACK SWITCH — lama fade/scale down, baru scale-in (~680ms)
    ==========================================
    */

    let shownTrackId = null;
    let leaveTimer = 0;
    let enterTimer = 0;

    function applyTrackVisuals(track) {

        if (cover) {

            if (coverBox) {
                coverBox.classList.remove("cover-fallback");
            }

            cover.src = track.coverSrc;
            cover.alt = "Album cover " + track.title;

        }

    }

    function showTrack(track) {

        const firstTime = shownTrackId === null;

        shownTrackId = track.id;

        if (firstTime || !cluster) {

            applyTrackVisuals(track);

            return;

        }

        clearTimeout(leaveTimer);
        clearTimeout(enterTimer);

        cluster.classList.remove("is-entering");
        cluster.classList.add("is-leaving");

        const outMs = readSeconds(cluster, "--pl-switch-out", 0.22) * 1000;
        const inMs = readSeconds(cluster, "--pl-switch-in", 0.46) * 1000;

        leaveTimer = setTimeout(() => {

            applyTrackVisuals(track);

            cluster.classList.remove("is-leaving");

            void cluster.offsetWidth;

            cluster.classList.add("is-entering");

            enterTimer = setTimeout(() => {
                cluster.classList.remove("is-entering");
            }, inMs + 40);

        }, outMs);

        if (nowBox) {

            nowBox.classList.remove("is-changing");

            void nowBox.offsetWidth;

            nowBox.classList.add("is-changing");

        }

    }

    if (cover) {

        cover.addEventListener("error", () => {

            if (coverBox) {
                coverBox.classList.add("cover-fallback");
            }

        });

        cover.addEventListener("load", () => {

            if (coverBox) {
                coverBox.classList.remove("cover-fallback");
            }

        });

    }

    if (miniCover) {

        miniCover.addEventListener("error", () => {
            miniCover.style.visibility = "hidden";
        });

        miniCover.addEventListener("load", () => {
            miniCover.style.visibility = "visible";
        });

    }


    /*
    ==========================================
    MINI BAR VISIBILITY (bergantung section aktif)
    ==========================================
    */

    let lastState = null;

    function getActiveSectionId() {

        const active = document.querySelector("#app > section.active-section");

        return active ? active.id : "";

    }

    function updateMiniVisibility() {

        const activeId = getActiveSectionId();

        document.body.classList.toggle(
            "is-playlist-page",
            activeId === "playlistSection"
        );

        if (!miniBar) {
            return;
        }

        const show = !!(
            lastState &&
            lastState.hasStarted &&
            lastState.track &&
            activeId &&
            MINI_HIDDEN.indexOf(activeId) === -1
        );

        miniBar.classList.toggle("is-visible", show);
        miniBar.setAttribute("aria-hidden", show ? "false" : "true");

        document.body.classList.toggle("mini-on", show);

    }


    /*
    ==========================================
    updateNowPlayingUI — satu fungsi yang menyegarkan semua tampilan
    ==========================================
    */

    let lastSpinning = null;

    function updateNowPlayingUI(current) {

        lastState = current;

        const track = current.track;

        if (!track) {
            return;
        }

        /* cover + transisi ganti lagu */

        if (shownTrackId !== track.id) {
            showTrack(track);
        }

        /* vinyl & cover */

        if (lastSpinning !== current.isPlaying) {

            lastSpinning = current.isPlaying;

            setSpinning(current.isPlaying);

        }

        if (coverBox) {
            coverBox.classList.toggle("is-playing", current.isPlaying);
        }

        /* Now Playing */

        setText(nowCategory, track.category);
        setText(nowTitle, track.title);
        setText(nowArtist, track.artist);
        setText(nowDesc, track.description);

        setText(
            errorEl,
            current.hasError
                ? "File lagu ini belum ada — taruh di " + track.audioSrc + " agar bisa diputar."
                : ""
        );

        /* progress */

        const pct = current.duration
            ? Math.min(100, (current.currentTime / current.duration) * 100)
            : 0;

        setText(currentTimeEl, formatTime(current.currentTime));
        setText(durationEl, formatTime(current.duration));

        if (progressRange) {

            progressRange.disabled = !current.duration;

            if (document.activeElement !== progressRange) {
                progressRange.value = pct;
            }

            progressRange.style.setProperty("--pl-progress", pct + "%");

        }

        /* play / pause (page + mini bar) : is-playing | is-paused | is-loading | is-disabled */

        [playBtn, miniPlayBtn].forEach((btn) => {

            if (!btn) {
                return;
            }

            btn.classList.toggle("is-playing", current.isPlaying);
            btn.classList.toggle("is-paused", !current.isPlaying);
            btn.classList.toggle("is-loading", current.isLoading && !current.hasError);
            btn.classList.toggle("is-disabled", current.hasError);

            btn.setAttribute("aria-disabled", current.hasError ? "true" : "false");

            setLabel(btn, current.isPlaying ? "Jeda" : "Putar");

        });

        /* repeat all */

        [repeatBtn, miniRepeatBtn].forEach((btn) => {

            if (!btn) {
                return;
            }

            const pressed = current.repeatAll ? "true" : "false";

            if (btn.getAttribute("aria-pressed") !== pressed) {
                btn.setAttribute("aria-pressed", pressed);
            }

            btn.title = current.repeatAll ? "Repeat all: aktif" : "Repeat all: mati";

        });

        /* daftar lagu */

        if (trackList) {

            trackList.querySelectorAll(".pl-track").forEach((item) => {

                const isActive = item.dataset.trackId === track.id;
                const isPlayingItem = isActive && current.isPlaying;

                item.classList.toggle("is-active", isActive);
                item.classList.toggle("is-playing", isPlayingItem);

                const badge = item.querySelector(".pl-track-badge");

                if (badge) {
                    setText(badge, current.isPlaying ? "Playing" : "Paused");
                }

                if (isActive) {
                    item.setAttribute("aria-current", "true");
                } else {
                    item.removeAttribute("aria-current");
                }

                const info = player.tracks.find((t) => t.id === item.dataset.trackId);

                if (info) {

                    setLabel(
                        item,
                        (isPlayingItem ? "Jeda " : "Putar ") +
                        info.title + " — " + info.artist + " (" + info.category + ")"
                    );

                }

            });

        }

        /* mini bar */

        if (miniCover && miniCover.getAttribute("src") !== track.coverSrc) {
            miniCover.src = track.coverSrc;
        }

        setText(miniTitle, track.title);

        updateMiniVisibility();

    }


    /*
    ==========================================
    CONTROLS (masing-masing dipasang sekali)
    ==========================================
    */

    function bind(el, handler) {

        if (el) {
            el.addEventListener("click", handler);
        }

    }

    bind(playBtn, () => player.togglePlay());
    bind(miniPlayBtn, () => player.togglePlay());
    bind(prevBtn, () => player.playPreviousTrack());
    bind(nextBtn, () => player.playNextTrack());
    bind(repeatBtn, () => player.toggleRepeatAll());
    bind(miniRepeatBtn, () => player.toggleRepeatAll());

    if (progressRange) {

        progressRange.addEventListener("input", () => {

            const current = player.getState();

            player.seek(
                (parseFloat(progressRange.value) / 100) * (current.duration || 0)
            );

        });

    }


    /*
    ==========================================
    SECTION CHANGES -> mini bar tampil / sembunyi
    (memantau class .active-section, tanpa mengubah app.js)
    ==========================================
    */

    if (typeof MutationObserver === "function") {

        const observer = new MutationObserver(updateMiniVisibility);

        document.querySelectorAll("#app > section").forEach((section) => {

            observer.observe(section, {
                attributes: true,
                attributeFilter: ["class"]
            });

        });

    }


    /*
    ==========================================
    START
    ==========================================
    */

    buildTrackList();

    player.subscribe(updateNowPlayingUI);

});