// Array of Quiz questions
const questions = [
    {
        question: "What is the full form of HTML?",
        answers: [
            { text: "Hyper Text Markup Language", correct: true },
            { text: "High Tech Modern Language", correct: false },
            { text: "Home Tool Markup Language", correct: false },
            { text: "Hyperlink and Text Markup", correct: false }
        ]
    },
    {
        question: "What is CSS used for?",
        answers: [
            { text: "To give interactivity to the website", correct: false },
            { text: "To Style the website (make it look good)", correct: true },
            { text: "For server-side logic", correct: false },
            { text: "For Database Query", correct: false }
        ]
    },
    {
        question: "What type of language is JavaScript?",
        answers: [
            { text: "Programming Language", correct: true },
            { text: "Styling Language", correct: false },
            { text: "Markup Language", correct: false },
            { text: "Query Language", correct: false }
        ]
    },
    // Add more questions here for at least 5 questions
    {
        question: "What does Responsive Web Design mean?",
        answers: [
            { text: "The website only works on a desktop", correct: false },
            { text: "The website loads quickly from the server", correct: false },
            { text: "The website looks good on every device (mobile, tablet)", correct: true },
            { text: "The website has a lot of images", correct: false }
        ]
    },
    {
        question: "What is the largest heading tag in HTML?",
        answers: [
            { text: "<h6>", correct: false },
            { text: "<h2>", correct: false },
            { text: "<h1>", correct: true },
            { text: "<head>", correct: false }
        ]
    }
];

// Get DOM elements
const questionElement = document.getElementById('question-text');
const answerButtonsElement = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-btn');
const timeLeftElement = document.getElementById('time-left');
const scoreDisplay = document.getElementById('score-display');
const finalScoreElement = document.getElementById('final-score');
const restartButton = document.getElementById('restart-btn');

let currentQuestionIndex = 0;
let score = 0;
let timer;
const TIME_LIMIT = 60; // 60 seconds for each question
let timeRemaining = TIME_LIMIT;
// --- TIMER FUNCTION ---
function startTimer() {
    timeRemaining = TIME_LIMIT;
    timeLeftElement.innerText = `${timeRemaining}s`;

    clearInterval(timer); // Clear the previous timer
    timer = setInterval(() => {
        timeRemaining--;
        timeLeftElement.innerText = `${timeRemaining}s`;

        if (timeRemaining <= 0) {
            clearInterval(timer);
            // Automatically go to the next question when time is out
            handleNextButton();
        }
    }, 1000); // Update every 1 second
}


// --- MAIN QUIZ LOGIC ---

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    nextButton.classList.remove('hidden');
    scoreDisplay.classList.add('hidden');
    restartButton.classList.add('hidden');
    showQuestion();
}

function showQuestion() {
    // Empty the buttons
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }

    // Start the Timer
    startTimer();

    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerText = `${questionNo}. ${currentQuestion.question}`;

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        if (answer.correct) {
            button.dataset.correct = answer.correct; // Mark the correct answer
        }
        button.addEventListener('click', selectAnswer);
        answerButtonsElement.appendChild(button);
    });
}

function selectAnswer(e) {
    // Stop the Timer
    clearInterval(timer);

    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";

    // Disable all buttons so the user cannot select again
    Array.from(answerButtonsElement.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.classList.add('correct'); // Show the Correct answer in green
        }
        button.disabled = true;
    });

    if (isCorrect) {
        selectedBtn.classList.add('correct');
        score++; // Increase the score
    } else {
        selectedBtn.classList.add('wrong'); // Show the Wrong answer in red
    }

    // Show the Next button
    nextButton.classList.remove('hidden');
}


function showScore() {
    clearInterval(timer); // Stop the Timer
    questionElement.innerText = 'Quiz Finished!';
    answerButtonsElement.innerHTML = ''; // Remove buttons
    nextButton.classList.add('hidden'); // Hide Next button

    finalScoreElement.innerText = `${score} out of ${questions.length}`;
    scoreDisplay.classList.remove('hidden');
    restartButton.classList.remove('hidden');
}

function handleNextButton() {
    currentQuestionIndex++;
    nextButton.classList.add('hidden'); // Hide Next button

    if (currentQuestionIndex < questions.length) {
        showQuestion(); // Show the next question
    } else {
        showScore(); // Show the score
    }
}


// --- EVENT LISTENERS ---
nextButton.addEventListener('click', () => {
    if (currentQuestionIndex < questions.length) {
        handleNextButton();
    } else {
        startQuiz(); // This case is typically not needed if nextButton is hidden
    }
});

restartButton.addEventListener('click', startQuiz);

// --- START THE QUIZ ---
startQuiz();
// Get DOM elements
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const showSignupLink = document.getElementById('show-signup');
const showLoginLink = document.getElementById('show-login');
const authHeading = document.getElementById('auth-heading');
const pageTitle = document.getElementById('page-title');

// 1. URL से Role प्राप्त करें और Heading सेट करें
function setAuthPageDetails() {
    // URL से query parameters को प्राप्त करें
    const urlParams = new URLSearchParams(window.location.search);
    const role = urlParams.get('role'); // e.g., 'admin', 'teacher', 'student'

    // Role को capitalize करें (e.g., 'admin' -> 'Admin')
    const capitalizedRole = role.charAt(0).toUpperCase() + role.slice(1);

    // Heading और Title अपडेट करें
    authHeading.innerText = `${capitalizedRole} Account Access`;
    pageTitle.innerText = `${capitalizedRole} Login/Signup`;

    // Demo: Login/Signup पर सबमिट करने पर क्या होगा (Backend नहीं है)
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert(`Login successful as ${capitalizedRole}. Redirecting to ${role} dashboard... (This requires a backend)`);

        // **Frontend Redirection Logic (Temporary):**
        // Since we don't have a backend, we can simulate redirection:
        if (role === 'admin') window.location.href = 'admin.html';
        else if (role === 'teacher') window.location.href = 'teacher.html';
        else if (role === 'student') window.location.href = 'student.html';
    });

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert(`Signup successful for ${capitalizedRole}. Please log in now. (This requires a backend)`);

        // Show the login form after successful signup
        showForm('login');
    });
}

// 2. Form Switching Logic
function showForm(formType) {
    if (formType === 'login') {
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
    } else {
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
    }
}

// Event Listeners for switching
showSignupLink.addEventListener('click', () => showForm('signup'));
showLoginLink.addEventListener('click', () => showForm('login'));

// Initialize the page
setAuthPageDetails();