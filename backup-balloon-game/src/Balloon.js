/**
 * Balloon Types:
 * - normal: Standard balloon (+1 point)
 * - glitter: Gold balloon (+5 points)
 * - bomb: Black skull balloon (game over/life lost)
 * - freeze: Blue ice balloon (slows all balloons 3s)
 * - time: Green clock balloon (+5 seconds)
 * - mega: Rainbow balloon (chain pops nearby)
 * 
 * RARE BALLOONS (collectible!):
 * - rainbow: Prismatic shimmer (1% spawn, 50 coins)
 * - star: Golden sparkling star (0.5% spawn, 100 coins)
 * - alien: Green with eyes (0.3% spawn, 200 coins)
 * - unicorn: Magical pink (0.1% spawn, 500 coins)
 * - diamond: Crystal blue (0.05% spawn, 1000 coins)
 * 
 * NEW SPECIAL BALLOONS:
 * - boss: Giant balloon that takes multiple hits (spawns every 50 pops)
 * - mystery: "?" balloon with random effects
 * - armored: Has a shield, requires 2 hits
 * - ghost: Phases in and out, tricky to hit
 * - tiny: Small and fast, bonus points
 * - giant: Huge and slow, lots of points
 * - golden: Rare golden balloon, massive coin reward
 * - chain: Triggers chain reaction of same-colored balloons
 */
class Balloon {
    static TYPES = {
        normal: { weight: 60 },
        glitter: { weight: 10 },
        bomb: { weight: 7 },
        freeze: { weight: 4 },
        time: { weight: 3 },
        mega: { weight: 2 },
        // New special types
        mystery: { weight: 2 },
        armored: { weight: 3 },
        ghost: { weight: 2 },
        tiny: { weight: 3 },
        giant: { weight: 1.5 },
        chain: { weight: 1.5 },
        golden: { weight: 0.5 },
        // RARE BALLOONS - very low spawn rates!
        rainbow: { weight: 1.0 },
        star: { weight: 0.5 },
        alien: { weight: 0.3 },
        unicorn: { weight: 0.1 },
        diamond: { weight: 0.05 }
    };

    static TYPE_COLORS = {
        bomb: { main: '#2d2d2d', highlight: '#4a4a4a', icon: '💀' },
        freeze: { main: '#4fc3f7', highlight: '#b3e5fc', icon: '❄️' },
        time: { main: '#66bb6a', highlight: '#a5d6a7', icon: '⏰' },
        mega: { main: '#ff6fd8', highlight: '#ffc1e3', icon: '💥' },
        // New special types
        mystery: { main: '#9c27b0', highlight: '#e1bee7', icon: '❓' },
        armored: { main: '#78909c', highlight: '#cfd8dc', icon: '🛡️' },
        ghost: { main: '#e0e0e0', highlight: '#ffffff', icon: '👻' },
        tiny: { main: '#ffeb3b', highlight: '#fff9c4', icon: '⚡' },
        giant: { main: '#ff5722', highlight: '#ffccbc', icon: '🎪' },
        chain: { main: '#00bcd4', highlight: '#b2ebf2', icon: '⛓️' },
        golden: { main: '#ffd700', highlight: '#fff8e1', icon: '🌟' },
        boss: { main: '#880e4f', highlight: '#f8bbd9', icon: '👹' },
        // Rare balloon colors
        rainbow: { main: '#ff6fd8', highlight: '#ffffff', icon: '🌈' },
        star: { main: '#ffd700', highlight: '#fffacd', icon: '⭐' },
        alien: { main: '#32cd32', highlight: '#90ee90', icon: '👽' },
        unicorn: { main: '#ff69b4', highlight: '#ffb6c1', icon: '🦄' },
        diamond: { main: '#00bfff', highlight: '#e0ffff', icon: '💎' }
    };

