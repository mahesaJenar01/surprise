import { Vector2D } from './utils.js';

export class StickmanMovement {
    constructor(canvas, startY) {
        this.canvas = canvas;
        this.startY = startY;
        this.currentDistance = 0;
        this.targetDistance = 0;
        this.position = new Vector2D();
        this.minScale = 0.2;
        this.maxScale = 1.0;
    }

    setWalkingDistance(percentage) {
        this.targetDistance = (this.canvas.canvas.height * percentage) / 100;
        this.currentDistance = 0;
        this.position.y = this.startY;
    }

    updatePosition(state, baseSize) {
        if (!state.hasCompletedFirstWalk) {
            return this._updateFirstWalkCycle(state, baseSize);
        } else if (state.isCarrying) {
            return this._updateCarryingCycle(state, baseSize);
        }
        return baseSize;
    }

    _updateFirstWalkCycle(state, baseSize) {
        if (state.isWalking && !state.hasArrived) {
            const walkSpeed = this.canvas.boxSize * 0.01;
            this.currentDistance += walkSpeed;
        } else if (state.isReturning) {
            const walkSpeed = this.canvas.boxSize * 0.015;
            this.currentDistance -= walkSpeed;
        }

        this.position.y = this.startY + this.currentDistance;
        const progress = state.isReturning ? 
            Math.max(0, this.currentDistance / this.targetDistance) :
            Math.min(this.currentDistance / this.targetDistance, 1);
        
        return baseSize * (this.minScale + (this.maxScale - this.minScale) * progress);
    }

    _updateCarryingCycle(state, baseSize) {
        if (state.isWalking) {
            const walkSpeed = this.canvas.boxSize * 0.008;
            this.currentDistance += walkSpeed;
            this.position.y = this.startY + this.currentDistance;
            
            const progress = Math.min(this.currentDistance / this.targetDistance, 1);
            return baseSize * (this.minScale + (this.maxScale - this.minScale) * progress);
        }
        return baseSize;
    }

    hasReachedTarget() {
        return this.currentDistance >= this.targetDistance;
    }

    hasReturnedToStart() {
        return this.currentDistance <= 0;
    }
}