package com.ganaye.pascal.fast_hierarchical_clustering;

//import { QuadNode, QuadSector, printQuadNode as logQuadNode } from "./QuadNode";
//import { Point } from "./Point";
//import { LogLevel } from "./Log";
//

import com.ganaye.pascal.utils.LogLevel;

public class QuadTree {
    QuadNode root;
    double nodeSize;

    //
    QuadTree(double nodeSize) {
        // we could lower the node size as we go along
        this.nodeSize = nodeSize;

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
                return neighbour == null ? null : neighbour.southEast;
            case NorthEast:
                neighbour = getNorthEastNeighbour(parent);
                return neighbour == null ? null : neighbour.southWest;
            case SouthWest:
                return parent.northEast;
            case SouthEast:
                neighbour = getEastNeighbour(parent);
                return neighbour == null ? null : neighbour.northWest;
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
                return neighbour == null ? null : neighbour.southEast;
            case NorthEast: // 2
                neighbour = getNorthNeighbour(parent);
                return neighbour == null ? null : neighbour.southWest;
            case SouthWest: // 3
                neighbour = getWestNeighbour(parent);
                return neighbour == null ? null : neighbour.northEast;
            case SouthEast: // 4
                return parent.northWest;
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
                return neighbour == null ? null : neighbour.southWest;
            case NorthEast: // 2
                neighbour = getNorthNeighbour(parent);
                return neighbour == null ? null : neighbour.southEast;
            case SouthWest: // 3
                return parent.northWest;
            case SouthEast: // 4
                return parent.northEast;
            default:
                throw new Error("Internal error");
        }
    }

    static QuadNode getSouthEastNeighbour(QuadNode current) {
        QuadNode parent = current.parentNode;
        if (parent == null) return null;
        switch (current.sector) {
            case NorthWest:
                return parent.southEast;
            case NorthEast:
                QuadNode neighbour = getEastNeighbour(parent);
                return neighbour == null ? null : neighbour.southWest;
            case SouthWest:
                neighbour = getSouthNeighbour(parent);
                return neighbour == null ? null : neighbour.northEast;
            case SouthEast:
                neighbour = getSouthEastNeighbour(parent);
                return neighbour == null ? null : neighbour.northWest;
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
                return neighbour == null ? null : neighbour.southEast;
            case NorthEast: // 2
                return parent.southWest;
            case SouthWest: // 3
                neighbour = getSouthWestNeighbour(parent);
                return neighbour == null ? null : neighbour.northEast;
            case SouthEast: // 4
                neighbour = getSouthNeighbour(parent);
                return neighbour == null ? null : neighbour.northWest;
            default:
                throw new Error("Internal error");
        }
    }

    static QuadNode getSouthNeighbour(QuadNode current) {
        QuadNode parent = current.parentNode;
        if (parent == null) return null;
        switch (current.sector) {
            case NorthWest: // 1
                return parent.southWest;
            case NorthEast: // 2
                return parent.southEast;
            case SouthWest: // 3
                QuadNode neighbour = getSouthNeighbour(parent);
                return neighbour == null ? null : neighbour.northWest;
            case SouthEast: // 4
                neighbour = getSouthNeighbour(parent);
                return neighbour == null ? null : neighbour.northEast;
            default:
                throw new Error("Internal error");
        }
    }

    static QuadNode getEastNeighbour(QuadNode current) {
        QuadNode parent = current.parentNode;
        if (parent == null) return null;
        switch (current.sector) {
            case NorthWest: // 1
                return parent.northEast;
            case NorthEast: // 2
                QuadNode neighbour = getEastNeighbour(parent);
                return neighbour == null ? null : neighbour.northWest;
            case SouthWest: // 3
                return parent.southEast;
            case SouthEast: // 4
                neighbour = getEastNeighbour(parent);
                return neighbour == null ? null : neighbour.southWest;
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
                return neighbour == null ? null : neighbour.northEast;
            case NorthEast: // 2
                return parent.northWest;
            case SouthWest: // 3
                neighbour = getWestNeighbour(parent);
                return neighbour == null ? null : neighbour.southEast;
            case SouthEast: // 4
                return parent.southWest;
            default:
                throw new Error("Internal error");
        }
    }

    //
    QuadNode add(NewCluster cluster) {
        // if (point.id==50) debugger;
        QuadNode node = this.root;
        while (node != null) {
            if (cluster.x >= node.xmin && cluster.x < node.xmax
                    && cluster.y >= node.ymin && cluster.y < node.ymax) {
                // we're in
                return node.addCluster(cluster);
            } else {
                if (node.sector != QuadSector.Root) {
                    throw new Error("Quatree.add: Unexpected error. We should only expand the root");
                }
                // we're out
                boolean pointIsWest = cluster.x < node.xmin;
                boolean pointIsNorth = cluster.y < node.ymin;
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