/**
 * Lane class.  This is used to track the traffic direction and the 
 * cars actively in the lane.
 */
class Lane {
    constructor(id, trafficDirection) {
        this.id = id;
        this.trafficDirection = trafficDirection;
        this.element = null;
        this.isLeftTurnLane = false;
        this.isRightTurnLane = false;
        this.hasGreenLight = false;
        this.stoplight = null;
        this.cars = [];
    }

    /*
        sets the stoplight active in the lane.  This stoplight will be used to control 
        traffic in the opposing lane.
    */
    setStoplight(stoplight) {
        this.stoplight = stoplight;
    }

    /*
        tracks when the stoplights have been changed.  when that happens we will see if 
        the traffic moving in this lane has a green light. if so we'll start them moving.  The 
        stopping happens in the drive method of the cars.
    */
    stoplightChanged(trafficDirection, isLeftTurn, state) {
        if (this.trafficDirection === trafficDirection && this.isLeftTurnLane === isLeftTurn) {
            this.hasGreenLight = (state === 'green');
            if (this.hasGreenLight) {
                this.cars.forEach(item => item.drive());
            }
        }
    }

    /*
        draws the lane into the container.
    */
    draw(parentElement) {
        if (!this.element) {
            this.element = document.createElement('div');
            this.element.classList.add('lane');
            if (this.trafficDirection === Direction.NORTH || this.trafficDirection === Direction.SOUTH) {
                this.element.classList.add(Direction.NORTHSOUTH);
            }
            else {
                this.element.classList.add(Direction.EASTWEST);
            }

            if (this.stoplight) {
                this.stoplight.draw(this.element);
            }
            
            parentElement.appendChild(this.element);
        }
    }

    /*
        adds a car to the lane.  the car will come in from the bottom and "drive"
        as far into the lane as they can based on the number of cars already in the lane.
    */
    addCar(car) {
        this.cars.push(car);
        const rect = this.element.getBoundingClientRect();
        car.draw();

        // calculate the position of the new car
        if (this.trafficDirection === Direction.NORTH) {
            const top = rect.bottom - 30;
            car.setPosition(top, rect.left);
        }
        else if (this.trafficDirection === Direction.SOUTH) {
            const top = rect.top;
            car.setPosition(top, rect.left);
        }
        else if (this.trafficDirection === Direction.WEST) {
            const top = rect.top;
            car.setPosition(top, rect.left);
        }
        else if (this.trafficDirection === Direction.EAST) {
            const top = rect.top;
            car.setPosition(top, rect.right - 30);
        }

        car.drive();
    }

    /*
        Returns the absolute position of the lane intersection boundary.  we use this 
        to control where the cars stop and to know if a car has crossed the threshold 
        into the main intersection.  once there the car shouldn't stop.
    */
    getIntersectionBoundary() {
        const rect = this.element.getBoundingClientRect();
        if (this.trafficDirection === Direction.NORTH) {
            return rect.top - 5;
        }
        else if (this.trafficDirection === Direction.SOUTH) {
            return rect.bottom - 30;
        }
        else if (this.trafficDirection === Direction.WEST) {
            return rect.right -30;
        }
        else if (this.trafficDirection === Direction.EAST) {
            return rect.left - 5;
        }
    }

    /*
        determines if the given position is across the lane intersection and 
        into the main intersection.
    */
    isAcrossIntersection(position) {
        const intersection = this.getIntersectionBoundary();
        if (this.trafficDirection === Direction.NORTH || this.trafficDirection === Direction.EAST) {
            return position < intersection;
        }
        else if (this.trafficDirection === Direction.SOUTH || this.trafficDirection === Direction.WEST) {
            return position > intersection;
        }
    }

    /*
        called by the cars as they move.  If the lane has a green light the cars can move.  If 
        the car is across the intersection they won't stop until they are out of the intersection 
        display.

        If they don't have a green light the cars will stop at the intersection, behind any other 
        cars in the lane.
    */
    carShouldStop(car, position) {
        if (this.hasGreenLight) {
            if (this.isAcrossIntersection(position)) {
                // remove the car from the list of cars in the lane
                for (let i = 0; i < this.cars.length; i++) {
                    if (this.cars[i].id === car.id) {
                        this.cars.splice(i, 1);
                        break;
                    }
                }
                car.isAcrossIntersection = true;
                return false;
            }
            else {
                return false;
            }
        }
        else {
            const intersection = this.getIntersectionBoundary();
            const existingCarBuffer = (this.cars.length - 1) * 30;
    
            if (this.trafficDirection === Direction.NORTH || this.trafficDirection === Direction.EAST) {
                return position < (intersection + existingCarBuffer);
            }
            else if (this.trafficDirection === Direction.SOUTH || this.trafficDirection === Direction.WEST) {
                return position > (intersection - existingCarBuffer);
            }
        }
    }
}