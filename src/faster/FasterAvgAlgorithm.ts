import { Cluster, Dendrogram } from '../Cluster';
import { IAlgorithm } from '../workers/IAlgorithm';
import { Point } from '../Point';
import { FasterQuadTree, PointEx, ClusterEx } from './FasterQuadTree';


export class FasterAvgAlgorithm implements IAlgorithm {
    name: string = "New Average Agglomerative Hierarchical Clustering";
    quadTree: FasterQuadTree;

    constructor(private initialLevels: number = 10, points: Point[] | undefined = undefined) {
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
