package com.ganaye.pascal.utils;


import static com.ganaye.pascal.utils.DoubleUtils.twoDec;

public class Cluster<T extends Cluster> {
    public T childOne;
    public T childTwo;
    public T parent;

    public int id;
    public double x;
    public double y;
    public double weight;

    public Cluster() {
        this.id = Point.getNextPointId();
    }


    public Cluster(Point point) {
        this.id = point.id;
        this.x = point.x;
        this.y = point.y;
        this.weight = 1;
    }

    public static double calcDistance(Cluster p1, Cluster p2) {
        double dx = p1.x - p2.x;
        double dy = p1.y - p2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    public void logDendrogram(LogLevel logLevel) {
        if (Log.willLog(logLevel)) {
            logDendrogramBottomUp(logLevel, "", "");
        }
    }

    public void mergeTwoClusters(T childA, T childB) {
        if (ClusterComparator.instance.compare(childA, childB) < 0) {
            this.childOne = childA;
            this.childTwo = childB;
        } else {
            this.childOne = childB;
            this.childTwo = childA;
        }
        weight = childOne.weight + childTwo.weight;
        x = (childOne.x * childOne.weight + childTwo.x * childTwo.weight) / weight;
        y = (childOne.y * childOne.weight + +childTwo.y * childTwo.weight) / weight;
        childOne.parent = this;
        childTwo.parent = this;
        if (Log.willLog(LogLevel.Verbose)) {
            Log.writeLine(LogLevel.Verbose, "merging "
                    + childOne + " with " + childTwo
                    + " distance:" + twoDec(calcDistance(childOne, childTwo))
                    + " => " + this);
        }
    }

    public void logDendrogramBottomUp(LogLevel logLevel, String prefix1, String prefix2) {
        if (!Log.willLog(logLevel)) return;
        if (childOne != null) {
            childOne.logDendrogramBottomUp(logLevel,
                    prefix2 + ",--",
                    prefix2 + "   ");
        }
        if (childTwo != null) {
            childTwo.logDendrogramBottomUp(logLevel,
                    prefix2 + "|--",
                    prefix2 + "|  ");
        }
        Log.writeLine(logLevel, prefix1 + "#" + id
                + " (" + twoDec(x) + ", " + twoDec(y) + ")"
                + (weight > 1 ? " weight " + weight : ""));
    }

    @Override
    public String toString() {
        return "#" + this.id
                + " (" + twoDec(this.x) + ", " + twoDec(this.y) + ")"
                + (this.weight > 1 ? " weight " + this.weight : "");
    }

}