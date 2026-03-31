document.addEventListener('DOMContentLoaded', () => {
    // ── Auth guard ─────────────────────────────────
    const token = localStorage.getItem('tw_token');
    const user = JSON.parse(localStorage.getItem('tw_user') || '{}');
    if (!token) { window.location.href = 'plan.html'; return; }

    // Show username & logout
    const userNameEl = document.getElementById('userName');
    if (userNameEl && user.name) userNameEl.textContent = `Hi, ${user.name.split(' ')[0]} 👋`;

    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('tw_token');
        localStorage.removeItem('tw_user');
        localStorage.removeItem('tw_itinerary');
        localStorage.removeItem('tw_trip');
        window.location.href = 'index.html';
    });

    // ── Load itinerary data ─────────────────────────
    const raw = localStorage.getItem('tw_itinerary');
    const trip = JSON.parse(localStorage.getItem('tw_trip') || '{}');

    const loadingEl = document.getElementById('loadingScreen');
    const mainEl    = document.getElementById('itinMain');

    if (!raw) {
        loadingEl.innerHTML = `<p class="loader-text font-sora">No itinerary found. <a href="plan.html" style="color:#B3191A">Plan a trip!</a></p>`;
        return;
    }

    let data;
    try {
        data = JSON.parse(raw);
    } catch {
        loadingEl.innerHTML = `<p class="loader-text font-sora" style="color:#c0392b">Couldn't parse itinerary. <a href="plan.html" style="color:#B3191A">Try again</a></p>`;
        return;
    }

    // ── Populate Hero ───────────────────────────────
    document.getElementById('tripTitle').textContent = data.destination || trip.destination || 'Your Adventure';

    const metaEl = document.getElementById('tripMeta');
    const metaTags = [
        { icon: '📅', text: data.date_range || trip.date_range || '' },
        { icon: '✈️', text: trip.travel_method || '' },
        { icon: '🎯', text: trip.travel_style || '' },
    ].filter(t => t.text);
    metaEl.innerHTML = metaTags.map(t =>
        `<div class="meta-tag font-jakarta"><span>${t.icon}</span><span>${t.text}</span></div>`
    ).join('');

    // Budget breakdown
    const budgetEl = document.getElementById('budgetPills');
    if (data.budget_breakdown) {
        const bb = data.budget_breakdown;
        const entries = Object.entries(bb).filter(([k]) => k !== 'total');
        budgetEl.innerHTML = entries.map(([k, v]) =>
            `<div class="budget-pill font-manrope">${capitalize(k)}: ${v}</div>`
        ).join('');
        if (bb.total) {
            budgetEl.innerHTML += `<div class="budget-pill font-manrope" style="background:rgba(255,211,33,0.25);border-color:#FFD321">💰 Total: ${bb.total}</div>`;
        }
    }

    // ── Render Days ─────────────────────────────────
    const container = document.getElementById('daysContainer');
    if (data.days && data.days.length > 0) {
        data.days.forEach((day, i) => {
            const slots = ['morning', 'afternoon', 'evening']
                .filter(s => day[s])
                .map(s => {
                    const slot = day[s];
                    const isFree = typeof slot.cost === 'string' && slot.cost.toLowerCase().includes('free');
                    return `
                    <div class="time-slot">
                        <div class="time-label">${slotIcon(s)} ${capitalize(s)}</div>
                        <div class="slot-title">${slot.activity || ''}</div>
                        <div class="slot-desc">${slot.description || ''}</div>
                        <div class="slot-meta">
                            ${slot.duration ? `<span class="slot-tag duration">⏱ ${slot.duration}</span>` : ''}
                            ${slot.cost ? `<span class="slot-tag ${isFree ? 'free' : 'cost'}">${isFree ? '🎉 Free' : '💸 ' + slot.cost}</span>` : ''}
                        </div>
                    </div>`;
                }).join('');

            const card = document.createElement('div');
            card.className = 'day-card';
            card.style.animationDelay = `${i * 0.08}s`;
            card.innerHTML = `
                <div class="day-header">
                    <div class="day-number font-sora">${day.day}</div>
                    <div class="day-info">
                        <h3>${day.title || `Day ${day.day}`}</h3>
                        <p>${day.date || ''}</p>
                    </div>
                </div>
                <div class="day-slots">${slots}</div>
                ${day.accommodation || day.tips ? `
                <div class="day-footer">
                    ${day.accommodation ? `
                    <div class="footer-hotel">
                        <div class="hotel-label font-manrope">🏨 Stay</div>
                        <div class="hotel-name font-jakarta">${day.accommodation}</div>
                    </div>` : ''}
                    ${day.tips ? `
                    <div class="tip-box">
                        <div class="tip-label font-manrope">💡 Local Tip</div>
                        <div class="tip-text font-jakarta">${day.tips}</div>
                    </div>` : ''}
                </div>` : ''}
            `;
            container.appendChild(card);
        });
    }

    // ── Highlights ──────────────────────────────────
    const hCard = document.getElementById('highlightsCard');
    if (data.highlights?.length) {
        hCard.innerHTML = `<h3>⭐ Must-Do Highlights</h3><ul>
            ${data.highlights.map(h => `<li>${h}</li>`).join('')}</ul>`;
    } else { hCard.remove(); }

    // ── Packing Tips ────────────────────────────────
    const tCard = document.getElementById('tipsCard');
    if (data.packing_tips?.length) {
        tCard.innerHTML = `<h3>🧳 Packing Tips</h3><ul>
            ${data.packing_tips.map(t => `<li>${t}</li>`).join('')}</ul>`;
    } else { tCard.remove(); }

    // ── Local Phrases ───────────────────────────────
    const pCard = document.getElementById('phrasesCard');
    if (data.local_phrases?.length) {
        pCard.innerHTML = `<h3>🗣️ Local Phrases</h3>
            ${data.local_phrases.map(p =>
                `<div class="phrase-row font-jakarta">
                    <span class="phrase-text">${p.phrase}</span>
                    <span class="phrase-meaning">${p.meaning}</span>
                </div>`
            ).join('')}`;
    } else { pCard.remove(); }

    // ── Show content ────────────────────────────────
    loadingEl.style.display = 'none';
    mainEl.style.display = 'block';
});

// ── Helpers ────────────────────────────────────────
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
function slotIcon(slot) {
    return { morning: '🌅', afternoon: '☀️', evening: '🌙' }[slot] || '';
}
