package com.ganaye.pascal.fast_hierarchical_clustering;

import com.ganaye.pascal.utils.Log;
import com.ganaye.pascal.utils.LogLevel;

import java.util.ArrayList;
import java.util.List;

//
public class QuadNode {
    static int nodeIdCounter = 0;
    final int id;
    final QuadTree quadTree;
    final double xmin;
    final double xmid;
    final double xmax;
    final double ymin;
    final double ymax;
    final double ymid;
    final double size;
    QuadNode northWest;
    QuadNode northEast;
    QuadNode southWest;
    QuadNode southEast;
    ArrayList<NewCluster> clusters;
    QuadSector sector;

    QuadNode parentNode;

    public QuadNode(QuadTree quadTree,
                    QuadNode parentNode,
                    QuadSector sector,
                    double xmin,
                    double ymin,
                    double size) {
        this.quadTree = quadTree;
        this.parentNode = parentNode;
        this.id = ++QuadNode.nodeIdCounter;
        this.sector = sector;
        this.xmin = xmin;
        this.ymin = ymin;
        this.size = size;

        this.xmid = xmin + size / 2;
        this.xmax = xmin + size;
        this.ymid = ymin + size / 2;
        this.ymax = ymin + size;

    }

    //  double getLevel() {
//    if (this.parentNode == null) return 0
//    else return this.parentNode.getLevel() + 1;
//  }
    public static void logPoints(LogLevel level, String prefix, List<NewCluster> clusters) {
        if (clusters != null && Log.willLog(level)) {
            for (NewCluster cluster : clusters) {
                Log.writeLine(level, prefix + cluster.toString());
            }
        }
    }

    static void logQuadNode(LogLevel level, String prefix, QuadNode node) {
        if (node == null || !Log.willLog(level)) return;
        String prefix2 = prefix + "  ";
        Log.writeLine(LogLevel.Verbose, prefix + node.sector.name() + " id:" + node.id
                + " (" + node.xmin + ", " + node.ymin + "; size " + node.size + ")");
        logPoints(level, prefix2, node.clusters);
        logQuadNode(level, prefix2, node.northWest);
        logQuadNode(level, prefix2, node.northEast);
        logQuadNode(level, prefix2, node.southWest);
        logQuadNode(level, prefix2, node.southEast);
    }

    public static QuadSector getSector(boolean isWest, boolean isNorth) {
        return isWest
                ? (isNorth ? QuadSector.NorthWest : QuadSector.SouthWest)
                : (isNorth ? QuadSector.NorthEast : QuadSector.SouthEast);
    }

    private void mergeChild(QuadNode child) {
        if (child == null) return;
        child.mergeChildren();
        if (child.clusters != null) {
            for (NewCluster cluster : child.clusters) {
                this.clusters.add(cluster);
            }
        }
    }

    void mergeChildren() {
        if (this.clusters == null) this.clusters = new ArrayList<>();
        this.mergeChild(this.northEast);
        this.mergeChild(this.northWest);
        this.mergeChild(this.southEast);
        this.mergeChild(this.southWest);
        this.northEast = this.northWest = this.southEast = this.southWest = null;
    }

    boolean isLeaf() {
        return (this.size <= this.quadTree.nodeSize);
    }

    public QuadNode addCluster(NewCluster cluster) {
        if (this.isLeaf()) {
            ArrayList<NewCluster> points = this.clusters;
            if (points == null) {
                points = new ArrayList<>();
                this.clusters = points;
            }
            points.add(cluster);
            cluster.quadNode = this;
            return this;
        } else {
            boolean isWest = cluster.x < this.xmid;
            boolean isNorth = cluster.y < this.ymid;
            QuadNode node = this.getOrCreateChild(isWest, isNorth);
            return node.addCluster(cluster);
        }
    }

    boolean isEmpty() {
        return (this.clusters == null || this.clusters.size() == 0)
                && (this.northWest == null || this.northWest.isEmpty())
                && (this.northEast == null || this.northEast.isEmpty())
                && (this.southWest == null || this.southWest.isEmpty())
                && (this.southEast == null || this.southEast.isEmpty());
    }

    void attachChildNode(QuadSector sector, QuadNode childNode) {
        childNode.parentNode = this;
        childNode.sector = sector;
        switch (sector) {
            case NorthEast:
                this.northEast = childNode;
                break;
            case NorthWest:
                this.northWest = childNode;
                break;
            case SouthEast:
                this.southEast = childNode;
                break;
            case SouthWest:
                this.southWest = childNode;
                break;
        }
    }

    private QuadNode createChild(boolean isWest, boolean isNorth) {
        QuadSector quadSector = QuadNode.getSector(isWest, isNorth);
        double childSize = this.size / 2;
        return new QuadNode(
                this.quadTree,
                this,
                quadSector,
                isWest ? this.xmin : this.xmid,
                isNorth ? this.ymin : this.ymid,
                childSize);
    }

    QuadNode getOrCreateChild(boolean isWest, boolean isNorth) {
        if (isWest) {
            if (isNorth)
                return this.northWest != null ? this.northWest : (this.northWest = this.createChild(isWest, isNorth));
            else
                return this.southWest != null ? this.southWest : (this.southWest = this.createChild(isWest, isNorth));
        } else {
            if (isNorth)
                return this.northEast != null ? this.northEast : (this.northEast = this.createChild(isWest, isNorth));
            else
                return this.southEast != null ? this.southEast : (this.southEast = this.createChild(isWest, isNorth));
        }
    }

    void remove(NewCluster cluster) {
        int indexOfPoint = this.clusters.indexOf(cluster);
        if (indexOfPoint >= 0) {
            this.clusters.remove(indexOfPoint);
        }
    }


    @Override
    public String toString() {
        return "#" + this.id
                + " (" + this.xmin + ", " + this.ymin + "; size: " + this.size + ") "
                + (this.clusters == null ? "" : (" " + this.clusters.size() + " point(s)"));
    }
}