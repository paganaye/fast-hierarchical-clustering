import { ClassicAlgorithm } from './ClassicAlgorithm';
import { NewAlgorithm } from './NewAlgorithm';
import { Cluster, Dendrogram, getPoints } from './Cluster';
import { getHull } from './GrahamScan';
import { IAlgorithm } from './IAlgorithm';
import { Point } from './Point';
import { Points } from './Points';
import { AlgorithmRunner } from './AlgorithmRunner';

export class App {
    points: Point[] = [];
    palette: string[] = [];
    clusterCount = 10;
    dotSize = 3;
    nbPointPerCluster = 1;
    clusterSize = 0.05;
    algorithm!: IAlgorithm;
    canvasWidth: number = 300;
    canvasHeight: number = 300;
    dendrogramCount: number = 6;
    classicAlgorithm!: AlgorithmRunner;
    newAlgorithm!: AlgorithmRunner;

    constructor() {
        for (let i = 0; i < this.clusterCount; i++) {
            let point0 = Point.randomPoint();
            Points.addRandomPointsAround(this.points, this.nbPointPerCluster, point0, this.clusterSize);
        }

        for (let r of ['00', 'c0'])
            for (let g of ['00', 'c0'])
                for (let b of ['00', 'c0']) {
                    let color = '#' + r + g + b;
                    if (color != '#000000' && color != '#c0c0c0') this.palette.push(color);
                }
    }

    init() {
        this.classicAlgorithm = new AlgorithmRunner(this, "canvas1", "output1", new ClassicAlgorithm());
        this.newAlgorithm = new AlgorithmRunner(this, "canvas2", "output2", new NewAlgorithm());
    }

    async run() {
        this.init();
        await this.classicAlgorithm.run();
        await this.newAlgorithm.run();
    }

}

var app = new App();
setTimeout(() => app.run(), 0);
