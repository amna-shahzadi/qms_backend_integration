document.addEventListener('DOMContentLoaded', () => {

    // ===============================
    // DOM Elements
    // ===============================
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const contentSections = document.querySelectorAll('.dashboard-card');
    const userTableBody = document.getElementById('user-table-body');
    const statsGrid = document.querySelector('.stats-grid');
    const activityLog = document.getElementById('recent-activity-log');
    const logoutLink = document.getElementById('logout-link');

    // ===============================
    // Backend-based Admin Stats (Temporary Mixed Mode)
    // ===============================
    // NOTE: Abhi stats static hain — later DB se load karwa sakte hain
    const adminStats = {
        totalUsers: 0,
        totalQuizzes: 0,
        activeTeachers: 0,
        totalSubmissions: 0
    };
row.innerHTML = `
    <td data-label="ID">${user.id}</td>
    <td data-label="Name">${user.name}</td>
    <td data-label="Email">${user.email}</td>
    <td data-label="Role">${user.role}</td>
    <td data-label="Created At">${user.created_at}</td>
    <td data-label="Actions">
        <button class="btn-edit">Edit</button>
        <button class="btn-delete">Delete</button>
    </td>
`;

    // ===============================
    // INITIAL LOAD
    // ===============================
    initDashboard();

    // ===============================
    // Core Functions
    // ===============================

    function initDashboard() {
        renderStatsGrid();
        loadUsersFromBackend();
        loadRecentActivity();
    }

    // ===============================
    // Render Stats Grid
    // ===============================
    function renderStatsGrid() {
        statsGrid.innerHTML = `
            <div class="stat-card stat-total-users">
                <h4>Total Users</h4>
                <div class="stat-value">${adminStats.totalUsers}</div>
            </div>
            <div class="stat-card stat-total-quizzes">
                <h4>Total Quizzes</h4>
                <div class="stat-value">${adminStats.totalQuizzes}</div>
            </div>
            <div class="stat-card stat-active-teachers">
                <h4>Active Teachers</h4>
                <div class="stat-value">${adminStats.activeTeachers}</div>
            </div>
            <div class="stat-card stat-submissions">
                <h4>Total Submissions</h4>
                <div class="stat-value">${adminStats.totalSubmissions}</div>
            </div>
        `;
    }

    // ===============================
    // Load Users from Backend
    // ===============================
    async function loadUsersFromBackend() {
        try {
            const res = await fetch("../backend/get_users.php");
            const users = await res.json();
           loadUsers();
            adminStats.totalUsers = users.length;
            renderStatsGrid();
        } catch (err) {
            console.error("Failed to load users", err);
        }
    }

    // ===============================
    // Render User Table
    // ===============================
    function renderUserTable(users) {
        userTableBody.innerHTML = '';

        users.forEach(user => {
            const row = userTableBody.insertRow();
            const statusClass = user.status === 'Active' ? 'status-active' : 'status-inactive';

            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.role}</td>
                <td><span class="${statusClass}">${user.status}</span></td>
                <td>
                    <button class="delete-user-btn" data-id="${user.id}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            `;
        });
    }

    // ===============================
    // Load Recent Activity (Temporary)
    // ===============================
    function loadRecentActivity() {
        activityLog.innerHTML = `
            <div class="activity-item">
                <span class="activity-timestamp">${new Date().toLocaleTimeString()}</span>
                <span class="activity-action">Admin logged in</span>
            </div>
        `;
    }

    // ===============================
    // BACKEND: Create Quiz
    // ===============================
    window.createQuiz = async function () {
        const title = document.getElementById("quizTitle").value;

        if (!title) {
            alert("Please enter quiz title");
            return;
        }

        try {
            const res = await fetch("../backend/create_quiz.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title })
            });

            const result = await res.json();

            if (result.status === "success") {
                alert("Quiz Created Successfully");
                document.getElementById("quizTitle").value = "";
            } else {
                alert("Quiz creation failed");
            }

        } catch (error) {
            console.error("Quiz creation error:", error);
            alert("Server error while creating quiz");
        }
    };

    // ===============================
    // Sidebar Navigation
    // ===============================
    function handleSidebarNavigation(event) {
        event.preventDefault();
        const targetId = event.currentTarget.dataset.content;

        sidebarLinks.forEach(link => link.classList.remove('active'));
        event.currentTarget.classList.add('active');

        contentSections.forEach(section => {
            if (section.id === targetId) {
                section.classList.remove('hidden-content');
                section.classList.add('active-content');
            } else {
                section.classList.add('hidden-content');
                section.classList.remove('active-content');
            }
        });
    }

    sidebarLinks.forEach(link => {
        link.addEventListener('click', handleSidebarNavigation);
    });

    // ===============================
    // Logout
    // ===============================
    logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm("Are you sure you want to log out?")) {
            window.location.href = 'index.html';
        }
    });

});

