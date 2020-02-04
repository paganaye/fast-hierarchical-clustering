package com.ganaye.pascal.fast_hierarchical_clustering;

import com.ganaye.pascal.classic_hierarchical_clustering.Dendrogram;
import com.ganaye.pascal.utils.Log;
import com.ganaye.pascal.utils.LogLevel;

import java.util.ArrayList;

import static com.ganaye.pascal.classic_hierarchical_clustering.Dendrogram.logPoints;


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
    QuadNode nw;
    QuadNode ne;
    QuadNode sw;
    QuadNode se;
    ArrayList<Dendrogram> points;
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

    static void logQuadNode(LogLevel level, String prefix, QuadNode node) {
        if (node == null || !Log.willLog(level)) return;
        String prefix2 = prefix + "  ";
        Log.writeLine(LogLevel.Verbose, prefix + node.sector.name() + " id:" + node.id
                + "xmin:" + node.xmin + " ymin:" + node.ymin + " size:" + node.size);
        logPoints(level, prefix2, node.points);
        logQuadNode(level, prefix2, node.nw);
        logQuadNode(level, prefix2, node.ne);
        logQuadNode(level, prefix2, node.sw);
        logQuadNode(level, prefix2, node.se);
    }

    public static QuadSector getSector(boolean isWest, boolean isNorth) {
        return isWest
                ? (isNorth ? QuadSector.NorthWest : QuadSector.SouthWest)
                : (isNorth ? QuadSector.NorthEast : QuadSector.SouthEast);
    }

    private void mergeChild(QuadNode child) {
        if (child == null) return;
        child.mergeChildren();
        if (child.points != null) {
            for (Dendrogram point : child.points) {
                this.points.add(point);
            }
        }
    }

    void mergeChildren() {
        if (this.points == null) this.points = new ArrayList<>();
        this.mergeChild(this.ne);
        this.mergeChild(this.nw);
        this.mergeChild(this.se);
        this.mergeChild(this.sw);
        this.ne = this.nw = this.se = this.sw = null;
    }

    boolean isLeaf() {
        return (this.size <= this.quadTree.nodeSize);
    }

    public QuadNode addPoint(Dendrogram point) {
        if (this.isLeaf()) {
            ArrayList<Dendrogram> points = this.points;
            if (points == null) {
                points = new ArrayList<>();
                this.points = points;
            }
            points.add(point);
            return this;
        } else {
            boolean isWest = point.x < this.xmid;
            boolean isNorth = point.y < this.ymid;
            QuadNode node = this.getOrCreateChild(isWest, isNorth);
            return node.addPoint(point);
        }
    }

    // we don't expand this way just yet.
    //  // distributeToChildren() {
    //  //   let pointToDistribute = this.points;
    //  //   if (pointToDistribute) {
    //  //     this.points = null
    //  //     for (let point of pointToDistribute) {
    //  //       this.addPoint(point)
    //  //     }
    //  //   }
    //  // }

    boolean isEmpty() {
        return (this.points == null || this.points.size() == 0)
                && (this.nw == null || this.nw.isEmpty())
                && (this.ne == null || this.ne.isEmpty())
                && (this.sw == null || this.sw.isEmpty())
                && (this.se == null || this.se.isEmpty());
    }

    void attachChildNode(QuadSector sector, QuadNode childNode) {
        childNode.parentNode = this;
        childNode.sector = sector;
        switch (sector) {
            case NorthEast:
                this.ne = childNode;
                break;
            case NorthWest:
                this.nw = childNode;
                break;
            case SouthEast:
                this.se = childNode;
                break;
            case SouthWest:
                this.sw = childNode;
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
                return this.nw != null ? this.nw : (this.nw = this.createChild(isWest, isNorth));
            else
                return this.sw != null ? this.sw : (this.sw = this.createChild(isWest, isNorth));
        } else {
            if (isNorth)
                return this.ne != null ? this.ne : (this.ne = this.createChild(isWest, isNorth));
            else
                return this.se != null ? this.se : (this.se = this.createChild(isWest, isNorth));
        }
    }

    void remove(Dendrogram point) {
        int indexOfPoint = this.points.indexOf(point);
        if (indexOfPoint >= 0) {
            this.points.remove(indexOfPoint);
        }
    }


}