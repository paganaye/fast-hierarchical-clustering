package com.ganaye.pascal.fast_hierarchical_clustering;

import com.ganaye.pascal.classic_hierarchical_clustering.Dendrogram;

public class Neighbour {
    public Dendrogram pt1;
    public Dendrogram pt2;
    public double distance;
    public QuadNode n1;
    public QuadNode n2;

    public Neighbour(Dendrogram pt1, Dendrogram pt2, double distance, QuadNode n1, QuadNode n2) {
        if (pt1.id <= pt2.id) {
            this.pt1 = pt1;
            this.pt2 = pt2;
            this.n1 = n1;
            this.n2 = n2;
        } else {
            this.pt1 = pt2;
            this.pt2 = pt1;
            this.n1 = n2;
            this.n2 = n1;
        }
        this.distance = distance;
    }
}
