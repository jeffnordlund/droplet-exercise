/**
 * Factory class that creates new cars.
 */
class CarFactory {

    constructor() {
        this.cars = [];
        this.createdCount = 1;
    }

    /*
        Create a new car.  We'll give it a meaningless id in case we 
        need to reference it in code for some reason.  We also 
        assign the lane the car will start in.
    */
    create(trafficLane) {
        const car = new Car(this.createdCount, trafficLane);
        this.createdCount++;
        this.cars.push(car);
        return car;
    }
}
