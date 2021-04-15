// inspired from
// https://github.com/luciopaiva/graham-scan/blob/master/graham-scan.mjs

import { Point } from './Point';

const X = 0;
const Y = 1;

export function getHull(points: Point[]): Point[] {
    const pivot = getTopLeftPoint(points);

    let indexes = Array.from(points, (point, i) => i);
    const angles = Array.from(points, (point) => getAngle(pivot, point));
    const distances = Array.from(points, (point) => euclideanDistanceSquared(pivot, point));

    // sort by angle and distance
    indexes.sort((i, j) => {
        const angleA = angles[i];
        const angleB = angles[j];
        if (angleA === angleB) {
            const distanceA = distances[i];
            const distanceB = distances[j];
            return distanceA - distanceB;
        }
        return angleA - angleB;
    });

    const hull: Point[] = [];
    for (let i = 0; i < indexes.length; i++) {
        const index = indexes[i];
        const point = points[index];

        if (hull.length < 3) {
            hull.push(point);
        } else {
            while (checkOrientation(hull[hull.length - 2], hull[hull.length - 1], point) > 0) {
                hull.pop();
            }
            hull.push(point);
        }
    }
    return hull;
}

/**
 * Check the orientation of 3 points in the order given.
 *
 * It works by comparing the slope of P1->P2 vs P2->P3. If P1->P2 > P2->P3, orientation is clockwise; if
 * P1->P2 < P2->P3, counter-clockwise. If P1->P2 == P2->P3, points are co-linear.
 */
 function checkOrientation(p1: Point, p2: Point, p3: Point): number {
    return (p2.y - p1.y) * (p3.x - p2.x) - (p3.y - p2.y) * (p2.x - p1.x);
}

function getAngle(a: Point, b: Point) {
    return Math.atan2(b.y - a.y, b.x - a.x);
}

function euclideanDistanceSquared(p1: Point, p2: Point) {
    const a = p2.x - p1.x;
    const b = p2.y - p1.y;
    return a * a + b * b;
}

function getTopLeftPoint(points: Point[]): Point {
    let pivot = points[0];
    let pivotIndex = 0;
    for (let i = 1; i < points.length; i++) {
        const point = points[i];
        if (point.y < pivot.y || point.y === pivot.y && point.x < pivot.x) {
            pivot = point;
            pivotIndex = i;
        }
    }
    return pivot;
}
