import { Cluster, Dendrogram } from '../Cluster';
import { IAlgorithm } from '../workers/IAlgorithm';
import { Point } from '../Point';
import { FasterQuadTree } from './FasterQuadTree';
import { ClusterEx, PointEx } from './FasterQuadNode';


export class FasterAvgAlgorithm implements IAlgorithm {
    className = "FasterAvgAlgorithm";
    name: string = "New Average Agglomerative Hierarchical Clustering";
    quadTree: FasterQuadTree;

    constructor(points: Point[] | undefined = undefined, private initialLevels: number = 10) {
        this.quadTree = new FasterQuadTree(initialLevels);
        if (points) this.init(points);
    }

    init(points: Point[]): void {
        for (let point of points) {
            this.quadTree.insert(new PointEx(point.x, point.y, point.tag));
        }
    }

    *forEachClusters(): Generator<ClusterEx> {
        do {
            yield* this.quadTree.forEachClusters();
        } while (this.quadTree.trim());
    }

    getCurrentDendrograms(): Dendrogram[] {
        return this.quadTree.getDendrograms();
    }

    getDendrogramsCount(): number {
        return this.quadTree.pointCount;
    }
}
