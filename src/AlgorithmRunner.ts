import { Cluster, Dendrogram, getPoints } from './Cluster';
import { getHull } from './GrahamScan';
import { IAlgorithm } from './IAlgorithm';
import { clearCalculatedDistances, calculatedDistances } from './IPoint';
import { App } from './Main';
import { Pair } from './avg/Pair';
import { Point } from './Point';
import { QuadPair } from './avg/QuadTree';

export class AlgorithmRunner {
    canvas!: HTMLCanvasElement;
    ctx!: CanvasRenderingContext2D;
    algorithmConstructor!: () => IAlgorithm;
    algorithm!: IAlgorithm;
    outputElt!: HTMLElement;
    runButton!: HTMLButtonElement;
    initialPointsCount!: number;
    startTime!: number;
    runCounter: number = 0;

    constructor(private app: App,
        canvasId: string,
        outputId: string,
        runButtonId: string) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.outputElt = document.getElementById(outputId) as HTMLElement;
        this.runButton = document.getElementById(runButtonId) as HTMLButtonElement;
        this.ctx = this.canvas.getContext("2d")!!;

        this.runButton.onclick = () => {
            this.run();
        }
    }

    init(algorithmConstructor: () => IAlgorithm) {
        this.canvas.setAttribute("width", this.app.canvasSize + "px")
        this.canvas.setAttribute("height", this.app.canvasSize + "px")
        this.algorithmConstructor = algorithmConstructor;
        this.algorithm = algorithmConstructor();
        this.algorithm.init(this.app.points);
        let dendograms = this.algorithm.getCurrentDendrograms();
        this.displayDendrograms(dendograms);
        this.runButton.disabled = false;
        this.outputElt.innerText = "";
    }

    run() {
        this.runCounter += 1;
        console.log("starting...")
        this.outputElt.innerText = "...";
        this.runButton.disabled = true;
        this.initialPointsCount = this.app.points.length;

        clearCalculatedDistances();
        this.startTime = new Date().getTime();
        this.algorithm = this.algorithmConstructor();
        this.algorithm.init(this.app.points);
        this.runBatch(this.runCounter);
    }

    runBatch(runCounter: number) {
        let pair: Pair | undefined;
        let dendogramsCount!: number;
        let batchEndTime = new Date().getTime() + 500;

        while (new Date().getTime() < batchEndTime) {
            pair = this.algorithm.findNearestTwoPoints();
            if (pair) {
                pair.merge();
            }
            dendogramsCount = this.algorithm.getDendrogramsCount();
            if (!pair || dendogramsCount <= this.app.wantedCluters) break;
        }
        if (runCounter != this.runCounter) {
            this.outputElt.innerText = "Canceled";
            this.runButton.disabled = false;
        }
        else if (pair && dendogramsCount > this.app.wantedCluters) {
            // dendogramsCount == this.initialPointsCount => 0%
            // dendogramsCount == this.app.wantedCluters ==> 100%
            let expected
            let progress = (this.initialPointsCount + this.app.wantedCluters - dendogramsCount) / this.initialPointsCount;
            this.outputElt.innerText = Math.round(100 * progress) + "%";
            setTimeout(() => this.runBatch(runCounter), 0);
        } else {
            var timeDiff = new Date().getTime() - this.startTime; //in ms
            this.runButton.disabled = false;
            let dendograms = this.algorithm.getCurrentDendrograms();
            this.displayDendrograms(dendograms);
            // strip the ms
            this.outputElt.innerText = `${(timeDiff / 1000).toFixed(2)} sec (${Math.round(calculatedDistances / 1000000).toFixed(1)}M distances compared)`
            console.log("done...")
        }

    }

    displayDendrograms(dendrograms: Dendrogram[]) {
        this.ctx.clearRect(0, 0, this.app.canvasSize, this.app.canvasSize);
        let sortedDendrograms = dendrograms.slice();
        sortedDendrograms.sort((a, b) => (a.y - b.y) || (a.x - b.x))
        for (let i = 0; i < sortedDendrograms.length; i++) {
            let color = this.app.palette[sortedDendrograms.length <= this.app.palette.length ? i : this.app.palette.length - 1];

            let points = getPoints(sortedDendrograms[i])
            let hull = getHull(points);
            this.displayHull(hull, color);
            this.displayDendrogram(undefined, sortedDendrograms[i], color);
        }
    }

    displayDendrogram(parent: Cluster | undefined, dendrogram: Dendrogram, color: string) {
        let x = dendrogram.x * this.app.canvasSize;
        let y = dendrogram.y * this.app.canvasSize;

        if ('count' in dendrogram) {
            this.displayDendrogram(dendrogram, dendrogram.dendrogram1, color);
            this.displayDendrogram(dendrogram, dendrogram.dendrogram2, color);
        } else {
            this.ctx.fillStyle = color; // Red color
            this.ctx.beginPath(); //Start path
            this.ctx.arc(x, y, this.app.dotSize, 0, Math.PI * 2, true); // Draw a point using the arc function of the canvas with a point structure.
            this.ctx.fill(); // Close the path and fill.                
        }
        if (parent != null) {
            let x0 = parent.x * this.app.canvasSize;
            let y0 = parent.y * this.app.canvasSize;
            this.ctx.beginPath(); //Start path
            this.ctx.strokeStyle = color;
            this.ctx.moveTo(x0, y0);
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
        }
    }

    displayHull(hull: Point[], color: string) {
        this.ctx.fillStyle = color?.replace(")", ",0.3)"); // Red color
        this.ctx.beginPath(); //Start path
        let first = true;
        for (let innerPoint of hull) {
            let x = innerPoint.x * this.app.canvasSize;
            let y = innerPoint.y * this.app.canvasSize;
            if (first) {
                this.ctx.moveTo(x, y);
                first = false;
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        this.ctx.closePath();
        this.ctx.fill();
    }
}