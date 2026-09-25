/**

==========================================
OUR LITTLE STORY
Main Application
==========================================
*/

/**

SECRET CODE
*/

const SECRET_CODE = "3108";

let enteredCode = "";

/**

DOM Elements
*/

const keys = document.querySelectorAll(".key[data-number]");

const codeDots = document.querySelectorAll(".code-dot");

const deleteButton = document.getElementById("delete-code");

const submitButton = document.getElementById("submit-code");

const keypad = document.querySelector(".keypad");

const secretMessage = document.getElementById("secret-message");

const secretEntrance =
    document.getElementById("secret-entrance");

const happyAnniversary =
    document.getElementById("happy-anniversary");

const adventureButton =
    document.querySelector(".adventure-button");

const memoryGame =
    document.getElementById("memoryGame");
/**

Add number to code
*/

let isAdventureTransitioning = false;

if (
    adventureButton &&
    happyAnniversary &&
    memoryGame
) {

    adventureButton.addEventListener(
        "click",
        () => {

            if (isAdventureTransitioning) {
                return;
            }

            isAdventureTransitioning = true;
            adventureButton.disabled = true;

            playHeartCurtainTransition();

        }
    );

}


/*
==========================================
HEART CURTAIN + LOVE LETTER REVEAL
==========================================

Fase 1: tombol memberi respon (glow + hati).
Fase 2: curtain + partikel menutup layar.
Fase 3: memory game terungkap, kartu &
        teks masuk bertahap.
*/

function playHeartCurtainTransition() {

    const reduceMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    /* Simple fade fallback, no decoration */

    if (reduceMotion) {

        happyAnniversary.classList.add("section-exit");

        setTimeout(() => {

            happyAnniversary.classList.remove(
                "active-section", "section-exit"
            );

            happyAnniversary.classList.add(
                "hidden-section"
            );

            memoryGame.classList.remove(
                "hidden-section"
            );

            memoryGame.classList.add(
                "active-section"
            );

            window.scrollTo({
                top: 0,
                behavior: "instant"
            });

            if (
                typeof window.initializeMemoryGame
                === "function"
            ) {

                window.initializeMemoryGame();

            }

            adventureButton.classList.remove(
                "is-transitioning"
            );

        }, 600);

        return;

    }


    const overlay =
        document.getElementById("transitionOverlay");

    const particleLayer =
        document.getElementById("transitionParticles");


    /* Fase 1 */

    adventureButton.classList.add("is-transitioning");

    spawnButtonHearts(adventureButton);

    happyAnniversary.classList.add(
        "page-transition-exit"
    );


    /* Fase 2 */

    setTimeout(() => {

        if (overlay) {
            overlay.classList.add("is-active");
        }

        spawnCurtainParticles(particleLayer);

    }, 150);


    setTimeout(() => {

        happyAnniversary.classList.remove(
            "active-section",
            "page-transition-exit"
        );

        happyAnniversary.classList.add(
            "hidden-section"
        );

        memoryGame.classList.remove(
            "hidden-section"
        );

        memoryGame.classList.add(
            "active-section"
        );

        window.scrollTo({
            top: 0,
            behavior: "instant"
        });

        if (
            typeof window.initializeMemoryGame
            === "function"
        ) {

            window.initializeMemoryGame();

        }

    }, 750);


    /* Fase 3 */

    setTimeout(() => {

        if (overlay) {
            overlay.classList.add("is-exiting");
        }

    }, 900);


    setTimeout(() => {

        if (overlay) {

            overlay.classList.remove(
                "is-active", "is-exiting"
            );

        }

        if (particleLayer) {
            particleLayer.innerHTML = "";
        }

        adventureButton.classList.remove(
            "is-transitioning"
        );

    }, 1700);

}


function spawnButtonHearts(button) {

    const rect = button.getBoundingClientRect();

    const container =
        document.createElement("div");

    container.className = "button-heart-burst";

    document.body.appendChild(container);

    for (let i = 0; i < 6; i++) {

        const heart =
            document.createElement("span");

        heart.className = "floating-heart heart-particle button-heart";

        const angle = (i / 6) * 360 + Math.random() * 20;
        const spread = 40 + Math.random() * 30;

        heart.style.left =
            (rect.left + rect.width / 2) + "px";

        heart.style.top =
            (rect.top + rect.height / 2) + "px";

        heart.style.setProperty(
            "--tx",
            Math.cos(angle * Math.PI / 180) * spread + "px"
        );

        heart.style.setProperty(
            "--ty",
            Math.sin(angle * Math.PI / 180) * spread + "px"
        );

        heart.style.animationDelay =
            (Math.random() * 0.15) + "s";

        container.appendChild(heart);

    }

    setTimeout(() => {
        container.remove();
    }, 1200);

}


