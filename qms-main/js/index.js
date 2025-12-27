// Modal Functionality
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const closeLoginModal = document.getElementById('closeLoginModal');
const closeSignupModal = document.getElementById('closeSignupModal');
const switchToSignup = document.getElementById('switchToSignup');
const switchToLogin = document.getElementById('switchToLogin');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

// Open login modal
loginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.style.display = 'flex';
});

// Open signup modal
signupBtn.addEventListener('click', (e) => {
    e.preventDefault();
    signupModal.style.display = 'flex';
});

// Close modals
closeLoginModal.addEventListener('click', () => {
    loginModal.style.display = 'none';
});

closeSignupModal.addEventListener('click', () => {
    signupModal.style.display = 'none';
});

// Switch between login and signup
switchToSignup.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.style.display = 'none';
    signupModal.style.display = 'flex';
});

switchToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    signupModal.style.display = 'none';
    loginModal.style.display = 'flex';
});

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.style.display = 'none';
    }
    if (e.target === signupModal) {
        signupModal.style.display = 'none';
    }
});

// Handle login form submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const role = document.getElementById('loginRole').value;
    
    if (!role) {
        alert('Please select your role');
        return;
    }
    
    // Simulate login process
    console.log('Login attempted with:', { email, password, role });
    
    // In real application, you would send credentials to backend
    // For demo purposes - simulate successful login
    alert(`Login successful! Welcome ${role}. Redirecting to your dashboard...`);
    
    // Close modal
    loginModal.style.display = 'none';
    
    // In real app, redirect would be based on role
    // window.location.href = `/${role}-dashboard.html`;
});

// Handle signup form submission
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const role = document.getElementById('signupRole').value;
    
    if (!role) {
        alert('Please select your role');
        return;
    }
    
    // Simulate signup process
    console.log('Signup attempted with:', { name, email, password, role });
    
    // In real application, you would send data to backend
    // For demo purposes - simulate successful signup
    alert(`Account created successfully! Welcome ${name} as a ${role}.`);
    
    // Close modal
    signupModal.style.display = 'none';
    
    // In real app, might redirect to login or directly to dashboard
    // window.location.href = `/${role}-dashboard.html`;
});