let countdownInterval;
let targetDate;
let startBtn, startSecondsBtn, targetDateInput, secondsInput;
let daysEl, hoursEl, minutesEl, secondsEl, messageEl;

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    startBtn = document.getElementById('start-btn');
    startSecondsBtn = document.getElementById('start-seconds-btn');
    targetDateInput = document.getElementById('target-date');
    secondsInput = document.getElementById('seconds-input');
    daysEl = document.getElementById('days');
    hoursEl = document.getElementById('hours');
    minutesEl = document.getElementById('minutes');
    secondsEl = document.getElementById('seconds');
    messageEl = document.getElementById('message');

    // Tab functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            btn.classList.add('active');
            document.getElementById(tabId).classList.add('active');
            
            // Show all time boxes when switching tabs
            document.getElementById('days').parentElement.style.display = 'block';
            document.getElementById('hours').parentElement.style.display = 'block';
            document.getElementById('minutes').parentElement.style.display = 'block';
            document.getElementById('seconds').parentElement.style.display = 'block';
            
            // Clear any existing countdown and message
            if (countdownInterval) {
                clearInterval(countdownInterval);
            }
            messageEl.textContent = '';
        });
    });

    // Set default date to 7 days from now
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 7);
    targetDateInput.value = defaultDate.toISOString().slice(0, 16);

    startBtn.addEventListener('click', startCountdown);
    startSecondsBtn.addEventListener('click', startCountdownFromSeconds);

}); // End of DOMContentLoaded

function startCountdown() {
    const selectedDate = targetDateInput.value;
    
    if (!selectedDate) {
        messageEl.textContent = 'Please select a date and time!';
        messageEl.style.color = '#e74c3c';
        return;
    }
    
    targetDate = new Date(selectedDate).getTime();
    const now = new Date().getTime();
    
    if (targetDate <= now) {
        messageEl.textContent = 'Please select a future date!';
        messageEl.style.color = '#e74c3c';
        return;
    }
    
    // Show all time boxes
    document.getElementById('days').parentElement.style.display = 'block';
    document.getElementById('hours').parentElement.style.display = 'block';
    document.getElementById('minutes').parentElement.style.display = 'block';
    document.getElementById('seconds').parentElement.style.display = 'block';
    
    // Reset countdown layout
    const countdown = document.getElementById('countdown');
    countdown.style.justifyContent = 'center';
    
    messageEl.textContent = '';
    
    // Clear any existing interval
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    
    // Update immediately
    updateCountdown();
    
    // Update every second
    countdownInterval = setInterval(updateCountdown, 1000);
}

function startCountdownFromSeconds() {
    const seconds = parseInt(secondsInput.value);
    
    if (!seconds || seconds < 1) {
        messageEl.textContent = 'Please enter a valid number of seconds!';
        messageEl.style.color = '#e74c3c';
        return;
    }
    
    // Hide days, hours, minutes boxes
    document.getElementById('days').parentElement.style.display = 'none';
    document.getElementById('hours').parentElement.style.display = 'none';
    document.getElementById('minutes').parentElement.style.display = 'none';
    
    // Show only seconds box and center it
    const countdown = document.getElementById('countdown');
    countdown.style.justifyContent = 'center';
    document.getElementById('seconds').parentElement.style.display = 'block';
    
    // Calculate target date from seconds
    const now = new Date().getTime();
    targetDate = now + (seconds * 1000);
    
    messageEl.textContent = '';
    
    // Clear any existing interval
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    
    // Update immediately
    updateCountdown();
    
    // Update every second
    countdownInterval = setInterval(updateCountdown, 1000);
}

function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;
    
    if (distance < 0) {
        clearInterval(countdownInterval);
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        
        // Hide all UI elements but keep container for message
        document.querySelector('.tabs').style.display = 'none';
        document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
        document.getElementById('countdown').style.display = 'none';
        document.querySelector('h1').style.display = 'none';
        
        // Make container transparent and full screen
        const container = document.querySelector('.container');
        container.style.background = 'transparent';
        container.style.boxShadow = 'none';
        container.style.padding = '0';
        container.style.maxWidth = '100%';
        
        messageEl.textContent = '🎉 Happy New Year 2026! 🎉';
        messageEl.classList.add('expired');
        messageEl.classList.add('magnify');
        messageEl.classList.add('centered');
        messageEl.style.display = 'block';
        messageEl.style.color = '#DC143C';
        
        // Launch confetti and fireworks!
        launchCelebration();
        
        return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
}

