function classic_hierarchical_clustering(points, wanted_clusters) {
    while (points.length > wanted_clusters) {
        let pair = find_two_nearest_points();
        merge(pair);
    }

    function find_two_nearest_points() {
        let bestPair = undefined;
        for (let i1 = 0; i1 < len; i1++) {
           let point1 = points[i1];
           for (let i2 = i1 + 1; i2 < len; i2++) {
              let point2 = points[i2];
              let dx = point1.x - point2.x;
              let dy = point1.y - point2.y;
              let distanceSquared = dx * dx + dy * dy;
              if (distanceSquared < distanceSquaredMin) {
                 distanceSquaredMin = distanceSquared;
                 bestPair = [i1, i2];
              }
           }
        }
     }
  
}

function proposed_hierarchical_clustering(points, wanted_clusters) {
    while (points.length > wanted_clusters) {
        if (!pairs.length) pairs = getNextPairs();
        let pair = pairs.pop();
        pairs = merge_points_and_pairs(pair, pairs);
    }

    function find_two_nearest_points() {
        let bestPair = undefined;
        for (let i1 = 0; i1 < len; i1++) {
           let point1 = points[i1];
           for (let i2 = i1 + 1; i2 < len; i2++) {
              let point2 = points[i2];
              let dx = point1.x - point2.x;
              let dy = point1.y - point2.y;
              let distanceSquared = dx * dx + dy * dy;
              if (distanceSquared < distanceSquaredMin) {
                 distanceSquaredMin = distanceSquared;
                 bestPair = [i1, i2];
              }
           }
        }
     }


}
