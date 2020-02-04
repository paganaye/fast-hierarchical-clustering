package com.ganaye.pascal.fast_hierarchical_clustering;

import com.ganaye.pascal.classic_hierarchical_clustering.Dendrogram;
import com.ganaye.pascal.classic_hierarchical_clustering.Point;
import com.ganaye.pascal.utils.LogLevel;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static com.ganaye.pascal.classic_hierarchical_clustering.Dendrogram.getMergedPoint;

//import { QuadTree, logQuadTree } from "./QuadTree";
//import { calcDistance, Point } from "./Point";
//import { QuadNode } from "./QuadNode";
//import { Neighbour, newNeighbour } from "./Neighbour";
//import { getMergedPoint } from "./Dendrogram";
//import { QuadEnumerator } from "./QuadEnumerator";
//import { mergeQuadTree } from "./QuadMerger";
//import { Log } from "./Log";
//
//
public class NewAlgorithm {
    static final int CLUSTER_MIN_SIZE = 1;

    //
//
    public static Dendrogram buildDendrogramNew(List<Point> points) {
        QuadTree quad = createQuad(points);
        double nodeSize = quad.getNodeSize();
        //printQuadTree(quad);

        while (quad.root.points == null || quad.root.size != 1) {
            quad.log(LogLevel.Important);

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
//        mergeQuadTree(quad, nodeSize);
//        //printQuadTree(quad);
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
//        getNodeSouthEastNeighbours(current, maxDistance, neighbours);
        }
        return neighbours;
    }

    static void sortByDistanceDesc(List<Neighbour> neighbours) {
        Collections.sort(neighbours, NeighbourComparator.instanceDesc);
    }

    //
//Neighbour[] function getNodeSouthEastNeighbours(current: QuadNode, double maxDistance, neighbours) {
//    if (current.points) getNeighbours(current, maxDistance, neighbours);
//    getInterNodeNeighbours(current, QuadTree.getEastNeighbour(current), maxDistance, neighbours);
//    getInterNodeNeighbours(current, QuadTree.getSouthWestNeighbour(current), maxDistance, neighbours);
//    getInterNodeNeighbours(current, QuadTree.getSouthNeighbour(current), maxDistance, neighbours);
//    getInterNodeNeighbours(current, QuadTree.getSouthEastNeighbour(current), maxDistance, neighbours);
//}
//
//Neighbour[] function getInterNodeNeighbours(n1, n2, double maxDistance, result) {
//    if (!n1 || !n2) return; // we have or will see this the other way round.
//    let pts1 = n1.points || [];
//    let pts2 = n2.points || [];
//    for (let i = 0; i < pts1.length; i++) {
//        let pti = pts1[i];
//        for (let j = 0; j < pts2.length; j++) {
//            let ptj = pts2[j];
//            let distance = calcDistance(pti, ptj);
//            if (distance <= maxDistance) {
//                result.push(newNeighbour(pti, ptj, distance, n1, n2));
//            }
//        }
//    }
//}
//
//
//function getNeighbours(n1, double maxDistance, Neighbour[] result) {
//    if (!n1) return; // we have or will see this the other way round.
//    let points = n1.points || [];
//    for (let i = 0; i < points.length; i++) {
//        let pti = points[i];
//        if (pti.mergedTo) continue;
//        for (let j = i + 1; j < points.length; j++) {
//            let ptj = points[j];
//            if (ptj.mergedTo) continue;
//            let distance = calcDistance(pti, ptj);
//            if (distance <= maxDistance) {
//                result.push(newNeighbour(pti, ptj, distance, n1, n1))
//            }
//        }
//    }
//}
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

    //
    static void getNewPointInterNodeNeigbours(Dendrogram pt1, QuadNode n1, QuadNode n2, double maxDistance, ArrayList<Neighbour> result) {
//    if (!n2) return;
//    let points2 = n2.points || [];
//    for (let j = 0; j < points2.length; j++) {
//        let pt2 = points2[j];
//        let distance = calcDistance(pt1, pt2);
//        if (distance <= maxDistance) {
//            result.push(newNeighbour(pt1, pt2, distance, n1, n2));
//        }
//    }
    }

    //
    static void getNewPointIntraNodeNeighbours(Dendrogram pt1, QuadNode n1, double maxDistance, ArrayList<Neighbour> result) {
//    if (!n1) return; // we have or will see this the other way round.
//    let points = n1.points || [];
//    for (let j = 0; j < points.length; j++) {
//        let pt2 = points[j];
//        if (pt2.mergedTo || pt2 == pt1) continue;
//        let distance = calcDistance(pt1, pt2);
//        if (distance <= maxDistance) {
//            result.push(newNeighbour(pt1, pt2, distance, n1, n1))
//        }
//    }
    }
}