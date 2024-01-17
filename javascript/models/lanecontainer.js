

const LANE_COUNT = 7;
/**
 * Contains multiple lanes.  This is used as a point to provide communication down to all the 
 * contianed lanes which can be passed to any cars as necessary.  The main purpose for this 
 * is to communicate stoplight information.
 */
class LaneContainer {

    constructor(id, intersectionLocation, stoplightController) {
        this.element = document.getElementById(id);
        this.stoplightController = stoplightController;

        if (!this.element) {
            throw new Error('Invalid lane container id: ' + id); 
        }

        this.intersectionLocation = intersectionLocation;
        this.lanes = [];
        this.createLanes();
        this.configureLanes();

        stoplightController.addChangeEventHandler(this.stoplightChangeHandler);
    }

    /*
        Handles the event triggered when the stoplights change.
    */
    stoplightChangeHandler = (direction, isLeftTurn, newState) => {
        this.lanes.forEach((item) => {
            item.stoplightChanged(direction, isLeftTurn, newState);
        });
    }

    /*
        createLanes - this method creates the base lanes for the container.  The 
            goal is to just set up the base lanes.
    */
    createLanes() {
        for (let i = 0; i < LANE_COUNT; i++) {
            let id = this.id + '-lane' + i;
            let lane = new Lane(id, this.intersectionLocation, false, false);
            this.lanes.push(lane);
        }
    }

    /*
        configureLanes - this method sets up the correct traffic direction and 
            turn lane settings for each lane.  These settings are based on 
            the intersection location and the configuration is a bit cumbersone 
            so it was broken into it's own method for better test-ability.
    */
    configureLanes() {
        if (this.intersectionLocation === Direction.NORTH) {
            // we want to set the first 3 lanes travel direction to South
            this.lanes.forEach((item, index) => {
                item.isRightTurnLane = (index === 0);
                if (index < 3) {
                    item.trafficDirection = Direction.SOUTH;
                }
                else if (index === 3) {
                    item.isLeftTurnLane = true;
                    item.trafficDirection = Direction.SOUTH;
                    let stoplight = this.stoplightController.createStoplight(this.intersectionLocation);
                    stoplight.isLeftTurnLight = true;
                    item.setStoplight(stoplight);
                }
                else {
                    let stoplight = this.stoplightController.createStoplight(this.intersectionLocation);
                    item.setStoplight(stoplight);
                }
                
            });
        }
        else if (this.intersectionLocation === Direction.SOUTH) {
            this.lanes.forEach((item, index) => {
                item.isRightTurnLane = (index === 6);
                if (index < 3) {
                    item.trafficDirection = Direction.SOUTH;
                    let stoplight = this.stoplightController.createStoplight(this.intersectionLocation);
                    item.setStoplight(stoplight);
                }
                else if (index === 3) {
                    item.isLeftTurnLane = true;
                    item.trafficDirection = Direction.NORTH;
                    let stoplight = this.stoplightController.createStoplight(this.intersectionLocation);
                    stoplight.isLeftTurnLight = true;
                    item.setStoplight(stoplight);
                }
                else if (index > 3) {
                    item.trafficDirection = Direction.NORTH;
                }
            });
        }
        else if (this.intersectionLocation === Direction.WEST) {
            this.lanes.forEach((item, index) => {
                item.isRightTurnLane = (index === 6);
                if (index < 3) {
                    item.trafficDirection = Direction.EAST;
                    let stoplight = this.stoplightController.createStoplight(this.intersectionLocation);
                    item.setStoplight(stoplight);
                }
                else if (index === 3) {
                    item.isLeftTurnLane = true;
                    let stoplight = this.stoplightController.createStoplight(this.intersectionLocation);
                    stoplight.isLeftTurnLight = true;
                    item.setStoplight(stoplight);
                }
                
            });
        }
        else if (this.intersectionLocation === Direction.EAST) {
            this.lanes.forEach((item, index) => {
                item.isRightTurnLane = (index === 0);
                if (index > 3) {
                    item.trafficDirection = Direction.WEST;
                    let stoplight = this.stoplightController.createStoplight(this.intersectionLocation);
                    item.setStoplight(stoplight);
                }
                else if (index === 3) {
                    item.isLeftTurnLane = true;
                    let stoplight = this.stoplightController.createStoplight(this.intersectionLocation);
                    stoplight.isLeftTurnLight = true;
                    item.setStoplight(stoplight);
                }
            });
        }
    }

    /*
        draw - adds the lanes to the lane container
    */
    draw() {
        for (let i = 0; i < this.lanes.length; i++) {
            this.lanes[i].draw(this.element);
        }
    }

    getRandomLane() {
        const randomLane = parseInt(Math.random() * 100 / 25, 10);
        // get the lanes without stoplights
        const availableLanes = this.lanes.filter((item) => {
            if (item.isLeftTurnLane) return true;
            else return !item.stoplight;
        });

        return availableLanes[randomLane];
    }
    
}