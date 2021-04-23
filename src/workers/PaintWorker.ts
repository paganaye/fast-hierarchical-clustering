import { Point } from '../Point';
import { Cluster, Dendrogram, getPoints } from '../Cluster';
import { start } from 'repl';

var running = false;
export interface IPaintWorkerArgs {
    important: boolean;
    dendrograms: Dendrogram[];
    width: number,
    height: number;
    wantedClusters: number;
}


function paint(args: IPaintWorkerArgs) {
    let dotSize = Math.max(1, 3 - args.dendrograms.length / 1000);
    let canvas = new OffscreenCanvas(args.width, args.height);
    let ctx = canvas.getContext("2d")!;

    try {
        displayDendrograms();
    } finally {
        running = false;
    }

    function getColor(colorNo: number, colorCount: number) {
        return hsv2rgb(colorNo * 360 / colorCount, 1, 1);
    }

    // input: h in [0,360] and s,v in [0,1] - output: r,g,b in [0,1]
    function hsv2rgb(h: number, s: number, v: number) {
        let f = (n: number, k = (n + h / 60) % 6) => 255 * (v - v * s * Math.max(Math.min(k, 4 - k, 1), 0));
        return `rgb(${f(5)},${f(3)},${f(1)})`;
    }

    function postImage() {
        let imageData = ctx.getImageData(0, 0, args.width, args.height);
        postMessage({ imageData }, undefined as any);
    }

    function displayDendrograms() {
        let dendrograms = args.dendrograms;
        ctx.clearRect(0, 0, args.width, args.height);
        dendrograms.sort((a, b) => (a.y - b.y) || (a.x - b.x))
        displayDendrogramsPart(0)
    }

    function displayDendrogramsPart(i: number) {
        let startTime = new Date().getTime();
        let dendrograms = args.dendrograms;
        while (i < dendrograms.length && new Date().getTime() - startTime < 100) {
            let color = getColor(i, args.wantedClusters);
            let points = getPoints(dendrograms[i])
            displayDendrogram(undefined, dendrograms[i], color);
            i += 1;
        }
        if (args != lastArgs) {
            i = 0;
        }
        else if (i < dendrograms.length) {
            setTimeout(() => displayDendrogramsPart(i));
        } else {
            postImage();
        }
    }


    function displayDendrogram(parent: Cluster | undefined, dendrogram: Dendrogram, color: string) {
        let x = dendrogram.x * args.width;
        let y = dendrogram.y * args.height;

        if ('count' in dendrogram) {
            displayDendrogram(dendrogram, dendrogram.dendrogram1, color);
            displayDendrogram(dendrogram, dendrogram.dendrogram2, color);
        } else {
            ctx.fillStyle = color; // Red color
            ctx.beginPath(); //Start path
            ctx.arc(x, y, dotSize, 0, Math.PI * 2, true); // Draw a point using the arc function of the canvas with a point structure.
            ctx.fill(); // Close the path and fill.
        }
        if (parent != null) {
            let x0 = parent.x * args.width;
            let y0 = parent.y * args.height;
            ctx.beginPath(); //Start path
            ctx.strokeStyle = color;
            ctx.moveTo(x0, y0);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    }
}

let lastArgs: IPaintWorkerArgs | undefined;

onmessage = (e) => {
    let args = e.data as IPaintWorkerArgs;

    if (args.important || !running) {
        lastArgs = args;
        running = true;
        setTimeout(() => {
            if (args === lastArgs || args.important) {
                paint(args)
            } // otherwise we ignore.
        });
    }
}