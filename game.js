/**
 * Rocket Escape - Game Logic
 */

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const UI = {
    startScreen: document.getElementById('start-screen'),
    hud: document.getElementById('hud'),
    gameOverScreen: document.getElementById('game-over-screen'),
    altitudeValue: document.getElementById('altitude-value'),
    boostFill: document.getElementById('boost-fill'),
    finalAltitude: document.getElementById('final-altitude'),
    endTitle: document.getElementById('end-title'),
    startButton: document.getElementById('start-button'),
    restartButton: document.getElementById('restart-button'),
    shareButton: document.getElementById('share-button')
};

// Game Constants
const GRAVITY = 0.15;
const THRUST_POWER = 0.45;
const MAX_HEAT = 100;
const HEAT_UP_RATE = 1.5;
const COOL_DOWN_RATE = 0.8;
const MIN_ALTITUDE = 0;

// Game State
let gameState = 'START'; // START, PLAYING, EXPLODED, FINISHED
let rocket = {
    y: 0,
    vy: 0,
    altitude: 0,
    maxAltitude: 0,
    heat: 0,
    isBoosting: false,
    width: 30,
    height: 60
};

let particles = [];
let stars = [];
let clouds = [];

// Initialize Canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Re-init background elements
    initBackground();
}

function initBackground() {
    stars = [];
    for (let i = 0; i < 100; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2,
            speed: Math.random() * 0.5 + 0.1
        });
    }

    clouds = [];
    for (let i = 0; i < 5; i++) {
        clouds.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 100 + 50,
            speed: Math.random() * 1 + 0.5
        });
    }
}

// Input Handling
function handleInputStart(e) {
    if (gameState === 'PLAYING') {
        rocket.isBoosting = true;
    }
    if (e.cancelable) e.preventDefault();
}

function handleInputEnd(e) {
    rocket.isBoosting = false;
    if (e.cancelable) e.preventDefault();
}

window.addEventListener('mousedown', handleInputStart);
window.addEventListener('mouseup', handleInputEnd);
window.addEventListener('touchstart', handleInputStart, { passive: false });
window.addEventListener('touchend', handleInputEnd, { passive: false });

UI.startButton.onclick = startGame;
UI.restartButton.onclick = startGame;
UI.shareButton.onclick = shareResult;

function startGame() {
    gameState = 'PLAYING';
    rocket = {
        y: canvas.height * 0.8,
        vy: 0,
        altitude: 0,
        maxAltitude: 0,
        heat: 0,
        isBoosting: false,
        width: 30,
        height: 60
    };
    particles = [];
    
    UI.startScreen.classList.add('hidden');
    UI.gameOverScreen.classList.add('hidden');
    UI.hud.classList.remove('hidden');
}

function explode() {
    gameState = 'EXPLODED';
    UI.endTitle.textContent = "BOOM! OVERHEATED";
    UI.endTitle.style.color = "#ff3333";
    showGameOver();
    
    // Create explosion particles
    for (let i = 0; i < 50; i++) {
        particles.push({
            x: canvas.width / 2,
            y: rocket.y,
            vx: (Math.random() - 0.5) * 15,
            vy: (Math.random() - 0.5) * 15,
            life: 1.0,
            size: Math.random() * 10 + 5,
            color: '#FF5F1F'
        });
    }
}

function showGameOver() {
    gameState = 'FINISHED';
    UI.finalAltitude.textContent = `${Math.floor(rocket.maxAltitude / 100)} km`;
    UI.hud.classList.add('hidden');
    UI.gameOverScreen.classList.remove('hidden');
}

