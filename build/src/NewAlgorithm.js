import {Cluster} from "./Cluster.js";
import {Pair} from "./IAlgorithm.js";
import {QuadTree} from "./QuadTree.js";
export class NewAlgorithm {
  constructor(initialLevels = 10) {
    this.initialLevels = initialLevels;
    this.neighbours = [];
    this.quadTree = new QuadTree(initialLevels);
  }
  init(points) {
    for (let point of points) {
      this.quadTree.insert(point);
    }
    this.neighbours = this.quadTree.getNeighbours();
    this.neighbours.sort((a, b) => b.distance - a.distance);
  }
  findNearestTwoPoints() {
    while (true) {
      while (this.neighbours.length == 0) {
        if (!this.quadTree.trim())
          return void 0;
        this.neighbours = this.quadTree.getNeighbours();
        this.neighbours.sort((a, b) => b.distance - a.distance);
      }
      let {point1, point2} = this.neighbours.pop();
      return new Pair(point1, point2, () => {
        this.quadTree.delete(point1);
        this.quadTree.delete(point2);
        let newCluster = new Cluster(point1, point2);
        let newNeighbours = [];
        this.quadTree.insertAndAddNeighbours(newCluster, newNeighbours);
        newNeighbours.sort((a, b) => b.distance - a.distance);
        this.neighbours = this.filterAndMerge((it) => it.point1 != point1 && it.point1 != point2 && it.point2 != point1 && it.point2 != point2, newNeighbours);
      });
    }
  }
  filterAndMerge(predicate, newNeighbours) {
    let arrSorted = [];
    let idxA = 0, idxB = 0, idxS = 0;
    let arrA = this.neighbours;
    let arrB = newNeighbours;
    while (idxA < arrA.length || idxB < arrB.length) {
      let entryA = idxA < arrA.length ? arrA[idxA] : void 0;
      let entryB = idxB < arrB.length ? arrB[idxB] : void 0;
      if (!entryB || entryA && entryA.distance > entryB.distance) {
        if (predicate(entryA))
          arrSorted.push(entryA);
        idxA++;
      } else {
        arrSorted.push(entryB);
        idxB++;
      }
    }
    return arrSorted;
  }
  getCurrentDendrograms() {
    return this.quadTree.getDendrograms();
  }
  getDendrogramsCount() {
    return this.quadTree.pointCount;
  }
}
