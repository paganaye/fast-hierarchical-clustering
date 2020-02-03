//import { QuadTree } from "./QuadTree";
//import { QuadNode, QuadSector } from "./QuadNode";
//import { Enumerable } from "./Enumerable";
//import { Point } from "./Point";
//
//
//function mergeNode(node: QuadNode | undefined, minSize: number, parentNode?: QuadNode): boolean {
//  if (!node) return false;
//  let mustMerge = (node.size < minSize);
//  if (!mustMerge) parentNode = node;
//  if (mergeNode(node.ne, minSize, parentNode)) node.ne = undefined;
//  if (mergeNode(node.nw, minSize, parentNode)) node.nw = undefined;
//  if (mergeNode(node.se, minSize, parentNode)) node.se = undefined;
//  if (mergeNode(node.sw, minSize, parentNode)) node.sw = undefined;
//  if (mustMerge) {
//    if (node.points && parentNode) {
//      let parentPoints = parentNode.points || (parentNode.points = []);
//      for (let point of node.points) {
//        parentPoints.push(point);
//      }
//    }
//    return true;
//  } else return false;
//}
//
//export function mergeQuadTree(quadTree: QuadTree, nodeSize: number) {
//  mergeNode(quadTree.root, nodeSize);
//  quadTree.nodeSize = nodeSize;
//}
//
//
