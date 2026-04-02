const API = 'http://127.0.0.1:8000';

document.addEventListener('DOMContentLoaded', () => {
    // ── Pill Multi-Select for Interests ──────────────
    const interestPills = document.querySelectorAll('#interests-group .pill');
    interestPills.forEach(pill => {
        pill.addEventListener('click', () => pill.classList.toggle('active'));
    });

    // ── Pill Single-Select for Travel Style & Dynamic ─
    const setupSingleSelect = (wrapperId) => {
        const wrapper = document.getElementById(wrapperId);
        if (!wrapper) return;
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

    // ── Form Submit → call /trips/generate ────────────
    document.getElementById('planningForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        // Optional: you can grab token here, but we bypass auth for public demo

        const btn = document.getElementById('generateBtn');
        btn.textContent = '✨ Crafting your voyage...';
        btn.disabled = true;
        btn.style.opacity = '0.8';

        // Collect form values
        const destination = document.querySelector('[placeholder="e.g. Kyoto, Japan"]').value;
        const date_range = document.querySelector('[placeholder="Oct 12 - Oct 24"]').value;
        const budget = document.querySelector('[placeholder="₹3,48,600"]').value;

        // Active travel method (Trip Dynamic)
        const travelMethod = document.querySelector('#dynamic-group .pill-flex.active')?.dataset.value || 'group';
        const travelStyle = document.querySelector('#style-group .pill-flex.active')?.dataset.value || 'moderate';
        
        // Active interests
        const interests = [...document.querySelectorAll('#interests-group .pill.active')]
            .map(p => p.dataset.value).join(', ');

        // Bypass backend fetch for static GitHub Pages demo
        setTimeout(() => {
            window.location.href = 'itinerary.html';
        }, 1200);
    });
});
