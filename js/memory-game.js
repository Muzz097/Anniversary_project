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

    const characterCelebration =
        document.getElementById("characterCelebration");

        


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
        gameBoard.classList.remove("dissolve");
        
        gameBoard.classList.remove("board-enter");
        void gameBoard.offsetWidth;
        gameBoard.classList.add("board-enter");

        setTimeout(() => {
            gameBoard.classList.remove("board-enter");
        }, 1000);


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

                    <span class="card-back-monogram" aria-hidden="true">

                        <span class="monogram-hearts"></span>

                        <span class="monogram-text">A<span class="monogram-heart">♥</span>S</span>

                        <span class="monogram-sub">our little story</span>

                    </span>

                </span>

                <span class="memory-card-back">

                    <img
                        src="${card.image}"
                        alt="${card.alt}"
                    >

                    <span class="matched-heart-badge" aria-hidden="true"></span>

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


        celebrateMatch(firstCard, secondCard);

        triggerCharacterCelebration();


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
    MATCH CELEBRATION
    ========================================== */
    

    function celebrateMatch(cardA, cardB) {

        if (!gameBoard) {
            return;
        }

        const boardRect =
            gameBoard.getBoundingClientRect();

        const rectA = cardA.getBoundingClientRect();
        const rectB = cardB.getBoundingClientRect();

        const centerA = {
            x: rectA.left + rectA.width / 2 - boardRect.left,
            y: rectA.top + rectA.height / 2 - boardRect.top
        };

        const centerB = {
            x: rectB.left + rectB.width / 2 - boardRect.left,
            y: rectB.top + rectB.height / 2 - boardRect.top
        };

        const midpoint = {
            x: (centerA.x + centerB.x) / 2,
            y: (centerA.y + centerB.y) / 2
        };

        const dx = centerB.x - centerA.x;
        const dy = centerB.y - centerA.y;

        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);


        const celebration =
            document.createElement("div");

        celebration.className = "match-celebration";


        /* Connector beam */

        const connector =
            document.createElement("span");

        connector.className = "match-connector";

        connector.style.left = centerA.x + "px";
        connector.style.top = centerA.y + "px";
        connector.style.width = distance + "px";

        connector.style.setProperty(
            "--angle", angle + "deg"
        );

        celebration.appendChild(connector);


        /* Shockwave */

        const shockwave =
            document.createElement("span");

        shockwave.className = "match-shockwave";

        shockwave.style.left = midpoint.x + "px";
        shockwave.style.top = midpoint.y + "px";

        celebration.appendChild(shockwave);


        /* Particle burst */

        const particleTypes = [
            "heart-particle",
            "sparkle-particle",
            "spark-dot",
            "mini-petal"
        ];

        const totalParticles = 14;

        for (let i = 0; i < totalParticles; i++) {

            const particle =
                document.createElement("span");

            const type =
                particleTypes[i % particleTypes.length];

            particle.className =
                "match-particle " + type;

            const burstAngle = Math.random() * 360;
            const spread = 34 + Math.random() * 46;

            const tx =
                Math.cos(burstAngle * Math.PI / 180) * spread;

            const ty =
                Math.sin(burstAngle * Math.PI / 180) * spread;

            particle.style.left = midpoint.x + "px";
            particle.style.top = midpoint.y + "px";

            particle.style.setProperty("--tx", tx + "px");
            particle.style.setProperty("--ty", ty + "px");

            particle.style.setProperty(
                "--duration",
                (1.1 + Math.random() * 0.7) + "s"
            );

            particle.style.animationDelay =
                (Math.random() * 0.2) + "s";

            celebration.appendChild(particle);

        }


        gameBoard.appendChild(celebration);


        /* Trigger the surface sweep on both cards */

        cardA.classList.add("match-celebration-card");
        cardB.classList.add("match-celebration-card");


        /* Clean up once the celebration finishes */

        setTimeout(() => {

            celebration.remove();

            cardA.classList.remove(
                "match-celebration-card"
            );

            cardB.classList.remove(
                "match-celebration-card"
            );

        }, 1300);

    }


    /*
    ==========================================
    CHARACTER CELEBRATION
    ==========================================
    */

    function triggerCharacterCelebration() {

        if (!characterCelebration) {
            return;
        }

        characterCelebration.classList.remove(
            "show", "dissolve"
        );

        void characterCelebration.offsetWidth;


        /*
        Small random variation each time so a
        single character asset doesn't feel
        monotonous across all three matches.
        */

        const randomRotate =
            (Math.random() * 10 - 5).toFixed(1);

        const randomShift =
            (Math.random() * 16 - 8).toFixed(1);

        characterCelebration.style.setProperty(
            "--enter-rotate", randomRotate + "deg"
        );

        characterCelebration.style.setProperty(
            "--enter-shift", randomShift + "px"
        );

        characterCelebration.classList.add("show");


        setTimeout(() => {

            characterCelebration.classList.remove("show");
            characterCelebration.classList.add("dissolve");

            setTimeout(() => {

                characterCelebration.classList.remove(
                    "dissolve"
                );

            }, 500);

        }, 1900);

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

   
    gameBoard.classList.add("dissolve");


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

    spawnKetemuConfetti();

}


function spawnKetemuConfetti() {

    const container =
        document.getElementById("ketemuConfetti");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    const total = 18;

    for (let i = 0; i < total; i++) {

        const piece =
            document.createElement("span");

        const isHeart = i % 2 === 0;

        piece.className =
            isHeart ? "confetti-heart" : "confetti-petal";

        piece.style.left =
            Math.random() * 100 + "%";

        piece.style.animationDelay =
            (Math.random() * 1.2) + "s";

        piece.style.animationDuration =
            (2.2 + Math.random() * 1.6) + "s";

        container.appendChild(piece);

    }

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
