/**
 * Environment.js - Clouds, Butterflies, Weather Effects, and Dynamic Backgrounds
 */

// ===== CLOUD CLASS =====
class Cloud {
    constructor(canvasWidth, canvasHeight) {
        this.width = Math.random() * 100 + 100;
        this.height = this.width * 0.6;
        this.x = canvasWidth + this.width;
        this.y = Math.random() * (canvasHeight * 0.4);
        this.speed = Math.random() * 0.5 + 0.2;
        this.opacity = Math.random() * 0.3 + 0.2;
    }

    update() {
        this.x -= this.speed;
        return this.x < -this.width;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = '#ffffff';

        const cx = this.x;
        const cy = this.y;
        const r = this.height * 0.5;

        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.arc(cx + r * 0.8, cy - r * 0.3, r * 0.8, 0, Math.PI * 2);
        ctx.arc(cx + r * 1.6, cy, r * 0.9, 0, Math.PI * 2);
        ctx.arc(cx + r * 0.8, cy + r * 0.3, r * 0.7, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// ===== BUTTERFLY CLASS =====
class Butterfly {
    constructor(canvasWidth, canvasHeight) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight * 0.6;
        this.targetX = Math.random() * canvasWidth;
        this.targetY = Math.random() * canvasHeight * 0.6;
        this.size = Math.random() * 6 + 10;
        this.hue = Math.random() * 360;
        this.wingAngle = Math.random() * Math.PI * 2;
        this.wingSpeed = 0.12 + Math.random() * 0.08;
        this.speed = 1.2;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
    }

    update() {
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < 400) {
            this.targetX = Math.random() * this.canvasWidth;
            this.targetY = Math.random() * this.canvasHeight * 0.6;
        } else if (distSq > 4) {
            const dist = Math.sqrt(distSq);
            this.x += (dx / dist) * this.speed;
            this.y += (dy / dist) * this.speed;
        }

        this.x = Math.max(20, Math.min(this.canvasWidth - 20, this.x));
        this.y = Math.max(20, Math.min(this.canvasHeight * 0.7, this.y));

        this.wingAngle += this.wingSpeed;
    }

    react(mx, my) {
        const dx = this.x - mx;
        const dy = this.y - my;
        const distSq = dx * dx + dy * dy;
        if (distSq < 8000 && distSq > 4) {
            const dist = Math.sqrt(distSq);
            this.targetX = this.x + (dx / dist) * 150;
            this.targetY = this.y + (dy / dist) * 150;
            this.speed = 3;
            setTimeout(() => this.speed = 1.2, 600);
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        const flapScale = 0.4 + Math.abs(Math.sin(this.wingAngle)) * 0.6;
        const wingColor = `hsl(${this.hue}, 75%, 65%)`;
        const wingHighlight = `hsl(${this.hue}, 85%, 80%)`;

        // Left wing
        ctx.fillStyle = wingColor;
        ctx.beginPath();
        ctx.arc(-this.size * flapScale, -this.size * 0.3, this.size * 0.7, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(-this.size * flapScale * 0.7, this.size * 0.2, this.size * 0.5, 0, Math.PI * 2);
        ctx.fill();

        // Right wing
        ctx.beginPath();
        ctx.arc(this.size * flapScale, -this.size * 0.3, this.size * 0.7, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.size * flapScale * 0.7, this.size * 0.2, this.size * 0.5, 0, Math.PI * 2);
        ctx.fill();

        // Wing highlights
        ctx.fillStyle = wingHighlight;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(-this.size * flapScale * 0.8, -this.size * 0.35, this.size * 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.size * flapScale * 0.8, -this.size * 0.35, this.size * 0.3, 0, Math.PI * 2);
        ctx.fill();

        // Body
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(-1, -this.size * 0.4, 2, this.size * 0.6);

        // Antennae
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-1, -this.size * 0.4);
        ctx.lineTo(-4, -this.size * 0.7);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(1, -this.size * 0.4);
        ctx.lineTo(4, -this.size * 0.7);
        ctx.stroke();

        ctx.restore();
    }
}

// ===== WEATHER PARTICLE BASE CLASS =====
class WeatherParticle {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.reset();
    }

    reset() {
        this.x = Math.random() * this.canvasWidth;
        this.y = -10;
    }

    update() {
        return false; // Override in subclass
    }

    draw(ctx) {
        // Override in subclass
    }
}

// ===== RAIN DROP =====
class RainDrop extends WeatherParticle {
    constructor(canvasWidth, canvasHeight) {
        super(canvasWidth, canvasHeight);
        this.speed = Math.random() * 5 + 10;
        this.length = Math.random() * 20 + 10;
        this.opacity = Math.random() * 0.3 + 0.2;
        this.windOffset = Math.random() * 2 - 1;
    }

