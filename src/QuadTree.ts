import { Dendrogram, getDistance } from './Cluster';
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

    constructor(private initialLevels: number = 32) {
        this.currentLevels = initialLevels
        this.root = new QuadNode(initialLevels - 1, 0.5, 0.5, 0.5);
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

    getNeighbours(siblings: Siblings,
        result: QuadPair[]) {


        if (this.level == 0) {
            this.addSelfPairs(result);
            this.addPairsWith(siblings.right, result) // 🡺
            this.addPairsWith(siblings.bottomLeft, result) // 🡿
            this.addPairsWith(siblings.bottom, result)  // 🡻
            this.addPairsWith(siblings.bottomRight, result)  // 🡾 
            // 🡸🡽🡹🡼 done the other way round                    
        } else {

            this.topLeft?.getNeighbours({
                left: siblings.left?.topRight,
                right: this.topRight,
                bottomLeft: siblings.left?.bottomRight,
                bottom: this.bottomLeft,
                bottomRight: this.bottomRight
            }, result); // ⌜

            this.topRight?.getNeighbours({
                left: this.topLeft,
                right: siblings.right?.topLeft,
                bottomLeft: this.bottomLeft,
                bottom: this.bottomRight,
                bottomRight: siblings.right?.bottomLeft
            }, result);// ⌝

            this.bottomLeft?.getNeighbours({
                left: siblings.left?.bottomRight,
                right: this.bottomRight,
                bottomLeft: siblings.bottomLeft?.topRight,
                bottom: siblings.bottom?.topLeft,
                bottomRight: siblings.bottom?.topRight
            }, result);// ⌞

            this.bottomRight?.getNeighbours({
                left: this.bottomLeft,
                right: siblings.right?.bottomLeft,
                bottomLeft: siblings.bottom?.topLeft,
                bottom: siblings.bottom?.topRight,
                bottomRight: siblings.bottomRight?.topLeft
            }, result);// ⌟
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

interface Siblings {
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
