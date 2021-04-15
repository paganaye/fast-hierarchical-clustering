import { Cluster, Dendrogram } from './Cluster';
import { IAlgorithm, IPair } from './IAlgorithm';
import { Point } from './Point';
import { Pair, QuadNode, QuadTree } from './QuadTree';

export class NewAlgorithm implements IAlgorithm {
    quadTree: QuadTree = new QuadTree();

    init(points: Point[]): void {
        for (let point of points) {
            this.quadTree.insert(point);
        }
    }

    findNearestTwoPoints(): IPair | undefined {
        do {
            let neighbours = this.quadTree.getNeighbours();
            if (neighbours.length > 0) {
                neighbours.sort((a, b) => b.distance - a.distance);
                let last = neighbours.pop();
                return {
                    point1: last!.point1,
                    point2: last!.point2,
                    merge: () => {
                        this.quadTree.delete(last!.point1);
                        this.quadTree.delete(last!.point2);
                        let newCluster = new Cluster([last!.point1, last!.point2]);
                        this.quadTree.insert(newCluster);
                    }
                }
            }
        } while (this.quadTree.trim());
    }

    getCurrentDendrograms(): Dendrogram[] {
        return this.quadTree.getDendrograms();
    }

}
