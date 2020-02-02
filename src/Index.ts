import { QuadTree } from "./QuadTree";
import { Point, calcDistance, getNextPointId } from "./Point";
import { random } from "./Random";
import { QuadNode } from "./QuadNode";
import { QuadEnumerator } from "./QuadEnumerator";
import { Neighbour, newNeighbour } from "./Neighbour";
import { Dendrogram, sortDendrogram, displayDendrogram, mergePoints } from "./Dendrogram";
import { twoDec } from "./Utils";

var debug = true;
// debug = false;

if (debug) {
    var NB_POINTS = 50;
    var FULL_AREA_WIDTH = 50;
    var FULL_AREA_HEIGHT = 50;
    var DISPLAY_DECIMATOR = 1;
} else {
    var NB_POINTS = 10_000;
    var FULL_AREA_WIDTH = 10_000;
    var FULL_AREA_HEIGHT = 10_000;
    var DISPLAY_DECIMATOR = 5000;
}

var CLUSTER_MIN_SIZE = 1;

let dendro1 = buildDendrogramSlow();
//listNeighboursFast(points, 1);
//listNeighboursSlow(points, 1);

//mergeNeighboursFast(points);

function mergeNeighboursFast(points: Dendrogram[]) {
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

            if (p1.merged || p2.merged) continue;
            let weight1 = p1.weight || 1;
            let weight2 = p2.weight || 1;
            let totalWeight = weight1 + weight2;
            let p: Dendrogram = {
                id: getNextPointId(),
                x: (p1.x * weight1 + p2.x * weight2) / totalWeight,
                y: (p1.y * weight1 + p2.y * weight2) / totalWeight,
                weight: totalWeight
            }
        }
        maxDistance *= 2

    }
    //console.log("fast", { neighbours: result.length });

}

function sortByDistance(neighbours: Array<Neighbour>): void {
    neighbours.sort((a, b) => a.distance - b.distance)
}
// function mergeQuadPoints(quad: QuadTree, maxDistance: number) {
//     let result: Neighbour[] = []
//     let quadEnumerator = new QuadEnumerator(quad);
//     var current = quadEnumerator.getFirst()
//     while (current) {
//         if (current.points) getDistances(current.points, maxDistance, result);
//         getInterNodeDistances(current, QuadTree.getEastNeighbour(current), maxDistance, result);
//         getInterNodeDistances(current, QuadTree.getSouthWestNeighbour(current), maxDistance, result);
//         getInterNodeDistances(current, QuadTree.getSouthNeighbour(current), maxDistance, result);
//         getInterNodeDistances(current, QuadTree.getSouthEastNeighbour(current), maxDistance, result);
//         current = quadEnumerator.getNext();
//     }
// }

function listNeighboursSlow(points: Dendrogram[], maxDistance: number) {
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
        if (point.id % DISPLAY_DECIMATOR == 0) printPoint("adding point...", point)
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

function createPoints(): Point[] {
    var points = new Array(NB_POINTS).fill(0).map(() => {
        let id = getNextPointId();
        let x = Math.floor(random() * FULL_AREA_WIDTH * 10) / 10;
        let y = Math.floor(random() * FULL_AREA_HEIGHT * 10) / 10;
        return { id, x, y, weight: 1 };
    });
    return points;
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

function printPoints(prefix: string, points?: Point[]) {
    if (points) {
        for (var point of points) {
            if (point.id % DISPLAY_DECIMATOR == 0) printPoint(prefix, point)
        }
    }
}

function printPoint(prefix: string, point: Point) {
    console.log(prefix + "pt #" + point.id + " (" + point.x + ", " + point.y + ")")
}

function getNeighbours(points: Dendrogram[], maxDistance: number, result: Neighbour[]) {
    for (let i = 0; i < points.length; i++) {
        let pti = points[i];
        if (pti.merged) continue;
        for (let j = i + 1; j < points.length; j++) {
            let ptj = points[j];
            if (ptj.merged) continue;
            let distance = calcDistance(pti, ptj);
            if (distance <= maxDistance) {
                result.push(newNeighbour(pti, ptj, distance))
            }
        }
    }
}

function getNearestNeighbour(points: Dendrogram[]): Neighbour | null {
    let neighbours: Neighbour[] = []
    var maxDistance = Number.MAX_VALUE;
    var nearestNeighbour: Neighbour | null = null;
    for (let i = 0; i < points.length; i++) {
        let pti = points[i];
        if (pti.merged) continue;
        for (let j = i + 1; j < points.length; j++) {
            let ptj = points[j];
            if (ptj.merged) continue;
            let distance = calcDistance(pti, ptj);
            if (distance <= maxDistance) {
                maxDistance = distance;
                nearestNeighbour = newNeighbour(pti, ptj, distance)
            }
        }
    }
    return nearestNeighbour;
}

function buildDendrogramSlow(): Dendrogram {
    let nodes: Array<Dendrogram> = createPoints().map(pt => { return { x: pt.x, y: pt.id, id: pt.id, weight: 1 }; });
    let maxDistance = Number.MAX_VALUE;
    while (nodes.length > 1) {
        let nearestNeighbour = getNearestNeighbour(nodes);
        if (nearestNeighbour == null) break;
        let newNode = mergePoints([nearestNeighbour.pt1, nearestNeighbour.pt2], nodes)
        console.log("merged #" + nearestNeighbour.pt1.id + " with #" + nearestNeighbour.pt2.id + " distance " + twoDec(nearestNeighbour.distance) + " to #" + newNode.id + " weight: " + newNode.weight);
    }
    let result: Dendrogram = nodes[0];
    sortDendrogram(result);
    displayDendrogram(result)
    return result;
}

console.log("done")

