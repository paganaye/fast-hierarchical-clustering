import { buildDendrogramSlow } from "./ClassicAlgorithm";
import { displayDendrogram } from "./Dendrogram";
import { buildDendrogramFast } from "./NewAlgorithm";
import { createPoints, SampleDataset } from "./SampleData";

let points = createPoints(SampleDataset.Small); // or SampleDataset.Medium or SampleDataset.Large

let dendroSlow = buildDendrogramSlow(points);
console.log("Classic Algorithm")
displayDendrogram(dendroSlow)

let dendroFast = buildDendrogramFast(points);
console.log("Faster Algorithm")
displayDendrogram(dendroFast)
