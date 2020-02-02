import { Point, getNextPointId, pointToString } from "./Point";
import { twoDec } from "./Utils";
import { Log } from "./Log";

export function getMergedPoint(points: Point[], display?: boolean): Point {
    let xsum = 0;
    let ysum = 0;
    let wsum = 0;
    let result = { id: getNextPointId(), x: 0, y: 0, weight: 0, children: points }
    if (display) {
        Log.debug("merging")
    }
    for (var point of points) {
        xsum += point.x * point.weight;
        ysum += point.y * point.weight;
        wsum += point.weight;
        point.mergedTo = result;
        if (display) {
            Log.debug("   " + pointToString(point))
        }
    }
    result.x = xsum / wsum;
    result.y = ysum / wsum;
    result.weight = wsum
    if (display) {
        Log.debug(" => " + pointToString(result))
    }
    return result;
}

export function mergePoints(pointsToMerge: Point[], nodes: Point[]): Point {
    let Point = getMergedPoint(pointsToMerge);
    pointsToMerge.forEach((point) => {
        let pointToRemoveIndex = nodes.indexOf(point);
        nodes.splice(pointToRemoveIndex, 1);
    });
    nodes.push(Point);
    return Point;
}

export function sortDendrogram(dendrogram: Point) {
    let children = (dendrogram as Point).children;
    if (children) {
        children.sort((a, b) => a.id - b.id);
        for (let child of children) {
            sortDendrogram(child);
        }
    }
}

export function displayDendrogram(dendrogram: Point) {
    displayBottomUpDendrogram("", "", dendrogram);
}

function displayTopDownDendrogram(prefix1: string, prefix2: string, dendrogram: Point) {
    let children = dendrogram.children;
    Log.info(prefix1 + "#" + dendrogram.id + " x:" + twoDec(dendrogram.x) + ", y:" + twoDec(dendrogram.y) + " w:" + dendrogram.weight);
    if (children) {
        for (let i = 0; i < children.length; i++) {
            let child = children[i];
            displayTopDownDendrogram(
                prefix2 + (i == children.length - 1 ? "└─" : "├─"),
                prefix2 + (i == children.length - 1 ? "  " : "│ "),
                child);
        }
    }
}

function displayBottomUpDendrogram(prefix1: string, prefix2: string, dendrogram: Point) {
    let children = (dendrogram as Point).children;
    if (children) {
        for (let i = 0; i < children.length; i++) {
            let child = children[i];
            displayBottomUpDendrogram(
                prefix2 + (i == 0 ? "┌─" : "├─"),
                prefix2 + (i == 0 ? "  " : "│ "),
                child);
        }
    }
    Log.info(prefix1 + pointToString(dendrogram));
}