// StickmanRenderer.js
import { COLORS } from './constants.js';

export class StickmanRenderer {
    constructor(size) {
        this.size = size;
    }

    draw(ctx, position, angles, isCarrying) {
        const headRadius = this.size * 0.15;
        const bodyLength = this.size * 0.4;
        const limbLength = this.size * 0.3;
        
        ctx.save();
        ctx.strokeStyle = '#333333';
        ctx.lineWidth = Math.max(1, this.size * 0.02);
        ctx.lineCap = 'round';
        
        this._drawLegs(ctx, position, angles, limbLength, headRadius, bodyLength);
        this._drawBody(ctx, position, headRadius, bodyLength);
        
        if (isCarrying) {
            this._drawCarriedBox(ctx, position, headRadius, bodyLength, angles.leftArm);
        }
        
        this._drawArms(ctx, position, angles, limbLength, headRadius, bodyLength);
        this._drawHead(ctx, position, headRadius);
        
        ctx.restore();
    }

    _drawLegs(ctx, position, angles, limbLength, headRadius, bodyLength) {
        const hipsY = position.y + headRadius * 2 + bodyLength;
        this._drawLimb(ctx, position.x, hipsY, limbLength, angles.leftLeg);
        this._drawLimb(ctx, position.x, hipsY, limbLength, angles.rightLeg);
    }

    _drawBody(ctx, position, headRadius, bodyLength) {
        ctx.beginPath();
        ctx.moveTo(position.x, position.y + headRadius * 2);
        ctx.lineTo(position.x, position.y + headRadius * 2 + bodyLength);
        ctx.stroke();
    }

    _drawArms(ctx, position, angles, limbLength, headRadius, bodyLength) {
        const shouldersY = position.y + headRadius * 2 + bodyLength * 0.2;
        this._drawLimb(ctx, position.x, shouldersY, limbLength * 0.7, angles.leftArm);
        this._drawLimb(ctx, position.x, shouldersY, limbLength * 0.7, angles.rightArm);
    }

    _drawHead(ctx, position, headRadius) {
        ctx.beginPath();
        ctx.arc(position.x, position.y + headRadius, headRadius, 0, Math.PI * 2);
        ctx.stroke();
    }

    _drawLimb(ctx, x, y, length, angle) {
        const bendAngle = Math.PI / 12;
        ctx.beginPath();
        ctx.moveTo(x, y);
        
        const endX = x + Math.sin(angle + bendAngle) * length * 0.3;
        const endY = y + Math.cos(angle) * length;
        ctx.lineTo(endX, endY);
        ctx.stroke();

        const midX = x + Math.sin(angle + bendAngle) * length * 0.15;
        const midY = y + Math.cos(angle) * length * 0.5;
        ctx.beginPath();
        ctx.moveTo(midX, midY);
        
        const secondSegmentAngle = angle * 0.7;
        const endX2 = midX + Math.sin(secondSegmentAngle + bendAngle) * length * 0.3;
        const endY2 = midY + Math.cos(secondSegmentAngle) * length * 0.5;
        
        ctx.lineTo(endX2, endY2);
        ctx.stroke();
    }

    _drawCarriedBox(ctx, position, headRadius, bodyLength, armAngle) {
        const boxSize = this.size * 0.25;
        const shouldersY = position.y + headRadius * 2 + bodyLength * 0.2;
        
        // Calculate box position based on arm angle
        const armLength = this.size * 0.3 * 0.7; // Same as in _drawArms
        const boxOffsetX = Math.sin(armAngle) * armLength * 0.3;
        const boxOffsetY = Math.cos(armAngle) * armLength * 0.3;
        
        const boxX = position.x + boxOffsetX;
        const boxY = shouldersY + boxOffsetY;
        const tiltAngle = Math.PI / 24;
        
        ctx.save();
        ctx.translate(boxX, boxY);
        ctx.rotate(tiltAngle);
        
        // Draw box
        ctx.fillStyle = COLORS.BOX;
        ctx.fillRect(-boxSize/2, -boxSize/2, boxSize, boxSize);

        // Draw ribbon
        const ribbonWidth = boxSize * 0.167;
        ctx.fillStyle = COLORS.RIBBON;
        ctx.fillRect(-boxSize/2, -ribbonWidth/2, boxSize, ribbonWidth);
        ctx.fillRect(-ribbonWidth/2, -boxSize/2, ribbonWidth, boxSize);
        
        ctx.restore();
    }
}