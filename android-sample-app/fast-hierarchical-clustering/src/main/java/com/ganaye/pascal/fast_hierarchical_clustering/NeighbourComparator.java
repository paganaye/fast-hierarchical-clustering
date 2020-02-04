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
        int res = (n1.pt1.id - n2.pt1.id);
        if (res == 0) {
            res = (n1.pt2.id - n2.pt2.id);
        }
        return res;
    }

}
