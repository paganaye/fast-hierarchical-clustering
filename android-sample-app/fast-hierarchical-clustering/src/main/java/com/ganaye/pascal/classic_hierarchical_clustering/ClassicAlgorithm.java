package com.ganaye.pascal.classic_hierarchical_clustering;

import com.ganaye.pascal.utils.Cluster;
import com.ganaye.pascal.utils.Point;

import java.util.ArrayList;
import java.util.List;

import static com.ganaye.pascal.utils.Cluster.calcDistance;


public class ClassicAlgorithm {
    public static NearestNeighbour getNearestNeighbour(List<Cluster> points) {
        double maxDistance = Double.MAX_VALUE;
        NearestNeighbour nearestNeighbour = null;
        for (int i = 0; i < points.size(); i++) {
            Cluster pti = points.get(i);
            if (pti.parent != null) continue;
            for (int j = i + 1; j < points.size(); j++) {
                Cluster ptj = points.get(j);
                if (ptj.parent != null) continue;
                double distance = calcDistance(pti, ptj);
                if (distance < maxDistance
                        || (distance == maxDistance && pti.id < nearestNeighbour.pt1.id)
                        || (distance == maxDistance && pti.id == nearestNeighbour.pt1.id && ptj.id < nearestNeighbour.pt2.id)) {
                    maxDistance = distance;
                    nearestNeighbour = new NearestNeighbour(pti, ptj, distance);
                }
            }
        }
        return nearestNeighbour;
    }

    public static Cluster buildDendrogramClassic(List<Point> points) {
        ArrayList<Cluster> clusters = new ArrayList<>();
        for (Point point : points) clusters.add(new Cluster(point));

        while (clusters.size() > 1) {
            NearestNeighbour nearestNeighbour = getNearestNeighbour(clusters);
            Cluster newCluster = new Cluster();
            newCluster.mergeTwoClusters(nearestNeighbour.pt1, nearestNeighbour.pt2);
            clusters.remove(nearestNeighbour.pt1);
            clusters.remove(nearestNeighbour.pt2);
            clusters.add(newCluster);
        }
        Cluster result = clusters.get(0);
        return result;
    }
}

