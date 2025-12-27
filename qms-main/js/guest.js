document.addEventListener('DOMContentLoaded', () => {
    const subjectForm = document.getElementById('guest-subject-form');
    const quizListContainer = document.getElementById('quiz-list-container');
    const quizListHeading = document.getElementById('quiz-list-heading');
    const guestQuizzesList = document.getElementById('guest-quizzes-list');
    const loginLink = document.getElementById('show-login');

    // Simulate Quiz Data based on subject
    const quizData = {
        'web-dev': [
            { title: 'HTML Fundamentals', qs: 25, duration: 30 },
            { title: 'CSS Selectors', qs: 15, duration: 20 }
        ],
        'math': [
            { title: 'Algebra Foundations', qs: 30, duration: 45 },
            { title: 'Trigonometry Basics', qs: 10, duration: 15 }
        ],
        'history': [
            { title: 'History of Pakistan', qs: 20, duration: 30 }
        ],
        'science': [
            { title: 'Cell Structure', qs: 18, duration: 25 },
            { title: 'Physics Laws', qs: 12, duration: 20 }
        ]
    };

    // --- Event Listeners ---

    // 1. Handle Subject Form Submission
    subjectForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const subjectSelect = document.getElementById('guest-subject');
        const selectedValue = subjectSelect.value;
        const selectedText = subjectSelect.options[subjectSelect.selectedIndex].text;

        // Display the quizzes for the selected subject
        displayQuizzes(selectedValue, selectedText);

        // Hide the subject selection form
        subjectForm.classList.add('hidden');
        quizListContainer.classList.remove('hidden');
    });

    // 2. Handle Login Link Click
    loginLink.addEventListener('click', () => {
        window.location.href = 'auth.html'; // Changed to auth.html as per new flow
    });

    // --- Core Function ---

    function displayQuizzes(subjectKey, subjectName) {
        // Clear previous quizzes
        guestQuizzesList.innerHTML = '';
        quizListHeading.innerText = `Quizzes for ${subjectName}`;

        const quizzes = quizData[subjectKey] || [];

        if (quizzes.length === 0) {
            guestQuizzesList.innerHTML = '<p class="greeting-message">No quizzes found for this subject yet.</p>';
            return;
        }

        quizzes.forEach(quiz => {
            const quizItem = document.createElement('div');
            quizItem.classList.add('quiz-item');

            quizItem.innerHTML = `
                <span class="quiz-title">${quiz.title}</span>
                <span class="quiz-meta">${quiz.qs} Qs | ${quiz.duration} Mins</span>
                <button class="action-btn attempt-btn" data-quiz-title="${quiz.title}" data-subject="${subjectName}">Attempt</button>
            `;

            guestQuizzesList.appendChild(quizItem);
        });

        // ADD NEW LOGIC: Attach listener for Attempt buttons
        guestQuizzesList.querySelectorAll('.attempt-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const quizTitle = e.target.getAttribute('data-quiz-title');
                const subject = e.target.getAttribute('data-subject');

                alert(`Redirecting to Quiz: ${quizTitle} (${subject})`);

                // Redirect to the general quiz attempt page
                window.location.href = 'quiz.html';
            });
        });

        // Add a "Go Back" button
        const backButton = document.createElement('button');
        backButton.classList.add('add-btn');
        backButton.style.marginTop = '20px';
        backButton.innerText = '← Change Subject';
        backButton.addEventListener('click', () => {
            quizListContainer.classList.add('hidden');
            subjectForm.classList.remove('hidden');
        });
        guestQuizzesList.appendChild(backButton);
    }
});