// function buildDendrogram(quad) {
//   let result = { lines: [] };
//   let depth = getDepth(quad);
//   /*
//   while(depth > 0) {
//     mergeQuad(quad, depth, result);
//     depth -= 1;
//   }
//   */

//   knit(quad);
//   return result;
// }

// function knit(quad, depth, result) {
//   var leaf = getNorthWestLeaf(quad);
//   //while (leaf != null) {
//     console.log(leaf);
//     // var leaf1 = getEastNeighbour(leaf)
//     // var leaf2 = getSouthNeighbour(leaf)
//     // var leaf3 = getSouthEastNeighbour(leaf)
//     // merge things
//     leaf = getNextLeaf(leaf);
//   //}
// }

// function getNorthWestLeaf(quad) {
//   var candidate = quad.nw || quad.ne || quad.sw || quad.se;
//   if (candidate) return getNorthWestLeaf(candidate);
//   else return quad;
// }

// function getNextLeaf(currentLeaf) {
//   let rowNumber = currentLeaf.path[currentLeaf.path.lengh-1];
  
//   if (rowNumber == 0 || rowNumber == 2) {    
//     let parent = currentLeaf.parent;
//     if (parent) {      
//       let candidate = (rowNumber == 0) ? parent.nw : parent.sw;
//       if (candidate) return getNorthWestLeaf(candidate);
//     }
//   }
//   else debugger;
// }

// function getDepth(quad: QuadTree) {
//   let child = quad.nw || quad.ne || quad.sw || quad.se;
//   if (child) return getDepth(child) + 1;
//   else return 1;
// }


