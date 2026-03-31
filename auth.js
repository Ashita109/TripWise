const API = 'http://127.0.0.1:8000';

// ── Show/hide modal based on stored token ──────────
function checkAuth() {
    const token = localStorage.getItem('tw_token');
    const overlay = document.getElementById('authOverlay');
    if (!token) {
        overlay.classList.remove('hidden');
    } else {
        overlay.classList.add('hidden');
    }
}

// ── Tab switching ──────────────────────────────────
function switchTab(tab) {
    document.getElementById('loginForm').classList.toggle('hidden', tab !== 'login');
    document.getElementById('registerForm').classList.toggle('hidden', tab !== 'register');
    document.getElementById('tabLogin').classList.toggle('active', tab === 'login');
    document.getElementById('tabRegister').classList.toggle('active', tab === 'register');
}

// ── Login ──────────────────────────────────────────
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errEl = document.getElementById('loginError');
    errEl.textContent = '';

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const res = await fetch(`${API}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || 'Login failed');

        localStorage.setItem('tw_token', data.access_token);
        localStorage.setItem('tw_user', JSON.stringify(data.user));
        document.getElementById('authOverlay').classList.add('hidden');
    } catch (err) {
        errEl.textContent = err.message;
    }
});

// ── Register ───────────────────────────────────────
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errEl = document.getElementById('registerError');
    errEl.textContent = '';

    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    try {
        const res = await fetch(`${API}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || 'Registration failed');

        localStorage.setItem('tw_token', data.access_token);
        localStorage.setItem('tw_user', JSON.stringify(data.user));
        document.getElementById('authOverlay').classList.add('hidden');
    } catch (err) {
        errEl.textContent = err.message;
    }
});

// Run on load
checkAuth();
