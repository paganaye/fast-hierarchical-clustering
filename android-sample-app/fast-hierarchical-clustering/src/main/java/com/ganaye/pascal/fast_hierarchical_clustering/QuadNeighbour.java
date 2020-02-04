package com.ganaye.pascal.fast_hierarchical_clustering;


import static com.ganaye.pascal.utils.DoubleUtils.twoDec;

public class QuadNeighbour {
    public NewCluster pt1;
    public NewCluster pt2;
    public double distance;

    public QuadNeighbour(NewCluster pt1, NewCluster pt2, double distance) {
        if (pt1.id <= pt2.id) {
            this.pt1 = pt1;
            this.pt2 = pt2;
        } else {
            this.pt1 = pt2;
            this.pt2 = pt1;
        }
        this.distance = distance;
    }

    @Override
    public String toString() {
        return pt1.id + "..." + pt2.id + " " + twoDec(distance);
    }
}