function spawnCurtainParticles(container) {

    if (!container) {
        return;
    }

    container.innerHTML = "";

    const kinds = [
        "heart-particle",
        "mini-petal",
        "sparkle-particle",
        "curtain-bokeh-shape",
        "curtain-paper-shape",
        "curtain-ribbon-shape"
    ];

    const total = 22;

    for (let i = 0; i < total; i++) {

        const piece =
            document.createElement("span");

        const kind =
            kinds[i % kinds.length];

        piece.className =
            "transition-particle " + kind;

        const edge = i % 4;

        let startX;
        let startY;

        if (edge === 0) {
            startX = Math.random() * 100;
            startY = -10;
        } else if (edge === 1) {
            startX = 110;
            startY = Math.random() * 100;
        } else if (edge === 2) {
            startX = Math.random() * 100;
            startY = 110;
        } else {
            startX = -10;
            startY = Math.random() * 100;
        }

        piece.style.setProperty("--start-x", startX + "%");
        piece.style.setProperty("--start-y", startY + "%");

        piece.style.setProperty(
            "--target-x", (40 + Math.random() * 20) + "%"
        );

        piece.style.setProperty(
            "--target-y", (40 + Math.random() * 20) + "%"
        );

        piece.style.setProperty(
            "--rot", (Math.random() * 60 - 30) + "deg"
        );

        piece.style.animationDelay =
            (Math.random() * 0.4) + "s";

        container.appendChild(piece);

    }

}

keys.forEach(function (key) {

key.addEventListener("click", function () {

    const number = key.dataset.number;

    /*
     * Jangan biarkan kode lebih panjang
     * dari jumlah titik yang tersedia.
     */

    if (enteredCode.length >= codeDots.length) {
        return;
    }

    enteredCode += number;

    updateCodeDisplay();

});

});

/**

Update code indicator
*/

function showHappyAnniversary() {

    secretEntrance.classList.add("section-exit");

    setTimeout(function () {

        secretEntrance.classList.remove("active-section");
        secretEntrance.classList.add("hidden-section");

        happyAnniversary.classList.remove("hidden-section");
        happyAnniversary.classList.add("active-section");

        happyAnniversary.classList.add(
            "anniversary-reveal"
        );

    }, 1000);
}

function updateCodeDisplay() {

codeDots.forEach(function (dot, index) {

    if (index < enteredCode.length) {

        dot.classList.add("active");

    } else {

        dot.classList.remove("active");

    }

});

}

/**

Delete last number
*/

deleteButton.addEventListener("click", function () {

enteredCode = enteredCode.slice(0, -1);

updateCodeDisplay();

secretMessage.textContent = "";

});

/**
 *
 * ROMANTIC WRONG-CODE MESSAGES
 * Dipilih acak tiap kali salah, biar
 * tidak terasa monoton.
 *
 */

const wrongCodeMessages = [
    "Ciee salah, bukan ituu coba lagi yaa cantikk ❤️",
    "Salah kode, tapi ga salah orang kok 😉",
    "Coba lagi ay, aku yakin kamu pasti inget kok 🥰"
];


function getRandomWrongMessage() {

    const index = Math.floor(
        Math.random() * wrongCodeMessages.length
    );

    return wrongCodeMessages[index];

}


/**
 *
 * MODAL ELEMENTS
 *
 */

const wrongCodeModal =
    document.getElementById("wrongCodeModal");

const wrongCodeText =
    document.getElementById("wrongCodeText");

const wrongCodeClose =
    document.getElementById("wrongCodeClose");

const successCodeModal =
    document.getElementById("successCodeModal");

const confettiContainer =
    document.getElementById("confettiContainer");


function showWrongCodeModal() {

    if (!wrongCodeModal) {
        return;
    }

    wrongCodeText.textContent =
        getRandomWrongMessage();

    wrongCodeModal.classList.add("show");

}


function hideWrongCodeModal() {

    if (!wrongCodeModal) {
        return;
    }

    wrongCodeModal.classList.remove("show");

}


