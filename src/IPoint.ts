
export interface IPoint {
    readonly x: number;
    readonly y: number;
}

export var calculatedDistances: number = 0;

export function clearCalculatedDistances() {
    calculatedDistances = 0;
}

export function getDistance(pt1: IPoint, pt2: IPoint) {
    let dx = pt1.x - pt2.x;
    let dy = pt1.y - pt2.y;
    calculatedDistances += 1;
    return Math.sqrt(dx * dx + dy * dy);
}

// it is a bit faster not to do do the square root.
export function getDistanceSquared(pt1: IPoint, pt2: IPoint) {
    let dx = pt1.x - pt2.x;
    let dy = pt1.y - pt2.y;
    calculatedDistances += 1;
    return dx * dx + dy * dy;
}