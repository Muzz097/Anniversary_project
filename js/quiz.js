/* ==========================================
   MEMORY QUIZ — Phase 07 / Memories, Phase 1
   ("Do You Remember Our Story?")
   ==========================================
   Navigasi hub <-> halaman, tombol back, dan progress "visited"
   Phase 05 ditangani app.js — file ini tidak menyentuhnya.
*/

/* ==========================================
   >>> EDIT DI SINI: PERTANYAAN & JAWABAN <<<
   - question     : teks pertanyaan
   - answers      : 2-4 pilihan (disarankan 3)
   - correctIndex : urutan jawaban benar, mulai dari 0
   Jumlah pertanyaan bebas; "5" di tampilan mengikuti panjang list ini.
========================================== */

const MEMORY_QUIZ_QUESTIONS = [
    {
        question: "Dimana kita pertama kali bertemu?",
        answers: [
            "Di Alfamart PSM",
            "Di ICB",
            "Di suatu kelas",
            "Di hatimu"
        ],
        correctIndex: 2
    },
    {   /* TODO: ganti dengan pertanyaan asli */
        question: "Ditanggal berapa kita mulai DM an?",
        answers: ["25 Juli 2025", "28 Juli 2025", "20 Juli 2025", "23 Juli 2025"],
        correctIndex: 3
    },
    {   /* TODO */
        question: "Kita pakai baju apa ketika kita pertama kali foto bareng?",
        answers: ["Daun pake kemeja biru, kamu pake cardigan merah manis", "Daun pake PDL Paskibra, kamu pake olahraga ICB", "Daun pake Seragam ICB, kamu pake seragam produktif Farmasi imut", "Daun pake Jas hitam , kamu pake Dress Abu cantik"],
        correctIndex: 1
    },
    {   /* TODO */
        question: "First Time kita saling pelukan saat kapan?",
        answers: ["Saat hari ulang tahun mu", "Saat kita pertama kali bertemu", "Saat aku cengeng", "Saat kamu belajar motor di GBLA"],
        correctIndex: 0
    },
    {   /* TODO */
        question: "Menurut mu, mana nama yang benar yang mengandung rancangan masa depan kita?",
        answers: ["Claraquin Indestianty Shafira dan Calvian Silvansa Musyaffa", "Claraquin Indesty Shafira dan Calvian Silvan Musyafa", "Claraquin Indesty Shafira dan Calvian Silvansa Musyaffa", "Claraqueen Indesty Syafira dan Calvin Silvasa Musyaffa"],
        correctIndex: 2
    }
];

/* Variasi feedback (dipilih acak, tidak berulang berturut-turut) */

const MEMORY_QUIZ_CORRECT_FEEDBACK = [
    { title: "Yay, you remember it! ♡", sub: "You still remember our little story." },
    { title: "Tuh kan, kamu inget! ♡", sub: "Aku tahu kamu nggak bakal lupa." },
    { title: "Benar banget! ♡", sub: "Satu kenangan lagi tersimpan." }
];

const MEMORY_QUIZ_WRONG_FEEDBACK = [
    { title: "Masa yang ini lupa sih? ♡", sub: "Ga mungkin kamu lupa yang ini." },
    { title: "Hmm, coba ingat lagi ya… ♡", sub: "Pelan-pelan aja, sayang." },
    { title: "Ihh, hampir! ♡", sub: "Pilih yang lain, kamu pasti bisa." }
];

const MEMORY_QUIZ_ADVANCE_DELAY = 1700;   /* jeda setelah jawaban benar (ms) */
const MEMORY_QUIZ_WRONG_LOCK = 650;       /* kunci singkat setelah salah (ms) */


