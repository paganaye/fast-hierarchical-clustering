import {ClassicAlgorithm} from "./ClassicAlgorithm.js";
import {NewAlgorithm} from "./NewAlgorithm.js";
import {Point} from "./Point.js";
import {Points} from "./Points.js";
import {AlgorithmRunner} from "./AlgorithmRunner.js";
export class App {
  constructor() {
    this.points = [];
    this.palette = [];
    this.clusterCount = 40;
    this.dotSize = 3;
    this.nbPointPerCluster = 10;
    this.clusterSize = 0.05;
    this.canvasWidth = 300;
    this.canvasHeight = 300;
    this.dendrogramCount = 6;
    for (let i = 0; i < this.clusterCount; i++) {
      let point0 = Point.randomPoint();
      Points.addRandomPointsAround(this.points, this.nbPointPerCluster, point0, this.clusterSize);
    }
    for (let r of ["00", "c0"])
      for (let g of ["00", "c0"])
        for (let b of ["00", "c0"]) {
          let color = "#" + r + g + b;
          if (color != "#000000" && color != "#c0c0c0")
            this.palette.push(color);
        }
  }
  init() {
    this.classicAlgorithm = new AlgorithmRunner(this, "canvas1", "output1", new ClassicAlgorithm());
    this.newAlgorithm = new AlgorithmRunner(this, "canvas2", "output2", new NewAlgorithm());
  }
  async run() {
    this.init();
    await this.classicAlgorithm.run();
    await this.newAlgorithm.run();
  }
}
var app = new App();
setTimeout(() => app.run(), 0);
