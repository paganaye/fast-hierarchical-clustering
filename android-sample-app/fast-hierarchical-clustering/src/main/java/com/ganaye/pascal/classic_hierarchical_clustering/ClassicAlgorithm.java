package com.ganaye.pascal.classic_hierarchical_clustering;

import com.ganaye.pascal.utils.Cluster;
import com.ganaye.pascal.utils.Point;

import java.util.ArrayList;
import java.util.List;

import static com.ganaye.pascal.utils.Cluster.calcDistance;


public class ClassicAlgorithm {
    public static NearestNeighbour getNearestNeighbour(List<Cluster> clusters) {
        double maxDistance = Double.MAX_VALUE;
        NearestNeighbour nearestNeighbour = null;
        for (int i = 0; i < clusters.size(); i++) {
            Cluster clusterI = clusters.get(i);
            if (clusterI.parent != null) continue;
            for (int j = i + 1; j < clusters.size(); j++) {
                Cluster clusterJ = clusters.get(j);
                if (clusterJ.parent != null) continue;
                double distance = calcDistance(clusterI, clusterJ);
                if (distance < maxDistance
                        || (distance == maxDistance && clusterI.id < nearestNeighbour.cluster1.id)
                        || (distance == maxDistance && clusterI.id == nearestNeighbour.cluster1.id && clusterJ.id < nearestNeighbour.cluster2.id)) {
                    maxDistance = distance;
                    nearestNeighbour = new NearestNeighbour(clusterI, clusterJ, distance);
                }
            }
        }
        return nearestNeighbour;
    }

    public static Cluster buildDendrogramClassic(List<Point> points) {
        ArrayList<Cluster> clusters = new ArrayList<>();
        for (Point point : points) {
            clusters.add(new Cluster(point));
        }

        while (clusters.size() > 1) {
            NearestNeighbour nearestNeighbour = getNearestNeighbour(clusters);
            Cluster newCluster = new Cluster();
            newCluster.mergeTwoClusters(nearestNeighbour.cluster1, nearestNeighbour.cluster2);
            clusters.remove(nearestNeighbour.cluster1);
            clusters.remove(nearestNeighbour.cluster2);
            clusters.add(newCluster);
        }
        Cluster result = clusters.get(0);
        return result;
    }
}

