import { Cluster, Dendrogram } from '../Cluster';
import { IAlgorithm } from '../IAlgorithm';
import { getDistance, getDistanceSquared } from '../IPoint';
import { Pair } from './Pair';
import { Point } from '../Point';

export class ClassicAvgAlgorithm implements IAlgorithm {
    name: string = "Average Agglomerative Hierarchical Clustering";
    dendrograms: Dendrogram[] = [];


    init(points: Point[]): void {
        this.dendrograms = points.slice();
    }


    findNearestTwoPoints(): Pair | undefined {
        let distanceSquaredMin = Number.MAX_VALUE;
        let result = undefined;
        let best: number[] | undefined;
        let pt2!: Point;
        let len = this.dendrograms.length;
        for (let i1 = 0; i1 < len; i1++) {
            let point1 = this.dendrograms[i1];
            for (let i2 = i1 + 1; i2 < len; i2++) {
                let point2 = this.dendrograms[i2];
                let distanceSquared = getDistanceSquared(point1, point2);
                if (distanceSquared < distanceSquaredMin) {
                    distanceSquaredMin = distanceSquared;
                    best = [i1, i2];
                } else if (distanceSquared == distanceSquaredMin) {
                    console.warn("We got equal distances");
                }
            }
        }
        if (best) {
            return new Pair(
                this.dendrograms[best[0]],
                this.dendrograms[best[1]],
                () => {
                    let newCluster = new Cluster(this.dendrograms[best![0]], this.dendrograms[best![1]]);
                    this.dendrograms[best![0]] = newCluster; // replace one
                    this.dendrograms.splice(best![1], 1); // delete the other        
                });
        }
    }

    getCurrentDendrograms(): Dendrogram[] {
        return this.dendrograms;
    }

    getDendrogramsCount(): number {
        return this.dendrograms.length;
    }    
}