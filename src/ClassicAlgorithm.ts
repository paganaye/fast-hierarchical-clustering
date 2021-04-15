import { Cluster, Dendrogram } from './Cluster';
import { IAlgorithm } from './IAlgorithm';
import { Point } from './Point';

export class ClassicAlgorithm implements IAlgorithm {
    dendrograms: Dendrogram[] = [];
    clusterCountTarget!: number;
    paint!: (dendrograms: Dendrogram[]) => void;
    finished!: (dendrograms: Dendrogram[]) => void;

    run(points: Point[], clusterCount: number, paint: (dendrograms: Dendrogram[]) => void, finished: (dendrograms: Dendrogram[]) => void): void {
        // throw new Error('Method not implemented.');
        this.dendrograms = [...points]
        this.clusterCountTarget = clusterCount;
        this.paint = paint;
        this.finished = finished;

        setTimeout(() => this.groupTwo(), 0);
    }

    groupTwo() {
        let pair = this.findNearestTwoPoints()
        if (pair) {
            let newCluster = new Cluster([this.dendrograms[pair[0]], this.dendrograms[pair[1]]]);
            this.dendrograms[pair[0]] = newCluster; // replace one
            this.dendrograms.splice(pair[1], 1); // delete the other
            this.paint(this.dendrograms);
            if (this.dendrograms.length > this.clusterCountTarget) setTimeout(() => this.groupTwo(), 0);
            else this.finished(this.dendrograms);
        }
    }

    findNearestTwoPoints(): number[] | undefined {
        let distanceMin = Number.MAX_VALUE;
        let result = undefined;
        for (let i1 = 0; i1 < this.dendrograms.length; i1++) {
            let point1 = this.dendrograms[i1];
            for (let i2 = i1 + 1; i2 < this.dendrograms.length; i2++) {
                let point2 = this.dendrograms[i2];
                let dx = point1.x - point2.x;
                let dy = point1.y - point2.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < distanceMin) {
                    distanceMin = distance;
                    result = [i1, i2];
                }
            }
        }
        return result;
    }

}