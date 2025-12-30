/**
 * Particle.js - Enhanced particle system with multiple types and effects
 */

class Particle {
    static TYPES = {
        star: 'star',
        confetti: 'confetti',
        sparkle: 'sparkle',
        heart: 'heart',
        bubble: 'bubble',
        coin: 'coin',
        fire: 'fire',
        ice: 'ice',
        lightning: 'lightning',
        smoke: 'smoke',
        ring: 'ring',
        trail: 'trail'
    };

    constructor(x, y, color, type = 'star', options = {}) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.type = type;
        
        // Base properties
        this.size = options.size || Math.random() * 8 + 4;
        this.speedX = options.speedX ?? (Math.random() - 0.5) * 10;
        this.speedY = options.speedY ?? (Math.random() - 0.5) * 10;
        this.gravity = options.gravity ?? 0.2;
        this.friction = options.friction ?? 0.95;
        this.opacity = 1;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.2;
        this.life = 1.0;
        this.decay = options.decay ?? (Math.random() * 0.02 + 0.01);
        
        // Type-specific initialization
        this.initTypeProperties(options);
    }

    initTypeProperties(options) {
        switch (this.type) {
            case 'fire':
                this.gravity = -0.1; // Fire rises
                this.decay = 0.03;
                this.speedY = -Math.random() * 3 - 2;
                this.hue = 30 + Math.random() * 30; // Orange-red
                break;
                
            case 'ice':
                this.gravity = 0.05;
                this.decay = 0.015;
                this.rotationSpeed = 0.05;
                break;
                
            case 'smoke':
                this.gravity = -0.05;
                this.decay = 0.008;
                this.friction = 0.98;
                this.size = Math.random() * 15 + 10;
                break;
                
            case 'bubble':
                this.gravity = -0.1;
                this.speedX = (Math.random() - 0.5) * 2;
                this.speedY = -Math.random() * 2 - 1;
                this.decay = 0.008;
                this.wobble = Math.random() * Math.PI * 2;
                this.wobbleSpeed = 0.1;
                break;
                
            case 'coin':
                this.gravity = 0.15;
                this.rotationSpeed = 0.2;
                this.decay = 0.01;
                break;
                
            case 'heart':
                this.gravity = 0.1;
                this.decay = 0.015;
                this.pulse = 0;
                this.pulseSpeed = 0.2;
                break;
                
            case 'lightning':
                this.branches = [];
                this.generateLightningBranches();
                this.decay = 0.1; // Fast
                break;
                
            case 'ring':
                this.innerRadius = this.size;
                this.outerRadius = this.size * 1.5;
                this.expandSpeed = options.expandSpeed || 3;
                this.decay = 0.025;
                break;
                
            case 'sparkle':
                this.twinkle = Math.random() * Math.PI * 2;
                this.twinkleSpeed = 0.3;
                break;
                
            case 'trail':
                this.tailLength = options.tailLength || 10;
                this.positions = [];
                this.decay = 0.02;
                break;
        }
    }

    generateLightningBranches() {
        const branchCount = Math.floor(Math.random() * 3) + 2;
        for (let i = 0; i < branchCount; i++) {
            const branch = [];
            let bx = 0, by = 0;
            const segments = Math.floor(Math.random() * 4) + 3;
            
            for (let j = 0; j < segments; j++) {
                bx += (Math.random() - 0.5) * 30;
                by += Math.random() * 20 + 10;
                branch.push({ x: bx, y: by });
            }
            this.branches.push(branch);
        }
    }

    update() {
        // Type-specific updates
        switch (this.type) {
            case 'bubble':
                this.wobble += this.wobbleSpeed;
                this.x += Math.sin(this.wobble) * 0.5;
                break;
                
            case 'heart':
                this.pulse += this.pulseSpeed;
                break;
                
            case 'ring':
                this.innerRadius += this.expandSpeed;
                this.outerRadius += this.expandSpeed * 1.2;
                break;
                
            case 'trail':
                this.positions.unshift({ x: this.x, y: this.y });
                if (this.positions.length > this.tailLength) {
                    this.positions.pop();
                }
                break;
                
            case 'fire':
                this.hue = Math.max(0, this.hue - 1);
                break;
        }
        
        // Physics
        this.speedX *= this.friction;
        this.speedY *= this.friction;
        this.speedY += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;
        this.life -= this.decay;
        this.opacity = Math.max(0, this.life);
    }

    draw(ctx) {
        if (this.opacity <= 0) return;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;
        
        switch (this.type) {
            case 'star':
                this.drawStar(ctx);
                break;
            case 'confetti':
                this.drawConfetti(ctx);
                break;
            case 'sparkle':
                this.drawSparkle(ctx);
                break;
            case 'heart':
                this.drawHeart(ctx);
                break;
            case 'bubble':
                this.drawBubble(ctx);
                break;
            case 'coin':
                this.drawCoin(ctx);
                break;
            case 'fire':
                this.drawFire(ctx);
                break;
            case 'ice':
                this.drawIce(ctx);
                break;
            case 'smoke':
                this.drawSmoke(ctx);
                break;
            case 'lightning':
                this.drawLightning(ctx);
                break;
            case 'ring':
                this.drawRing(ctx);
                break;
            case 'trail':
                this.drawTrail(ctx);
                break;
            default:
                this.drawStar(ctx);
        }

        ctx.restore();
    }

    drawStar(ctx) {
        ctx.fillStyle = this.color;
        this.drawStarShape(ctx, 0, 0, 5, this.size, this.size / 2);
    }

    drawStarShape(ctx, cx, cy, spikes, outerRadius, innerRadius) {
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;

        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        ctx.fill();
    }

    drawConfetti(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
    }

    drawSparkle(ctx) {
        const twinkleSize = this.size * (0.5 + Math.abs(Math.sin(this.twinkle)) * 0.5);
        this.twinkle += this.twinkleSpeed;
        
        ctx.fillStyle = this.color;
        ctx.beginPath();
        
        // Four-pointed sparkle
        ctx.moveTo(0, -twinkleSize);
        ctx.lineTo(twinkleSize * 0.3, 0);
        ctx.lineTo(0, twinkleSize);
        ctx.lineTo(-twinkleSize * 0.3, 0);
        ctx.closePath();
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(-twinkleSize, 0);
        ctx.lineTo(0, twinkleSize * 0.3);
        ctx.lineTo(twinkleSize, 0);
        ctx.lineTo(0, -twinkleSize * 0.3);
        ctx.closePath();
        ctx.fill();
    }

    drawHeart(ctx) {
        const pulseScale = 1 + Math.sin(this.pulse) * 0.2;
        const size = this.size * pulseScale;
        
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(0, size * 0.3);
        ctx.bezierCurveTo(-size, -size * 0.3, -size, -size, 0, -size * 0.5);
        ctx.bezierCurveTo(size, -size, size, -size * 0.3, 0, size * 0.3);
        ctx.fill();
    }

    drawBubble(ctx) {
        // Outer bubble
        const gradient = ctx.createRadialGradient(
            -this.size * 0.3, -this.size * 0.3, 0,
            0, 0, this.size
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(0.5, `${this.color}66`);
        gradient.addColorStop(1, `${this.color}22`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(-this.size * 0.3, -this.size * 0.3, this.size * 0.2, 0, Math.PI * 2);
        ctx.fill();
    }

    drawCoin(ctx) {
        // Coin body
        const gradient = ctx.createLinearGradient(-this.size, 0, this.size, 0);
        gradient.addColorStop(0, '#d4af37');
        gradient.addColorStop(0.3, '#ffd700');
        gradient.addColorStop(0.7, '#ffd700');
        gradient.addColorStop(1, '#b8860b');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size * Math.abs(Math.cos(this.rotation * 2)), 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Coin symbol
        if (Math.abs(Math.cos(this.rotation * 2)) > 0.3) {
            ctx.fillStyle = '#b8860b';
            ctx.font = `${this.size}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('$', 0, 0);
        }
    }

    drawFire(ctx) {
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
        gradient.addColorStop(0, `hsla(${this.hue + 30}, 100%, 90%, 1)`);
        gradient.addColorStop(0.4, `hsla(${this.hue}, 100%, 60%, 0.8)`);
        gradient.addColorStop(1, `hsla(${this.hue - 10}, 100%, 30%, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
    }

    drawIce(ctx) {
        ctx.strokeStyle = this.color || '#b3e5fc';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        
        // Snowflake pattern
        for (let i = 0; i < 6; i++) {
            ctx.save();
            ctx.rotate((Math.PI / 3) * i);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, -this.size);
            ctx.moveTo(0, -this.size * 0.6);
            ctx.lineTo(-this.size * 0.3, -this.size * 0.8);
            ctx.moveTo(0, -this.size * 0.6);
            ctx.lineTo(this.size * 0.3, -this.size * 0.8);
            ctx.stroke();
            ctx.restore();
        }
    }

    drawSmoke(ctx) {
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
        gradient.addColorStop(0, `rgba(100, 100, 100, ${this.opacity * 0.5})`);
        gradient.addColorStop(1, `rgba(100, 100, 100, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
    }

    drawLightning(ctx) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#00bfff';
        ctx.shadowBlur = 10;
        
        this.branches.forEach(branch => {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            branch.forEach(point => {
                ctx.lineTo(point.x, point.y);
            });
            ctx.stroke();
        });
        
        ctx.shadowBlur = 0;
    }

    drawRing(ctx) {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = (this.outerRadius - this.innerRadius);
        ctx.beginPath();
        ctx.arc(0, 0, (this.innerRadius + this.outerRadius) / 2, 0, Math.PI * 2);
        ctx.stroke();
    }

    drawTrail(ctx) {
        if (this.positions.length < 2) return;
        
        ctx.restore(); // Need to restore to draw at absolute positions
        ctx.save();
        
        for (let i = 1; i < this.positions.length; i++) {
            const pos = this.positions[i];
            const prevPos = this.positions[i - 1];
            const alpha = (1 - i / this.positions.length) * this.opacity;
            const width = (1 - i / this.positions.length) * this.size;
            
            ctx.strokeStyle = this.color;
            ctx.globalAlpha = alpha;
            ctx.lineWidth = width;
            ctx.lineCap = 'round';
            
            ctx.beginPath();
            ctx.moveTo(prevPos.x, prevPos.y);
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
        }
    }
}

// ===== PARTICLE EMITTER =====
class ParticleEmitter {
    constructor(x, y, options = {}) {
        this.x = x;
        this.y = y;
        this.particles = [];
        this.emitRate = options.emitRate || 5;
        this.particleType = options.particleType || 'star';
        this.colors = options.colors || ['#ff0000', '#00ff00', '#0000ff'];
        this.isActive = true;
        this.duration = options.duration || Infinity;
        this.elapsed = 0;
        this.options = options;
    }

    emit() {
        if (!this.isActive) return;
        
        for (let i = 0; i < this.emitRate; i++) {
            const color = this.colors[Math.floor(Math.random() * this.colors.length)];
            const particle = new Particle(this.x, this.y, color, this.particleType, this.options);
            this.particles.push(particle);
        }
    }

    update(deltaTime = 16) {
        this.elapsed += deltaTime;
        
        if (this.elapsed >= this.duration) {
            this.isActive = false;
        }
        
        // Update particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update();
            if (this.particles[i].opacity <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    draw(ctx) {
        this.particles.forEach(p => p.draw(ctx));
    }

    isDead() {
        return !this.isActive && this.particles.length === 0;
    }
}

// ===== PARTICLE PRESETS =====
class ParticlePresets {
    static explosion(x, y, color, count = 20) {
        const particles = [];
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = 5 + Math.random() * 5;
            particles.push(new Particle(x, y, color, 'star', {
                speedX: Math.cos(angle) * speed,
                speedY: Math.sin(angle) * speed
            }));
        }
        return particles;
    }

    static confettiBurst(x, y, count = 30) {
        const particles = [];
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        for (let i = 0; i < count; i++) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            particles.push(new Particle(x, y, color, 'confetti', {
                speedX: (Math.random() - 0.5) * 15,
                speedY: (Math.random() - 0.5) * 15 - 5,
                gravity: 0.3
            }));
        }
        return particles;
    }

    static coinShower(x, y, count = 15) {
        const particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(new Particle(x, y, '#ffd700', 'coin', {
                speedX: (Math.random() - 0.5) * 10,
                speedY: -Math.random() * 10 - 5,
                gravity: 0.25,
                size: 8 + Math.random() * 6
            }));
        }
        return particles;
    }

    static fireEffect(x, y, count = 10) {
        const particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(new Particle(x, y, '#ff4500', 'fire', {
                speedX: (Math.random() - 0.5) * 4,
                speedY: -Math.random() * 5 - 3,
                size: 10 + Math.random() * 10
            }));
        }
        return particles;
    }

    static iceShatter(x, y, count = 15) {
        const particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(new Particle(x, y, '#b3e5fc', 'ice', {
                speedX: (Math.random() - 0.5) * 12,
                speedY: (Math.random() - 0.5) * 12,
                size: 8 + Math.random() * 8,
                gravity: 0.1
            }));
        }
        return particles;
    }

    static heartBurst(x, y, count = 12) {
        const particles = [];
        const colors = ['#ff69b4', '#ff1493', '#ff6b6b', '#ee82ee'];
        for (let i = 0; i < count; i++) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            particles.push(new Particle(x, y, color, 'heart', {
                speedX: (Math.random() - 0.5) * 8,
                speedY: -Math.random() * 8 - 2,
                size: 8 + Math.random() * 6
            }));
        }
        return particles;
    }

    static sparkleCloud(x, y, count = 20) {
        const particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(new Particle(x, y, '#ffffff', 'sparkle', {
                speedX: (Math.random() - 0.5) * 6,
                speedY: (Math.random() - 0.5) * 6,
                size: 4 + Math.random() * 6,
                decay: 0.02
            }));
        }
        return particles;
    }

    static bubbleFloat(x, y, count = 8) {
        const particles = [];
        const colors = ['#87ceeb', '#add8e6', '#b0e0e6', '#afeeee'];
        for (let i = 0; i < count; i++) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            particles.push(new Particle(x, y, color, 'bubble', {
                speedX: (Math.random() - 0.5) * 3,
                speedY: -Math.random() * 2 - 1,
                size: 8 + Math.random() * 12
            }));
        }
        return particles;
    }

    static lightningStrike(x, y) {
        return [new Particle(x, y, '#00bfff', 'lightning', {
            size: 30
        })];
    }

    static smokeCloud(x, y, count = 8) {
        const particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(new Particle(x, y, '#666666', 'smoke', {
                speedX: (Math.random() - 0.5) * 2,
                speedY: -Math.random() * 2 - 0.5,
                size: 15 + Math.random() * 20
            }));
        }
        return particles;
    }

    static ringExpand(x, y, color = '#ffffff') {
        return [new Particle(x, y, color, 'ring', {
            size: 10,
            expandSpeed: 5
        })];
    }

    static bossDefeated(x, y) {
        const particles = [];
        
        // Big explosion
        particles.push(...this.explosion(x, y, '#ff0000', 30));
        
        // Confetti
        particles.push(...this.confettiBurst(x, y, 40));
        
        // Coin shower
        particles.push(...this.coinShower(x, y, 20));
        
        // Sparkles
        particles.push(...this.sparkleCloud(x, y, 30));
        
        // Ring shockwave
        particles.push(...this.ringExpand(x, y, '#ffd700'));
        
        return particles;
    }

    static mysteryReveal(x, y, effectType) {
        const particles = [];
        
        switch (effectType) {
            case 'coins':
                particles.push(...this.coinShower(x, y, 25));
                break;
            case 'powerup':
                particles.push(...this.sparkleCloud(x, y, 25));
                particles.push(...this.ringExpand(x, y, '#9c27b0'));
                break;
            case 'bomb_swarm':
                particles.push(...this.smokeCloud(x, y, 15));
                particles.push(...this.fireEffect(x, y, 10));
                break;
            case 'freeze_all':
                particles.push(...this.iceShatter(x, y, 25));
                break;
            case 'mega_chain':
                particles.push(...this.lightningStrike(x, y));
                particles.push(...this.sparkleCloud(x, y, 20));
                break;
            default:
                particles.push(...this.confettiBurst(x, y, 20));
        }
        
        return particles;
    }

    static colorMatchChain(x, y, color, chainLength) {
        const particles = [];
        const count = 10 + chainLength * 5;
        
        for (let i = 0; i < count; i++) {
            particles.push(new Particle(x, y, color, 'star', {
                speedX: (Math.random() - 0.5) * (8 + chainLength),
                speedY: (Math.random() - 0.5) * (8 + chainLength),
                size: 6 + Math.random() * 4 + chainLength
            }));
        }
        
        // Ring for big chains
        if (chainLength >= 3) {
            particles.push(...this.ringExpand(x, y, color));
        }
        
        return particles;
    }
}

// ===== TEXT PARTICLE (for floating score/coin text) =====
class TextParticle {
    constructor(x, y, text, options = {}) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.color = options.color || '#ffffff';
        this.fontSize = options.fontSize || 24;
        this.fontWeight = options.fontWeight || 'bold';
        this.speedY = options.speedY || -2;
        this.opacity = 1;
        this.decay = options.decay || 0.02;
        this.scale = options.scale || 1;
        this.scaleSpeed = options.scaleSpeed || 0;
        this.shadow = options.shadow || false;
        this.shadowColor = options.shadowColor || 'rgba(0,0,0,0.5)';
    }

    update() {
        this.y += this.speedY;
        this.opacity -= this.decay;
        this.scale += this.scaleSpeed;
    }

    draw(ctx) {
        if (this.opacity <= 0) return;
        
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.font = `${this.fontWeight} ${this.fontSize * this.scale}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        if (this.shadow) {
            ctx.shadowColor = this.shadowColor;
            ctx.shadowBlur = 4;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
        }
        
        ctx.fillStyle = this.color;
        ctx.fillText(this.text, this.x, this.y);
        ctx.restore();
    }
}
