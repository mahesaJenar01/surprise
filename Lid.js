// Lid.js
import { COLORS, PHYSICS, ANIMATION } from './constants.js';
import { Vector2D } from './utils.js';

export class Lid {
    constructor(canvasManager) {
        this.canvas = canvasManager;
        this.position = new Vector2D();
        this.velocity = new Vector2D();
        this.rotation = 0;
        this.height = 0;
        this.phase = ANIMATION.LID_PHASES.RISING;
        this.rotationTimer = 0;
        this.ribbonWidth = 0;
        this.updateDimensions();
    }

    updateDimensions() {
        const center = this.canvas.getCenter();
        this.position.x = center.x;
        this.position.y = center.y - this.canvas.boxSize / 2;
        this.ribbonWidth = this.canvas.boxSize * 0.167;
    }

    update(isOpening) {
        if (!isOpening) {
            this.reset();
            return;
        }

        switch (this.phase) {
            case ANIMATION.LID_PHASES.RISING:
                this.handleRisingPhase();
                break;
            case ANIMATION.LID_PHASES.ROTATING:
                this.handleRotatingPhase();
                break;
            case ANIMATION.LID_PHASES.FALLING:
                this.handleFallingPhase();
                break;
        }
    }

    handleRisingPhase() {
        // Initial burst of speed when opening
        if (this.height === 0) {
            this.velocity.y = -15;
        }

        // Apply gravity with reduced effect during rising
        this.velocity.y += PHYSICS.GRAVITY * 0.5;
        this.height -= this.velocity.y;

        // Check if reached maximum height
        if (this.height >= this.canvas.maxLidHeight) {
            this.phase = ANIMATION.LID_PHASES.ROTATING;
            this.height = this.canvas.maxLidHeight;
            this.velocity.y = 0;
        }
    }

    handleRotatingPhase() {
        this.rotation += 0.1;
        this.rotationTimer++;

        if (this.rotationTimer >= ANIMATION.ROTATION_DURATION) {
            this.phase = ANIMATION.LID_PHASES.FALLING;
        }
    }

    handleFallingPhase() {
        this.velocity.y += PHYSICS.GRAVITY;
        this.height -= this.velocity.y;

        if (this.height <= 0) {
            this.height = 0;
            this.velocity.y = 0;
            this.rotation = 0;
            this.phase = ANIMATION.LID_PHASES.RISING;
            this.rotationTimer = 0;
        }
    }

    reset() {
        this.height = Math.max(0, this.height - 10);
        this.rotation = 0;
        this.phase = ANIMATION.LID_PHASES.RISING;
        this.rotationTimer = 0;
        
        if (this.height === 0) {
            this.velocity.y = 0;
        }
    }

    draw(ctx) {
        const lidY = this.position.y - this.height;
        
        ctx.save();
        ctx.translate(this.position.x, lidY - this.ribbonWidth / 2);
        ctx.rotate(this.rotation);
        
        ctx.fillStyle = COLORS.LID;
        ctx.fillRect(
            -this.canvas.boxSize / 2,
            -this.ribbonWidth / 2,
            this.canvas.boxSize,
            this.ribbonWidth
        );
        
        ctx.restore();
    }
}