document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const studentNameDisplay = document.getElementById('student-name-display');
    const studentIdDisplay = document.getElementById('student-id-display');
    const quizListContainer = document.getElementById('quiz-list-container');
    const resultsTableBody = document.getElementById('results-table-body');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const contentSections = document.querySelectorAll('.dashboard-card');
    const logoutLink = document.getElementById('logout-link');

    // --- Simulated Student Data (Replace with actual backend data) ---

    // 1. Profile Data
    const studentData = {
        name: "Ali Ahmed Khan",
        id: 1001,
        grade: "A+",
        batch: "Spring 2024"
    };

    // 2. Available Quizzes (Quizzes not yet attempted or available)
    const availableQuizzes = [
        { id: 'q1', title: 'HTML & CSS Basics', subject: 'Web Dev', questions: 10, duration: '15 min', teacher: 'Mr. Zafar' },
        { id: 'q2', title: 'Python Loops', subject: 'Programming', questions: 15, duration: '20 min', teacher: 'Ms. Hira' },
        { id: 'q3', title: 'Calculus I', subject: 'Math', questions: 20, duration: '30 min', teacher: 'Dr. Saleem' }
    ];

    // 3. Past Results (Quizzes already attempted)
    const pastResults = [
        { id: 'r1', title: 'Introduction to JavaScript', subject: 'Web Dev', score: '8/10', percentage: '80%', status: 'Completed' },
        { id: 'r2', title: 'Data Structures Fundamentals', subject: 'Programming', score: 'Pending', percentage: 'N/A', status: 'Pending' }
    ];

    // --- Core Functions ---

    /** Initializes the Dashboard data */
    function initDashboard() {
        // Display Profile Data
        studentNameDisplay.textContent = `Hi, ${studentData.name}`;
        studentIdDisplay.textContent = `ID: ${studentData.id}`;

        // Load Quiz Lists
        renderAvailableQuizzes();
        renderPastResults();
    }

    /** Renders cards for all available quizzes */
    function renderAvailableQuizzes() {
        quizListContainer.innerHTML = '';
        availableQuizzes.forEach(quiz => {
            const card = document.createElement('div');
            card.classList.add('quiz-info-card');
            card.innerHTML = `
                <h3>${quiz.title}</h3>
                <div class="quiz-details">
                    <p><strong>Subject:</strong> ${quiz.subject}</p>
                    <p><strong>Questions:</strong> ${quiz.questions}</p>
                    <p><strong>Time:</strong> ${quiz.duration}</p>
                    <p><strong>Teacher:</strong> ${quiz.teacher}</p>
                </div>
                <button class="quiz-start-btn" data-quiz-id="${quiz.id}">Start Quiz</button>
            `;
            quizListContainer.appendChild(card);
        });

        // Attach event listeners to all new Start buttons
        quizListContainer.querySelectorAll('.quiz-start-btn').forEach(button => {
            button.addEventListener('click', handleQuizStart);
        });
    }

    /** Renders the table for past results */
    function renderPastResults() {
        resultsTableBody.innerHTML = '';
        pastResults.forEach(result => {
            const row = resultsTableBody.insertRow();
            row.innerHTML = `
                <td>${result.title}</td>
                <td>${result.subject}</td>
                <td><span class="${result.status === 'Completed' ? 'status-completed' : 'status-pending'}">${result.score}</span></td>
                <td>${result.status}</td>
                <td>
                    ${result.status === 'Completed' ?
                    `<button class="review-btn" data-result-id="${result.id}">Review</button>` :
                    `N/A`
                }
                </td>
            `;
        });
    }

    /** Handles starting a quiz (redirects to quiz.html) */
    function handleQuizStart(event) {
        const quizId = event.target.dataset.quizId;
        // In a real application, you would pass the quizId to the quiz page
        alert(`Starting Quiz ID: ${quizId}. Redirecting to quiz.html...`);

        // For demonstration, we link back to the quiz page
        window.location.href = 'quiz.html';
    }

    /** Handles sidebar navigation to switch content views */
    // student.js file mein handleSidebarNavigation function ko dhundhein aur replace karein:

    /** Handles sidebar navigation to switch content views */
    function handleSidebarNavigation(event) {
        event.preventDefault();
        // 🟢 FIX: Target section ki ID nikalne ke liye href attribute use karen.
        // Kyunki aapne HTML mein href="#available-quizzes" aur href="#my-results" use kiya hai.
        const targetSection = document.querySelector(event.currentTarget.getAttribute('href'));

        // 1. Update Sidebar Active Link
        sidebarLinks.forEach(link => link.classList.remove('active'));
        event.currentTarget.classList.add('active');

        // 2. Switch Content Section Visibility
        contentSections.forEach(section => {
            section.classList.remove('active-content');
            section.classList.add('hidden-content');
        });

        // 3. Target section ko dikhao
        if (targetSection) {
            targetSection.classList.add('active-content');
            targetSection.classList.remove('hidden-content');
        }
    }
    // --- Event Listeners ---

    // Sidebar Links
    sidebarLinks.forEach(link => {
        link.addEventListener('click', handleSidebarNavigation);
    });

    // Logout Link
    logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm("Are you sure you want to log out?")) {
            // Redirect to the main index page (role selection)
            window.location.href = 'index.html';
        }
    });

    // Start initialization
    initDashboard();
});