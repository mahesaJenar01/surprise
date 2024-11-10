// StickmanState.js
export class StickmanState {
    constructor() {
        this.isWalking = true;
        this.hasArrived = false;
        this.isReturning = false;
        this.isCarrying = false;
        this.hasCompletedFirstWalk = false;
        this.readyToStartCarrying = false;
        this.isDropping = false;  // New state for dropping animation
        this.hasDropped = false;  // New state to track if drop is complete
    }

    reset() {
        this.isWalking = true;
        this.hasArrived = false;
        this.isReturning = false;
        this.isCarrying = false;
        this.hasCompletedFirstWalk = false;
        this.readyToStartCarrying = false;
        this.isDropping = false;
        this.hasDropped = false;
    }
}