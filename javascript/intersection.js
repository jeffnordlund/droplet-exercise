
let northLaneContainer = null,
    westLaneContainer = null,
    eastLaneContainer = null,
    southLaneContainer = null,
    stoplightController = null,
    carFactory = null;


/*
    add a new car to a random lane.
*/
function addCar() {
    const laneblock = parseInt(Math.random() * 100 / 25, 10);
    let lane = null;

    switch(laneblock) {
        case 1:
            lane = northLaneContainer.getRandomLane();
            break;
        case 2:
            lane = southLaneContainer.getRandomLane();
            break;
        case 3:
            lane = westLaneContainer.getRandomLane();
            break;
        default: 
            lane = eastLaneContainer.getRandomLane();
            break;
    }

    const car = carFactory.create(lane);
    lane.addCar(car);
}

/*
    start the intersection demonstration.
*/
function start() {
    document.getElementById('greetingdisplay').style.display = 'none';
    document.getElementById('intersectioncontainer').style.display = 'block';

    // kick off the traffic signal timer
    stoplightController.changeState();

    // create the car factory
    carFactory = new CarFactory();

    // create the first car immediately so it doesn't look broken
    addCar();

    // kick off the car generation.  we're going to limit this to 102 cars for now.
    let counter = 0;
    const interval = setInterval(() => {
        addCar();
        counter++;

        if (counter > 100) clearInterval(interval);
    }, 2000);
}

window.onload = function () {
    const hour = new Date().getHours();
    if (hour < 12) {
        document.getElementById('greeting').innerText = 'Good Morning!';
    }
    else {
        document.getElementById('greeting').innerText = 'Good Afternoon!';
    }

    document.getElementById('startbutton').addEventListener('click', function () {
        start();
    });

    stoplightController = new StoplightController();

    // set up the lane containers, one for each direction
    northLaneContainer = new LaneContainer('northlanecontainer', Direction.NORTH, stoplightController);
    eastLaneContainer = new LaneContainer('westlanecontainer', Direction.WEST, stoplightController);
    westLaneContainer = new LaneContainer('eastlanecontainer', Direction.EAST, stoplightController);
    southLaneContainer = new LaneContainer('southlanecontainer', Direction.SOUTH, stoplightController);

    // have the containers draw their lanes
    northLaneContainer.draw();
    southLaneContainer.draw();
    westLaneContainer.draw();
    eastLaneContainer.draw();
};
