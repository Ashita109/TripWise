document.addEventListener('DOMContentLoaded', () => {
    // Navigation active toggle logic
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if(link.getAttribute('href') !== 'plan.html') {
            link.addEventListener('mouseenter', () => link.style.color = '#b3191a');
            link.addEventListener('mouseleave', () => link.style.color = '#534341');
        }
    });

    // Pill Multi-Select for Interests
    const interestPills = document.querySelectorAll('#interests-group .pill');
    interestPills.forEach(pill => {
        pill.addEventListener('click', () => {
            pill.classList.toggle('active');
        });
    });

    // Pill Single-Select for Travel Style and Dynamic
    const setupSingleSelect = (wrapperId) => {
        const wrapper = document.getElementById(wrapperId);
        if(!wrapper) return;
        const pills = wrapper.querySelectorAll('.pill-flex');
        pills.forEach(pill => {
            pill.addEventListener('click', () => {
                pills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
            });
        });
    };

    setupSingleSelect('style-group');
    setupSingleSelect('dynamic-group');

    // Simple Form Submit Prevention for Demo
    document.getElementById('planningForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('.btn-submit');
        const oldText = btn.textContent;
        btn.textContent = 'Crafting your voyage...';
        btn.style.opacity = '0.8';
        setTimeout(() => {
            btn.textContent = oldText;
            btn.style.opacity = '1';
            window.location.href = '/itinerary'; // placeholder route
        }, 1500);
    });
});