if (wrongCodeClose) {

    wrongCodeClose.addEventListener(
        "click",
        hideWrongCodeModal
    );

}


/**
 *
 * CONFETTI
 *
 */

function spawnConfetti() {

    if (!confettiContainer) {
        return;
    }

    confettiContainer.innerHTML = "";

    const colors = [
        "#d98da5",
        "#6f8f72",
        "#f7f1ec",
        "#a63d40"
    ];

    for (let i = 0; i < 26; i++) {

        const piece =
            document.createElement("span");

        piece.className = "confetti-piece";

        piece.style.left =
            Math.random() * 100 + "%";

        piece.style.background =
            colors[
                Math.floor(
                    Math.random() * colors.length
                )
            ];

        piece.style.animationDelay =
            (Math.random() * 0.6) + "s";

        piece.style.animationDuration =
            (2 + Math.random() * 1.4) + "s";

        confettiContainer.appendChild(piece);

    }

}


function showSuccessCodeModal(onDone) {

    if (!successCodeModal) {

        onDone();

        return;
    }

    successCodeModal.classList.add("show");

    spawnConfetti();

    setTimeout(() => {

        successCodeModal.classList.remove(
            "show"
        );

        onDone();

    }, 2600);

}


/**
 *
 * SUBMIT SECRET CODE
 *
 */

submitButton.addEventListener("click", function () {

    if (enteredCode.length !== SECRET_CODE.length) {

        secretMessage.textContent =
            "Our little secret needs four numbers.";

        return;
    }


    if (enteredCode === SECRET_CODE) {

        secretMessage.textContent = "";

        showSuccessCodeModal(function () {

            showHappyAnniversary();

        });


    } else {

        showWrongCodeModal();


        /*
         * Shake animation
         */

        keypad.classList.remove("shake");

        void keypad.offsetWidth;

        keypad.classList.add("shake");


        /*
         * Reset code
         */

        enteredCode = "";

        updateCodeDisplay();

    }

});


/* ==========================================
   PHASE 05 — CHOOSE YOUR SURPRISE
   ==========================================

   This section only wires the *hub* itself:
   the four cards, the visited-tracker, and
   the "continue" button that appears once
   all four have been opened at least once.

   The actual Message / Memories / Journey /
   Playlist screens are built in their own
   files (reasons.js, journey.js, etc.) —
   for now each card shows a short in-context
   note so nothing feels broken while those
   pages are still being built.
*/

