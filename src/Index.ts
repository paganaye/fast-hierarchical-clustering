
import { buildDendrogramSlow as buildDendrogramClassic } from "./ClassicAlgorithm";
import { logDendrogram } from "./Dendrogram";
import { buildDendrogramNew as buildDendrogramNew } from "./NewAlgorithm";
import { createPoints } from "./SampleData";
import { Log, LogLevel } from "./Log";
import { Point } from "./Point";

Log.setLogLevel(LogLevel.Important);
Log.writeLine(LogLevel.Important, "Program Starting");
testSideBySide();

function loopNewAlgorithm() {
    while (true) {
        runNewAlgorithm(5);
    }
}

function testNewAlgorithmScalability() {
    for (let nbPoints = 1_000; nbPoints < 50_000; nbPoints += 1000) {
        runNewAlgorithm(nbPoints);
    }
}

function testSideBySide() {
    var classic: Point | undefined;
    var fast: Point | undefined;
    try {
        for (let nbPoints = 1000; nbPoints < 50_000; nbPoints += 1000) {
            classic = runClassicAlgorithm(nbPoints);
            fast = runNewAlgorithm(nbPoints);
            compareDendrograms(classic, fast);
        }
    } catch (e) {
        Log.writeLine(LogLevel.Error, e);
        logDendrogram(LogLevel.Error, classic)
        logDendrogram(LogLevel.Error, fast)
    }
}

function compareDendrograms(expected: Point, actual: Point) {
    if (expected.id != actual.id) throw Error("Id differ. Expected " + expected.id + " actual " + actual.id);
    let id = expected.id;
    if (expected.x != actual.x) throw Error("x differ in #" + id + ". Expected " + expected.x + " actual " + actual.x);
    if (expected.y != actual.y) throw Error("y differ in #" + id + ". Expected " + expected.y + " actual " + actual.y);
    let expectedCh = expected.children || [];
    let actualCh = actual.children || [];
    if (expectedCh.length != actualCh.length) throw Error("children count differ in #" + id + ". Expected " + expectedCh.length + " actual " + actualCh.length);
    for (let i = 0; i < expectedCh.length; i++) {
        compareDendrograms(expectedCh[i], actualCh[i]);
    }
}

function runClassicAlgorithm(nbPoints: number): Point {
    var result: Point;
    let points = createPoints(nbPoints);
    Log.measure(LogLevel.Important, "Classic_Algorithm n=" + nbPoints, () => {
        result = buildDendrogramClassic(points);
        logDendrogram(LogLevel.Detail, result)
    })
    return result!;
}

function runNewAlgorithm(nbPoints: number) {
    var result: Point;
    let points = createPoints(nbPoints);
    Log.measure(LogLevel.Important, "New Algorithm n=" + nbPoints, () => {
        result = buildDendrogramNew(points);
        logDendrogram(LogLevel.Detail, result)
    })
    return result!;
}

Log.writeLine(LogLevel.Important, "Program Complete")
