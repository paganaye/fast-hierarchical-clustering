class MessageQueue {

    static readonly queue: (() => void)[] = [];
    static readonly queuedMessageName = "queued-message";

    static push(func: () => void) {
        MessageQueue.queue.push(func);
        window.postMessage(MessageQueue.queuedMessageName, "*");
    }

    static handleMessage(event: MessageEvent) {
        if (event.source == window && event.data == MessageQueue.queuedMessageName) {
            event.stopPropagation();
            var func = MessageQueue.queue.shift();
            if (func) func();
        }
    }
}

window.addEventListener("message", MessageQueue.handleMessage, true);
