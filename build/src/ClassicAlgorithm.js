import {Cluster, getDistance} from "./Cluster.js";
import {Pair} from "./IAlgorithm.js";
export class ClassicAlgorithm {
  constructor() {
    this.dendrograms = [];
  }
  init(points) {
    this.dendrograms = points.slice();
  }
  findNearestTwoPoints() {
    let distanceMin = Number.MAX_VALUE;
    let result = void 0;
    let best;
    let pt2;
    for (let i1 = 0; i1 < this.dendrograms.length; i1++) {
      let point1 = this.dendrograms[i1];
      for (let i2 = i1 + 1; i2 < this.dendrograms.length; i2++) {
        let point2 = this.dendrograms[i2];
        let distance = getDistance(point1, point2);
        if (distance < distanceMin) {
          distanceMin = distance;
          best = [i1, i2];
        } else if (distance == distanceMin) {
          console.warn("We got equal distances");
        }
      }
    }
    if (best) {
      return new Pair(this.dendrograms[best[0]], this.dendrograms[best[1]], () => {
        let newCluster = new Cluster(this.dendrograms[best[0]], this.dendrograms[best[1]]);
        this.dendrograms[best[0]] = newCluster;
        this.dendrograms.splice(best[1], 1);
      });
    }
  }
  getCurrentDendrograms() {
    return this.dendrograms;
  }
  getDendrogramsCount() {
    return this.dendrograms.length;
  }
}
