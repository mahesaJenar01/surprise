import { lerp } from './utils.js';

export class Pathway {
    constructor(canvasManager) {
        this.canvas = canvasManager;
        this.widthFactor = 0.05; // Controls path narrowing
        this.gridConfig = {
            horizontalLines: 40,
            verticalLines: 50,
            lineWidth: 1,
            opacity: 0.4
        };
    }

    draw(ctx) {
        const { width, height } = this.canvas.canvas;
        const center = this.canvas.getCenter();
        
        // Define vanishing point
        const vanishingPoint = {
            x: center.x,
            y: center.y - height * 0.8
        };

        // Calculate path dimensions
        const nearWidth = width;
        const farWidth = width * this.widthFactor;

        // Create and apply gradient
        const gradient = this.createPathwayGradient(ctx, height, vanishingPoint.y);
        ctx.fillStyle = gradient;

        // Draw main pathway
        this.drawMainPath(ctx, width, height, center.x, vanishingPoint, farWidth);
        
        // Draw grid lines
        this.drawGrid(ctx, width, height, center.x, vanishingPoint, farWidth);
    }

    createPathwayGradient(ctx, height, vanishingY) {
        const gradient = ctx.createLinearGradient(0, height, 0, vanishingY);
        gradient.addColorStop(0, '#e6e6e6');
        gradient.addColorStop(0.3, '#d4d4d4');
        gradient.addColorStop(0.7, '#c0c0c0');
        gradient.addColorStop(1, '#b0b0b0');
        return gradient;
    }

    drawMainPath(ctx, width, height, centerX, vanishingPoint, farWidth) {
        ctx.beginPath();
        ctx.moveTo(0, height);
        ctx.lineTo(width, height);
        ctx.lineTo(centerX + (farWidth/2), vanishingPoint.y);
        ctx.lineTo(centerX - (farWidth/2), vanishingPoint.y);
        ctx.closePath();
        ctx.fill();
    }

    drawGrid(ctx, width, height, centerX, vanishingPoint, farWidth) {
        const { horizontalLines, verticalLines, lineWidth, opacity } = this.gridConfig;
        
        ctx.strokeStyle = 'rgba(153, 153, 153, 0.4)';
        ctx.lineWidth = Math.max(1, this.canvas.boxSize * 0.005);

        // Draw horizontal lines
        this.drawHorizontalLines(ctx, width, height, centerX, vanishingPoint, farWidth, horizontalLines);
        
        // Draw vertical lines
        this.drawVerticalLines(ctx, width, height, centerX, vanishingPoint, farWidth, verticalLines);
    }

    drawHorizontalLines(ctx, width, height, centerX, vanishingPoint, farWidth, numberOfLines) {
        for (let i = 0; i <= numberOfLines; i++) {
            const t = i / numberOfLines;
            const y = lerp(height, vanishingPoint.y, t);
            const startX = lerp(0, centerX - (farWidth/2), t);
            const endX = lerp(width, centerX + (farWidth/2), t);
            
            ctx.globalAlpha = 1 - (i / numberOfLines) * 0.5;
            
            ctx.beginPath();
            ctx.moveTo(startX, y);
            ctx.lineTo(endX, y);
            ctx.stroke();
        }
    }

    drawVerticalLines(ctx, width, height, centerX, vanishingPoint, farWidth, numberOfLines) {
        for (let i = 0; i <= numberOfLines; i++) {
            const x = i * (width / numberOfLines);
            const targetX = lerp(
                centerX - (farWidth/2),
                centerX + (farWidth/2),
                i / numberOfLines
            );
            
            const edgeFade = Math.sin((i / numberOfLines) * Math.PI);
            ctx.globalAlpha = edgeFade * 0.7;
            
            ctx.beginPath();
            ctx.moveTo(x, height);
            ctx.lineTo(targetX, vanishingPoint.y);
            ctx.stroke();
        }
        
        // Reset global alpha
        ctx.globalAlpha = 1;
    }
}
