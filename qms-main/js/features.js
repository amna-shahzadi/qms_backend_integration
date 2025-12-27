// Tab functionality for role-based features
document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Show corresponding panel
            const tabId = button.getAttribute('data-tab');
            const targetPanel = document.getElementById(`${tabId}-tab`);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
    
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
    const ctaSignup = document.getElementById('ctaSignup');

    // Open login modal
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.style.display = 'flex';
        });
    }

    // Open signup modal
    if (signupBtn) {
        signupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            signupModal.style.display = 'flex';
        });
    }

    // CTA signup button
    if (ctaSignup) {
        ctaSignup.addEventListener('click', (e) => {
            e.preventDefault();
            signupModal.style.display = 'flex';
        });
    }

    // Close modals
    if (closeLoginModal) {
        closeLoginModal.addEventListener('click', () => {
            loginModal.style.display = 'none';
        });
    }

    if (closeSignupModal) {
        closeSignupModal.addEventListener('click', () => {
            signupModal.style.display = 'none';
        });
    }

    // Switch between login and signup
    if (switchToSignup) {
        switchToSignup.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.style.display = 'none';
            signupModal.style.display = 'flex';
        });
    }

    if (switchToLogin) {
        switchToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            signupModal.style.display = 'none';
            loginModal.style.display = 'flex';
        });
    }

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
    if (loginForm) {
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
    }

    // Handle signup form submission
    if (signupForm) {
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
    }
    
    // Add animation to feature items on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe feature items for animation
    document.querySelectorAll('.feature-item, .category').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(item);
    });
});