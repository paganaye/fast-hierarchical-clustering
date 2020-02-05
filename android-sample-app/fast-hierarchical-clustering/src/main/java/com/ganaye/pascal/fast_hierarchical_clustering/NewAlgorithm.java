package com.ganaye.pascal.fast_hierarchical_clustering;

import com.ganaye.pascal.utils.Point;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static com.ganaye.pascal.fast_hierarchical_clustering.QuadCluster.calcDistance;
import static com.ganaye.pascal.fast_hierarchical_clustering.QuadMerger.pruneQuadTree;


public class NewAlgorithm {
    static final int CLUSTER_MIN_SIZE = 1;


    public static QuadCluster buildDendrogramNew(List<Point> points) {
        QuadTree quad = createQuad(points);
        double nodeSize = quad.getNodeSize();
        //quad.log(LogLevel.Important);


        while (quad.root.clusters == null || quad.root.clusters.size() != 1) {
            ArrayList<QuadNeighbour> neighbours = getQuadTreeNeighbours(quad, nodeSize);
            ArrayList<QuadNeighbour> newNeighbours = new ArrayList<>();
            sortByDistanceDesc(neighbours);
            while (neighbours.size() > 0) {
                QuadNeighbour neighbour = neighbours.get(neighbours.size() - 1);
                neighbours.remove(neighbours.size() - 1);
                QuadCluster p1 = neighbour.cluster1;
                QuadCluster p2 = neighbour.cluster2;
                if (p1.parent != null || p2.parent != null) continue;
                QuadCluster mergedPoint = new QuadCluster();
                mergedPoint.mergeTwoClusters(p1, p2);
                p1.quadNode.remove(p1);
                p2.quadNode.remove(p2);
                quad.add(mergedPoint);
                newNeighbours.clear();
                getNewPointNeighbours(mergedPoint, nodeSize, newNeighbours);
                //sortByDistanceDesc(neighbours);
                insertIntoSortedList(newNeighbours, neighbours, NeighbourComparator.instanceDesc);
            }
            nodeSize *= 2;
            pruneQuadTree(quad, nodeSize);
            //printQuadTree(quad);
        }
        return quad.root.clusters.get(0);
    }

    private static void insertIntoSortedList(ArrayList<QuadNeighbour> newNeighbours,
                                             ArrayList<QuadNeighbour> neighbours,
                                             NeighbourComparator neighbourComparator) {
        for (QuadNeighbour n : newNeighbours) {
            int pos = Collections.binarySearch(neighbours, n, neighbourComparator);
            if (pos < 0) {
                neighbours.add(-pos - 1, n);
            }
        }
    }


    static QuadTree createQuad(List<Point> points) {
        QuadTree quad = new QuadTree(CLUSTER_MIN_SIZE);
        for (Point point : points) {
            quad.add(new QuadCluster(point));
        }
        return quad;
    }

    static ArrayList<QuadNeighbour> getQuadTreeNeighbours(QuadTree quad, double maxDistance) {
        ArrayList<QuadNeighbour> neighbours = new ArrayList<>();
        QuadEnumerator quadEnumerator = new QuadEnumerator(quad);
        QuadNode current;
        while (quadEnumerator.hasNext()) {
            current = quadEnumerator.next();
            getNodeSouthEastNeighbours(current, maxDistance, neighbours);
        }
        return neighbours;
    }

    static void sortByDistanceDesc(List<QuadNeighbour> neighbours) {
        Collections.sort(neighbours, NeighbourComparator.instanceDesc);
    }

    //
    static void getNewPointNeighbours(QuadCluster cluster1, double maxDistance, ArrayList<
            QuadNeighbour> neighbours) {
        QuadNode n1 = cluster1.quadNode;
        if (n1.clusters != null) getNewPointIntraNodeNeighbours(cluster1, maxDistance, neighbours);
        getNewPointInterNodeNeigbours(cluster1, QuadTree.getEastNeighbour(n1), maxDistance, neighbours);
        getNewPointInterNodeNeigbours(cluster1, QuadTree.getSouthWestNeighbour(n1), maxDistance, neighbours);
        getNewPointInterNodeNeigbours(cluster1, QuadTree.getSouthNeighbour(n1), maxDistance, neighbours);
        getNewPointInterNodeNeigbours(cluster1, QuadTree.getSouthEastNeighbour(n1), maxDistance, neighbours);
        getNewPointInterNodeNeigbours(cluster1, QuadTree.getNorthWestNeighbour(n1), maxDistance, neighbours);
        getNewPointInterNodeNeigbours(cluster1, QuadTree.getNorthNeighbour(n1), maxDistance, neighbours);
        getNewPointInterNodeNeigbours(cluster1, QuadTree.getNorthEastNeighbour(n1), maxDistance, neighbours);
        getNewPointInterNodeNeigbours(cluster1, QuadTree.getWestNeighbour(n1), maxDistance, neighbours);
    }

