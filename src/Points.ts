import { Point } from './Point';
export class Points {
    
    readonly points: Point[]=[];

    addRandomPoints(count: number) {
        for(let i = 0; i< count;i++) {
            this.points.push(Point.randomPoint());
        }
    }

    addRandomPointsAround(count: number, point: Point, distance: number) {
        for(let i = 0; i< count;i++) {
            this.points.push(Point.randomPointAround(point, distance));
        }
    }    
}