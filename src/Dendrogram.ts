import { Point, getNextPointId } from "./Point";
import { twoDec } from "./Utils";

export interface Dendrogram extends Point {
    children?: Array<Dendrogram>;
}

function calcMergedPoint(points: Dendrogram[]): Dendrogram {
    let xsum = 0;
    let ysum = 0;
    let wsum = 0;
    for (var point of points) {
        if (point.weight > 0) {
            xsum += point.x * point.weight;
            ysum += point.y * point.weight;
            wsum += point.weight;
            point.merged = true;
        }
    }
    return { id: getNextPointId(), x: xsum / wsum, y: ysum / wsum, weight: wsum, children: points }
}

export function mergePoints(pointsToMerge: Dendrogram[], nodes: Dendrogram[]): Dendrogram {
    let Dendrogram = calcMergedPoint(pointsToMerge);
    pointsToMerge.forEach((point) => {
        let pointToRemoveIndex = nodes.indexOf(point);
        nodes.splice(pointToRemoveIndex, 1);
    });
    nodes.push(Dendrogram);
    return Dendrogram;
}


export function sortDendrogram(dendrogram: Dendrogram) {
    let children = (dendrogram as Dendrogram).children;
    if (children) {
        children.sort((a, b) => a.id - b.id);
        for (let child of children) {
            sortDendrogram(child);
        }
    }
}

export function displayDendrogram(dendrogram: Dendrogram) {
    //displayDendrogramNode("", "", dendrogram);
    displayDendrogramNode2("", "", dendrogram);
}

function displayDendrogramNode(prefix1: string, prefix2: string, dendrogram: Dendrogram) {
    let children = (dendrogram as Dendrogram).children;
    console.log(prefix1 + "#" + dendrogram.id + " x:" + twoDec(dendrogram.x) + ", y:" + twoDec(dendrogram.y) + " w:" + dendrogram.weight);
    if (children) {
        for (let i = 0; i < children.length; i++) {
            let child = children[i];
            displayDendrogramNode(
                prefix2 + (i == children.length - 1 ? "└─" : "├─"),
                prefix2 + (i == children.length - 1 ? "  " : "│ "),
                child);
        }
    }
}

function displayDendrogramNode2(prefix1: string, prefix2: string, dendrogram: Dendrogram) {
    let children = (dendrogram as Dendrogram).children;
    if (children) {
        for (let i = 0; i < children.length; i++) {
            let child = children[i];
            displayDendrogramNode2(
                prefix2 + (i == 0 ? "┌─" : "├─"),
                prefix2 + (i == 0 ? "  " : "│ "),
                child);
        }
    }
    console.log(prefix1 + "#" + dendrogram.id
        + " (" + twoDec(dendrogram.x) + "," + twoDec(dendrogram.y) + ")"
        + (dendrogram.weight > 1 ? " w:" + dendrogram.weight : ""));
}