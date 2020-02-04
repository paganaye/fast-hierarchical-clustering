package com.ganaye.pascal.classic_hierarchical_clustering;

import com.ganaye.pascal.utils.Cluster;

public class NearestNeighbour {
    public Cluster cluster1;
    public Cluster cluster2;
    public double distance;

    public NearestNeighbour(Cluster cluster1, Cluster cluster2, double distance) {
        if (cluster1.id <= cluster2.id) {
            this.cluster1 = cluster1;
            this.cluster2 = cluster2;
        } else {
            this.cluster1 = cluster2;
            this.cluster2 = cluster1;
        }
        this.distance = distance;
    }
}