// ============================================
// CONFETTI AND FIREWORKS CELEBRATION
// ============================================

let fireworksCanvas, fireworksCtx;
let confettiParticles = [];
let fireworksParticles = [];
let pokemonCharacters = [];
let animationId;

function initCanvas() {
    fireworksCanvas = document.getElementById('fireworks-canvas');
    fireworksCtx = fireworksCanvas.getContext('2d');
    
    fireworksCanvas.width = window.innerWidth;
    fireworksCanvas.height = window.innerHeight;
    
    window.addEventListener('resize', () => {
        fireworksCanvas.width = window.innerWidth;
        fireworksCanvas.height = window.innerHeight;
        // Reset Pokemon positions on resize
        if (pokemonCharacters.length > 0) {
            pokemonCharacters.forEach((pokemon, index) => {
                pokemon.updatePosition(index);
            });
        }
    });
}

// Helper function to get responsive scale factor
function getScaleFactor() {
    const width = window.innerWidth;
    if (width <= 480) return 0.4; // Extra small phones
    if (width <= 768) return 0.5; // Phones (Samsung S23 Ultra)
    if (width <= 1024) return 0.75; // Standard tablets
    if (width <= 1800) return 0.95; // High-res tablets (Samsung Tab S7+ 1752x2800)
    return 1; // Desktop
}

// Helper function to get responsive Pokemon size
function getResponsivePokemonSize() {
    return 270 * getScaleFactor();
}

// Helper function to get responsive spacing
function getResponsiveSpacing() {
    return 360 * getScaleFactor();
}

// Helper function to get responsive particle count
function getResponsiveParticleCount(baseCount) {
    return Math.floor(baseCount * getScaleFactor());
}

class Confetti {
    constructor() {
        this.x = Math.random() * fireworksCanvas.width;
        this.y = -20;
        this.size = Math.random() * 15 + 10; // Big confetti
        this.speedY = Math.random() * 3 + 2;
        this.speedX = Math.random() * 4 - 2;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 10 - 5;
        
        // Bright, vibrant colors
        const colors = [
            '#FF0080', '#FF00FF', '#8000FF', '#0080FF', '#00FFFF',
            '#00FF80', '#80FF00', '#FFFF00', '#FF8000', '#FF0000',
            '#FFD700', '#FF1493', '#00FF00', '#1E90FF', '#FF69B4'
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.shape = Math.random() > 0.5 ? 'square' : 'circle';
    }
    
    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;
        this.speedY += 0.1; // Gravity
    }
    
    draw() {
        fireworksCtx.save();
        fireworksCtx.translate(this.x, this.y);
        fireworksCtx.rotate(this.rotation * Math.PI / 180);
        fireworksCtx.fillStyle = this.color;
        
        if (this.shape === 'square') {
            fireworksCtx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        } else {
            fireworksCtx.beginPath();
            fireworksCtx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
            fireworksCtx.fill();
        }
        
        fireworksCtx.restore();
    }
}

