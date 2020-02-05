package com.ganaye.pascal.fast_hierarchical_clustering;

import com.ganaye.pascal.utils.Cluster;
import com.ganaye.pascal.utils.Point;

public class QuadCluster extends Cluster {
    public QuadNode quadNode;

    public QuadCluster(Point point) {
        super(point);
    }

    public QuadCluster() {
        super();
    }

}