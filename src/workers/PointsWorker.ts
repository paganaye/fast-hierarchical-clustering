
import { IPoint } from '../IPoint';
import { Point } from '../Point';


onmessage = function (e) {
    let numberOfPoints: number = e.data.numberOfPoints;

    let groupBy = 25;
    // we group points to make more interesting patterns than just plain random
    let points: IPoint[] = [];
    for (let i = 0; i < numberOfPoints; i++) {
        let center = Point.randomPoint();        
        addRandomPointsAround(points, groupBy, center, 0.05);
    }
    if (points.length >= numberOfPoints) {
        points.length = numberOfPoints;
    }
    postMessage({ points }, undefined as any);
}

function addRandomPointsAround(points: IPoint[], count: number, point: IPoint, distance: number) {
    for (let i = 0; i < count; i++) {
        points.push(Point.randomPointAround(point, distance));
    }
}