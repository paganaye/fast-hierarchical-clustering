//import { QuadTree } from "./QuadTree";
//import { QuadNode, QuadSector } from "./QuadNode";
//import { Enumerable } from "./Enumerable";
//import { Point } from "./Point";
//
//
//function boolean mergeNode(node, double minSize, parentNode?: QuadNode) {
//  if (!node) return false;
//  let mustMerge = (node.size < minSize);
//  if (!mustMerge) parentNode = node;
//  if (mergeNode(node.ne, minSize, parentNode)) node.ne = null;
//  if (mergeNode(node.nw, minSize, parentNode)) node.nw = null;
//  if (mergeNode(node.se, minSize, parentNode)) node.se = null;
//  if (mergeNode(node.sw, minSize, parentNode)) node.sw = null;
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
//public function mergeQuadTree(QuadTree quadTree, double nodeSize) {
//  mergeNode(quadTree.root, nodeSize);
//  quadTree.nodeSize = nodeSize;
//}
//
//
