package com.ganaye.pascal.fast_hierarchical_clustering;

import java.util.Comparator;

public class NeighbourComparator implements Comparator<QuadNeighbour> {
    public final static NeighbourComparator instanceDesc = new NeighbourComparator();

    @Override
    public int compare(QuadNeighbour n1, QuadNeighbour n2) {
        // by descending distance
        double dres = (n2.distance - n1.distance);
        if (dres > 0) return 1;
        else if (dres < 0) return -1;

        int ires = (n2.cluster1.id - n1.cluster1.id);
        if (ires != 0) return ires;

        ires = (n2.cluster2.id - n1.cluster2.id);
        return ires;
    }

}
