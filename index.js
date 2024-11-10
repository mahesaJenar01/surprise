import { CanvasManager } from './Canvas.js';
import { Box } from './Box.js';
import { Lid } from './Lid.js';
import { Pathway } from './Pathway.js';
import { SparkleSystem } from './SparkleSystem.js';
import { Stickman } from './Stickman.js';

// GiftBoxApp class
class GiftBoxApp {
    constructor() {
        this.canvas = new CanvasManager();
        this.box = new Box(this.canvas);
        this.lid = new Lid(this.canvas);
        this.pathway = new Pathway(this.canvas);
        this.sparkleSystem = new SparkleSystem(this.canvas);
        this.stickman = new Stickman(this.canvas);
        
        this.stickman.setWalkingDistance(70);
        
        this.showBox = false;
        this.isOpening = false;
        this.isOpen = false;
        this.stickmanHasLeft = false;
        
        this.setupEventListeners();
        this.startAnimation();
    }

    setupEventListeners() {
        this.canvas.canvas.addEventListener('click', (event) => {
            if (this.showBox && !this.isOpening) {
                this.isOpening = true;
            }
        });

        window.addEventListener('resize', () => {
            if (!this.stickmanHasLeft) {
                this.stickman.updateDimensions();
            }
            if (this.showBox) {
                this.box.updateDimensions();
                this.lid.updateDimensions();
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
            
            if (this.stickman.state.isDropping && !this.stickman.state.hasDropped) {
                // Start scaling the box when dropping begins
                if (!this.box.isScaling && !this.showBox) {
                    this.showBox = true;
                    this.box.startScaling();
                }
            }
            
            if (this.stickman.hasLeftScreen()) {
                this.stickmanHasLeft = true;
            }
        }

        // Update box scaling animation
        if (this.showBox) {
            this.box.update();
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
        
        if (!this.stickmanHasLeft) {
            this.stickman.draw(this.canvas.ctx);
        }
        
        if (this.showBox) {
            this.box.draw(this.canvas.ctx);
            this.lid.draw(this.canvas.ctx);
            this.box.drawBow(this.canvas.ctx);
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