document.addEventListener("DOMContentLoaded", () => {

    const ketemuSection =
        document.getElementById("ketemuSection");

    const surpriseHub =
        document.getElementById("surpriseHub");

    const surpriseCards =
        document.querySelectorAll(".surprise-card");

    const surpriseHint =
        document.getElementById("surpriseHint");

    const surpriseContinue =
        document.getElementById("surpriseContinue");

    const trackerDots =
        document.querySelectorAll(".tracker-dot");


    if (!surpriseHub) {
        return;
    }


    /*
    ==========================================
    STATE
    ==========================================
    */

    const visited = {
        message: false,
        memories: false,
        journey: false,
        playlist: false
    };


    /*
    A short, in-voice note per card.
    Swapped out for the real page once
    that phase is built — the data-target
    attribute is already wired for it.
    */

    const previewNotes = {
        message:
            "A letter is waiting here — coming very soon.",
        memories:
            "Our timeline is still being put together.",
        journey:
            "This one's about how far you've grown.",
        playlist:
            "Three songs, still being picked with care."
    };


    /*
    ==========================================
    TRANSITION INTO PHASE 05
    ==========================================
    */

    function goToSurpriseHub() {

        if (!ketemuSection) {
            return;
        }

        ketemuSection.classList.add(
            "section-exit"
        );

        setTimeout(() => {

            ketemuSection.classList.remove(
                "active-section",
                "ketemu-start"
            );

            ketemuSection.classList.add(
                "hidden-section"
            );

            ketemuSection.classList.remove(
                "section-exit"
            );


            surpriseHub.classList.remove(
                "hidden-section"
            );

            surpriseHub.classList.add(
                "active-section"
            );


            window.scrollTo({
                top: 0,
                behavior: "instant"
            });

        }, 1000);

    }


    /*
    Exposed so memory-game.js can call this
    from the "There's more to our story →"
    button, the same way createGame() is
    exposed as window.initializeMemoryGame.
    */

    window.goToSurpriseHub = goToSurpriseHub;


    /*
    ==========================================
    CARD CLICK
    ==========================================
    */

    surpriseCards.forEach((card) => {

        card.addEventListener("click", () => {

            const target = card.dataset.target;

            if (!target) {
                return;
            }

            markVisited(target);

            showHint(
                previewNotes[target] || ""
            );

        });

    });


    /*
    ==========================================
    MARK VISITED
    ==========================================
    */

    function markVisited(target) {

        if (visited[target]) {
            return;
        }

        visited[target] = true;


        const card = document.querySelector(
            `.surprise-card[data-target="${target}"]`
        );

        if (card) {

            card.classList.add("visited");

            card.classList.remove(
                "visited-animation"
            );

            void card.offsetWidth;

            card.classList.add(
                "visited-animation"
            );

        }


        const dot = document.querySelector(
            `.tracker-dot[data-tracker="${target}"]`
        );

        if (dot) {
            dot.classList.add("completed");
        }


        checkAllVisited();

    }


    /*
    ==========================================
    HINT TEXT
    ==========================================
    */

    function showHint(message) {

        if (!surpriseHint) {
            return;
        }

        surpriseHint.textContent = message;

    }


    /*
    ==========================================
    ALL FOUR VISITED
    ==========================================
    */

    function checkAllVisited() {

        const allVisited = Object.keys(
            visited
        ).every((key) => visited[key]);


        if (allVisited && surpriseContinue) {

            surpriseContinue.classList.add(
                "ready"
            );

            showHint(
                "You've seen everything... for now."
            );

        }

    }


    /*
    ==========================================
    CONTINUE BUTTON
    ==========================================
    */

    if (surpriseContinue) {

        surpriseContinue.addEventListener(
            "click",
            () => {

                if (
                    !surpriseContinue.classList.contains(
                        "ready"
                    )
                ) {
                    return;
                }

                /*
                Phase 14 (Our Future) akan
                disambungkan setelah Message,
                Memories, Journey, dan Playlist
                selesai dibangun.
                */

                console.log(
                    "Continue to Phase 14 — Our Future"
                );

            }
        );

    }

});

/* ==========================================
   PHASE 05 — MENU MENU
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const surpriseHub =
        document.getElementById("surpriseHub");

    const menuItems =
        document.querySelectorAll(".menu-item");

    if (!surpriseHub || !menuItems.length) {
        return;
    }


    /*
    ==========================================
    SPAWN CLICK SPARKLES
    ==========================================
    */

    function spawnClickSparkles(item, event) {

        const rect = item.getBoundingClientRect();

        const originX =
            (event.clientX ?? rect.left + rect.width / 2)
            - rect.left;

        const originY =
            (event.clientY ?? rect.top + rect.height / 2)
            - rect.top;

        const total = 6;

        for (let i = 0; i < total; i++) {

            const spark =
                document.createElement("span");

            spark.className = "menu-click-spark";

            const angle = (Math.PI * 2 * i) / total;
            const distance = 26 + Math.random() * 14;

            spark.style.left = originX + "px";
            spark.style.top = originY + "px";

            spark.style.setProperty(
                "--tx",
                Math.cos(angle) * distance + "px"
            );

            spark.style.setProperty(
                "--ty",
                Math.sin(angle) * distance + "px"
            );

            spark.style.animationDelay =
                (Math.random() * 0.05) + "s";

            item.appendChild(spark);

            spark.addEventListener(
                "animationend",
                () => spark.remove()
            );

        }

    }


    /*
    ==========================================
    CLICK HANDLER
    ==========================================
    */

    menuItems.forEach((item) => {

        item.addEventListener("click", (event) => {

            /*
            Ignore taps while a transition is
            already in flight — prevents double
            navigation once real page transitions
            are wired up per menu.
            */

            if (
                surpriseHub.classList.contains(
                    "page-transitioning"
                )
            ) {
                return;
            }

            item.classList.remove("is-selected");
            void item.offsetWidth;
            item.classList.add("is-selected");

            spawnClickSparkles(item, event);

            surpriseHub.classList.add(
                "page-transitioning"
            );

            setTimeout(() => {

                surpriseHub.classList.remove(
                    "page-transitioning"
                );

                item.classList.remove("is-selected");

            }, 650);

        });

    });

});