class Balloon {
    constructor() {
        this.x = Math.random() * fireworksCanvas.width;
        this.y = fireworksCanvas.height + 50;
        this.size = Math.random() * 40 + 30; // Big balloons
        this.speedY = -(Math.random() * 2 + 1.5); // Float upward
        this.speedX = Math.random() * 2 - 1;
        this.swing = Math.random() * Math.PI * 2;
        this.swingSpeed = Math.random() * 0.03 + 0.02;
        
        // Bright balloon colors
        const colors = [
            '#FF0080', '#FF00FF', '#0080FF', '#00FFFF',
            '#00FF80', '#FFFF00', '#FF8000', '#FF0000',
            '#FFD700', '#FF1493', '#1E90FF', '#FF69B4'
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.stringLength = Math.random() * 40 + 60;
    }
    
    update() {
        this.y += this.speedY;
        this.swing += this.swingSpeed;
        this.x += Math.sin(this.swing) * 0.5; // Gentle swing motion
    }
    
    draw() {
        // Draw string
        fireworksCtx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        fireworksCtx.lineWidth = 2;
        fireworksCtx.beginPath();
        fireworksCtx.moveTo(this.x, this.y + this.size / 2);
        fireworksCtx.lineTo(this.x, this.y + this.size / 2 + this.stringLength);
        fireworksCtx.stroke();
        
        // Draw balloon body (oval shape)
        fireworksCtx.save();
        fireworksCtx.translate(this.x, this.y);
        fireworksCtx.scale(1, 1.2); // Make it taller
        
        fireworksCtx.fillStyle = this.color;
        fireworksCtx.beginPath();
        fireworksCtx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        fireworksCtx.fill();
        
        // Highlight for 3D effect
        const gradient = fireworksCtx.createRadialGradient(
            -this.size / 6, -this.size / 6, 0,
            0, 0, this.size / 2
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
        gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.2)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        fireworksCtx.fillStyle = gradient;
        fireworksCtx.beginPath();
        fireworksCtx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        fireworksCtx.fill();
        
        fireworksCtx.restore();
        fireworksCtx.shadowBlur = 0;
    }
}

class Pokemon {
    constructor(type, centerX, offsetIndex) {
        this.type = type; // 'pikachu', 'charizard', or 'venusaur'
        this.centerX = centerX;
        this.offsetIndex = offsetIndex; // -1, 0, or 1 for left, center, right
        this.updatePosition(offsetIndex);
        this.bounce = 0;
        this.bounceSpeed = 0.1;
        this.rotation = 0;
        this.rotationSpeed = 0.05;
        
        // Load image
        this.image = new Image();
        this.image.src = `${type}.png`;
        this.imageLoaded = false;
        this.image.onload = () => {
            this.imageLoaded = true;
        };
    }
    
    updatePosition(offsetIndex) {
        this.size = getResponsivePokemonSize();
        const spacing = getResponsiveSpacing();
        this.x = fireworksCanvas.width / 2 + (offsetIndex * spacing);
        this.y = fireworksCanvas.height * 0.75;
    }
    
    update() {
        this.bounce += this.bounceSpeed;
        this.rotation += this.rotationSpeed;
    }
    
    draw() {
        if (!this.imageLoaded) return;
        
        const bobY = Math.sin(this.bounce) * 20; // Bouncing motion
        const tilt = Math.sin(this.rotation) * 0.15; // Slight tilting for dance effect
        
        fireworksCtx.save();
        fireworksCtx.translate(this.x, this.y + bobY);
        fireworksCtx.rotate(tilt);
        
        // Draw the Pokemon image
        fireworksCtx.drawImage(
            this.image,
            -this.size / 2,
            -this.size / 2,
            this.size,
            this.size
        );
        
        fireworksCtx.restore();
    }
}

class Firework {
    constructor(x, y, isRocket = true, explosionType = 'default') {
        this.x = x;
        this.y = y;
        this.isRocket = isRocket;
        this.explosionType = explosionType;
        
        if (isRocket) {
            this.speedY = -(Math.random() * 10 + 15); // Faster launch
            this.speedX = (Math.random() - 0.5) * 5;
            this.targetY = Math.random() * fireworksCanvas.height * 0.25 + 80;
            this.exploded = false;
            this.trail = [];
            
            // Bright colors for rocket
            const rocketColors = ['#FFD700', '#FF1493', '#00FFFF', '#FF00FF', '#FFFF00', '#FFA500'];
            this.color = rocketColors[Math.floor(Math.random() * rocketColors.length)];
        } else {
            // Explosion particle
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 15 + 10; // Even bigger explosion
            this.speedX = Math.cos(angle) * speed;
            this.speedY = Math.sin(angle) * speed;
            this.size = Math.random() * 8 + 5;
            this.alpha = 1;
            this.decay = Math.random() * 0.012 + 0.008; // Slower decay for more visibility
            
            // Vibrant explosion colors
            const explosionColors = [
                '#FF0080', '#FF00FF', '#8000FF', '#0080FF', '#00FFFF',
                '#00FF80', '#80FF00', '#FFFF00', '#FF8000', '#FF0000',
                '#FFD700', '#FF1493', '#00FF00', '#1E90FF', '#FF69B4',
                '#FFA500', '#FF4500', '#DA70D6', '#7FFF00', '#00CED1'
            ];
            this.color = explosionColors[Math.floor(Math.random() * explosionColors.length)];
        }
    }
    
