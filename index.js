import { CanvasManager } from './Canvas.js';
import { Box } from './Box.js';
import { Lid } from './Lid.js';
import { Pathway } from './Pathway.js';
import { SparkleSystem } from './SparkleSystem.js';
import { Stickman } from './Stickman.js';

class GiftBoxApp {
    constructor() {
        this.canvas = new CanvasManager();
        this.box = new Box(this.canvas);
        this.lid = new Lid(this.canvas);
        this.pathway = new Pathway(this.canvas);
        this.sparkleSystem = new SparkleSystem(this.canvas);
        this.stickman = new Stickman(this.canvas);
        
        // Set stickman to walk 40% down the screen
        this.stickman.setWalkingDistance(70);
        
        // Always keep box hidden
        this.showBox = false;
        this.isOpening = false;
        this.isOpen = false;
        this.stickmanHasLeft = false;
        
        this.setupEventListeners();
        this.startAnimation();
    }

    setupEventListeners() {
        // Keep event listeners but make them ineffective
        this.canvas.canvas.addEventListener('click', (event) => {
            // Click events won't do anything since showBox is always false
            return;
        });

        window.addEventListener('resize', () => {
            // Only update necessary components
            if (!this.stickmanHasLeft) {
                this.stickman.updateDimensions();
            }
        });
    }

    reset() {
        this.isOpening = false;
        this.isOpen = false;
        this.sparkleSystem.clear();
    }

    update() {
        // Update stickman first
        if (!this.stickmanHasLeft) {
            this.stickman.update();
            
            // Check if stickman has completed its journey
            if (this.stickman.hasLeftScreen()) {
                this.stickmanHasLeft = true;
                // Keep showBox false even after stickman leaves
                this.showBox = false;
            }
        }

        // Keep other update logic but it won't execute since showBox is always false
        if (this.showBox) {
            this.lid.update(this.isOpening);
            this.sparkleSystem.update();
            
            if (this.lid.height >= this.canvas.maxLidHeight && !this.isOpen) {
                this.isOpen = true;
                this.sparkleSystem.createSparkles();
            }
        }
    }

    render() {
        this.canvas.clear();
        
        this.pathway.draw(this.canvas.ctx);
        
        // Always draw stickman if it hasn't left
        if (!this.stickmanHasLeft) {
            this.stickman.draw(this.canvas.ctx);
        }
        
        // Box-related rendering won't execute since showBox is always false
        if (this.showBox) {
            this.box.draw(this.canvas.ctx);
            this.lid.draw(this.canvas.ctx);
            this.box.drawBow(this.canvas.ctx, this.lid.height);
            this.sparkleSystem.draw(this.canvas.ctx);
        }
    }

    startAnimation() {
        const animate = () => {
            this.update();
            this.render();
            requestAnimationFrame(animate);
        };
        animate();
    }
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GiftBoxApp();
});