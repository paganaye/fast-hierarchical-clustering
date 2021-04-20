import { Cluster, Dendrogram } from '../Cluster';
import { IAlgorithm } from '../workers/IAlgorithm';
import { getDistance, getDistanceSquared } from '../IPoint';
import { Point } from '../Point';

export class ClassicAvgAlgorithm implements IAlgorithm {
    name: string = "Average Agglomerative Hierarchical Clustering";
    dendrograms: Dendrogram[] = [];

    constructor(points: Point[] | undefined = undefined) {
        if (points) this.init(points);
    }

    init(points: Point[]): void {
        this.dendrograms = points.slice();
    }

    *buildClusters(): Generator<Cluster> {
        let cluster: Cluster | undefined;
        do {
            cluster = this.findNearestTwoPoints();
            if (cluster) yield cluster;
        } while (cluster)
    }

    findNearestTwoPoints(): Cluster | undefined {
        let distanceSquaredMin = Number.MAX_VALUE;
        let result = undefined;
        let best: { point1: Dendrogram, point2: Dendrogram, i1: number, i2: number } | undefined;
        let pt2!: Point;
        let len = this.dendrograms.length;
        for (let i1 = 0; i1 < len; i1++) {
            let point1 = this.dendrograms[i1];
            for (let i2 = i1 + 1; i2 < len; i2++) {
                let point2 = this.dendrograms[i2];
                let distanceSquared = getDistanceSquared(point1, point2);
                if (distanceSquared < distanceSquaredMin) {
                    distanceSquaredMin = distanceSquared;
                    best = { point1, point2, i1, i2 };
                } else if (distanceSquared == distanceSquaredMin) {
                    console.warn("We got equal distances");
                }
            }
        }
        if (best) {
            let newCluster = new Cluster(best.point1, best.point2);
            this.dendrograms[best.i1] = newCluster; // replace one
            this.dendrograms.splice(best.i2, 1); // delete the other        
            return newCluster;
        }
    }

    getCurrentDendrograms(): Dendrogram[] {
        return this.dendrograms;
    }

    getDendrogramsCount(): number {
        return this.dendrograms.length;
    }
}