    reset() {
        super.reset();
        this.x = Math.random() * (this.canvasWidth + 100) - 50;
        this.y = Math.random() * -100;
        this.speed = Math.random() * 5 + 10;
    }

    update() {
        this.y += this.speed;
        this.x += this.windOffset;
        
        if (this.y > this.canvasHeight) {
            this.reset();
        }
        return false;
    }

    draw(ctx) {
        ctx.save();
        ctx.strokeStyle = `rgba(174, 194, 224, ${this.opacity})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.windOffset * 2, this.y + this.length);
        ctx.stroke();
        ctx.restore();
    }
}

// ===== SNOWFLAKE =====
class Snowflake extends WeatherParticle {
    constructor(canvasWidth, canvasHeight) {
        super(canvasWidth, canvasHeight);
        this.size = Math.random() * 4 + 2;
        this.speed = Math.random() * 1 + 0.5;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = Math.random() * 0.02 + 0.01;
        this.opacity = Math.random() * 0.5 + 0.3;
    }

    reset() {
        super.reset();
        this.x = Math.random() * this.canvasWidth;
        this.y = Math.random() * -50;
    }

    update() {
        this.y += this.speed;
        this.wobble += this.wobbleSpeed;
        this.x += Math.sin(this.wobble) * 0.5;
        
        if (this.y > this.canvasHeight) {
            this.reset();
        }
        return false;
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Sparkle effect
        if (Math.random() > 0.95) {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity + 0.3})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }
}

// ===== FALLING LEAF =====
class FallingLeaf extends WeatherParticle {
    constructor(canvasWidth, canvasHeight) {
        super(canvasWidth, canvasHeight);
        this.size = Math.random() * 10 + 8;
        this.speed = Math.random() * 1.5 + 0.5;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.1;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = Math.random() * 0.03 + 0.02;
        this.wobbleAmp = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.4 + 0.4;
        
        // Autumn colors
        const leafColors = ['#d4a574', '#c65d3b', '#8b4513', '#daa520', '#cd853f', '#b8860b'];
        this.color = leafColors[Math.floor(Math.random() * leafColors.length)];
    }

    reset() {
        super.reset();
        this.x = Math.random() * (this.canvasWidth + 100) - 50;
        this.y = Math.random() * -100;
    }

    update() {
        this.y += this.speed;
        this.wobble += this.wobbleSpeed;
        this.x += Math.sin(this.wobble) * this.wobbleAmp;
        this.rotation += this.rotationSpeed;
        
        if (this.y > this.canvasHeight + 20) {
            this.reset();
        }
        return false;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        
        // Draw leaf shape
        ctx.beginPath();
        ctx.moveTo(0, -this.size);
        ctx.quadraticCurveTo(this.size * 0.8, -this.size * 0.3, this.size * 0.5, this.size * 0.5);
        ctx.quadraticCurveTo(0, this.size, -this.size * 0.5, this.size * 0.5);
        ctx.quadraticCurveTo(-this.size * 0.8, -this.size * 0.3, 0, -this.size);
        ctx.fill();
        
        // Leaf vein
        ctx.strokeStyle = `rgba(0, 0, 0, 0.2)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -this.size * 0.8);
        ctx.lineTo(0, this.size * 0.6);
        ctx.stroke();
        
        ctx.restore();
    }
}

