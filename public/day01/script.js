// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Navbar Background on Scroll (Space Theme)
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 10, 30, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(138, 43, 226, 0.3)';
        } else {
            navbar.style.background = 'rgba(10, 10, 30, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Rocket Launch Animation
    function launchRocket() {
        const rocket = document.getElementById('rocket');
        const launchButton = document.querySelector('.btn-primary');
        
        // Reset rocket position and remove any previous animation
        rocket.classList.remove('launching');
        rocket.style.bottom = '-100px';
        rocket.style.opacity = '1';
        
        // Add launching class to trigger animation
        setTimeout(() => {
            rocket.classList.add('launching');
        }, 100);
        
        // Reset rocket after animation completes
        setTimeout(() => {
            rocket.classList.remove('launching');
            rocket.style.bottom = '-100px';
            rocket.style.opacity = '1';
        }, 3500);
        
        // Add button feedback
        launchButton.style.transform = 'scale(0.95)';
        setTimeout(() => {
            launchButton.style.transform = 'scale(1)';
        }, 200);
    }
    
    // Add event listener to Launch Mission button
    const launchButton = document.querySelector('.btn-primary');
    if (launchButton) {
        launchButton.addEventListener('click', launchRocket);
    }

    // Animated Counter for Stats
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }
        updateCounter();
    }

    // Intersection Observer for Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animation class
                entry.target.classList.add('animate');
                
                // Handle counter animations
                if (entry.target.classList.contains('stats')) {
                    const statNumbers = entry.target.querySelectorAll('.stat-number');
                    statNumbers.forEach(stat => {
                        const target = parseInt(stat.getAttribute('data-target'));
                        animateCounter(stat, target);
                    });
                }
                
                // Handle feature cards staggered animation
                if (entry.target.classList.contains('features')) {
                    const cards = entry.target.querySelectorAll('.feature-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 200);
                    });
                }
            }
        });
    }, observerOptions);

    // Observe sections for animations
    const sections = document.querySelectorAll('.features, .stats');
    sections.forEach(section => {
        observer.observe(section);
    });

    // Button Click Effects
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Parallax Effect for Hero Section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const shapes = document.querySelectorAll('.shape');
        
        if (hero && scrolled < hero.offsetHeight) {
            shapes.forEach((shape, index) => {
                const speed = 0.5 + (index * 0.1);
                shape.style.transform = `translateY(${scrolled * speed}px)`;
            });
        }
    });

    // Add dynamic particles to hero section
    function createParticles() {
        const hero = document.querySelector('.hero');
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles';
        particlesContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;
        
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: twinkle ${2 + Math.random() * 3}s infinite;
            `;
            particlesContainer.appendChild(particle);
        }
        
        hero.appendChild(particlesContainer);
    }

    // Add twinkle animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes twinkle {
            0%, 100% { opacity: 0; transform: scale(0); }
            50% { opacity: 1; transform: scale(1); }
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: rippleEffect 0.6s ease-out;
            pointer-events: none;
        }
        
        @keyframes rippleEffect {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
        
        .hamburger.active .bar:nth-child(1) {
            transform: rotate(-45deg) translate(-5px, 6px);
        }
        
        .hamburger.active .bar:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active .bar:nth-child(3) {
            transform: rotate(45deg) translate(-5px, -6px);
        }
        
        @media (max-width: 768px) {
            .nav-menu {
                position: fixed;
                left: -100%;
                top: 70px;
                flex-direction: column;
                background-color: white;
                width: 100%;
                text-align: center;
                transition: 0.3s;
                box-shadow: 0 10px 27px rgba(0, 0, 0, 0.05);
                padding: 2rem 0;
            }
            
            .nav-menu.active {
                left: 0;
            }
            
            .nav-link {
                padding: 1rem 0;
                display: block;
            }
        }
    `;
    document.head.appendChild(style);

    // Initialize particles
    createParticles();

    // Add scroll reveal animation for elements
    function revealOnScroll() {
        const reveals = document.querySelectorAll('.feature-card, .stat-item');
        
        reveals.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', revealOnScroll);

    // Add loading animation
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Stagger animation for hero elements
        const heroElements = document.querySelectorAll('.hero-content > *');
        heroElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200);
        });
    });

    // Add cursor trail effect (optional)
    let mouseX = 0, mouseY = 0;
    let trail = [];

    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function createTrail() {
        if (trail.length > 10) {
            trail[0].remove();
            trail.shift();
        }

        const dot = document.createElement('div');
        dot.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: rgba(52, 152, 219, 0.5);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            left: ${mouseX}px;
            top: ${mouseY}px;
            animation: trailFade 1s ease-out forwards;
        `;

        document.body.appendChild(dot);
        trail.push(dot);
    }

    // Add trail fade animation
    const trailStyle = document.createElement('style');
    trailStyle.textContent = `
        @keyframes trailFade {
            0% { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(0); }
        }
    `;
    document.head.appendChild(trailStyle);

    // Create trail on mouse move (throttled)
    let trailTimeout;
    document.addEventListener('mousemove', function() {
        if (!trailTimeout) {
            trailTimeout = setTimeout(() => {
                createTrail();
                trailTimeout = null;
            }, 50);
        }
    });
});
