/**
 * Controls an individual stop light.  This controls the individual 
 * state and re-draws the stoplight accordingly.
 */
class StopLight {
    constructor(trafficDirection) {
        this.trafficDirection = trafficDirection;
        this.isLeftTurnLight = false;
        this.image = null;
        this.state = 'red';
    }

    setGo() {
        this.state = 'green';
        this.draw();
    }

    setYield() {
        this.state = 'yellow';
        this.draw();
    }

    setStop() {
        this.state = 'red';
        this.draw();
    }

    draw(parentElement) {
        const svgXml = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><circle cx="6" cy="6" r="6" fill="${this.state}" /></svg>`;
        
        if (!this.image) {
            this.image = document.createElement('img');
            this.image.classList.add('trafficsignal');
            this.image.classList.add(this.trafficDirection);
            parentElement.appendChild(this.image);
        }

        this.image.src = svgXml;
    }
}
