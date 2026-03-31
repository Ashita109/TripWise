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

        const token = localStorage.getItem('tw_token');
        if (!token) {
            document.getElementById('authOverlay').classList.remove('hidden');
            return;
        }

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

        try {
            const res = await fetch(`${API}/trips/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    destination,
                    date_range,
                    budget,
                    travel_method: travelMethod,
                    interests,
                    travel_style: travelStyle
                })
            });

            if (res.status === 401) {
                localStorage.removeItem('tw_token');
                document.getElementById('authOverlay').classList.remove('hidden');
                return;
            }

            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || 'Failed to generate itinerary');

            // Store and navigate to itinerary page
            localStorage.setItem('tw_itinerary', data.itinerary);
            localStorage.setItem('tw_trip', JSON.stringify(data));
            window.location.href = 'itinerary.html';

        } catch (err) {
            btn.textContent = '⚠️ ' + err.message;
            btn.style.opacity = '1';
            setTimeout(() => {
                btn.textContent = 'Generate My Itinerary';
                btn.disabled = false;
            }, 3000);
        }
    });
});
