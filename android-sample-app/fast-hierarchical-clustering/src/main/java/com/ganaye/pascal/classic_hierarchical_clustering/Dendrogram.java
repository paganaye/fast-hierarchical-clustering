package com.ganaye.pascal.classic_hierarchical_clustering;

import com.ganaye.pascal.fast_hierarchical_clustering.PointComparator;
import com.ganaye.pascal.utils.Log;
import com.ganaye.pascal.utils.LogLevel;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static com.ganaye.pascal.utils.Utils.twoDec;

public class Dendrogram {

    public int id;
    public double x;
    public double y;
    public double weight;
    public Dendrogram mergedTo;
    public ArrayList<Dendrogram> children;

    public Dendrogram(double x, double y) {
        this.id = Point.getNextPointId();
        this.x = x;
        this.y = y;
    }


    public Dendrogram(Point point) {
        this.id = point.id;
        this.x = point.x;
        this.y = point.y;
        this.weight = 1;
    }

    public static Dendrogram mergePoints(ArrayList<Dendrogram> pointsToMerge, ArrayList<Dendrogram> nodes) {
        Dendrogram newPoint = getMergedPoint(pointsToMerge);
        for (Dendrogram dendrogram : pointsToMerge) {
            nodes.remove(dendrogram);
        }
        nodes.add(newPoint);
        return newPoint;
    }

    public static Dendrogram getMergedPoint(ArrayList<Dendrogram> points) {
        double xsum = 0;
        double ysum = 0;
        double wsum = 0;

        Dendrogram result = new Dendrogram(0, 0);
        result.children = points;
        StringBuilder line = new StringBuilder();
        if (Log.willLog(LogLevel.Verbose)) {
            line.append("merging (distance:" + twoDec(calcDistance(points.get(0), points.get(1))) + ")");
        }
        for (Dendrogram dendrogram : points) {
            xsum += dendrogram.x * dendrogram.weight;
            ysum += dendrogram.y * dendrogram.weight;
            wsum += dendrogram.weight;
            dendrogram.mergedTo = result;
            if (Log.willLog(LogLevel.Verbose)) {
                line.append(" " + dendrogram.toString());
            }
        }
        result.x = xsum / wsum;
        result.y = ysum / wsum;
        result.weight = wsum;
        if (Log.willLog(LogLevel.Verbose)) {
            line.append(" => " + result.toString());
            Log.writeLine(LogLevel.Verbose, line.toString());
        }
        return result;
    }

    //
    public static void sortDendrogram(Dendrogram dendrogram) {
        List<Dendrogram> children = dendrogram.children;
        if (children != null) {
            Collections.sort(children, PointComparator.instance);
            for (Dendrogram child : children) {
                sortDendrogram(child);
            }
        }
    }

    public static void logDendrogram(LogLevel logLevel, Dendrogram dendrogram) {
        if (Log.willLog(logLevel)) {
            sortDendrogram(dendrogram);
            logDendrogramBottomUp(logLevel, "", "", dendrogram);
        }
    }

    //
//function logDendrogramTopDown(logLevel: LogLevel, prefix1: string, prefix2: string, dendrogram: Point) {
//    if (!Log.willLog(logLevel)) return;
//    let children = dendrogram.children;
//    Log.writeLine(logLevel, prefix1 + "#" + dendrogram.id + " x:" + twoDec(dendrogram.x) + ", y:" + twoDec(dendrogram.y) + " w:" + dendrogram.weight);
//    if (children) {
//        for (let i = 0; i < children.length; i++) {
//            let child = children[i];
//            logDendrogramTopDown(logLevel,
//                prefix2 + (i == children.length - 1 ? "└─" : "├─"),
//                prefix2 + (i == children.length - 1 ? "  " : "│ "),
//                child);
//        }
//    }
//}
//
    public static void logDendrogramBottomUp(LogLevel logLevel, String prefix1, String prefix2, Dendrogram dendrogram) {
        if (!Log.willLog(logLevel)) return;
        List<Dendrogram> children = dendrogram.children;
        if (children != null) {
            for (int i = 0; i < children.size(); i++) {
                Dendrogram child = children.get(i);
                logDendrogramBottomUp(logLevel,
                        prefix2 + (i == 0 ? ",--" : "|--"),
                        prefix2 + (i == 0 ? "   " : "|  "),
                        child);
            }
        }
        Log.writeLine(logLevel, prefix1 + dendrogram.toString());
    }

    public static double calcDistance(Dendrogram p1, Dendrogram p2) {
        double dx = p1.x - p2.x;
        double dy = p1.y - p2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    public static void logPoints(LogLevel level, String prefix, List<Dendrogram> points) {
        if (points != null && Log.willLog(level)) {
            for (Dendrogram dendrogram : points) {
                Log.writeLine(level, prefix + dendrogram.toString());
            }
        }
    }

    public String toString() {
        return "#" + this.id
                + " (" + twoDec(this.x) + ", " + twoDec(this.y) + ")"
                + (this.weight > 1 ? " weight " + this.weight : "");
    }

}