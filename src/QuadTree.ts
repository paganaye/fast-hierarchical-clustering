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

    constructor(private initialLevels: number = 32) {
        this.currentLevels = initialLevels
        this.root = new QuadNode(initialLevels - 1, 0.5, 0.5, 0.5);
    }

    insert(point: Dendrogram) {
        this.root.insert(point);
    }

    delete(point: Dendrogram) {
        this.root.delete(point);
    }

    trim(): boolean {
        if (this.root.level == 0) return false;
        else {
            this.root.trim();
            return true;
        }
    }

    getNeighbours(): Pair[] {
        let result: Pair[] = [];
        this.root.getNeighbours(undefined, undefined, undefined, undefined, undefined, result);
        return result;
    }

    getDendrograms(): Dendrogram[] {
        let result: Dendrogram[] = [];
        this.root.getDendrograms(result);
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

    quarterSize: number;
    topLeft: QuadNode | undefined;
    topRight: QuadNode | undefined;
    bottomLeft: QuadNode | undefined;
    bottomRight: QuadNode | undefined;
    points: Dendrogram[] | undefined;

    constructor(public level: number, readonly x: number, readonly y: number, halfSize: number) {
        this.quarterSize = halfSize / 2;
    }

    getNeighbours(leftSibling: QuadNode | undefined,
        rightSibling: QuadNode | undefined,
        bottomLeftSibling: QuadNode | undefined,
        bottomSibling: QuadNode | undefined,
        bottomRightSibling: QuadNode | undefined,
        result: Pair[]) {


        if (this.level == 0) {
            this.addSelfPairs(result);
            this.addPairsWith(rightSibling, result) // 🡺
            this.addPairsWith(bottomLeftSibling, result) // 🡿
            this.addPairsWith(bottomSibling, result)  // 🡻
            this.addPairsWith(bottomRightSibling, result)  // 🡾 
            // 🡸🡽🡹🡼 done the other way round                    
        } else {

            this.topLeft?.getNeighbours(
                leftSibling = leftSibling?.topRight,
                rightSibling = this.topRight,
                bottomLeftSibling = leftSibling?.bottomRight,
                bottomSibling = this.bottomLeft,
                bottomRightSibling = this.bottomRight,
                result); // ⌜

            this.topRight?.getNeighbours(
                leftSibling = this.topLeft,
                rightSibling = rightSibling?.topLeft,
                bottomLeftSibling = this.bottomLeft,
                bottomSibling = this.bottomRight,
                bottomRightSibling = rightSibling?.bottomLeft,
                result);// ⌝

            this.bottomLeft?.getNeighbours(
                leftSibling = leftSibling?.bottomRight,
                rightSibling = this.bottomRight,
                bottomLeftSibling = bottomLeftSibling?.topRight,
                bottomSibling = bottomSibling?.topLeft,
                bottomRightSibling = bottomSibling?.topRight,
                result);// ⌞

            this.bottomRight?.getNeighbours(
                leftSibling = this.bottomLeft,
                rightSibling = rightSibling?.bottomLeft,
                bottomLeftSibling = bottomSibling?.topLeft,
                bottomSibling = bottomSibling?.topRight,
                bottomRightSibling = bottomRightSibling?.topLeft,
                result);// ⌟
        }
    }

    addSelfPairs(result: Pair[]) {
        if (!this.points || this.points.length < 2) return;
        for (let i = 0; i < this.points.length; i++) {
            let point1 = this.points[i];
            for (let j = i + 1; j < this.points.length; j++) {
                let point2 = this.points[j];
                let distance = getDistance(point1, point2);
                result.push(new Pair(point1, point2, distance))
            }
        }
    }

    addPairsWith(node2: QuadNode | undefined,
        result: Pair[]) {
        if (!this.points || this.points.length == 0) return;
        let points2 = node2?.points;
        if (points2 && points2.length) {
            for (let point1 of this.points) {
                for (let point2 of points2) {
                    let distance = getDistance(point1, point2);
                    result.push(new Pair(point1, point2, distance))
                }
            }
        }
    }

    fullSize() {
        return this.quarterSize * 4;
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

    delete(point: Dendrogram) {
        if (this.level > 0) {
            let quarter = this.getQuarter(point);
            let node = this.getNode(quarter);
            if (node) node.delete(point);
        } else {
            if (this.points) {
                let index = this.points.indexOf(point);
                if (index >= 0) this.points.splice(index, 1);
            }
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
        this.bottomLeft?.getDendrograms(result);
        if (this.points && this.points.length) {
            result.push(...this.points);
        }
    }
}


export class Pair {
    constructor(readonly point1: Dendrogram, readonly point2: Dendrogram, readonly distance: number) {
        console.log(this.toString());
    }
    toString() {
        return this.point1.tag + " " + this.point2.tag + " " + this.distance;
    }

}
