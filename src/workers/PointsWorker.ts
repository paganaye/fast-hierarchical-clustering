
import { IPoint } from '../IPoint';
import { Point } from '../Point';

export interface IPointsWorkerInput {
    numberOfPoints: number;
}
export interface IPointsWorkerOutput {
    points: IPoint[];
}

function createPoints(input: IPointsWorkerInput): { points: IPoint[] } {
    let groupBy = 25;
    // we group points to make more interesting patterns than just plain random
    let points: IPoint[] = [];
    for (let i = 0; i < input.numberOfPoints; i++) {
        let center = Point.randomPoint();
        addRandomPointsAround(points, groupBy, center, 0.05);
    }
    if (points.length >= input.numberOfPoints) {
        points.length = input.numberOfPoints;
    }
    return { points };

    function addRandomPointsAround(points: IPoint[], count: number, point: IPoint, distance: number) {
        for (let i = 0; i < count; i++) {
            points.push(Point.randomPointAround(point, distance));
        }
    }
}


onmessage = function (e) {
    postMessage(createPoints(e.data), undefined as any);
}

