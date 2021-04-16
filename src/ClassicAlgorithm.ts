import { Cluster, Dendrogram, getDistance } from './Cluster';
import { IAlgorithm, Pair } from './IAlgorithm';
import { Point } from './Point';

export class ClassicAlgorithm implements IAlgorithm {
    dendrograms: Dendrogram[] = [];


    init(points: Point[]): void {
        this.dendrograms = points.slice();
    }


    findNearestTwoPoints(): Pair | undefined {
        let distanceMin = Number.MAX_VALUE;
        let result = undefined;
        let best: number[] | undefined;
        let pt2!: Point;
        for (let i1 = 0; i1 < this.dendrograms.length; i1++) {
            let point1 = this.dendrograms[i1];
            for (let i2 = i1 + 1; i2 < this.dendrograms.length; i2++) {
                let point2 = this.dendrograms[i2];
                let distance = getDistance(point1, point2);
                if (distance < distanceMin) {
                    distanceMin = distance;
                    best = [i1, i2];
                } else if (distance == distanceMin) {
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