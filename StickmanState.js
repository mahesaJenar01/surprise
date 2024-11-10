export class StickmanState {
    constructor() {
        this.isWalking = true;
        this.hasArrived = false;
        this.isReturning = false;
        this.isCarrying = false;
        this.hasCompletedFirstWalk = false;
        this.readyToStartCarrying = false;
    }

    reset() {
        this.isWalking = true;
        this.hasArrived = false;
        this.isReturning = false;
        this.isCarrying = false;
        this.hasCompletedFirstWalk = false;
        this.readyToStartCarrying = false;
    }
}