    // List of rare balloon types for collection tracking
    static RARE_TYPES = ['rainbow', 'star', 'alien', 'unicorn', 'diamond'];
    
    // Special types that have unique behaviors
    static SPECIAL_BEHAVIOR_TYPES = ['boss', 'mystery', 'armored', 'ghost', 'tiny', 'giant', 'chain', 'golden'];

    // Colorblind-friendly patterns
    static COLORBLIND_PATTERNS = {
        normal: 'solid',
        glitter: 'dots',
        bomb: 'crosshatch',
        freeze: 'horizontal',
        time: 'vertical',
        mega: 'diagonal',
        mystery: 'question',
        armored: 'shield',
        ghost: 'waves',
        tiny: 'zigzag',
        giant: 'circles',
        chain: 'links',
        golden: 'stars',
        boss: 'skull',
        rainbow: 'rainbow',
        star: 'star',
        alien: 'eyes',
        unicorn: 'horn',
        diamond: 'gem'
    };

    constructor(canvasWidth, canvasHeight, colorIndex, palette, allowedTypes = null, forceType = null) {
        // Determine balloon type based on weighted random or forced type
        this.balloonType = forceType || this.pickType(allowedTypes);

        // Use provided palette or default
        const colors = palette || [
            { main: '#ff5e5e', highlight: '#ff9a9a' },
            { main: '#ffcc33', highlight: '#fff29a' },
            { main: '#5edfff', highlight: '#9aecff' },
            { main: '#ff8a5e', highlight: '#ffbc9a' },
            { main: '#a25eff', highlight: '#ca9aff' },
            { main: '#5effb1', highlight: '#9affd4' }
        ];

        // Store color index for chain combo detection
        this.colorIndex = colorIndex % colors.length;

        // Set color based on type
        if (this.balloonType === 'glitter') {
            this.color = { main: '#ffd700', highlight: '#fff8dc' };
        } else if (Balloon.TYPE_COLORS[this.balloonType]) {
            this.color = Balloon.TYPE_COLORS[this.balloonType];
        } else {
            this.color = colors[this.colorIndex];
        }

        this.isGlitter = this.balloonType === 'glitter';
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        // Size varies by type
        this.baseRadius = this.calculateBaseRadius();
        this.radius = this.baseRadius;
        
        // Position
        this.x = Math.random() * (canvasWidth - this.radius * 2) + this.radius;
        this.y = canvasHeight + this.radius * 2;

        // Speed varies by type
        this.baseSpeed = this.calculateBaseSpeed();
        this.currentSpeed = this.baseSpeed;

        // Movement patterns
        this.sineFreq = Math.random() * 0.015 + 0.008;
        this.sineAmp = Math.random() * 30 + 15;
        this.time = Math.random() * 100;

        // State
        this.isPopping = false;
        this.popScale = 1;
        this.opacity = 1;
        this.faceState = 'normal';

        // Physics
        this.jiggle = 0;
        this.jiggleVelocity = 0;
        this.jiggleDamping = 0.9;
        this.jiggleSpring = 0.1;

        // Visual effects
        this.hasGlow = this.isSpecial();
        this.trail = []; // For special balloon trails
        this.trailEnabled = this.shouldHaveTrail();

        // Special type properties
        this.initSpecialProperties();
    }

    calculateBaseRadius() {
        switch (this.balloonType) {
            case 'boss': return 120 + Math.random() * 30; // Huge!
            case 'giant': return 80 + Math.random() * 20;
            case 'tiny': return 25 + Math.random() * 8;
            default: return Math.random() * 12 + (this.isSpecial() ? 55 : 48);
        }
    }

