import { QuadTree, printQuadTree } from "./QuadTree";
import { calcDistance, Point } from "./Point";
import { QuadNode } from "./QuadNode";
import { Neighbour, newNeighbour } from "./Neighbour";
import { getMergedPoint } from "./Dendrogram";
import { QuadEnumerator } from "./QuadEnumerator";
import { mergeQuadTree } from "./QuadMerger";
import { Log } from "./Log";

const CLUSTER_MIN_SIZE = 1;

function sortByDistance(neighbours: Array<Neighbour>): void {
    neighbours.sort((a, b) => {
        var res = a.distance - b.distance
        if (res == 0) res = a.pt1.id - b.pt1.id
        if (res == 0) res = a.pt2.id - a.pt2.id
        return res;
    })
}

function createQuad(points: Point[]): QuadTree {
    let quad = new QuadTree({ nodeSize: CLUSTER_MIN_SIZE });
    points.forEach((point) => {
        //if (point.id % DISPLAY_DECIMATOR == 0) printPoint("adding point...", point)
        quad.add(point)
    });
    return quad;
}

function getQuadTreeNeighbours(quad: QuadTree, maxDistance: number): Neighbour[] {
    let neighbours: Neighbour[] = []
    mergeQuadTree(quad, maxDistance);
    var quadEnumerator = new QuadEnumerator(quad);
    var current = quadEnumerator.getFirst()
    while (current) {
        getNodeSouthEastNeighbours(current, maxDistance, neighbours);
        current = quadEnumerator.getNext();
    }
    return neighbours;
}

function getNodeSouthEastNeighbours(current: QuadNode, maxDistance: number, neighbours: Neighbour[]) {
    if (current.points) getNeighbours(current, maxDistance, neighbours);
    getInterNodeNeighbours(current, QuadTree.getEastNeighbour(current), maxDistance, neighbours);
    getInterNodeNeighbours(current, QuadTree.getSouthWestNeighbour(current), maxDistance, neighbours);
    getInterNodeNeighbours(current, QuadTree.getSouthNeighbour(current), maxDistance, neighbours);
    getInterNodeNeighbours(current, QuadTree.getSouthEastNeighbour(current), maxDistance, neighbours);
}

function getInterNodeNeighbours(n1: QuadNode | undefined, n2: QuadNode | undefined, maxDistance: number, result: Neighbour[]) {
    if (!n1 || !n2) return; // we have or will see this the other way round.
    let pts1 = n1.points || [];
    let pts2 = n2.points || [];
    for (let i = 0; i < pts1.length; i++) {
        let pti = pts1[i];
        for (let j = 0; j < pts2.length; j++) {
            let ptj = pts2[j];
            let distance = calcDistance(pti, ptj);
            if (distance <= maxDistance) {
                result.push(newNeighbour(pti, ptj, distance, n1, n2));
            }
        }
    }
}


function getNeighbours(n1: QuadNode | undefined, maxDistance: number, result: Neighbour[]) {
    if (!n1) return; // we have or will see this the other way round.
    let points = n1.points || [];
    for (let i = 0; i < points.length; i++) {
        let pti = points[i];
        if (pti.mergedTo) continue;
        for (let j = i + 1; j < points.length; j++) {
            let ptj = points[j];
            if (ptj.mergedTo) continue;
            let distance = calcDistance(pti, ptj);
            if (distance <= maxDistance) {
                result.push(newNeighbour(pti, ptj, distance, n1, n1))
            }
        }
    }
}

export function buildDendrogramFast(points: Point[]): Point {
    let quad = createQuad(points);
    // ideally we'd like to merge only the nearestneighbours
    var maxDistance = quad.getNodeSize()
    while (!quad.root.isLeaf() || (quad.root?.points?.length || 0) > 1) {
        //printQuadTree(quad);
        //Log.debug("merging:", maxDistance);
        let neighbours = getQuadTreeNeighbours(quad, maxDistance);
        sortByDistance(neighbours);
        for (let neighbour of neighbours) {
            // printQuadTree(quad);
            let p1: Point = neighbour.pt1;
            let p2: Point = neighbour.pt2;
            if (p1.mergedTo || p2.mergedTo) continue;
            let mergedPoint = getMergedPoint([p1, p2]);
            neighbour.n1?.remove(p1);
            neighbour.n2?.remove(p2);
            quad.add(mergedPoint);
        }
        maxDistance *= 2
    }
    return quad?.root?.points?.[0] as any;

}


