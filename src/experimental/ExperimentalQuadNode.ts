import { Cluster } from '../Cluster';
import { getDistanceSquared } from '../IPoint';
import { Point } from '../Point';
import { ExperimentalQuadTree, Quarter } from './ExperimentalQuadTree';
import { Sibling } from './ExperimentalSiblings';

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

    getSibling(sibling: Sibling): QuadNode | undefined {
        let parent = this.parent;
        if (!parent) return undefined;
        switch (sibling) {
            case Sibling.TopLeft:
                switch (this.quarter) {
                    case Quarter.TopLeft:
                        return parent.getSibling(Sibling.TopLeft)?.bottomRight;
                    case Quarter.TopRight:
                        return parent.getSibling(Sibling.Top)?.bottomLeft;
                    case Quarter.BottomLeft:
                        return parent.getSibling(Sibling.Left)?.topRight;
                    case Quarter.BottomRight:
                        return parent.topLeft;
                }
                break;
            case Sibling.Top:
                switch (this.quarter) {
                    case Quarter.TopLeft:
                        return parent.getSibling(Sibling.Top)?.bottomLeft;
                    case Quarter.TopRight:
                        return parent.getSibling(Sibling.Top)?.bottomRight;
                    case Quarter.BottomLeft:
                        return parent.topLeft;
                    case Quarter.BottomRight:
                        return parent.topRight;
                }
                break;
            case Sibling.TopRight:
                switch (this.quarter) {
                    case Quarter.TopLeft:
                        return parent.getSibling(Sibling.Top)?.bottomRight;
                    case Quarter.TopRight:
                        return parent.getSibling(Sibling.TopRight)?.bottomLeft;
                    case Quarter.BottomLeft:
                        return parent.topRight;
                    case Quarter.BottomRight:
                        return parent.getSibling(Sibling.Right)?.topLeft;
                }
                break;
            case Sibling.Left:
                switch (this.quarter) {
                    case Quarter.TopLeft:
                        return parent.getSibling(Sibling.Left)?.topRight;
                    case Quarter.TopRight:
                        return parent.topLeft;
                    case Quarter.BottomLeft:
                        return parent.getSibling(Sibling.Left)?.bottomRight;
                    case Quarter.BottomRight:
                        return parent.bottomLeft;
                }
                break;
            case Sibling.Right:
                switch (this.quarter) {
                    case Quarter.TopLeft:
                        return parent.topRight;
                    case Quarter.TopRight:
                        return parent.getSibling(Sibling.Right)?.topLeft;
                    case Quarter.BottomLeft:
                        return parent.bottomRight;
                    case Quarter.BottomRight:
                        return parent.getSibling(Sibling.Right)?.bottomLeft;
                }
                break;
            case Sibling.BottomLeft:
                switch (this.quarter) {
                    case Quarter.TopLeft:
                        return parent.getSibling(Sibling.Left)?.bottomRight;
                    case Quarter.TopRight:
                        return parent.bottomLeft;
                    case Quarter.BottomLeft:
                        return parent.getSibling(Sibling.BottomLeft)?.topRight;
                    case Quarter.BottomRight:
                        return parent.getSibling(Sibling.Bottom)?.topLeft;
                }
                break;
            case Sibling.Bottom:
                switch (this.quarter) {
                    case Quarter.TopLeft:
                        return parent.bottomLeft;
                    case Quarter.TopRight:
                        return parent.bottomRight;
                    case Quarter.BottomLeft:
                        return parent.getSibling(Sibling.Bottom)?.topLeft;
                    case Quarter.BottomRight:
                        return parent.getSibling(Sibling.Bottom)?.topRight;
                }
                break;
            case Sibling.BottomRight:
                switch (this.quarter) {
                    case Quarter.TopLeft:
                        return parent.bottomRight;
                    case Quarter.TopRight:
                        return parent.getSibling(Sibling.Right)?.bottomLeft;
                    case Quarter.BottomLeft:
                        return parent.getSibling(Sibling.Bottom)?.topRight;
                    case Quarter.BottomRight:
                        return parent.getSibling(Sibling.BottomRight)?.topLeft;
                }
                break;
        }
        return undefined;
    }


    *mergePoints(quadTree: ExperimentalQuadTree): Generator<ClusterEx> {
        let pairs: QuadPairEx[] = [];
        this.addSelfPairs(pairs);
        this.addPairsWith(Sibling.Right, pairs);
        this.addPairsWith(Sibling.BottomLeft, pairs);
        this.addPairsWith(Sibling.Bottom, pairs);
        this.addPairsWith(Sibling.BottomRight, pairs);
        if (pairs.length == 0) return;
        pairs.sort((a, b) => b.distanceSquared - a.distanceSquared);
        while (pairs.length) {
            let quadPair = pairs.pop()!;
            if (quadPair.point1.mergedIn || quadPair.point2.mergedIn) continue;
            if (QuadNode.hasBetterSelfPair(quadPair)
                || QuadNode.hasBetterPair(quadPair, quadPair.node2?.getSibling(Sibling.TopLeft))
                || QuadNode.hasBetterPair(quadPair, quadPair.node2?.getSibling(Sibling.Top))
                || QuadNode.hasBetterPair(quadPair, quadPair.node2?.getSibling(Sibling.TopRight))
                || QuadNode.hasBetterPair(quadPair, quadPair.node2?.getSibling(Sibling.Left))
                || QuadNode.hasBetterPair(quadPair, quadPair.node2?.getSibling(Sibling.Right))
                || QuadNode.hasBetterPair(quadPair, quadPair.node2?.getSibling(Sibling.BottomLeft))
                || QuadNode.hasBetterPair(quadPair, quadPair.node2?.getSibling(Sibling.Bottom))
                || QuadNode.hasBetterPair(quadPair, quadPair.node2?.getSibling(Sibling.BottomRight)))
                continue;
            // 🡸🡽🡹🡼 done before
            let newPairs: QuadPairEx[] = [];
            //let { cluster, hasNewPairs } = quadPair.merge(quadTree, newPairs);
            let newCluster = new ClusterEx(quadPair.point1, quadPair.point2);
            quadPair.point1.mergedIn = newCluster;
            quadPair.point2.mergedIn = newCluster;
            let newNode = this.outsert(newCluster);
            let hasNewPairs = this.addNewPairs(newCluster, newNode, newPairs);
            quadTree.pointCount -= 1;
            if (hasNewPairs) {
                // for now.
                pairs.push(...newPairs);
                pairs.sort((a, b) => b.distanceSquared - a.distanceSquared);
            }
            yield newCluster;
        }
    }


    static hasBetterSelfPair({ point1, node1, point2, node2, distanceSquared }: QuadPairEx) {
        let node = node2;
        if (!node || !node.points) return false;

        for (let point3 of node.points) {
            if (point3.mergedIn || point3 == point1 || point3 == point2) continue;
            let newDistanceSquared = getDistanceSquared(point3, point1);
            if (newDistanceSquared < distanceSquared) return true;
            newDistanceSquared = getDistanceSquared(point3, point2);
            if (newDistanceSquared < distanceSquared) return true;
        }
        return false;
    }

    static hasBetterPair({ point1, node1, point2, node2, distanceSquared }: QuadPairEx, node: QuadNode | undefined) {
        if (!node || !node.points) return false;

        for (let point3 of node.points) {
            if (point3.mergedIn || point3 == point1 || point3 == point2) continue;
            let newDistanceSquared = getDistanceSquared(point3, point1);
            if (newDistanceSquared < distanceSquared) return true;
            newDistanceSquared = getDistanceSquared(point3, point2);
            if (newDistanceSquared < distanceSquared) return true;
        }
        return false;
    }

    private addSelfPairs(result: QuadPairEx[]) {
        if (!this.points || this.points.length < 2) return;
        for (let i = 0; i < this.points.length; i++) {
            let point1 = this.points[i];
            for (let j = i + 1; j < this.points.length; j++) {
                let point2 = this.points[j];
                let distanceSquared = getDistanceSquared(point1, point2);
                if (distanceSquared < this.nodeSizeSquared) {
                    result.push(new QuadPairEx(point1, this, point2, this, distanceSquared))

                }
            }
        }
    }

    private addPairsWith(sibling: Sibling, result: QuadPairEx[]) {
        if (!this.points || this.points.length == 0) return;
        let node2 = this.getSibling(sibling);
        let points2 = node2?.points;
        if (points2 && points2.length) {
            for (let point1 of this.points) {
                if (point1.mergedIn) continue;
                for (let point2 of points2) {
                    if (point2.mergedIn) continue;
                    let distanceSquared = getDistanceSquared(point1, point2);
                    if (distanceSquared < this.nodeSizeSquared) result.push(new QuadPairEx(point1, this, point2, node2!, distanceSquared))
                }
            }
        }
    }

    addNewPairs(newCluster: ClusterEx, clusterNode: QuadNode, result: QuadPairEx[]) {
        if (!this.points || !this.points.length) return false;
        let addedSomething = false;
        for (let i = 0; i < this.points.length; i++) {
            let point1 = this.points[i];
            if (point1.mergedIn || point1 == newCluster) continue;
            let distanceSquared = getDistanceSquared(point1, newCluster);
            if (distanceSquared < this.nodeSizeSquared) {
                result.push(new QuadPairEx(point1, this, newCluster, clusterNode, distanceSquared))
                addedSomething = true;
            }
        }
        return addedSomething;
    }


    insert(point: DendrogramEx): QuadNode {
        if (this.level > 0) {
            let quarter = this.getQuarter(point);
            let node = this.getOrCreateNode(quarter);
            return node.insert(point);
        } else {
            (this.points || (this.points = [])).push(point)
            return this;
        }
    }

    outsert(point: DendrogramEx): QuadNode {
        if (this.withinBoundary(point)) {
            return this.insert(point);
        } else {
            if (this.parent == null) throw new Error(`Point ${point} doesn't fit the in the quadtree.`);
            return this.parent.outsert(point)
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

    getChildNode(quarter: Quarter): QuadNode | undefined {
        let result: QuadNode | undefined;
        switch (quarter) {
            case Quarter.TopLeft: result = this.topLeft; break;
            case Quarter.TopRight: result = this.topRight; break;
            case Quarter.BottomLeft: result = this.bottomLeft; break;
            case Quarter.BottomRight: result = this.bottomRight; break;
        }
        return result;
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

    *forEachQuadNode(): Generator<QuadNode> {
        yield this;
        if (this.topLeft) yield* this.topLeft.forEachQuadNode()
        if (this.topRight) yield* this.topRight.forEachQuadNode()
        if (this.bottomLeft) yield* this.bottomLeft.forEachQuadNode()
        if (this.bottomRight) yield* this.bottomRight.forEachQuadNode()
    }

    *forEachQuadLeaf(): Generator<QuadNode> {
        if (this.level == 0) {
            yield this;
        } else {
            if (this.topLeft) yield* this.topLeft.forEachQuadLeaf()
            if (this.topRight) yield* this.topRight.forEachQuadLeaf()
            if (this.bottomLeft) yield* this.bottomLeft.forEachQuadLeaf()
            if (this.bottomRight) yield* this.bottomRight.forEachQuadLeaf()
        }
    }

    withinBoundary({ x, y }: DendrogramEx) {
        let halfSize = this.nodeSize / 2;
        return x >= this.x - halfSize && x < this.x + halfSize
            && y >= this.y - halfSize && y < this.y + halfSize;
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

export type DendrogramEx = ClusterEx | PointEx

export class QuadPairEx {
    notYet: boolean | undefined;
    constructor(
        readonly point1: DendrogramEx,
        readonly node1: QuadNode,
        readonly point2: DendrogramEx,
        readonly node2: QuadNode,
        readonly distanceSquared: number) { }
    toString() {
        return this.point1.toString() + " " + this.point2.toString() + " " + Math.sqrt(this.distanceSquared);
    }
}