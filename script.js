/**
 * ============================================
 * PRANAV SAROTRA - PORTFOLIO WEBSITE
 * Main JavaScript File
 * ============================================
 * 
 * This file handles:
 * - Mobile navigation toggle
 * - Smooth scrolling
 * - Active navigation link highlighting
 * - Typing animation effect
 * - Scroll-triggered animations
 * - Navbar scroll effects
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // ELEMENT SELECTIONS
    // ============================================
    
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const typedTextElement = document.getElementById('typed-text');
    const fadeElements = document.querySelectorAll('.fade-in');
    const skillItems = document.querySelectorAll('.skill-item');
    const sections = document.querySelectorAll('section[id]');
    
    // ============================================
    // MOBILE NAVIGATION TOGGLE
    // ============================================
    
    /**
     * Toggles the mobile navigation menu
     */
    function toggleMobileNav() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }
    
    /**
     * Closes the mobile navigation menu
     */
    function closeMobileNav() {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Event listener for hamburger menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', toggleMobileNav);
    }
    
    // Close mobile menu when a nav link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMobileNav();
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navMenu.contains(event.target) || navToggle.contains(event.target);
        
        if (!isClickInsideNav && navMenu.classList.contains('active')) {
            closeMobileNav();
        }
    });
    
    // Close mobile menu on escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMobileNav();
        }
    });
    
    // ============================================
    // SMOOTH SCROLLING
    // ============================================
    
    /**
     * Smooth scroll to target section
     * @param {Event} e - Click event
     */
    function smoothScroll(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        
        // Check if it's a valid internal link
        if (!targetId || targetId === '#') return;
        
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const navHeight = navbar ? navbar.offsetHeight : 0;
            const targetPosition = targetSection.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
    
    // Add smooth scroll to all navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', smoothScroll);
    });
    
    // Add smooth scroll to CTA buttons and other internal links
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
        // Prevent adding duplicate listeners to nav links
        if (!link.classList.contains('nav-link')) {
            link.addEventListener('click', smoothScroll);
        }
    });
    
    // ============================================
    // NAVBAR SCROLL EFFECTS
    // ============================================
    
    /**
     * Adds/removes 'scrolled' class to navbar based on scroll position
     */
    function handleNavbarScroll() {
        if (!navbar) return;
        
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    // Initial check
    handleNavbarScroll();
    
    // Add scroll event listener with throttling for performance
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(function() {
            handleNavbarScroll();
            highlightActiveNavLink();
        });
    });
    
    // ============================================
    // ACTIVE NAVIGATION LINK HIGHLIGHTING
    // ============================================
    
    /**
     * Highlights the navigation link corresponding to the current section in view
     */
    function highlightActiveNavLink() {
        if (!navbar) return;
        
        const scrollPosition = window.scrollY + navbar.offsetHeight + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active class from all nav links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });
                
                // Add active class to corresponding nav link
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
        
        // Handle edge case: at the top of the page
        if (window.scrollY < 100) {
            navLinks.forEach(link => link.classList.remove('active'));
            const homeLink = document.querySelector('.nav-link[href="#home"]');
            if (homeLink) {
                homeLink.classList.add('active');
            }
        }
    }
    
    // Initial check
    highlightActiveNavLink();
    
    // ============================================
    // TYPING ANIMATION EFFECT
    // ============================================
    
    // Array of texts to cycle through
    const typingTexts = [
        'a Computer Science Student',
        'Specialising in Data Science & Artificial Intelligence',
        'a Thinker, Creator, Developer',
        'a Problem Solver'
    ];
    
    let textIndex = 0;      // Current text in the array
    let charIndex = 0;      // Current character position
    let isDeleting = false; // Whether we're deleting or typing
    let typingDelay = 100;  // Delay between each character
    
    /**
     * Creates the typing animation effect
     */
    function typeText() {
        if (!typedTextElement) return;
        
        const currentText = typingTexts[textIndex];
        
        if (isDeleting) {
            // Remove a character
            typedTextElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingDelay = 30; // Faster when deleting
        } else {
            // Add a character
            typedTextElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingDelay = 50; // Normal speed when typing
        }
        
        // Check if word is complete
        if (!isDeleting && charIndex === currentText.length) {
            // Pause at end of word
            typingDelay = 1500;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            // Move to next word
            isDeleting = false;
            textIndex = (textIndex + 1) % typingTexts.length;
            typingDelay = 500; // Pause before typing next word
        }
        
        setTimeout(typeText, typingDelay);
    }
    
    // Start typing animation after a short delay
    if (typedTextElement) {
        setTimeout(typeText, 1000);
    }
    
    // ============================================
    // SCROLL-TRIGGERED FADE-IN ANIMATIONS
    // ============================================
    
    /**
     * Intersection Observer callback for fade-in animations
     * @param {IntersectionObserverEntry[]} entries - Observed entries
     * @param {IntersectionObserver} observer - The observer instance
     */
    function handleFadeIn(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add staggered delay for elements in the same section
                const delay = entry.target.dataset.delay || 0;
                
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                
                // Stop observing after animation (optional - uncomment if you only want animation once)
                // observer.unobserve(entry.target);
            }
        });
    }
    
    // Create Intersection Observer for fade-in elements
    const fadeObserver = new IntersectionObserver(handleFadeIn, {
        root: null,           // Use viewport as root
        rootMargin: '0px 0px -50px 0px', // Trigger slightly before element is in view
        threshold: 0.1        // Trigger when 10% visible
    });
    
    // Observe all fade-in elements
    fadeElements.forEach((element, index) => {
        // Add staggered delay based on index within parent
        const parent = element.parentElement;
        const siblings = parent ? Array.from(parent.querySelectorAll('.fade-in')) : [];
        const siblingIndex = siblings.indexOf(element);
        element.dataset.delay = siblingIndex * 100; // 100ms stagger
        
        fadeObserver.observe(element);
    });
    
    // ============================================
    // SKILL PROGRESS BAR ANIMATION
    // ============================================
    
    /**
     * Intersection Observer callback for skill bar animations
     * @param {IntersectionObserverEntry[]} entries - Observed entries
     * @param {IntersectionObserver} observer - The observer instance
     */
    function handleSkillAnimation(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add visible class to trigger CSS animation
                entry.target.classList.add('visible');
                
                // Stop observing after animation
                observer.unobserve(entry.target);
            }
        });
    }
    
    // Create Intersection Observer for skill items
    const skillObserver = new IntersectionObserver(handleSkillAnimation, {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    });
    
    // Observe all skill items
    skillItems.forEach((item, index) => {
        // Add slight delay for staggered animation effect
        item.style.transitionDelay = `${index * 50}ms`;
        skillObserver.observe(item);
    });
    
    // ============================================
    // SCROLL REVEAL ANIMATION (ALTERNATIVE)
    // ============================================
    
    /**
     * Alternative scroll reveal for elements without Intersection Observer support
     * This is a fallback for older browsers
     */
    function scrollRevealFallback() {
        const windowHeight = window.innerHeight;
        const revealPoint = 150;
        
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < windowHeight - revealPoint) {
                element.classList.add('visible');
            }
        });
        
        skillItems.forEach(item => {
            const itemTop = item.getBoundingClientRect().top;
            
            if (itemTop < windowHeight - revealPoint) {
                item.classList.add('visible');
            }
        });
    }
    
    // Check if Intersection Observer is supported
    if (!('IntersectionObserver' in window)) {
        // Fallback for older browsers
        window.addEventListener('scroll', scrollRevealFallback);
        scrollRevealFallback(); // Initial check
    }
    
    // ============================================
    // BACK TO TOP BUTTON
    // ============================================
    
    const backToTopButton = document.querySelector('.footer-back-to-top');
    
    if (backToTopButton) {
        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // ============================================
    // IMAGE LOADING ERROR HANDLING
    // ============================================
    
    /**
     * Handle image loading errors gracefully
     */
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            // Add a placeholder or error class
            this.classList.add('image-error');
            
            // Optionally set a placeholder image
            // this.src = 'assets/images/placeholder.jpg';
            
            console.warn(`Image failed to load: ${this.src}`);
        });
    });
    
    // ============================================
    // PRELOADER (OPTIONAL)
    // ============================================
    
    /**
     * Remove preloader when page is fully loaded
     */
    window.addEventListener('load', function() {
        const preloader = document.querySelector('.preloader');
        
        if (preloader) {
            preloader.classList.add('loaded');
            
            // Remove from DOM after animation
            setTimeout(() => {
                preloader.remove();
            }, 500);
        }
        
        // Trigger initial animations
        document.body.classList.add('loaded');
    });
    
    // ============================================
    // KEYBOARD NAVIGATION SUPPORT
    // ============================================
    
    /**
     * Improve keyboard navigation for interactive elements
     */
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, [tabindex]');
    
    interactiveElements.forEach(element => {
        element.addEventListener('keydown', function(e) {
            // Allow activation with Enter or Space
            if (e.key === 'Enter' || e.key === ' ') {
                if (element.tagName === 'A' || element.tagName === 'BUTTON') {
                    // Default behavior handles this, but we can add custom logic
                }
            }
        });
    });
    
    // ============================================
    // RESIZE HANDLER
    // ============================================
    
    /**
     * Handle window resize events
     */
    let resizeTimeout;
    
    window.addEventListener('resize', function() {
        // Debounce resize events
        clearTimeout(resizeTimeout);
        
        resizeTimeout = setTimeout(function() {
            // Close mobile menu on resize to desktop
            if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                closeMobileNav();
            }
            
            // Recalculate any size-dependent values
            highlightActiveNavLink();
        }, 250);
    });
    
    // ============================================
    // CONSOLE WELCOME MESSAGE
    // ============================================
    
    console.log('%c👋 Welcome to Pranav Sarotra\'s Portfolio!', 'color: #6366f1; font-size: 16px; font-weight: bold;');
    console.log('%cBuilt with HTML, CSS, and JavaScript', 'color: #8b5cf6; font-size: 12px;');
    console.log('%cInterested in the code? Check out the GitHub repo!', 'color: #a1a1aa; font-size: 11px;');
    
});

// ============================================
// UTILITY FUNCTIONS (GLOBAL SCOPE)
// ============================================

/**
 * Debounce function to limit how often a function can be called
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait
 * @returns {Function} - Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function to limit function calls to once per specified time
 * @param {Function} func - Function to throttle
 * @param {number} limit - Milliseconds between calls
 * @returns {Function} - Throttled function
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Check if an element is in the viewport
 * @param {Element} element - DOM element to check
 * @returns {boolean} - Whether element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Get the current scroll percentage of the page
 * @returns {number} - Scroll percentage (0-100)
 */
function getScrollPercentage() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    return (scrollTop / docHeight) * 100;
}