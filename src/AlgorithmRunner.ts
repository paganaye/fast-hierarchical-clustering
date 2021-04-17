import { Cluster, Dendrogram, getPoints } from './Cluster';
import { clearCalculatedDistances, calculatedDistances, IPoint } from './IPoint';
import { Pair } from './avg/Pair';
import { Point } from './Point';
import { QuadPair } from './avg/QuadTree';
import { IAlgorithm } from './workers/IAlgorithm';
import { IPaintWorkerArgs } from './workers/PaintWorker';
import { IAlgorithmWorkerInput, IAlgorithmWorkerOutput } from './workers/AlgorithmWorker'
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

    constructor(private app: App,
        canvasId: string,
        outputId: string,
        runButtonId: string,
        private newAlgorithm: boolean) {

        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.outputElt = document.getElementById(outputId) as HTMLElement;
        this.runButton = document.getElementById(runButtonId) as HTMLButtonElement;
        this.ctx = this.canvas.getContext("2d")!!;

        this.paintWorker.onmessage = (e) => {
            let imageData: ImageData = e.data.imageData;
            if (this.app.canvasSize != this.canvas.width || this.app.canvasSize != this.canvas.height) {
                this.canvas.width = this.app.canvasSize;
                this.canvas.height = this.app.canvasSize;
            }
            this.ctx.putImageData(imageData, 0, 0);
        }
        // setTimeout(() => this.onCanvasSizeChanged());
        this.algorithmWorker.onmessage = (e) => {
            this.currentDendrograms = (e.data as IAlgorithmWorkerOutput).dendrograms;
            this.repaint()
        }

        this.runButton.onclick = () => {
            this.run();
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
            linkage: "avg",
            wantedClusters: this.app.wantedClusters,
            newAlgorithm: this.newAlgorithm
        }
        console.log("starting algorithmWorker");
        this.algorithmWorker.postMessage(algorithmWorkerArgs)
    }

    onPointsChanged() {
        this.currentDendrograms = this.app.points as Point[];
        //this.algorithmWorker.terminate()
        this.repaint();
    }

    repaint() {
        let width = this.app.canvasSize;
        let height = this.app.canvasSize;
        if (width && height) {
            let args: IPaintWorkerArgs = {
                width: width, height: height,
                dendrograms: this.currentDendrograms || [],
                wantedClusters: this.app.wantedClusters
            }
            this.paintWorker.postMessage(args);
        }
    }

    onAlgorithmArgsChanged() {
        //        throw new Error('Method not implemented.');
        //this.algorithmWorker.terminate()
        this.cancel();
    }

    onCanvasSizeChanged() {
        // throw new Error('Method not implemented.');
        this.repaint();
    }


    cancel() {
        let algorithmWorkerArgs: IAlgorithmWorkerInput = {
            points: [],
            linkage: "avg",
            wantedClusters: 1,
            newAlgorithm: this.newAlgorithm
        }
        this.algorithmWorker.postMessage(algorithmWorkerArgs)
    }



}