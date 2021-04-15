import { ClassicAlgorithm } from './ClassicAlgorithm';
import { NewAlgorithm } from './NewAlgorithm';
import { Cluster, Dendrogram, getPoints } from './Cluster';
import { getHull } from './GrahamScan';
import { IAlgorithm } from './IAlgorithm';
import { Point } from './Point';
import { Points } from './Points';

export class App {
    canvas!: HTMLCanvasElement;
    ctx!: CanvasRenderingContext2D;
    points: Points;
    canvasWidth: number;
    canvasHeight: number;
    palette: string[] = [];
    clusterCount = 50;
    dendrogramCount = 6;
    dotSize = 3;
    nbPointPerCluster = 5;
    clusterSize = 0.05;

    constructor() {
        this.points = new Points();

        for (let i = 0; i < this.clusterCount; i++) {
            let point0 = Point.randomPoint();
            this.points.addRandomPointsAround(this.nbPointPerCluster, point0, this.clusterSize);
        }
        this.canvasWidth = 1024;
        this.canvasHeight = 1024;

        for (let r of ['00', 'c0'])
            for (let g of ['00', 'c0'])
                for (let b of ['00', 'c0']) {
                    let color = '#' + r + g + b;
                    if (color != '#000000' && color != '#c0c0c0') this.palette.push(color);
                }

    }

    run() {
        this.canvas = document.getElementById("canvas1") as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d")!!;

        this.onDisplayPoints(this.points.points);
        let algorithm: IAlgorithm = new NewAlgorithm();

        algorithm.run(this.points.points, this.dendrogramCount, (points) => this.onDisplayPoints(points), (dendogram) => this.onFinished(dendogram))
    }

    onDisplayPoints(dendrograms: Dendrogram[]) {
        this.displayDendrograms(dendrograms);
    }

    onFinished(dendograms: Dendrogram[]) {
        console.log("finally", dendograms);
        this.displayDendrograms(dendograms);
    }

    displayDendrograms(dendrograms: Dendrogram[]) {
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        for (let i = 0; i < dendrograms.length; i++) {
            let color = this.palette[dendrograms.length <= this.palette.length ? i : this.palette.length - 1];

            let points = getPoints(dendrograms[i])
            let hull = getHull(points);
            this.displayHull(hull, color);
            this.displayDendrogram(undefined, dendrograms[i], color);
        }
    }

    displayDendrogram(parent: Cluster | undefined, dendrogram: Dendrogram, color: string) {
        let x = dendrogram.x * this.canvasWidth;
        let y = dendrogram.y * this.canvasHeight;

        if ('count' in dendrogram) {
            for (let innerPoint of dendrogram.dendrograms) {
                this.displayDendrogram(dendrogram, innerPoint, color);
            }
        } else {
            this.ctx.fillStyle = color; // Red color
            this.ctx.beginPath(); //Start path
            this.ctx.arc(x, y, this.dotSize, 0, Math.PI * 2, true); // Draw a point using the arc function of the canvas with a point structure.
            this.ctx.fill(); // Close the path and fill.                
        }
        if (parent != null) {
            let x0 = parent.x * this.canvasWidth;
            let y0 = parent.y * this.canvasHeight;
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
            let x = innerPoint.x * this.canvasWidth;
            let y = innerPoint.y * this.canvasHeight;
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

var app = new App();
setTimeout(() => app.run(), 0);
