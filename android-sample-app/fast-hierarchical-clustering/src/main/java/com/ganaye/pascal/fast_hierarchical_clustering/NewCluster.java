package com.ganaye.pascal.fast_hierarchical_clustering;

import com.ganaye.pascal.utils.Cluster;
import com.ganaye.pascal.utils.Point;

public class NewCluster extends Cluster {
    public QuadNode quadNode;

    public NewCluster(Point point) {
        super(point);
    }

    public NewCluster() {
        super();
    }

    @Override
    public void mergeTwoClusters(Cluster childA, Cluster childB) {
        super.mergeTwoClusters(childA, childB);
    }
}