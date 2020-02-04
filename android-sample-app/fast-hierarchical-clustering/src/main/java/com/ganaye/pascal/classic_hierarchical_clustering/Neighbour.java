package com.ganaye.pascal.classic_hierarchical_clustering;

import com.ganaye.pascal.fast_hierarchical_clustering.QuadNode;

public class Neighbour {
    public Dendrogram pt1;
    public Dendrogram pt2;
    public double distance;

    public Neighbour(Dendrogram pt1, Dendrogram pt2, double distance) {
        if (pt1.id <= pt2.id) {
            this.pt1 = pt1;
            this.pt2 = pt2;
        } else {
            this.pt1 = pt2;
            this.pt2 = pt1;
        }
        this.distance = distance;
    }
}