document.addEventListener("DOMContentLoaded", () => {

    const page = document.getElementById("memoriesSection");

    if (!page || !document.getElementById("mqAnswers")) {
        return;
    }

    const $ = (id) => document.getElementById(id);

    const els = {
        card: $("mqCard"), label: $("mqLabel"), question: $("mqQuestion"),
        answers: $("mqAnswers"), feedback: $("mqFeedback"),
        fbTitle: page.querySelector(".mq-feedback-title"),
        fbSub: page.querySelector(".mq-feedback-sub"),
        count: $("mqCount"), bar: $("mqBar"), barFill: $("mqBarFill"),
        percent: $("mqPercent"), heartWrap: $("mqHeartWrap"),
        result: $("mqResult"), resultBtn: $("mqResultBtn"),
        timeline: $("mqTimeline")
    };

    const questions = MEMORY_QUIZ_QUESTIONS;
    const total = questions.length;

    const state = {
        currentQuestion: 0,
        selectedAnswer: null,
        correctAnswers: 0,
        progress: 0,
        quizCompleted: false
    };

    let locked = false;
    let advanceTimer = 0;
    let unlockTimer = 0;
    const lastPick = { correct: -1, wrong: -1 };

    const CHECK_SVG =
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';


    /* ---------- helpers ---------- */

    function pickFeedback(list, key) {

        let index = Math.floor(Math.random() * list.length);

        if (list.length > 1 && index === lastPick[key]) {
            index = (index + 1) % list.length;
        }

        lastPick[key] = index;

        return list[index];

    }

    function showFeedback(item, type) {

        els.fbTitle.textContent = item.title;
        els.fbSub.textContent = item.sub;

        els.feedback.classList.remove("is-correct", "is-wrong", "is-visible");

        void els.feedback.offsetWidth;

        els.feedback.classList.add("is-visible", type === "correct" ? "is-correct" : "is-wrong");

    }

    function clearFeedback() {

        els.feedback.classList.remove("is-visible", "is-correct", "is-wrong");

    }

    function spawnBurst(count) {

        const reduce = window.matchMedia &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (reduce || !els.heartWrap) {
            return;
        }

        for (let i = 0; i < count; i++) {

            const spark = document.createElement("span");
            const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
            const dist = 26 + Math.random() * 26;

            spark.className = "mq-spark " + (i % 2 ? "mq-spark-star" : "mq-spark-heart");
            spark.style.setProperty("--tx", Math.cos(angle) * dist + "px");
            spark.style.setProperty("--ty", Math.sin(angle) * dist + "px");
            spark.style.animationDelay = (i * 0.04) + "s";

            spark.addEventListener("animationend", () => spark.remove());

            els.heartWrap.appendChild(spark);

        }

    }


    /* ---------- progress ---------- */

    function updateProgress() {

        state.progress = Math.round((state.correctAnswers / total) * 100);

        els.barFill.style.width = state.progress + "%";
        els.percent.textContent = state.progress + "%";
        els.count.textContent =
            state.correctAnswers + " / " + total + " memories remembered";

        els.bar.setAttribute("aria-valuenow", String(state.progress));
        els.heartWrap.style.setProperty("--mq-fill", String(state.progress / 100));

        els.heartWrap.classList.remove("is-glowing");
        void els.heartWrap.offsetWidth;
        els.heartWrap.classList.add("is-glowing");

    }


    /* ---------- render question ---------- */

    function renderQuestion() {

        const q = questions[state.currentQuestion];

        state.selectedAnswer = null;
        locked = false;

        els.label.textContent =
            "Memory " + String(state.currentQuestion + 1).padStart(2, "0") +
            " / " + String(total).padStart(2, "0");

        els.question.textContent = q.question;
        els.answers.innerHTML = "";

        q.answers.forEach((text, index) => {

            const btn = document.createElement("button");

            btn.type = "button";
            btn.className = "mq-answer";
            btn.dataset.index = String(index);

            const label = document.createElement("span");
            label.className = "mq-answer-text";
            label.textContent = text;

            const check = document.createElement("span");
            check.className = "mq-check";
            check.innerHTML = CHECK_SVG;

            btn.append(label, check);
            btn.addEventListener("click", () => handleAnswer(index, btn));

            els.answers.appendChild(btn);

        });

        els.card.classList.remove("is-entering");
        void els.card.offsetWidth;
        els.card.classList.add("is-entering");

        clearFeedback();

    }


    /* ---------- answer ---------- */

    function handleAnswer(index, btn) {

        if (locked || state.quizCompleted || btn.disabled) {
            return;
        }

        state.selectedAnswer = index;

        const q = questions[state.currentQuestion];

        if (index === q.correctIndex) {

            /* benar: dikunci penuh -> tidak bisa dihitung dua kali */

            locked = true;

            state.correctAnswers += 1;

            btn.classList.add("is-correct");

            els.answers.querySelectorAll(".mq-answer").forEach((b) => {
                b.disabled = true;
            });

            updateProgress();
            spawnBurst(7);
            showFeedback(pickFeedback(MEMORY_QUIZ_CORRECT_FEEDBACK, "correct"), "correct");

            advanceTimer = setTimeout(nextQuestion, MEMORY_QUIZ_ADVANCE_DELAY);

            return;

        }

        /* salah: pilihan itu dinonaktifkan, progress tetap, boleh coba
           pilihan lain -> pengguna tidak mungkin terjebak */

        locked = true;

        btn.disabled = true;
        btn.classList.remove("is-wrong");
        void btn.offsetWidth;
        btn.classList.add("is-wrong");

        els.card.classList.remove("is-shaking");
        void els.card.offsetWidth;
        els.card.classList.add("is-shaking");

        showFeedback(pickFeedback(MEMORY_QUIZ_WRONG_FEEDBACK, "wrong"), "wrong");

        unlockTimer = setTimeout(() => {
            locked = false;
            els.card.classList.remove("is-shaking");
        }, MEMORY_QUIZ_WRONG_LOCK);

    }

    function nextQuestion() {

        state.currentQuestion += 1;

        if (state.currentQuestion >= total) {
            finishQuiz();
            return;
        }

        renderQuestion();

    }


    /* ---------- finish ---------- */

    function finishQuiz() {

        state.quizCompleted = true;

        clearTimeout(advanceTimer);
        clearTimeout(unlockTimer);

        els.card.hidden = true;
        els.feedback.hidden = true;

        els.result.hidden = false;
        page.classList.add("is-complete");

        spawnBurst(12);

        const heading = els.result.querySelector(".mq-result-title");

        if (heading) {
            heading.setAttribute("tabindex", "-1");
            heading.focus({ preventScroll: true });
        }

    }

    /* Tombol ini baru ada setelah quiz selesai. Halaman timeline
       (Phase 2) cukup mendefinisikan window.enterMemoriesTimeline. */

    if (els.resultBtn) {

        els.resultBtn.addEventListener("click", () => {

            if (!state.quizCompleted) {
                return;
            }

            if (typeof window.enterMemoriesTimeline === "function") {
                window.enterMemoriesTimeline();
                return;
            }

            els.result.hidden = true;

            if (els.timeline) {
                els.timeline.hidden = false;
            }

            window.scrollTo({ top: 0, behavior: "smooth" });

        });

    }


    /* ---------- start ---------- */

    updateProgress();
    renderQuestion();

    window.getMemoryQuizState = () => Object.assign({}, state);

});

/* ==========================================
   MEMORIES — PHASE 2: HALAMAN UTAMA
   (opening + timeline + Our Story Video)
   ==========================================
   Tampil setelah Memory Quiz selesai: tombol hasil quiz memanggil
   window.enterMemoriesTimeline (didefinisikan di bawah). Navigasi hub,
   progress "visited", dan audio global (music.js) tidak disentuh.
*/

/* ==========================================
   >>> EDIT DI SINI: DATA <<<
========================================== */

/* Cerita pembuka (satu string = satu paragraf) */

const memoriesIntro = {
    paragraphs: [
        `Ailsa Indestianty Anindyta yang ku sayang, kalau dipikir-pikir lagi,
        ternyata udah banyak banget tauu hal yang kita lewatin selama ini.
        Rasanya baru kemarin kita mulai ngobrol bareng,
        eh sekarang kita udah punya kenangan sebuanyak mungkin
        yang kalau diingat-ingat lagi bisa bikin aku senyum senyum sendiri saking gemesnya.`,

        `Jadi, yuu kita lihat lagi cerita kita dari awal sampai sejauh ini.
        Dan kalau nanti kita udah selesai melihat semuanya,
        aku harap kamu tau satu hal:
        aku seneng banget karena semua cerita kita ini
        ada kamu di dalamnya.`
    ]
};


