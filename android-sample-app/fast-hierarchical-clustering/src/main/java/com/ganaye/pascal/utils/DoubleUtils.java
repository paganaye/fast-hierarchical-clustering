package com.ganaye.pascal.utils;

public class DoubleUtils {
    public static double oneDec(double value) {
        return Math.round(value * 10.0) / 10.0;
    }

    public static double twoDec(double value) {
        return Math.round(value * 100.0) / 100.0;
    }

    public static double threeDec(double value) {
        return Math.round(value * 1000.0) / 1000.0;
    }

}