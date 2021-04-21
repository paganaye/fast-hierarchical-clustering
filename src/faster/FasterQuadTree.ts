import { maxHeaderSize } from 'http';
import { Cluster, Dendrogram } from '../Cluster';
import { getDistance, getDistanceSquared, IPoint } from '../IPoint';
import { QuadPair } from '../new/QuadTree';
import { Point } from '../Point';
import { Sibling, Siblings } from './Siblings';

//import { Point } from './Point';


export class FasterQuadTree {
    private currentLevels: number;
    root: QuadNode;
    rootSiblings: Siblings;
    pointCount = 0;

    constructor(private initialLevels: number) {
        this.currentLevels = initialLevels
        this.root = new QuadNode(undefined, initialLevels - 1, Quarter.TopLeft, 0.5, 0.5, 0.5);
        this.root.nodeSize = Number.POSITIVE_INFINITY; // we need to allow the root node to group points that are further than 1.0 appart.
        this.root.nodeSizeSquared = this.root.nodeSize * this.root.nodeSize;
        this.rootSiblings = Siblings.forRoot(this.root);
    }

    insert(point: DendrogramEx) {
        this.pointCount += 1;
        this.root.insert(point);
    }

    trim(): boolean {
        if (this.root.level == 0) return false;
        else {
            this.root.trim();
            return true;
        }
    }

    firstLeaf(): QuadNode | undefined {
        let result: QuadNode | undefined = undefined;
        let current: QuadNode | undefined = this.root;
        while (current) {
            result = current;
            current = current.topLeft || current.topRight || current.bottomLeft || current.bottomRight;
        }
        return result;
    }

    *forEachClusters(): Generator<ClusterEx> {
        for (let cluster of this.root.forEachClusters(this.rootSiblings)) {
            this.pointCount -= 1;
            yield cluster;
        }
    }

    getDendrograms(): DendrogramEx[] {
        let result: DendrogramEx[] = [];
        this.root.getDendrograms(result);
        return result;
    }

    print() {
        this.root.print('');
    }

    getAllClusters(): DendrogramEx[] {
        let result: DendrogramEx[] = [];
        let generator = this.forEachClusters();
        let cluster: DendrogramEx;
        while (cluster = generator.next().value) result.push(cluster);
        return result;
    }


    forEachSiblings(): Generator<Siblings> {
        return this.root.forEachSiblings(this.rootSiblings);
    }
}

export enum Quarter {
    TopLeft,
    TopRight,
    BottomLeft,
    BottomRight
}

export class QuadNode {
    nodeSize: number;
    nodeSizeSquared: number;
    quarterSize: number;
    topLeft: QuadNode | undefined;
    topRight: QuadNode | undefined;
    bottomLeft: QuadNode | undefined;
    bottomRight: QuadNode | undefined;
    points: DendrogramEx[] | undefined;

    constructor(readonly parent: QuadNode | undefined, public level: number, public readonly quarter: Quarter, readonly x: number, readonly y: number, halfSize: number) {
        this.nodeSize = halfSize * 2;
        this.nodeSizeSquared = this.nodeSize * this.nodeSize;
        this.quarterSize = halfSize / 2;
    }

    *forEachClusters(siblings: Siblings | undefined): Generator<ClusterEx> {
        if (!siblings) return;
        if (this.level == 0) {
            let result: QuadPairEx[] = [];
            this.addSelfPairs(result, siblings);
            this.addPairsWith(siblings, Sibling.Right, result);
            this.addPairsWith(siblings, Sibling.BottomLeft, result);
            this.addPairsWith(siblings, Sibling.Bottom, result);
            this.addPairsWith(siblings, Sibling.BottomRight, result);
            if (result.length == 0) return;
            result.sort((a, b) => b.distanceSquared - a.distanceSquared);
            while (result.length) {
                let quadPair = result.pop()!;
                if (quadPair.point1.mergedIn || quadPair.point2.mergedIn) continue;
                if (QuadNode.hasBetterSelfPair(quadPair)
                    || QuadNode.hasBetterPair(quadPair, quadPair.node2Siblings?.getNode(Sibling.TopLeft))
                    || QuadNode.hasBetterPair(quadPair, quadPair.node2Siblings?.getNode(Sibling.Top))
                    || QuadNode.hasBetterPair(quadPair, quadPair.node2Siblings?.getNode(Sibling.TopRight))
                    || QuadNode.hasBetterPair(quadPair, quadPair.node2Siblings?.getNode(Sibling.Left))
                    || QuadNode.hasBetterPair(quadPair, quadPair.node2Siblings?.getNode(Sibling.Right))
                    || QuadNode.hasBetterPair(quadPair, quadPair.node2Siblings?.getNode(Sibling.BottomLeft))
                    || QuadNode.hasBetterPair(quadPair, quadPair.node2Siblings?.getNode(Sibling.Bottom))
                    || QuadNode.hasBetterPair(quadPair, quadPair.node2Siblings?.getNode(Sibling.BottomRight)))
                    continue;
                // 🡸🡽🡹🡼 done before

                let newCluster = new ClusterEx(quadPair.point1, quadPair.point2);
                quadPair.point1.mergedIn = newCluster;
                quadPair.point2.mergedIn = newCluster;
                if (this.addNewPairs(newCluster, result)) {
                    result.sort((a, b) => b.distanceSquared - a.distanceSquared);
                }
                this.points?.push(newCluster);
                yield newCluster;
            }
        } else if (siblings) {
            let x: Generator<ClusterEx> | undefined;
            x = this.topLeft?.forEachClusters(siblings.getQuarter(Quarter.TopLeft)); // ⌜
            if (x) yield* x;
            x = this.topRight?.forEachClusters(siblings.getQuarter(Quarter.TopRight));// ⌝
            if (x) yield* x;
            x = this.bottomLeft?.forEachClusters(siblings.getQuarter(Quarter.BottomLeft));// ⌞
            if (x) yield* x;
            x = this.bottomRight?.forEachClusters(siblings.getQuarter(Quarter.BottomRight));// ⌟
            if (x) yield* x;
        }
    }

