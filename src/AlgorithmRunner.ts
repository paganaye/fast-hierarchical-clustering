import { Cluster, Dendrogram, getPoints } from './Cluster';
import { clearCalculatedDistances, calculatedDistances, IPoint } from './IPoint';
import { Point } from './Point';
import { QuadPair } from './new/QuadTree';
import { IAlgorithm } from './workers/IAlgorithm';
import { IPaintWorkerArgs } from './workers/PaintWorker';
import { IAlgorithmWorkerInput, IAlgorithmWorkerOutput } from './workers/AlgorithmWorker'
import { AlgorithmType } from "./workers/AlgorithmType";
import { App } from './App';

export class AlgorithmRunner {
    canvas!: HTMLCanvasElement;
    ctx!: CanvasRenderingContext2D;
    algorithmConstructor!: () => IAlgorithm;
    outputElt!: HTMLElement;
    runButton!: HTMLButtonElement;
    initialPointsCount!: number;
    startTime!: number;
    algorithmWorker: Worker = new Worker('./src/workers/AlgorithmWorker.js', { type: "module" });
    paintWorker: Worker = new Worker('./src/workers/PaintWorker.js', { type: "module" });
    currentDendrograms: Dendrogram[] = [];
    duration: number = 0;
    runStartTime: number = 0;
    nbOriginalPoints: number = 0;

    constructor(private app: App,
        private algorithmType: AlgorithmType,
        canvasId: string,
        outputId: string,
        runButtonId: string,
        private newAlgorithm: boolean) {

        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.outputElt = document.getElementById(outputId) as HTMLElement;
        this.runButton = document.getElementById(runButtonId) as HTMLButtonElement;
        this.ctx = this.canvas.getContext("2d")!!;

        this.displayPoints();
        // setTimeout(() => this.onCanvasSizeChanged());
        this.algorithmWorker.onmessage = (e) => {
            // console.log("algorithmWorker says", e.data);
            let output = e.data as IAlgorithmWorkerOutput;
            if (output.complete) {
                this.duration = (new Date().getTime() - this.runStartTime) / 1000.0;
                this.outputElt.innerText = `Clustered ${this.nbOriginalPoints} points in ${this.duration.toFixed(2)} sec`;
            } else if (output.canceled) {
                this.outputElt.innerText = "Canceled";
            } else {
                this.outputElt.innerText = isNaN(output.progress) ? ""
                : (output.progress * 100).toFixed(2) + "%"
            }
            this.currentDendrograms = output.dendrograms;
            this.repaintCanvas(true);
        }

        this.runButton.onclick = () => {
            this.run();
        }
    }

    displayPoints() {
        this.paintWorker.onmessage = (e) => {
            let imageData: ImageData = e.data.imageData;
            if (this.app.canvasSize != this.canvas.width || this.app.canvasSize != this.canvas.height) {
                this.canvas.width = this.app.canvasSize;
                this.canvas.height = this.app.canvasSize;
            }
            this.ctx.putImageData(imageData, 0, 0);
        }
    }

    init() {
        this.canvas.setAttribute("width", this.app.canvasSize + "px")
        this.canvas.setAttribute("height", this.app.canvasSize + "px")
        this.outputElt.innerText = "";
    }

    run() {
        this.outputElt.innerText = "Starting...";
        let algorithmWorkerArgs: IAlgorithmWorkerInput = {
            points: this.app.points,
            algorithmType: this.algorithmType,
            wantedClusters: this.app.wantedClusters
        }
        this.nbOriginalPoints = this.app.points.length;
        console.log("starting algorithmWorker", algorithmWorkerArgs);
        this.algorithmWorker.postMessage(algorithmWorkerArgs);
        this.runStartTime = new Date().getTime();
    }


    onAlgorithmArgsChanged() {
        this.cancel();
    }

    clearCanvas() {
        this.outputElt.innerText = "";
        let width = this.app.canvasSize;
        let height = this.app.canvasSize;
        let args: IPaintWorkerArgs = {
            important: true,
            width, height,
            dendrograms: [],
            wantedClusters: 0
        }
        this.paintWorker.postMessage(args);
    }

    repaintCanvas(final: boolean) {
        let width = this.app.canvasSize;
        let height = this.app.canvasSize;
        if (width && height) {
            let args: IPaintWorkerArgs = {
                important: final,
                width: width, height: height,
                dendrograms: this.currentDendrograms || this.app.points,
                wantedClusters: this.app.wantedClusters
            }
            this.paintWorker.postMessage(args);
        }
    }

    onCanvasSizeChanged() {
        this.repaintCanvas(true);
    }

    cancel() {
        this.outputElt.innerText = "";
        this.cancelAlgorithm();
    }

    cancelAlgorithm() {
        let algorithmWorkerArgs: IAlgorithmWorkerInput = {
            points: [],
            algorithmType: AlgorithmType.None,
            wantedClusters: 0
        }
        this.algorithmWorker.postMessage(algorithmWorkerArgs);
    }
}