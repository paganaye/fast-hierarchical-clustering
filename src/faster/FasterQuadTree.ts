import { maxHeaderSize } from 'http';
import { Cluster, Dendrogram } from '../Cluster';
import { getDistance, getDistanceSquared } from '../IPoint';
import { Point } from '../Point';

//import { Point } from './Point';


export class FasterQuadTree {
    private currentLevels: number;
    root: QuadNode;
    pointCount = 0;

    constructor(private initialLevels: number) {
        this.currentLevels = initialLevels
        this.root = new QuadNode(undefined, initialLevels - 1, Quarter.TopLeft, 0.5, 0.5, 0.5);
        this.root.nodeSize = 2; // we need to allow the root node to group points that are further than 1.0 appart.
    }

    insert(point: Dendrogram) {
        this.pointCount += 1;
        this.root.insert(point);
    }

    delete(point: Dendrogram): boolean {
        if (this.root.delete(point)) {
            this.pointCount -= 1;
            return true;
        } else return false;
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

    getNeighbours(maxDistance: number): QuadPair[] {
        let result: QuadPair[] = [];
        this.root.getNeighbours({ parent: undefined, quarter: undefined, node: this.root }, maxDistance * maxDistance, result);
        return result;
    }

    insertAndAddNeighbours(newCluster: Cluster, maxDistance: number, result: QuadPair[]) {
        this.pointCount += 1;
        this.root.insertAndAddNeighbours(newCluster, maxDistance * maxDistance,
            { parent: undefined, quarter: undefined, node: this.root }, result);
    }

    getDendrograms(): Dendrogram[] {
        let result: Dendrogram[] = [];
        this.root.getDendrograms(result);
        return result;
    }

    print() {
        this.root.print('');
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
    quarterSize: number;
    topLeft: QuadNode | undefined;
    topRight: QuadNode | undefined;
    bottomLeft: QuadNode | undefined;
    bottomRight: QuadNode | undefined;
    points: Dendrogram[] | undefined;

    constructor(readonly parent: QuadNode | undefined, public level: number, public readonly quarter: Quarter, readonly x: number, readonly y: number, halfSize: number) {
        this.nodeSize = halfSize * 2;
        this.quarterSize = halfSize / 2;
    }

    insertAndAddNeighbours(cluster: Cluster,
        maxDistanceSquared: number,
        siblings: ISiblings,
        result: QuadPair[]) {

        if (this.level == 0) {
            this.addNewPairs(cluster, maxDistanceSquared, result);

            this.addNewPairsWith(cluster, maxDistanceSquared, siblings.topLeft, result) // 🡼
            this.addNewPairsWith(cluster, maxDistanceSquared, siblings.top, result) // 🡹
            this.addNewPairsWith(cluster, maxDistanceSquared, siblings.topRight, result)  // 🡽

            this.addNewPairsWith(cluster, maxDistanceSquared, siblings.left, result)  // 🡸
            this.addNewPairsWith(cluster, maxDistanceSquared, siblings.right, result) // 🡺

            this.addNewPairsWith(cluster, maxDistanceSquared, siblings.bottomLeft, result) // 🡿
            this.addNewPairsWith(cluster, maxDistanceSquared, siblings.bottom, result)  // 🡻
            this.addNewPairsWith(cluster, maxDistanceSquared, siblings.bottomRight, result)  // 🡾 
            // 🡸🡽🡹🡼 done the other way round                    
            this.insert(cluster);
        } else {
            let quarter = this.getQuarter(cluster);
            let node = this.getOrCreateNode(quarter);
            node.insertAndAddNeighbours(cluster, maxDistanceSquared, this.getQuarterSiblings(siblings, quarter), result);
        }
    }

    getQuarterSiblings(siblings: ISiblings, quarter: Quarter): ISiblings {
        switch (quarter) {
            case Quarter.TopLeft: return {
                parent: siblings,
                node: this.topLeft!,
                quarter: Quarter.TopLeft,
                topLeft: siblings.topLeft?.bottomRight,
                top: siblings.top?.bottomLeft,
                topRight: siblings.top?.bottomRight,
                left: siblings.left?.topRight,
                right: this.topRight,
                bottomLeft: siblings.left?.bottomRight,
                bottom: this.bottomLeft,
                bottomRight: this.bottomRight
            };
            case Quarter.TopRight: return {
                parent: siblings,
                node: this.topRight!,
                quarter: Quarter.TopRight,
                topLeft: siblings.top?.bottomLeft,
                top: siblings.top?.bottomRight,
                topRight: siblings.topRight?.bottomLeft,
                left: this.topLeft,
                right: siblings.right?.topLeft,
                bottomLeft: this.bottomLeft,
                bottom: this.bottomRight,
                bottomRight: siblings.right?.bottomLeft
            };
            case Quarter.BottomLeft: return {
                parent: siblings,
                node: this.bottomLeft!,
                quarter: Quarter.BottomLeft,
                topLeft: siblings.left?.topRight,
                top: this.topLeft,
                topRight: this.topRight,
                left: siblings.left?.bottomRight,
                right: this.bottomRight,
                bottomLeft: siblings.bottomLeft?.topRight,
                bottom: siblings.bottom?.topLeft,
                bottomRight: siblings.bottom?.topRight
            };
            case Quarter.BottomRight: return {
                parent: siblings,
                node: this.bottomRight!,
                quarter: Quarter.BottomRight,
                topLeft: this.topLeft,
                top: this.topRight,
                topRight: siblings.right?.topLeft,
                left: this.bottomLeft,
                right: siblings.right?.bottomLeft,
                bottomLeft: siblings.bottom?.topLeft,
                bottom: siblings.bottom?.topRight,
                bottomRight: siblings.bottomRight?.topLeft
            };
        }
    }

    getNeighbours(siblings: ISiblings,
        maxDistanceSquared: number,
        result: QuadPair[]) {

        if (this.level == 0) {
            this.addSelfPairs(maxDistanceSquared, result);
            this.addPairsWith(siblings.right, maxDistanceSquared, result) // 🡺
            this.addPairsWith(siblings.bottomLeft, maxDistanceSquared, result) // 🡿
            this.addPairsWith(siblings.bottom, maxDistanceSquared, result)  // 🡻
            this.addPairsWith(siblings.bottomRight, maxDistanceSquared, result)  // 🡾 
            // 🡸🡽🡹🡼 done the other way round    
        } else {
            this.topLeft?.getNeighbours(this.getQuarterSiblings(siblings, Quarter.TopLeft), maxDistanceSquared, result); // ⌜
            this.topRight?.getNeighbours(this.getQuarterSiblings(siblings, Quarter.TopRight), maxDistanceSquared, result);// ⌝
            this.bottomLeft?.getNeighbours(this.getQuarterSiblings(siblings, Quarter.BottomLeft), maxDistanceSquared, result);// ⌞
            this.bottomRight?.getNeighbours(this.getQuarterSiblings(siblings, Quarter.BottomRight), maxDistanceSquared, result);// ⌟
        }
    }

    private addSelfPairs(maxDistanceSquared: number, result: QuadPair[]) {
        if (!this.points || this.points.length < 2) return;
        for (let i = 0; i < this.points.length; i++) {
            let point1 = this.points[i];
            for (let j = i + 1; j < this.points.length; j++) {
                let point2 = this.points[j];
                let distanceSquared = getDistanceSquared(point1, point2);
                if (distanceSquared < maxDistanceSquared) result.push(new QuadPair(point1, point2, distanceSquared))
            }
        }
    }

    private addNewPairs(cluster: Cluster, maxDistanceSquared: number, result: QuadPair[]) {
        if (!this.points || !this.points.length) return;
        for (let i = 0; i < this.points.length; i++) {
            let point1 = this.points[i];
            let distanceSquared = getDistanceSquared(point1, cluster);
            if (distanceSquared < maxDistanceSquared) result.push(new QuadPair(point1, cluster, distanceSquared))
        }
    }

    private addPairsWith(node2: QuadNode | undefined, maxDistanceSquared: number,
        result: QuadPair[]) {
        if (!this.points || this.points.length == 0) return;
        let points2 = node2?.points;
        if (points2 && points2.length) {
            for (let point1 of this.points) {
                for (let point2 of points2) {
                    let distanceSquared = getDistanceSquared(point1, point2);
                    if (distanceSquared < maxDistanceSquared) result.push(new QuadPair(point1, point2, distanceSquared))
                }
            }
        }
    }

    private addNewPairsWith(cluster: Cluster, maxDistanceSquared: number, node2: QuadNode | undefined,
        result: QuadPair[]) {
        let points2 = node2?.points;
        if (points2 && points2.length) {
            for (let point2 of points2) {
                let distance = getDistanceSquared(cluster, point2);
                if (distance < maxDistanceSquared) result.push(new QuadPair(cluster, point2, distance))
            }
        }
    }


    insert(point: Dendrogram) {
        if (this.level > 0) {
            let quarter = this.getQuarter(point);
            let node = this.getOrCreateNode(quarter);
            node.insert(point);
        } else {
            (this.points || (this.points = [])).push(point)
        }
    }

    delete(point: Dendrogram): boolean {
        if (this.level > 0) {
            let quarter = this.getQuarter(point);
            let node = this.getNode(quarter);
            if (node) return node.delete(point);
            else return false;
        } else {
            if (this.points) {
                let index = this.points.indexOf(point);
                if (index >= 0) {
                    this.points.splice(index, 1);
                    return true;
                } else return false;
            } else return false;
        }
    }


    trim() {
        this.topLeft?.trim();
        this.topRight?.trim();
        this.bottomLeft?.trim();
        this.bottomRight?.trim();

        this.level -= 1;

        if (this.level == 0) {
            if (!this.points) this.points = [];
            if (this.topLeft?.points) this.points.push(...this.topLeft?.points);
            if (this.topRight?.points) this.points.push(...this.topRight?.points);
            if (this.bottomLeft?.points) this.points.push(...this.bottomLeft?.points);
            if (this.bottomRight?.points) this.points.push(...this.bottomRight?.points);

            this.topLeft = undefined;
            this.topRight = undefined;
            this.bottomLeft = undefined;
            this.bottomRight = undefined;
        }
    }

    getQuarter(point: Dendrogram): Quarter {
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

    getDendrograms(result: Dendrogram[]) {
        this.topLeft?.getDendrograms(result);
        this.topRight?.getDendrograms(result);
        this.bottomLeft?.getDendrograms(result);
        this.bottomRight?.getDendrograms(result);
        if (this.points && this.points.length) {
            result.push(...this.points);
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

interface ISiblings {
    parent: ISiblings | undefined;
    node: QuadNode | undefined,
    quarter: Quarter | undefined,
    topLeft?: QuadNode,
    top?: QuadNode,
    topRight?: QuadNode,
    left?: QuadNode,
    right?: QuadNode,
    bottomLeft?: QuadNode,
    bottom?: QuadNode,
    bottomRight?: QuadNode
}

export class QuadPair {
    constructor(readonly point1: Dendrogram, readonly point2: Dendrogram, readonly distanceSquared: number) { }
    toString() {
        return this.point1.toString() + " " + this.point2.toString() + " " + Math.sqrt(this.distanceSquared);
    }
}
