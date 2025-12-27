// Authentication State Management
let isLoggedIn = false;
let currentUser = null;

// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const successModal = document.getElementById('successModal');
const closeLoginModal = document.getElementById('closeLoginModal');
const closeSignupModal = document.getElementById('closeSignupModal');
const closeSuccessModal = document.getElementById('closeSuccessModal');
const cancelLogin = document.getElementById('cancelLogin');
const cancelSignup = document.getElementById('cancelSignup');
const submitLogin = document.getElementById('submitLogin');
const submitSignup = document.getElementById('submitSignup');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const contactForm = document.getElementById('contactForm');
const authRequiredMessage = document.getElementById('authRequiredMessage');
const loginFromForm = document.getElementById('loginFromForm');
const signupFromForm = document.getElementById('signupFromForm');

// Form Validation and Submission
const submitBtn = document.querySelector('.submit-btn');

// Form validation rules
const validationRules = {
    firstName: {
        required: true,
        minLength: 2,
        maxLength: 50
    },
    lastName: {
        required: true,
        minLength: 2,
        maxLength: 50
    },
    email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    role: {
        required: true
    },
    subject: {
        required: true
    },
    message: {
        required: true,
        minLength: 10,
        maxLength: 1000
    },
    password: {
        required: true,
        minLength: 6
    },
    confirmPassword: {
        required: true
    }
};

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    setupEventListeners();
    updateFormAccess(); // Add this line to initialize form state
});

// Check authentication status
function checkAuthStatus() {
    const savedUser = localStorage.getItem('quizproUser');
    if (savedUser) {
        isLoggedIn = true;
        currentUser = JSON.parse(savedUser);
        updateUIForLoggedInUser();
    } else {
        updateUIForLoggedOutUser();
    }
}

// Update UI for logged in user
function updateUIForLoggedInUser() {
    // Update auth buttons to show user info
    const authButtons = document.querySelector('.auth-buttons');
    authButtons.innerHTML = `
        <div class="user-status" style="display: flex; align-items: center; gap: 10px;">
            <div class="user-avatar" style="width: 35px; height: 35px; border-radius: 50%; background: #6c5ce7; color: white; display: flex; align-items: center; justify-content: center; font-weight: 600;">
                ${currentUser.firstName.charAt(0)}
            </div>
            <span class="user-name" style="font-weight: 500;">${currentUser.firstName}</span>
            <button class="logout-btn" id="logoutBtn" style="background: none; border: none; color: #7f8c8d; cursor: pointer;">Logout</button>
        </div>
    `;
    
    // Add logout event listener
    document.getElementById('logoutBtn').addEventListener('click', logout);
    
    // Update form access
    updateFormAccess();
}

// Update UI for logged out user
function updateUIForLoggedOutUser() {
    // Reset auth buttons
    const authButtons = document.querySelector('.auth-buttons');
    authButtons.innerHTML = `
        <a href="#" class="btn btn-outline" id="loginBtn">Log In</a>
        <a href="#" class="btn btn-primary" id="signupBtn">Sign Up</a>
    `;
    
    // Re-attach event listeners to new buttons
    document.getElementById('loginBtn').addEventListener('click', () => openModal(loginModal));
    document.getElementById('signupBtn').addEventListener('click', () => openModal(signupModal));
    
    // Update form access
    updateFormAccess();
}

// Update form access based on authentication status
function updateFormAccess() {
    if (isLoggedIn) {
        // User is logged in - enable form
        authRequiredMessage.style.display = 'none';
        contactForm.style.opacity = '1';
        contactForm.style.pointerEvents = 'auto';
        
        // Pre-fill user data if available
        if (currentUser) {
            const firstNameField = document.getElementById('firstName');
            const lastNameField = document.getElementById('lastName');
            const emailField = document.getElementById('email');
            
            if (firstNameField && !firstNameField.value) firstNameField.value = currentUser.firstName;
            if (lastNameField && !lastNameField.value) lastNameField.value = currentUser.lastName;
            if (emailField && !emailField.value) emailField.value = currentUser.email;
        }
    } else {
        // User is not logged in - disable form
        authRequiredMessage.style.display = 'block';
        contactForm.style.opacity = '0.6';
        contactForm.style.pointerEvents = 'none';
    }
}

