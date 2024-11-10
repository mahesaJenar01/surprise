import { Vector2D } from './utils.js';
import { PHYSICS } from './constants.js';

export class Sparkle {
    constructor(x, y, boxSize) {
        this.position = new Vector2D(x, y);
        this.velocity = new Vector2D(
            (Math.random() - 0.5) * (boxSize * 0.067),
            (Math.random() - 0.5) * (boxSize * 0.067) - (boxSize * 0.042)
        );
        this.size = Math.random() * (boxSize * 0.025) + (boxSize * 0.015);
        this.opacity = 1;
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    }

    update() {
        // Update position
        this.position.add(this.velocity);
        
        // Apply gravity
        this.velocity.y += PHYSICS.GRAVITY;
        
        // Fade out
        this.opacity -= 0.02;
        
        // Shrink
        if (this.size > 0.1) {
            this.size -= this.size * 0.02;
        }
    }

    draw(ctx) {
        if (this.size <= 0) return;
        
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.globalAlpha = Math.max(0, Math.min(1, this.opacity));
        
        ctx.beginPath();
        ctx.arc(
            this.position.x,
            this.position.y,
            Math.max(0.1, this.size),
            0,
            Math.PI * 2
        );
        ctx.fill();
        
        ctx.restore();
    }

    isAlive() {
        return this.opacity > 0 && this.size > 0;
    }
}
