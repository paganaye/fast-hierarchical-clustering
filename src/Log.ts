import { twoDec } from "./Utils";

export enum LogLevel {
    None = 0,
    Error = 1,
    Important = 2,
    Detail = 3,
    Verbose = 4
}

export class Log {
    static setLogLevel(value: LogLevel) {
        Log.level = value;
    }

    static measure(level: LogLevel, arg0: string, action: () => void) {
        if (this.willLog(level)) {
            let start = new Date().getTime()
            action();
            Log.writeLine(level, arg0, twoDec((new Date().getTime() - start) / 1000.0), "sec");
        } else {
            action();
        }
    }

    private static level: LogLevel = LogLevel.Important;

    public static writeLine(level: LogLevel, message?: any, ...args: any) {
        if (this.willLog(level))
            console.log(message, ...args)
    }

    static willLog(level: LogLevel): boolean {
        return level <= Log.level;
    }

}

