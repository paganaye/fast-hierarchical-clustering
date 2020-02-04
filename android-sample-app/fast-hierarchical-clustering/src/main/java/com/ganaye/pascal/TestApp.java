package com.ganaye.pascal;

import com.ganaye.pascal.fast_hierarchical_clustering.NewCluster;
import com.ganaye.pascal.utils.Cluster;
import com.ganaye.pascal.utils.Log;
import com.ganaye.pascal.utils.LogLevel;
import com.ganaye.pascal.utils.Point;

import java.util.List;

import static com.ganaye.pascal.classic_hierarchical_clustering.ClassicAlgorithm.buildDendrogramClassic;
import static com.ganaye.pascal.fast_hierarchical_clustering.NewAlgorithm.buildDendrogramNew;
import static com.ganaye.pascal.utils.SampleData.createPoints;

public class TestApp {
    public static void main(String[] args) {
        Log.logLevel = LogLevel.Verbose;
        System.out.println("Hello world");
        runSideBySide(1000, 1000);
//        runClassicAlgorithm(1_000);
//        runNewAlgorithm(1_000);
    }

    static void runClassicAlgorithm(int nbPoints, double areaSize) {
        final List<Point> points = createPoints(nbPoints, areaSize);
        Log.measure(LogLevel.Important, "Classic_Algorithm n=" + nbPoints, new Runnable() {
            @Override
            public void run() {
                Cluster dendroClassic = buildDendrogramClassic(points);
                dendroClassic.logDendrogram(LogLevel.Detail);
            }
        });
    }

    static void runNewAlgorithm(int nbPoints, double areaSize) {
        final List<Point> points = createPoints(nbPoints, areaSize);
        Log.measure(LogLevel.Important, "New_Algorithm n=" + nbPoints, new Runnable() {
            @Override
            public void run() {
                NewCluster dendroNew = buildDendrogramNew(points);
                dendroNew.logDendrogram(LogLevel.Detail);
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