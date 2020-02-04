package com.ganaye.pascal.utils;

public class Random {
    // This is from stack overflow
    // I want repeatable dummy numbers for tests and debugging.

    static java.util.Random rnd = new java.util.Random();

    public static void randomize() {
        randomize(30_052_007);
    }

    public static void randomize(int seed) {
        rnd.setSeed(seed);
    }

    // Returns double between 0 (inclusive) and 1.0 (exclusive),
    // just like Math.random().
    public static double random() {
        return rnd.nextDouble();
    }
}