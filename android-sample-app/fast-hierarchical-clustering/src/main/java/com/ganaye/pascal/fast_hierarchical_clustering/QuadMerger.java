package com.ganaye.pascal.fast_hierarchical_clustering;

import com.ganaye.pascal.classic_hierarchical_clustering.Dendrogram;

import java.util.ArrayList;

public class QuadMerger {

    public static void mergeQuadTree(QuadTree quadTree, double nodeSize) {
        mergeNode(quadTree.root, nodeSize, null);
        quadTree.nodeSize = nodeSize;
    }

    public static boolean mergeNode(QuadNode node, double minSize, QuadNode parentNode) {
        if (node == null) return false;
        boolean mustMerge = (node.size < minSize);
        if (!mustMerge) parentNode = node;
        if (mergeNode(node.ne, minSize, parentNode)) node.ne = null;
        if (mergeNode(node.nw, minSize, parentNode)) node.nw = null;
        if (mergeNode(node.se, minSize, parentNode)) node.se = null;
        if (mergeNode(node.sw, minSize, parentNode)) node.sw = null;
        if (mustMerge) {
            if (node.points != null && parentNode != null) {
                ArrayList<Dendrogram> parentPoints = parentNode.points;
                if (parentPoints == null) {
                    parentPoints = parentNode.points = new ArrayList<>();
                }
                for (Dendrogram dendrogram : node.points) {
                    parentPoints.add(dendrogram);
                }
            }
            return true;
        } else return false;
    }
}