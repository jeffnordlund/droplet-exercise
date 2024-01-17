/**
 * Class used as an enum for the direction values.
 */
class Direction {
    static get NORTHSOUTH() {
        return 'northsouth';
    }

    static get EASTWEST() {
        return 'eastwest';
    }

    static get NORTH() {
        return 'north';
    }

    static get SOUTH() {
        return 'south';
    }

    static get EAST() {
        return 'east';
    }

    static get WEST() {
        return 'west';
    }

    static getOppositeDirection(direction) {
        if (direction === Direction.NORTH) {
            return Direction.SOUTH;
        }
        else if (direction === Direction.SOUTH) {
            return Direction.NORTH;
        }
        else if (direction === Direction.WEST) {
            return Direction.EAST;
        }
        else if (direction === Direction.EAST) {
            return Direction.WEST;
        }
        else {
            return '';
        }
    }
}