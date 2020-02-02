export enum LogLevel {
    None = 0,
    Important = 1,
    Detail = 2,
    Verbose = 3
}

export class Log {
    static setLogLevel(value: LogLevel) {
        Log.level = value;
    }
    
    static measure(level: LogLevel, arg0: string, action: () => void) {
        if (this.willLog(level)) {
            var start = process.hrtime()[1];
            console.time(arg0)
            action();
            console.timeEnd(arg0)
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

