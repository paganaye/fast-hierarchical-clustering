import { calculatedDistances, clearCalculatedDistances, Cluster, Dendrogram, getPoints } from './Cluster';
import { getHull } from './GrahamScan';
import { IAlgorithm, Pair } from './IAlgorithm';
import { App } from './Main';
import { Point } from './Point';
import { QuadPair } from './QuadTree';

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
        let startTime = new Date().getTime();
        clearCalculatedDistances();

        let pair: Pair | undefined;
        let dendogramsCount: number = 0;
        do {
            pair = this.algorithm.findNearestTwoPoints();
            if (pair) {
                pair.merge();
            }
            dendogramsCount = this.algorithm.getDendrogramsCount();
        } while (pair && dendogramsCount > this.app.dendrogramCount);

        let dendograms = this.algorithm.getCurrentDendrograms();
        this.displayDendrograms(dendograms);
        var timeDiff = new Date().getTime() - startTime; //in ms
        // strip the ms
        this.preElt.innerText = `${(timeDiff / 1000).toFixed(2)} sec (${Math.round(calculatedDistances / 1000000).toFixed(1)}M distances compared)`
    }


    displayDendrograms(dendrograms: Dendrogram[]) {
        this.ctx.clearRect(0, 0, this.app.canvasWidth, this.app.canvasHeight);
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