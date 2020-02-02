
import { buildDendrogramSlow as buildDendrogramClassic } from "./ClassicAlgorithm";
import { logDendrogram } from "./Dendrogram";
import { buildDendrogramNew as buildDendrogramNew } from "./NewAlgorithm";
import { createPoints, SampleDataset } from "./SampleData";
import { Log, LogLevel } from "./Log";

Log.setLogLevel(LogLevel.Important);
Log.writeLine(LogLevel.Detail, "Program Starting");
let dataset = SampleDataset.Medium; // or SampleDataset.Medium or SampleDataset.Large
runClassicAlgorithm();
runNewAlgorithm();

function runClassicAlgorithm() {
    Log.measure(LogLevel.Important, "Classic Algorithm", () => {
        let points = createPoints(dataset);
        let dendroClassic = buildDendrogramClassic(points);
        logDendrogram(LogLevel.Important, dendroClassic)
    })
}

function runNewAlgorithm() {
    Log.measure(LogLevel.Important, "New Algorithm", () => {
        let points = createPoints(dataset);
        let dendroNew = buildDendrogramNew(points);
        logDendrogram(LogLevel.Important, dendroNew)
    })
}

Log.writeLine(LogLevel.Important, "done")
