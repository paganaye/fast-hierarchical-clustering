import { maxHeaderSize } from 'http';
import { Cluster, Dendrogram } from '../Cluster';
import { getDistance, getDistanceSquared, IPoint } from '../IPoint';
import { QuadPair } from '../new/QuadTree';
import { Point } from '../Point';

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

    *buildClusters(): Generator<ClusterEx> {
        for (let cluster of this.root.buildClusters(this.rootSiblings)) {
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
        let generator = this.buildClusters();
        let cluster: DendrogramEx;
        while (cluster = generator.next().value) result.push(cluster);
        return result;
    }

}

enum Quarter {
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

    *buildClusters(siblings: Siblings | undefined): Generator<ClusterEx> {
        if (!siblings) return;
        if (this.level == 0) {
            let result: QuadPairEx[] = [];
            this.addSelfClusters(result, siblings);
            this.addClustersWith(siblings, siblings.right, result);
            this.addClustersWith(siblings, siblings.bottomLeft, result);
            this.addClustersWith(siblings, siblings.bottom, result);
            this.addClustersWith(siblings, siblings.bottomRight, result);
            result.sort((a, b) => b.distanceSquared - a.distanceSquared);
            while (result.length) {
                let quadPair = result.pop()!;
                if (quadPair.point1.mergedIn || quadPair.point2.mergedIn) continue;

                if (this.hasBetterPair(siblings.right, quadPair) // 🡺
                    || this.hasBetterPair(siblings.bottomLeft, quadPair) // 🡿
                    || this.hasBetterPair(siblings.bottom, quadPair)  // 🡻
                    || this.hasBetterPair(siblings.bottomRight, quadPair))  // 🡾 
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
            x = this.topLeft?.buildClusters(siblings.getQuarterSiblings(Quarter.TopLeft)); // ⌜
            if (x) yield* x;
            x = this.topRight?.buildClusters(siblings.getQuarterSiblings(Quarter.TopRight));// ⌝
            if (x) yield* x;
            x = this.bottomLeft?.buildClusters(siblings.getQuarterSiblings(Quarter.BottomLeft));// ⌞
            if (x) yield* x;
            x = this.bottomRight?.buildClusters(siblings.getQuarterSiblings(Quarter.BottomRight));// ⌟
            if (x) yield* x;
        }
    }

    hasBetterPair(node: QuadNode | undefined, { point1, point2, distanceSquared }: QuadPairEx) {
        if (!node || !node.points || node.points.length < 3) return false;

        for (let point3 of node.points) {
            if (point3.mergedIn || point3 == point1 || point3 == point2) continue;
            let distanceSq13 = getDistanceSquared(point1, point3);
            if (distanceSq13 < distanceSquared) return true;
            let distanceSq23 = getDistanceSquared(point2, point3);
            if (distanceSq23 < distanceSquared) return true;
        }
        return false;
    }

    private addSelfClusters(result: QuadPairEx[], siblings: Siblings) {
        if (!this.points || this.points.length < 2) return;
        for (let i = 0; i < this.points.length; i++) {
            let point1 = this.points[i];
            for (let j = i + 1; j < this.points.length; j++) {
                let point2 = this.points[j];
                let distanceSquared = getDistanceSquared(point1, point2);
                if (distanceSquared < this.nodeSizeSquared) result.push(new QuadPairEx(point1, point2, siblings, distanceSquared))
            }
        }
    }

    private addClustersWith(siblings: Siblings, node2: QuadNode | undefined,
        result: QuadPairEx[]) {
        if (!this.points || this.points.length == 0) return;
        let points2 = node2?.points;
        if (points2 && points2.length) {
            let node2Siblings: Siblings | undefined;
            for (let point1 of this.points) {
                for (let point2 of points2) {
                    let distanceSquared = getDistanceSquared(point1, point2);
                    // if (!node2Siblings){
                    //     node2Siblings = 
                    // }
                    if (distanceSquared < this.nodeSizeSquared) result.push(new QuadPairEx(point1, point2, node2Siblings, distanceSquared))
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
                result.push(new QuadPairEx(point1, cluster, undefined, distanceSquared))
                addedSomething = true;
            }
        }
        return addedSomething;
    }


    private addNewClusters(cluster: ClusterEx, result: QuadPairEx[]) {
        if (!this.points || !this.points.length) return;
        for (let i = 0; i < this.points.length; i++) {
            let point1 = this.points[i];
            let distanceSquared = getDistanceSquared(point1, cluster);
            if (distanceSquared < this.nodeSizeSquared) result.push(new QuadPairEx(point1, cluster, undefined, distanceSquared))
        }
    }

    private addNewClustersWith(cluster: ClusterEx, node2: QuadNode | undefined,
        result: QuadPairEx[]) {
        let points2 = node2?.points;
        if (points2 && points2.length) {
            for (let point2 of points2) {
                let distance = getDistanceSquared(cluster, point2);
                if (distance < this.nodeSizeSquared) result.push(new QuadPairEx(cluster, point2, undefined, distance))
            }
        }
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

    movePointsTo(target: Point[]) {
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
}

export class Siblings {
    readonly topLeft?: QuadNode;
    readonly top?: QuadNode;
    readonly topRight?: QuadNode;
    readonly left?: QuadNode;
    readonly right?: QuadNode;
    readonly bottomLeft?: QuadNode;
    readonly bottom?: QuadNode;
    readonly bottomRight?: QuadNode;

    private constructor(
        readonly parent: Siblings | undefined,
        readonly node: QuadNode) {

        if (!parent || !parent.node || !node) {
            return;
        }
        switch (node.quarter) {
            case Quarter.TopLeft: {
                this.topLeft = parent.topLeft?.bottomRight;
                this.top = parent.top?.bottomLeft;
                this.topRight = parent.top?.bottomRight;
                this.left = parent.left?.topRight;
                this.right = parent.node.topRight;
                this.bottomLeft = parent.left?.bottomRight;
                this.bottom = parent.node.bottomLeft;
                this.bottomRight = parent.node.bottomRight;
            };
            case Quarter.TopRight: {
                this.topLeft = parent.top?.bottomLeft;
                this.top = parent.top?.bottomRight;
                this.topRight = parent.topRight?.bottomLeft;
                this.left = parent.node.topLeft;
                this.right = parent.right?.topLeft;
                this.bottomLeft = parent.node.bottomLeft;
                this.bottom = parent.node.bottomRight;
                this.bottomRight = parent.right?.bottomLeft;
            };
            case Quarter.BottomLeft: {
                this.topLeft = parent.left?.topRight;
                this.top = parent.node.topLeft;
                this.topRight = parent.node.topRight;
                this.left = parent.left?.bottomRight;
                this.right = parent.node.bottomRight;
                this.bottomLeft = parent.bottomLeft?.topRight;
                this.bottom = parent.bottom?.topLeft;
                this.bottomRight = parent.bottom?.topRight;
            };
            case Quarter.BottomRight: {
                this.topLeft = parent.node.topLeft;
                this.top = parent.node.topRight;
                this.topRight = parent.right?.topLeft;
                this.left = parent.node.bottomLeft;
                this.right = parent.right?.bottomLeft;
                this.bottomLeft = parent.bottom?.topLeft;
                this.bottom = parent.bottom?.topRight;
                this.bottomRight = parent.bottomRight?.topLeft;
            };
        }
    }

    static forRoot(node: QuadNode): Siblings {
        return new Siblings(undefined, node);
    }

    getQuarterSiblings(quarter: Quarter): Siblings | undefined {
        if (this.node) {
            switch (quarter) {
                case Quarter.TopLeft: return this.buildQuarterSiblings(quarter, this.node.topLeft);
                case Quarter.TopRight: return this.buildQuarterSiblings(quarter, this.node.topRight);
                case Quarter.BottomLeft: return this.buildQuarterSiblings(quarter, this.node.bottomLeft);
                case Quarter.BottomRight: return this.buildQuarterSiblings(quarter, this.node.bottomRight);
            }
        }
    }

    buildQuarterSiblings(quarter: Quarter, node: QuadNode | undefined): Siblings | undefined {
        if (node) {
            return new Siblings(this, node);
        }
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
        readonly node2Siblings: Siblings | undefined,
        readonly distanceSquared: number) { }
    toString() {
        return this.point1.toString() + " " + this.point2.toString() + " " + Math.sqrt(this.distanceSquared);
    }

}