    calculateBaseSpeed() {
        switch (this.balloonType) {
            case 'bomb': return Math.random() * 0.9 + 1.8; // Fast - harder to avoid
            case 'time': return Math.random() * 0.8 + 1.7; // Fast - grab it quick
            case 'tiny': return Math.random() * 1.5 + 2.5; // Very fast!
            case 'giant': return Math.random() * 0.3 + 0.6; // Slow
            case 'boss': return Math.random() * 0.2 + 0.4; // Very slow
            case 'ghost': return Math.random() * 0.8 + 1.2; // Medium
            case 'golden': return Math.random() * 1.2 + 2.0; // Fast - valuable!
            default: return Math.random() * 1.0 + 1.3; // Normal: 1.3-2.3
        }
    }

    initSpecialProperties() {
        // Boss balloon properties
        if (this.balloonType === 'boss') {
            this.maxHealth = 5;
            this.health = this.maxHealth;
            this.isEnraged = false;
            this.enrageThreshold = 2;
        }

        // Armored balloon properties
        if (this.balloonType === 'armored') {
            this.armorHealth = 1; // One hit removes armor
            this.hasArmor = true;
        }

        // Ghost balloon properties
        if (this.balloonType === 'ghost') {
            this.ghostPhase = 0;
            this.isVisible = true;
            this.phaseSpeed = 0.03 + Math.random() * 0.02;
        }

        // Mystery balloon - pre-determine the effect
        if (this.balloonType === 'mystery') {
            const effects = ['coins', 'powerup', 'bomb_swarm', 'point_burst', 'freeze_all', 'double_spawn', 'mega_chain'];
            this.mysteryEffect = effects[Math.floor(Math.random() * effects.length)];
        }

        // Chain balloon - determine chain color
        if (this.balloonType === 'chain') {
            this.chainColor = this.colorIndex;
        }
    }

    shouldHaveTrail() {
        return ['rainbow', 'star', 'diamond', 'unicorn', 'golden', 'boss', 'ghost'].includes(this.balloonType);
    }

    pickType(allowedTypes) {
        const types = allowedTypes || Object.keys(Balloon.TYPES);
        const weights = types.map(t => Balloon.TYPES[t]?.weight || 0);
        const total = weights.reduce((a, b) => a + b, 0);
        let rand = Math.random() * total;

        for (let i = 0; i < types.length; i++) {
            rand -= weights[i];
            if (rand <= 0) return types[i];
        }
        return 'normal';
    }

    isSpecial() {
        return this.balloonType !== 'normal';
    }

    isBomb() {
        return this.balloonType === 'bomb';
    }

    isRare() {
        return Balloon.RARE_TYPES.includes(this.balloonType);
    }

    isBoss() {
        return this.balloonType === 'boss';
    }

    isGhost() {
        return this.balloonType === 'ghost';
    }

    // Handle hit - returns true if balloon should pop, false if it survives
    handleHit() {
        // Boss balloon - takes multiple hits
        if (this.balloonType === 'boss') {
            this.health--;
            this.jiggleVelocity = 0.5; // Big jiggle on hit
            
            // Enrage when low health
            if (this.health <= this.enrageThreshold && !this.isEnraged) {
                this.isEnraged = true;
                this.baseSpeed *= 1.5;
            }
            
            return this.health <= 0;
        }

        // Armored balloon - first hit removes armor
        if (this.balloonType === 'armored' && this.hasArmor) {
            this.hasArmor = false;
            this.armorHealth = 0;
            this.jiggleVelocity = 0.4;
            return false; // Survives first hit
        }

        // All other balloons pop on hit
        return true;
    }

