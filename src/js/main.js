document.addEventListener('DOMContentLoaded', function () {
    // Theme toggle logic (improved)
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
        // Set initial mode from localStorage or system preference
        const userPref = localStorage.getItem('theme');
        if (userPref === 'light') {
            document.body.classList.add('light-mode');
            toggleBtn.textContent = '🌙'; // Moon for dark mode
        } else {
            document.body.classList.remove('light-mode');
            toggleBtn.textContent = '☀️'; // Sun for light mode
        }

        toggleBtn.addEventListener('click', function () {
            document.body.classList.toggle('light-mode');
            if (document.body.classList.contains('light-mode')) {
                toggleBtn.textContent = '🌙';
                localStorage.setItem('theme', 'light');
            } else {
                toggleBtn.textContent = '☀️';
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // Dropdown navigation logic
    const nav = document.querySelector('.dropdown-nav');
    const navToggle = document.querySelector('.nav-toggle');
    if (nav && navToggle) {
        navToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            nav.classList.toggle('open');
        });
        // Close dropdown when clicking outside
        document.addEventListener('click', function (e) {
            if (!nav.contains(e.target)) {
                nav.classList.remove('open');
            }
        });
        // Optional: close on ESC key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                nav.classList.remove('open');
            }
        });
    }
});