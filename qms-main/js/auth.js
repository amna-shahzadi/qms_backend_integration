// ===============================
// Get DOM elements
// ===============================
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const showSignupLink = document.getElementById('show-signup');
const showLoginLink = document.getElementById('show-login');
const authHeading = document.getElementById('auth-heading');
const pageTitle = document.getElementById('page-title');

// ===============================
// Backend Login Function
// ===============================
async function loginUser(expectedRole) {
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();

    if (!email || !password) {
        alert("Please fill all login fields");
        return;
    }

    try {
        const response = await fetch("../backend/login.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        /*
            Expected backend response:
            {
              status: "success",
              role: "admin" | "teacher" | "student"
            }
        */

        if (result.status === "success") {

            if (result.role !== expectedRole) {
                alert(`Access denied. You are registered as ${result.role}`);
                return;
            }

            // ✅ Correct role dashboard
            window.location.href = `${result.role}.html`;

        } else {
            alert(result.message || "Invalid email or password");
        }

    } catch (error) {
        console.error("Login Error:", error);
        alert("Server error. Please try again later.");
    }
}

// ===============================
// Backend Signup Function
// ===============================
async function signupUser(role) {
    const name = document.getElementById("signup-name").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value.trim();

    if (!name || !email || !password) {
        alert("Please fill all signup fields");
        return;
    }

    try {
        const response = await fetch("../backend/signup.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password, role })
        });

        const result = await response.json();

        if (result.status === "success") {
            alert("Signup successful. Please login now.");
            showForm("login");
        } else {
            alert(result.message || "Signup failed. Email may already exist.");
        }

    } catch (error) {
        console.error("Signup Error:", error);
        alert("Server error. Please try again later.");
    }
}

// ===============================
// Get Role from URL & Set Page
// ===============================
function setAuthPageDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const role = urlParams.get('role');

    if (!role) {
        authHeading.innerText = "Error: Role Not Specified";
        return;
    }

    const capitalizedRole = role.charAt(0).toUpperCase() + role.slice(1);
    authHeading.innerText = `${capitalizedRole} Account Access`;
    pageTitle.innerText = `${capitalizedRole} Login / Signup`;

    // Login submit
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        loginUser(role);
    });

    // Signup submit
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        signupUser(role);
    });
}

// ===============================
// Form Switch Logic
// ===============================
function showForm(formType) {
    if (formType === 'login') {
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
    } else {
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
    }
}

// ===============================
// Switch Links
// ===============================
showSignupLink.addEventListener('click', () => showForm('signup'));
showLoginLink.addEventListener('click', () => showForm('login'));

// ===============================
// Initialize Page
// ===============================
setAuthPageDetails();