function update() {
    if (gameState !== 'PLAYING' && gameState !== 'EXPLODED') return;

    if (gameState === 'PLAYING') {
        // Physics
        if (rocket.isBoosting) {
            rocket.vy -= THRUST_POWER;
            rocket.heat += HEAT_UP_RATE;
            
            // Generate exhaust particles
            particles.push({
                x: canvas.width / 2 + (Math.random() - 0.5) * 10,
                y: rocket.y + rocket.height / 2,
                vx: (Math.random() - 0.5) * 2,
                vy: 5 + Math.random() * 5,
                life: 1.0,
                size: Math.random() * 8 + 2,
                color: rocket.heat > 80 ? '#ffaa00' : '#FF5F1F'
            });
        } else {
            rocket.heat -= COOL_DOWN_RATE;
        }

        rocket.heat = Math.max(0, rocket.heat);
        
        if (rocket.heat >= MAX_HEAT) {
            explode();
        }

        rocket.vy += GRAVITY;
        rocket.y += rocket.vy;

        // Altitude Logic - Camera focuses on rocket
        // Here we simulate the rocket moving up by keeping it centered and moving background
        let relativeMovement = -rocket.vy;
        rocket.altitude += Math.max(0, relativeMovement);
        rocket.maxAltitude = Math.max(rocket.maxAltitude, rocket.altitude);

        // Ground constraint (if not space yet)
        if (rocket.y > canvas.height * 0.8) {
            rocket.y = canvas.height * 0.8;
            rocket.vy = 0;
            if (rocket.altitude > 0) {
              // If it falls back to earth
              // showGameOver();
            }
        }
    }

    // Update particles
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        if (p.life <= 0) particles.splice(i, 1);
    }

    // Update background elements based on rocket speed/altitude
    stars.forEach(s => {
        s.y += rocket.vy * 0.5 + s.speed;
        if (s.y > canvas.height) s.y = -10, s.x = Math.random() * canvas.width;
        if (s.y < -10) s.y = canvas.height, s.x = Math.random() * canvas.width;
    });

    clouds.forEach(c => {
        c.y += rocket.vy * 0.8 + c.speed;
        if (c.y > canvas.height) c.y = -100, c.x = Math.random() * canvas.width;
    });

    // Update HUD
    UI.altitudeValue.textContent = `${Math.floor(rocket.maxAltitude / 100)} km`;
    UI.boostFill.style.width = `${rocket.heat}%`;
    if (rocket.heat > 80) {
        UI.boostFill.style.background = '#ff0000';
    } else {
        UI.boostFill.style.background = 'linear-gradient(to right, var(--accent-color), var(--primary-color))';
    }
}

function draw() {
    // Background sky gradient based on altitude
    const altFactor = Math.min(1, rocket.maxAltitude / 50000);
    const topColor = interpolateColor('#87CEEB', '#0B0E14', altFactor);
    const bottomColor = interpolateColor('#E0F6FF', '#1a1c2c', altFactor);
    
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, topColor);
    grad.addColorStop(1, bottomColor);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Stars (appear more as altitude increases)
    ctx.fillStyle = `rgba(255, 255, 255, ${altFactor})`;
    stars.forEach(s => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
    });

    // Clouds (disappear more as altitude increases)
    ctx.fillStyle = `rgba(255, 255, 255, ${0.5 * (1 - altFactor)})`;
    clouds.forEach(c => {
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.size, 0, Math.PI * 2);
        ctx.fill();
    });

    // Draw Particles
    particles.forEach(p => {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.globalAlpha = 1.0;

    // Draw Rocket
    if (gameState !== 'EXPLODED') {
        const rx = canvas.width / 2;
        const ry = rocket.y;
        
        ctx.save();
        ctx.translate(rx, ry);
        
        // Slight tilt based on velocity
        ctx.rotate(rocket.vy * 0.05);

        // Rocket Body
        ctx.fillStyle = '#f0f0f0';
        ctx.beginPath();
        ctx.moveTo(0, -rocket.height/2);
        ctx.quadraticCurveTo(rocket.width/2, 0, rocket.width/2, rocket.height/2);
        ctx.lineTo(-rocket.width/2, rocket.height/2);
        ctx.quadraticCurveTo(-rocket.width/2, 0, 0, -rocket.height/2);
        ctx.fill();

        // Tip
        ctx.fillStyle = '#FF5F1F';
        ctx.beginPath();
        ctx.moveTo(0, -rocket.height/2);
        ctx.quadraticCurveTo(rocket.width/2, -rocket.height/4, 0, -rocket.height/4);
        ctx.quadraticCurveTo(-rocket.width/2, -rocket.height/4, 0, -rocket.height/2);
        ctx.fill();

        // Window
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.arc(0, -rocket.height/10, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

function interpolateColor(color1, color2, factor) {
    const r1 = parseInt(color1.substring(1, 3), 16);
    const g1 = parseInt(color1.substring(3, 5), 16);
    const b1 = parseInt(color1.substring(5, 7), 16);

    const r2 = parseInt(color2.substring(1, 3), 16);
    const g2 = parseInt(color2.substring(3, 5), 16);
    const b2 = parseInt(color2.substring(5, 7), 16);

    const r = Math.round(r1 + factor * (r2 - r1));
    const g = Math.round(g1 + factor * (g2 - g1));
    const b = Math.round(b1 + factor * (b2 - b1));

    return `rgb(${r}, ${g}, ${b})`;
}

function shareResult() {
    const alt = Math.floor(rocket.maxAltitude / 100);
    const text = `I reached ${alt} km in Rocket Escape! How far can you go? 🚀 ${window.location.href}`;
    if (navigator.share) {
        navigator.share({
            title: 'Rocket Escape',
            text: text,
            url: window.location.href,
        });
    } else {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    }
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
loop();
