document.addEventListener('DOMContentLoaded', () => {
    // Scroll animations using IntersectionObserver
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Select elements to animate
    const animatableElements = document.querySelectorAll('.step, .feature-card, .cta-box, .hero-content, .floating-card');
    
    // Set initial state for these elements
    animatableElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Add CSS class for the animation state
    const style = document.createElement('style');
    style.textContent = `
        .animate-fade-in-up {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        .floating-card:hover {
            transform: translateY(-5px) scale(1.02) !important;
            box-shadow: 0 25px 30px -5px rgba(0, 0, 0, 0.15) !important;
            transition: all 0.3s ease !important;
        }
        
        .feature-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .feature-card:hover {
            transform: translateY(-5px) !important;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
        }
    `;
    document.head.appendChild(style);

    // Navigation Active State — allow normal page navigation, just update active class
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.forEach(nav => nav.classList.remove('active'));
            link.classList.add('active');
            // Navigation proceeds normally via the href
        });
    });
});
