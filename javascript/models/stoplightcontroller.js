
/*
    This is the list of light state objects.  To make tweaks to the 
    light cycles -- increase or decrease the light times for example -- modify 
    these states.  Since the lights operate in tandem the states are used 
    for north-south or east-west combinations of lights.
*/
const TRAFFIC_LIGHT_STATES = [
    { 
        direction: 'north-south',
        lightState: 'green',
        displaySeconds: 10
    },
    { 
        direction: 'north-south',
        lightState: 'yellow',
        displaySeconds: 2
    },
    { 
        direction: 'north-south',
        lightState: 'red',
        displaySeconds: 0
    },
    { 
        direction: 'east-west',
        leftTurn: true,
        lightState: 'green',
        displaySeconds: 10
    },
    { 
        direction: 'east-west',
        leftTurn: true,
        lightState: 'yellow',
        displaySeconds: 2
    },
    { 
        direction: 'east-west',
        leftTurn: true,
        lightState: 'red',
        displaySeconds: 0
    },
    { 
        direction: 'east-west',
        lightState: 'green',
        displaySeconds: 10
    },
    { 
        direction: 'east-west',
        lightState: 'yellow',
        displaySeconds: 2
    },
    { 
        direction: 'east-west',
        lightState: 'red',
        displaySeconds: 0
    },
    { 
        direction: 'north-south',
        leftTurn: true,
        lightState: 'green',
        displaySeconds: 10
    },
    { 
        direction: 'north-south',
        leftTurn: true,
        lightState: 'yellow',
        displaySeconds: 2
    },
    { 
        direction: 'north-south',
        leftTurn: true,
        lightState: 'red',
        displaySeconds: 0
    }
];

/**
 * Provides the centralized control for all stoplights.  It will cycle through the list 
 * of states and communicate to the child stoplights the state they should be in.  This 
 * allows us to easily control the lights and make sure we don't have glitches that 
 * cause accidents.
 */
class StoplightController {
    constructor() {
        this.stoplights = [];
        this.activeState = 0;
        this.onStoplightStateChange = null;
        this.changeEventHandlers = [];
    }

    /*
        Add a callback method used when the light change.  This is used by the 
        LaneContainer objects to watch for stoplight changes.
    */
    addChangeEventHandler(eventHandler) {
        this.changeEventHandlers.push(eventHandler);
    }

    createStoplight(trafficDirection) {
        const stoplight = new StopLight(trafficDirection);
        this.stoplights.push(stoplight);
        return stoplight;
    }

    /*
        Gets all the stoplights for a given direction/left-turn combination.
    */
    getStoplights(direction, isLeftTurn) {
        const directions = direction.split('-');
        const stoplights = this.stoplights.filter((item) => {
            return directions.includes(item.trafficDirection) && item.isLeftTurnLight === isLeftTurn;
        });

        return stoplights;
    }

    /*
        Changes the state of the lights.  It uses the list of light states and just 
        cycles through the sequentially to run the lights through the cycles.
    */
    changeState() {
        // console.log(this.activeState);
        const state = TRAFFIC_LIGHT_STATES[this.activeState];
        const isLeftTurn = state.leftTurn || false;
        const stopLights = this.getStoplights(state.direction, isLeftTurn);
        stopLights.forEach(item => {
            if (state.lightState === 'green') {
                item.setGo();
            }
            else if (state.lightState === 'yellow') {
                item.setYield();
            }
            else if (state.lightState === 'red') {
                item.setStop();
            }
        });

        if (this.changeEventHandlers.length > 0) {
            const directions = state.direction.split('-'); // split out the combined direction
            // trigger the change for each direction
            this.changeEventHandlers.forEach(handler => handler(directions[0], isLeftTurn, state.lightState));
            this.changeEventHandlers.forEach(handler => handler(directions[1], isLeftTurn, state.lightState));
        }

        const timeout = state.displaySeconds * 1000 || 100;
        setTimeout(() => {
            this.activeState++;
            if (this.activeState >= TRAFFIC_LIGHT_STATES.length) this.activeState = 0;
            // console.log('in timeout, active state: ' + this.activeState);
            this.changeState();
        }, timeout);
    }
}
