export class Cluster {
  constructor(dendrogram1, dendrogram2, tag = void 0) {
    if (tag)
      this.tag = tag;
    if (dendrogram1.x > dendrogram2.x || dendrogram1.x == dendrogram2.x && dendrogram1.y > dendrogram2.y) {
      this.dendrogram1 = dendrogram2;
      this.dendrogram2 = dendrogram1;
    } else {
      this.dendrogram1 = dendrogram1;
      this.dendrogram2 = dendrogram2;
    }
    if (this.dendrogram1.tag && this.dendrogram2.tag)
      this.tag = this.dendrogram1.tag + this.dendrogram2.tag;
    this.sumX = dendrogram1.getSumX() + dendrogram2.getSumX();
    this.sumY = dendrogram1.getSumY() + dendrogram2.getSumY();
    this.count = dendrogram1.getCount() + dendrogram2.getCount();
    this.x = this.sumX / this.count;
    this.y = this.sumY / this.count;
  }
  toString() {
    let content = this.dendrogram1 + "," + this.dendrogram2;
    if (this.tag) {
      return `${this.tag} (${this.x},${this.y})`;
    } else {
      return `Cl(${this.x},${this.y}) [${content}]`;
    }
  }
  getSumX() {
    return this.sumX;
  }
  getSumY() {
    return this.sumY;
  }
  getCount() {
    return this.count;
  }
}
export function getPoints(dendrogram, pts = []) {
  if ("count" in dendrogram) {
    getPoints(dendrogram.dendrogram1, pts);
    getPoints(dendrogram.dendrogram2, pts);
  } else
    pts.push(dendrogram);
  return pts;
}
export var calculatedDistances = 0;
export function clearCalculatedDistances() {
  calculatedDistances = 0;
}
export function getDistance(pt1, pt2) {
  let dx = pt1.x - pt2.x;
  let dy = pt1.y - pt2.y;
  calculatedDistances += 1;
  return Math.sqrt(dx * dx + dy * dy);
}
