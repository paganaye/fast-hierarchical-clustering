package com.ganaye.pascal.classic_hierarchical_clustering;

import com.ganaye.pascal.utils.Cluster;

public class NearestNeighbour {
    public Cluster pt1;
    public Cluster pt2;
    public double distance;

    public NearestNeighbour(Cluster pt1, Cluster pt2, double distance) {
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