// Setup event listeners
function setupEventListeners() {
    // Modal open/close events
    loginBtn.addEventListener('click', () => openModal(loginModal));
    signupBtn.addEventListener('click', () => openModal(signupModal));
    loginFromForm.addEventListener('click', () => openModal(loginModal));
    signupFromForm.addEventListener('click', () => openModal(signupModal));
    
    closeLoginModal.addEventListener('click', () => closeModal(loginModal));
    closeSignupModal.addEventListener('click', () => closeModal(signupModal));
    closeSuccessModal.addEventListener('click', () => closeModal(successModal));
    cancelLogin.addEventListener('click', () => closeModal(loginModal));
    cancelSignup.addEventListener('click', () => closeModal(signupModal));
    
    // Form submission events
    submitLogin.addEventListener('click', handleLogin);
    submitSignup.addEventListener('click', handleSignup);
    contactForm.addEventListener('submit', handleContactFormSubmit);
    
    // Real-time validation
    contactForm.addEventListener('input', (e) => {
        const field = e.target;
        if (validationRules[field.name]) {
            validateField(field.name, field.value);
        }
    });
    
    loginForm.addEventListener('input', (e) => {
        const field = e.target;
        if (validationRules[field.name]) {
            validateField(field.name, field.value, loginForm);
        }
    });
    
    signupForm.addEventListener('input', (e) => {
        const field = e.target;
        if (validationRules[field.name]) {
            validateField(field.name, field.value, signupForm);
        }
    });
    
    // FAQ Accordion
    setupFAQAccordion();
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });
}

// Modal functions
function openModal(modal) {
    modal.classList.add('active');
}

function closeModal(modal) {
    modal.classList.remove('active');
}

// Login handler
function handleLogin() {
    const formData = new FormData(loginForm);
    const email = formData.get('email');
    const password = formData.get('password');
    
    // Validate form
    if (!validateForm(loginForm)) {
        return;
    }
    
    // Show loading state
    submitLogin.disabled = true;
    submitLogin.textContent = 'Logging in...';
    
    // Simulate login (replace with actual API call)
    simulateLogin(email, password)
        .then(user => {
            isLoggedIn = true;
            currentUser = user;
            localStorage.setItem('quizproUser', JSON.stringify(user));
            updateUIForLoggedInUser();
            closeModal(loginModal);
            loginForm.reset();
            
            // Reset button state
            submitLogin.disabled = false;
            submitLogin.textContent = 'Log In';
        })
        .catch(error => {
            alert('Login failed: ' + error.message);
            
            // Reset button state
            submitLogin.disabled = false;
            submitLogin.textContent = 'Log In';
        });
}

// Signup handler
function handleSignup() {
    const formData = new FormData(signupForm);
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const role = formData.get('role');
    
    // Validate form
    if (!validateForm(signupForm)) {
        return;
    }
    
    // Check if passwords match
    if (password !== confirmPassword) {
        const confirmPasswordField = document.getElementById('signupConfirmPassword');
        const errorElement = confirmPasswordField.parentElement.querySelector('.error-message');
        confirmPasswordField.parentElement.classList.add('error');
        errorElement.textContent = 'Passwords do not match';
        return;
    }
    
    // Show loading state
    submitSignup.disabled = true;
    submitSignup.textContent = 'Creating Account...';
    
    // Simulate signup (replace with actual API call)
    simulateSignup({ firstName, lastName, email, password, role })
        .then(user => {
            isLoggedIn = true;
            currentUser = user;
            localStorage.setItem('quizproUser', JSON.stringify(user));
            updateUIForLoggedInUser();
            closeModal(signupModal);
            signupForm.reset();
            
            // Reset button state
            submitSignup.disabled = false;
            submitSignup.textContent = 'Create Account';
        })
        .catch(error => {
            alert('Signup failed: ' + error.message);
            
            // Reset button state
            submitSignup.disabled = false;
            submitSignup.textContent = 'Create Account';
        });
}

// Logout handler
function logout() {
    isLoggedIn = false;
    currentUser = null;
    localStorage.removeItem('quizproUser');
    updateUIForLoggedOutUser();
}

