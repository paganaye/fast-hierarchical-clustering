import { Point, getNextPointId, resetPointIdCounter } from "./Point";
import { random, randomize } from "./Random";
import { Log, LogLevel } from "./Log";


export function createPoints(nbPoints: number, areaSize?: number, seed?: number): Point[] {
    randomize(seed)
    resetPointIdCounter();
    if (!areaSize) areaSize = 100_000;
    var points = new Array(nbPoints).fill(0).map(() => {
        let id = getNextPointId();
        let x = Math.floor(random() * areaSize! * 10) / 10;
        let y = Math.floor(random() * areaSize! * 10) / 10;
        return { id, x, y, weight: 1 };
    });
    return points;
}
