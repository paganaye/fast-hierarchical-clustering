import { Cluster, Dendrogram, getPoints } from './Cluster';
import { clearCalculatedDistances, calculatedDistances, IPoint } from './IPoint';
import { Pair } from './Pair';
import { Point } from './Point';
import { QuadPair } from './new/QuadTree';
import { IAlgorithm } from './workers/IAlgorithm';
import { IPaintWorkerArgs } from './workers/PaintWorker';
import { AlgorithmType, IAlgorithmWorkerInput, IAlgorithmWorkerOutput } from './workers/AlgorithmWorker'
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

    constructor(private app: App,
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
            setTimeout(()=> {
                let output = e.data as IAlgorithmWorkerOutput;
                if (output.complete) {
                    this.duration = (new Date().getTime() - this.runStartTime) / 1000.0;
                    this.outputElt.innerText = "Done in " + this.duration.toFixed(2) + " sec";
                } else if (output.canceled) {
                    this.outputElt.innerText = "";
                } else {
                    this.outputElt.innerText = (output.progress * 100).toFixed(2) + "%"
                }
                this.currentDendrograms = output.dendrograms;
                this.repaint()
            })
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
        this.runButton.disabled = false;
        this.outputElt.innerText = "";
    }

    run() {
        this.outputElt.innerText = "...";
        let algorithmWorkerArgs: IAlgorithmWorkerInput = {
            points: this.app.points,
            algorithmType: this.newAlgorithm ? ((this.app.algorithmType == "faster") ? AlgorithmType.FasterAvg : AlgorithmType.NewAvg)
                : AlgorithmType.ClassicAvg,
            wantedClusters: this.app.wantedClusters
        }
        console.log("starting algorithmWorker", algorithmWorkerArgs);
        this.algorithmWorker.postMessage(algorithmWorkerArgs);
        this.runStartTime = new Date().getTime();
    }


    onPointsChanged() {
        this.currentDendrograms = this.app.points as Point[];
        //this.algorithmWorker.terminate()
        this.cancel();
        this.repaint();
    }

    onAlgorithmArgsChanged() {
        this.cancel();
        this.repaint();
    }

    repaint() {
        let width = this.app.canvasSize;
        let height = this.app.canvasSize;
        if (width && height) {
            let args: IPaintWorkerArgs = {
                width: width, height: height,
                dendrograms: this.currentDendrograms || this.app.points,
                wantedClusters: this.app.wantedClusters
            }
            this.paintWorker.postMessage(args);
        }
    }


    onCanvasSizeChanged() {
        // throw new Error('Method not implemented.');
        this.repaint();
    }

    cancel() {
        this.algorithmWorker.postMessage({
            points: this.app.points,
            linkage: "none",
        });
        this.repaint();
    }
}