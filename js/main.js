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

    // Background animation toggle
    if (localStorage.getItem('animatedBg') === 'off') {
        document.body.classList.add('no-animated-bg');
        const dotsCanvas = document.getElementById('animated-dots-bg');
        if (dotsCanvas) dotsCanvas.style.display = 'none';
    }

    // Performance settings: Blur and Animations
    if (localStorage.getItem('blurEffects') === 'off') {
        document.body.classList.add('no-blur');
    }
    if (localStorage.getItem('animations') === 'off') {
        document.body.classList.add('no-animations');
    }
});

// Animated color-changing dots wallpaper (performance optimized)
(function(){
    const canvas = document.getElementById('animated-dots-bg');
    let running = true;
    function shouldRun() {
        return !document.body.classList.contains('no-animated-bg') && canvas && canvas.style.display !== 'none';
    }
    if (!shouldRun()) {
        if (canvas) canvas.style.display = 'none';
        return;
    }
    const ctx = canvas.getContext('2d');
    let w = window.innerWidth, h = window.innerHeight;
    let dots = [];
    const DOTS = Math.floor((w * h) / 5000); // Lower density for performance
    function resize() {
        w = window.innerWidth;
        h = window.innerHeight;
        canvas.width = w;
        canvas.height = h;
    }
    window.addEventListener('resize', () => {
        resize();
        makeDots();
    });
    resize();

    function randomColor(t, offset) {
        const hue = 220 + 50 * Math.abs(Math.sin(t/1800 + offset));
        return `hsl(${hue}, 80%, 65%)`;
    }
    function makeDots() {
        dots = [];
        for(let i=0;i<DOTS;i++) {
            dots.push({
                x: Math.random()*w,
                y: Math.random()*h,
                r: 10 + Math.random()*12, // smaller dots
                speed: 0.1 + Math.random()*0.2,
                phase: Math.random()*Math.PI*2,
                offset: Math.random()*2
            });
        }
    }
    makeDots();

    function animate(t) {
        if (!shouldRun()) {
            running = false;
            ctx.clearRect(0,0,w,h);
            return;
        }
        ctx.clearRect(0,0,w,h);
        for(const d of dots) {
            const y = d.y + Math.sin(t/900 * d.speed + d.phase) * 10;
            ctx.beginPath();
            ctx.arc(d.x, y, d.r, 0, Math.PI*2);
            ctx.fillStyle = randomColor(t, d.offset);
            ctx.globalAlpha = 0.12 + 0.08*Math.sin(t/1200 + d.offset);
            ctx.shadowColor = ctx.fillStyle;
            ctx.shadowBlur = 16;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
        ctx.globalAlpha = 1;
        if (running) requestAnimationFrame(animate);
    }
    animate(0);
})();