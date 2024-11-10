import { StickmanAnimation } from './StickmanAnimation.js';
import { StickmanRenderer } from './StickmanRenderer.js';
import { StickmanState } from './StickmanState.js';
import { StickmanMovement } from './StickmanMovement.js';

export class Stickman {
    constructor(canvasManager) {
        this.canvas = canvasManager;
        this.baseSize = this.canvas.boxSize * 1.2;
        this.size = this.baseSize;
        
        this.state = new StickmanState();
        this.animation = new StickmanAnimation();
        this.renderer = new StickmanRenderer(this.size);
        this.movement = new StickmanMovement(
            this.canvas, 
            -this.canvas.boxSize
        );

        // Set initial position
        this.movement.position.x = this.canvas.canvas.width / 2;
        this.movement.position.y = -this.canvas.boxSize;
    }

    setWalkingDistance(percentage) {
        this.movement.setWalkingDistance(percentage);
        this.state.reset();
    }

    updateDimensions() {
        this.baseSize = this.canvas.boxSize * 1.2;
        this.movement = new StickmanMovement(
            this.canvas, 
            -this.canvas.boxSize
        );
        this.movement.position.x = this.canvas.canvas.width / 2;
        
        if (this.state.targetDistance > 0 && !this.state.isReturning && !this.state.hasCompletedFirstWalk) {
            const percentage = (this.movement.targetDistance / this.canvas.canvas.height) * 100;
            this.setWalkingDistance(percentage);
        }
    }

    hasLeftScreen() {
        return this.state.isReturning && 
               this.movement.hasReturnedToStart() && 
               !this.state.hasCompletedFirstWalk;
    }

    update() {
        if (this.state.isWalking) {
            this.animation.updateWalkCycle();
        }

        this.size = this.movement.updatePosition(this.state, this.baseSize);
        this._updateState();

        // Update renderer size
        this.renderer = new StickmanRenderer(this.size);
    }

    _updateState() {
        if (!this.state.hasCompletedFirstWalk) {
            if (this.state.isWalking && !this.state.hasArrived && this.movement.hasReachedTarget()) {
                this.state.hasArrived = true;
                this.state.isWalking = false;
                this.animation.startWaving();
            } else if (this.state.hasArrived && !this.state.isReturning) {
                if (this.animation.updateWaveAnimation()) {
                    this.state.isReturning = true;
                    this.state.isWalking = true;
                }
            } else if (this.state.isReturning && this.movement.hasReturnedToStart()) {
                this.state.hasCompletedFirstWalk = true;
                this.state.readyToStartCarrying = true;
            }
        } else if (this.state.readyToStartCarrying) {
            this.state.isCarrying = true;
            this.state.isWalking = true;
            this.state.readyToStartCarrying = false;
            this.movement.currentDistance = 0;
            this.animation.resetWalkCycle();
        } else if (this.state.isCarrying && this.state.isWalking && this.movement.hasReachedTarget()) {
            this.state.isWalking = false;
            this.animation.stopWalking();
        }
    }

    draw(ctx) {
        if (this.movement.position.y < -this.size) return;
        
        const angles = this.animation.getLimbAngles(this.state.isCarrying);
        this.renderer.draw(ctx, this.movement.position, angles, this.state.isCarrying);
    }
}