    static void getNewPointInterNodeNeigbours(QuadCluster cluster1, QuadNode n2,
                                              double maxDistance, ArrayList<QuadNeighbour> result) {
        if (n2 == null) return;
        ArrayList<QuadCluster> clusters2 = n2.clusters;
        if (clusters2 == null) return;
        for (int j = 0; j < clusters2.size(); j++) {
            QuadCluster cluster2 = clusters2.get(j);
            double distance = calcDistance(cluster1, cluster2);
            if (distance <= maxDistance) {
                result.add(new QuadNeighbour(cluster1, cluster2, distance));
            }
        }
    }

    static void getNewPointIntraNodeNeighbours(QuadCluster cluster1,
                                               double maxDistance, ArrayList<QuadNeighbour> result) {
        QuadNode n1 = cluster1.quadNode;
        if (n1 == null) return; // we have or will see this the other way round.
        ArrayList<QuadCluster> clusters = n1.clusters;
        if (clusters == null) return;
        for (int j = 0; j < clusters.size(); j++) {
            QuadCluster cluster2 = clusters.get(j);
            if (cluster2.parent != null || cluster2 == cluster1) continue;
            double distance = calcDistance(cluster1, cluster2);
            if (distance <= maxDistance) {
                result.add(new QuadNeighbour(cluster1, cluster2, distance));
            }
        }
    }

    //
    static void getNodeSouthEastNeighbours(QuadNode current, double maxDistance, ArrayList<
            QuadNeighbour> neighbours) {
        if (current.clusters != null) getNeighbours(current, maxDistance, neighbours);
        getInterNodeNeighbours(current, QuadTree.getEastNeighbour(current), maxDistance, neighbours);
        getInterNodeNeighbours(current, QuadTree.getSouthWestNeighbour(current), maxDistance, neighbours);
        getInterNodeNeighbours(current, QuadTree.getSouthNeighbour(current), maxDistance, neighbours);
        getInterNodeNeighbours(current, QuadTree.getSouthEastNeighbour(current), maxDistance, neighbours);
    }

    static void getNeighbours(QuadNode n1, double maxDistance, ArrayList<QuadNeighbour> result) {
        if (n1 == null) return; // we have or will see this the other way round.
        ArrayList<QuadCluster> clusters = n1.clusters;
        if (clusters != null) {
            for (int i = 0; i < clusters.size(); i++) {
                QuadCluster clusterI = clusters.get(i);
                if (clusterI.parent != null) continue;
                for (int j = i + 1; j < clusters.size(); j++) {
                    QuadCluster clusterJ = clusters.get(j);
                    if (clusterJ.parent != null) continue;
                    double distance = calcDistance(clusterI, clusterJ);
                    if (distance <= maxDistance) {
                        result.add(new QuadNeighbour(clusterI, clusterJ, distance));
                    }
                }
            }
        }
    }


    //
    static void getInterNodeNeighbours(QuadNode n1, QuadNode n2, double maxDistance, ArrayList<QuadNeighbour> result) {
        if (n1 == null || n2 == null) return; // we have or will see this the other way round.
        ArrayList<QuadCluster> pts1 = n1.clusters;
        ArrayList<QuadCluster> pts2 = n2.clusters;
        if (pts1 == null || pts2 == null) return;

        for (int i = 0; i < pts1.size(); i++) {
            QuadCluster clusterI = pts1.get(i);
            for (int j = 0; j < pts2.size(); j++) {
                QuadCluster clusterJ = pts2.get(j);
                double distance = calcDistance(clusterI, clusterJ);
                if (distance <= maxDistance) {
                    result.add(new QuadNeighbour(clusterI, clusterJ, distance));
                }
            }
        }
    }
}