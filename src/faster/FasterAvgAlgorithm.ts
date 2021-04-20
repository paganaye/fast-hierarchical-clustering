import { Cluster, Dendrogram } from '../Cluster';
import { IAlgorithm } from '../workers/IAlgorithm';
import { Pair } from '../Pair';
import { Point } from '../Point';
import { QuadPair, FasterQuadTree } from './FasterQuadTree';

export class FasterAvgAlgorithm implements IAlgorithm {
    name: string = "New Average Agglomerative Hierarchical Clustering";
    quadTree: FasterQuadTree;
    neighbours: QuadPair[] = [];
    maxDistance: number = 0;
    targetNeighboursCount!: number;
    increment!: number;

    constructor(private initialLevels: number = 10) {
        this.quadTree = new FasterQuadTree(initialLevels);
    }

    init(points: Point[]): void {
        for (let point of points) {
            this.quadTree.insert(point);
        }
        // originally we take a very small distance and a large increment
        this.maxDistance = 1 / points.length;
        this.increment = 0.05;
        this.targetNeighboursCount = Math.round(Math.log(points.length) * 120);
        if (this.targetNeighboursCount < 100) this.targetNeighboursCount = 100;

        this.neighbours = this.quadTree.getNeighbours(this.maxDistance);
        this.neighbours.sort((a, b) => (b.distanceSquared - a.distanceSquared));

    }



    findNearestTwoPoints(): Pair | undefined {
        while (true) {
            while (this.neighbours.length == 0) {
                this.maxDistance = this.maxDistance * (1 + this.increment);
                let nodeSize = this.quadTree.firstLeaf()?.nodeSize!;
                while (this.maxDistance >= nodeSize) {
                    if (!this.quadTree.trim()) return undefined;
                    nodeSize = this.quadTree.firstLeaf()?.nodeSize!;
                }
                this.neighbours = this.quadTree.getNeighbours(this.maxDistance);
                this.neighbours.sort((a, b) => (b.distanceSquared - a.distanceSquared));

                // we adjust the increment for the next batch
                if (this.neighbours.length > this.targetNeighboursCount) this.increment *= 0.5; // we brake fast
                else if (this.neighbours.length < this.targetNeighboursCount / 2) {
                    this.increment *= 1.2; // we accelerate more gently
                    if (this.increment > 1) this.increment = 1;
                }

                // console.log({ maxDistance: this.maxDistance, neighbours: this.neighbours.length, nextIncrement: this.increment, });
            }

            let { point1, point2 } = this.neighbours.pop()!;
            return new Pair(
                point1,
                point2,
                () => {
                    this.quadTree.delete(point1);
                    this.quadTree.delete(point2);
                    let newCluster = new Cluster(point1, point2);
                    let newNeighbours: QuadPair[] = [];
                    this.quadTree.insertAndAddNeighbours(newCluster, this.maxDistance, newNeighbours);
                    newNeighbours.sort((a, b) => (b.distanceSquared - a.distanceSquared));
                    this.neighbours = this.filterAndMerge(it => it.point1 != point1 && it.point1 != point2 && it.point2 != point1 && it.point2 != point2, newNeighbours);
                });
        }
    }

    filterAndMerge(predicate: (pair: QuadPair) => boolean, newNeighbours: QuadPair[]): QuadPair[] {
        let arrSorted: QuadPair[] = [];
        let idxA = 0, idxB = 0, idxS = 0;
        let arrA = this.neighbours;
        let arrB = newNeighbours;

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
