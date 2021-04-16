import { Cluster, Dendrogram } from './Cluster';
import { getDistance } from './IPoint';
import { Point } from './Point';

//import { Point } from './Point';
export interface IPoint {
    x: number;
    y: number;
}

export class QuadTree {
    private currentLevels: number;
    root: QuadNode;
    pointCount = 0;

    constructor(private initialLevels: number = 10) {
        this.currentLevels = initialLevels
        this.root = new QuadNode(initialLevels - 1, 0.5, 0.5, 0.5);
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

    getNeighbours(): QuadPair[] {
        let result: QuadPair[] = [];
        this.root.getNeighbours({}, result);
        return result;
    }

    insertAndAddNeighbours(newCluster: Cluster, result: QuadPair[]) {
        this.pointCount += 1;
        this.root.insertAndAddNeighbours(newCluster, {}, result);
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

    constructor(public level: number, readonly x: number, readonly y: number, halfSize: number) {
        this.nodeSize = halfSize * 2;
        this.quarterSize = halfSize / 2;
    }

    insertAndAddNeighbours(cluster: Cluster,
        ownSiblings: ISiblings,
        result: QuadPair[]) {

        if (this.level == 0) {
            this.addNewPairs(cluster, result);

            this.addNewPairsWith(cluster, ownSiblings.topLeft, result) // 🡼
            this.addNewPairsWith(cluster, ownSiblings.top, result) // 🡹
            this.addNewPairsWith(cluster, ownSiblings.topRight, result)  // 🡽

            this.addNewPairsWith(cluster, ownSiblings.left, result)  // 🡸
            this.addNewPairsWith(cluster, ownSiblings.right, result) // 🡺

            this.addNewPairsWith(cluster, ownSiblings.bottomLeft, result) // 🡿
            this.addNewPairsWith(cluster, ownSiblings.bottom, result)  // 🡻
            this.addNewPairsWith(cluster, ownSiblings.bottomRight, result)  // 🡾 
            // 🡸🡽🡹🡼 done the other way round                    
            this.insert(cluster);
        } else {
            let quarter = this.getQuarter(cluster);
            let node = this.getOrCreateNode(quarter);
            node.insertAndAddNeighbours(cluster, this.getQuarterSiblings(ownSiblings, quarter), result);
        }
    }

    getQuarterSiblings(ownSiblings: ISiblings, quarter: Quarter): ISiblings {
        switch (quarter) {
            case Quarter.TopLeft: return {
                topLeft: ownSiblings.topLeft?.bottomRight,
                top: ownSiblings.top?.bottomLeft,
                topRight: ownSiblings.top?.bottomRight,
                left: ownSiblings.left?.topRight,
                right: this.topRight,
                bottomLeft: ownSiblings.left?.bottomRight,
                bottom: this.bottomLeft,
                bottomRight: this.bottomRight
            };
            case Quarter.TopRight: return {
                topLeft: ownSiblings.top?.bottomLeft,
                top: ownSiblings.top?.bottomRight,
                topRight: ownSiblings.topRight?.bottomLeft,
                left: this.topLeft,
                right: ownSiblings.right?.topLeft,
                bottomLeft: this.bottomLeft,
                bottom: this.bottomRight,
                bottomRight: ownSiblings.right?.bottomLeft
            };
            case Quarter.BottomLeft: return {
                topLeft: ownSiblings.left?.topRight,
                top: this.topLeft,
                topRight: this.topRight,
                left: ownSiblings.left?.bottomRight,
                right: this.bottomRight,
                bottomLeft: ownSiblings.bottomLeft?.topRight,
                bottom: ownSiblings.bottom?.topLeft,
                bottomRight: ownSiblings.bottom?.topRight
            };
            case Quarter.BottomRight: return {
                topLeft: this.topLeft,
                top: this.topRight,
                topRight: ownSiblings.right?.topLeft,
                left: this.bottomLeft,
                right: ownSiblings.right?.bottomLeft,
                bottomLeft: ownSiblings.bottom?.topLeft,
                bottom: ownSiblings.bottom?.topRight,
                bottomRight: ownSiblings.bottomRight?.topLeft
            };
        }
    }

    getNeighbours(siblings: ISiblings,
        result: QuadPair[]) {

        if (this.level == 0) {
            this.addSelfPairs(result);
            this.addPairsWith(siblings.right, result) // 🡺
            this.addPairsWith(siblings.bottomLeft, result) // 🡿
            this.addPairsWith(siblings.bottom, result)  // 🡻
            this.addPairsWith(siblings.bottomRight, result)  // 🡾 
            // 🡸🡽🡹🡼 done the other way round    
        } else {
            this.topLeft?.getNeighbours(this.getQuarterSiblings(siblings, Quarter.TopLeft), result); // ⌜
            this.topRight?.getNeighbours(this.getQuarterSiblings(siblings, Quarter.TopRight), result);// ⌝
            this.bottomLeft?.getNeighbours(this.getQuarterSiblings(siblings, Quarter.BottomLeft), result);// ⌞
            this.bottomRight?.getNeighbours(this.getQuarterSiblings(siblings, Quarter.BottomRight), result);// ⌟
        }
    }

    addSelfPairs(result: QuadPair[]) {
        if (!this.points || this.points.length < 2) return;
        for (let i = 0; i < this.points.length; i++) {
            let point1 = this.points[i];
            for (let j = i + 1; j < this.points.length; j++) {
                let point2 = this.points[j];
                let distance = getDistance(point1, point2);
                if (distance < this.nodeSize) result.push(new QuadPair(point1, point2, distance))
            }
        }
    }

    addNewPairs(cluster: Cluster, result: QuadPair[]) {
        if (!this.points || !this.points.length) return;
        for (let i = 0; i < this.points.length; i++) {
            let point1 = this.points[i];
            let distance = getDistance(point1, cluster);
            if (distance < this.nodeSize) result.push(new QuadPair(point1, cluster, distance))
        }
    }

    addPairsWith(node2: QuadNode | undefined,
        result: QuadPair[]) {
        if (!this.points || this.points.length == 0) return;
        let points2 = node2?.points;
        if (points2 && points2.length) {
            for (let point1 of this.points) {
                for (let point2 of points2) {
                    let distance = getDistance(point1, point2);
                    if (distance < this.nodeSize) result.push(new QuadPair(point1, point2, distance))
                }
            }
        }
    }

    addNewPairsWith(cluster: Cluster, node2: QuadNode | undefined,
        result: QuadPair[]) {
        let points2 = node2?.points;
        if (points2 && points2.length) {
            for (let point2 of points2) {
                let distance = getDistance(cluster, point2);
                if (distance < this.nodeSize) result.push(new QuadPair(cluster, point2, distance))
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
            case Quarter.TopLeft: return this.topLeft || (this.topLeft = new QuadNode(this.level - 1, this.x - this.quarterSize, this.y - this.quarterSize, this.quarterSize));
            case Quarter.TopRight: return this.topRight || (this.topRight = new QuadNode(this.level - 1, this.x + this.quarterSize, this.y - this.quarterSize, this.quarterSize));
            case Quarter.BottomLeft: return this.bottomLeft || (this.bottomLeft = new QuadNode(this.level - 1, this.x - this.quarterSize, this.y + this.quarterSize, this.quarterSize));
            case Quarter.BottomRight: return this.bottomRight || (this.bottomRight = new QuadNode(this.level - 1, this.x + this.quarterSize, this.y + this.quarterSize, this.quarterSize));
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
    constructor(readonly point1: Dendrogram, readonly point2: Dendrogram, readonly distance: number) { }
    toString() {
        return this.point1.toString() + " " + this.point2.toString() + " " + this.distance;
    }

}
