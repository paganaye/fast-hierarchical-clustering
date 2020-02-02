import { QuadTree } from "./QuadTree";
import { calcDistance, getNextPointId, printPoints, Point } from "./Point";
import { QuadNode } from "./QuadNode";
import { QuadEnumerator } from "./QuadEnumerator";
import { Neighbour, newNeighbour } from "./Neighbour";
import { sortDendrogram, displayDendrogram, mergePoints } from "./Dendrogram";
import { twoDec } from "./Utils";

const CLUSTER_MIN_SIZE = 1;

function sortByDistance(neighbours: Array<Neighbour>): void {
    neighbours.sort((a, b) => a.distance - b.distance)
}

function listNeighboursSlow(points: Point[], maxDistance: number) {
    console.log("listNeighboursSlow");
    let result: Neighbour[] = [];
    getNeighbours(points, maxDistance, result)
    console.log("slow", { neighbours: result.length });
}

function listNeighboursFast(points: Point[], maxDistance: number) {
    let quad = createQuad(points)
    console.log("listNeighboursFast");
    let result = getQuadTreeNeighbours(quad, 1);
    console.log("fast", { neighbours: result.length });
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
    let quadEnumerator = new QuadEnumerator(quad);
    var current = quadEnumerator.getFirst()
    while (current) {
        getNodeSouthEastNeighbours(current, maxDistance, neighbours);
        current = quadEnumerator.getNext();
    }
    return neighbours;
}

function getNodeSouthEastNeighbours(current: QuadNode, maxDistance: number, neighbours: Neighbour[]) {
    if (current.points) getNeighbours(current.points, maxDistance, neighbours);
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

function enumerateQuad(quad: QuadTree) {
    let quadEnumerator = new QuadEnumerator(quad);
    var current = quadEnumerator.getFirst()
    var pointsFound = 0;
    while (current) {
        printPoints("    ", current.points);
        pointsFound += (current.points?.length || 0)
        current = quadEnumerator.getNext();
    }
}

function printNode(node: QuadNode) {
    console.log(JSON.stringify({ xmin: node.xmin, ymin: node.ymin, xmax: node.xmax, ymax: node.ymax }))
}

function printQuad(node: QuadNode | undefined, sector: string, prefix: string) {
    if (!node) return;
    console.log(prefix + sector + "{")
    let prefix2 = prefix + "  ";
    console.log(prefix2 + JSON.stringify({ xmin: node.xmin, ymin: node.ymin, xmax: node.xmax, ymax: node.ymax }))
    printPoints(prefix2, node.points);
    printQuad(node.nw, "nw", prefix2)
    printQuad(node.ne, "ne", prefix2)
    printQuad(node.sw, "sw", prefix2)
    printQuad(node.se, "se", prefix2)
    console.log(prefix + "} " + sector)
}

function getNeighbours(points: Point[], maxDistance: number, result: Neighbour[]) {
    for (let i = 0; i < points.length; i++) {
        let pti = points[i];
        if (pti.mergedTo) continue;
        for (let j = i + 1; j < points.length; j++) {
            let ptj = points[j];
            if (ptj.mergedTo) continue;
            let distance = calcDistance(pti, ptj);
            if (distance <= maxDistance) {
                result.push(newNeighbour(pti, ptj, distance))
            }
        }
    }
}

export function buildDendrogramFast(points: Point[]): Point {
    let quad = createQuad(points);
    // ideally we'd like to merge only the nearestneighbours
    var maxDistance = quad.getNodeSize()
    // let result = mergeQuadPoints(quad, maxDistance);
    // getQuadDistances
    while (maxDistance < 100) {
        let neighbours = getQuadTreeNeighbours(quad, maxDistance);
        sortByDistance(neighbours);
        for (let neighbour of neighbours) {
            let p1 = neighbour.pt1;
            let p2 = neighbour.pt2;

            if (p1.mergedTo || p2.mergedTo) continue;
            let weight1 = p1.weight || 1;
            let weight2 = p2.weight || 1;
            let totalWeight = weight1 + weight2;
            let p: Point = {
                id: getNextPointId(),
                x: (p1.x * weight1 + p2.x * weight2) / totalWeight,
                y: (p1.y * weight1 + p2.y * weight2) / totalWeight,
                weight: totalWeight
            }
            
        }
        maxDistance *= 2
    }
    return { x: 1, y: 1, id: 1, weight: 1 };

}


