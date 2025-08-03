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

    // Jiggle animation for buttons on hover in/out
    function addJiggleEffect(selector) {
        document.querySelectorAll(selector).forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.classList.remove('jiggle-out');
                btn.classList.add('jiggle-in');
            });
            btn.addEventListener('animationend', () => {
                btn.classList.remove('jiggle-in');
            });
            btn.addEventListener('mouseleave', () => {
                btn.classList.remove('jiggle-in');
                btn.classList.add('jiggle-out');
            });
            btn.addEventListener('animationend', () => {
                btn.classList.remove('jiggle-out');
            });
        });
    }
    addJiggleEffect('button, .play-btn, .theme-toggle-btn, .nav-toggle');
});

// Animated color-changing glowing orbs wallpaper (major revamp)
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
    const DOTS = Math.floor((w * h) / 3500); // More orbs for a denser effect

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
        const hue = 220 + 80 * Math.abs(Math.sin(t/1200 + offset));
        return `hsl(${hue}, 90%, 65%)`;
    }
    function makeDots() {
        dots = [];
        for(let i=0;i<DOTS;i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.3 + Math.random() * 0.5;
            dots.push({
                x: Math.random()*w,
                y: Math.random()*h,
                r: 18 + Math.random()*22,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                baseSpeed: speed,
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
            // Move dot
            d.x += d.vx;
            d.y += d.vy;

            // Bounce off edges
            if (d.x < 0 || d.x > w) d.vx *= -1;
            if (d.y < 0 || d.y > h) d.vy *= -1;

            // Gentle floating effect
            const floatY = Math.sin(t/700 * d.baseSpeed + d.phase) * 18;
            // Glow effect
            ctx.save();
            ctx.beginPath();
            ctx.arc(d.x, d.y + floatY, d.r, 0, Math.PI*2);
            ctx.shadowColor = randomColor(t, d.offset);
            ctx.shadowBlur = 48 + Math.sin(t/900 + d.offset)*24;
            ctx.globalAlpha = 0.18 + 0.12*Math.sin(t/1200 + d.offset);
            ctx.fillStyle = randomColor(t, d.offset);
            ctx.fill();
            ctx.restore();

            // Inner orb for extra glow
            ctx.save();
            ctx.beginPath();
            ctx.arc(d.x, d.y + floatY, d.r*0.6, 0, Math.PI*2);
            ctx.globalAlpha = 0.32 + 0.18*Math.sin(t/1200 + d.offset);
            ctx.fillStyle = randomColor(t+400, d.offset+1.5);
            ctx.shadowColor = ctx.fillStyle;
            ctx.shadowBlur = 24;
            ctx.fill();
            ctx.restore();
        }
        ctx.globalAlpha = 1;
        if (running) requestAnimationFrame(animate);
    }
    animate(0);
})();