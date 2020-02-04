package com.ganaye.pascal.fast_hierarchical_clustering;

import com.ganaye.pascal.classic_hierarchical_clustering.Dendrogram;
import com.ganaye.pascal.classic_hierarchical_clustering.Point;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static com.ganaye.pascal.classic_hierarchical_clustering.Dendrogram.calcDistance;
import static com.ganaye.pascal.classic_hierarchical_clustering.Dendrogram.getMergedPoint;
import static com.ganaye.pascal.fast_hierarchical_clustering.QuadMerger.mergeQuadTree;


public class NewAlgorithm {
    static final int CLUSTER_MIN_SIZE = 1;


    public static Dendrogram buildDendrogramNew(List<Point> points) {
        QuadTree quad = createQuad(points);
        double nodeSize = quad.getNodeSize();
        //quad.log(LogLevel.Important);


        while (quad.root.points == null || quad.root.points.size() != 1) {
            //quad.log(LogLevel.Important);

            //Log.writeLine(LogLevel.Verbose, "merging:", maxDistance);
            ArrayList<Neighbour> neighbours = getQuadTreeNeighbours(quad, nodeSize);
            sortByDistanceDesc(neighbours);
            while (neighbours.size() > 0) {
                Neighbour neighbour = neighbours.get(neighbours.size() - 1);
                neighbours.remove(neighbours.size() - 1);
                Dendrogram p1 = neighbour.pt1;
                Dendrogram p2 = neighbour.pt2;
                if (p1.mergedTo != null || p2.mergedTo != null) continue;
                ArrayList<Dendrogram> list = new ArrayList<>(2);
                list.add(p1);
                list.add(p2);
                Dendrogram mergedPoint = getMergedPoint(list);
                neighbour.n1.remove(p1);
                neighbour.n2.remove(p2);
                QuadNode mergePointNode = quad.add(mergedPoint);
                getNewPointNeighbours(mergedPoint, mergePointNode, nodeSize, neighbours);
                sortByDistanceDesc(neighbours);
            }
            nodeSize *= 2;
            mergeQuadTree(quad, nodeSize);
            //printQuadTree(quad);
        }
        return quad.root.points.get(0);
    }

    static QuadTree createQuad(List<Point> points) {
        QuadTree quad = new QuadTree(CLUSTER_MIN_SIZE);
        for (Point point : points) {
            quad.add(new Dendrogram(point));
        }
        return quad;
    }

    static ArrayList<Neighbour> getQuadTreeNeighbours(QuadTree quad, double maxDistance) {
        ArrayList<Neighbour> neighbours = new ArrayList<>();
        QuadEnumerator quadEnumerator = new QuadEnumerator(quad);
        QuadNode current;
        while (quadEnumerator.hasNext()) {
            current = quadEnumerator.next();
            getNodeSouthEastNeighbours(current, maxDistance, neighbours);
        }
        return neighbours;
    }

    static void sortByDistanceDesc(List<Neighbour> neighbours) {
        Collections.sort(neighbours, NeighbourComparator.instanceDesc);
    }

    //
    static void getNewPointNeighbours(Dendrogram pt1, QuadNode n1, double maxDistance, ArrayList<
            Neighbour> neighbours) {
        if (n1.points != null) getNewPointIntraNodeNeighbours(pt1, n1, maxDistance, neighbours);
        getNewPointInterNodeNeigbours(pt1, n1, QuadTree.getEastNeighbour(n1), maxDistance, neighbours);
        getNewPointInterNodeNeigbours(pt1, n1, QuadTree.getSouthWestNeighbour(n1), maxDistance, neighbours);
        getNewPointInterNodeNeigbours(pt1, n1, QuadTree.getSouthNeighbour(n1), maxDistance, neighbours);
        getNewPointInterNodeNeigbours(pt1, n1, QuadTree.getSouthEastNeighbour(n1), maxDistance, neighbours);
        getNewPointInterNodeNeigbours(pt1, n1, QuadTree.getNorthWestNeighbour(n1), maxDistance, neighbours);
        getNewPointInterNodeNeigbours(pt1, n1, QuadTree.getNorthNeighbour(n1), maxDistance, neighbours);
        getNewPointInterNodeNeigbours(pt1, n1, QuadTree.getNorthEastNeighbour(n1), maxDistance, neighbours);
        getNewPointInterNodeNeigbours(pt1, n1, QuadTree.getWestNeighbour(n1), maxDistance, neighbours);
    }