    static hasBetterSelfPair({ point2, distanceSquared, node2Siblings }: QuadPairEx) {
        let node = node2Siblings?.node;
        if (!node || !node.points) return false;

        for (let point3 of node.points) {
            if (point3.mergedIn || point3 == point2) continue;
            let newDistanceSquared = getDistanceSquared(point2, point3);
            if (newDistanceSquared < distanceSquared) return true;
        }
        return false;
    }

    static hasBetterPair({ point2, distanceSquared }: QuadPairEx, node: QuadNode | undefined) {
        if (!node || !node.points) return false;

        for (let point3 of node.points) {
            if (point3.mergedIn || point3 == point2) continue;
            let newDistanceSquared = getDistanceSquared(point2, point3);
            if (newDistanceSquared < distanceSquared) return true;
        }
        return false;
    }

    private addSelfPairs(result: QuadPairEx[], siblings: Siblings) {
        if (!this.points || this.points.length < 2) return;
        for (let i = 0; i < this.points.length; i++) {
            let point1 = this.points[i];
            for (let j = i + 1; j < this.points.length; j++) {
                let point2 = this.points[j];
                let distanceSquared = getDistanceSquared(point1, point2);
                if (distanceSquared < this.nodeSizeSquared) result.push(new QuadPairEx(point1, point2, undefined, siblings, distanceSquared))
            }
        }
    }

    private addPairsWith(siblings: Siblings, sibling: Sibling,
        result: QuadPairEx[]) {
        if (!this.points || this.points.length == 0) return;
        let node2 = siblings.getNode(sibling);
        let points2 = node2?.points;
        if (points2 && points2.length) {
            let node2Siblings: Siblings | undefined;
            for (let point1 of this.points) {
                if (point1.mergedIn) continue;
                for (let point2 of points2) {
                    if (point2.mergedIn) continue;
                    let distanceSquared = getDistanceSquared(point1, point2);
                    if (!node2Siblings) {
                        node2Siblings = siblings.getSibling(sibling)
                    }
                    if (distanceSquared < this.nodeSizeSquared) result.push(new QuadPairEx(point1, point2, sibling, node2Siblings, distanceSquared))
                }
            }
        }
    }

    private addNewPairs(cluster: ClusterEx, result: QuadPairEx[]) {
        if (!this.points || !this.points.length) return false;
        let addedSomething = false;
        let originalLength = this.points.length
        for (let i = 0; i < originalLength; i++) {
            let point1 = this.points[i];
            if (point1.mergedIn) continue;
            let distanceSquared = getDistanceSquared(point1, cluster);
            if (distanceSquared < this.nodeSizeSquared) {
                result.push(new QuadPairEx(point1, cluster, undefined, undefined, distanceSquared))
                addedSomething = true;
            }
        }
        return addedSomething;
    }


    insert(point: DendrogramEx) {
        if (this.level > 0) {
            let quarter = this.getQuarter(point);
            let node = this.getOrCreateNode(quarter);
            node.insert(point);
        } else {
            (this.points || (this.points = [])).push(point)
        }
    }

    movePointsTo(target: DendrogramEx[]) {
        if (this.points) {
            for (let point of this.points) {
                if (!point.mergedIn) target.push(point);
            }
            this.points = undefined;
        }
    }

