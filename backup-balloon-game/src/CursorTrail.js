class TrailParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 4 + 2;
        this.speedX = (Math.random() - 0.5) * 2;
        this.speedY = (Math.random() - 0.5) * 2;
        this.life = 1.0;
        this.decay = Math.random() * 0.05 + 0.02;
        this.color = `hsla(${Math.random() * 60 + 40}, 100%, 70%, 0.8)`; // Golden sparkles
        this.rotation = Math.random() * Math.PI * 2;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= this.decay;
        this.rotation += 0.1;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;

        // Draw tiny sparkle star
        const spikes = 4;
        const outer = this.size;
        const inner = this.size / 2;
        let rot = Math.PI / 2 * 3;
        let x = 0;
        let y = 0;
        let step = Math.PI / spikes;

        ctx.beginPath();
        ctx.moveTo(0, -outer);
        for (let i = 0; i < spikes; i++) {
            x = Math.cos(rot) * outer;
            y = Math.sin(rot) * outer;
            ctx.lineTo(x, y);
            rot += step;
            x = Math.cos(rot) * inner;
            y = Math.sin(rot) * inner;
            ctx.lineTo(x, y);
            rot += step;
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
}

class CursorTrail {
    constructor() {
        this.particles = [];
        this.lastX = 0;
        this.lastY = 0;
        this.enabled = true;
    }

    add(x, y) {
        if (!this.enabled) return;
        for (let i = 0; i < 2; i++) {
            this.particles.push(new TrailParticle(x, y));
        }
    }

    // Alias for compatibility
    addPoint(x, y) {
        // Only add if moved enough
        const dist = Math.sqrt((x - this.lastX) ** 2 + (y - this.lastY) ** 2);
        if (dist > 5) {
            this.add(x, y);
            this.lastX = x;
            this.lastY = y;
        }
    }

    setEnabled(enabled) {
        this.enabled = enabled;
        if (!enabled) this.particles = [];
    }

    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update();
            if (this.particles[i].life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    draw(ctx) {
        this.particles.forEach(p => p.draw(ctx));
    }
}
