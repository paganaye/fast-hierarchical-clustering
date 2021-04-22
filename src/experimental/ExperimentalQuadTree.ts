import { ClusterEx, DendrogramEx, QuadNode, QuadPairEx } from './ExperimentalQuadNode';

export class ExperimentalQuadTree {
    private currentLevels: number;
    root: QuadNode;
    pointCount = 0;

    constructor(private initialLevels: number) {
        this.currentLevels = initialLevels
        this.root = new QuadNode(undefined, initialLevels - 1, Quarter.TopLeft, 0.5, 0.5, 0.5);
        this.root.nodeSize = Number.POSITIVE_INFINITY; // we need to allow the root node to group points that are further than 1.0 appart.
        this.root.nodeSizeSquared = this.root.nodeSize * this.root.nodeSize;
    }

    insert(point: DendrogramEx) {
        this.pointCount += 1;
        this.root.insert(point);
    }

    trim(): boolean {
        if (this.root.level == 0) return false;
        else {
            this.currentLevels -= 1;
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

    getDendrograms(): DendrogramEx[] {
        let result: DendrogramEx[] = [];
        this.root.getDendrograms(result);
        return result;
    }

    print() {
        this.root.print('');
    }

    forEachQuadNode(): Generator<QuadNode> {
        return this.root.forEachQuadNode();
    }

    forEachQuadLeaf(): Generator<QuadNode> {
        return this.root.forEachQuadLeaf();
    }    

}

export enum Quarter {
    TopLeft,
    TopRight,
    BottomLeft,
    BottomRight
}