    update() {
        if (this.isPopping) {
            this.popScale += 0.2;
            this.opacity -= 0.15;
            this.faceState = this.balloonType === 'bomb' ? 'normal' : 'scared';
            return;
        }

        this.time += 0.04;

        // Ghost phasing
        if (this.balloonType === 'ghost') {
            this.ghostPhase += this.phaseSpeed;
            this.opacity = 0.3 + Math.abs(Math.sin(this.ghostPhase)) * 0.7;
            this.isVisible = this.opacity > 0.5;
        }

        // Boss enrage visual pulse
        if (this.balloonType === 'boss' && this.isEnraged) {
            this.radius = this.baseRadius * (1 + Math.sin(this.time * 5) * 0.05);
        }

        // Movement
        this.y -= this.currentSpeed;
        
        // Different movement patterns
        if (this.balloonType === 'ghost') {
            // Erratic movement
            this.x += Math.sin(this.time * this.sineFreq * 3) * 1.5;
        } else if (this.balloonType === 'boss') {
            // Slow, menacing side-to-side
            this.x += Math.sin(this.time * 0.02) * 0.8;
        } else {
            // Normal sine wave
            this.x += Math.sin(this.time * this.sineFreq) * 0.4;
        }

        // Clamp x position
        const minX = this.radius;
        const maxX = this.canvasWidth - this.radius;
        if (this.x < minX) this.x = minX;
        if (this.x > maxX) this.x = maxX;

        // Jiggle physics
        const force = -this.jiggleSpring * this.jiggle;
        this.jiggleVelocity += force;
        this.jiggleVelocity *= this.jiggleDamping;
        this.jiggle += this.jiggleVelocity;
        this.jiggle = Math.max(-0.8, Math.min(0.8, this.jiggle));

        // Update trail
        if (this.trailEnabled) {
            this.trail.push({ x: this.x, y: this.y, age: 0 });
            if (this.trail.length > 15) this.trail.shift();
            this.trail.forEach(p => p.age++);
        }
    }

