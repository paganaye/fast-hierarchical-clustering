package com.ganaye.pascal.classic_hierarchical_clustering;

import com.ganaye.pascal.fast_hierarchical_clustering.Neighbour;

import java.util.ArrayList;
import java.util.List;

import static com.ganaye.pascal.classic_hierarchical_clustering.Dendrogram.calcDistance;
import static com.ganaye.pascal.classic_hierarchical_clustering.Dendrogram.mergePoints;

public class ClassicAlgorithm {
    public static Neighbour getNearestNeighbour(List<Dendrogram> points) {
        ArrayList<Neighbour> neighbours = new ArrayList<Neighbour>();
        double maxDistance = Double.MAX_VALUE;
        Neighbour nearestNeighbour = null;
        for (int i = 0; i < points.size(); i++) {
            Dendrogram pti = points.get(i);
            if (pti.mergedTo != null) continue;
            for (int j = i + 1; j < points.size(); j++) {
                Dendrogram ptj = points.get(j);
                if (ptj.mergedTo != null) continue;
                double distance = calcDistance(pti, ptj);
                if (distance < maxDistance
                        || (distance == maxDistance && pti.id < nearestNeighbour.pt1.id)
                        || (distance == maxDistance && pti.id == nearestNeighbour.pt1.id && ptj.id < nearestNeighbour.pt2.id)) {
                    maxDistance = distance;
                    nearestNeighbour = new Neighbour(pti, ptj, distance, null, null);
                }
            }
        }
        return nearestNeighbour;
    }

    public static Dendrogram buildDendrogramClassic(List<Point> points) {
        double maxDistance = Double.MAX_VALUE;
        ArrayList<Dendrogram> nodes = new ArrayList<>();
        for (Point point : points) nodes.add(new Dendrogram(point));

        while (nodes.size() > 1) {
            Neighbour nearestNeighbour = getNearestNeighbour(nodes);
            if (nearestNeighbour == null) break;
            ArrayList<Dendrogram> list = new ArrayList<Dendrogram>(2);
            list.add(nearestNeighbour.pt1);
            list.add(nearestNeighbour.pt2);
            Dendrogram newNode = mergePoints(list, nodes);
        }
        Dendrogram result = nodes.get(0);
        return result;
    }
}

