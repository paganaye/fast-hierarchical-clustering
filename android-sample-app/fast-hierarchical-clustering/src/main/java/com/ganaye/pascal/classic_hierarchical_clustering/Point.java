package com.ganaye.pascal.classic_hierarchical_clustering;

public class Point {
    private static int pointIdCounter = 0;
    public final int id;
    public final double x;
    public final double y;

    public Point(double x, double y) {
        this.id = getNextPointId();
        this.x = x;
        this.y = y;
    }

    public static void resetPointIdCounter() {
        pointIdCounter = 0;
    }

    static int getNextPointId() {
        return ++pointIdCounter;
    }

    @Override
    public String toString() {
        return "#" + this.id + " (" + this.x + " " + this.y + ")";
    }

}
