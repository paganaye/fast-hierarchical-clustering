package com.ganaye.pascal;

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
        Log.logLevel = LogLevel.Important;

        // runSideBySide(5_000, 5_000);
        //runNewAlgorithm(500_000, 1000);
        // 1.05 seconds
        guessComplexity();
    }


    static Cluster runClassicAlgorithm(int nbPoints, double areaSize) {
        final Cluster[] result = new Cluster[1];
        final List<Point> points = createPoints(nbPoints, areaSize);
        Log.measure(LogLevel.Important, "Classic_Algorithm n=" + nbPoints, new Runnable() {
            @Override
            public void run() {
                result[0] = buildDendrogramClassic(points);
                result[0].logDendrogram(LogLevel.Detail);

            }
        });
        return result[0];
    }

    static Cluster runNewAlgorithm(int nbPoints, double areaSize) {
        final Cluster[] result = new Cluster[1];
        final List<Point> points = createPoints(nbPoints, areaSize);
        Log.measure(LogLevel.Important, "New_Algorithm n=" + nbPoints, new Runnable() {
            @Override
            public void run() {
                result[0] = buildDendrogramNew(points);
                result[0].logDendrogram(LogLevel.Detail);
            }
        });
        return result[0];
    }


    static void runSideBySide(int count, double areaSize) {
        System.out.println("Started side by side with " + count + " points");
        Cluster classicDendrogram = runClassicAlgorithm(count, areaSize);

        Cluster newDendrogram = runNewAlgorithm(count, areaSize);

        assertClusterEquals(classicDendrogram, newDendrogram);
    }

    private static void guessComplexity() {
        for (int count = 1000; count < 150_000; count += 1000) {
            Cluster newDendrogram = runNewAlgorithm(count, 10_000);
        }
    }

    static void assertClusterEquals(Cluster classicDendrogram, Cluster newDendrogram) {
        if (classicDendrogram == null && newDendrogram == null) return;
        assertEquals(classicDendrogram.id, newDendrogram.id);
        assertEquals(classicDendrogram.x, newDendrogram.x, 0.000001);
        assertEquals(classicDendrogram.y, newDendrogram.y, 0.000001);
        assertEquals(classicDendrogram.weight, newDendrogram.weight, 0.000001);

        assertClusterEquals(classicDendrogram.childOne, newDendrogram.childOne);
        assertClusterEquals(classicDendrogram.childTwo, newDendrogram.childTwo);
    }

    private static void assertEquals(double expected, double actual, double delta) {
        if (Math.abs(expected - actual) > delta)
            throw new Error("expected " + expected + " actual " + actual);
    }

    private static void assertEquals(int expected, int actual) {
        if (expected != actual) throw new Error("expected " + expected + " actual " + actual);
    }

//

//Log.writeLine(LogLevel.Important, "Program Complete")
}