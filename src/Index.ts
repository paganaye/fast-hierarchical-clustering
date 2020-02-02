
import { buildDendrogramSlow as buildDendrogramClassic } from "./ClassicAlgorithm";
import { displayDendrogram } from "./Dendrogram";
import { buildDendrogramNew as buildDendrogramNew } from "./NewAlgorithm";
import { createPoints, SampleDataset } from "./SampleData";
import { Log, LogLevel } from "./Log";

Log.level = LogLevel.Debug;
let dataset = SampleDataset.Medium; // or SampleDataset.Medium or SampleDataset.Large
runClassicAlgorithm();
runNewAlgorithm();

function runClassicAlgorithm() {
    Log.measure("Classic Algorithm", ()=>{
        let points = createPoints(dataset);
        let dendroClassic = buildDendrogramClassic(points);
        displayDendrogram(dendroClassic)
    })
}

function runNewAlgorithm() {
    Log.measure("New Algorithm", ()=>{
        Log.debug("New Algorithm")
        let points = createPoints(dataset);
        let dendroNew = buildDendrogramNew(points);
        displayDendrogram(dendroNew)
    })
}

Log.debug("done")
