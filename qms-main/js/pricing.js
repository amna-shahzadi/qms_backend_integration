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

// Billing Toggle Functionality
const billingToggle = document.getElementById('billingToggle');
const priceAmounts = document.querySelectorAll('.amount');

// Plan Selection
const planSelectButtons = document.querySelectorAll('.plan-select');

// FAQ Accordion
const faqItems = document.querySelectorAll('.faq-item');

// Initialize with monthly pricing
let isAnnual = false;

// ========== MODAL FUNCTIONALITY ==========

// Open login modal
loginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
});

// Open signup modal
signupBtn.addEventListener('click', (e) => {
    e.preventDefault();
    signupModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
});

// Close modals
closeLoginModal.addEventListener('click', () => {
    loginModal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

closeSignupModal.addEventListener('click', () => {
    signupModal.style.display = 'none';
    document.body.style.overflow = 'auto';
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
        document.body.style.overflow = 'auto';
    }
    if (e.target === signupModal) {
        signupModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Close modals with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        loginModal.style.display = 'none';
        signupModal.style.display = 'none';
        document.body.style.overflow = 'auto';
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
    
    // Show loading state
    const submitBtn = loginForm.querySelector('.modal-btn');
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    submitBtn.disabled = true;
    
    // Simulate login process
    setTimeout(() => {
        console.log('Login attempted with:', { email, password, role });
        
        // For demo purposes - simulate successful login
        alert(`Login successful! Welcome ${role}. Redirecting to your dashboard...`);
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Close modal and reset form
        loginModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        loginForm.reset();
        
    }, 1500);
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
    
    // Show loading state
    const submitBtn = signupForm.querySelector('.modal-btn');
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
    submitBtn.disabled = true;
    
    // Simulate signup process
    setTimeout(() => {
        console.log('Signup attempted with:', { name, email, password, role });
        
        // For demo purposes - simulate successful signup
        alert(`Account created successfully! Welcome ${name} as a ${role}.`);
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Close modal and reset form
        signupModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        signupForm.reset();
        
    }, 1500);
});

// ========== PRICING FUNCTIONALITY ==========

// Toggle billing period and update prices
billingToggle.addEventListener('change', function() {
    isAnnual = this.checked;
    updatePrices();
});

// Update prices based on billing period
function updatePrices() {
    priceAmounts.forEach(amount => {
        const monthlyPrice = amount.getAttribute('data-monthly');
        const annualPrice = amount.getAttribute('data-annual');
        
        amount.textContent = isAnnual ? annualPrice : monthlyPrice;
    });
}

// Plan Selection
planSelectButtons.forEach(button => {
    button.addEventListener('click', function() {
        const planCard = this.closest('.plan-card');
        const planName = planCard.getAttribute('data-plan');
        const price = planCard.querySelector('.amount').textContent;
        const period = isAnnual ? 'annual' : 'monthly';
        
        // Check if user is logged in (in real app)
        const isLoggedIn = false; // This would be set based on auth status
        
        if (!isLoggedIn) {
            // Show signup modal if not logged in
            signupModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            // Pre-select the plan in signup form
            setTimeout(() => {
                const roleSelect = document.getElementById('signupRole');
                if (planName === 'basic') {
                    roleSelect.value = 'teacher';
                } else if (planName === 'professional') {
                    roleSelect.value = 'admin';
                } else if (planName === 'enterprise') {
                    roleSelect.value = 'analyst';
                }
            }, 100);
        } else {
            // If logged in, proceed to checkout
            alert(`You've selected the ${planName} plan at $${price}/${period}. Redirecting to checkout...`);
        }
    });
});

// ========== FAQ FUNCTIONALITY ==========

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

// ========== ADDITIONAL ENHANCEMENTS ==========

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

// Add animation to plan cards on scroll
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

// Observe plan cards for animation
document.querySelectorAll('.plan-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
});

// Free trial button functionality
document.querySelector('.cta-buttons .btn-primary').addEventListener('click', (e) => {
    e.preventDefault();
    signupModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
});

// Contact sales button functionality
document.querySelector('.cta-buttons .btn-outline').addEventListener('click', (e) => {
    e.preventDefault();
    // In real app, this would redirect to contact page
    console.log('Redirecting to contact page...');
});

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Any initialization code can go here
    console.log('QuizPro Pricing Page Loaded');
});