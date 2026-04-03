/* ============================================================
   VEDANT — Portfolio JavaScript
   Features: Theme toggle, typing effect, scroll reveal,
             smooth scroll, mobile nav, form validation,
             testimonial slider, particles, scroll-to-top
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================
       1. THEME TOGGLE (Dark / Light)
       ========================================================== */
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    const themeIcon = themeToggle.querySelector('i');

    // Load saved theme or default to dark
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('portfolio-theme', next);
        updateThemeIcon(next);
    });

    function updateThemeIcon(theme) {
        themeIcon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    }

    /* ==========================================================
       2. MOBILE NAVIGATION TOGGLE
       ========================================================== */
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('open');
        // Prevent body scroll when menu is open
        document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('open') &&
            !navMenu.contains(e.target) &&
            !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('open');
            document.body.style.overflow = '';
        }
    });

    /* ==========================================================
       3. STICKY NAVBAR & ACTIVE LINK HIGHLIGHT
       ========================================================== */
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('.section, .hero');
    const allNavLinks = document.querySelectorAll('.nav-link');

    function handleScroll() {
        const scrollY = window.scrollY;

        // Sticky navbar shadow
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active section highlight
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        allNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run on load

    /* ==========================================================
       4. SMOOTH SCROLL FOR ANCHOR LINKS
       ========================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = target.offsetTop - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ==========================================================
       5. TYPING EFFECT IN HERO
       ========================================================== */
    const typingElement = document.getElementById('typingText');
    const phrases = [
        'Electrical & Software Engineering Student',
        'Core Tech & Software Developer',
        'Hardware–Software Integration Enthusiast'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    function typeEffect() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 40;
        } else {
            typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 80;
        }

        // Finished typing
        if (!isDeleting && charIndex === currentPhrase.length) {
            typingSpeed = 2000; // Pause at end
            isDeleting = true;
        }

        // Finished deleting
        if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 300; // Pause before next phrase
        }

        setTimeout(typeEffect, typingSpeed);
    }

    typeEffect();

    /* ==========================================================
       6. SCROLL REVEAL ANIMATIONS
       ========================================================== */
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target); // Only reveal once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    /* ==========================================================
       7. SKILL BAR ANIMATION
       ========================================================== */
    const skillFills = document.querySelectorAll('.skill-fill');

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target;
                const width = fill.getAttribute('data-width');
                fill.style.width = width + '%';
                skillObserver.unobserve(fill);
            }
        });
    }, {
        threshold: 0.3
    });

    skillFills.forEach(fill => skillObserver.observe(fill));

    /* ==========================================================
       8. CONTACT FORM VALIDATION
       ========================================================== */
    const contactForm = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');
    const submitBtn = document.getElementById('submitBtn');
    const formSuccess = document.getElementById('formSuccess');

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Real-time validation on input
    nameInput.addEventListener('input', () => validateField(nameInput, nameError, 'Please enter your name.'));
    emailInput.addEventListener('input', () => validateEmail());
    messageInput.addEventListener('input', () => validateField(messageInput, messageError, 'Please enter a message.'));

    function validateField(input, errorEl, message) {
        const wrapper = input.closest('.input-wrapper');
        if (input.value.trim() === '') {
            errorEl.textContent = message;
            wrapper.classList.add('error');
            return false;
        } else {
            errorEl.textContent = '';
            wrapper.classList.remove('error');
            return true;
        }
    }

    function validateEmail() {
        const wrapper = emailInput.closest('.input-wrapper');
        if (emailInput.value.trim() === '') {
            emailError.textContent = 'Please enter your email.';
            wrapper.classList.add('error');
            return false;
        } else if (!emailRegex.test(emailInput.value.trim())) {
            emailError.textContent = 'Please enter a valid email address.';
            wrapper.classList.add('error');
            return false;
        } else {
            emailError.textContent = '';
            wrapper.classList.remove('error');
            return true;
        }
    }

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validate all fields
        const isNameValid = validateField(nameInput, nameError, 'Please enter your name.');
        const isEmailValid = validateEmail();
        const isMessageValid = validateField(messageInput, messageError, 'Please enter a message.');

        if (isNameValid && isEmailValid && isMessageValid) {
            // Show loading state
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoading = submitBtn.querySelector('.btn-loading');
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline-flex';
            submitBtn.disabled = true;

            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                // Hide form fields
                contactForm.querySelectorAll('.form-group').forEach(g => g.style.display = 'none');
                submitBtn.style.display = 'none';

                // Show success message
                formSuccess.style.display = 'block';

                // Reset form after delay
                setTimeout(() => {
                    contactForm.reset();
                    contactForm.querySelectorAll('.form-group').forEach(g => g.style.display = 'block');
                    submitBtn.style.display = 'flex';
                    btnText.style.display = 'inline-flex';
                    btnLoading.style.display = 'none';
                    submitBtn.disabled = false;
                    formSuccess.style.display = 'none';
                }, 4000);
            }, 1500);
        }
    });

    /* ==========================================================
       9. SCROLL TO TOP BUTTON
       ========================================================== */
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ==========================================================
       11. HERO PARTICLES BACKGROUND
       ========================================================== */
    const particlesContainer = document.getElementById('particles');

    function createParticles() {
        // Create 40 floating particles
        for (let i = 0; i < 40; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.left = Math.random() * 100 + '%';
            particle.style.width = Math.random() * 6 + 2 + 'px';
            particle.style.height = particle.style.width;
            particle.style.animationDuration = Math.random() * 15 + 10 + 's';
            particle.style.animationDelay = Math.random() * 10 + 's';
            particle.style.opacity = Math.random() * 0.15 + 0.03;
            particlesContainer.appendChild(particle);
        }
    }

    createParticles();

    /* ==========================================================
       12. FOOTER YEAR
       ========================================================== */
    const yearEl = document.getElementById('currentYear');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    /* ==========================================================
       13. KEYBOARD ACCESSIBILITY – ESC to close mobile menu
       ========================================================== */
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('open')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('open');
            document.body.style.overflow = '';
        }
    });

});

