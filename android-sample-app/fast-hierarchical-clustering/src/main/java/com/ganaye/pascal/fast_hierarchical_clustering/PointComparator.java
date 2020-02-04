package com.ganaye.pascal.fast_hierarchical_clustering;

import com.ganaye.pascal.classic_hierarchical_clustering.Dendrogram;

import java.util.Comparator;

public class PointComparator implements Comparator<Dendrogram> {
    public final static PointComparator instance = new PointComparator();

    @Override
    public int compare(Dendrogram p1, Dendrogram p2) {
        int res = (p1.id - p2.id);
        return res;
    }

}
