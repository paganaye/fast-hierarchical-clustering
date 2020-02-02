import { mergePoints, sortDendrogram, logDendrogram } from "./Dendrogram";
import { Neighbour, newNeighbour } from "./Neighbour";
import { calcDistance, Point } from "./Point";
import { twoDec } from "./Utils";
import { Log, LogLevel } from "./Log";

function getNearestNeighbour(points: Point[]): Neighbour | null {
    let neighbours: Neighbour[] = []
    var maxDistance = Number.MAX_VALUE;
    var nearestNeighbour: Neighbour | null = null;
    for (let i = 0; i < points.length; i++) {
        let pti = points[i];
        if (pti.mergedTo) continue;
        for (let j = i + 1; j < points.length; j++) {
            let ptj = points[j];
            if (ptj.mergedTo) continue;
            let distance = calcDistance(pti, ptj);
            if (distance < maxDistance
                || (distance == maxDistance && pti.id < nearestNeighbour!.pt1.id)
                || (distance == maxDistance && pti.id == nearestNeighbour!.pt1.id && ptj.id < nearestNeighbour!.pt2.id)) {
                maxDistance = distance;
                nearestNeighbour = newNeighbour(pti, ptj, distance)
            }
        }
    }
    return nearestNeighbour;
}

export function buildDendrogramSlow(points: Point[]): Point {
    let nodes: Array<Point> = points;
    let maxDistance = Number.MAX_VALUE;
    while (nodes.length > 1) {
        let nearestNeighbour = getNearestNeighbour(nodes);
        if (nearestNeighbour == null) break;
        let newNode = mergePoints([nearestNeighbour.pt1, nearestNeighbour.pt2], nodes)
        //Log.info("merged #" + nearestNeighbour.pt1.id + " with #" + nearestNeighbour.pt2.id + " distance " + twoDec(nearestNeighbour.distance) + " to #" + newNode.id + " weight: " + newNode.weight);
    }
    let result: Point = nodes[0];
    sortDendrogram(result);
    return result;
}
