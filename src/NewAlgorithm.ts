import { QuadTree, logQuadTree } from "./QuadTree";
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

function getNewPointNeighbours(pt1: Point, n1: QuadNode, maxDistance: number, neighbours: Neighbour[]) {
    if (n1.points) getNewPointIntraNodeNeighbours(pt1, n1, maxDistance, neighbours);
    getNewPointInterNodeNeigbours(pt1, n1, QuadTree.getEastNeighbour(n1), maxDistance, neighbours);
    getNewPointInterNodeNeigbours(pt1, n1, QuadTree.getSouthWestNeighbour(n1), maxDistance, neighbours);
    getNewPointInterNodeNeigbours(pt1, n1, QuadTree.getSouthNeighbour(n1), maxDistance, neighbours);
    getNewPointInterNodeNeigbours(pt1, n1, QuadTree.getSouthEastNeighbour(n1), maxDistance, neighbours);
    getNewPointInterNodeNeigbours(pt1, n1, QuadTree.getNorthWestNeighbour(n1), maxDistance, neighbours);
    getNewPointInterNodeNeigbours(pt1, n1, QuadTree.getNorthNeighbour(n1), maxDistance, neighbours);
    getNewPointInterNodeNeigbours(pt1, n1, QuadTree.getNorthEastNeighbour(n1), maxDistance, neighbours);
    getNewPointInterNodeNeigbours(pt1, n1, QuadTree.getWestNeighbour(n1), maxDistance, neighbours);
}

function getNewPointInterNodeNeigbours(pt1: Point, n1: QuadNode, n2: QuadNode | undefined, maxDistance: number, result: Neighbour[]) {
    if (!n2) return;
    let points2 = n2.points || [];
    for (let j = 0; j < points2.length; j++) {
        let pt2 = points2[j];
        let distance = calcDistance(pt1, pt2);
        if (distance <= maxDistance) {
            result.push(newNeighbour(pt1, pt2, distance, n1, n2));
        }
    }
}

function getNewPointIntraNodeNeighbours(pt1: Point, n1: QuadNode, maxDistance: number, result: Neighbour[]) {
    if (!n1) return; // we have or will see this the other way round.
    let points = n1.points || [];
    for (let j = 0; j < points.length; j++) {
        let pt2 = points[j];
        if (pt2.mergedTo || pt2 == pt1) continue;
        let distance = calcDistance(pt1, pt2);
        if (distance <= maxDistance) {
            result.push(newNeighbour(pt1, pt2, distance, n1, n1))
        }
    }
}


export function buildDendrogramNew(points: Point[]): Point {
    let quad = createQuad(points);
    // ideally we'd like to merge only the nearestneighbours
    var nodeSize = quad.getNodeSize()
    //printQuadTree(quad);

    while (quad.root?.points?.length != 1) {
        //printQuadTree(quad);
        //Log.writeLine(LogLevel.Debug, "merging:", maxDistance);
        let neighbours = getQuadTreeNeighbours(quad, nodeSize);
        sortByDistance(neighbours);
        while (neighbours.length > 0) {
            let neighbour = neighbours.shift() as Neighbour;
            let p1: Point = neighbour.pt1;
            let p2: Point = neighbour.pt2;
            if (p1.mergedTo || p2.mergedTo) continue;
            let mergedPoint = getMergedPoint([p1, p2]);
            neighbour.n1?.remove(p1);
            neighbour.n2?.remove(p2);
            let mergePointNode = quad.add(mergedPoint);
            getNewPointNeighbours(mergedPoint, mergePointNode, nodeSize, neighbours);
            sortByDistance(neighbours);
            //if (mergedPoint.id==1218){
            //printQuadTree(quad);
            //}            
        }
        nodeSize *= 2
        mergeQuadTree(quad, nodeSize);
        //printQuadTree(quad);
    }
    return quad?.root?.points?.[0] as any;
}


