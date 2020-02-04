package com.ganaye.pascal;

import com.ganaye.pascal.classic_hierarchical_clustering.Dendrogram;
import com.ganaye.pascal.classic_hierarchical_clustering.Point;
import com.ganaye.pascal.utils.Log;
import com.ganaye.pascal.utils.LogLevel;

import java.util.List;

import static com.ganaye.pascal.classic_hierarchical_clustering.ClassicAlgorithm.buildDendrogramClassic;
import static com.ganaye.pascal.classic_hierarchical_clustering.Dendrogram.logDendrogram;
import static com.ganaye.pascal.fast_hierarchical_clustering.NewAlgorithm.buildDendrogramNew;
import static com.ganaye.pascal.utils.SampleData.createPoints;

public class TestApp {
    public static void main(String[] args) {
        Log.logLevel = LogLevel.Verbose;
        System.out.println("Hello world");
        runSideBySide(10_000, 1000);
//        runClassicAlgorithm(1_000);
//        runNewAlgorithm(1_000);
    }

    static void runClassicAlgorithm(int nbPoints, double areaSize) {
        final List<Point> points = createPoints(nbPoints, areaSize);
        Log.measure(LogLevel.Important, "Classic_Algorithm n=" + nbPoints, new Runnable() {
            @Override
            public void run() {
                Dendrogram dendroClassic = buildDendrogramClassic(points);
                logDendrogram(LogLevel.Detail, dendroClassic);
            }
        });
    }

    static void runNewAlgorithm(int nbPoints, double areaSize) {
        final List<Point> points = createPoints(nbPoints, areaSize);
        Log.measure(LogLevel.Important, "New_Algorithm n=" + nbPoints, new Runnable() {
            @Override
            public void run() {
                Dendrogram dendroNew = buildDendrogramNew(points);
                logDendrogram(LogLevel.Detail, dendroNew);
            }
        });
    }


    static void runSideBySide(int count, double areaSize) {
        runClassicAlgorithm(count, areaSize);
        runNewAlgorithm(count, areaSize);
    }


//

//Log.writeLine(LogLevel.Important, "Program Complete")
}