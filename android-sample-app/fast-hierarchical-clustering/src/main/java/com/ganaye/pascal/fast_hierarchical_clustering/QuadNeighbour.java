package com.ganaye.pascal.fast_hierarchical_clustering;


import static com.ganaye.pascal.utils.DoubleUtils.twoDec;

public class QuadNeighbour {
    public NewCluster cluster1;
    public NewCluster cluster2;
    public double distance;

    public QuadNeighbour(NewCluster cluster1, NewCluster cluster2, double distance) {
        if (cluster1.id <= cluster2.id) {
            this.cluster1 = cluster1;
            this.cluster2 = cluster2;
        } else {
            this.cluster1 = cluster2;
            this.cluster2 = cluster1;
        }
        this.distance = distance;
    }

    @Override
    public String toString() {
        return cluster1.id + "..." + cluster2.id + " " + twoDec(distance);
    }
}