    reactToCursor(mx, my) {
        if (this.isPopping) return;
        const dx = this.x - mx;
        const dy = this.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
            this.faceState = dist < 70 ? 'scared' : 'surprised';
            this.jiggleVelocity += 0.01;
        } else {
            this.faceState = 'normal';
        }
    }

    applyImpact() {
        this.jiggleVelocity = 0.3;
    }

    draw(ctx) {
        if (this.opacity <= 0) return;

        // Draw trail first (behind balloon)
        if (this.trailEnabled && this.trail.length > 1) {
            this.drawTrail(ctx);
        }

        const jiggleX = Math.max(0.2, 1 + this.jiggle);
        const jiggleY = Math.max(0.2, 1 - this.jiggle);
        const currentRadiusX = this.radius * jiggleX * this.popScale;
        const currentRadiusY = this.radius * jiggleY * this.popScale;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.globalAlpha = this.opacity;

        // Draw String
        ctx.beginPath();
        ctx.moveTo(0, currentRadiusY);
        ctx.quadraticCurveTo(
            Math.sin(this.time * 2) * 5, currentRadiusY + 15,
            Math.sin(this.time) * 3, currentRadiusY + 40
        );
        ctx.strokeStyle = this.balloonType === 'bomb' ? 'rgba(100,100,100,0.6)' : 'rgba(255,255,255,0.6)';
        ctx.setLineDash([2, 2]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw Balloon Body
        let gradient = ctx.createRadialGradient(
            -currentRadiusX * 0.2, -currentRadiusY * 0.2, currentRadiusX * 0.1,
            0, 0, currentRadiusX
        );

        // Set gradient based on balloon type
        this.setGradient(gradient, currentRadiusX);

        ctx.beginPath();
        ctx.ellipse(0, 0, currentRadiusX, currentRadiusY, 0, 0, Math.PI * 2);
        ctx.fillStyle = gradient;

        // Glow effect
        this.applyGlow(ctx);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';

        // Draw armor for armored balloons
        if (this.balloonType === 'armored' && this.hasArmor) {
            this.drawArmor(ctx, currentRadiusX, currentRadiusY);
        }

        // Draw boss health bar
        if (this.balloonType === 'boss') {
            this.drawHealthBar(ctx, currentRadiusX);
        }

        // Sparkles for special balloons
        if (this.isSpecial() && this.balloonType !== 'bomb') {
            ctx.save();
            for (let i = 0; i < 3; i++) {
                const sx = (Math.random() - 0.5) * currentRadiusX * 1.5;
                const sy = (Math.random() - 0.5) * currentRadiusY * 1.5;
                ctx.fillStyle = '#ffffff';
                ctx.globalAlpha = Math.random() * 0.8 + 0.2;
                ctx.fillRect(sx, sy, 3, 3);
            }
            ctx.restore();
        }

        // Glossy Shimmer
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.ellipse(
            -currentRadiusX * 0.35, -currentRadiusY * 0.35,
            currentRadiusX * 0.2, currentRadiusY * 0.15,
            Math.PI / 4, 0, Math.PI * 2
        );
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.fill();

        // Draw icon for special balloons OR face for normal
        const typeInfo = Balloon.TYPE_COLORS[this.balloonType];
        if (typeInfo && typeInfo.icon) {
            ctx.font = `${currentRadiusX * 0.6}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(typeInfo.icon, 0, 0);
        } else {
            this.drawFace(ctx, currentRadiusX);
        }

        ctx.restore();
    }

    setGradient(gradient, currentRadiusX) {
        switch (this.balloonType) {
            case 'mega':
                gradient.addColorStop(0, '#ffffff');
                gradient.addColorStop(0.3, '#ff6fd8');
                gradient.addColorStop(0.6, '#c471ed');
                gradient.addColorStop(1, '#12c2e9');
                break;
            case 'glitter':
                gradient.addColorStop(0, '#ffffff');
                gradient.addColorStop(0.3, '#ffed4a');
                gradient.addColorStop(1, '#d4af37');
                break;
            case 'rainbow':
                const shift = (Math.sin(this.time * 3) + 1) / 2;
                gradient.addColorStop(0, '#ffffff');
                gradient.addColorStop(0.2, `hsl(${(shift * 360) % 360}, 100%, 70%)`);
                gradient.addColorStop(0.5, `hsl(${(shift * 360 + 120) % 360}, 100%, 60%)`);
                gradient.addColorStop(1, `hsl(${(shift * 360 + 240) % 360}, 100%, 50%)`);
                break;
            case 'star':
                gradient.addColorStop(0, '#ffffff');
                gradient.addColorStop(0.2, '#fff8dc');
                gradient.addColorStop(0.5, '#ffd700');
                gradient.addColorStop(1, '#daa520');
                break;
            case 'alien':
                gradient.addColorStop(0, '#ffffff');
                gradient.addColorStop(0.3, '#90ee90');
                gradient.addColorStop(0.7, '#32cd32');
                gradient.addColorStop(1, '#228b22');
                break;
            case 'unicorn':
                gradient.addColorStop(0, '#ffffff');
                gradient.addColorStop(0.2, '#ffb6c1');
                gradient.addColorStop(0.5, '#ff69b4');
                gradient.addColorStop(1, '#da70d6');
                break;
            case 'diamond':
                gradient.addColorStop(0, '#ffffff');
                gradient.addColorStop(0.2, '#e0ffff');
                gradient.addColorStop(0.5, '#00bfff');
                gradient.addColorStop(1, '#1e90ff');
                break;
            case 'boss':
                const pulse = this.isEnraged ? Math.sin(this.time * 10) * 0.3 + 0.7 : 1;
                gradient.addColorStop(0, '#ffffff');
                gradient.addColorStop(0.2, `rgba(255, ${Math.floor(100 * pulse)}, ${Math.floor(150 * pulse)}, 1)`);
                gradient.addColorStop(0.5, '#880e4f');
                gradient.addColorStop(1, this.isEnraged ? '#ff0000' : '#4a0028');
                break;
            case 'ghost':
                gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
                gradient.addColorStop(0.5, 'rgba(200, 200, 220, 0.7)');
                gradient.addColorStop(1, 'rgba(150, 150, 180, 0.5)');
                break;
            case 'mystery':
                const hue = (this.time * 50) % 360;
                gradient.addColorStop(0, '#ffffff');
                gradient.addColorStop(0.3, `hsl(${hue}, 70%, 70%)`);
                gradient.addColorStop(1, `hsl(${hue + 60}, 70%, 40%)`);
                break;
            case 'golden':
                gradient.addColorStop(0, '#ffffff');
                gradient.addColorStop(0.2, '#fff8dc');
                gradient.addColorStop(0.4, '#ffd700');
                gradient.addColorStop(0.7, '#ffaa00');
                gradient.addColorStop(1, '#ff8c00');
                break;
            case 'armored':
                if (this.hasArmor) {
                    gradient.addColorStop(0, '#e0e0e0');
                    gradient.addColorStop(0.5, '#9e9e9e');
                    gradient.addColorStop(1, '#616161');
                } else {
                    gradient.addColorStop(0, this.color.highlight);
                    gradient.addColorStop(1, this.color.main);
                }
                break;
            case 'chain':
                gradient.addColorStop(0, '#ffffff');
                gradient.addColorStop(0.3, '#4dd0e1');
                gradient.addColorStop(0.6, '#00bcd4');
                gradient.addColorStop(1, '#0097a7');
                break;
            default:
                gradient.addColorStop(0, this.color.highlight);
                gradient.addColorStop(1, this.color.main);
        }
    }

    applyGlow(ctx) {
        if (this.hasGlow) {
            ctx.shadowBlur = 25;
            switch (this.balloonType) {
                case 'bomb':
                    ctx.shadowColor = 'rgba(255, 0, 0, 0.6)';
                    break;
                case 'freeze':
                    ctx.shadowColor = 'rgba(79, 195, 247, 0.8)';
                    break;
                case 'time':
                    ctx.shadowColor = 'rgba(102, 187, 106, 0.8)';
                    break;
                case 'mega':
                    ctx.shadowColor = 'rgba(255, 111, 216, 0.8)';
                    break;
                case 'rainbow':
                    const hue = ((this.time * 100) % 360);
                    ctx.shadowColor = `hsla(${hue}, 100%, 60%, 0.9)`;
                    ctx.shadowBlur = 35;
                    break;
                case 'star':
                    ctx.shadowColor = 'rgba(255, 215, 0, 0.9)';
                    ctx.shadowBlur = 30;
                    break;
                case 'alien':
                    ctx.shadowColor = 'rgba(50, 205, 50, 0.9)';
                    ctx.shadowBlur = 30;
                    break;
                case 'unicorn':
                    ctx.shadowColor = 'rgba(255, 105, 180, 0.9)';
                    ctx.shadowBlur = 35;
                    break;
                case 'diamond':
                    ctx.shadowColor = 'rgba(0, 191, 255, 0.95)';
                    ctx.shadowBlur = 40;
                    break;
                case 'boss':
                    ctx.shadowColor = this.isEnraged ? 'rgba(255, 0, 0, 0.9)' : 'rgba(136, 14, 79, 0.8)';
                    ctx.shadowBlur = 50;
                    break;
                case 'ghost':
                    ctx.shadowColor = 'rgba(200, 200, 255, 0.6)';
                    ctx.shadowBlur = 20;
                    break;
                case 'mystery':
                    const mysteryHue = (this.time * 100) % 360;
                    ctx.shadowColor = `hsla(${mysteryHue}, 80%, 50%, 0.8)`;
                    ctx.shadowBlur = 30;
                    break;
                case 'golden':
                    ctx.shadowColor = 'rgba(255, 200, 0, 1)';
                    ctx.shadowBlur = 45;
                    break;
                case 'chain':
                    ctx.shadowColor = 'rgba(0, 188, 212, 0.8)';
                    ctx.shadowBlur = 25;
                    break;
                default:
                    ctx.shadowColor = 'rgba(255, 237, 74, 0.8)';
            }
        } else {
            ctx.shadowBlur = 15;
            ctx.shadowColor = 'rgba(0,0,0,0.1)';
        }
    }

    drawTrail(ctx) {
        ctx.save();
        for (let i = 0; i < this.trail.length - 1; i++) {
            const p = this.trail[i];
            const alpha = (1 - p.age / 20) * 0.5;
            if (alpha <= 0) continue;

            ctx.globalAlpha = alpha;
            ctx.beginPath();
            
            if (this.balloonType === 'rainbow' || this.balloonType === 'golden') {
                const hue = (this.time * 100 + i * 20) % 360;
                ctx.fillStyle = `hsl(${hue}, 80%, 60%)`;
            } else if (this.balloonType === 'ghost') {
                ctx.fillStyle = 'rgba(200, 200, 255, 0.5)';
            } else {
                ctx.fillStyle = this.color.highlight || '#ffffff';
            }
            
            const size = (this.radius * 0.3) * (1 - i / this.trail.length);
            ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }

    drawArmor(ctx, radiusX, radiusY) {
        ctx.save();
        ctx.strokeStyle = '#455a64';
        ctx.lineWidth = 4;
        ctx.setLineDash([8, 4]);
        ctx.beginPath();
        ctx.ellipse(0, 0, radiusX + 5, radiusY + 5, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Shield icon on armor
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.font = `${radiusX * 0.3}px Arial`;
        ctx.fillText('🛡️', -radiusX * 0.6, -radiusY * 0.3);
        ctx.restore();
    }

    drawHealthBar(ctx, radiusX) {
        const barWidth = radiusX * 1.5;
        const barHeight = 10;
        const barY = -this.radius - 25;
        
        // Background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(-barWidth / 2, barY, barWidth, barHeight);
        
        // Health fill
        const healthPercent = this.health / this.maxHealth;
        const healthColor = this.isEnraged ? '#ff0000' : (healthPercent > 0.5 ? '#4caf50' : '#ff9800');
        ctx.fillStyle = healthColor;
        ctx.fillRect(-barWidth / 2, barY, barWidth * healthPercent, barHeight);
        
        // Border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(-barWidth / 2, barY, barWidth, barHeight);
        
        // Health text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${this.health}/${this.maxHealth}`, 0, barY - 5);
    }

    drawFace(ctx, currentRadiusX) {
        const eyeSize = currentRadiusX * 0.1;
        const eyeOffset = currentRadiusX * 0.3;
        ctx.fillStyle = '#444';

        if (this.faceState === 'normal') {
            ctx.beginPath(); ctx.arc(-eyeOffset, -5, eyeSize, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(eyeOffset, -5, eyeSize, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(0, 5, eyeSize * 1.5, 0.2, Math.PI - 0.2);
            ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.strokeStyle = '#444'; ctx.stroke();
        } else if (this.faceState === 'surprised') {
            ctx.beginPath(); ctx.arc(-eyeOffset, -5, eyeSize * 1.4, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(eyeOffset, -5, eyeSize * 1.4, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.ellipse(0, 8, eyeSize * 0.8, eyeSize * 1.4, 0, 0, Math.PI * 2); ctx.fill();
        } else if (this.faceState === 'scared') {
            ctx.lineWidth = 3; ctx.strokeStyle = '#444';
            this.drawX(ctx, -eyeOffset, -5, eyeSize);
            this.drawX(ctx, eyeOffset, -5, eyeSize);
            ctx.beginPath(); ctx.moveTo(-eyeSize, 12); ctx.bezierCurveTo(-eyeSize / 2, 8, eyeSize / 2, 16, eyeSize, 12); ctx.stroke();
        }
    }

    drawX(ctx, x, y, s) {
        ctx.beginPath(); ctx.moveTo(x - s, y - s); ctx.lineTo(x + s, y + s); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x + s, y - s); ctx.lineTo(x - s, y + s); ctx.stroke();
    }

    isHit(mx, my) {
        // Ghost balloons can only be hit when visible
        if (this.balloonType === 'ghost' && !this.isVisible) {
            return false;
        }

        const jiggleX = Math.max(0.2, 1 + this.jiggle);
        const jiggleY = Math.max(0.2, 1 - this.jiggle);
        const dx = (mx - this.x) / jiggleX;
        const dy = (my - this.y) / jiggleY;
        return (dx * dx + dy * dy) <= (this.radius * this.radius);
    }

    // Get points for this balloon type
    getPoints() {
        switch (this.balloonType) {
            case 'glitter': return 5;
            case 'mega': return 3;
            case 'freeze': return 2;
            case 'time': return 2;
            case 'tiny': return 8; // Small but valuable!
            case 'giant': return 15;
            case 'boss': return 100; // Big reward for defeating boss
            case 'armored': return 5;
            case 'ghost': return 10; // Tricky to hit
            case 'mystery': return 3;
            case 'chain': return 2;
            case 'golden': return 25;
            // Rare balloons
            case 'rainbow': return 10;
            case 'star': return 10;
            case 'alien': return 15;
            case 'unicorn': return 25;
            case 'diamond': return 50;
            default: return 1;
        }
    }

    // Get coins for this balloon type
    getCoins() {
        switch (this.balloonType) {
            case 'glitter': return 2;
            case 'mega': return 1;
            case 'freeze': return 1;
            case 'time': return 1;
            case 'tiny': return 3;
            case 'giant': return 8;
            case 'boss': return 50; // Big coin reward!
            case 'armored': return 3;
            case 'ghost': return 5;
            case 'mystery': return 0; // Effect determines reward
            case 'chain': return 1;
            case 'golden': return 75; // Jackpot!
            // Rare balloons - big rewards!
            case 'rainbow': return 50;
            case 'star': return 100;
            case 'alien': return 200;
            case 'unicorn': return 500;
            case 'diamond': return 1000;
            default: return 0;
        }
    }

    // Get the mystery effect for mystery balloons
    getMysteryEffect() {
        return this.mysteryEffect;
    }
}

// Boss Balloon Factory - creates boss balloons with specific configurations
class BossBalloon {
    static BOSS_TYPES = [
        { name: 'Balloon King', health: 5, size: 1.0, speed: 0.4, color: '#880e4f' },
        { name: 'Frost Giant', health: 4, size: 1.2, speed: 0.3, color: '#1565c0', effect: 'freeze_on_hit' },
        { name: 'Fire Lord', health: 6, size: 0.9, speed: 0.5, color: '#d84315', effect: 'spawn_bombs' },
        { name: 'Shadow Boss', health: 4, size: 0.8, speed: 0.6, color: '#37474f', effect: 'phase' },
        { name: 'Golden Emperor', health: 8, size: 1.3, speed: 0.25, color: '#ffd600', effect: 'coin_burst' }
    ];

    static create(canvasWidth, canvasHeight, bossIndex = null) {
        const bossType = bossIndex !== null 
            ? BossBalloon.BOSS_TYPES[bossIndex % BossBalloon.BOSS_TYPES.length]
            : BossBalloon.BOSS_TYPES[Math.floor(Math.random() * BossBalloon.BOSS_TYPES.length)];

        const balloon = new Balloon(canvasWidth, canvasHeight, 0, null, null, 'boss');
        balloon.bossType = bossType;
        balloon.maxHealth = bossType.health;
        balloon.health = bossType.health;
        balloon.baseRadius *= bossType.size;
        balloon.radius = balloon.baseRadius;
        balloon.baseSpeed *= bossType.speed;
        balloon.currentSpeed = balloon.baseSpeed;
        balloon.bossEffect = bossType.effect;
        balloon.bossName = bossType.name;

        return balloon;
    }
}
