export interface Point {
  id: number;
  x: number;
  y: number;
  weight: number;
  merged?: boolean;
}

export function calcDistance(p1: Point, p2: Point): number {
  let dx = p1.x - p2.x;
  let dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

var pointIdCounter = 0;

export function resetPointIdCounter() {
  pointIdCounter = 0;
}

export function getNextPointId() {
  return ++pointIdCounter;
}