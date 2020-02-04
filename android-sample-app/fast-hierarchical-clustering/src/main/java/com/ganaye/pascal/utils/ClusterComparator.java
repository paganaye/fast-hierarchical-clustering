package com.ganaye.pascal.utils;

import java.util.Comparator;

public class ClusterComparator implements Comparator<Cluster> {
    public final static ClusterComparator instance = new ClusterComparator();

    @Override
    public int compare(Cluster p1, Cluster p2) {
        int res = (p1.id - p2.id);
        return res;
    }

}