    static void getNewPointInterNodeNeigbours(Dendrogram pt1, QuadNode n1, QuadNode n2,
                                              double maxDistance, ArrayList<Neighbour> result) {
        if (n2 == null) return;
        ArrayList<Dendrogram> points2 = n2.points;
        if (points2 == null) return;
        for (int j = 0; j < points2.size(); j++) {
            Dendrogram pt2 = points2.get(j);
            double distance = calcDistance(pt1, pt2);
            if (distance <= maxDistance) {
                result.add(new Neighbour(pt1, pt2, distance, n1, n2));
            }
        }
    }

    static void getNewPointIntraNodeNeighbours(Dendrogram pt1, QuadNode n1,
                                               double maxDistance, ArrayList<Neighbour> result) {
        if (n1 == null) return; // we have or will see this the other way round.
        ArrayList<Dendrogram> points = n1.points;
        if (points == null) return;
        for (int j = 0; j < points.size(); j++) {
            Dendrogram pt2 = points.get(j);
            if (pt2.mergedTo != null || pt2 == pt1) continue;
            double distance = calcDistance(pt1, pt2);
            if (distance <= maxDistance) {
                result.add(new Neighbour(pt1, pt2, distance, n1, n1));
            }
        }
    }

    //
    static void getNodeSouthEastNeighbours(QuadNode current, double maxDistance, ArrayList<
            Neighbour> neighbours) {
        if (current.points != null) getNeighbours(current, maxDistance, neighbours);
        getInterNodeNeighbours(current, QuadTree.getEastNeighbour(current), maxDistance, neighbours);
        getInterNodeNeighbours(current, QuadTree.getSouthWestNeighbour(current), maxDistance, neighbours);
        getInterNodeNeighbours(current, QuadTree.getSouthNeighbour(current), maxDistance, neighbours);
        getInterNodeNeighbours(current, QuadTree.getSouthEastNeighbour(current), maxDistance, neighbours);
    }

    static void getNeighbours(QuadNode n1, double maxDistance, ArrayList<Neighbour> result) {
        if (n1 == null) return; // we have or will see this the other way round.
        ArrayList<Dendrogram> points = n1.points;
        if (points != null) {
            for (int i = 0; i < points.size(); i++) {
                Dendrogram pti = points.get(i);
                if (pti.mergedTo != null) continue;
                for (int j = i + 1; j < points.size(); j++) {
                    Dendrogram ptj = points.get(j);
                    if (ptj.mergedTo != null) continue;
                    double distance = calcDistance(pti, ptj);
                    if (distance <= maxDistance) {
                        result.add(new Neighbour(pti, ptj, distance, n1, n1));
                    }
                }
            }
        }
    }


    //
    static void getInterNodeNeighbours(QuadNode n1, QuadNode n2, double maxDistance, ArrayList<Neighbour> result) {
        if (n1 == null || n2 == null) return; // we have or will see this the other way round.
        ArrayList<Dendrogram> pts1 = n1.points;
        ArrayList<Dendrogram> pts2 = n2.points;
        if (pts1 == null || pts2 == null) return;

        for (int i = 0; i < pts1.size(); i++) {
            Dendrogram pti = pts1.get(i);
            for (int j = 0; j < pts2.size(); j++) {
                Dendrogram ptj = pts2.get(j);
                double distance = calcDistance(pti, ptj);
                if (distance <= maxDistance) {
                    result.add(new Neighbour(pti, ptj, distance, n1, n2));
                }
            }
        }
    }
}