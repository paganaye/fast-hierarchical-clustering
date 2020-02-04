package com.ganaye.pascal.fast_hierarchical_clustering;

import java.util.Comparator;

public class NeighbourComparator implements Comparator<Neighbour> {
    public final static NeighbourComparator instance = new NeighbourComparator(true);
    public final static NeighbourComparator instanceDesc = new NeighbourComparator(false);
    private final boolean ascending;

    public NeighbourComparator(boolean ascending) {
        this.ascending = ascending;
    }


    @Override
    public int compare(Neighbour n1, Neighbour n2) {
        return ascending ? cmp(n1, n2) : cmp(n2, n1);
    }

    private int cmp(Neighbour n1, Neighbour n2) {
        double dres = (n1.distance - n2.distance);
        if (dres > 0) return 1;
        else if (dres < 0) return -1;

        int ires = (n1.pt1.id - n2.pt1.id);
        if (ires != 0) return ires;
        ires = (n1.pt2.id - n2.pt2.id);
        return ires;
    }

}