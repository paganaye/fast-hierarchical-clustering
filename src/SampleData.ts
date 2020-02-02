import { Point, getNextPointId } from "./Point";
import { random } from "./Random";

export enum SampleDataset {
    Small,
    Medium,
    Large
}

export function createPoints(dataset: SampleDataset): Point[] {
    switch (dataset) {
        case SampleDataset.Small:
            var nbPoints = 50;
            var areaWidth = 50;
            var areaWeight = 50;
            break;
        case SampleDataset.Medium:
            var nbPoints = 10_000;
            var areaWidth = 10_000;
            var areaWeight = 10_000;
            break;
        case SampleDataset.Large:
            var nbPoints = 1_000_000;
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
