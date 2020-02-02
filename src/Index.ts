import { buildDendrogramSlow as buildDendrogramClassic } from "./ClassicAlgorithm";
import { displayDendrogram } from "./Dendrogram";
import { buildDendrogramFast as buildDendrogramNew } from "./NewAlgorithm";
import { createPoints, SampleDataset } from "./SampleData";

let dataset = SampleDataset.Small // or SampleDataset.Medium or SampleDataset.Large
//runClassicAlgorithm();
runNewAlgorithm();

function runClassicAlgorithm() {
    console.log("Classic Algorithm")
    let points = createPoints(dataset);
    let dendroClassic = buildDendrogramClassic(points);
    displayDendrogram(dendroClassic)
}

function runNewAlgorithm() {
    console.log("New Algorithm")
    let points = createPoints(dataset);
    let dendroNew = buildDendrogramNew(points);
    displayDendrogram(dendroNew)
}

console.log("done")
