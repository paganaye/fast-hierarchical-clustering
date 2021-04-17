import { Cluster, Dendrogram, getPoints } from './Cluster';
import { clearCalculatedDistances, calculatedDistances, IPoint } from './IPoint';
import { App } from './Main';
import { Pair } from './avg/Pair';
import { Point } from './Point';
import { QuadPair } from './avg/QuadTree';
import { IAlgorithm } from './workers/IAlgorithm';
import { IPaintWorkerArgs } from './workers/PaintWorker';

export class AlgorithmRunner {
    canvas!: HTMLCanvasElement;
    ctx!: CanvasRenderingContext2D;
    algorithmConstructor!: () => IAlgorithm;
    outputElt!: HTMLElement;
    runButton!: HTMLButtonElement;
    initialPointsCount!: number;
    startTime!: number;
    runCounter: number = 0;
    algorithmWorker: Worker = new Worker('./src/workers/AlgorithmWorker.js', { type: "module" });
    paintWorker: Worker = new Worker('./src/workers/PaintWorker.js', { type: "module" });
    currentDendrograms: Dendrogram[] = [];

    constructor(private app: App,
        canvasId: string,
        outputId: string,
        runButtonId: string) {

        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.outputElt = document.getElementById(outputId) as HTMLElement;
        this.runButton = document.getElementById(runButtonId) as HTMLButtonElement;
        this.ctx = this.canvas.getContext("2d")!!;

        this.paintWorker.onmessage = (e) => {
            let imageData: ImageData = e.data.imageData;
            this.ctx.putImageData(imageData, 0, 0);
        }
        // setTimeout(() => this.onCanvasSizeChanged());

        this.runButton.onclick = () => {
            this.run();
        }
    }

    init() {
        this.runCounter += 1;
        this.canvas.setAttribute("width", this.app.canvasSize + "px")
        this.canvas.setAttribute("height", this.app.canvasSize + "px")
        this.runButton.disabled = false;
        this.outputElt.innerText = "";

    }

    run() {
        //     this.runCounter += 1;
        //     console.log("starting...")
        //     this.outputElt.innerText = "...";
        //     this.runButton.disabled = true;
        //     this.initialPointsCount = this.app.points.length;

        //     clearCalculatedDistances();
        //     this.startTime = new Date().getTime();
        //     this.algorithm = this.algorithmConstructor();
        //     this.algorithm.init(this.app.points);
        //     this.runBatch(this.runCounter);
    }

    onPointsChanged(points: IPoint[]) {
        console.log("we got new points", points)
        this.currentDendrograms = points as Point[];
        this.algorithmWorker.terminate()
        this.repaint();
    }
    repaint() {
        let width = this.app.canvasSize;
        let height = this.app.canvasSize;
        if (width && height) {
            this.canvas.width = width;
            this.canvas.height = height;
            let args: IPaintWorkerArgs = {
                width: width, height: height, dendrograms: this.currentDendrograms, wantedClusters: this.app.wantedClusters
            }
            this.paintWorker.postMessage(args);
        }
    }

    onAlgorithmArgsChanged() {
        //        throw new Error('Method not implemented.');
        this.algorithmWorker.terminate()
    }

    onCanvasSizeChanged() {
        // throw new Error('Method not implemented.');
        this.repaint();
    }

    // runBatch(runCounter: number) {
    //     let pair: Pair | undefined;
    //     let dendogramsCount!: number;
    //     let batchEndTime = new Date().getTime() + 500;

    //     while (new Date().getTime() < batchEndTime) {
    //         pair = this.algorithm.findNearestTwoPoints();
    //         if (pair) {
    //             pair.merge();
    //         }
    //         dendogramsCount = this.algorithm.getDendrogramsCount();
    //         if (!pair || dendogramsCount <= this.app.wantedClusters) break;
    //     }
    //     if (runCounter != this.runCounter) {
    //         this.outputElt.innerText = "Canceled";
    //         this.runButton.disabled = false;
    //     }
    //     else if (pair && dendogramsCount > this.app.wantedClusters) {
    //         // dendogramsCount == this.initialPointsCount => 0%
    //         // dendogramsCount == this.app.wantedClusters ==> 100%
    //         let expected
    //         let progress = (this.initialPointsCount + this.app.wantedClusters - dendogramsCount) / this.initialPointsCount;
    //         this.outputElt.innerText = Math.round(100 * progress) + "%";
    //         setTimeout(() => this.runBatch(runCounter), 0);
    //     } else {
    //         var timeDiff = new Date().getTime() - this.startTime; //in ms
    //         this.runButton.disabled = false;
    //         let dendograms = this.algorithm.getCurrentDendrograms();
    //         this.displayDendrograms(dendograms);
    //         // strip the ms
    //         this.outputElt.innerText = `${(timeDiff / 1000).toFixed(2)} sec`
    //         console.log("done in ${timeDiff}ms (${Math.round(calculatedDistances / 1000000).toFixed(1)}M distances compared)")
    //     }

    // }


}