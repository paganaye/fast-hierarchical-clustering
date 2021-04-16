import { Cluster, Dendrogram } from './Cluster';
import { IAlgorithm, Pair } from './IAlgorithm';
import { Point } from './Point';
import { QuadPair, QuadNode, QuadTree } from './QuadTree';

export class NewAlgorithm implements IAlgorithm {
    quadTree: QuadTree;
    neighbours: QuadPair[] = [];

    constructor(private initialLevels: number = 32) {
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
                    this.neighbours = this.neighbours.filter(it => it.point1 != point1 && it.point1 != point2 && it.point2 != point1 && it.point2 != point2);
                    this.quadTree.insertAndAddNeighbours(newCluster, this.neighbours);
                    this.neighbours.sort((a, b) => (b.distance - a.distance));
                });
        }
    }

    getCurrentDendrograms(): Dendrogram[] {
        return this.quadTree.getDendrograms();
    }

}
