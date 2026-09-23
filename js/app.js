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
    "Hmm, bukan itu... coba ingat lagi ya ❤️",
    "Belum tepat, tapi aku suka kamu terus mencoba 🌸",
    "Bukan yang itu... coba ingat momen kita lagi",
    "Salah kode, tapi tidak salah orang kok 😉",
    "Coba lagi, aku yakin kamu ingat kok 🌿"
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