    update() {
        if (this.isRocket) {
            this.trail.push({ x: this.x, y: this.y });
            if (this.trail.length > 15) this.trail.shift();
            
            this.x += this.speedX;
            this.y += this.speedY;
            this.speedY += 0.15; // Gravity
            
            if (this.y <= this.targetY && !this.exploded) {
                this.exploded = true;
                // Create MASSIVE explosion with particles and glitter
                const explosionTypes = ['ring', 'burst', 'willow', 'chrysanthemum', 'palm'];
                const type = explosionTypes[Math.floor(Math.random() * explosionTypes.length)];
                
                createExplosion(this.x, this.y, type, this.color);
                return false; // Remove rocket
            }
            
            return this.y < fireworksCanvas.height;
        } else {
            this.x += this.speedX;
            this.y += this.speedY;
            this.speedY += 0.15; // Gravity
            this.alpha -= this.decay;
            
            return this.alpha > 0;
        }
    }
    
    draw() {
        if (this.isRocket) {
            // Draw trail (simplified)
            if (this.trail.length > 0) {
                fireworksCtx.strokeStyle = this.color + '80';
                fireworksCtx.lineWidth = 2;
                fireworksCtx.beginPath();
                fireworksCtx.moveTo(this.trail[0].x, this.trail[0].y);
                for (let i = 1; i < this.trail.length; i++) {
                    fireworksCtx.lineTo(this.trail[i].x, this.trail[i].y);
                }
                fireworksCtx.stroke();
            }
            
            // Draw rocket
            fireworksCtx.fillStyle = this.color;
            fireworksCtx.beginPath();
            fireworksCtx.arc(this.x, this.y, 4, 0, Math.PI * 2);
            fireworksCtx.fill();
        } else {
            // Draw explosion particle
            fireworksCtx.fillStyle = this.color + Math.floor(this.alpha * 255).toString(16).padStart(2, '0');
            fireworksCtx.beginPath();
            fireworksCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            fireworksCtx.fill();
        }
    }
}

class Glitter {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 4 + 2;
        this.speedY = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 2;
        this.alpha = 1;
        this.twinkle = Math.random() * Math.PI * 2;
        this.twinkleSpeed = Math.random() * 0.2 + 0.1;
        
        // Glitter colors - gold, silver, white
        const glitterColors = ['#FFD700', '#FFFFFF', '#C0C0C0', '#FFF8DC', '#F0E68C'];
        this.color = glitterColors[Math.floor(Math.random() * glitterColors.length)];
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedY += 0.08; // Gentle gravity
        this.alpha -= 0.008;
        this.twinkle += this.twinkleSpeed;
    }
    
    draw() {
        const twinkleAlpha = (Math.sin(this.twinkle) + 1) / 2;
        fireworksCtx.fillStyle = this.color + Math.floor(this.alpha * twinkleAlpha * 255).toString(16).padStart(2, '0');
        
        // Draw simple circle for glitter
        fireworksCtx.beginPath();
        fireworksCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        fireworksCtx.fill();
        
        return this.alpha > 0 && this.y < fireworksCanvas.height + 50;
    }
}

function createExplosion(x, y, type, baseColor) {
    const particleCount = getResponsiveParticleCount(150); // Responsive particle count
    
    switch(type) {
        case 'ring':
            // Perfect ring explosion
            for (let i = 0; i < particleCount; i++) {
                const angle = (i / particleCount) * Math.PI * 2;
                const speed = Math.random() * 8 + 12;
                const particle = new Firework(x, y, false);
                particle.speedX = Math.cos(angle) * speed;
                particle.speedY = Math.sin(angle) * speed;
                fireworksParticles.push(particle);
            }
            break;
            
        case 'willow':
            // Weeping willow effect
            for (let i = 0; i < particleCount; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 5 + 8;
                const particle = new Firework(x, y, false);
                particle.speedX = Math.cos(angle) * speed;
                particle.speedY = Math.sin(angle) * speed - 3; // Bias upward
                particle.decay = 0.005; // Slower decay for trailing effect
                fireworksParticles.push(particle);
            }
            break;
            
        case 'chrysanthemum':
            // Chrysanthemum with trailing particles
            for (let i = 0; i < particleCount; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 12 + 10;
                const particle = new Firework(x, y, false);
                particle.speedX = Math.cos(angle) * speed;
                particle.speedY = Math.sin(angle) * speed;
                particle.size = Math.random() * 10 + 6;
                fireworksParticles.push(particle);
            }
            break;
            
        case 'palm':
            // Palm tree explosion (upward burst)
            for (let i = 0; i < particleCount; i++) {
                const angle = Math.random() * Math.PI - Math.PI / 2; // Upward hemisphere
                const speed = Math.random() * 10 + 8;
                const particle = new Firework(x, y, false);
                particle.speedX = Math.cos(angle) * speed;
                particle.speedY = Math.sin(angle) * speed;
                fireworksParticles.push(particle);
            }
            break;
            
        default:
            // Standard burst
            for (let i = 0; i < particleCount; i++) {
                fireworksParticles.push(new Firework(x, y, false));
            }
    }
    
    // Add glitter to explosion (responsive)
    const glitterCount = getResponsiveParticleCount(225);
    for (let i = 0; i < glitterCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 30;
        const glitter = new Glitter(
            x + Math.cos(angle) * distance,
            y + Math.sin(angle) * distance
        );
        confettiParticles.push(glitter);
    }
}

