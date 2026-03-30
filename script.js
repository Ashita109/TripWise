document.addEventListener('DOMContentLoaded', () => {
    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Scroll Reveal Animation (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Once revealed, stop observing
            }
        });
    }, {
        root: null,
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Simulated Typing effect for typing indicator in mockup
    const typingIndicator = document.querySelector('.bubble.typing');
    const chatBubbles = document.querySelector('.chat-bubbles');
    
    if (typingIndicator) {
        setTimeout(() => {
            typingIndicator.style.display = 'none';
            const newBubble = document.createElement('div');
            newBubble.className = 'bubble bot fade-in';
            newBubble.innerHTML = `Perfect! Found 3 amazing itineraries in Tokyo and Kyoto for $1,850. Check them out! ✨`;
            chatBubbles.appendChild(newBubble);
        }, 3000); // After 3 seconds, replace typing with an actual message
    }
});
