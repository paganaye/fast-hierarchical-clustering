import { Cluster, Dendrogram } from './Cluster';
import { IAlgorithm } from './IAlgorithm';
import { Point } from './Point';
import { Pair, QuadNode, QuadTree } from './QuadTree';

export class NewAlgorithm implements IAlgorithm {
    initialNegligibleDistance = 1e-6;
    quadTree: QuadTree = new QuadTree();
    clusterCountTarget!: number;
    paint!: (dendrograms: Dendrogram[]) => void;
    finished!: (dendrograms: Dendrogram[]) => void;
    neighbours: Pair[] = [];

    run(points: Point[], clusterCount: number, paint: (dendrograms: Dendrogram[]) => void, finished: (dendrograms: Dendrogram[]) => void): void {
        // throw new Error('Method not implemented.');
        this.clusterCountTarget = clusterCount;
        this.paint = paint;
        this.finished = finished;
        for (let point of points) {
            this.quadTree.insert(point);
        }
        this.getNextNeighbours();
        setTimeout(() => this.groupTwo(), 0);
    }

    groupTwo() {
        if (this.neighbours.length) {
            let last = this.neighbours.pop();
            let newCluster = new Cluster([last!.point1, last!.point2]);
            this.quadTree.delete(last!.point1);
            this.quadTree.delete(last!.point1);
            this.quadTree.insert(newCluster);
            this.paint(this.quadTree.getDendrograms());
        } else {
            if (this.getNextNeighbours()) setTimeout(() => this.groupTwo(), 0);
            else this.finished(this.quadTree.getDendrograms());
        }
    }

    getNextNeighbours() {
        let result = this.quadTree.trim();
        if (result) {
            this.neighbours = this.quadTree.getNeighbours();
            this.neighbours.sort((a, b) => a.distance - b.distance);
            return true;
        }
        else return false;
    }
}
