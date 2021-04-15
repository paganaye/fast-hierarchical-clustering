import { Point } from './Point';
export abstract class Points {

    static addRandomPoints(points: Point[], count: number) {
        for (let i = 0; i < count; i++) {
            points.push(Point.randomPoint());
        }
    }

    static addRandomPointsAround(points: Point[], count: number, point: Point, distance: number) {
        for (let i = 0; i < count; i++) {
            points.push(Point.randomPointAround(point, distance));
        }
    }
}