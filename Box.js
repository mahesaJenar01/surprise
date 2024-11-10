// Box.js
import { COLORS } from './constants.js';
import { Vector2D } from './utils.js';

export class Box {
    constructor(canvasManager) {
        this.canvas = canvasManager;
        this.position = new Vector2D();
        this.ribbonWidth = 0;
        this.updateDimensions();
    }

    updateDimensions() {
        const center = this.canvas.getCenter();
        this.position.x = center.x;
        this.position.y = center.y;
        this.ribbonWidth = this.canvas.boxSize * 0.167; // About 1/6 of box size
    }

    draw(ctx) {
        const halfSize = this.canvas.boxSize / 2;
        const halfRibbon = this.ribbonWidth / 2;

        // Draw main box body
        ctx.fillStyle = COLORS.BOX;
        ctx.fillRect(
            this.position.x - halfSize,
            this.position.y - halfSize,
            this.canvas.boxSize,
            this.canvas.boxSize
        );

        // Draw horizontal ribbon first (underneath)
        ctx.fillStyle = COLORS.RIBBON;
        ctx.fillRect(
            this.position.x - halfSize,
            this.position.y - halfRibbon,
            this.canvas.boxSize,
            this.ribbonWidth
        );

        // Draw vertical ribbon on top with slight offset for 3D effect
        ctx.fillStyle = COLORS.RIBBON;
        // Left part of vertical ribbon
        ctx.fillRect(
            this.position.x - halfRibbon,
            this.position.y - halfSize,
            this.ribbonWidth,
            (this.canvas.boxSize / 2) - (this.ribbonWidth / 2)
        );
        // Right part of vertical ribbon
        ctx.fillRect(
            this.position.x - halfRibbon,
            this.position.y + halfRibbon,
            this.ribbonWidth,
            (this.canvas.boxSize / 2) - (this.ribbonWidth / 2)
        );

        // Add a small shadow/highlight effect at the crossing point
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.fillRect(
            this.position.x - halfRibbon,
            this.position.y - halfRibbon,
            this.ribbonWidth,
            this.ribbonWidth
        );
    }

    drawBow(ctx, lidHeight) {
        if (lidHeight >= 5) return;

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