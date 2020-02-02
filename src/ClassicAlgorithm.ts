import { Dendrogram, mergePoints, sortDendrogram, displayDendrogram } from "./Dendrogram";
import { Neighbour, newNeighbour } from "./Neighbour";
import { calcDistance, Point } from "./Point";
import { twoDec } from "./Utils";

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

export function buildDendrogramSlow(points: Point[]): Dendrogram {
    let nodes: Array<Dendrogram> = points;
    let maxDistance = Number.MAX_VALUE;
    while (nodes.length > 1) {
        let nearestNeighbour = getNearestNeighbour(nodes);
        if (nearestNeighbour == null) break;
        let newNode = mergePoints([nearestNeighbour.pt1, nearestNeighbour.pt2], nodes)
        console.log("merged #" + nearestNeighbour.pt1.id + " with #" + nearestNeighbour.pt2.id + " distance " + twoDec(nearestNeighbour.distance) + " to #" + newNode.id + " weight: " + newNode.weight);
    }
    let result: Dendrogram = nodes[0];
    sortDendrogram(result);
    return result;
}
