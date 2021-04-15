import { Cluster, Dendrogram, getPoints } from './Cluster';
import { getHull } from './GrahamScan';
import { IAlgorithm, Pair } from './IAlgorithm';
import { App } from './Main';
import { Point } from './Point';

export class AlgorithmRunner {
    canvas!: HTMLCanvasElement;
    ctx!: CanvasRenderingContext2D;
    algorithm: IAlgorithm;
    preElt!: HTMLPreElement;

    constructor(private app: App,
        canvasName: string,
        outputName: string,
        algorithm: IAlgorithm) {
        this.canvas = document.getElementById(canvasName) as HTMLCanvasElement;
        this.preElt = document.getElementById(outputName) as HTMLCanvasElement;
        this.canvas.setAttribute("width", app.canvasWidth + "px")
        this.canvas.setAttribute("height", app.canvasHeight + "px")
        this.ctx = this.canvas.getContext("2d")!!;
        this.algorithm = algorithm;
        this.algorithm.init(app.points);
    }

    async run() {
        return new Promise<void>((resolve, reject) => {
            let startTime = new Date().getTime();
            this.findNearestPoints(() => {
                var timeDiff = new Date().getTime() - startTime; //in ms
                // strip the ms
                this.preElt.innerText = timeDiff / 1000 + "ms"

                resolve();
            });
        });
    }

    findNearestPoints(resolve: () => void) {
        let pair = this.algorithm.findNearestTwoPoints();
        if (pair) {
            pair.merge();
        }
        let dendograms = this.algorithm.getCurrentDendrograms();
        this.displayDendrograms(dendograms);
        if (pair && dendograms.length > this.app.dendrogramCount) {
            setTimeout(() => this.findNearestPoints(resolve), 0);
        } else {
            resolve()
        }
    }


    displayDendrograms(dendrograms: Dendrogram[]) {
        this.ctx.clearRect(0, 0, this.app.canvasWidth, this.app.canvasHeight);
        for (let i = 0; i < dendrograms.length; i++) {
            let color = this.app.palette[dendrograms.length <= this.app.palette.length ? i : this.app.palette.length - 1];

            let points = getPoints(dendrograms[i])
            let hull = getHull(points);
            this.displayHull(hull, color);
            this.displayDendrogram(undefined, dendrograms[i], color);
        }
    }

    displayDendrogram(parent: Cluster | undefined, dendrogram: Dendrogram, color: string) {
        let x = dendrogram.x * this.app.canvasWidth;
        let y = dendrogram.y * this.app.canvasHeight;

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
            let x0 = parent.x * this.app.canvasWidth;
            let y0 = parent.y * this.app.canvasHeight;
            this.ctx.beginPath(); //Start path
            this.ctx.strokeStyle = color;
            this.ctx.moveTo(x0, y0);
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
        }
    }

    displayHull(hull: Point[], color: string) {
        this.ctx.fillStyle = color + "20"; // Red color
        this.ctx.beginPath(); //Start path
        let first = true;
        for (let innerPoint of hull) {
            let x = innerPoint.x * this.app.canvasWidth;
            let y = innerPoint.y * this.app.canvasHeight;
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