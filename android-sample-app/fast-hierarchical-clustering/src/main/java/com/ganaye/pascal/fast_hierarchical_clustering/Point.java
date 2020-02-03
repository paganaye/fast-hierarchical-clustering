//import { twoDec } from "./Utils";
//import { Log, LogLevel } from "./Log";
//
//export interface Point {
//  id: number;
//  x: number;
//  y: number;
//  weight: number;
//  mergedTo?: Point;
//  children?: Array<Point>;
//}
//
//export function calcDistance(p1: Point, p2: Point): number {
//  let dx = p1.x - p2.x;
//  let dy = p1.y - p2.y;
//  return Math.sqrt(dx * dx + dy * dy);
//}
//
//var pointIdCounter = 0;
//
//export function resetPointIdCounter() {
//  pointIdCounter = 0;
//}
//
//export function getNextPointId() {
//  return ++pointIdCounter;
//}
//
//export function printPoints(level: LogLevel, prefix: string, points?: Point[]) {
//  if (points && Log.willLog(level)) {
//    for (var point of points) {
//      Log.writeLine(level, prefix + pointToString(point));
//    }
//  }
//}
//
//export function pointToString(point: Point) {
//  return "#" + point.id
//    + " (" + twoDec(point.x) + ", " + twoDec(point.y) + ")"
//    + (point.weight > 1 ? " weight " + point.weight : "");
//}
