import { Point, getNextPointId, resetPointIdCounter } from "./Point";
import { random, randomize } from "./Random";
import { Log, LogLevel } from "./Log";

export enum SampleDataset {
    Tiny,
    Small,
    Medium,
    Large
}

export function createPoints(dataset: SampleDataset, seed?: number): Point[] {
    randomize(seed)
    resetPointIdCounter();
    switch (dataset) {
        case SampleDataset.Tiny:
            var nbPoints = 5;
            var areaWidth = 5;
            var areaWeight = 5;
            break;
        case SampleDataset.Small:
            var nbPoints = 50;
            var areaWidth = 50;
            var areaWeight = 50;
            break;
        case SampleDataset.Medium:
            var nbPoints = 5_000;
            var areaWidth = 2_000;
            var areaWeight = 2_000;
            break;
        case SampleDataset.Large:
            var nbPoints = 100_000;
            var areaWidth = 100_000;
            var areaWeight = 100_000;
            break;
    }
    var points = new Array(nbPoints).fill(0).map(() => {
        let id = getNextPointId();
        let x = Math.floor(random() * areaWidth * 10) / 10;
        let y = Math.floor(random() * areaWeight * 10) / 10;
        return { id, x, y, weight: 1 };
    });
    return points;
}
