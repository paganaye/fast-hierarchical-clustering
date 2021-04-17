import { Cluster, Dendrogram } from '../Cluster';
import { IAlgorithm } from '../IAlgorithm';
import { Pair } from './Pair';
import { Point } from '../Point';
import { QuadPair, QuadNode, QuadTree } from './QuadTree';

export class NewAvgAlgorithm implements IAlgorithm {
    name: string = "New Average Agglomerative Hierarchical Clustering";
    quadTree: QuadTree;
    neighbours: QuadPair[] = [];

    constructor(private initialLevels: number = 20) {
        this.quadTree = new QuadTree(initialLevels);
    }
  
    init(points: Point[]): void {
        for (let point of points) {
            this.quadTree.insert(point);
        }
        this.neighbours = this.quadTree.getNeighbours();
        this.neighbours.sort((a, b) => (b.distance - a.distance));
    }

    findNearestTwoPoints(): Pair | undefined {
        while (true) {
            while (this.neighbours.length == 0) {
                if (!this.quadTree.trim()) return undefined;
                this.neighbours = this.quadTree.getNeighbours();
                this.neighbours.sort((a, b) => (b.distance - a.distance));
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
                    this.quadTree.insertAndAddNeighbours(newCluster, newNeighbours);
                    newNeighbours.sort((a, b) => (b.distance - a.distance));
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

            if (!entryB || (entryA && entryA.distance > entryB.distance)) {
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