/* Foto photostrip di samping text box (3 foto) */
const memoriesStrip = [
    "/assets/images/couple/photo-04.jpeg",
    "/assets/images/memories/tepi-gunung1.jpeg",
    "/assets/images/couple/strip02.jpeg"
];

/* Timeline.
   layout : "left"   foto kiri, teks kanan
            "right"  foto kanan, teks kiri
            "center" foto di tengah, teks di bawah
            "stack"  polaroid bertumpuk (isi `images` dengan 2-3 foto)
   image  : satu foto (untuk left / right / center)
   images : daftar foto (untuk stack)
   location boleh dikosongkan "" */
const memories = [
    {
        date: "30 AUG 2025",
        title: "Awal dari segalanya",
        description: "Hari dimana kita pertama kali bertemu sebagai JUST FRIENDS, tapi ternyata itu awal dari segalanya yaa sayang. dan fun fact ini foto kita satu satunya di hari pertama aku nembak kamu hihi, makanya Aku seneng banget untung kamu nge candit di hari itu, kalau engga gatau deh kita mengenang nya mau seperti apa :D",
        image: "/assets/images/memories/30agustus.jpeg",
        location: "Alfamart PSM, Babakan Siliwangi, Taman Photo, and Wizzmie",
        layout: "left"
    },
    {
        date: "12 SEP 2025",
        title: "Foto Pertama Kita",
        description: "Tau ga sih dihari ini salah satu mimpi aku bisa foto bareng sama princesss tercantikk yang ku sayang itu bisa terwujud, dan ini juga awal dari segalanya yang sekarang udah selaluu fotbar kita hihii, dimulai dari aku iseng kode buka kamera dilaptop dan akhirnya dibales juga kode ku sama kamuu cintanya aku nihhh, makasiiih princess mulai dari sini juga aku mulai terus belajar buat caranya buat senyum tuh gimana, dan of course di ajarin juga sama satu satunya my future wife yaituu kamuuu :b",
        image: "/assets/images/memories/fotbar-first.jpeg",
        location: "Kedai si ibu mie jebew PSM",
        layout: "right"
    },
    {
        date: "20 OKT 2025",
        title: "Awal mula mama yi papa with Arka",
        description: "Disini momen aku pertama kali ketemu arka setelah kamu cerita kalau arka itu selalu di rumah dan jarang main, makanya aku ngebet juga pengen ajak main adik kamuu yang nanti jadi ipar aku nanti hhe aamiin, makasih ya sayang udah memperkenalkan arka dunia mu ke aku, hingga sekarang aku pengen selalu ajak arka main kemanapun yang dia belum pernah samsek bersama mu jugaa, aku bener bener liat arka kaya aku dulu jadi izin ya sayang aku anggap adik sendiri dan mencoba jadi kakak yang baik juga seperti mu kakak yang terbaik buat adik adikmu",
        image: "/assets/images/memories/witharka.jpeg",
        location: "Playground Pahlawan & Sabana Fried Chicken",
        layout: "left"
    },
    {
        date: "24 NOV 2025",
        title: "First time fotbar (prewed) dengan kostum tarimu",
        description: "Inget ga sayang disini? yang sampai sekarang masih jadi pembahasan.. dimana pertama kali juga aku digandeng sama perempuan seumur hidup ku loh, mana sama bidadari paling cantik manis indah cintaanya aku, ya gimana ga nge geter banget tuh tanganku digandengnya haha, dan aku seneng banget juga bangga sama bakat kamu seperti tari ini.. sekali lagi Aku bangga banget sama kamu sayang. Seneng tau rasanya bisa lihat kamu memberikan yang terbaik, bukan cuma saat tampil, tapi juga dari semua proses di balik panggung yang nggak semua orang lihat. Nah Aku bersyukur bisa ada didalam cerita-cerita kamu, menyaksikan kamu berkembang, dan melihat kamu bersinar dengan caramu sendiri. im so proud of youu princess, semangattt",
        images: [
            "/assets/images/memories/latian-nari.jpeg",
            "/assets/images/couple/strip01.jpeg",
            "/assets/images/memories/after-nari.jpeg"
        ],
        location: "SMK ICB CT",
        layout: "stack"
    },
     {
        date: "01 DES 2025",
        title: "My Special Little Gift 3 month Mensiversary",
        description: "Aku lagi menyelam dan salfok sama momen ini tau, sayangkuu. Wkwk, masih inget nggak sama hadiah kecil kecialan ini? wlee, Kalau dipikir-pikir lucu juga yaa sayang soalnya aku inget banget ketika aku buat itu disetiap prosesnya di pikiran ku cuma tentang kamu sayangg. dan maaf yaa Sederhana banget nih hadiah ku kala itu dan meski begitu aku seneng banget kamu menerimanya dengan bahagia jugaa cintaku walau masih kecil kecilan begitu, makanya hal-hal kayak gini yang bikin aku seneng kalau diingat lagi. Apalagi sekarang udah lewat cukup lama, rasanya gemes aja ga sih liat kita ngerayain 3 bulan pas itu yang rasanya udah bener bener lumayan jauh nih dan saat itu selalu berdoa dan berharap kita selalu bersama sampai anniv sampai selamanya cenah, ehh sekarang udah mau 14 bulan aja nihh hahaa",
        images: [
            "/assets/images/memories/handmade01.jpeg",
            "/assets/images/memories/handmade02.jpeg"
        ],
        location: "Kedai Ibu Jebew",
        layout: "stack"
    },
     {
        date: "21 DES 2025",
        title: "Si Gosong Juling",
        description: "Before jadi mongling nih si salju haha, iseng aja aku pajang tuan muda Mongling siapa tau mau liat dia di taun 2025 hihi",
        images:  "/assets/images/memories/mongling.jpeg",
        location: "Rumah Om Ace & Cici",
        layout: "right"
    },
     {
        date: "29 DES 2025",
        title: "Your Sweet SevenTeen my love",
        description: "Perayaan Ulang tahun princess pertama kali ketika kita bersama nii, dan akuu bener bener seneng kalau ternyata aku lah orang di sisimu yang bisa merayakan dan menemani mu di saat kamu udah berumur 17 tahun nii sayangg (walau aku berondong masih umur 16 sichh), Dan disini akhirnya suprise ku berhasil yeaa setelah banyaknya suprise yang gagal haha, dan aku juga bisa dapet pelukan pertama ku pertama kita saat hari ini kan cinta, and thats is so memorable and cuteee",
        images: [
            "/assets/images/memories/birthdaysasa01.jpeg",
            "/assets/images/memories/birthdaysasa022.JPG",
            "/assets/images/memories/birthdaysasa03.JPG"
        ],
        location: "Rumah daun & Tahura",
        layout: "stack"
    },
     {
        date: "16 JAN 2026",
        title: "Kekeretaan menuju IKEA",
        description: "Duhh jadi pengen lagi pas liat ini ya ga sih, lucu banget kita akhirnya bisa kekeretan date ke padalarang sayangg, walau akses transport nya susah sih ya di sana nya kaya anak ilang wkwk cuma akhirnya kita bisa ke IKEA untuk pertama kalinya kala itu, jiwa explore kita meronta ronta hihi dan liat liat semua yang ada di dalem sana sabari teu boga duid tea haha, makasih ya sayangg udah selalu bersama disini banyak hal yang udah kita explore dan masih banyak lagi yang belum kita explore jadi aku mau kita terus tetap bersama sampai selamanya yaa sayangg aamiinn, karna nanti ari boga duid mah kita borong se IKEA IKEA nya yuu wkwk, terus udah ini kita dapet pengalaman naik metro trans yaa cinta, lebih tepatnya pengalaman buruk anjay :D",
        images: [
            "/assets/images/memories/ikea03.jpeg",
            "/assets/images/memories/ikea02.jpeg",
            "/assets/images/memories/ikea01.jpeg"
        ],
        location: "IKEA, Kota Baru Parahyangan - Padalarang",
        layout: "stack"
    },
    {
        date: "14 FEB 2026",
        title: "Happy Sweet Valentine my love",
        description: "Alaaa walau rencana ku kala ini ga begitu mulu ya sayangg dan ada drama nya tapi kamu tetep menerima itu dengan sangat baik makasih banyak princessku yang maniss, dan akuu senengg hal itu jadi suatu hal kenangan di perjalanan hidup kita yang gemesinn inii, ga sabar buat Valentine berikutnya :>",
        images: [
            "/assets/images/memories/valentine01.jpeg",
            "/assets/images/memories/valentine02.jpeg",
            "/assets/images/memories/memory-04c.jpg"
        ],
        location: "Summarecon Bandung",
        layout: "stack"
    },
    {
        date: "18 MAR 2026",
        title: "Lengah dikit ke Sumedang",
        description: "Hihii kangen yaa kita main sejauh ini, dan kenangan ini kita ke sumedang bener bener no plan banget yaa langsung tancap gas ae btw wkwk, cuma aku sukaa banget ay kita bisa explore gini sampai sumedang akuu selalu suka motor ku di belakang nya ada bidadari tercintakuu yaitu kamuuu, dan next kita kesini lagii yuu jujur incer tahu nya aja sih hahaha",
        images: [
            "/assets/images/memories/sumedang01.jpeg",
            "/assets/images/memories/sumedang02.jpeg",
            "/assets/images/memories/sumedang03.jpeg"
        ],
        location: "Alun alun Sumedang",
        layout: "stack"
    },
    {
        date: "26 MAR 2026",
        title: "First time mam MBCI 💓",
        description: "YEAYYY INII DIAA YANG BIKIN AKU SUKA PARE PERTAMA KALI YAHH, Masakann darii perempuan imut tercintanyaa akuu yaituu kamuu, bener bener racikan mu bikin pare yang aku pikir pait jadi ga pait tauu malah jadi makanan ter enakkk salah satunya yang akuu coba dariimu, emangg kamu multi talent banget sihh masak ajaa bisaa, bener bener jadi pesulap dari yang pait jadi rasa yang balance manis asin gurih pedes dan ada khas pare nya yang ga pait malah jadi khas gituu :>, kangenn bangett samaa masakan mu ini hihi, walau ga berjalan dengan mulus yaa kala itu.. tapi gapapaa waktu kita masih panjang dan kita masih bisa wujudin yang belum terwujud ko cintaaa <3",
        images: [
            "/assets/images/memories/citambur01.jpeg",
            "/assets/images/memories/citambur02.jpeg"
        ],
        location: "Ranca bali to Citambur, but yea..",
        layout: "stack"
    },
    {
        date: "11 APR 2026",
        title: "Naik angsa sambil di Masakin my princess",
        description: "Ini pengalaman aku yang seru bangett jugaa tau sekaligus wish list bisa nge goes angsa badag bareng kamuu sayangkuu di situ ciburuy inii (next sama arka lah yaa cobain), plus di masakin kangkung dan nasi daun jeruk juga buatan calon istrii ku ini alamakkk terlalu beruntung aku memiliki mu sayanggg karna masakannya juga enakk banget cii dan ada di konten juga kann makasiii",
        images: [
            "/assets/images/memories/ciburuy01.jpeg",
            "/assets/images/memories/ciburuy02.jpeg"
        ],
        location: "Situ Ciburuy",
        layout: "stack"
    },
    {
        date: "15 APR 2026",
        title: "Penampilan Tari indahmu di Gelar Karya",
        description: "Jujur disini aku sibuk jadi operator kali yaa jadi ga bisa lama lama juga banyak banyak dan kamu mau postud, tapi akuu punya video penampilannya ko hihii, penampilan tari kamuu yang lihai itu sayanggg, kamuu bener benerr jagoo dan di lahirkan untuk tari jugaa nihh karna se berbakat itu dari kecil juga, im so proud of youuu princess ku sayanggg, dan ngomongin soal kostum jugaa inii gemesss bangettt cintaakuu ada gelangnya gituu dan warnanyaa juga cocok di kamuu plisss makin bersinar ajaa tauu sayanggnyaa akuu nii :>",
        images:  "/assets/images/memories/tari-gelarkarya.jpeg",
        location: "SMK ICB CT",
        layout: "left"
    },
    {
        date: "18 APR 2026",
        title: "Pertama kali imut ku belajar motor",
        description: "hehehe akhirnyaa aku bisa ajarinn sayangnya aku motor juga di momen ini ay bersama motor kodok merah itu, dan walau ada sebuah tragedi disitu dan sayangku kesakitan, jadi keinget lagii meluk kamu di saat lagi nangiss gituu, jujur merasa bersalah adaa terus kasian juga khawatir tapi di sisi lain aku seneng juga sayang kamuu menangis di dalam pelukan akuu wlee, dan kamuu bisa semanja mungkin sama akuu itu yang akuu sukaa jugaa dengan ke terbukaan nya dirimu samaa diri ku my lovee",
        images:  "/assets/images/memories/bljrmotor.jpeg",
        location: "GBLA - Gede Bage",
        layout: "right"
    },
     {
        date: "03 MEI 2026",
        title: "First time main sama keluarga ku",
        description: "Disini seru banget ga sih ay plus aku seneng banget bisa main sama keluarga ku juga cintaaku dan kita dapet tempat yang adem dan curug pertama yang kita kunjungi kann yaitu curug cipeureu ini hihi, kita main air seru seruan dan ada adagen tigolosor juga sihh wkkw, pokoknya aku sangat seneng ketika keluargaku bisa lebih deket sama kamuu sayangg karna kamu kebanggaannya aku yang perlu aku pamerin dan seriusin nanti hihi",
        images: [
            "/assets/images/memories/cipeureu01.jpeg",
            "/assets/images/memories/cipeureu02.jpeg",
            "/assets/images/memories/cipeureu03.jpeg"
        ],
        location: "Curug Cipeureu & Seblak Cadas",
        layout: "stack"
    },
     {
        date: "16 MEI 2026",
        title: "Chicken Steak Date Special for 2rd champions of LKS",
        description: "Janji ku ketika kamu juara 2 LKS Farmasi nii sayanggg, sumpahh akuu bangga banget sama sayangnya aku dan aku emang udah seyakin ituu kalo kamu bisaa",
        images: [
            "/assets/images/memories/steak01.jpeg",
            "/assets/images/memories/steak02.jpeg",
            "/assets/images/memories/steak03.jpeg"
        ],
        location: "Waroeng Steak",
        layout: "stack"
    },
     {
        date: "23 MEI 2026",
        title: "Ke Garut bareng keluarga ku",
        description: "Part 2 nihh main jauh sama keluarga aku sama bunda aku hihi, dan kita saat itu bener bener perginya nyubuh banget kannn, tapi sangat sangat membuahkan hasil sama pemandangan di kebun kaki gunung cikuray inii yaaa dan banyak vlog juga kitaa hihi, emang ay pilihan bunda asa ga pernah gagal yaa soal wisata mah, udah mah gratis tapi pemandangan sangat sangatt begituu indahh kaya kamuu yang selalu indahh di matakuu dan hatikuu",
        images: [
            "/assets/images/memories/garut01.jpeg",
            "/assets/images/memories/garut02.jpeg",
            "/assets/images/memories/garut03.jpeg"
        ],
        location: "Kaki Gunung Cikuray - Garut",
        layout: "stack"
    },
    {
        date: "06 JUN 2026",
        title: "Momen Bidadari cantik tari di Event Graduate",
        description: "Aku bersyukur bisa jadi orang yang bisa temani di proses mu, di setiap cerita mu loh ay.. dan hari itu akuu bisa jemput kamuu subuh subuh jam 3 an lebih itu jugaa bikin akuu seneng hihi, dan bisa liat kostum kamuu inii yang sangat amat cantikkkk dan sempurna inii karna di pakai sama kamuu sayaangg, udahh ma penampilannya juga kerenn bangett sih emang ga pernah ga keren sayanggkuu ma, dan juga kebetulan ada tukang bunga yang bisa ku beli buat bunga tercintakuu yang udahh berusaha semaksimal mungkin kasih penampilan yang amatt begituu terbaikk, akuu juga senengg fotbar kitaa di hari itu gemess gemess semuaa yakaannnn",
        images: [
            "/assets/images/memories/graduate01.jpeg",
            "/assets/images/memories/graduate02.jpeg",
            "/assets/images/memories/graduate03.jpeg"
        ],
        location: "SMK ICB CT",
        layout: "stack"
    },
     {
        date: "05 JUL 2026",
        title: "Diantara Kopi Cafe Sinlay",
        description: "Akhirnya bisa culik kamu ke cafe sinlay ku ini yang sepi asri, juga sky view yang indah yaaa.. sama kita ada buat trend trend ginii dari wishlist ku terwujud jugaa lucu bangett sihh walau random dikit wkwk ",
        images: [
            "/assets/images/memories/cafe01.jpeg",
            "/assets/images/memories/cafe02.jpeg",
            "/assets/images/memories/cafe03.jpeg"
        ],
        location: "Di antara kopi",
        layout: "stack"
    },
    {
        date: "08 JUL 2026",
        title: "My Sweet Seventeen hehe",
        description: "Sayangg.. di saat orang lain yaa ga ada yang ucapin ultah aku ya, kamu bener bener hadir di hari spesial ku dari pagi sampai malam 24 jam.. makasii yaa sayangkuu kamu sempetin hadir padahal kamuu abis beres PKL cape cape terus udaa kasih aku hadiah rak yang sampai sekarang selalu kepakai dan bergunaa buat kuu.. dan di tengah semua ucapan dan hal-hal yang terjadi di rumah hari itu, aku seneng banget karena kamu ada di sana. Rasanya manis aja kaya kamuu, bisa punya kenangan ulang tahun yang di dalamnya ada kamu. Jadi, kalau suatu hari aku ditanya apa salah satu hal yang paling aku inget dari umur 17 tahun, mungkin salah satunya adalah hari ketika ada kamuu di dalam nya sayangg hihii dan juga kado terbaik di hari ulang tahunku umur 16 tahun itu adalah kehadiran kamuu di hidup ku hihi",
        images: [
            "/assets/images/memories/birthdaydaun-01.jpeg",
            "/assets/images/memories/birthdaydaun-02.jpeg",
            "/assets/images/memories/birthdaydaun-03.jpeg"
        ],
        location: "Rumah Daun",
        layout: "stack"
    },
    {
        date: "19 JUL 2026",
        title: "Ke Tahura with adik arka",
        description: "Hihi sesuai janji kitaa yaa di ulang tahun ku bakal ke tahura part 2 dan sekarang ituu bareng arka, waktuu terasa begitu cepat tau ay di saat ulang tahun mu kita ga sabar pengen ke tahura lagi part dua dan akhirnya udahh kejadian juga kan sampai sekarang udah satu tahun sebulan lebih mau 2 bulan, emang senyaman ituu sayangg akuu samaa kamuu tuuu sampai bumi ini rotasi nya jadi begituu cepatt anjayy",
        images: [
            "/assets/images/memories/tahura02.jpeg",
            "/assets/images/memories/tahura01.jpeg",
            "/assets/images/memories/tahura03.jpeg"
        ],
        location: "Tahura part 2",
        layout: "stack"
    },
    {
        date: "09 AGU 2026",
        title: "Nemenin sayangnya aku Lomba",
        description: "Di hari ini kita yang jadi bapa anak yeee wkwk, akuuu kagumm selalu sama kamu ay karna selalu mau explore banyak hal yang contohnya kamu ikut lomba Shuuji inii dan beruntungnya akuu ialah akuu yang bisa nemenin perempuan hebatt ituu berkarya masya allah :), Im always support youuu honey",
        images: [
            "/assets/images/memories/Pasteur01.jpeg",
            "/assets/images/memories/Pasteur02.jpeg",
            "/assets/images/memories/Pasteur03.jpeg"
        ],
        location: "Pasteur",
        layout: "stack"
    },
     {
        date: "06 SEP 2026 (Di undur)",
        title: "And Finally, Our First Anniversary Shailsa 31 AUGUST",
        description: "Sayanggg, akhirnya momen dan hari yang DI TUNGGU TUNGGU kita sampai jugaa yaa di perayaan Anniversary pertama kita inii :). Walaupun perayaannya harus diundur sii hehe cuma demii kesejahteraan bersama yaa gaa haha, yang penting kita tetap punya kesempatan buat ngerayain hari spesial yang sangat spesial ini bareng-barengg. Dari Tsuka Ramen rekomendasi darimu yang aku baru nyoba ramen pertama kali juga jadi sukaa bangett wish list juga tsuka ramen ini dari jaman kita pdkt akhirnya beneran akuu di temenin kamuu sebagai partner hidup selamanyaa akuu lohh hihi, lanjut ke Makeupucinno tempatnyaa yang kamu mauu dan nanti nantikan juga kann dari SMP sayangg dan akuu seneng banget bisa wujudin ituu bersama samaa :>, terus ke mamah bentar buat kasih oleh oleh make up ituu emang anak yangg teladan banget cii kamuuu kebanggaannya akuu dan mamah pastinyaa, terus sampai ke Playverse dimana awal dari segalanyaaa kita yang bisa sangat terbuka satu sama lain inii dan momen ketawa bareng juga seru seruan bareng yang ga pernah terlupakan inii yaa sayanggg di hari anniv pulaa bener benerr sangatt spesial :),  Seneng banget pliss rasanya bisa ngerayain satu tahun perjalanan kitaa yang banyakk rintangannya ini, mengingat semua yang udah kita lewatin, sekaligus bikin kenangan indah baru lagi. Kalau dipikir-pikir, setahun ini ternyata bukan cuma soal berapa lama kita bersama, tapi juga tentang seberapa banyak hal yang udah kita lewati dan pelajari jugaa untuk saling memperbaiki satu sama lain inii yaa cintakuu. i lovee youuu foreverr",
        images: [
            "/assets/images/memories/anniv02.jpeg",
            "/assets/images/memories/anniv01.jpeg",
            "/assets/images/memories/anniv03.jpeg"
        ],
        location: "Tsuka Ramen - Makeupucinno - Playverse",
        layout: "stack"
    },
    {
        date: "13 SEP 2026",
        title: "And Our Story.. Never end",
        description: "Sayangkuu, aku tahu perjalanan kita ke depan masih panjang, dan aku masih mau menjalani banyak hal bareng kamu. Masih banyak tempat yang ingin kita datangi, cerita yang ingin kita buat, dan mimpi yang ingin kita wujudkan bersama. Aku nggak janji semuanya akan selalu mudah, tapi aku mau terus belajar, berusaha, dan serius membangun masa depan yang indah inii sama kamuuu sayang",
        image: "/assets/images/memories/forever.jpeg",
        location: "Tepi Gunung",
        layout: "left"
    }
];

