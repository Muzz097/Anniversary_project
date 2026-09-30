/* ==========================================
   MESSAGE — TAHAP 1: OPENING SCENE
   (Phase 06 — "A Letter For You")
   ==========================================

   Tahap 2 (full letter) dan Tahap 3 (29 Reasons) BELUM
   dibangun di sini. File ini hanya:

   1. Menjalankan animasi masuk milik Tahap 1 (lewat CSS,
      tidak ada yang perlu di-trigger dari JS untuk itu).
   2. Menyediakan hook yang jelas — messageStage + class
      .is-transitioning-to-letter + window.enterMessageFullLetter —
      supaya Tahap 2 bisa disambungkan nanti tanpa mengubah
      ulang apa pun di Tahap 1.

   Progress "Message sudah dikunjungi" sudah ditangani oleh
   sistem Phase 05 yang ada (app.js, setVisited saat kartu di
   hub diklik) — file ini tidak menyentuh itu sama sekali.
*/

document.addEventListener("DOMContentLoaded", () => {

    const messageSection = document.getElementById("messageSection");
    const envelope = document.getElementById("msgEnvelope");
    const openBtn = document.getElementById("msgOpenBtn");

    if (!messageSection) {
        return;
    }

    /*
    ==========================================
    STATE
    ==========================================
    */

    let messageStage = "intro";
    let isTransitioning = false;


    /*
    ==========================================
    OPEN LETTER
    ==========================================
    */

    function openLetter() {

        if (isTransitioning || messageStage !== "intro") {
            return;
        }

        isTransitioning = true;

        if (envelope) {

            envelope.classList.remove("is-opening");

            void envelope.offsetWidth;

            envelope.classList.add("is-opening");

        }

        messageSection.classList.add("is-transitioning-to-letter");

        setTimeout(() => {

            messageStage = "full-letter";

            /*
            Hook untuk Tahap 2 (Full Letter). Setelah halaman
            surat penuh dibangun, cukup definisikan fungsi ini
            di file itu (mis. window.enterMessageFullLetter =
            function () {...}) — kode Tahap 1 di sini tidak
            perlu diubah sama sekali.
            */

            if (typeof window.enterMessageFullLetter === "function") {

                window.enterMessageFullLetter();

            } else {

                console.log(
                    "Message: Tahap 1 selesai, siap masuk Tahap 2 " +
                    "(full letter) — halaman itu belum dibangun."
                );

                messageSection.classList.remove(
                    "is-transitioning-to-letter"
                );

                messageStage = "intro";

            }

            isTransitioning = false;

        }, 550);

    }


    /*
    ==========================================
    WIRING (amplop + tombol memicu aksi yang sama)
    ==========================================
    */

    if (envelope) {
        envelope.addEventListener("click", openLetter);
    }

    if (openBtn) {
        openBtn.addEventListener("click", openLetter);
    }


    /*
    Diekspos read-only untuk debugging / dipakai Tahap 2 nanti,
    mengikuti pola window.goToSurpriseHub /
    window.initializeMemoryGame yang sudah ada di project ini.
    */

    window.getMessageStage = () => messageStage;

});