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
document.addEventListener('DOMContentLoaded', function () {
    addJiggleEffect('.play-btn, .theme-toggle-btn, .nav-toggle');
    document.querySelectorAll('.nav-toggle').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            var nav = btn.closest('.dropdown-nav');
            nav.classList.toggle('open');
        });
    });
    // Optional: close menu when clicking outside
    document.addEventListener('click', function(e) {
        document.querySelectorAll('.dropdown-nav.open').forEach(function(nav) {
            if (!nav.contains(e.target)) nav.classList.remove('open');
        });
    });

    // Theme toggle button logic
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', function () {
        document.body.classList.toggle('light-mode');
        if (document.body.classList.contains('light-mode')) {
            themeToggle.textContent = '🌑 Night Mode';
        } else {
            themeToggle.textContent = '☀️ Day Mode';
        }
    });

    // Rainbow Glow support (read from localStorage)
    if (localStorage.getItem('rainbowGlow') !== 'off') {
        document.body.classList.add('rainbow-glow');
    } else {
        document.body.classList.remove('rainbow-glow');
    }
});


// Animated floating color-changing dots with trails (optimized, more dots, eye-catching)
const canvas = document.getElementById('animated-dots-bg');
const ctx = canvas.getContext('2d');
let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

const DOT_COUNT = 32;
const DOT_RADIUS = 7;
const TRAIL_LENGTH = 18;
const SPEED = 0.8;

function lerp(a, b, t) {
    return a + (b - a) * t;
}

class Dot {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = SPEED + Math.random() * 0.7;
        this.radius = DOT_RADIUS + Math.random() * 2.5;
        this.colorBase = Math.random() * 360;
        this.trail = [];
    }
    update() {
        this.angle += (Math.random() - 0.5) * 0.09;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        if (this.x < -20) this.x = width + 20;
        if (this.x > width + 20) this.x = -20;
        if (this.y < -20) this.y = height + 20;
        if (this.y > height + 20) this.y = -20;

        this.colorBase = (this.colorBase + 1.2) % 360;

        this.trail.unshift({ x: this.x, y: this.y });
        if (this.trail.length > TRAIL_LENGTH) this.trail.pop();
    }

    draw(ctx) {
        const currentColor = `hsl(${this.colorBase}, 100%, 65%)`;

        // Draw trail
        for (let i = this.trail.length - 1; i >= 0; i--) {
            const t = i / TRAIL_LENGTH;
            ctx.beginPath();
            ctx.arc(this.trail[i].x, this.trail[i].y, lerp(this.radius * 0.4, this.radius, t), 0, Math.PI * 2);
            ctx.fillStyle = `hsl(${this.colorBase}, 90%, 60%)`;
            // Fade the trail out smoothly
            ctx.globalAlpha = lerp(0, 0.25, t);
            ctx.fill();
        }

        // --- Start of Pop-out Effect ---

        // 1. Set a shadow to create a glow
        ctx.shadowBlur = 20;
        ctx.shadowColor = currentColor;

        // 2. Draw the main dot with high contrast
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = currentColor;
        ctx.fill();

        // 3. Reset shadow to not affect other elements
        ctx.shadowBlur = 0;

        // --- End of Pop-out Effect ---
    }
}

let dots = [];
function createDots() {
    dots = [];
    for (let i = 0; i < DOT_COUNT; i++) {
        dots.push(new Dot());
    }
}
createDots();

function animate() {
    if (document.body.classList.contains('no-animated-bg')) {
        ctx.clearRect(0, 0, width, height);
        return requestAnimationFrame(animate);
    }
    ctx.clearRect(0, 0, width, height);
    for (const dot of dots) {
        dot.update();
        dot.draw(ctx);
    }
    requestAnimationFrame(animate);
}
animate();

window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    createDots();
});

// Rainbow Glow toggle
const rainbowToggle = document.getElementById('toggle-rainbow-glow');
function applyRainbowSetting() {
    const enabled = localStorage.getItem('rainbowGlow') !== 'off';
    document.body.classList.toggle('rainbow-glow', enabled);
    if(rainbowToggle) rainbowToggle.checked = enabled;
}
if(rainbowToggle) {
    rainbowToggle.addEventListener('change', function() {
        if(this.checked) {
            localStorage.setItem('rainbowGlow', 'on');
        } else {
            localStorage.setItem('rainbowGlow', 'off');
        }
        applyRainbowSetting();
    });
}
applyRainbowSetting();