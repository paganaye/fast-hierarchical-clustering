export class PointsWorker {
}

/*

        this.algorithmConstructor = algorithmConstructor;
        this.algorithm = algorithmConstructor();
        this.algorithm.init(this.app.points);
        switch (this.linkage) {
            case "avg":
                this.classicAlgorithmRunner.init(this.linkage);
                this.newAlgorithmRunner.init();
                break;
        }

*/

onmessage = function (e) {
    console.log('PointsWorker: Message received from main script');
    const result = e.data[0] * e.data[1];
    if (isNaN(result)) {
        postMessage('Please write two numbers', 'worker.ts');
    } else {
        const workerResult = 'Result: ' + result;
        console.log('Worker: Posting message back to main script');
        postMessage(workerResult, undefined as any);
    }
}


