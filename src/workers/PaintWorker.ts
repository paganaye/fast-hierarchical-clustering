import { Point } from '../Point';
import { Cluster, Dendrogram, getPoints } from '../Cluster';
import { getHull } from '../GrahamScan';

/*canvas = document.getElementById(canvasId) as HTMLCanvasElement;
outputElt = document.getElementById(outputId) as HTMLElement;
runButton = document.getElementById(runButtonId) as HTMLButtonElement;
ctx = canvas.getContext("2d")!!;
*/

export interface IPaintWorkerArgs {
    dendrograms: Dendrogram[];
    width: number,
    height: number;
    wantedClusters: number;
}

class PaintWorker {
    dotSize: number;
    ctx: OffscreenCanvasRenderingContext2D;
    palette: string[];
    output: any;

    constructor(private args: IPaintWorkerArgs) {
        this.dotSize = Math.max(1, 3 - this.args.dendrograms.length / 1000);
        this.palette = [];
        for (let i = 0; i < this.args.wantedClusters; i++) {
            this.palette.push(this.getColorPalette(i * 16807 % this.args.wantedClusters, this.args.wantedClusters));
        }

        console.log("here");
        let canvas = new OffscreenCanvas(this.args.width, this.args.height);
        this.ctx = canvas.getContext("2d")!;
        this.ctx.fillRect(10, 10, 20, 20);
        this.displayDendrograms(this.args.dendrograms)
        let imageData = this.ctx.getImageData(0, 0, this.args.width, this.args.height);
        this.output = { imageData };
    }
    getColorPalette(colorNo: number, colorCount: number) {
        return this.hsv2rgb(colorNo * 360 / colorCount, 1, 1);
    }

    // input: h in [0,360] and s,v in [0,1] - output: r,g,b in [0,1]
    hsv2rgb(h: number, s: number, v: number) {
        let f = (n: number, k = (n + h / 60) % 6) => 255 * (v - v * s * Math.max(Math.min(k, 4 - k, 1), 0));
        return `rgb(${f(5)},${f(3)},${f(1)})`;
    }



    displayDendrograms(dendrograms: Dendrogram[]) {

        this.ctx.clearRect(0, 0, this.args.width, this.args.height);
        dendrograms.sort((a, b) => (a.y - b.y) || (a.x - b.x))

        let batchEndTime = new Date().getTime() + 100;

        for (let i = 0; i < dendrograms.length; i++) {
            let color = this.palette[dendrograms.length <= this.palette.length ? i : this.palette.length - 1];
            let points = getPoints(dendrograms[i])
            let hull = getHull(points);
            this.displayHull(hull, color);
            this.displayDendrogram(undefined, dendrograms[i], color);
        }
    }


    displayDendrogram(parent: Cluster | undefined, dendrogram: Dendrogram, color: string) {
        let x = dendrogram.x * this.args.width;
        let y = dendrogram.y * this.args.height;

        if ('count' in dendrogram) {
            this.displayDendrogram(dendrogram, dendrogram.dendrogram1, color);
            this.displayDendrogram(dendrogram, dendrogram.dendrogram2, color);
        } else {
            this.ctx.fillStyle = color; // Red color
            this.ctx.beginPath(); //Start path
            this.ctx.arc(x, y, this.dotSize, 0, Math.PI * 2, true); // Draw a point using the arc function of the canvas with a point structure.
            this.ctx.fill(); // Close the path and fill.
        }
        if (parent != null) {
            let x0 = parent.x * this.args.width;
            let y0 = parent.y * this.args.height;
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
            let x = innerPoint.x * this.args.width;
            let y = innerPoint.y * this.args.height;
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

onmessage = (e) => {

    let paintWorker = new PaintWorker(e.data as IPaintWorkerArgs)
    postMessage(paintWorker.output, undefined as any);
}