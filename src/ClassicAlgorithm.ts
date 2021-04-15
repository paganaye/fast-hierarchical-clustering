import { Cluster, Dendrogram } from './Cluster';
import { IAlgorithm, IPair } from './IAlgorithm';
import { Point } from './Point';

export class ClassicAlgorithm implements IAlgorithm {
    dendrograms: Dendrogram[] = [];


    init(points: Point[]): void {
        this.dendrograms = points.slice();
    }


    findNearestTwoPoints(): IPair | undefined {
        let distanceMin = Number.MAX_VALUE;
        let result = undefined;
        let best: number[] | undefined;
        let pt2!: Point;
        for (let i1 = 0; i1 < this.dendrograms.length; i1++) {
            let point1 = this.dendrograms[i1];
            for (let i2 = i1 + 1; i2 < this.dendrograms.length; i2++) {
                let point2 = this.dendrograms[i2];
                let dx = point1.x - point2.x;
                let dy = point1.y - point2.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < distanceMin) {
                    distanceMin = distance;
                    best = [i1, i2];
                }
            }
        }
        if (best) {
            return {
                point1: this.dendrograms[best[0]],
                point2: this.dendrograms[best[1]],
                merge: () => {
                    let newCluster = new Cluster([this.dendrograms[best![0]], this.dendrograms[best![1]]]);
                    this.dendrograms[best![0]] = newCluster; // replace one
                    this.dendrograms.splice(best![1], 1); // delete the other        
                }
            }
        }
    }
    getCurrentDendrograms(): Dendrogram[] {
        return this.dendrograms;
    }




}