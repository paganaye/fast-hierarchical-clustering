package com.ganaye.pascal.fast_hierarchical_clustering;

import java.util.ArrayList;

public class QuadMerger {

    public static void pruneQuadTree(QuadTree quadTree, double nodeSize) {
        pruneSmallBranches(quadTree.root, nodeSize, null);
        quadTree.nodeSize = nodeSize;
    }

    public static boolean pruneSmallBranches(QuadNode node, double minSize, QuadNode newParentQuadNode) {
        if (node == null) return false;
        boolean mustPrune = (node.size < minSize);
        if (!mustPrune) newParentQuadNode = node;
        if (pruneSmallBranches(node.northEast, minSize, newParentQuadNode)) node.northEast = null;
        if (pruneSmallBranches(node.northWest, minSize, newParentQuadNode)) node.northWest = null;
        if (pruneSmallBranches(node.southEast, minSize, newParentQuadNode)) node.southEast = null;
        if (pruneSmallBranches(node.southWest, minSize, newParentQuadNode)) node.southWest = null;
        if (mustPrune) {
            if (node.clusters != null && newParentQuadNode != null) {
                ArrayList<NewCluster> parentNodeClusters = newParentQuadNode.clusters;
                if (parentNodeClusters == null) {
                    parentNodeClusters = newParentQuadNode.clusters = new ArrayList<>();
                }
                for (NewCluster cluster : node.clusters) {
                    cluster.quadNode = newParentQuadNode;
                    parentNodeClusters.add(cluster);
                }
            }
            return true;
        } else return false;
    }
}