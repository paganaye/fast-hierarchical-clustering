package com.ganaye.pascal.fast_hierarchical_clustering;

//import { QuadNode, QuadSector, printQuadNode as logQuadNode } from "./QuadNode";
//import { Point } from "./Point";
//import { LogLevel } from "./Log";
//

import com.ganaye.pascal.classic_hierarchical_clustering.Dendrogram;
import com.ganaye.pascal.utils.LogLevel;

public class QuadTree {
    QuadNode root;
    double nodeSize;

    //
    QuadTree(double nodeSize) {
//    // we could lower the node size as we go along
        this.nodeSize = nodeSize;
//
        this.root = new QuadNode(
                this,
                null,
                QuadSector.Root,
                0,
                0,
                this.nodeSize);
    }

    //
    static QuadNode getNorthEastNeighbour(QuadNode current) {
        QuadNode parent = current.parentNode;
        if (parent == null) return null;
        switch (current.sector) {
            case NorthWest:
                QuadNode neighbour = getNorthNeighbour(parent);
                return neighbour == null ? null : neighbour.se;
            case NorthEast:
                neighbour = getNorthEastNeighbour(parent);
                return neighbour == null ? null : neighbour.sw;
            case SouthWest:
                return parent.ne;
            case SouthEast:
                neighbour = getEastNeighbour(parent);
                return neighbour == null ? null : neighbour.nw;
            default:
                throw new Error("Internal error");
        }
    }

    static QuadNode getNorthWestNeighbour(QuadNode current) {
        QuadNode parent = current.parentNode;
        if (parent == null) return null;
        switch (current.sector) {
            case NorthWest: // 1
                QuadNode neighbour = getNorthWestNeighbour(parent);
                return neighbour == null ? null : neighbour.se;
            case NorthEast: // 2
                neighbour = getNorthNeighbour(parent);
                return neighbour == null ? null : neighbour.sw;
            case SouthWest: // 3
                neighbour = getWestNeighbour(parent);
                return neighbour == null ? null : neighbour.ne;
            case SouthEast: // 4
                return parent.nw;
            default:
                throw new Error("Internal error");
        }
    }

    static QuadNode getNorthNeighbour(QuadNode current) {
        QuadNode parent = current.parentNode;
        if (parent == null) return null;
        switch (current.sector) {
            case NorthWest: // 1
                QuadNode neighbour = getNorthNeighbour(parent);
                return neighbour == null ? null : neighbour.sw;
            case NorthEast: // 2
                neighbour = getNorthNeighbour(parent);
                return neighbour == null ? null : neighbour.se;
            case SouthWest: // 3
                return parent.nw;
            case SouthEast: // 4
                return parent.ne;
            default:
                throw new Error("Internal error");
        }
    }

    static QuadNode getSouthEastNeighbour(QuadNode current) {
        QuadNode parent = current.parentNode;
        if (parent == null) return null;
        switch (current.sector) {
            case NorthWest:
                return parent.se;
            case NorthEast:
                QuadNode neighbour = getEastNeighbour(parent);
                return neighbour == null ? null : neighbour.sw;
            case SouthWest:
                neighbour = getSouthNeighbour(parent);
                return neighbour == null ? null : neighbour.ne;
            case SouthEast:
                neighbour = getSouthEastNeighbour(parent);
                return neighbour == null ? null : neighbour.nw;
            default:
                throw new Error("Internal error");
        }
    }

    static QuadNode getSouthWestNeighbour(QuadNode current) {
        QuadNode parent = current.parentNode;
        if (parent == null) return null;
        switch (current.sector) {
            case NorthWest: // 1
                QuadNode neighbour = getWestNeighbour(parent);
                return neighbour == null ? null : neighbour.se;
            case NorthEast: // 2
                return parent.sw;
            case SouthWest: // 3
                neighbour = getSouthWestNeighbour(parent);
                return neighbour == null ? null : neighbour.ne;
            case SouthEast: // 4
                neighbour = getSouthNeighbour(parent);
                return neighbour == null ? null : neighbour.nw;
            default:
                throw new Error("Internal error");
        }
    }

    static QuadNode getSouthNeighbour(QuadNode current) {
        QuadNode parent = current.parentNode;
        if (parent == null) return null;
        switch (current.sector) {
            case NorthWest: // 1
                return parent.sw;
            case NorthEast: // 2
                return parent.se;
            case SouthWest: // 3
                QuadNode neighbour = getSouthNeighbour(parent);
                return neighbour == null ? null : neighbour.nw;
            case SouthEast: // 4
                neighbour = getSouthNeighbour(parent);
                return neighbour == null ? null : neighbour.ne;
            default:
                throw new Error("Internal error");
        }
    }

    static QuadNode getEastNeighbour(QuadNode current) {
        QuadNode parent = current.parentNode;
        if (parent == null) return null;
        switch (current.sector) {
            case NorthWest: // 1
                return parent.ne;
            case NorthEast: // 2
                QuadNode neighbour = getEastNeighbour(parent);
                return neighbour == null ? null : neighbour.nw;
            case SouthWest: // 3
                return parent.se;
            case SouthEast: // 4
                neighbour = getEastNeighbour(parent);
                return neighbour == null ? null : neighbour.sw;
            default:
                throw new Error("Internal error");
        }
    }

    static QuadNode getWestNeighbour(QuadNode current) {
        QuadNode parent = current.parentNode;
        if (parent == null) return null;
        switch (current.sector) {
            case NorthWest: // 1
                QuadNode neighbour = getWestNeighbour(parent);
                return neighbour == null ? null : neighbour.ne;
            case NorthEast: // 2
                return parent.nw;
            case SouthWest: // 3
                neighbour = getWestNeighbour(parent);
                return neighbour == null ? null : neighbour.se;
            case SouthEast: // 4
                return parent.sw;
            default:
                throw new Error("Internal error");
        }
    }

    //
    QuadNode add(Dendrogram dendrogram) {
        // if (point.id==50) debugger;
        QuadNode node = this.root;
        while (node != null) {
            if (dendrogram.x >= node.xmin && dendrogram.x < node.xmax
                    && dendrogram.y >= node.ymin && dendrogram.y < node.ymax) {
                // we're in
                return node.addPoint(dendrogram);
            } else {
                if (node.sector != QuadSector.Root) {
                    throw new Error("Quatree.add: Unexpected error. We should only expand the root");
                }
                // we're out
                boolean pointIsWest = dendrogram.x < node.xmin;
                boolean pointIsNorth = dendrogram.y < node.ymin;
                QuadSector newSector = QuadNode.getSector(!pointIsWest, !pointIsNorth);
                double xmin = pointIsWest ? node.xmin - node.size : node.xmin;
                double ymin = pointIsNorth ? node.ymin - node.size : node.ymin;

                this.root = new QuadNode(
                        this,
                        null,
                        QuadSector.Root,
                        xmin,
                        ymin,
                        node.size * 2);
                if (!node.isEmpty()) {
                    this.root.attachChildNode(newSector, node);
                }
                node = this.root;
            }
        }
        throw new Error("Quatree.add: Unexpected error. Did not find a new node to insert to.");
    }

    double getNodeSize() {
        return this.nodeSize;
    }

    //
//}
//
    void log(LogLevel level) {
        QuadNode.logQuadNode(level, "", this.root);
    }
}