import { QuadTree, Point } from "./QuadTree";
import { random } from "./Random";
import { QuadNode } from "./QuadNode";
import { EnumerableQuad as QuadEnumerator } from "./EnumerableQuad";

var debug = true;

if (debug) {
    var NB_POINTS = 50;
    var FULL_AREA_WIDTH = 100;
    var FULL_AREA_HEIGHT = 100;
} else {
    var NB_POINTS = 50_000_000;
    var FULL_AREA_WIDTH = 1_000_000;
    var FULL_AREA_HEIGHT = 1_000_000;
}

var CLUSTER_MIN_SIZE = 1;


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


let points = createPoints();
let quad = new QuadTree({ nodeSize: CLUSTER_MIN_SIZE });
points.forEach((point) => quad.add(point));

console.log("done");
//printQuad(quad.root, "root", "");

let quadEnumerator = new QuadEnumerator(quad);

var current = quadEnumerator.getFirst()
var pointsFound = 0;
while (current) {
    printPoints("    ", current.points);
    pointsFound += (current.points?.length || 0)
    current = quadEnumerator.getNext();
}


console.log("Found " + pointsFound + " points");

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
        for (var p of points) {
            console.log(prefix + "pt #" + p.id + " (" + p.x + ", " + p.y + ")")
        }

    }
}