package com.ganaye.pascal.utils;

import java.util.ArrayList;
import java.util.List;

import static com.ganaye.pascal.utils.Random.random;
import static com.ganaye.pascal.utils.Random.randomize;
import static com.ganaye.pascal.utils.DoubleUtils.oneDec;

public class SampleData {
    public static List<Point> createPoints(int nbPoints) {
        return createPoints(nbPoints, 100_000);
    }

    public static List<Point> createPoints(int nbPoints, double areaSize) {
        return createPoints(nbPoints, areaSize, 30052007);
    }

    public static List<Point> createPoints(int nbPoints, double areaSize, int seed) {
        randomize(seed);
        Point.resetPointIdCounter();
        if (areaSize == 0) areaSize = 100_000;
        List<Point> points = new ArrayList<>(nbPoints);
        for (int pointId = 0; pointId < nbPoints; pointId++) {
            points.add(new Point(
                    oneDec(random() * areaSize),
                    oneDec(random() * areaSize)));
        }
        return points;
    }

}
