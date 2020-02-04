package com.ganaye.pascal.utils;

import static com.ganaye.pascal.utils.Utils.twoDec;

//
public class Log {
    public static LogLevel logLevel = LogLevel.Important;

    //
    public static boolean willLog(LogLevel level) {
        return level.value <= Log.logLevel.value;
    }

    public static void writeLine(LogLevel level, String line) {
        if (willLog(level)) {
            System.out.println(line);
        }
    }


    public static double measure(LogLevel level, String line, Runnable action) {
        double ellapsed = 0;
        long start = System.nanoTime();
        action.run();
        ellapsed = (System.nanoTime() - start) / 1.e9;
        if (willLog(level)) {
            Log.writeLine(level, line + " " + twoDec(ellapsed) + "sec");
        }
        return ellapsed;
    }
//
}