// Contact form handler
function handleContactFormSubmit(e) {
    e.preventDefault();
    
    // Check if user is logged in
    if (!isLoggedIn) {
        authRequiredMessage.style.display = 'block';
        return;
    }
    
    const formData = new FormData(contactForm);
    
    // Validate form
    if (!validateForm(contactForm)) {
        return;
    }
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    try {
        // Simulate API call (replace with actual endpoint)
        submitContactForm(formData)
            .then(() => {
                // Show success modal
                openModal(successModal);
                
                // Reset form
                contactForm.reset();
            })
            .catch(error => {
                console.error('Form submission error:', error);
                alert('Sorry, there was an error sending your message. Please try again.');
            })
            .finally(() => {
                // Hide loading state
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            });
    } catch (error) {
        console.error('Form submission error:', error);
        alert('Sorry, there was an error sending your message. Please try again.');
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
}

// Validate individual field
function validateField(fieldName, value, form = contactForm) {
    const rules = validationRules[fieldName];
    const field = form.querySelector(`[name="${fieldName}"]`);
    
    if (!field || !rules) return true;
    
    const errorElement = field.parentElement.querySelector('.error-message');
    
    // Clear previous error
    field.parentElement.classList.remove('error');
    errorElement.textContent = '';
    
    // Check required
    if (rules.required && (!value || value.trim() === '')) {
        field.parentElement.classList.add('error');
        errorElement.textContent = 'This field is required';
        return false;
    }
    
    // Check min length
    if (rules.minLength && value.length < rules.minLength) {
        field.parentElement.classList.add('error');
        errorElement.textContent = `Minimum ${rules.minLength} characters required`;
        return false;
    }
    
    // Check max length
    if (rules.maxLength && value.length > rules.maxLength) {
        field.parentElement.classList.add('error');
        errorElement.textContent = `Maximum ${rules.maxLength} characters allowed`;
        return false;
    }
    
    // Check pattern
    if (rules.pattern && !rules.pattern.test(value)) {
        field.parentElement.classList.add('error');
        errorElement.textContent = 'Please enter a valid email address';
        return false;
    }
    
    // Special validation for confirm password
    if (fieldName === 'confirmPassword') {
        const passwordField = form.querySelector('[name="password"]');
        if (passwordField && value !== passwordField.value) {
            field.parentElement.classList.add('error');
            errorElement.textContent = 'Passwords do not match';
            return false;
        }
    }
    
    return true;
}

// Validate entire form
function validateForm(form) {
    let isValid = true;
    const formData = new FormData(form);
    
    for (const [fieldName, value] of formData.entries()) {
        if (validationRules[fieldName]) {
            if (!validateField(fieldName, value, form)) {
                isValid = false;
            }
        }
    }
    
    // Special case for terms agreement in signup
    if (form.id === 'signupForm') {
        const termsCheckbox = form.querySelector('[name="terms"]');
        if (!termsCheckbox.checked) {
            isValid = false;
            // Show error for terms agreement
            const errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.textContent = 'You must agree to the terms and conditions';
            errorElement.style.color = '#e74c3c';
            errorElement.style.marginTop = '10px';
            
            // Remove existing error if any
            const existingError = form.querySelector('.terms-error');
            if (existingError) existingError.remove();
            
            errorElement.classList.add('terms-error');
            termsCheckbox.parentElement.appendChild(errorElement);
        } else {
            // Remove terms error if checked
            const existingError = form.querySelector('.terms-error');
            if (existingError) existingError.remove();
        }
    }
    
    return isValid;
}

// Simulate form submission
function submitContactForm(formData) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate random success/failure (90% success rate)
            if (Math.random() > 0.1) {
                resolve({
                    success: true,
                    message: 'Message sent successfully'
                });
            } else {
                reject(new Error('Network error'));
            }
        }, 2000);
    });
}

// Simulate login
function simulateLogin(email, password) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate authentication (in real app, this would be an API call)
            if (email && password.length >= 6) {
                resolve({
                    id: 1,
                    firstName: 'John',
                    lastName: 'Doe',
                    email: email,
                    role: 'teacher'
                });
            } else {
                reject(new Error('Invalid email or password'));
            }
        }, 1500);
    });
}

// Simulate signup
function simulateSignup(userData) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate registration (in real app, this would be an API call)
            if (userData.email && userData.password) {
                resolve({
                    id: 2,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    email: userData.email,
                    role: userData.role
                });
            } else {
                reject(new Error('Registration failed'));
            }
        }, 1500);
    });
}

// FAQ Accordion
function setupFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// Auto-expand textarea
const messageTextarea = document.getElementById('message');
if (messageTextarea) {
    messageTextarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    });
});

// Add animation to elements on scroll
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

// Observe elements for animation
document.querySelectorAll('.contact-method, .contact-form-container, .faq-item').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(element);
});