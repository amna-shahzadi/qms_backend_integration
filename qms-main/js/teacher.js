const questionsContainer = document.getElementById('questions-container');
const addQuestionBtn = document.getElementById('add-question-btn');
const questionCountDisplay = document.getElementById('question-count-display');
let questionCount = 0;

// Function to simulate fetching and displaying teacher data
function updateTeacherProfile() {
    // NOTE: In a real application, this data would be dynamically fetched after login.
    const teacherName = "Ali Raza"; // Simulated Teacher Name
    const teacherSubject = "Web Development"; // Simulated Registered Subject (Must match the auto-assigned subject in HTML)

    // Update Profile in Sidebar
    const nameDisplay = document.getElementById('teacher-name-display');
    const profileSubjectDisplay = document.getElementById('profile-subject-display');
    if (nameDisplay) nameDisplay.innerText = teacherName;
    if (profileSubjectDisplay) profileSubjectDisplay.innerText = teacherSubject;

    // Update Subject Info Card on Dashboard
    const dashboardSubjectDisplay = document.getElementById('teacher-subject-display');
    if (dashboardSubjectDisplay) dashboardSubjectDisplay.innerText = teacherSubject;

    // Update Auto-Assigned Subject in Creation Form
    const formSubjectDisplay = document.getElementById('quiz-subject-display-form');
    if (formSubjectDisplay) formSubjectDisplay.innerText = teacherSubject;

    // Update Hidden input value for form submission
    const hiddenSubjectInput = document.getElementById('quiz-subject');
    if (hiddenSubjectInput) hiddenSubjectInput.value = teacherSubject.toLowerCase().replace(' ', '-'); // e.g., 'web-development'
}


// Function to toggle the accordion panel
function toggleQuestion(event) {
    const header = event.currentTarget;
    const card = header.closest('.question-card');

    // Close other open cards (Compactness maintained)
    document.querySelectorAll('.question-card.open').forEach(openCard => {
        if (openCard !== card) {
            openCard.classList.remove('open');
            openCard.querySelector('.question-header').classList.remove('active');
            openCard.querySelector('.question-content').style.display = 'none';
        }
    });

    // Toggle the clicked card
    card.classList.toggle('open');
    header.classList.toggle('active');
    const content = card.querySelector('.question-content');
    if (card.classList.contains('open')) {
        content.style.display = 'block';
    } else {
        content.style.display = 'none';
    }
}

// Function to add a new question block to the form
function addQuestion(focusOnNew = true) {
    questionCount++;
    const questionId = `question-${questionCount}`;

    const questionCard = document.createElement('div');
    questionCard.classList.add('question-card');

    // Open the new question card by default
    if (focusOnNew) {
        questionCard.classList.add('open');
    }

    questionCard.innerHTML = `
        <div class="question-header ${focusOnNew ? 'active' : ''}" data-target="${questionId}">
            <span class="header-title">Question #${questionCount}: (Click to Edit)</span>
            <span class="toggle-icon">></span>
        </div>

        <div class="question-content" style="display: ${focusOnNew ? 'block' : 'none'};">
            <div class="form-group">
                <label for="${questionId}-text">Question Text</label>
                <textarea id="${questionId}-text" rows="2" required placeholder="Type your question here"></textarea>
            </div>

            <div class="form-group">
                <label>Answer Options (Select the correct one below):</label>
                
                <div class="option-input">
                    <input type="text" id="${questionId}-option1" required placeholder="Option 1">
                    <label><input type="radio" name="${questionId}-correct" value="1" required> Correct</label>
                </div>
                
                <div class="option-input">
                    <input type="text" id="${questionId}-option2" required placeholder="Option 2">
                    <label><input type="radio" name="${questionId}-correct" value="2"> Correct</label>
                </div>

                <div class="option-input">
                    <input type="text" id="${questionId}-option3" required placeholder="Option 3">
                    <label><input type="radio" name="${questionId}-correct" value="3"> Correct</label>
                </div>
                
                <div class="option-input">
                    <input type="text" id="${questionId}-option4" required placeholder="Option 4">
                    <label><input type="radio" name="${questionId}-correct" value="4"> Correct</label>
                </div>
            </div>

            <button type="button" class="remove-question-btn" data-id="${questionId}">
                Remove Question
            </button>
        </div>
    `;

    questionsContainer.appendChild(questionCard);

    // Bind listeners for the new elements
    const header = questionCard.querySelector('.question-header');
    header.addEventListener('click', toggleQuestion);

    const removeButton = questionCard.querySelector('.remove-question-btn');
    removeButton.addEventListener('click', removeQuestion);

    // Update the question counter display
    updateQuestionNumbers();
}

// Function to handle removing a question
function removeQuestion(event) {
    const button = event.target.closest('.remove-question-btn');
    if (button) {
        const questionCard = button.closest('.question-card');
        if (questionCard) {
            questionCard.remove();
            // Re-label the remaining questions
            updateQuestionNumbers();
        }
    }
}

// Function to update the numbering of questions and the display count
function updateQuestionNumbers() {
    const remainingQuestions = questionsContainer.querySelectorAll('.question-card');
    questionCount = 0; // Reset counter
    remainingQuestions.forEach((card, index) => {
        questionCount = index + 1;
        const headerTitle = card.querySelector('.header-title');
        if (headerTitle) {
            headerTitle.innerText = `Question #${questionCount}: (Click to Edit)`;
        }
    });
    questionCountDisplay.innerText = questionCount;
    if (questionCount === 0) {
        // If all questions are removed, add a fresh one
        addQuestion();
    }
}

// Initial setup
document.addEventListener('DOMContentLoaded', () => {
    // Load and display teacher profile data
    updateTeacherProfile();

    // Check if container is empty before adding first question
    if (questionsContainer.children.length === 0) {
        addQuestion();
    }

    // Bind the "Add Question" button
    addQuestionBtn.addEventListener('click', () => addQuestion(true));

    // Handle form submission (Frontend Demo)
    const quizForm = document.getElementById('quiz-creation-form');
    quizForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = document.getElementById('quiz-title').value;
        if (questionCount > 0) {
            alert(`Simulated: Quiz '${title}' created successfully with ${questionCount} questions! (Requires Backend to save)`);
        } else {
            alert('Error: Please add at least one question before saving the quiz.');
            return;
        }

        quizForm.reset();
        questionsContainer.innerHTML = ''; // Clear questions
        questionCount = 0;
        addQuestion(); // Add a fresh first question
    });

    // Fix for Sidebar Links (Logout included)
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');

            // Only prevent default for internal links (starting with '#')
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault(); // Prevent default link action (stops page jump)

                // Remove active class from all links
                document.querySelectorAll('.sidebar-link').forEach(nav => nav.classList.remove('active'));
                // Add active class to the clicked link
                this.classList.add('active');

                // Hide all content sections
                document.querySelectorAll('.content-section').forEach(section => section.classList.add('hidden'));

                // Show the target content section
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.classList.remove('hidden');
                }
            } else {
                // For 'index.html' (Logout), let the default action proceed (page redirect)
            }
        });
    });
});