function launchCelebration() {
    initCanvas();
    
    // Create dancing Pokemon characters with responsive positioning
    const centerX = fireworksCanvas.width / 2;
    pokemonCharacters = [
        new Pokemon('pikachu', centerX, -1),
        new Pokemon('charizard', centerX, 0),
        new Pokemon('venusaur', centerX, 1)
    ];
    
    // Create initial confetti burst (responsive)
    const confettiCount = getResponsiveParticleCount(120);
    for (let i = 0; i < confettiCount; i++) {
        confettiParticles.push(new Confetti());
    }
    
    // Create balloons (responsive)
    const balloonCount = getResponsiveParticleCount(12);
    for (let i = 0; i < balloonCount; i++) {
        setTimeout(() => {
            confettiParticles.push(new Balloon());
        }, i * 500);
    }
    
    // Launch initial fireworks barrage (responsive)
    const initialFireworks = getResponsiveParticleCount(9);
    for (let i = 0; i < initialFireworks; i++) {
        setTimeout(() => {
            const x = Math.random() * fireworksCanvas.width;
            fireworksParticles.push(new Firework(x, fireworksCanvas.height, true));
        }, i * 200);
    }
    
    // Continue launching FREQUENT fireworks like New Year's
    const fireworkInterval = setInterval(() => {
        // Multiple launches for intense celebration (adjust for mobile)
        const scaleFactor = getScaleFactor();
        const launches = scaleFactor >= 0.75 && Math.random() < 0.3 ? 2 : 1;
        for (let i = 0; i < launches; i++) {
            const x = Math.random() * fireworksCanvas.width;
            fireworksParticles.push(new Firework(x, fireworksCanvas.height, true));
        }
    }, 350);
    
    // Add confetti periodically (responsive)
    const periodicConfettiCount = getResponsiveParticleCount(15);
    const confettiInterval = setInterval(() => {
        for (let i = 0; i < periodicConfettiCount; i++) {
            confettiParticles.push(new Confetti());
        }
    }, 800);
    
    // Stop after 30 seconds
    setTimeout(() => {
        clearInterval(fireworkInterval);
        clearInterval(confettiInterval);
        
        // Fade out after 10 more seconds
        setTimeout(() => {
            cancelAnimationFrame(animationId);
            fireworksCanvas.style.opacity = '0';
        }, 10000);
    }, 30000);
    
    animate();
}

function animate() {
    fireworksCtx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
    
    // Update and draw confetti, glitter, and balloons
    confettiParticles = confettiParticles.filter(particle => {
        if (particle instanceof Glitter) {
            particle.update();
            return particle.draw();
        } else if (particle instanceof Balloon) {
            particle.update();
            particle.draw();
            return particle.y > -100; // Remove when off screen
        } else {
            particle.update();
            particle.draw();
            return particle.y < fireworksCanvas.height + 50;
        }
    });
    
    // Update and draw fireworks
    fireworksParticles = fireworksParticles.filter(firework => {
        const alive = firework.update();
        if (alive) firework.draw();
        return alive;
    });
    
    // Update and draw dancing Pokemon
    pokemonCharacters.forEach(pokemon => {
        pokemon.update();
        pokemon.draw();
    });
    
    animationId = requestAnimationFrame(animate);
}
