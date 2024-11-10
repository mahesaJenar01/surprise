// StickmanMovement.js
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
        this.returnSpeed = this.canvas.boxSize * 0.015;
        this.walkSpeed = this.canvas.boxSize * 0.01;
        this.carrySpeed = this.canvas.boxSize * 0.008;
    }

    setWalkingDistance(percentage) {
        this.targetDistance = (this.canvas.canvas.height * percentage) / 100;
        this.currentDistance = 0;
        this.position.y = this.startY;
    }

    updatePosition(state, baseSize) {
        if (!state.hasCompletedFirstWalk) {
            return this._updateFirstWalkCycle(state, baseSize);
        } else if (state.isCarrying || state.isDropping) {
            return this._updateCarryingCycle(state, baseSize);
        } else if (state.isReturning && state.hasDropped) {
            return this._updateReturnCycle(state, baseSize);
        }
        return baseSize;
    }

    _updateFirstWalkCycle(state, baseSize) {
        if (state.isWalking && !state.hasArrived) {
            this.currentDistance += this.walkSpeed;
        } else if (state.isReturning) {
            this.currentDistance -= this.returnSpeed;
        }

        this.position.y = this.startY + this.currentDistance;
        const progress = state.isReturning ? 
            Math.max(0, this.currentDistance / this.targetDistance) :
            Math.min(this.currentDistance / this.targetDistance, 1);
        
        return baseSize * (this.minScale + (this.maxScale - this.minScale) * progress);
    }

    _updateCarryingCycle(state, baseSize) {
        if (state.isWalking) {
            this.currentDistance += this.carrySpeed;
            this.position.y = this.startY + this.currentDistance;
            
            const progress = Math.min(this.currentDistance / this.targetDistance, 1);
            return baseSize * (this.minScale + (this.maxScale - this.minScale) * progress);
        }
        return baseSize;
    }

    _updateReturnCycle(state, baseSize) {
        this.currentDistance -= this.returnSpeed;
        this.position.y = this.startY + this.currentDistance;
        
        const progress = Math.max(0, this.currentDistance / this.targetDistance);
        return baseSize * (this.minScale + (this.maxScale - this.minScale) * progress);
    }

    hasReachedTarget() {
        return this.currentDistance >= this.targetDistance;
    }

    hasReturnedToStart() {
        return this.currentDistance <= 0;
    }
}