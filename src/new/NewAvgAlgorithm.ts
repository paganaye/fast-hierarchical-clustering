import { Cluster, Dendrogram } from '../Cluster';
import { IAlgorithm } from '../workers/IAlgorithm';
import { Point } from '../Point';
import { QuadPair, QuadTree } from './QuadTree';

export class NewAvgAlgorithm implements IAlgorithm {
    className = "NewAvgAlgorithm";
    name: string = "New Average Agglomerative Hierarchical Clustering";
    quadTree: QuadTree;
    pairs: QuadPair[] = [];
    maxDistance: number;
    targetPairsCount: number;
    increment: number;
    passNo: number;

    constructor(private initialLevels: number = 10, points: Point[] | undefined = undefined) {
        this.quadTree = new QuadTree(initialLevels);
        if (points) this.init(points);
        this.maxDistance = 1e-4;
        this.increment = 0.05;
        this.targetPairsCount = 100;
        this.passNo = 0;
    }

    init(points: Point[]): void {
        for (let point of points) {
            this.quadTree.insert(point);
        }
        // originally we take a very small distance and a large increment
        this.maxDistance = 1 / points.length;
        this.targetPairsCount = Math.round(Math.log(points.length) * 120);
        if (this.targetPairsCount < 100) this.targetPairsCount = 100;
        this.pairs = this.quadTree.getPairs(this.maxDistance);
        this.pairs.sort((a, b) => (b.distanceSquared - a.distanceSquared));

    }

    *forEachClusters(): Generator<Cluster> {
        let cluster: Cluster | undefined;
        do {
            if (this.pairs.length == 0 && !this.getNextPairs()) return;
            let { point1, point2 } = this.pairs.pop()!;
            cluster = new Cluster(point1, point2);
            this.quadTree.delete(point1, cluster);
            this.quadTree.delete(point2, cluster);
            let newPairs: QuadPair[] = [];
            this.quadTree.insertAndAddPairs(cluster, this.maxDistance, newPairs);
            newPairs.sort((a, b) => (b.distanceSquared - a.distanceSquared));
            this.pairs = this.filterAndMerge(it => it.point1 != point1 && it.point1 != point2 && it.point2 != point1 && it.point2 != point2, newPairs);
            yield cluster;

        } while (cluster)
    }


    getNextPairs(): boolean {
        do {
            this.passNo += 1;
            this.maxDistance = this.maxDistance * (1 + this.increment);
            let nodeSize = this.quadTree.firstLeaf()?.nodeSize!;
            while (this.maxDistance >= nodeSize) {
                if (!this.quadTree.trim()) return false;
                nodeSize = this.quadTree.firstLeaf()?.nodeSize!;
            }
            this.pairs = this.quadTree.getPairs(this.maxDistance);
            this.pairs.sort((a, b) => (b.distanceSquared - a.distanceSquared));
            // we adjust the increment for the next batch
            let message = `Pass ${this.passNo} getting neighbours below ${this.maxDistance.toFixed(5)}: ${this.pairs.length} points. `;
            if (this.pairs.length > this.targetPairsCount) {
                message += `We're over ${this.targetPairsCount}. Breaking hard.`;
                this.increment *= 0.5; // we are already over so we brake fast
            }
            else if (this.pairs.length < this.targetPairsCount / 2) {
                message += `We're below ${this.targetPairsCount / 2}, accelerating.`;
                this.increment *= 1.2; // we accelerate more gently
                if (this.increment > 1) this.increment = 1;
            }
            console.log(message);
        } while (this.pairs.length == 0)
        return true;
    }

    filterAndMerge(predicate: (cluster: QuadPair) => boolean, newPairs: QuadPair[]): QuadPair[] {
        let arrSorted: QuadPair[] = [];
        let idxA = 0, idxB = 0, idxS = 0;
        let arrA = this.pairs;
        let arrB = newPairs;

        while (idxA < arrA.length || idxB < arrB.length) {
            let entryA = idxA < arrA.length ? arrA[idxA] : undefined;
            let entryB = idxB < arrB.length ? arrB[idxB] : undefined;

            if (!entryB || (entryA && entryA.distanceSquared > entryB.distanceSquared)) {
                if (predicate(entryA as QuadPair))
                    arrSorted.push(entryA!);
                idxA++;
            }
            else {
                arrSorted.push(entryB);
                idxB++;
            }
        }
        return arrSorted;
    }

    getCurrentDendrograms(): Dendrogram[] {
        return this.quadTree.getDendrograms();
    }

    getDendrogramsCount(): number {
        return this.quadTree.pointCount;
    }
}
