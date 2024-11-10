// Box.js
import { COLORS } from './constants.js';
import { Vector2D } from './utils.js';

export class Box {
    constructor(canvasManager) {
        this.canvas = canvasManager;
        this.position = new Vector2D();
        this.ribbonWidth = 0;
        this.scale = 0;  // Start with scale 0
        this.targetScale = 1;
        this.scaleSpeed = 0.05;
        this.isScaling = false;
        this.updateDimensions();
    }

    updateDimensions() {
        const center = this.canvas.getCenter();
        this.position.x = center.x;
        this.position.y = center.y;
        this.ribbonWidth = this.canvas.boxSize * 0.167;
    }

    startScaling() {
        this.scale = 0;
        this.isScaling = true;
    }

    update() {
        if (this.isScaling && this.scale < this.targetScale) {
            this.scale += this.scaleSpeed;
            if (this.scale >= this.targetScale) {
                this.scale = this.targetScale;
                this.isScaling = false;
            }
        }
    }

    draw(ctx) {
        if (this.scale <= 0) return;

        const halfSize = (this.canvas.boxSize * this.scale) / 2;
        const halfRibbon = (this.ribbonWidth * this.scale) / 2;

        ctx.save();
        ctx.translate(this.position.x, this.position.y);

        // Draw main box body
        ctx.fillStyle = COLORS.BOX;
        ctx.fillRect(
            -halfSize,
            -halfSize,
            this.canvas.boxSize * this.scale,
            this.canvas.boxSize * this.scale
        );

        // Draw horizontal ribbon
        ctx.fillStyle = COLORS.RIBBON;
        ctx.fillRect(
            -halfSize,
            -halfRibbon,
            this.canvas.boxSize * this.scale,
            this.ribbonWidth * this.scale
        );

        // Draw vertical ribbon
        ctx.fillStyle = COLORS.RIBBON;
        ctx.fillRect(
            -halfRibbon,
            -halfSize,
            this.ribbonWidth * this.scale,
            (this.canvas.boxSize / 2 - this.ribbonWidth / 2) * this.scale
        );
        ctx.fillRect(
            -halfRibbon,
            halfRibbon,
            this.ribbonWidth * this.scale,
            (this.canvas.boxSize / 2 - this.ribbonWidth / 2) * this.scale
        );

        // Add shadow effect at crossing point
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.fillRect(
            -halfRibbon,
            -halfRibbon,
            this.ribbonWidth * this.scale,
            this.ribbonWidth * this.scale
        );

        ctx.restore();
    }

    drawBow(ctx) {
        if (this.scale < 1) return;

        const bowSize = this.canvas.boxSize * 0.125;
        const x = this.position.x;
        const y = this.position.y - this.canvas.boxSize / 2;

        ctx.fillStyle = COLORS.RIBBON;

        // Left loop
        ctx.beginPath();
        ctx.ellipse(
            x - bowSize * 1.875,
            y,
            bowSize * 1.875,
            bowSize * 1.25,
            -Math.PI / 4,
            0,
            Math.PI * 2
        );
        ctx.fill();

        // Right loop
        ctx.beginPath();
        ctx.ellipse(
            x + bowSize * 1.875,
            y,
            bowSize * 1.875,
            bowSize * 1.25,
            Math.PI / 4,
            0,
            Math.PI * 2
        );
        ctx.fill();

        // Center knot
        ctx.beginPath();
        ctx.ellipse(x, y, bowSize, bowSize, 0, 0, Math.PI * 2);
        ctx.fill();
    }
}