    trim() {
        this.topLeft?.trim();
        this.topRight?.trim();
        this.bottomLeft?.trim();
        this.bottomRight?.trim();

        this.level -= 1;

        if (this.level == 0) {
            let newPoints: DendrogramEx[] = [];
            this.topLeft?.movePointsTo(newPoints);
            this.topRight?.movePointsTo(newPoints);
            this.bottomLeft?.movePointsTo(newPoints);
            this.bottomRight?.movePointsTo(newPoints);

            this.points = newPoints;

            this.topLeft = undefined;
            this.topRight = undefined;
            this.bottomLeft = undefined;
            this.bottomRight = undefined;
        }
    }

    getQuarter(point: DendrogramEx): Quarter {
        if (point.y > this.y) {
            return point.x > this.x ? Quarter.BottomRight : Quarter.BottomLeft;
        } else {
            return point.x > this.x ? Quarter.TopRight : Quarter.TopLeft;
        }
    }

    getNode(quarter: Quarter): QuadNode | undefined {
        switch (quarter) {
            case Quarter.TopLeft: return this.topLeft;
            case Quarter.TopRight: return this.topRight;
            case Quarter.BottomLeft: return this.bottomLeft;
            case Quarter.BottomRight: return this.bottomRight;
        }
    }

    getOrCreateNode(quarter: Quarter): QuadNode {
        switch (quarter) {
            case Quarter.TopLeft: return this.topLeft || (this.topLeft = new QuadNode(this, this.level - 1, Quarter.TopLeft, this.x - this.quarterSize, this.y - this.quarterSize, this.quarterSize));
            case Quarter.TopRight: return this.topRight || (this.topRight = new QuadNode(this, this.level - 1, Quarter.TopRight, this.x + this.quarterSize, this.y - this.quarterSize, this.quarterSize));
            case Quarter.BottomLeft: return this.bottomLeft || (this.bottomLeft = new QuadNode(this, this.level - 1, Quarter.BottomLeft, this.x - this.quarterSize, this.y + this.quarterSize, this.quarterSize));
            case Quarter.BottomRight: return this.bottomRight || (this.bottomRight = new QuadNode(this, this.level - 1, Quarter.BottomRight, this.x + this.quarterSize, this.y + this.quarterSize, this.quarterSize));
        }
    }

    getDendrograms(result: DendrogramEx[]) {
        this.topLeft?.getDendrograms(result);
        this.topRight?.getDendrograms(result);
        this.bottomLeft?.getDendrograms(result);
        this.bottomRight?.getDendrograms(result);
        if (this.points) {
            for (let point of this.points) {
                if (!point.mergedIn) result.push(point);
            }
        }
    }

    print(prefix: string) {
        if (this.topLeft) {
            console.log(prefix + "topleft")
            this.topLeft.print(prefix + "  ");
        }
        if (this.topRight) {
            console.log(prefix + "topright")
            this.topRight.print(prefix + "  ");
        }
        if (this.bottomLeft) {
            console.log(prefix + "bottomleft")
            this.bottomLeft.print(prefix + "  ");
        }
        if (this.bottomRight) {
            console.log(prefix + "bottomright")
            this.bottomRight.print(prefix + "  ");
        }
        if (this.points) {
            for (let pt of this.points) {
                console.log(prefix + " - " + pt.toString())
            }
        }
    }

    *forEachSiblings(parentSiblings: Siblings): Generator<Siblings> {
        yield parentSiblings;
        if (this.topLeft) yield* this.topLeft.forEachSiblings(parentSiblings.getQuarter(Quarter.TopLeft)!)
        if (this.topRight) yield* this.topRight.forEachSiblings(parentSiblings.getQuarter(Quarter.TopRight)!)
        if (this.bottomLeft) yield* this.bottomLeft.forEachSiblings(parentSiblings.getQuarter(Quarter.BottomLeft)!)
        if (this.bottomRight) yield* this.bottomRight.forEachSiblings(parentSiblings.getQuarter(Quarter.BottomRight)!)
    }


}

export class PointEx extends Point {
    public mergedIn: Cluster | undefined;

    constructor(readonly x: number, readonly y: number, tag: string | undefined = undefined) {
        super(x, y, tag);
    }
}

export class ClusterEx extends Cluster {
    public mergedIn: Cluster | undefined;

    constructor(dendrogram1: DendrogramEx, dendrogram2: DendrogramEx, tag: string | undefined = undefined) {
        super(dendrogram1, dendrogram2, tag);
    }
}

type DendrogramEx = ClusterEx | PointEx

export class QuadPairEx {
    notYet: boolean | undefined;
    constructor(
        readonly point1: DendrogramEx,
        readonly point2: DendrogramEx,
        readonly sibling: Sibling | undefined,
        readonly node2Siblings: Siblings | undefined,
        readonly distanceSquared: number) { }
    toString() {
        return this.point1.toString() + " " + this.point2.toString() + " " + Math.sqrt(this.distanceSquared);
    }

}