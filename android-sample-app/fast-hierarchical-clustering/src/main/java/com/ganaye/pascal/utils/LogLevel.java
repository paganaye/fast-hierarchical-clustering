package com.ganaye.pascal.utils;


public enum LogLevel {
    None(0),
    Important(1),
    Detail(2),
    Verbose(3);
    public final int value;

    LogLevel(int value) {
        this.value = value;
    }
}
