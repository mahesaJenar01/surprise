export class StickmanAnimation {
    constructor() {
        this.walkCycle = 0;
        this.walkSpeed = 0.12;
        this.legAngle = 0;
        this.armAngle = 0;
        this.maxLegAngle = Math.PI / 12;
        this.maxArmAngle = Math.PI / 16;
        
        // Wave animation properties
        this.isWaving = false;
        this.waveCycle = 0;
        this.waveSpeed = 0.15;
        this.maxWaveAngle = Math.PI / 2;
        this.waveCount = 0;
        this.targetWaves = 3;
        
        this.waveCompleteTime = 0;
        this.waitTimeAfterWave = 60;
        this.isWaitingAfterWave = false;

        // Drop animation properties
        this.dropProgress = 0;
        this.dropDuration = 30; // frames
        this.dropAnimationComplete = false;
    }

    resetWalkCycle() {
        this.walkCycle = 0;
    }

    stopWalking() {
        this.walkCycle = 0;
        this.legAngle = 0;
        this.armAngle = 0;
    }

    updateDropAnimation() {
        if (this.dropProgress < this.dropDuration) {
            this.dropProgress++;
            const progress = this.dropProgress / this.dropDuration;
            // Gradually lower arms
            const startAngle = Math.PI / 2.5;
            const endAngle = 0;
            this.armAngle = startAngle + (endAngle - startAngle) * progress;
            return false;
        }
        return true;
    }

    updateWalkCycle() {
        this.walkCycle += this.walkSpeed;
        
        const legCycle = Math.sin(this.walkCycle);
        const forwardTilt = Math.PI / 12;
        this.legAngle = legCycle * this.maxLegAngle + forwardTilt;
        
        if (!this.isCarrying) {
            this.armAngle = Math.sin(this.walkCycle + Math.PI) * this.maxArmAngle;
        }
    }

    updateWaveAnimation() {
        if (this.isWaving) {
            this.waveCycle += this.waveSpeed;
            this.armAngle = Math.sin(this.waveCycle) * this.maxWaveAngle - Math.PI / 4;
            
            if (this.waveCycle >= Math.PI * 2) {
                this.waveCount++;
                this.waveCycle = 0;
                
                if (this.waveCount >= this.targetWaves) {
                    this.isWaving = false;
                    this.isWaitingAfterWave = true;
                    this.waveCompleteTime = 0;
                }
            }
        } else if (this.isWaitingAfterWave) {
            this.waveCompleteTime++;
            if (this.waveCompleteTime >= this.waitTimeAfterWave) {
                this.isWaitingAfterWave = false;
                return true;
            }
        }
        return false;
    }

    startWaving() {
        this.isWaving = true;
        this.waveCycle = 0;
        this.waveCount = 0;
        this.isWaitingAfterWave = false;
    }

    getLimbAngles(isCarrying = false, isDropping = false) {
        if (this.isWaving || this.isWaitingAfterWave) {
            const armAngle = !this.isWaving ? 0 : -this.armAngle;
            return {
                leftLeg: 0,
                rightLeg: 0,
                leftArm: armAngle,
                rightArm: -Math.PI / 8
            };
        }

        if (isDropping) {
            return {
                leftLeg: 0,
                rightLeg: 0,
                leftArm: this.armAngle,
                rightArm: this.armAngle
            };
        }

        if (isCarrying) {
            return {
                leftLeg: -this.legAngle,
                rightLeg: this.legAngle,
                leftArm: Math.PI / 2.5,
                rightArm: Math.PI / 2.5
            };
        }
        
        return {
            leftLeg: -this.legAngle,
            rightLeg: this.legAngle,
            leftArm: -this.armAngle,
            rightArm: this.armAngle
        };
    }
}