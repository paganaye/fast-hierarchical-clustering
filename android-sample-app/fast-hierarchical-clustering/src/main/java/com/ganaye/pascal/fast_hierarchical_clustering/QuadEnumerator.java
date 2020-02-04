package com.ganaye.pascal.fast_hierarchical_clustering;

import java.util.ArrayList;
import java.util.Iterator;

//import { QuadTree } from "./QuadTree";
//import { QuadNode, QuadSector } from "./QuadNode";
//import { Enumerable } from "./Enumerable";
//
public class QuadEnumerator implements Iterator<QuadNode> {
    private final QuadTree quadTree;
    private final ArrayList<QuadNode> currentPath = new ArrayList<>();
    private QuadNode next;

    QuadEnumerator(QuadTree quadTree) {
        this.quadTree = quadTree;
        this.next = getNorthWesterest(quadTree.root);
    }

    @Override
    public boolean hasNext() {
        return next != null;
    }

    private QuadNode getNorthWesterest(QuadNode current) {
        while (current != null) {
            this.currentPath.add(current);
            QuadNode nextNode = current.northWest;
            if (nextNode == null) nextNode = current.northEast;
            if (nextNode == null) nextNode = current.southWest;
            if (nextNode == null) nextNode = current.southEast;

            if (nextNode == null) return current;
            else current = nextNode;
        }
        return null;
    }

    @Override
    public QuadNode next() {
        QuadNode result = this.next;
        if (result != null) {
            this.next = prepareNext();
        }
        return result;
    }

    private QuadNode prepareNext() {

        while (true) {
            QuadNode previous;
            if (this.currentPath.size() == 0) previous = null;
            else {
                previous = this.currentPath.get(this.currentPath.size() - 1);
                this.currentPath.remove(this.currentPath.size() - 1);
            }
            if (previous == null || this.currentPath.size() == 0) return null;
            QuadNode current = this.currentPath.get(this.currentPath.size() - 1);
            QuadNode next = null;
            switch (previous.sector) {
                case NorthWest:
                    next = current.northEast;
                    if (next == null) next = current.southWest;
                    if (next == null) next = current.southEast;
                    break;
                case NorthEast:
                    next = current.southWest;
                    if (next == null) next = current.southEast;
                    break;
                case SouthWest:
                    next = current.southEast;
                    break;
                default:
                    next = null;
                    break;
            }
            if (next != null) {
                return this.getNorthWesterest(next);
            }
        }
    }


}
//