// ===== AURORA PARTICLE =====
class AuroraWave {
    constructor(canvasWidth, canvasHeight, index) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.index = index;
        this.offset = Math.random() * Math.PI * 2;
        this.speed = 0.005 + Math.random() * 0.005;
        this.amplitude = 30 + Math.random() * 20;
        this.y = canvasHeight * (0.1 + index * 0.08);
        this.hue = 120 + index * 30; // Green to blue
        this.opacity = 0.15 + Math.random() * 0.1;
    }

    update() {
        this.offset += this.speed;
    }

    draw(ctx) {
        ctx.save();
        
        const gradient = ctx.createLinearGradient(0, this.y - 50, 0, this.y + 100);
        gradient.addColorStop(0, `hsla(${this.hue}, 80%, 60%, 0)`);
        gradient.addColorStop(0.3, `hsla(${this.hue}, 80%, 60%, ${this.opacity})`);
        gradient.addColorStop(0.7, `hsla(${this.hue + 30}, 80%, 50%, ${this.opacity * 0.7})`);
        gradient.addColorStop(1, `hsla(${this.hue + 60}, 80%, 40%, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(0, this.canvasHeight);
        
        for (let x = 0; x <= this.canvasWidth; x += 10) {
            const wave1 = Math.sin(x * 0.01 + this.offset) * this.amplitude;
            const wave2 = Math.sin(x * 0.02 + this.offset * 1.5) * this.amplitude * 0.5;
            const y = this.y + wave1 + wave2;
            ctx.lineTo(x, y);
        }
        
        ctx.lineTo(this.canvasWidth, this.canvasHeight);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    }
}

// ===== STAR (for night sky) =====
class Star {
    constructor(canvasWidth, canvasHeight) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight * 0.6;
        this.size = Math.random() * 2 + 0.5;
        this.twinkleSpeed = Math.random() * 0.05 + 0.02;
        this.twinkleOffset = Math.random() * Math.PI * 2;
        this.baseOpacity = Math.random() * 0.5 + 0.3;
    }

    update() {
        this.twinkleOffset += this.twinkleSpeed;
    }

    draw(ctx) {
        const opacity = this.baseOpacity + Math.sin(this.twinkleOffset) * 0.3;
        ctx.save();
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Occasional bright twinkle
        if (Math.sin(this.twinkleOffset) > 0.9) {
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity + 0.3})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }
}

// ===== SAKURA PETAL =====
class SakuraPetal extends WeatherParticle {
    constructor(canvasWidth, canvasHeight) {
        super(canvasWidth, canvasHeight);
        this.size = Math.random() * 8 + 5;
        this.speed = Math.random() * 1 + 0.3;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.08;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = Math.random() * 0.04 + 0.02;
        this.wobbleAmp = Math.random() * 3 + 1;
        this.opacity = Math.random() * 0.6 + 0.3;
        
        // Pink sakura colors
        const petalColors = ['#ffb7c5', '#ffc0cb', '#ff69b4', '#ffb6c1', '#ffd1dc'];
        this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
    }

    reset() {
        super.reset();
        this.x = Math.random() * (this.canvasWidth + 100) - 50;
        this.y = Math.random() * -100;
    }

    update() {
        this.y += this.speed;
        this.wobble += this.wobbleSpeed;
        this.x += Math.sin(this.wobble) * this.wobbleAmp;
        this.rotation += this.rotationSpeed;
        
        if (this.y > this.canvasHeight + 20) {
            this.reset();
        }
        return false;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        
        // Draw petal shape (simplified cherry blossom petal)
        ctx.beginPath();
        ctx.moveTo(0, -this.size);
        ctx.bezierCurveTo(
            this.size * 0.5, -this.size * 0.5,
            this.size * 0.5, this.size * 0.5,
            0, this.size * 0.3
        );
        ctx.bezierCurveTo(
            -this.size * 0.5, this.size * 0.5,
            -this.size * 0.5, -this.size * 0.5,
            0, -this.size
        );
        ctx.fill();
        
        ctx.restore();
    }
}

// ===== WEATHER SYSTEM =====
class WeatherSystem {
    static WEATHER_TYPES = {
        none: { particles: 0, class: null },
        rain: { particles: 100, class: RainDrop },
        snow: { particles: 80, class: Snowflake },
        leaves: { particles: 40, class: FallingLeaf },
        sakura: { particles: 50, class: SakuraPetal },
        aurora: { particles: 5, class: AuroraWave }
    };

    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.currentWeather = 'none';
        this.particles = [];
        this.stars = [];
        this.auroraWaves = [];
        this.transitionProgress = 0;
        this.transitioning = false;
        this.targetWeather = 'none';
        
        // Initialize stars for night themes
        this.initStars();
    }

    initStars() {
        this.stars = [];
        for (let i = 0; i < 100; i++) {
            this.stars.push(new Star(this.canvasWidth, this.canvasHeight));
        }
    }

    setWeather(weatherType) {
        if (weatherType === this.currentWeather) return;
        
        this.targetWeather = weatherType;
        this.transitioning = true;
        this.transitionProgress = 0;
        
        // Create new particles
        const config = WeatherSystem.WEATHER_TYPES[weatherType];
        if (config && config.class) {
            this.particles = [];
            
            if (weatherType === 'aurora') {
                // Aurora uses waves instead of particles
                this.auroraWaves = [];
                for (let i = 0; i < config.particles; i++) {
                    this.auroraWaves.push(new AuroraWave(this.canvasWidth, this.canvasHeight, i));
                }
            } else {
                for (let i = 0; i < config.particles; i++) {
                    const particle = new config.class(this.canvasWidth, this.canvasHeight);
                    particle.y = Math.random() * this.canvasHeight; // Spread initially
                    this.particles.push(particle);
                }
            }
        } else {
            this.particles = [];
            this.auroraWaves = [];
        }
        
        this.currentWeather = weatherType;
    }

    resize(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.initStars();
        
        // Reinitialize weather if active
        if (this.currentWeather !== 'none') {
            const current = this.currentWeather;
            this.currentWeather = 'none';
            this.setWeather(current);
        }
    }

    update() {
        // Update stars
        this.stars.forEach(star => star.update());
        
        // Update aurora waves
        this.auroraWaves.forEach(wave => wave.update());
        
        // Update weather particles
        this.particles.forEach(particle => particle.update());
        
        // Handle transition
        if (this.transitioning) {
            this.transitionProgress += 0.02;
            if (this.transitionProgress >= 1) {
                this.transitioning = false;
                this.transitionProgress = 1;
            }
        }
    }

    draw(ctx, showStars = false) {
        // Draw stars (for night themes)
        if (showStars) {
            this.stars.forEach(star => star.draw(ctx));
        }
        
        // Draw aurora waves (behind other weather)
        this.auroraWaves.forEach(wave => wave.draw(ctx));
        
        // Draw weather particles
        const alpha = this.transitioning ? this.transitionProgress : 1;
        ctx.save();
        ctx.globalAlpha = alpha;
        this.particles.forEach(particle => particle.draw(ctx));
        ctx.restore();
    }
}

// ===== PARALLAX BACKGROUND LAYER =====
class ParallaxLayer {
    constructor(canvasWidth, canvasHeight, depth, color) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.depth = depth; // 0 = far, 1 = near
        this.color = color;
        this.offset = 0;
        this.speed = 0.2 * depth;
        this.elements = [];
        
        this.generateElements();
    }

    generateElements() {
        const count = Math.floor(5 + this.depth * 5);
        for (let i = 0; i < count; i++) {
            this.elements.push({
                x: Math.random() * this.canvasWidth * 2,
                y: this.canvasHeight * (0.5 + Math.random() * 0.5),
                width: 100 + Math.random() * 200 * (1 - this.depth * 0.5),
                height: 50 + Math.random() * 100 * (1 - this.depth * 0.5)
            });
        }
    }

    update() {
        this.offset -= this.speed;
        if (this.offset < -this.canvasWidth) {
            this.offset += this.canvasWidth;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.3 + this.depth * 0.3;
        
        this.elements.forEach(el => {
            const x = (el.x + this.offset) % (this.canvasWidth * 2) - this.canvasWidth * 0.5;
            
            // Draw mountain/hill shape
            ctx.beginPath();
            ctx.moveTo(x, this.canvasHeight);
            ctx.lineTo(x + el.width * 0.5, el.y);
            ctx.lineTo(x + el.width, this.canvasHeight);
            ctx.closePath();
            ctx.fill();
        });
        
        ctx.restore();
    }
}

// ===== DYNAMIC BACKGROUND MANAGER =====
class DynamicBackground {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.parallaxLayers = [];
        this.time = 0;
        this.currentPalette = null;
        
        this.initParallax();
    }

    initParallax() {
        this.parallaxLayers = [
            new ParallaxLayer(this.canvasWidth, this.canvasHeight, 0.2, 'rgba(100, 100, 150, 0.3)'),
            new ParallaxLayer(this.canvasWidth, this.canvasHeight, 0.5, 'rgba(80, 80, 120, 0.3)'),
            new ParallaxLayer(this.canvasWidth, this.canvasHeight, 0.8, 'rgba(60, 60, 100, 0.3)')
        ];
    }

    resize(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.initParallax();
    }

    update() {
        this.time += 0.01;
        this.parallaxLayers.forEach(layer => layer.update());
    }

    draw(ctx, enableParallax = false) {
        if (enableParallax) {
            this.parallaxLayers.forEach(layer => layer.draw(ctx));
        }
    }

    // Draw animated gradient background
    drawAnimatedGradient(ctx, colors, intensity = 0) {
        const time = this.time;
        
        // Create animated gradient
        const gradient = ctx.createLinearGradient(
            0, 0,
            this.canvasWidth * (0.5 + Math.sin(time) * 0.2),
            this.canvasHeight
        );
        
        gradient.addColorStop(0, colors[0]);
        gradient.addColorStop(1, colors[1]);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        
        // Add intensity overlay for frenzy/special modes
        if (intensity > 0) {
            ctx.save();
            ctx.globalAlpha = intensity * 0.3;
            ctx.fillStyle = `hsl(${(time * 100) % 360}, 70%, 50%)`;
            ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
            ctx.restore();
        }
    }
}

// ===== SCREEN EFFECT SYSTEM =====
class ScreenEffects {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.ripples = [];
        this.flashes = [];
        this.shockwaves = [];
    }

    resize(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
    }

    addRipple(x, y, color = 'rgba(255, 255, 255, 0.5)', maxRadius = 150) {
        this.ripples.push({
            x, y, color, maxRadius,
            radius: 0,
            opacity: 1,
            speed: 5
        });
    }

    addShockwave(x, y, color = 'rgba(255, 200, 100, 0.8)', maxRadius = 300) {
        this.shockwaves.push({
            x, y, color, maxRadius,
            radius: 0,
            opacity: 1,
            lineWidth: 10,
            speed: 15
        });
    }

    addFlash(color = 'rgba(255, 255, 255, 0.5)', duration = 0.2) {
        this.flashes.push({
            color,
            opacity: 1,
            decay: 1 / (duration * 60) // 60fps
        });
    }

    update() {
        // Update ripples
        for (let i = this.ripples.length - 1; i >= 0; i--) {
            const r = this.ripples[i];
            r.radius += r.speed;
            r.opacity = 1 - (r.radius / r.maxRadius);
            
            if (r.opacity <= 0) {
                this.ripples.splice(i, 1);
            }
        }
        
        // Update shockwaves
        for (let i = this.shockwaves.length - 1; i >= 0; i--) {
            const s = this.shockwaves[i];
            s.radius += s.speed;
            s.opacity = 1 - (s.radius / s.maxRadius);
            s.lineWidth = 10 * s.opacity;
            
            if (s.opacity <= 0) {
                this.shockwaves.splice(i, 1);
            }
        }
        
        // Update flashes
        for (let i = this.flashes.length - 1; i >= 0; i--) {
            const f = this.flashes[i];
            f.opacity -= f.decay;
            
            if (f.opacity <= 0) {
                this.flashes.splice(i, 1);
            }
        }
    }

    draw(ctx) {
        // Draw flashes (full screen)
        this.flashes.forEach(f => {
            ctx.save();
            ctx.globalAlpha = f.opacity;
            ctx.fillStyle = f.color;
            ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
            ctx.restore();
        });
        
        // Draw ripples
        this.ripples.forEach(r => {
            ctx.save();
            ctx.globalAlpha = r.opacity;
            ctx.strokeStyle = r.color;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        });
        
        // Draw shockwaves
        this.shockwaves.forEach(s => {
            ctx.save();
            ctx.globalAlpha = s.opacity;
            ctx.strokeStyle = s.color;
            ctx.lineWidth = s.lineWidth;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
            ctx.stroke();
            
            // Inner glow
            ctx.globalAlpha = s.opacity * 0.5;
            ctx.lineWidth = s.lineWidth * 2;
            ctx.stroke();
            ctx.restore();
        });
    }
}
