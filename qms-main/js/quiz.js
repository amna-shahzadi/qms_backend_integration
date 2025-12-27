document.addEventListener('DOMContentLoaded', () => {

    // ===============================
    // DOM Elements
    // ===============================
    const quizTitleDisplay = document.getElementById('quiz-title-display');
    const questionsContainer = document.getElementById('questions-container');
    const quizArea = document.getElementById('quiz-area');
    const resultArea = document.getElementById('result-area');
    const scoreDisplay = document.getElementById('score-display');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-quiz-btn');
    const backToHomeBtn = document.getElementById('back-to-home-btn');

    // ===============================
    // State
    // ===============================
    let currentQuestionIndex = 0;
    let userAnswers = {};
    let quizQuestions = [];
    let quizId = null;

    // ===============================
    // Timer
    // ===============================
    let timeLeft = 600;
    let timerInterval;

    function formatTime(seconds) {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }

    function startTimer() {
        const timeLeftDisplay = document.getElementById('time-left');
        timeLeftDisplay.textContent = formatTime(timeLeft);

        timerInterval = setInterval(() => {
            timeLeft--;
            timeLeftDisplay.textContent = formatTime(timeLeft);

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                alert("Time is up! Quiz auto-submitted.");
                submitQuiz(true);
            }
        }, 1000);
    }

    function stopTimer() {
        if (timerInterval) clearInterval(timerInterval);
    }

    // ===============================
    // BACKEND: Load Quiz
    // ===============================
    async function loadQuiz() {
        try {
            const res = await fetch("../backend/get_quiz.php");
            const quiz = await res.json();

            quizId = quiz.id;
            quizTitleDisplay.textContent = quiz.title;

            quizQuestions = quiz.questions.map(q => ({
                id: q.id,
                text: q.question_text,
                options: {
                    a: q.option_a,
                    b: q.option_b,
                    c: q.option_c,
                    d: q.option_d
                }
            }));

            quizQuestions.forEach(q => {
                questionsContainer.appendChild(createQuestionCard(q));
            });

            showQuestion(0);
            attachOptionListeners();
            startTimer();

        } catch (error) {
            console.error("Quiz loading failed:", error);
            alert("Unable to load quiz");
        }
    }

    // ===============================
    // Create Question Card
    // ===============================
    function createQuestionCard(question) {
        const card = document.createElement('div');
        card.classList.add('quiz-question-card');
        card.dataset.id = question.id;

        let optionsHTML = '';
        for (const [key, text] of Object.entries(question.options)) {
            optionsHTML += `
                <label class="option-label" data-q-id="${question.id}">
                    <input type="radio" name="q${question.id}" value="${key}">
                    <span>${text}</span>
                </label>
            `;
        }

        card.innerHTML = `
            <p class="question-number">
                Question ${quizQuestions.indexOf(question) + 1} of ${quizQuestions.length}
            </p>
            <h3>${question.text}</h3>
            <div class="options-container">${optionsHTML}</div>
        `;
        return card;
    }

    // ===============================
    // Navigation
    // ===============================
    function showQuestion(index) {
        const cards = document.querySelectorAll('.quiz-question-card');
        if (index < 0 || index >= cards.length) return;

        cards.forEach(c => c.classList.remove('active-question'));
        cards[index].classList.add('active-question');
        currentQuestionIndex = index;
        updateNavigationButtons();

        const qId = quizQuestions[index].id;
        if (userAnswers[qId]) {
            const input = document.querySelector(
                `input[name="q${qId}"][value="${userAnswers[qId]}"]`
            );
            if (input) input.checked = true;
        }
    }

    function updateNavigationButtons() {
        prevBtn.disabled = currentQuestionIndex === 0;

        if (currentQuestionIndex === quizQuestions.length - 1) {
            nextBtn.classList.add('hidden');
            submitBtn.classList.remove('hidden');
        } else {
            nextBtn.classList.remove('hidden');
            submitBtn.classList.add('hidden');
        }
    }

    function attachOptionListeners() {
        questionsContainer.querySelectorAll('input[type="radio"]').forEach(input => {
            input.addEventListener('change', e => {
                const qId = parseInt(e.target.name.substring(1));
                userAnswers[qId] = e.target.value;
            });
        });
    }

    // ===============================
    // BACKEND: Submit Quiz
    // ===============================
    async function submitQuiz(auto = false) {
        stopTimer();

        if (!auto && !confirm("Submit quiz?")) {
            startTimer();
            return;
        }

        try {
            const res = await fetch("../backend/submit_quiz.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    quizId,
                    answers: userAnswers
                })
            });

            const result = await res.json();

            // Display score
            scoreDisplay.innerHTML = `Your Score: ${result.score} / ${result.total}`;
            quizArea.classList.add('hidden');
            resultArea.classList.remove('hidden');

            // ===============================
            // Highlight correct & wrong answers
            // ===============================
            for (const qId in result.correctAnswers) {
                const correct = result.correctAnswers[qId];

                document.querySelectorAll(`.option-label[data-q-id="${qId}"]`).forEach(label => {
                    const input = label.querySelector("input");
                    label.style.pointerEvents = "none"; // disable further selection

                    if (input.value === correct) {
                        label.classList.add("correct");
                    } else if (input.checked) {
                        label.classList.add("incorrect");
                    }
                });
            }

        } catch (error) {
            console.error("Submit failed:", error);
            alert("Error submitting quiz");
        }
    }

    // ===============================
    // Events
    // ===============================
    prevBtn.addEventListener('click', () => showQuestion(currentQuestionIndex - 1));
    nextBtn.addEventListener('click', () => showQuestion(currentQuestionIndex + 1));
    submitBtn.addEventListener('click', () => submitQuiz(false));

    backToHomeBtn.addEventListener('click', () => {
        stopTimer();
        window.location.href = "guest.html";
    });

    // ===============================
    // Init
    // ===============================
    loadQuiz();
});

