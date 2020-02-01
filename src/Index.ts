import { QuadTree, Point } from "./QuadTree";
import { random } from "./Random";
import { QuadNode } from "./QuadNode";
import { QuadEnumerator } from "./QuadEnumerator";

var debug = true;
//debug = false;

if (debug) {
    var NB_POINTS = 100;
    var FULL_AREA_WIDTH = 5;
    var FULL_AREA_HEIGHT = 5;
    var DISPLAY_DECIMATOR = 1;
    var FIRST_DISTANCE = 1.99;
} else {
    var NB_POINTS = 1_000_000;
    var FULL_AREA_WIDTH = 1_000_000;
    var FULL_AREA_HEIGHT = 1_000_000;
    var DISPLAY_DECIMATOR = 5000;
    var FIRST_DISTANCE = 5;
}

var CLUSTER_MIN_SIZE = 1;


let points = createPoints();
let quad = new QuadTree({ nodeSize: CLUSTER_MIN_SIZE });
points.forEach((point) => {
    if (point.id % DISPLAY_DECIMATOR == 0) printPoint("adding point...", point)
    quad.add(point)
});

printQuad(quad.root, "root", "");
listNeighboursFast(quad, FIRST_DISTANCE);
listNeighboursSlow(points, FIRST_DISTANCE);

function listNeighboursSlow(points: Point[], maxDistance: number) {
    console.log("listNeighboursSlow");
    let result: any[] = [];
    getDistances(points, maxDistance, result)
    console.log("slow", result.length);
    printDistances(result)
}


function listNeighboursFast(quad: QuadTree, maxDistance: number) {
    console.log("listNeighboursFast");
    let quadEnumerator = new QuadEnumerator(quad);
    var current = quadEnumerator.getFirst()
    let result: any[] = []
    while (current) {
        if (current.points) getDistances(current.points, maxDistance, result);
        checkDistances(current, QuadTree.getEastNeighbour(current), maxDistance, result);
        checkDistances(current, QuadTree.getSouthWestNeighbour(current), maxDistance, result);
        checkDistances(current, QuadTree.getSouthNeighbour(current), maxDistance, result);
        checkDistances(current, QuadTree.getSouthEastNeighbour(current), maxDistance, result);
        current = quadEnumerator.getNext();
    }
    console.log("fast", result.length)
    printDistances(result)
}

function printDistances(distances: any[]) {
    for (var x of distances) {
        var p1 = x.p1;
        var p2 = x.p2;
        if (p1 > p2) {
            p1 = x.p2;
            p2 = x.p1;
        }
        console.log(p1 + "-" + p2 + " " + x.distance);
    }
}

function checkDistances(n1: QuadNode | undefined, n2: QuadNode | undefined, maxDistance: number, result: any[]) {
    if (!n1 || !n2) return; // we have or will see this the other way round.
    let pts1 = n1.points || [];
    let pts2 = n2.points || [];
    for (let i = 0; i < pts1.length; i++) {
        let pti = pts1[i];
        for (let j = 0; j < pts2.length; j++) {
            let ptj = pts2[j];
            let distance = calcDistance(pti, ptj);
            if (distance <= maxDistance) {
                result.push({ p1: pti.id, p2: ptj.id, distance })
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

// const CLUSTER_MAX_SIZE = 128;

function createPoints(): Point[] {
    var idCounter = 0;
    var points = new Array(NB_POINTS).fill(0).map(() => {
        let id = ++idCounter;
        let x = Math.floor(random() * FULL_AREA_WIDTH);
        let y = Math.floor(random() * FULL_AREA_HEIGHT);
        return { id, x, y };
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

function getDistances(points: Point[], maxDistance: number, result: any[]) {
    for (let i = 0; i < points.length; i++) {
        let pti = points[i];
        for (let j = i + 1; j < points.length; j++) {
            let ptj = points[j];
            let distance = calcDistance(pti, ptj);
            if (distance <= maxDistance) {
                if (pti.id < ptj.id) {
                    result.push({ p1: pti.id, p2: ptj.id, distance });
                } else {
                    result.push({ p1: ptj.id, p2: pti.id, distance });
                }
            }

        }

    }
}

function calcDistance(p1: Point, p2: Point) {
    let dx = p1.x - p2.x;
    let dy = p1.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function printNeighbour(p1: Point, p2: Point) {
    let distance = calcDistance(p1, p2);
    printPoint("   ", p1);
    printPoint("   ", p2);
    console.log("      distance:", distance);
}
