const X = 0;
const Y = 1;
export function getHull(points) {
  const pivot = getTopLeftPoint(points);
  let indexes = Array.from(points, (point, i) => i);
  const angles = Array.from(points, (point) => getAngle(pivot, point));
  const distances = Array.from(points, (point) => euclideanDistanceSquared(pivot, point));
  indexes.sort((i, j) => {
    const angleA = angles[i];
    const angleB = angles[j];
    if (angleA === angleB) {
      const distanceA = distances[i];
      const distanceB = distances[j];
      return distanceA - distanceB;
    }
    return angleA - angleB;
  });
  const hull = [];
  for (let i = 0; i < indexes.length; i++) {
    const index = indexes[i];
    const point = points[index];
    if (hull.length < 3) {
      hull.push(point);
    } else {
      while (checkOrientation(hull[hull.length - 2], hull[hull.length - 1], point) > 0) {
        hull.pop();
      }
      hull.push(point);
    }
  }
  return hull;
}
function checkOrientation(p1, p2, p3) {
  return (p2.y - p1.y) * (p3.x - p2.x) - (p3.y - p2.y) * (p2.x - p1.x);
}
function getAngle(a, b) {
  return Math.atan2(b.y - a.y, b.x - a.x);
}
function euclideanDistanceSquared(p1, p2) {
  const a = p2.x - p1.x;
  const b = p2.y - p1.y;
  return a * a + b * b;
}
function getTopLeftPoint(points) {
  let pivot = points[0];
  let pivotIndex = 0;
  for (let i = 1; i < points.length; i++) {
    const point = points[i];
    if (point.y < pivot.y || point.y === pivot.y && point.x < pivot.x) {
      pivot = point;
      pivotIndex = i;
    }
  }
  return pivot;
}
