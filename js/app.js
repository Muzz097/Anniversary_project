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

if (
    adventureButton &&
    happyAnniversary &&
    memoryGame
) {

    adventureButton.addEventListener(
        "click",
        () => {

            happyAnniversary.classList.add(
                "section-exit"
            );


            setTimeout(() => {

                happyAnniversary.classList.remove(
                    "active-section"
                );

                happyAnniversary.classList.add(
                    "hidden-section"
                );


                happyAnniversary.classList.remove(
                    "section-exit"
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


                /*
                Reset game setiap kali
                Phase 03 dibuka.
                */

                if (
                    typeof window.initializeMemoryGame
                    === "function"
                ) {

                    window.initializeMemoryGame();

                }

            }, 1000);

        }
    );

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

   Wires the hub itself: the four menu items,
   the visited-tracker, the "continue" button,
   AND (new) the actual navigation from each
   menu item to its own page section, with
   visited progress persisted in localStorage
   so it survives a refresh.

   The four destination pages (#messageSection,
   #memoriesSection, #journeySection,
   #playlistSection) are placeholder shells for
   now — full Phase 06-09 content comes later.
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
    DESTINATION PAGES (Phase 06-09 placeholders)
    ==========================================
    */

    const menuPages = {

        message:
            document.getElementById("messageSection"),

        memories:
            document.getElementById("memoriesSection"),

        journey:
            document.getElementById("journeySection"),

        playlist:
            document.getElementById("playlistSection")

    };


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
    A short, in-voice note per card. No longer
    shown on click now that each menu actually
    navigates away, but kept here in case a
    future empty/locked state wants it back.
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
    PROGRESS PERSISTENCE (localStorage)
    ==========================================
    */

    const VISITED_STORAGE_KEY =
        "ourLittleStory.visitedMenus";

    function saveVisitedToStorage() {

        try {

            localStorage.setItem(
                VISITED_STORAGE_KEY,
                JSON.stringify(visited)
            );

        } catch (error) {

            /*
            localStorage unavailable (private
            mode, etc.) — progress just won't
            survive a refresh this time.
            */

        }

    }

    function loadVisitedFromStorage() {

        try {

            const raw = localStorage.getItem(
                VISITED_STORAGE_KEY
            );

            return raw ? JSON.parse(raw) : null;

        } catch (error) {

            return null;

        }

    }


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
    NAVIGATION: HUB <-> MENU PAGE
    ==========================================
    */

    function goToMenuPage(target) {

        const page = menuPages[target];

        if (!page) {
            return;
        }

        surpriseHub.classList.add(
            "section-exit"
        );

        setTimeout(() => {

            surpriseHub.classList.remove(
                "active-section"
            );

            surpriseHub.classList.add(
                "hidden-section"
            );

            surpriseHub.classList.remove(
                "section-exit"
            );


            page.classList.remove(
                "hidden-section"
            );

            page.classList.add(
                "active-section"
            );


            window.scrollTo({
                top: 0,
                behavior: "instant"
            });

        }, 1000);

    }

    function goBackToHub(target) {

        const page = menuPages[target];

        if (!page) {
            return;
        }

        page.classList.add("section-exit");

        setTimeout(() => {

            page.classList.remove(
                "active-section"
            );

            page.classList.add(
                "hidden-section"
            );

            page.classList.remove(
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
    ==========================================
    MARK VISITED
    (now also persists to localStorage, and
    can skip the pulse animation when restoring
    state on page load)
    ==========================================
    */

    function setVisited(target, options) {

        const animate =
            !options || options.animate !== false;

        if (!visited[target]) {

            visited[target] = true;

            saveVisitedToStorage();

        }


        const card = document.querySelector(
            `.surprise-card[data-target="${target}"]`
        );

        if (card) {

            card.classList.add("visited");

            if (animate) {

                card.classList.remove(
                    "visited-animation"
                );

                void card.offsetWidth;

                card.classList.add(
                    "visited-animation"
                );

            }

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
    CARD CLICK — mark visited, then navigate
    ==========================================
    */

    surpriseCards.forEach((card) => {

        card.addEventListener("click", () => {

            const target = card.dataset.target;

            if (!target) {
                return;
            }

            setVisited(target);

            goToMenuPage(target);

        });

    });


    /*
    ==========================================
    BACK BUTTON ON EACH MENU PAGE
    ==========================================
    */

    Object.keys(menuPages).forEach((target) => {

        const page = menuPages[target];

        if (!page) {
            return;
        }

        const backButton = page.querySelector(
            "[data-back]"
        );

        if (!backButton) {
            return;
        }

        backButton.addEventListener(
            "click",
            () => goBackToHub(target)
        );

    });


    /*
    ==========================================
    RESTORE PROGRESS FROM A PREVIOUS VISIT
    ==========================================
    */

    const storedVisited = loadVisitedFromStorage();

    if (storedVisited) {

        Object.keys(visited).forEach((target) => {

            if (storedVisited[target]) {

                setVisited(target, { animate: false });

            }

        });

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
                Phase 10 (transition) dan Phase 14
                (Our Future) akan disambungkan
                setelah keempat halaman menu selesai
                dibangun sesuai konsep.
                */

                console.log(
                    "Continue to Phase 10 — Our Future transition"
                );

            }
        );

    }

});


/* ==========================================
   PHASE 05 — HUB CINEMATIC REDESIGN
   (additive: click sparkle burst + double-click
   guard on top of the existing hub logic above.
   Does not touch the block above.)
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