
import { buildDendrogramSlow as buildDendrogramClassic } from "./ClassicAlgorithm";
import { logDendrogram } from "./Dendrogram";
import { buildDendrogramNew as buildDendrogramNew } from "./NewAlgorithm";
import { createPoints } from "./SampleData";
import { Log, LogLevel } from "./Log";

Log.setLogLevel(LogLevel.Important);
Log.writeLine(LogLevel.Important, "Program Starting");
for (let nbPoints = 1000; nbPoints < 50_000; nbPoints += 1000) {
    runClassicAlgorithm(nbPoints);
    runNewAlgorithm(nbPoints);
}
function runClassicAlgorithm(nbPoints: number) {
    let points = createPoints(nbPoints);
    Log.measure(LogLevel.Important, "Classic_Algorithm n=" + nbPoints, () => {
        let dendroClassic = buildDendrogramClassic(points);
        logDendrogram(LogLevel.Detail, dendroClassic)
    })
}

function runNewAlgorithm(nbPoints: number) {
    let points = createPoints(nbPoints);
    Log.measure(LogLevel.Important, "New Algorithm n=" + nbPoints, () => {
        let dendroNew = buildDendrogramNew(points);
        logDendrogram(LogLevel.Detail, dendroNew)
    })
}

Log.writeLine(LogLevel.Important, "Program Complete")