/* Video: ganti src & poster. Tanpa autoplay. */
const storyVideo = {
    src: "/assets/memories/our-story-video.mp4",
    poster: "/assets/memories/our-story-poster.jpg",
    caption: "Every memory leads me back to you. ♡",
    signature: "— With all my love, Daun nya bunga"
};


document.addEventListener("DOMContentLoaded", () => {

    const page = document.getElementById("memoriesTimelineSection");

    if (!page) {
        return;
    }

    const hub = document.getElementById("surpriseHub");
    const quizPage = document.getElementById("memoriesSection");

    let busy = false;


    /* ---------- helpers ---------- */

    function el(tag, className, text) {

        const node = document.createElement(tag);

        if (className) { node.className = className; }
        if (text) { node.textContent = text; }

        return node;

    }

    function photo(src, alt) {

        const image = document.createElement("img");

        image.alt = alt || "";
        image.loading = "lazy";
        image.decoding = "async";

        /* listener dipasang sebelum src; foto yang belum ada
           tidak memunculkan ikon rusak, bingkai cream tetap tampil */

        image.addEventListener("error", () => {
            image.style.visibility = "hidden";
        });

        image.src = src;

        return image;

    }


    /* ---------- opening ---------- */

    function renderOpening() {

        const box = document.getElementById("memIntroText");
        const strip = document.getElementById("memStripPhotos");

        if (box) {
            memoriesIntro.paragraphs.forEach((text) => {
                box.appendChild(el("p", "", text));
            });
        }

        if (strip) {
            memoriesStrip.forEach((src, index) => {
                const frame = el("span", "mem-strip-photo");
                frame.appendChild(photo(src, "Foto kita " + (index + 1)));
                strip.appendChild(frame);
            });
        }

    }


    /* ---------- foto bertumpuk (stack) ---------- */

/* Mendukung dua format data (keduanya boleh dipakai):
   1) images: ["a.jpg","b.jpg","c.jpg"]   -> format lama, teks sama untuk 3 foto
   2) photos: [{ src, date, title, description, location }, ...]
      -> teks berganti mengikuti foto aktif; field kosong memakai teks memory */

function getSlides(memory) {

    const source = (memory.photos && memory.photos.length)
        ? memory.photos
        : (memory.images || []);

    return source.slice(0, 3).map((item) => {

        const data = typeof item === "string" ? { src: item } : item;

        return {
            src: data.src,
            date: data.date || "",
            title: data.title || "",
            description: data.description || "",
            location: data.location || ""
        };

    });

}

function hasOwnText(slide) {

    return !!(slide.date || slide.title || slide.description || slide.location);

}

function buildStackCard(src, alt) {

    const card = el("span", "mem-stack-card");
    const body = el("span", "mem-stack-body");
    const frame = el("span", "mem-stack-img");

    const image = photo(src, alt);

    image.draggable = false;

    /* proporsi asli (dibatasi 0.78–1.2 supaya bingkai tetap rapi) */

    image.addEventListener("load", () => {

        if (image.naturalWidth && image.naturalHeight) {

            const ratio = image.naturalWidth / image.naturalHeight;

            frame.style.setProperty(
                "--ar",
                Math.min(1.2, Math.max(0.78, ratio)).toFixed(3)
            );

        }

    });

    /* fallback: foto gagal dimuat -> bingkai cream + ikon hati */

    image.addEventListener("error", () => {
        frame.classList.add("is-broken");
    });

    frame.appendChild(image);

    body.appendChild(el("span", "mem-stack-tape"));
    body.appendChild(frame);
    card.appendChild(body);

    return card;

}

function buildStack(memory, slides) {

    const figure = el("figure", "mem-photo mem-photo-stack");
    const stage = el("div", "mem-stack-stage");

    stage.tabIndex = 0;
    stage.setAttribute("role", "group");
    stage.setAttribute(
        "aria-label",
        memory.title + " — ketuk atau geser untuk foto berikutnya"
    );

    slides.forEach((slide, i) => {
        stage.appendChild(
            buildStackCard(slide.src, memory.title + " " + (i + 1))
        );
    });

    const sparks = el("span", "mem-stack-sparks");
    sparks.setAttribute("aria-hidden", "true");

    for (let i = 0; i < 4; i++) {
        sparks.appendChild(document.createElement("span"));
    }

    stage.appendChild(sparks);
    figure.appendChild(stage);

       if (slides.length > 1) {

        const ui = el("div", "mem-stack-ui");

        ui.appendChild(
            el("p", "mem-stack-hint", "Tap the photo to see the next memory")
        );

        figure.appendChild(ui);

    }

    return figure;

}

function buildPhoto(memory, layout, slides) {

    if (layout === "stack") {
        return buildStack(memory, slides || getSlides(memory));
    }

    const figure = el("figure", "mem-photo");

    const frame = el("span", "mem-photo-frame");
    frame.appendChild(photo(memory.image, memory.title));
    figure.appendChild(frame);

    figure.appendChild(el("span", "mem-tape"));

    return figure;

}

/* Semua teks slide ditumpuk di satu sel grid -> tinggi = slide terpanjang,
   jadi layout tidak bergeser saat foto berganti. */

function buildTextSlides(memory, slides) {

    const wrap = el("div", "mem-text-slides");

    slides.forEach((slide) => {

        const block = el("div", "mem-text-slide");

        block.appendChild(el("p", "mem-date", slide.date || memory.date));
        block.appendChild(el("h3", "mem-title", slide.title || memory.title));
        block.appendChild(el("p", "mem-desc", slide.description || memory.description));

        const loc = slide.location || memory.location;

        if (loc) {
            block.appendChild(el("p", "mem-loc", "♡ " + loc));
        }

        wrap.appendChild(block);

    });

    return wrap;

}

/* Dipanggil sekali per item (tidak ada listener ganda). */

function setupStack(figure, textBlocks) {

    const stage = figure.querySelector(".mem-stack-stage");
    const cards = Array.from(stage.querySelectorAll(".mem-stack-card"));
    const total = cards.length;

    const sparks = stage.querySelector(".mem-stack-sparks");

    const reduce = window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let active = 0;
    let busy = false;

    function place() {

        cards.forEach((card, i) => {

            const rel = (i - active + total) % total;
            const pos = rel === 0 ? "front" : (rel === 1 ? "right" : "left");

            card.dataset.pos = pos;
            card.setAttribute("aria-hidden", pos === "front" ? "false" : "true");

        });


        if (textBlocks) {
            textBlocks.forEach((block, i) => {
                block.classList.toggle("is-active", i === active);
                block.setAttribute("aria-hidden", i === active ? "false" : "true");
            });
        }

    }

    function burst() {

        if (!sparks || reduce) {
            return;
        }

        sparks.classList.remove("is-burst");
        void sparks.offsetWidth;
        sparks.classList.add("is-burst");

    }

    /* dir: +1 = foto berikutnya, -1 = sebelumnya.
       Fase A (±230ms): foto depan bergeser sedikit ke samping.
       Fase B (±520ms): semua foto pindah posisi. Total ±750ms. */

    function go(dir) {

        if (busy || total < 2) {
            return;
        }

        busy = true;

        const leaving = cards[active];
        const landsLeft = dir > 0 && total > 2;
        const outClass = landsLeft ? "is-out-left" : "is-out-right";

        stage.style.setProperty("--mem-stack-dur", reduce ? "0.01s" : "0.22s");
        leaving.classList.add(outClass);

        setTimeout(() => {

            leaving.classList.remove(outClass);
            stage.style.setProperty("--mem-stack-dur", "0.52s");

            active = (active + dir + total) % total;

            place();
            burst();

            setTimeout(() => { busy = false; }, reduce ? 20 : 540);

        }, reduce ? 20 : 230);

    }

    /* tap / swipe pada foto */

    let startX = 0;
    let startY = 0;
    let tracking = false;

    stage.addEventListener("pointerdown", (event) => {

        if (event.pointerType === "mouse" && event.button !== 0) {
            return;
        }

        tracking = true;
        startX = event.clientX;
        startY = event.clientY;

    });

    stage.addEventListener("pointerup", (event) => {

        if (!tracking) {
            return;
        }

        tracking = false;

        const dx = event.clientX - startX;
        const dy = event.clientY - startY;

        if (Math.abs(dx) > 36 && Math.abs(dx) > Math.abs(dy)) {
            go(dx < 0 ? 1 : -1);
            return;
        }

        if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {

            const hit = event.target.closest(".mem-stack-card");

            go(hit && hit.dataset.pos === "left" ? -1 : 1);

        }

    });

    stage.addEventListener("pointercancel", () => { tracking = false; });

    stage.addEventListener("keydown", (event) => {

        if (event.key === "ArrowRight" || event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            go(1);
        } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            go(-1);
        }

    });

    place();

}


/* ---------- item timeline ---------- */

function buildItem(memory, index) {

    const layout = memory.layout || "left";

    const slides = layout === "stack" ? getSlides(memory) : [];
    const ownText = slides.some(hasOwnText);

    const item = el("article", "mem-item mem-layout-" + layout);

    item.style.setProperty("--rot", (index % 2 ? 2.2 : -2.2) + "deg");

    item.appendChild(el("span", "mem-node"));

    const figure = buildPhoto(memory, layout, slides);
    item.appendChild(figure);

    const text = el("div", "mem-text");

    let blocks = null;

    if (ownText) {

        const wrap = buildTextSlides(memory, slides);

        blocks = Array.from(wrap.children);
        text.appendChild(wrap);

    } else {

        text.appendChild(el("p", "mem-date", memory.date));
        text.appendChild(el("h3", "mem-title", memory.title));
        text.appendChild(el("p", "mem-desc", memory.description));

        if (memory.location) {
            text.appendChild(el("p", "mem-loc", "♡ " + memory.location));
        }

    }

    item.appendChild(text);

    const sprout = photo("/assets/images/botanical/leaves.webp", "");
    sprout.className = "mem-sprout";
    sprout.setAttribute("aria-hidden", "true");

    item.appendChild(sprout);
    item.appendChild(el("span", "mem-spark"));

    if (layout === "stack") {
        setupStack(figure, blocks);
    }

    return item;

}

    function renderTimeline() {

        const timeline = document.getElementById("memTimeline");

        if (!timeline) {
            return;
        }

        memories.forEach((memory, index) => {
            timeline.appendChild(buildItem(memory, index));
        });

    }


    /* ---------- reveal sekali saat masuk viewport ---------- */

    function setupReveal() {

        const targets = page.querySelectorAll(".mem-item, .mem-reveal");

        if (!("IntersectionObserver" in window)) {
            targets.forEach((node) => node.classList.add("is-visible"));
            page.classList.add("mem-ready");
            return;
        }

        const observer = new IntersectionObserver((entries) => {

            entries.forEach((entry) => {

                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("is-visible");

                observer.unobserve(entry.target);   /* hanya sekali */

            });

        }, { threshold: 0.18, rootMargin: "0px 0px -6% 0px" });

        targets.forEach((node) => observer.observe(node));

        page.classList.add("mem-ready");

    }


    /* ---------- video ---------- */

    let video = null;

    function setupVideo() {

        const frame = document.getElementById("memVideoFrame");

        if (!frame) {
            return;
        }

        video = document.createElement("video");

        video.className = "mem-video-el";
        video.controls = true;                    /* play/pause + fullscreen */
        video.playsInline = true;
        video.preload = "metadata";
        video.autoplay = false;
        video.setAttribute("controlslist", "nodownload");

        if (storyVideo.poster) {
            video.poster = storyVideo.poster;
        }

        video.addEventListener("error", () => {
            frame.classList.add("is-error");
            video.controls = false;
        });

        video.src = storyVideo.src;

        frame.insertBefore(video, frame.firstChild);

        const caption = document.getElementById("memVideoCaption");
        const signature = document.getElementById("memVideoSignature");

        if (caption) { caption.textContent = storyVideo.caption; }
        if (signature) { signature.textContent = storyVideo.signature; }

        /* Hanya video ini yang dijeda; audio global (music.js) tidak disentuh. */

    }


    /* ---------- navigasi ---------- */

    function swap(from, to, delay) {

        from.classList.add("section-exit");

        setTimeout(() => {

            from.classList.remove("active-section", "section-exit");
            from.classList.add("hidden-section");

            to.classList.remove("hidden-section");
            to.classList.add("active-section");

            window.scrollTo({ top: 0, behavior: "instant" });

            busy = false;

        }, delay);

    }

    /* Dipanggil tombol "Let's remember our story" milik Memory Quiz */

    window.enterMemoriesTimeline = function () {

        if (busy || !quizPage) {
            return;
        }

        busy = true;

        swap(quizPage, page, 900);

    };

    function leaveToHub() {

        if (busy || !hub) {
            return;
        }

        busy = true;

        if (video) {
            video.pause();
        }

        swap(page, hub, 900);

    }

    page.querySelectorAll("[data-mem-back]").forEach((button) => {
        button.addEventListener("click", leaveToHub);
    });


    /* ---------- start ---------- */

    renderOpening();
    renderTimeline();
    setupVideo();
    setupReveal();

});