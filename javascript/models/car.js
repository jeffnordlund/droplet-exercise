/**
 * Class to wrap the functionality of the car.
 */
class Car {

    constructor(id, trafficLane) {
        this.id = id;
        this.trafficLane = trafficLane;
        this.element = null;

        this.driveInterval = null;
        this.positionTop = 0;
        this.positionLeft = 0;
        this.isAcrossIntersection = false;
    }

    /*
        Create the element and add the car class.  A better name for this method might 
        be "create"
    */
    draw() {
        if (!this.element) {
            this.element = document.createElement('div');
            this.element.classList.add('car');
            document.getElementById('intersectioncontainer').appendChild(this.element);
        }
    }

    /*
        Set the position of the car in absolute top/left coordinates.
    */
    setPosition(top, left) {
        this.element.style.cssText = `top: ${top}px; left: ${left}px;`;
        this.positionLeft = left;
        this.positionTop = top;
    }

    /*
        See if the car should stop at the intersection, either at the intersection line 
        or behind another car.  If so, call the stop method for the car.
    */
    stopAtIntersection() {
        if (this.trafficLane.trafficDirection === Direction.NORTH || this.trafficLane.trafficDirection === Direction.SOUTH) {
            if (this.trafficLane.carShouldStop(this, this.positionTop)) {
                this.stop();
            }
        }
        else if (this.trafficLane.trafficDirection === Direction.WEST || this.trafficLane.trafficDirection === Direction.EAST) {
            if (this.trafficLane.carShouldStop(this, this.positionLeft)) {
                this.stop();
            }
        }
    }

    /*
        This is a bit hard-coded.  With a little additional time this could be 
        made smoother.
    */
    turnRight() {
        const rect = this.trafficLane.element.getBoundingClientRect();

        if (this.trafficLane.trafficDirection === Direction.NORTH) {
            const targetTop = rect.top - 32;
            if (this.positionTop > targetTop) this.positionTop--;
            this.setPosition(this.positionTop, this.positionLeft + 2);
        }
        else if (this.trafficLane.trafficDirection === Direction.SOUTH) {
            const targetTop = rect.bottom;
            if (this.positionTop < targetTop) this.positionTop++;
            this.setPosition(this.positionTop, this.positionLeft - 2);
        }
        else if (this.trafficLane.trafficDirection === Direction.WEST) {
            const targetLeft = rect.right + 2;
            if (this.positionLeft < targetLeft) this.positionLeft++;
            this.setPosition(this.positionTop + 2, this.positionLeft);
        }
        else if (this.trafficLane.trafficDirection === Direction.EAST) {
            const targetLeft = rect.left - 32;
            if (this.positionLeft > targetLeft) this.positionLeft--;
            this.setPosition(this.positionTop - 2, this.positionLeft);
        }
    }

    /*
        This is a bit crude, didn't have time to make it cleaner/smoother.  So 
        put in some hard-coded stop points for the turn targets.
    */
    turnLeft() {
        if (this.trafficLane.trafficDirection === Direction.NORTH) {
            const maxTop = 300;
            if (this.positionTop > maxTop) this.positionTop -= 3;
            this.setPosition(this.positionTop, this.positionLeft - 2);
        }
        else if (this.trafficLane.trafficDirection === Direction.SOUTH) {
            const maxTop = 360;
            if (this.positionTop < maxTop) this.positionTop += 3;
            this.setPosition(this.positionTop, this.positionLeft + 2);
        }
        else if (this.trafficLane.trafficDirection === Direction.WEST) {
            const maxLeft = 360;
            if (this.positionLeft < maxLeft) this.positionLeft += 3;
            this.setPosition(this.positionTop - 2, this.positionLeft);
        }
        else if (this.trafficLane.trafficDirection === Direction.EAST) {
            const maxLeft = 300;
            if (this.positionLeft > maxLeft) this.draw,this.positionLeft -= 3;
            this.setPosition(this.positionTop + 2, this.positionLeft);
        }
    }

    /*
        Not turning or doing anything like that so just drive in a straight line.
    */
    goStraight() {
        if (this.trafficLane.trafficDirection === Direction.NORTH) {
            this.setPosition(this.positionTop - 2, this.positionLeft);
        }
        else if (this.trafficLane.trafficDirection === Direction.SOUTH) {
            this.setPosition(this.positionTop + 2, this.positionLeft);
        }
        else if (this.trafficLane.trafficDirection === Direction.WEST) {
            this.setPosition(this.positionTop, this.positionLeft + 2);
        }
        else if (this.trafficLane.trafficDirection === Direction.EAST) {
            this.setPosition(this.positionTop, this.positionLeft - 2);
        }
    }

    /*
        Control the car driving.  If the car is across the intersection we don't want to 
        stop so we'll just keep things going.  If it isn't across the intersection we'll 
        stop on any non-green light.  Not really the Utah way, but it'll work for this 
        example.

        For now we are setting the interval at 20ms to keep the car movements relatively 
        quick and to get through the intersection before other cars take off.
    */
    drive() {
        if (!this.driveInterval) {
            this.driveInterval = setInterval(() => {
                if (!this.isAcrossIntersection) {
                    this.goStraight();
                    this.stopAtIntersection();
                }
                else {
                    if (this.trafficLane.isRightTurnLane) {
                        this.turnRight();
                    }
                    else if (this.trafficLane.isLeftTurnLane) {
                        this.turnLeft();
                    }
                    else {
                        this.goStraight();
                    }
                }

                // if the car is outside the intersection we need to get rid of it
                if (this.positionTop < 0 || this.positionTop > 700 || this.positionLeft < 0 || this.positionLeft > 680) {
                    this.stop();
                    this.element.parentElement.removeChild(this.element);
                }

            }, 20);
        }
    }

    /*
        Stop the car by clearing the interval.
    */
    stop() {
        if (this.driveInterval) {
            clearInterval(this.driveInterval);
            this.driveInterval = null;
        }
    }
}
