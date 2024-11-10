import { Sparkle } from './Sparkle.js';

export class SparkleSystem {
    constructor(canvasManager) {
        this.canvas = canvasManager;
        this.sparkles = [];
    }

    createSparkles() {
        const center = this.canvas.getCenter();
        const sparkleCount = Math.round(this.canvas.boxSize * 0.25);
        
        for (let i = 0; i < sparkleCount; i++) {
            this.sparkles.push(new Sparkle(
                center.x,
                center.y - this.canvas.boxSize/2,
                this.canvas.boxSize
            ));
        }
    }

    update() {
        this.sparkles = this.sparkles.filter(sparkle => {
            sparkle.update();
            return sparkle.isAlive();
        });
    }

    draw(ctx) {
        this.sparkles.forEach(sparkle => sparkle.draw(ctx));
    }

    clear() {
        this.sparkles = [];
    }
}
