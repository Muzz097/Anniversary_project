/* ==========================================
   PHASE 03 — MEMORY MATCH GAME
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const gameSection = document.getElementById("memoryGame");
    const gameBoard = document.getElementById("memoryGameBoard");

    const pairsFoundElement =
        document.getElementById("memoryPairsFound");

    const matchMessage =
        document.getElementById("memoryMatchMessage");

    const matchText =
        document.getElementById("memoryMatchText");

    const progressDots =
        document.querySelectorAll(".progress-dot");

    const ketemuSection =
        document.getElementById("ketemuSection");

    const ketemuContinue =
        document.getElementById("ketemuContinue");


    /*
    ==========================================
    GAME DATA
    ==========================================
    */

    const cardData = [

        {
            id: "peony",
            pair: "nature",
            type: "image",
            image: "assets/images/game/bunga.jpg",
            alt: "Peony"
        },

        {
            id: "leaf",
            pair: "nature",
            type: "image",
            image: "assets/images/game/daun.jpg",
            alt: "Leaf"
        },

        {
            id: "rose",
            pair: "sweet",
            type: "image",
            image: "assets/images/game/rose.jpeg",
            alt: "Rose"
        },

        {
            id: "chocolate",
            pair: "sweet",
            type: "image",
            image: "assets/images/game/silverqueen.jpg",
            alt: "Chocolate"
        },

        {
            id: "you",
            pair: "us",
            type: "image",
            image: "assets/images/game/aku.jpeg",
            alt: "You"
        },

        {
            id: "ailsa",
            pair: "us",
            type: "image",
            image: "assets/images/game/ailsa.jpeg",
            alt: "Ailsa"
        }

    ];


    /*
    ==========================================
    GAME STATE
    ==========================================
    */

    let firstCard = null;
    let secondCard = null;

    let lockBoard = false;

    let matchedPairs = 0;


    /*
    ==========================================
    MATCH MESSAGES
    ==========================================
    */

    const matchMessages = {
        nature: "Just like us...",
        sweet: "Some things are meant to be together.",
        us: "And then... there was us."
    };


    /*
    ==========================================
    SHUFFLE
    ==========================================
    */

    function shuffleCards(cards) {

        const shuffled = [...cards];

        for (
            let i = shuffled.length - 1;
            i > 0;
            i--
        ) {

            const randomIndex =
                Math.floor(Math.random() * (i + 1));

            [
                shuffled[i],
                shuffled[randomIndex]
            ] = [
                shuffled[randomIndex],
                shuffled[i]
            ];

        }

        return shuffled;
    }


    /*
    ==========================================
    CREATE GAME
    ==========================================
    */

    function createGame() {

        gameBoard.innerHTML = "";

        firstCard = null;
        secondCard = null;

        lockBoard = false;
        matchedPairs = 0;

        updateProgress();

        const shuffledCards =
            shuffleCards(cardData);

        shuffledCards.forEach((card) => {

            const cardElement =
                createCard(card);

            gameBoard.appendChild(cardElement);

        });

    }


    /*
    ==========================================
    CREATE CARD
    ==========================================
    */

    function createCard(card) {

        const button =
            document.createElement("button");

        button.type = "button";

        button.classList.add("memory-card");

        button.dataset.id = card.id;
        button.dataset.pair = card.pair;


        button.innerHTML = `

            <span class="memory-card-inner">

                <span class="memory-card-front">

                    <span class="card-question">
                        ?
                    </span>

                </span>

                <span class="memory-card-back">

                    <img
                        src="${card.image}"
                        alt="${card.alt}"
                    >

                </span>

            </span>

        `;


        button.addEventListener(
            "click",
            () => handleCardClick(button)
        );


        return button;
    }


    /*
    ==========================================
    CARD CLICK
    ==========================================
    */

    function handleCardClick(card) {

        if (lockBoard) {
            return;
        }

        if (card === firstCard) {
            return;
        }

        if (
            card.classList.contains("matched")
        ) {
            return;
        }


        flipCard(card);


        if (!firstCard) {

            firstCard = card;

            return;
        }


        secondCard = card;

        lockBoard = true;

        checkMatch();

    }


    /*
    ==========================================
    FLIP CARD
    ==========================================
    */

    function flipCard(card) {

        card.classList.add("flipped");

    }


    /*
    ==========================================
    CHECK MATCH
    ==========================================
    */

    function checkMatch() {

        const isMatch =
            firstCard.dataset.pair ===
            secondCard.dataset.pair;


        if (isMatch) {

            handleMatch();

        } else {

            handleMismatch();

        }

    }


    /*
    ==========================================
    MATCH
    ==========================================
    */

    function handleMatch() {

        firstCard.classList.add("matched");
        secondCard.classList.add("matched");


        firstCard.classList.add("match-animation");
        secondCard.classList.add("match-animation");


        const pairType =
            firstCard.dataset.pair;


        showMatchMessage(
            matchMessages[pairType]
        );


        matchedPairs++;

        updateProgress();


        setTimeout(() => {

            firstCard.classList.remove(
                "match-animation"
            );

            secondCard.classList.remove(
                "match-animation"
            );


            resetTurn();


            if (matchedPairs === 3) {

                finishGame();

            }

        }, 1300);

    }


    /*
    ==========================================
    MISMATCH
    ==========================================
    */

    function handleMismatch() {

        firstCard.classList.add(
            "mismatch-animation"
        );

        secondCard.classList.add(
            "mismatch-animation"
        );


        setTimeout(() => {

            firstCard.classList.remove(
                "flipped",
                "mismatch-animation"
            );

            secondCard.classList.remove(
                "flipped",
                "mismatch-animation"
            );


            resetTurn();

        }, 900);

    }


    /*
    ==========================================
    RESET TURN
    ==========================================
    */

    function resetTurn() {

        firstCard = null;
        secondCard = null;

        lockBoard = false;

    }


    /*
    ==========================================
    UPDATE PROGRESS
    ==========================================
    */

    function updateProgress() {

        if (pairsFoundElement) {

            pairsFoundElement.textContent =
                matchedPairs;

        }


        progressDots.forEach(
            (dot, index) => {

                if (index < matchedPairs) {

                    dot.classList.add("completed");

                } else {

                    dot.classList.remove("completed");

                }

            }
        );

    }


    /*
    ==========================================
    MATCH MESSAGE
    ==========================================
    */

    function showMatchMessage(message) {

        matchText.textContent = message;

        matchMessage.classList.remove(
            "show"
        );


        /*
        Force browser reflow so
        animation can restart.
        */

        void matchMessage.offsetWidth;


        matchMessage.classList.add("show");

    }


    /*
    ==========================================
    GAME FINISHED
    ==========================================
    */

    function finishGame() {

        lockBoard = true;


        setTimeout(() => {

            transitionToKetemu();

        }, 1800);

    }


    /*
    ==========================================
    TRANSITION TO PHASE 04
    ==========================================
    */

    function transitionToKetemu() {

        gameSection.classList.add(
            "section-exit"
        );


        setTimeout(() => {

            gameSection.classList.remove(
                "active-section"
            );

            gameSection.classList.add(
                "hidden-section"
            );


            gameSection.classList.remove(
                "section-exit"
            );


            ketemuSection.classList.remove(
                "hidden-section"
            );

            ketemuSection.classList.add(
                "active-section"
            );


            window.scrollTo({
                top: 0,
                behavior: "instant"
            });


            startKetemuAnimation();

        }, 1000);

    }


    /*
    ==========================================
    PHASE 04 ANIMATION
    ==========================================
    */

    function startKetemuAnimation() {

        ketemuSection.classList.add(
            "ketemu-start"
        );

    }


    /*
    ==========================================
    CONTINUE BUTTON
    ==========================================
    */

    if (ketemuContinue) {

        ketemuContinue.addEventListener(
            "click",
            () => {

                /*
                Phase 05 — Choose Your Surprise
                is defined in app.js and exposed
                as window.goToSurpriseHub, the
                same pattern as
                window.initializeMemoryGame.
                */

                if (
                    typeof window.goToSurpriseHub
                    === "function"
                ) {

                    window.goToSurpriseHub();

                }

            }
        );

    }


    /*
    ==========================================
    INITIALIZE
    ==========================================
    */

    createGame();


    /*
    ==========================================
    EXPOSE GAME INITIALIZER
    ==========================================
    */

    window.initializeMemoryGame =
        createGame;

});
