export enum LogLevel {
    None,
    Error,
    Warning,
    Info,
    Debug
}

export class Log {
    static measure(arg0: string, action: () => void) {
        var start = process.hrtime()[1];
        console.time(arg0)
        action();
        console.timeEnd(arg0)
    }
    public static level: LogLevel = LogLevel.Debug;

    public static debug(message?: any, ...args: any) {
        if (Log.level >= LogLevel.Debug)
            console.log(message, ...args)
    }

    public static info(message?: any, ...args: any) {
        if (Log.level >= LogLevel.Info)
            console.info(message, ...args)
    }

    public static warn(message?: any, ...args: any) {
        if (Log.level >= LogLevel.Warning)
            console.warn(message, ...args)
    }

    public static error(message?: any, ...args: any) {
        if (Log.level >= LogLevel.Error)
            console.error(message, ...args)
    }

}

