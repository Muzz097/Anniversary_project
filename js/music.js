/* ==========================================
   GLOBAL MUSIC PLAYER
   (Phase 09 — Our Playlist / "The Soundtrack of Us")
   ==========================================

   ONE <audio> element for the whole site. Any page
   can call window.musicPlayer.playTrack(id) and this
   module handles: stopping whatever was playing,
   loading the new track, trying to play it, and
   telling every subscriber (the Playlist page UI,
   the global mini player) to re-render.

   Autoplay: browsers block audio before the user has
   interacted with the page at all. On load we prepare
   "The Beginning" as the default track and try to
   play it — if that's blocked (the normal case), we
   just wait for the very first click/tap/keypress
   anywhere on the site and try again then. No errors,
   no retry loops, no repeated Audio() creation.
*/

(function () {

    const TRACKS = [
        {
            id: "the-beginning",
            title: "The Beginning",
            tagline: "Where it all started.",
            cover: "assets/images/playlist/album-beginning.jpg",
            src: "assets/audio/the-beginning.mp3"
        },
        {
            id: "the-moments",
            title: "The Moments",
            tagline: "All the in betweens.",
            cover: "assets/images/playlist/album-moments.jpg",
            src: "assets/audio/the-moments.mp3"
        },
        {
            id: "the-future",
            title: "The Future",
            tagline: "Still so much to come.",
            cover: "assets/images/playlist/album-future.jpg",
            src: "assets/audio/the-future.mp3"
        }
    ];

    const DEFAULT_TRACK_ID = "the-beginning";
    const STORAGE_KEY = "ourLittleStory.audioState";

    const audio = new Audio();
    audio.preload = "metadata";

    let pendingAutoplay = false;

    const state = {
        currentTrackId: null,
        isPlaying: false,
        isMuted: false,
        volume: 0.85,
        currentTime: 0,
        duration: 0,
        isLoading: false,
        hasError: false
    };

    const listeners = new Set();


    /*
    ==========================================
    HELPERS
    ==========================================
    */

    function getTrackById(id) {

        return TRACKS.find((track) => track.id === id) || null;

    }

    function getState() {

        return Object.assign(
            {},
            state,
            { track: getTrackById(state.currentTrackId) }
        );

    }

    function notify() {

        listeners.forEach((fn) => {

            try {
                fn(getState());
            } catch (error) {
                /* a bad subscriber shouldn't break the others */
            }

        });

    }

    function saveState() {

        try {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({
                    currentTrackId: state.currentTrackId,
                    isMuted: state.isMuted,
                    volume: state.volume,
                    currentTime: audio.currentTime || 0
                })
            );

        } catch (error) {

            /* localStorage unavailable — progress just won't persist */

        }

    }

    function loadStoredState() {

        try {

            const raw = localStorage.getItem(STORAGE_KEY);

            return raw ? JSON.parse(raw) : null;

        } catch (error) {

            return null;

        }

    }


    /*
    ==========================================
    PLAYBACK
    ==========================================
    */

    function attemptPlay() {

        const playPromise = audio.play();

        if (playPromise === undefined) {
            return;
        }

        playPromise
            .then(() => {

                pendingAutoplay = false;

            })
            .catch(() => {

                /*
                Blocked by the browser's autoplay policy —
                completely normal before the first user
                interaction. handleFirstInteraction() will
                retry once that happens.
                */

                pendingAutoplay = true;

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
        state.duration = 0;

        notify();

        audio.src = track.src;

        if (startAt) {
            audio.currentTime = startAt;
        }

        if (autoplay) {
            attemptPlay();
        }

        saveState();

    }

    function play() {

        if (!state.currentTrackId) {

            setTrack(DEFAULT_TRACK_ID, { autoplay: true });

            return;

        }

        attemptPlay();

    }

    function pause() {

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

    function playTrack(id) {

        if (!getTrackById(id)) {
            return;
        }

        if (state.currentTrackId === id) {

            togglePlay();

            return;

        }

        setTrack(id, { autoplay: true });

    }

    function playNextOrPrevious(direction) {

        const ids = TRACKS.map((track) => track.id);

        const currentIndex = ids.indexOf(state.currentTrackId);

        const nextIndex =
            (currentIndex + direction + ids.length) % ids.length;

        setTrack(ids[nextIndex], { autoplay: true });

    }

    function setMuted(muted) {

        audio.muted = muted;

        state.isMuted = muted;

        saveState();
        notify();

    }

    function toggleMute() {

        setMuted(!state.isMuted);

    }

    function setVolume(value) {

        const clamped = Math.min(1, Math.max(0, value));

        audio.volume = clamped;

        state.volume = clamped;

        saveState();
        notify();

    }

    function seek(time) {

        if (!isFinite(time)) {
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

        notify();

    });

    audio.addEventListener("pause", () => {

        state.isPlaying = false;

        notify();

    });

    audio.addEventListener("ended", () => {

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

    audio.addEventListener("error", () => {

        /*
        Missing/broken audio file — fail quietly.
        The UI shows a small inline note instead of
        a broken player.
        */

        state.hasError = true;
        state.isLoading = false;
        state.isPlaying = false;

        notify();

    });


    /*
    Persist currentTime every few seconds while
    playing, rather than on every timeupdate tick
    */

    setInterval(() => {

        if (state.isPlaying) {
            saveState();
        }

    }, 5000);


    /*
    ==========================================
    FIRST-INTERACTION AUTOPLAY UNLOCK
    ==========================================
    */

    function handleFirstInteraction() {

        if (pendingAutoplay && !state.isPlaying) {

            attemptPlay();

        }

    }

    ["pointerdown", "keydown", "touchstart"].forEach((eventName) => {

        document.addEventListener(
            eventName,
            handleFirstInteraction,
            { once: true, passive: true }
        );

    });


    /*
    ==========================================
    INIT
    ==========================================
    */

    function init() {

        const stored = loadStoredState();

        const initialId =
            (stored && getTrackById(stored.currentTrackId))
                ? stored.currentTrackId
                : DEFAULT_TRACK_ID;

        if (stored && typeof stored.volume === "number") {
            state.volume = stored.volume;
        }

        state.isMuted = !!(stored && stored.isMuted);

        audio.volume = state.volume;
        audio.muted = state.isMuted;

        state.currentTrackId = initialId;

        const track = getTrackById(initialId);

        if (track) {

            audio.src = track.src;

            if (stored && stored.currentTime) {
                audio.currentTime = stored.currentTime;
            }

        }

        pendingAutoplay = true;

        attemptPlay();

        notify();

    }

    document.addEventListener("DOMContentLoaded", init);


    /*
    ==========================================
    PUBLIC API
    ==========================================
    */

    window.musicPlayer = {
        tracks: TRACKS,
        getState,
        subscribe,
        playTrack,
        play,
        pause,
        togglePlay,
        playNext: () => playNextOrPrevious(1),
        playPrevious: () => playNextOrPrevious(-1),
        setMuted,
        toggleMute,
        setVolume,
        seek
    };

})();


/* ==========================================
   PLAYLIST PAGE + MINI PLAYER — UI WIRING
   ==========================================

   Subscribes to window.musicPlayer and updates the
   DOM. Doesn't touch playback logic above — if either
   the Playlist page or the mini player is missing
   from the DOM, this simply skips that part.
*/

document.addEventListener("DOMContentLoaded", () => {

    const player = window.musicPlayer;

    if (!player) {
        return;
    }


    function formatTime(seconds) {

        if (!isFinite(seconds) || seconds < 0) {
            return "0:00";
        }

        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);

        return minutes + ":" + String(secs).padStart(2, "0");

    }


    /*
    ==========================================
    PLAYLIST PAGE ELEMENTS
    ==========================================
    */

    const albumVinylWrap =
        document.querySelector(".playlist-album-vinyl");

    const vinyl = document.getElementById("playlistVinyl");
    const albumCover = document.getElementById("playlistAlbumCover");

    const nowPlayingTitle =
        document.getElementById("playlistNowPlayingTitle");

    const playlistError = document.getElementById("playlistError");

    const currentTimeEl = document.getElementById("playlistCurrentTime");
    const durationEl = document.getElementById("playlistDuration");
    const progressRange = document.getElementById("playlistProgressRange");

    const playPauseBtn = document.getElementById("playlistPlayPauseBtn");
    const prevBtn = document.getElementById("playlistPrevBtn");
    const nextBtn = document.getElementById("playlistNextBtn");
    const muteBtn = document.getElementById("playlistMuteBtn");

    const trackItems = document.querySelectorAll(".playlist-track-item");


    /*
    ==========================================
    MINI PLAYER ELEMENTS
    ==========================================
    */

    const miniPlayer = document.getElementById("miniPlayer");
    const miniCover = document.getElementById("miniPlayerCover");
    const miniTitle = document.getElementById("miniPlayerTitle");
    const miniProgressFill =
        document.getElementById("miniPlayerProgressFill");
    const miniPlayPauseBtn =
        document.getElementById("miniPlayerPlayPauseBtn");
    const miniMuteBtn = document.getElementById("miniPlayerMuteBtn");


    let lastTrackId = null;


    /*
    ==========================================
    RENDER
    ==========================================
    */

    function render(state) {

        const track = state.track;

        /* Track-switch pulse */

        if (
            albumVinylWrap &&
            track &&
            lastTrackId &&
            lastTrackId !== track.id
        ) {

            albumVinylWrap.classList.remove("track-switching");

            void albumVinylWrap.offsetWidth;

            albumVinylWrap.classList.add("track-switching");

        }

        lastTrackId = track ? track.id : lastTrackId;


        if (albumCover && track) {

            albumCover.src = track.cover;
            albumCover.alt = "Album cover — " + track.title;
            albumCover.parentElement.classList.remove("cover-fallback");

        }

        if (vinyl) {
            vinyl.classList.toggle("is-spinning", state.isPlaying);
        }

        if (nowPlayingTitle) {
            nowPlayingTitle.textContent = track ? track.title : "—";
        }

        if (playlistError) {

            playlistError.textContent = state.hasError
                ? "This song's file isn't there yet — add it to assets/audio/ to hear it."
                : "";

        }


        const pct = state.duration
            ? (state.currentTime / state.duration) * 100
            : 0;

        if (currentTimeEl) {
            currentTimeEl.textContent = formatTime(state.currentTime);
        }

        if (durationEl) {
            durationEl.textContent = formatTime(state.duration);
        }

        if (progressRange && document.activeElement !== progressRange) {
            progressRange.value = pct;
        }


        [playPauseBtn, miniPlayPauseBtn].forEach((btn) => {

            if (btn) {
                btn.classList.toggle("is-playing", state.isPlaying);
            }

        });

        [muteBtn, miniMuteBtn].forEach((btn) => {

            if (btn) {
                btn.textContent = state.isMuted ? "Unmute" : "Mute";
            }

        });


        trackItems.forEach((item) => {

            const isActive =
                track && item.dataset.trackId === track.id;

            item.classList.toggle("is-active", !!isActive);

            const statusEl = item.querySelector(".track-status");

            if (statusEl) {

                statusEl.textContent = isActive
                    ? (state.isPlaying ? "Playing" : "Paused")
                    : "";

            }

        });


        if (miniPlayer && track) {

            miniPlayer.classList.add("visible");
            miniPlayer.setAttribute("aria-hidden", "false");

            if (miniCover) {
                miniCover.src = track.cover;
                miniCover.alt = "";
            }

            if (miniTitle) {
                miniTitle.textContent = track.title;
            }

            if (miniProgressFill) {
                miniProgressFill.style.width = pct + "%";
            }

        }

    }


    /*
    ==========================================
    CONTROLS
    ==========================================
    */

    if (playPauseBtn) {

        playPauseBtn.addEventListener(
            "click",
            () => player.togglePlay()
        );

    }

    if (miniPlayPauseBtn) {

        miniPlayPauseBtn.addEventListener(
            "click",
            () => player.togglePlay()
        );

    }

    if (muteBtn) {

        muteBtn.addEventListener(
            "click",
            () => player.toggleMute()
        );

    }

    if (miniMuteBtn) {

        miniMuteBtn.addEventListener(
            "click",
            () => player.toggleMute()
        );

    }

    if (prevBtn) {

        prevBtn.addEventListener(
            "click",
            () => player.playPrevious()
        );

    }

    if (nextBtn) {

        nextBtn.addEventListener(
            "click",
            () => player.playNext()
        );

    }

    if (progressRange) {

        progressRange.addEventListener("input", () => {

            const current = player.getState();

            const pct = parseFloat(progressRange.value);

            player.seek((pct / 100) * (current.duration || 0));

        });

    }

    trackItems.forEach((item) => {

        item.addEventListener("click", () => {

            const trackId = item.dataset.trackId;

            if (trackId) {
                player.playTrack(trackId);
            }

        });

    });


    player.subscribe(render);

});