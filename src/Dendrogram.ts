import { Point, getNextPointId, pointToString, calcDistance } from "./Point";
import { twoDec } from "./Utils";
import { Log, LogLevel } from "./Log";

export function getMergedPoint(points: Point[]): Point {
    let xsum = 0;
    let ysum = 0;
    let wsum = 0;
    let result = { id: getNextPointId(), x: 0, y: 0, weight: 0, children: points }
    Log.writeLine(LogLevel.Verbose, "merging (distance:" + calcDistance(points[0], points[1]) + ")")
    for (var point of points) {
        xsum += point.x * point.weight;
        ysum += point.y * point.weight;
        wsum += point.weight;
        point.mergedTo = result;
        Log.writeLine(LogLevel.Verbose, "   " + pointToString(point))
    }
    result.x = xsum / wsum;
    result.y = ysum / wsum;
    result.weight = wsum
    Log.writeLine(LogLevel.Verbose, " => " + pointToString(result))
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

export function logDendrogram(logLevel: LogLevel, dendrogram?: Point | undefined) {
    if (!dendrogram) Log.writeLine(logLevel, "null");
    else logBottomUpDendrogram(logLevel, "", "", dendrogram);
}

function logTopDownDendrogram(logLevel: LogLevel, prefix1: string, prefix2: string, dendrogram: Point) {
    if (!Log.willLog(logLevel)) return;
    let children = dendrogram.children;
    Log.writeLine(logLevel, prefix1 + "#" + dendrogram.id + " x:" + twoDec(dendrogram.x) + ", y:" + twoDec(dendrogram.y) + " w:" + dendrogram.weight);
    if (children) {
        for (let i = 0; i < children.length; i++) {
            let child = children[i];
            logTopDownDendrogram(logLevel,
                prefix2 + (i == children.length - 1 ? "└─" : "├─"),
                prefix2 + (i == children.length - 1 ? "  " : "│ "),
                child);
        }
    }
}

function logBottomUpDendrogram(logLevel: LogLevel, prefix1: string, prefix2: string, dendrogram: Point) {
    if (!Log.willLog(logLevel)) return;
    let children = (dendrogram as Point).children;
    if (children) {
        for (let i = 0; i < children.length; i++) {
            let child = children[i];
            logBottomUpDendrogram(logLevel,
                prefix2 + (i == 0 ? "┌─" : "├─"),
                prefix2 + (i == 0 ? "  " : "│ "),
                child);
        }
    }
    Log.writeLine(logLevel, prefix1 + pointToString(dendrogram));
}