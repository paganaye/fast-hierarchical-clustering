import {calculatedDistances, clearCalculatedDistances, getPoints} from "./Cluster.js";
import {getHull} from "./GrahamScan.js";
export class AlgorithmRunner {
  constructor(app, canvasName, outputName, algorithm) {
    this.app = app;
    this.canvas = document.getElementById(canvasName);
    this.preElt = document.getElementById(outputName);
    this.canvas.setAttribute("width", app.canvasWidth + "px");
    this.canvas.setAttribute("height", app.canvasHeight + "px");
    this.ctx = this.canvas.getContext("2d");
    this.algorithm = algorithm;
    this.algorithm.init(app.points);
  }
  async run() {
    let startTime = new Date().getTime();
    clearCalculatedDistances();
    let pair;
    let dendogramsCount = 0;
    do {
      pair = this.algorithm.findNearestTwoPoints();
      if (pair) {
        pair.merge();
      }
      dendogramsCount = this.algorithm.getDendrogramsCount();
    } while (pair && dendogramsCount > this.app.dendrogramCount);
    let dendograms = this.algorithm.getCurrentDendrograms();
    this.displayDendrograms(dendograms);
    var timeDiff = new Date().getTime() - startTime;
    this.preElt.innerText = `${(timeDiff / 1e3).toFixed(2)} sec (${Math.round(calculatedDistances / 1e6).toFixed(1)}M distances compared)`;
  }
  displayDendrograms(dendrograms) {
    this.ctx.clearRect(0, 0, this.app.canvasWidth, this.app.canvasHeight);
    let sortedDendrograms = dendrograms.slice();
    sortedDendrograms.sort((a, b) => a.y - b.y || a.x - b.x);
    for (let i = 0; i < sortedDendrograms.length; i++) {
      let color = this.app.palette[sortedDendrograms.length <= this.app.palette.length ? i : this.app.palette.length - 1];
      let points = getPoints(sortedDendrograms[i]);
      let hull = getHull(points);
      this.displayHull(hull, color);
      this.displayDendrogram(void 0, sortedDendrograms[i], color);
    }
  }
  displayDendrogram(parent, dendrogram, color) {
    let x = dendrogram.x * this.app.canvasWidth;
    let y = dendrogram.y * this.app.canvasHeight;
    if ("count" in dendrogram) {
      this.displayDendrogram(dendrogram, dendrogram.dendrogram1, color);
      this.displayDendrogram(dendrogram, dendrogram.dendrogram2, color);
    } else {
      this.ctx.fillStyle = color;
      this.ctx.beginPath();
      this.ctx.arc(x, y, this.app.dotSize, 0, Math.PI * 2, true);
      this.ctx.fill();
    }
    if (parent != null) {
      let x0 = parent.x * this.app.canvasWidth;
      let y0 = parent.y * this.app.canvasHeight;
      this.ctx.beginPath();
      this.ctx.strokeStyle = color;
      this.ctx.moveTo(x0, y0);
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
    }
  }
  displayHull(hull, color) {
    this.ctx.fillStyle = color + "20";
    this.ctx.beginPath();
    let first = true;
    for (let innerPoint of hull) {
      let x = innerPoint.x * this.app.canvasWidth;
      let y = innerPoint.y * this.app.canvasHeight;
      if (first) {
        this.ctx.moveTo(x, y);
        first = false;
      } else {
        this.ctx.lineTo(x, y);
      }
    }
    this.ctx.closePath();
    this.ctx.fill();
  }
}
